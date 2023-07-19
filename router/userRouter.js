const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middlewares/authenticate");

/*
  @usage : to register a User
  @url : /api/users/register
  @fields : name, email, password
  @method : POST
  @access : PUBLIC
*/
router.post("/register", async (request, response) => {
  try {
    let { name, email, password } = request.body;

    //Check if user exist or not
    let user = await User.findOne({ email: email });

    if (user) {
      return response.status(201).json({ msg: "User already exists" });
    }

    //Hashing password
    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let avatar =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU";
    user = new User({ name, email, password, avatar });
    await user.save();

    response
      .status(200)
      .json({ msg: "You Account is Registered Successfully" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/*
    @usage : to login a User
    @url : /api/users/login
    @fields : email, password
    @method : POST
    @access : PUBLIC
*/
router.post("/login", async (request, response) => {
  try {
    let { email, password } = request.body;

    // check if email is correct or not
    let user = await User.findOne({ email: email });
    if (!user) {
      return response
        .status(201)
        .json({ errors: [{ msg: "User is not registered" }] });
    }

    //As Emails is already present so check the password is correct or not
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response
        .status(201)
        .json({ errors: [{ msg: "Invalid Password" }] });
    }

    // Create a token and send to client
    /* Creating a JSON webtoken (JWT) for the authenticated user and 
    sending it back to client as a response to the login request. */

    let payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    /* This code is creating a JSON Web Token (JWT) for the authenticated user and sending it 
      back to the client as a response to the login request. 
      The `jwt.sign()` method takes in a payload object, a secret key, and a callback function. 
      The payload object contains the user information that will be encoded in the token. 
      The secret key is used to sign the token and verify its authenticity. 
      The callback function is called with an error object and the token string. 
      If there is an error, it will be thrown, otherwise, the token will be sent back to the
      client as a response to the login request. */

    jwt.sign(payload, process.env.JWT_SECRET_KEY, (error, token) => {
      if (error) throw error;
      response.status(200).json({
        msg: "Logged In Successfully",
        token: token,
      });
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/*
    @usage :  to get user Info
    @url : /api/users/me
    @fields : no-fields
    @method : GET
    @access : PRIVATE
*/
router.get("/me", authenticate, async (request, response) => {
  try {
    let user = await User.findById(request.user.id).select("-password");
    response.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

module.exports = router;
