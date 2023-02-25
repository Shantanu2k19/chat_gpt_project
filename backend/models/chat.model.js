const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    }, 
    qnaData:{
        type: [String],
        default: []
    }
});
  
const Chat = mongoose.model('chat', questionSchema);

module.exports=Chat;