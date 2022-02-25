const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { BCRYPT_ROUNDS } = require("../secrets/secrets.js");
const Jokes = require("../jokes/jokes-model");

//changed up gameplan, used a jokes-model file to sort db, exported here for authentication

const {
  checkCredentials, 
  checkUsernameExists
} = require('./middleware')

const makeToken = require("./token-builder");


router.post("/register",checkCredentials, checkUsernameExists , async (req, res, next) => {

  const { username, password } = req.body;

  try {
    const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    const newUser = { username, password: hash };
    const addedUser = await Jokes.add(newUser);
    res.status(200).json({ message: `Welcome, ${addedUser.username}` });
  } catch (err) {
    next(err);
  }

});

router.post("/login",checkCredentials, (req, res, next) => {
  let { username, password } = req.body;

  Jokes.findBy({ username })

  .then(([user]) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = makeToken(user);
      res.status(200).json({ message: `${user.username} is back!`, token });
    } else {
      next({ status: 401, message: "invalid credentials" });
    }
  })

  .catch(next);
  
});

module.exports = router;