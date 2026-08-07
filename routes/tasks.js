const express = require("express");
const { Task } = require("../models/Task");
const authRequired = require("../middleware/auth");
const router = express.Router();

router.get("/", authRequired, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", authRequired, async (req, res) => {
  try {
    const { title, status } = req.body || {};
    if (!title || !status)
      return res.status(400).json({ error: "Missing fields" });
    if (!["todo", "doing", "done"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const task = await Task.create({ userId: req.user.userId, title, status });
    res.status(201).json({ task });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", authRequired, async (req, res) => {
  try {
    const { title, status } = req.body || {};
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId: req.user.userId });
    if (!task)
      return res.status(404).json({ error: "Task not found" });

    if (status !== undefined) {
      if (!["todo", "doing", "done"].includes(status))
        return res.status(400).json({ error: "Invalid status" });
      task.status = status;
    }
    
    if (title !== undefined) {
      task.title = title;
    }

    await task.save();
    res.json({ task });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!task)
      return res.status(404).json({ error: "Task not found" });

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
