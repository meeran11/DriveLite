const express = require('express');
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { body , validationResult } = require('express-validator')

const User = require('../models/user.model');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',body('email').trim().isEmail().isLength({ min: 15 }),
                        body('password').trim().isLength({ min: 5 }),
                        body('username').trim().isLength({ min: 3 }),async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array(),
                message: "Invalid data"
             });
        }

        const { username, email, password } = req.body;
        
        const hashedPass = await bcrypt.hash(password,10);
        const newUser = await User.create({ username, email,password:hashedPass});
        res.render("login");
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login',body('username').trim().isLength({ min: 3 }),
body('password').trim().isLength({ min: 5 }),
async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array(),
            message: "Invalid data"
         });
    }
    const {username, password} = req.body;
    const USER = await User.findOne({ username });
    if(!USER){
        return res.status(400).json({ message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, USER.password);
    if(!isMatch){
        return res.status(400).json({ message: "Invalid username or password" });
    }

    console.log("User logged in successfully");
    const token = jwt.sign({id : USER._id, 
        email: USER.email,
        username: USER.username},
        process.env.JWT_SECRET,
    )
    res.cookie('token', token);
    res.redirect('/home');
});

module.exports = router;
