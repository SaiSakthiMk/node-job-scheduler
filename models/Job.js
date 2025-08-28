const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  cronExp: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

// ✅ Check if model already exists, otherwise create
module.exports = mongoose.models.Job || mongoose.model("Job", JobSchema);
