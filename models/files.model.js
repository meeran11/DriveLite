const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    path:{
        type: String,
        required: [true,'Path is required!']
    },
    originalName:{
        type: String,
        required: [true,'Original name is required!']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: [true,'User is required!']
    },
    size: Number,         // in bytes
    mimetype: String,
    uploadedAt: {
        type: Date,
        default: Date.now
      },
      signedUrl: String
    })

const file = mongoose.model('file',fileSchema)

module.exports = file;