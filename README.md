# Job Scheduler API

A **Node.js REST API** for scheduling jobs using **cron expressions**, supporting **daily, weekly, and one-time jobs**.  
Built with **MongoDB**, **JWT authentication**, and tested with **Postman**.

---

## Features

- User authentication with **JWT**  
- Schedule jobs to run:
  - Once at a specific date/time
  - Daily at a specific time
  - Weekly on a specific day/time
- List, delete, and manage jobs
- Secure routes using JWT middleware
- Jobs are persisted in **MongoDB** and auto-loaded on server restart

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT  
- **Scheduler:** node-schedule  
- **Testing:** Postman  

---

## Getting Started

### Prerequisites

- Node.js v22+
- MongoDB Atlas or local MongoDB
- Postman for testing

---

### Installation


# Clone the repository
git clone https://github.com/yourusername/job-scheduler-api.git
cd job-scheduler-api

# Install dependencies
npm install
Environment Variables
Create a .env file in the project root:

env
Copy code
PORT=3000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
Run Server
bash
Copy code
node index.js
# or using nodemon
npx nodemon index.js
API Endpoints
Auth
POST /auth/register → Register a new user

POST /auth/login → Login and get JWT token

Jobs (protected, require JWT)
POST /jobs → Create a job (daily, weekly, once)

GET /jobs → List all jobs

DELETE /jobs/:name → Delete a job

Example Job Creation (Postman)
Daily job at 3:30 PM:

json
Copy code
{
  "name": "dailyJob",
  "type": "daily",
  "cronExp": "0 30 15 * * *"
}
One-time job:

json
Copy code
{
  "name": "oneTimeJob",
  "type": "once",
  "date": "2025-08-28T15:30:00"
}
License
MIT License

yaml
Copy code

