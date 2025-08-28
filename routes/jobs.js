const express = require("express");
const jwt = require("jsonwebtoken");
const Job = require("../models/Job");
const { scheduleJob } = require("../jobManager");

const router = express.Router();

// Middleware to check JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Create Job
router.post("/", auth, async (req, res) => {
  try {
    const { name, cronExp } = req.body;
    const job = new Job({ name, cronExp, createdBy: req.user.id });
    await job.save();
    scheduleJob(job);
    res.json({ message: `✅ Job '${name}' scheduled`, job });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List Jobs
router.get("/", auth, async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id });
  res.json(jobs);
});

// Delete Job
router.delete("/:name", auth, async (req, res) => {
  const job = await Job.findOneAndDelete({ name: req.params.name, createdBy: req.user.id });
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json({ message: `❌ Job '${req.params.name}' cancelled` });
});

module.exports = router;
