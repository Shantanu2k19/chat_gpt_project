const router = require('express').Router();
let User = require('../models/user.model');
let Chat = require('../models/chat.model');
const axios = require('axios');


router.post('/chatadd', async (req, res) => {
  console.log("got request for question");
  //get paramnetr 
  const { qn, user } = req.body;

  console.log(user, " asked ", qn);

  const usr = await User.findOne({user});
  if(!usr) {
    res.status(401).send({ message: 'User not found' });
    return;
  }

  try {
    const userChat =  await Chat.findOne({user});

    userChat.qnaData.push(qn)
    .then(() => res.json('question added!'))
    .catch(err => res.status(400).json('Error: ' + err));
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }

  res.status(200).json({ result: "pass" });
  return;
});

module.exports = router; 