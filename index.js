// Load environment variables first
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const { loadJobsFromDB } = require("./jobManager");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);

// Port from .env or fallback to 3000
const PORT = process.env.PORT || 3000;

// ✅ Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ MongoDB Connected");

  // Load jobs from DB and schedule them
  await loadJobsFromDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔑 JWT_SECRET loaded: ${!!process.env.JWT_SECRET}`);
  });
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
});
