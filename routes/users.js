const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Users = require("../models/user");

// users GET
router.get("/", (req, res) => {
  Users.find()
    .exec()
    .then(users => {
      res.status(200).json({
        message: "OK",
        data: users
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// users POST
router.post('/', (req, res) => {
  console.log("here");
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    pendingTasks: req.body.pendingTasks,
    dateCreated: req.body.dateCreated
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "User created",
        data: result
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// users/:id GET
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Users.findById(id)
    .exec()
    .then(users => {
      console.log(users);
      res.status(200).json({
        message: "OK",
        data: users
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;