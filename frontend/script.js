// app.js - frontend logic + GSAP animations
const API = "http://localhost:3000";
let token = localStorage.getItem("token") || "";

document.addEventListener("DOMContentLoaded", () => {
  // initial animations
  gsap.from(".title", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
  gsap.from(".subtitle", { y: -6, opacity: 0, duration: 0.8, delay: 0.12 });
  gsap.from(".tabs .tab-btn", { opacity: 0, y: 8, stagger: 0.08, duration: 0.6, delay: 0.2 });

  // attach click to tab buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = btn.getAttribute("data-tab");
      showTab(tab);
      gsap.from(`#${tab}`, { opacity: 0, y: 8, duration: 0.35 });
    });
  });

  // show login if token exists, else register
  if (token) {
    showTab("jobsTab");
    loadJobs();
  } else {
    showTab("registerTab");
  }
});

function showTab(tabId) {
  document.querySelectorAll(".panel").forEach(el => el.classList.add("hidden"));
  const el = document.getElementById(tabId);
  if (el) el.classList.remove("hidden");
}

// ----- API actions -----
async function register() {
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPass").value;
  const msg = document.getElementById("regMsg");
  msg.textContent = "";
  try {
    const res = await fetch(API + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    msg.textContent = data.message || data.error || "Done";
    gsap.fromTo(msg, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.4 });
  } catch (err) {
    msg.textContent = "Network error";
  }
}

async function login() {
  const email = document.getElementById("logEmail").value.trim();
  const password = document.getElementById("logPass").value;
  const msg = document.getElementById("logMsg");
  msg.textContent = "";
  try {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      msg.textContent = "✅ Logged in";
      gsap.fromTo(msg, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35 });
      showTab("jobsTab");
      loadJobs();
    } else {
      msg.textContent = data.error || "Login failed";
      gsap.fromTo(msg, { x: -8 }, { x: 0, duration: 0.2 });
    }
  } catch (err) {
    msg.textContent = "Network error";
  }
}

function logout() {
  token = "";
  localStorage.removeItem("token");
  showTab("loginTab");
}

async function addJob() {
  const name = document.getElementById("jobName").value.trim();
  const cronExp = document.getElementById("jobCron").value.trim();
  const msg = document.getElementById("jobMsg");
  msg.textContent = "";

  try {
    const res = await fetch(API + "/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ name, cronExp })
    });
    const data = await res.json();
    msg.textContent = data.message || data.error || "Done";
    gsap.fromTo(msg, { opacity: 0 }, { opacity: 1, duration: 0.4 });

    // after adding, refresh list and animate last item
    await loadJobs(true);
  } catch (err) {
    msg.textContent = "Network error";
  }
}

async function runJobNow(id) {
  try {
    await fetch(API + `/jobs/run/${id}`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + token }
    });
    // small feedback
    loadJobs();
  } catch (err) { console.error(err); }
}

async function deleteJob(id) {
  try {
    await fetch(API + `/jobs/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });
    loadJobs();
  } catch (err) { console.error(err); }
}

async function loadJobs(animateLast = false) {
  const list = document.getElementById("jobList");
  list.innerHTML = "";
  try {
    const res = await fetch(API + "/jobs", {
      headers: { "Authorization": "Bearer " + token }
    });
    const jobs = await res.json();

    jobs.forEach(job => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${escapeHtml(job.name)}</strong>
          <div class="muted" style="font-size:12px;color:#9fb3c8">${escapeHtml(job.cronExp)}</div>
        </div>
        <div class="job-action">
          <button class="small-btn run-btn" onclick="runJobNow('${job._id}')">Run</button>
          <button class="small-btn del-btn" onclick="deleteJob('${job._id}')">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });

    // animate list items
    gsap.from("#jobList li", { opacity: 0, y: 8, stagger: 0.06, duration: 0.45 });

    // if animateLast requested, pulse last item
    if (animateLast && list.lastElementChild) {
      gsap.fromTo(list.lastElementChild, { scale: 0.98, backgroundColor: "#ffffff00" }, { scale: 1, duration: 0.36, boxShadow: "0 6px 20px rgba(2,6,23,0.4)" });
    }

  } catch (err) {
    console.error(err);
  }
}

// small helper to avoid injecting raw html
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" }[m]));
}
