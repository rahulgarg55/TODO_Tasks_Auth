
const express = require('express'); // Imports Express.
const Task = require('../models/Task'); // Imports the Task model.
const router = express.Router(); // Creates a new router object.

// Middleware to protection routes by checking for a valid JWT.
const protection = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).send('Unauthorized'); // Sends an unauthorized response if no token is found.
  }
  const token = req.headers.authorization.split(' ')[1]; // Gets the token from the header.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies the token.
    req.user = decoded.id; // Sets the user ID on the request object.
    next(); // Continues to the next middleware or route handler.
  } catch (error) {
    return res.status(401).send('Unauthorized'); // Sends an unauthorized response if token is invalid.
  }
};

// Route to create a new task.
router.post('/', protection, async (req, res) => {
  const { description } = req.body; // Gets the description from the request body.
  try {
    const task = await Task.create({ description, user: req.user }); // Creates a new task associated with the user.
    res.status(201).json(task); // Sends the created task back to the user.
  } catch (error) {
    res.status(400).send(error); // Sends an error response if something goes wrong.
  }
});

// Route to get all tasks for a user.
router.get('/', protection, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }); // Finds all tasks associated with the user.
    res.status(200).json(tasks); // Sends the tasks back to the user.
  } catch (error) {
    res.status(400).send(error); // Sends an error response if something goes wrong.
  }
});

module.exports = router; // Exports the router.
