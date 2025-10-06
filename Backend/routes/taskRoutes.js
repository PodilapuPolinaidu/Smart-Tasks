const express = require("express");
// const app = express()
// app.use(express.json())
const mongo = require("../config/mongo");
const router = express.Router();
const Task = require("../models/Tasks");

mongo();
router.get("/home", (req, res) => {
  // console.log("=== COOKIE DEBUG INFO ===");
  // console.log("1. All cookies received:", req.cookies);
  // console.log("2. Raw cookie header:", req.headers.cookie);
  // console.log("3. Token cookie:", req.cookies.token);
  console.log("4. ID cookie:", req.cookies);
  console.log("5. Email cookie:", req.cookies.Email);

  res.json({
    receivedCookies: req.cookies,
    rawCookieHeader: req.headers.cookie,
    message: "Check your server console for details",
  });
});
router.post("/addTask", async (req, res) => {
  const { taskName, description, userId } = req.body;
  try {
    const task = new Task({
      taskName,
      description,
      userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.log("18", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", id });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.put("/updateTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, description, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskName, description, completed },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.get("/getTasks/:id", async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
