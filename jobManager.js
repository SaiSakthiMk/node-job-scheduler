const schedule = require("node-schedule");
const Job = require("./models/job");

// In-memory reference
const scheduledJobs = {};

function scheduleJob(job) {
  if (scheduledJobs[job.name]) {
    scheduledJobs[job.name].cancel();
  }
  const task = schedule.scheduleJob(job.cronExp, () => {
    console.log(`🔥 Job '${job.name}' executed at:`, new Date());
  });
  scheduledJobs[job.name] = task;
}

// Load jobs from DB on startup
async function loadJobsFromDB() {
  const jobs = await Job.find();
  jobs.forEach(scheduleJob);
  console.log("✅ Loaded jobs from DB");
}

module.exports = { scheduleJob, loadJobsFromDB };
