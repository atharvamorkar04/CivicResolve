# 🏛️ CivicResolve — Municipal Grievance & Civic Issue Management Platform

<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="CivicResolve Logo" />
</p>

<p align="center">
  <strong>A transparent, full-stack digital governance platform connecting citizens, municipal administration, and field engineering departments for swift civic issue resolution.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP 8" />
  <img src="https://img.shields.io/badge/MySQL-8.x_%2F_InnoDB-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet Maps" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features & Role Portals](#-key-features--role-portals)
  - [1. Citizen Portal](#1-citizen-portal)
  - [2. Municipal Administrator Portal](#2-municipal-administrator-portal)
  - [3. Department Field Operations Portal](#3-department-field-operations-portal)
- [Interactive Mapping & Evidence Comparison](#-interactive-mapping--evidence-comparison)
- [System Architecture & Technology Stack](#-system-architecture--technology-stack)
- [Database Schema (MySQL InnoDB)](#-database-schema-mysql-innodb)
- [Quick Start & Installation Guide](#-quick-start--installation-guide)
- [Demo Login Credentials](#-demo-login-credentials)
- [REST API Endpoints Reference](#-rest-api-endpoints-reference)
- [Project Directory Structure](#-project-directory-structure)
- [License & Acknowledgements](#-license--acknowledgements)

---

## 🌟 Overview

**CivicResolve** modernizes municipal complaint management by replacing slow, paper-based, and disconnected grievance systems with a unified digital web platform. It provides:

1. **Precision Geolocation:** Pinpoint defect coordinates on interactive OpenStreetMap tiles (defaulted to Kolhapur city).
2. **Visual Evidence Redressal:** Side-by-side comparison between initial citizen defect photographs and department verified completion photos.
3. **Role-Based Workflow:** Distinct, secured portals for Citizens, Municipal Administrators, and 7 Specialized Department Desks.
4. **Terminal State Integrity:** Automatic case-locking once a complaint is Resolved or Rejected to prevent unauthorized modification.
5. **Satisfaction Feedback:** Citizen star rating (1–5 stars) and review comments stored permanently in the database.

---

## 🚀 Key Features & Role Portals

### 1. Citizen Portal
- **Universal Login & Registration:** Dedicated onboarding with instant session creation and validation.
- **Dynamic Categorized Reporting:** Two-tier hierarchical category selection (e.g., Road $\rightarrow$ Potholes, Water $\rightarrow$ Pipeline Leakage).
- **Interactive Location Pinning:** Draggable pin on OpenStreetMap with automatic GPS coordinate synchronization.
- **Photo Evidence Attachment:** Client-side preview and server-side MIME-validated image upload (JPEG, PNG, WebP).
- **Complaint Tracking & Timeline:** Real-time milestone tracker displaying every status update, timestamps, and officer remarks.
- **Satisfaction Rating:** Post-resolution star rating (1–5 stars) with feedback submission directly saved to MySQL.

### 2. Municipal Administrator Portal
- **Executive Command Dashboard:** City-wide analytics overview, pending triage counts, and department allocation metrics.
- **Complaint Triage & Allocation:** Assign unassigned grievances to responsible municipal departments and set urgency level (`Standard` vs `Urgent`).
- **Official Directives:** Enter administrative instructions that appear directly on citizen and field officer dashboards.
- **Case Locking (Governance Rule):** When a ticket is marked *Resolved* or *Rejected*, all edit controls are locked with a `🔒 LOCKED` badge.
- **Analytics & Reporting:** Category distribution charts, status breakdown bars, and resolution performance tracking.

### 3. Department Field Operations Portal
- **Department-Specific Desks:** Customized dashboard for each municipal department (e.g., *Electrical & Street Lighting Dashboard*, *Water Supply & Quality Dashboard*).
- **Queue Management:** Filter assigned work orders by status (`Approved`, `In Progress`, `Resolved`).
- **Field Updates:** Move tickets from `Approved` $\rightarrow$ `In Progress` with field progress notes.
- **Verified Photo Resolution:** Mandatory completion photo upload (`resolution_image`) when marking a work order as `Resolved`.
- **Direct Navigation:** One-click `🗺️ Open in Google Maps` link taking field engineers directly to the defect coordinates.

---

## 🗺️ Interactive Mapping & Evidence Comparison

### OpenStreetMap & Leaflet Integration
- Built using **Leaflet.js** without requiring expensive proprietary API keys.
- **Picker Map:** Draggable red marker pin (`#dc2626`) on `/report-issue`, centered by default on Kolhapur (`16.7050° N, 74.2433° E`).
- **Viewer Map:** Embedded on details pages with precise coordinate display and external Google Maps directions link.

### Before & After Visual Evidence
| Before (Citizen Report) | After (Department Redressal) |
| :--- | :--- |
| Initial photo submitted by citizen showing defect (e.g. cracked asphalt or broken lamp). | Verified photo uploaded by department crew demonstrating completed repair. |

---

## 🏗️ System Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 React 19 + TypeScript (SPA)                 │
│         Vite Build Tool • Tailwind CSS • Leaflet Maps       │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API (Proxy :5173 -> :8000)
┌──────────────────────────────▼──────────────────────────────┐
│                    Core PHP REST Backend                    │
│      Strict Typed • PDO Prepared Statements • CSRF Tokens   │
└──────────────────────────────┬──────────────────────────────┘
                               │ MySQL Native Driver
┌──────────────────────────────▼──────────────────────────────┐
│                  MySQL Database (InnoDB)                    │
│      Foreign Keys • ON DELETE CASCADE • utf8mb4 UTF-8       │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Leaflet, Lucide Icons, React Router DOM v7.
- **Backend:** Core PHP 8+ REST API (zero heavyweight frameworks, maintainable JSON architecture).
- **Database:** MySQL 8.x / MariaDB with ACID-compliant InnoDB storage engine.
- **Security:** Prepared statements against SQL injection, CSRF validation, HTTP-only Lax session cookies, MIME-type binary inspection for file uploads.

---

## 🗄️ Database Schema (MySQL InnoDB)

The database `civicresolve_db` consists of **5 relational tables**:

```
 [departments]
       │ 1
       ├── (department_id) ────┐
       │                       │
       ▼ *                     ▼ *
    [users] ────────────> [complaints] <─────────── [complaint_categories]
   (citizens,            (core tickets)             (self-referencing:
    admins,                    │ 1                   categories & subcategories)
    dept staff)                │
                               ▼ *
                      [complaint_updates]
                      (audit history trail)
```

<details>
<summary><strong>🔍 Click to expand Table Details</strong></summary>

1. **`departments`**: Master list of 7 municipal engineering divisions (`ROAD`, `WATER`, `ELEC`, `SAN`, `DRAIN`, `PARK`, `SAFE`).
2. **`users`**: Account registry storing Citizens, Global Admins, and Department Officers linked via `department_id`.
3. **`complaint_categories`**: Self-referencing category tree (primary categories where `parent_category_id IS NULL`, and specific subcategories).
4. **`complaints`**: Core ticket table storing title, description, category, photo path, resolution photo path, coordinates, address, status, priority, admin remarks, citizen rating, and feedback.
5. **`complaint_updates`**: Immutable audit log recording every milestone change, actor ID, previous status, new status, and remarks.

</details>

---

## ⚡ Quick Start & Installation Guide

Follow these steps to run CivicResolve locally on your machine:

### 1. Prerequisites
- **Node.js** (v18.x or newer) and **npm**
- **PHP** (v8.0 or newer)
- **MySQL / XAMPP / WampServer**

### 2. Clone the Repository
```bash
git clone https://github.com/atharvamorkar04/CivicResolve.git
cd CivicResolve
```

### 3. Database Setup (MySQL)
1. Open **phpMyAdmin** (`http://localhost/phpmyadmin`) or your MySQL client.
2. Create a new database named:
   ```sql
   CREATE DATABASE civicresolve_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Import your `civicresolve_db.sql` database dump.

### 4. Configure Backend Environment
Ensure `api/config/config.php` has your local MySQL credentials:
```php
return [
    'db' => [
        'host'     => '127.0.0.1',
        'port'     => 3306,
        'dbname'   => 'civicresolve_db',
        'username' => 'root',
        'password' => '', // Set your MySQL password if any
        'charset'  => 'utf8mb4'
    ],
    // ...
];
```

### 5. Install Frontend Dependencies
```bash
npm install
```

### 6. Run the Application

Open **two terminal windows**:

**Terminal 1 — Start PHP Backend Server:**
```powershell
# In project root folder:
& "C:\xampp\php\php.exe" -S 127.0.0.1:8000 -t .
# (or simply: php -S 127.0.0.1:8000 -t .)
```

**Terminal 2 — Start Vite React Frontend:**
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Credentials

You can test all roles using these seeded credentials:

| Role | Department | Email Address | Password | Portal Accessible |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **Administrator** | Municipal Headquarters | `admin@civicresolve.com` | `admin123` | `/admin/dashboard` |
| 👤 **Citizen** | Citizen User | `citizen@civicresolve.com` | `citizen123` | `/dashboard` |
| 🚧 **Department** | Road & Infrastructure | `road@civicresolve.com` | `dept123` | `/department/dashboard` |
| 💧 **Department** | Water Supply & Quality | `water@civicresolve.com` | `dept123` | `/department/dashboard` |
| 💡 **Department** | Electrical & Street Lighting | `electrical@civicresolve.com` | `dept123` | `/department/dashboard` |
| 🗑️ **Department** | Solid Waste & Sanitation | `sanitation@civicresolve.com` | `dept123` | `/department/dashboard` |
| 🌊 **Department** | Drainage & Sewage | `drainage@civicresolve.com` | `dept123` | `/department/dashboard` |
| 🌳 **Department** | Parks & Public Gardens | `parks@civicresolve.com` | `dept123` | `/department/dashboard` |
| 🦺 **Department** | Public Safety & Hazards | `safety@civicresolve.com` | `dept123` | `/department/dashboard` |

> [!TIP]
> The login portal (`/login`) is universal. Simply enter the email and password, and the system automatically routes you to the correct dashboard based on your database role.

---

## 🔌 REST API Endpoints Reference

All API requests return standardized JSON responses: `{ "success": true, "data": ..., "message": "..." }`.

<details>
<summary><strong>📡 Click to expand Full API Endpoints Table</strong></summary>

### Authentication (`/api/auth/`)
| Method | Endpoint | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/auth/register.php` | Register new citizen account | Public |
| `POST` | `/api/auth/login.php` | Authenticate user & start session | Public |
| `POST` | `/api/auth/logout.php` | Destroy session & invalidate cookie | Authenticated |
| `GET` | `/api/auth/me.php` | Validate active session & return profile | Authenticated |
| `GET` | `/api/auth/csrf.php` | Fetch fresh CSRF protection token | Public |

### Complaints (`/api/complaints/`)
| Method | Endpoint | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/complaints/my_complaints.php` | List complaints submitted by logged-in citizen | Citizen |
| `GET` | `/api/complaints/details.php?id={id}` | Get complete complaint details & audit trail | Authenticated (Owner/Admin/Dept) |
| `POST` | `/api/complaints/create.php` | Submit new civic complaint with photo evidence | Citizen |
| `POST` | `/api/complaints/feedback.php` | Submit satisfaction rating (1-5) and feedback | Citizen (Owner) |

### Administration (`/api/admin/`)
| Method | Endpoint | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/admin/complaints.php` | Retrieve all city complaints with filters & metrics | Administrator |
| `POST` | `/api/admin/update_complaint.php` | Triage priority, allocate department, add remarks | Administrator |

### Department Operations (`/api/department/`)
| Method | Endpoint | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/department/complaints.php` | Retrieve assigned department work orders & metrics | Department / Admin |
| `POST` | `/api/department/update_status.php` | Update status (`In Progress`, `Resolved`) & upload photo | Department / Admin |

### Categories & Departments Reference
| Method | Endpoint | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/categories/index.php` | Get category hierarchy tree & subcategories | Public |
| `GET` | `/api/departments/index.php` | List active municipal departments | Authenticated |

</details>

---

## 📁 Project Directory Structure

```text
CivicResolve/
├── api/                             # Core PHP REST API
│   ├── admin/                      # Administrator management endpoints
│   ├── auth/                       # Session authentication & CSRF
│   ├── categories/                 # Category hierarchy endpoints
│   ├── complaints/                 # Citizen complaints CRUD & feedback
│   ├── config/                     # Database connection & CORS config
│   ├── department/                 # Department field work orders
│   ├── departments/                # Department reference lists
│   ├── helpers/                    # JSON responders & secure uploader
│   └── uploads/complaints/         # Photo evidence storage directory
├── public/                          # Static public assets (favicons, icons)
├── src/                             # React + TypeScript Frontend
│   ├── api/                        # Type-safe API client (client.ts)
│   ├── components/common/          # Location maps, navbar, modals, badges
│   │   ├── LocationPickerMap.tsx   # Interactive OpenStreetMap pin dropper
│   │   ├── LocationViewMap.tsx     # Defect location viewer map
│   │   ├── PortalNavbar.tsx        # Role-aware portal navigation bar
│   │   └── StatusBadge.tsx         # Color-coded workflow badge
│   ├── context/                    # AuthContext session provider
│   ├── pages/                      # Application route views
│   │   ├── LandingPage.tsx         # Modern landing page & feature showcase
│   │   ├── Login.tsx               # Universal role authentication page
│   │   ├── admin/                  # Admin dashboard, complaints, analytics
│   │   ├── citizen/                # Citizen dashboard, report issue, details
│   │   └── department/             # Department work orders & status updates
│   ├── routes.tsx                  # React Router role-protected routes
│   └── index.css                   # Global styling and animations
├── package.json                     # NPM packages & build scripts
├── vite.config.ts                   # Vite configuration with API proxy
└── README.md                        # Project documentation
```

---

## 📄 License & Acknowledgements

- **Developed for:** Municipal Grievance Redressal and Civic Infrastructure Redressal.
- **Maps:** Powered by [OpenStreetMap](https://www.openstreetmap.org/) and [Leaflet.js](https://leafletjs.com/).
- **Icons:** Designed with [Lucide React](https://lucide.dev/).
- **Open Source:** Available under the [MIT License](LICENSE).
