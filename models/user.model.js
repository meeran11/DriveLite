const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 15
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;