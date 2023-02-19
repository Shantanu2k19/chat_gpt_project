const router = require('express').Router();
let User = require('../models/user.model');
let Chat = require('../models/chat.model');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// router.use(express.json())

let refreshTokens = []


// ******************    UTILITY FUNCTIONS      ******************
function generateAccessToken(data) {
  console.log("generate fn");
  // console.log(data);
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

function authenticateToken(req, res, next){
  console.log("---authenticateToken function---")
  req.returnToken = req.headers['authorization'];

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return  res.status(401).send("token not found!!!");
  req.newToken = token;

  try
  {
    const verifyJWTtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(verifyJWTtoken)
    {
      console.log("token valid!")
      next()
      return;
    }
    return res.status(403).send("token not valid, but code should not reach here!!");
  }
  catch 
  {
    console.log("token expired!")
    //token expired, check for refresh token 
    const refreshToken = req.body.reftoken
    // console.log(refreshTokens);
    
    if (refreshToken == null) return res.status(403).send("token Expired, refresh token not provided");
    
    if (!refreshTokens.includes(refreshToken)) {
      // console.log(refreshTokens);
      return res.status(403).send("refresh token not found in list");
    }

    try
    {
      const verifyRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    
      if(verifyRefreshToken)
      {
        console.log("refresh token valid, creating auth token")
        const username = verifyRefreshToken.username;
        const forJWTsign = {username};
        // console.log(forJWTsign);
        const newAccessToken = generateAccessToken(forJWTsign);
        req.newToken = newAccessToken;
        next();
        return;
      }
      return res.status(403).send("referesh token verification failed, but code should not reach here!!");
    }
    catch
    {
      return res.status(403).send("referesh token verification failed");
    }
  }
}






//******************      AUTH APIS       ******************

//LOGIN API
router.post('/login', async (req, res) => {
  console.log("______LOGIN_____");

  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if(user == null)
  {
    return res.status(400).send("user not found")
  }

  const forJWTsign = {username};
  console.log(forJWTsign);
  try 
  {
    if(await bcrypt.compare(password, user.password)) 
    {
      console.log('Password Success, generating access token')
      const accessToken = generateAccessToken(forJWTsign); 
      const refreshToken = jwt.sign(forJWTsign, process.env.REFRESH_TOKEN_SECRET)

      refreshTokens.push(refreshToken)
     
      return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });
    } 
    else 
    {
      return res.status(401).send('Incorrect password')
    }
  } 
  catch (err) {
    console.error(err);
    res.status(500).send("something went wrong :/");
  }
})

//LOGOUT API 
router.delete('/logout', (req, res) => {
  console.log("______DELETE_____");
  // console.log("before")
  // console.log(refreshTokens)

  refreshTokens = refreshTokens.filter(token => token !== req.body.token)

  // console.log("after")
  // console.log(refreshTokens)
  res.sendStatus(204)
})

//SIGNUP API 
router.post('/signup', async (req, res) => {
  console.log("______SIGNUP_____");

  const { username, password, email  } = req.body;
  // console.log(req.body);

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
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, password:hashedPassword, email});
    
    try {
      newUser.save();
      console.log('new user added!');
    }
    catch{
      res.status(400).send({ message : JSON.stringify('Error: ' + err)})
      return;
    }

    //initialize chat as well
    // const newArray = [];
    // const newChat = new Chat({username, newArray });

    // try{
    //   newChat.save()
    //   console.log('Chat initialized!')
    // }
    // catch{
    //   res.status(400).send({ message : JSON.stringify('Error: ' + err)})
    //   return;
    // }
    

    //returning refresh and access tokens 
    const forJWTsign = {username};
    const accessToken = generateAccessToken(forJWTsign); 
    const refreshToken = jwt.sign(forJWTsign, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });
  } 
  catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
})






//******************      TEST/SAMPLE API       ******************
///THIS FORMAT SHOULD BE FOLLOWED BY ALL THE API THAT WILL BE WRITTEN 
router.route('/test').post(authenticateToken, (req, res) => {
  console.log("______test api_____");
  var d = new Date(); //data 

  const data = 
  {
    newToken :req.newToken,
    text : "date"+d
  }
  return res.status(200).json(data);
});

module.exports = router; 





//******************      DATA APIS       ******************

//API TO GET DATA 
router.post('/dataapi', authenticateToken, (req,res) => {
  console.log("______DATA-API_____");

  // authenticateToken is the middleware here to check token before moving on 

  //will enter this function only when reurned successfully from middleware 
  console.log("authinticated")

  // now do data work here

  const data = 
  {
    newToken :req.newToken
  }
  return res.json(data);
});

//API FOR questions
router.post('/question_to_gpt', async (req, res) => {
  console.log("______QUESTION-ASK_____");


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

