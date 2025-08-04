const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth')
const fileModel = require('../models/files.model')
const userModel = require('../models/user.model')
const upload = require('../config/multer.config')
const { bucket } = require('../config/supabase.config');
const {supabase} = require('../config/supabase.config')

router.get('/home', authMiddleware, async (req, res) => {
  const UserFiles = await fileModel.find({ user: req.user.id });

  const filesWithSignedUrls = await Promise.all(
    UserFiles.map(async (file) => {
      const { data, error } = await bucket.createSignedUrl(file.path, 60); // 60 seconds
      return {
        ...file.toObject(), // spread the Mongoose doc into plain object
        signedUrl: data?.signedUrl || null
      };
    })
  );
  const user = await userModel.findOne({
    _id : req.user.id
  })
  // const username = await user.username
  res.render('home', { files: filesWithSignedUrls ,user:user.username});
});

router.post('/upload',authMiddleware, upload.single('file'), async (req, res) => {
  
    const file = req.file;
    const filePath = `uploads/${Date.now()}_${file.originalname}`;
  
    const { data, error } = await bucket.upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    const { data: publicUrl } = bucket.getPublicUrl(filePath);
  
    const newFile = new fileModel({
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: data.path,
      publicUrl: publicUrl.publicUrl,
      user: req.user.id, // from auth middleware
      uploadedAt: new Date()
    });

    await newFile.save();

    res.redirect("/home")
  });

router.get('/download',authMiddleware,async (req,res)=>{
    const loggedInUserID = req.user.id;
    const path = decodeURIComponent(req.query.path);
    const file = await fileModel.findOne({
      user: loggedInUserID,
      path: path
    })

    if(!file){
      return res.status(401).json({
        message : "Unauthorized!"
      })
    }

    const { data, error } = await bucket.createSignedUrl(path, 60);

    if (error) {
      return res.status(500).json({
        message: "Failed to generate signed URL",
        error: error.message
      });
    }

    res.redirect(data.signedUrl);
})

router.post('/logout',(req,res)=>{
  res.clearCookie('token')
  res.redirect('/user/login')
})

// Test route to check file deletion
router.get('/test-delete/:id', authMiddleware, async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await fileModel.findOne({ _id: fileId, user: req.user.id });
    
    if (!file) {
      return res.json({ error: 'File not found or not authorized' });
    }
    
    res.json({
      message: 'File found',
      file: {
        id: file._id,
        name: file.originalName,
        path: file.path,
        user: file.user
      }
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.post('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const fileId = req.params.id;
    console.log('Attempting to delete file:', fileId, 'for user:', req.user.id);

    const file = await fileModel.findOne({ _id: fileId, user: req.user.id });
    if (!file) {
      console.log('File not found or user not authorized');
      return res.status(404).send("File not found");
    }

    console.log('File found:', file.originalName, 'Path:', file.path);

    // 🧹 Remove from Supabase
    const { error: supabaseError } = await bucket.remove([file.path]);
    if (supabaseError) {
      console.error('Supabase delete error:', supabaseError);
      // Continue with MongoDB deletion even if Supabase fails
    } else {
      console.log('File removed from Supabase successfully');
    }

    // 🧹 Remove from MongoDB
    const deleteResult = await fileModel.deleteOne({ _id: fileId });
    console.log('MongoDB delete result:', deleteResult);

    // 👈 Redirect to home page
    res.redirect('/home');
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send("Something went wrong");
  }
});



module.exports = router;