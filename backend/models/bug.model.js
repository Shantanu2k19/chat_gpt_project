const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    }, 
    bugData:{
        type: [String],
        default: []
    }
});
  
const Bug = mongoose.model('Bug', bugSchema);

module.exports=Bug;