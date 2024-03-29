const router = require("express").Router();
let User = require("../models/user.model");
let Chat = require("../models/chat.model");
let Bug = require("../models/bug.model");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// router.use(express.json())

let refreshTokens = [];

// ******************    UTILITY FUNCTIONS      ******************
function generateAccessToken(data) {
  console.log("generate fn");
  // console.log(data);
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

function authenticateToken(req, res, next) {
  console.log("---authenticateToken function---");
  req.returnToken = req.headers["authorization"];

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .status(401)
      .send({ message: "token not found!!!, Login Again!!" });
  req.newToken = token;

  try {
    const verifyJWTtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (verifyJWTtoken) {
      console.log("token valid!");
      req.usernam = verifyJWTtoken.username;
      next();
      return;
    }
    return res
      .status(403)
      .send({
        message:
          "token not valid, but code should not reach here!!, Login Again!!",
      });
  } catch {
    console.log("token expired!");
    //token expired, check for refresh token
    const refreshToken = req.body.reftoken;
    // console.log(refreshTokens);

    if (refreshToken == null)
      return res
        .status(403)
        .send({
          message: "token Expired, refresh token not provided, Login Again!!",
        });

    if (!refreshTokens.includes(refreshToken)) {
      // console.log(refreshTokens);
      return res
        .status(403)
        .send({ message: "refresh token not found, Login Again!!" });
    }

    try {
      const verifyRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      if (verifyRefreshToken) {
        console.log("refresh token valid, creating auth token");
        const username = verifyRefreshToken.username;
        const forJWTsign = { username };
        // console.log(forJWTsign);
        const newAccessToken = generateAccessToken(forJWTsign);
        req.newToken = newAccessToken;
        req.usernam = username;
        next();
        return;
      }
      return res
        .status(403)
        .send({
          message:
            "referesh token verification failed, but code should not reach here!!, Login Again!!",
        });
    } catch {
      return res
        .status(403)
        .send({ message: "referesh token verification failed, Login Again!!" });
    }
  }
}

//******************      AUTH APIS       ******************

//LOGIN API
router.post("/login", async (req, res) => {
  console.log("______LOGIN_____");

  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (user == null) {
    return res.status(401).send({ message: JSON.stringify("User not found!") });
  }

  const forJWTsign = { username };
  console.log(forJWTsign);
  try {
    if (await bcrypt.compare(password, user.password)) {
      console.log("Password Success, generating access token");
      const accessToken = generateAccessToken(forJWTsign);
      const refreshToken = jwt.sign(
        forJWTsign,
        process.env.REFRESH_TOKEN_SECRET
      );

      refreshTokens.push(refreshToken);
      console.log("user login valid : ", username);

      return res
        .status(200)
        .send({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      return res
        .status(401)
        .send({ message: JSON.stringify("Password incorrect!") });
    }
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .send({ message: JSON.stringify("Something went wrong :/") });
  }
});

//LOGOUT API
router.delete("/logout", (req, res) => {
  console.log("______DELETE_____");
  // console.log("before")
  // console.log(refreshTokens)

  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);

  // console.log("after")
  // console.log(refreshTokens)
  res.sendStatus(204);
});

//SIGNUP API
router.post("/signup", async (req, res) => {
  console.log("______SIGNUP_____");

  const { username, password, email } = req.body;
  // console.log(req.body);

  //find for duplicate user
  const user = await User.findOne({ username });
  if (user) {
    res.status(401).send({ message: "Username not available!!" });
    return;
  }

  //find for duplicate email
  const mail = await User.findOne({ email });
  if (mail) {
    res.status(401).send({ message: "Email not available!!" });
    return;
  }

  const preferences = {
    gnable: false,
    voice: 0,
    rate: 1,
    pitch: 1,
  };

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      prefs: preferences,
    });

    try {
      newUser.save();
      console.log("new user added!");
    } catch {
      res.status(400).send({ message: JSON.stringify("Error: " + err) });
      return;
    }

    //initialize chat as well
    const newChat = new Chat({ username });

    try {
      newChat.save();
      console.log("Chat initialized!");
    } catch {
      console.log("cant create chat");
      res.status(400).send({ message: JSON.stringify("Error: " + err) });
      return;
    }

    //returning refresh and access tokens
    const forJWTsign = { username };
    const accessToken = generateAccessToken(forJWTsign);
    const refreshToken = jwt.sign(forJWTsign, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    return res
      .status(200)
      .send({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

//SIGIN WITH GOOGLE API
router.post("/signupWithGoogle", async (req, res) => {
  console.log("______SIGN-IN W GOOGLE_____");

  let { username, email } = req.body;

  //find for duplicate email
  const mail = await User.findOne({ email });
  if (mail) {
    console.log("Mail exist");
    if (!mail.isGlogin) {
      return res.status(401).send({ message: "Email exist, Login instead" });
    }

    //login user
    username = mail.username;
    console.log("user id exist, logging in");
    const forJWTsign = { username };
    console.log("generating access token");
    const accessToken = generateAccessToken(forJWTsign);
    const refreshToken = jwt.sign(forJWTsign, process.env.REFRESH_TOKEN_SECRET);

    refreshTokens.push(refreshToken);
    console.log("user login valid : ", username);

    return res
      .status(200)
      .send({ accessToken: accessToken, refreshToken: refreshToken , uname: username});
  }

  //find for duplicate user
  let user = await User.findOne({ username });

  while (user) {
    username = username + Math.floor(Math.random() * 10000 + 1);
    console.log(username);
    user = await User.findOne({ username });
  }

  let password = Math.random();
  try {
    const preferences = {
      gnable: false,
      voice: 3,
      rate: 1,
      pitch: 1,
    };

    const newUser = new User({
      username,
      password,
      email,
      isGlogin: true,
      prefs: preferences,
    });

    try {
      newUser.save();
      console.log("new user added!");
    } catch {
      res.status(400).send({ message: JSON.stringify("Error: " + err) });
      return;
    }

    //initialize chat as well
    const newChat = new Chat({ username });

    try {
      newChat.save();
      console.log("Chat initialized!");
    } catch {
      console.log("cant create chat");
      res.status(400).send({ message: JSON.stringify("Error: " + err) });
      return;
    }

    //returning refresh and access tokens
    const forJWTsign = { username };
    const accessToken = generateAccessToken(forJWTsign);
    const refreshToken = jwt.sign(forJWTsign, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    return res
      .status(200)
      .send({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

//******************      DATA APIS       ******************

//API FOR questions
router.post("/question_to_gpt", authenticateToken, async (req, res) => {
  console.log("______QUESTION-ASK_____");

  try {
    const question = req.body.question;
    const model = "text-davinci-003";
    // console.log(question);
    // return;
    const response = await axios.post(
      "https://api.openai.com/v1/engines/" + model + "/completions",
      {
        prompt: question,
        max_tokens: 500,
        temperature: 0.5,
        n: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    console.log("...............");
    let answer = response.data.choices[0].text;
    // console.log(answer);

    console.log("got answer");
    answer = answer.replace(/^\n+/g, "");
    answer = answer.replace(/\n/g, "<br>");
    // console.log(answer);

    let retVal = 0;
    if (req.usernam === "demo_user") {
      retVal = 1;
    }
    else retVal = addChatInDatabase(req.usernam, question, answer);

    if (retVal === 0) {
      console.log("user chat not saved");
      return res.status(403).json({ answer });
    } else console.log("qn added");

    return res.status(200).json({ answer });

    // console.log(answer);
  } catch (error) {
    console.log("api to ask question failed ");
    //console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

//function
const addChatInDatabase = async (username, qn, ans) => {
  const usr = await User.findOne({ username });

  if (!usr) return 0;

  try {
    const userChat = await Chat.findOne({ username });

    userChat.qnaData.push(qn);
    userChat.qnaData.push(ans);
    userChat.save();
    return 1;
  } catch (err) {
    return 0;
  }
};

router.post("/createdb", async (req, res) => {
  console.log("new cdsd");
  const { qn, username } = req.body;
  console.log(username);
  const newArray = [];
  const newChat = new Chat({ username });

  try {
    newChat.save();
    console.log("Chat initialized!");
  } catch {
    res.status(400).send({ message: JSON.stringify("Error: " + err) });
    return;
  }
  res.status(200).json({ result: "pass" });
  return;
});

//GET HISTORY OF CHAT ON first page load
router.post("/getChatHistory", authenticateToken, async (req, res) => {
  console.log("got name : ", req.usernam);
  const userChat = await Chat.findOne({ username: req.usernam });
  if (userChat) {
    // console.log( userChat.qnaData);
    const data = {
      newToken: req.newToken,
      arr: userChat.qnaData,
    };
    return res.json(data);
  } else {
    console.log("some error occured!");
    return res.status(403).send({ message: "user's chat not found" });
  }
});

//CLEAR CHAT HISTORY
router.post("/clearChat", authenticateToken, async (req, res) => {
  console.log("got name : ", req.usernam);

  if (req.usernam === "demo_user") {
    return res.status(403).send({ message: "Not available for demo user!" });
  }
  const userChat = await Chat.findOne({ username: req.usernam });
  if (userChat) {
    userChat.qnaData = [];
    userChat.save();

    const data = {
      newToken: req.newToken,
    };
    return res.json(data);
  } else {
    console.log("some error occured!");
    return res.status(403).send({ message: "user's chat not found" });
  }
});

//REPORT BUG / SUGGEST FEATURE
router.post("/reportBug", authenticateToken, async (req, res) => {
  console.log("______REPORT-BUG_____");

  const bug = req.body.bugData;
  // console.log(bug);

  if (req.usernam === "demo_user") {
    return res.status(403).send({ message: "Not available for demo user!" });
  }

  try {
    const bugVariable = await Bug.findOne({ username: req.usernam });

    if (bugVariable) {
      bugVariable.bugData.push(bug);
      bugVariable.save();
      // console.log("already there");
    } else {
      const username = req.usernam;
      const bugData = bug;
      const newBug = new Bug({ username, bugData });
      newBug.save();
      // console.log("new user");
    }
    // console.log("done");
    return res.status(200).send({ message: "Success" });
  } catch {
    return res.status(403).send({ message: "Some error occured!" });
  }
});

//GET PREFS
router.post("/get_prefs", authenticateToken, async (req, res) => {
  console.log("______GET-PREFS_____");
  console.log("got name : ", req.usernam);

  if (req.usernam === "demo_user") {
    return res.status(403).send({ message: "Not available for demo user!" });
  }

  const userChat = await User.findOne({ username: req.usernam });
  if (userChat) {
    const prefss = userChat.prefs;
    const data = {
      newToken: req.newToken,
      data: prefss,
    };
    return res.status(200).json(data);
  } else {
    console.log("Cannot get preference!");
    return res.status(403).send({ message: "user's chat not found" });
  }
});

//SET PREFS
router.post("/set_prefs", authenticateToken, async (req, res) => {
  console.log("______SET-PREFS_____");
  console.log("got name : ", req.usernam);

  if (req.usernam === "demo_user") {
    return res.status(403).send({ message: "Not available for demo user!" });
  }

  const userChat = await User.findOne({ username: req.usernam });
  if (userChat) {
    try {
      userChat.prefs = req.body.newPrefs;
      userChat.save();
      console.log(req.body.newPrefs)

      console.log(req.body.newPrefs["gnable"])
      if(req.body.newPrefs["gnable"])
      {
        return res.status(403).send({ message: "Upgrade to Pro for AI enabled features!" });
      }
      const data = {
        newToken: req.newToken,
      };
      return res.status(200).json(data);
    } catch {
      return res.status(403).send({ message: "Something went wrong" });
    }
  } else {
    console.log("some error occured!");
    return res.status(403).send({ message: "No previous preferences found" });
  }
});

//******************      TEST/SAMPLE API       ******************
///THIS FORMAT SHOULD BE FOLLOWED BY ALL THE API THAT WILL BE WRITTEN
router.route("/test").post(authenticateToken, (req, res) => {
  console.log("______test api_____");
  var d = new Date(); //data

  const data = {
    newToken: req.newToken,
    text: "date" + d,
  };
  return res.status(200).json(data);
});

//TEST API FOR SENDING SAMPLE DATA ON QUESTION ASK
router.post("/testApp", async (req, res) => {
  console.log("______TEST-ASK_____");
  const question = req.body.question;
  console.log(question);
  answer = "hehehehehhe";
  return res.status(200).json({ answer });
});

//API TO GET DATA
router.post("/dataapi", authenticateToken, (req, res) => {
  console.log("______DATA-API_____");

  // authenticateToken is the middleware here to check token before moving on

  //will enter this function only when reurned successfully from middleware
  console.log("authinticated");

  // now do data work here

  const data = {
    newToken: req.newToken,
  };
  return res.json(data);
});


//APIs for testing hosted backend
router.get("/", (req, res) => {
  console.log("____a-API_____");
  console.log("authinticated");
  const data = "hello root";
  return res.json(data);
});

router.get("/hello", (req, res) => {
  console.log("____a-API_____");
  console.log("abc");
  const data = "hi";
  return res.json(data);
});

module.exports = router;
