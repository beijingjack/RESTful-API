// Load required packages
const mongoose = require('mongoose');

// Define our user schema
const TaskSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  deadline: {type: Date, required: true},
  completed: Boolean,
  assignedUser: String,
  assignedUserName: String,
  dateCreated: Date
});

// Export the Mongoose model
module.exports = mongoose.model('Task', TaskSchema);
