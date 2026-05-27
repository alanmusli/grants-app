# STGS - Систем за управување со грантови за научни патувања

STGS (Scientific Travel Grant System) is a secure, web-based platform developed for the Faculty of Computer Science and Engineering (FINKI). Its primary goal is to digitize and automate the process of applying for, evaluating, and financially tracking academic travel grants.

## 🏗 System Architecture

The project is divided into two distinct environments to enforce security and separation of concerns:

* **Frontend (Client):** React.js (Vite)
* **Backend (Server):** Node.js, Express.js
* **Database:** MongoDB (Mongoose ORM)
* **Authentication:** Central Authentication Service (FINKI CAS)

## ✨ Key Features & Role-Based Access

The system enforces strict Role-Based Access Control (RBAC) with the following user roles:

* **Научник (Professor/Assistant):** Submits travel grant applications (max 10MB documents) and uploads post-travel financial reports (max 20MB PDF).
* **Деканат (Dean's Office):** Reviews applications, downloads encrypted documents, and approves/rejects grants with a mandatory justification.
* **Финансии (Finance Department):** Tracks the 100,000 MKD annual budget limit, calculates automated per diems, and records advance payments and refunds.
* **Администратор (System Admin):** Updates travel rules dynamically via the GUI and views system audit logs (retained for 90 days).

## 🔒 Security Highlights

* **No Local Passwords:** All authentication is delegated to the FINKI CAS system.
* **Data at Rest Encryption:** All uploaded documents (PDF, DOCX, JPG) are encrypted in the database using AES-256.
* **Strict Session Management:** Sessions expire after 30 minutes of inactivity or an absolute maximum of 12 hours.
* **Audit Logging:** All system actions (logins, status changes, rule updates) are logged and automatically purged after 90 days.

---

## 🚀 Local Development Setup

### Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)
* OpenSSL (for generating local HTTPS certificates)

### 1. Clone the Repository

```bash
git clone [https://github.com/your-org/stgs-project.git](https://github.com/your-org/stgs-project.git)
cd stgs-project

