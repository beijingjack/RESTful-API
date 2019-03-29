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
                description: task.description,
                deadline: task.deadline,
                completed: task.completed,
                assignedUser: task.assignedUser,
                assignedUserName: task.assignedUserName,
                dateCreated: task.dateCreated
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
    description: req.body.description,
    deadline: req.body.deadline,
    completed: req.body.completed,
    assignedUser: req.body.assignedUser ? req.body.assignedUser : "",
    assignedUserName: req.body.assignedUserName
      ? req.body.assignedUserName
      : "unassigned",
    dateCreated: new Date()
  });
  task
    .save()
    .then(result => {
      res.status(201).json({
        message: "Task created",
        data: {
          _id: result._id,
          name: result.name,
          description: result.description,
          deadline: result.deadline,
          completed: result.completed,
          assignedUser: result.assignedUser,
          assignedUserName: result.assignedUserName,
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
      res.status(200).json({
        message: "OK",
        data: {
          _id: task._id,
          name: task.name,
          description: task.description,
          deadline: task.deadline,
          completed: task.completed,
          assignedUser: task.assignedUser,
          assignedUserName: task.assignedUserName,
          dateCreated: task.dateCreated
        }
      });
    })
    .catch(err => {
      res.status(404).json({
        message: "Task not found",
        data: err
      });
    });
});

// tasks/:id PUT
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updateTask = req.body;
  Tasks.findByIdAndUpdate(id, updateTask, {new:true})
    .exec()
    .then(task => {
      res.status(200).json({
        message: "Task updated",
        data: {
          _id: task._id,
          name: task.name,
          description: task.description,
          deadline: task.deadline,
          completed: task.completed,
          assignedUser: task.assignedUser,
          assignedUserName: task.assignedUserName,
          dateCreated: task.dateCreated
        }
      });
    })
    .catch(err => {
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
      res.status(200).json({
        message: "Task deleted",
        data: {
          _id: task._id,
          name: task.name,
          description: task.description,
          deadline: task.deadline,
          completed: task.completed,
          assignedUser: task.assignedUser,
          assignedUserName: task.assignedUserName,
          dateCreated: task.dateCreated
        }
      });
    })
    .catch(err => {
      res.status(404).json({
        message: "Task not found",
        data: err
      });
    });
});

module.exports = router;
