const express = require('express'); // Imports Express.
const jwt = require('jsonwebtoken'); // Imports jsonwebtoken to issue JWTs.
const User = require('../models/User'); // Imports the User model.
const router = express.Router(); // Creates a new router object.

// Route to handle user registration.
router.post('/signup', async (req, res) => {
  const { username, password } = req.body; // Extracts username and password from the request body.
  try {
    const user = await User.create({ username, password }); // Creates a new user in the database.
    res.status(201).send('User created successfully'); // Sends a success response.
  } catch (error) {
    res.status(400).send(error); // Sends an error response if something goes wrong.
  }
});

// Route to handle user login.
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Extracts username and password from the request body.
  try {
    const user = await User.findOne({ username }); // Finds the user by username.
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).send('Incorrect username or password'); // If user not found or password is wrong, send an error.
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    }); // Generates a JWT for the user.
    res.status(200).json({ token }); // Sends the token to the user.
  } catch (error) {
    res.status(400).send(error); // Sends an error response if something goes wrong.
  }
});

module.exports = router; // Exports the router.
