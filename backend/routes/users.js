const router = require('express').Router();
let User = require('../models/user.model');
let Chat = require('../models/chat.model');
const axios = require('axios');

//LOGIN API
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ username, password });
    console.log("done");
    if (user) {
      console.log("connecting mere bhai");
      res.status(200).send({ message: 'Login successful!' });
      console.log("ho gya mere bhai");

    } else {
      res.status(401).send({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
})

//SIGNUP API 
router.post('/signup', async (req, res) => {
  const { username, password, email  } = req.body;
  console.log(req.body);

  //find for duplicate user 
  const user = await User.findOne({username});
  if(user) {
    res.status(401).send({ message: 'Username not available!!' });
    return;
  }

  //find for duplicate email 
  const mail = await User.findOne({email});
  if(mail) {
    res.status(401).send({ message: 'Email not available!!' });
    return;
  }

  try {
    const newUser = new User({ username, password, email});
    console.log("User added successfully");

    newUser.save();


    //initialize chat as well
    const newArray = [];
    const newChat = new Chat({username, newArray });

    newChat.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
  } 
  catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
})


//EXTRA API FOR questions

router.post('/question_to_gpt', async (req, res) => {
  console.log("question asked");

  try {
    const question = req.body.question;
    const model = 'text-davinci-003';
    console.log(question);
    // return;
    const response = await axios.post('https://api.openai.com/v1/engines/' + model + '/completions', {
      prompt: question,
      max_tokens: 200,
      temperature: 0.5,
      n: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const answer = response.data.choices[0].text;

    res.json({ answer });

    // console.log(answer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});



router.route('/add').post((req, res) => {

  console.log("adding 2 numbers");
  //get paramnetr 
  const { num1, num2  } = req.body;

  //do processing
  const ans=  num1+num2;

  console.log(num1,num2,ans);

  //return resopoonse
  res.status(200).json({ addition: ans });
  return;
});

module.exports = router; 