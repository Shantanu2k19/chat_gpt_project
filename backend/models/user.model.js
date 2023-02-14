const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        //validations
        type: String,
        required: true,
        unique: true, 
        trim: true,  //trim whitespace in end
        minLength: 3
    }, 
}, {
    timestamps: true,
})

//username : field

const User = mongoose.model('User', userSchema);

module.exports=User;