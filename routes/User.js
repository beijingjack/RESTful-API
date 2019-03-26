const express = require('express');
const router = express.Router();

const Users = require('../models/user');

// Get all users
router.get("/", (req, res) => {
  Users.find()
    .exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// Get a specific user
