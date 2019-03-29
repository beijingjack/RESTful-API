const express = require("express");
const router = express.Router();

const Tasks = require("../models/task");

// tasks GET
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
  Tasks.find(where)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select)
    .exec()
    .then(tasks => {
      res.status(200).json({
        message: "OK",
        data: count
          ? { count: tasks.length }
          : tasks.map(task => {
            return {
              _id: task._id,
              name: task.name,
              email: task.email,
              pendingTasks: task.pendingTasks
                ? task.pendingTasks
                : "No pending tasks",
              dateCreated: task.dateCreated
              // request: {
              //   type: "GET",
              //   url: `http://localhost:4000/api/tasks/${task._id}`
              // }
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

// tasks POST
router.post("/", (req, res) => {
  const task = new Tasks({
    name: req.body.name,
    email: req.body.email,
    pendingTasks: req.body.pendingTasks,
    dateCreated: new Date()
  });
  task
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Task created",
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
        message: "Task failed to create",
        data: {
          error: err.errors
        }
      });
    });
});

// tasks/:id GET
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Tasks.findById(id)
    .exec()
    .then(task => {
      console.log(task);
      res.status(200).json({
        message: "OK",
        data: {
          _id: task._id,
          name: task.name,
          email: task.email,
          pendingTasks: task.pendingTasks
            ? task.pendingTasks
            : "No pending tasks",
          dateCreated: task.dateCreated
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        message: "Task not found",
        data: err
      });
    });
});

// tasks/:id DELETE
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Tasks.findByIdAndRemove(id)
    .exec()
    .then(task => {
      console.log(task);
      res.status(200).json({
        message: "Task deleted",
        data: {
          _id: task._id,
          name: task.name,
          email: task.email
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({
        message: "Task not found",
        data: err
      });
    });
});

module.exports = router;
