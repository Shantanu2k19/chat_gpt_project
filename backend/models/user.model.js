const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true,  
        minLength: 3
    }, 
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,  
        minLength: 3
    }, 
    password: {
        type: String,
        required: true,
        trim: true,  
        minLength: 3
    }, 
    isGlogin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: false,
})


const User = mongoose.model('User', userSchema);

module.exports=User;