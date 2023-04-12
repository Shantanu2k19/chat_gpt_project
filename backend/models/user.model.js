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
    },
    prefs: [{
        gnable : { type: Boolean, required: true, default: false },
        voice: { type: Number,  required: true, default: 3 },
        rate: { type: Number,  required: true, default: 1 },
        pitch: { type: Number,  required: true, default: 1 },
    }],
}, {
    timestamps: false,
})


const User = mongoose.model('User', userSchema);

module.exports=User;