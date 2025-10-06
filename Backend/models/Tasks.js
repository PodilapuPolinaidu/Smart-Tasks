const mongoose = require("mongoose");

const tasksSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: Number },
    completed: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tasks", tasksSchema);
