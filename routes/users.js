const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Users = require("../models/user");

// users GET
router.get("/", (req, res) => {
  Users.find()
    .exec()
    .then(users => {
      res.status(200).json({
        message: "OK",
        data: users.map(user => {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            request: {
              type: "GET",
              url: `http://localhost:4000/api/users/${user._id}`
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error occurred",
        data: err
      });
    });
});

// users POST
router.post("/", (req, res) => {
  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    pendingTasks: req.body.pendingTasks,
    dateCreated: new Date()
  });
  user
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "User created",
        data: {
          _id: result._id,
          name: result.name,
          email: result.email,
          pendingTasks: result.pendingTasks
            ? result.pendingTasks
            : "No pending tasks",
          dateCreated: result.dateCreated
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "User failed to create",
        data: {
          error: err.errors
        }
      });
    });
});

// users/:id GET
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Users.findById(id)
    .exec()
    .then(user => {
      console.log(user);
      res.status(200).json({
        message: "OK",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pendingTasks: user.pendingTasks
            ? user.pendingTasks
            : "No pending tasks",
          dateCreated: user.dateCreated
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        message: "User not found",
        data: err
      });
    });
});

// users/:id PUT
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updateUser = req.body;
  Users.findByIdAndUpdate(id, updateUser, {new:true})
    .exec()
    .then(newuser => {
      console.log(user);
      res.status(200).json({
        message: "User updated",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pendingTasks: user.pendingTasks
            ? user.pendingTasks
            : "No pending tasks",
          dateCreated: user.dateCreated
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        message: "User not found",
        data: err
      });
    });
});

module.exports = router;
