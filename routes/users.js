const express = require("express");
const router = express.Router();

const Users = require("../models/user");

// users GET
router.get("/", (req, res) => {
  const queries = req.query;
  // Get all keys
  const keys = Object.keys(queries);
  let where, sort, select, skip, limit, count;
  if (keys.includes("where")) {
    where = JSON.parse(queries.where);
  }
  if (keys.includes("sort")) {
    sort = JSON.parse(queries.sort);
  }
  if (keys.includes("select")) {
    select = JSON.parse(queries.select);
  }
  if (keys.includes("skip")) {
    skip = JSON.parse(queries.skip);
  }
  if (keys.includes("limit")) {
    limit = JSON.parse(queries.limit);
  }
  if (keys.includes("count")) {
    count = JSON.parse(queries.count);
  }
  Users.find(where)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select)
    .exec()
    .then(users => {
      res.status(200).json({
        message: "OK",
        data: count
          ? { count: users.length }
          : users.map(user => {
              return {
                _id: user._id,
                name: user.name,
                email: user.email,
                pendingTasks: user.pendingTask,
                dateCreated: user.dateCreated
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
  Users.countDocuments({ email: req.body.email }, (err, count) => {
    if (count > 0) {
      return res.status(500).json({
        message: "User failed to create",
        data: "Email has already been used"
      });
    }
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created",
          data: {
            _id: result._id,
            name: result.name,
            email: result.email,
            pendingTasks: result.pendingTasks,
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
});

// users/:id GET
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Users.findById(id)
    .exec()
    .then(user => {
      res.status(200).json({
        message: "OK",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pendingTasks: user.pendingTasks,
          dateCreated: user.dateCreated
        }
      });
    })
    .catch(err => {
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
  Users.findByIdAndUpdate(id, updateUser, { new: true })
    .exec()
    .then(user => {
      res.status(200).json({
        message: "User updated",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pendingTasks: user.pendingTasks,
          dateCreated: user.dateCreated
        }
      });
    })
    .catch(err => {
      res.status(404).json({
        message: "User not found",
        data: err
      });
    });
});

// users/:id DELETE
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Users.findByIdAndRemove(id)
    .exec()
    .then(user => {
      res.status(200).json({
        message: "User deleted",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    })
    .catch(err => {
      res.status(404).json({
        message: "User not found",
        data: err
      });
    });
});

module.exports = router;
