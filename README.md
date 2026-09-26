# 💸 FinFlow — Smarter Finance. Faster Flow.

> **Next-Generation Enterprise Financial Intelligence, Autonomous ERP Ledger Reconciliation & AI-Powered Invoice Remediation Engine.**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-In--Memory_/_Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

---

## 🌟 Executive Summary & Problem Statement

Modern enterprise finance and treasury teams spend up to **47% of their working hours** manually matching invoices, cross-referencing Purchase Orders (POs), hunting down reconciliation discrepancies, and addressing cash leakage.

### The Real Enterprise Cost of Fragmented Finance:
1. **Reconciliation Lag**: Invoices get stuck across email inboxes, ERPs (SAP/Oracle), and payment gateways with an average discrepancy rate of **18.4%**.
2. **Late Payment Penalties**: Missing vendor payment deadlines leads to severe vendor friction and loss of 2–5% early-payment commercial discounts.
3. **Budget Blind Spots**: Departments routinely exceed allocated operational expenditure without real-time alerting or automated spend guardrails.
4. **Audit Vulnerabilities**: Lack of immutable, timestamped remediation logs creates critical risks during statutory tax audits.

### The FinFlow Solution:
**FinFlow** provides an end-to-end, high-precision financial intelligence platform with:
- **Zero-Friction Ingestion**: Drag-and-drop CSV importer that parses 1,000+ invoices in milliseconds with entity/project folder routing.
- **Autonomous Discrepancy Detection**: Instant identification of amount mismatches, duplicate billings, tax variances, and PO number desynchronizations.
- **1-Click AI Root Cause Remediation**: Automated forensic audit trails powered by Google Gemini (with local fallback heuristics).
- **Dual-Ledger SAP Synchronization**: Real-time mock ERP integration bridging operational cash flows with general ledger accounting.
- **Executive C-Suite Overview**: Single pane of glass for real-time liquidity, cash burn velocity, and department-level spend health.

---

## 📂 Repository Architecture (Monorepo)

FinFlow is organized as a clean, production-grade monorepo separating frontend client logic from backend financial microservices:

```
FINFLOW/
├── backend/                        # Express.js REST API & AI Forensic Services
│   ├── config/                     # Database connection & embedded in-memory MongoDB fallback
│   │   └── db.js
│   ├── controllers/                # API Request Handlers & Business Controllers
│   │   ├── dashboardController.js  # Executive KPIs, aggregates, invoice filtering
│   │   ├── insightsController.js   # Forensic anomaly detection & discrepancy analytics
│   │   ├── remediationController.js# 1-Click invoice resolution & audit trail logging
│   │   ├── reportController.js     # Executive summary & compliance reports
│   │   └── sapController.js        # Dual-ledger SAP ERP synchronization
│   ├── middleware/                 # Security, CORS, logging & global error interceptors
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/                     # Mongoose Schemas & Persistence Definitions
│   │   ├── Invoice.js              # Standardized invoice ledger schema
│   │   └── RemediationLog.js       # Immutable audit log entries
│   ├── routes/                     # Modular API v1 Routes
│   │   ├── dashboardRoutes.js
│   │   ├── insightsRoutes.js
│   │   ├── remediationRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── sapRoutes.js
│   │   └── index.js
│   ├── services/                   # Core Analytical Engines
│   │   ├── aiService.js            # Gemini 2.5 Flash client with deterministic fallback
│   │   ├── remediationService.js   # Automated calculation of tax & discrepancy diffs
│   │   └── sapSyncService.js       # Bidirectional SAP staging simulation
│   ├── utils/                      # Data Seeding & Math Helpers
│   │   ├── calculationHelpers.js   # Weighted averages, percentage variance formulas
│   │   ├── runSeed.js              # Standalone seeding script
│   │   └── seedData.js             # 115+ synthetic realistic enterprise invoices
│   ├── .env.example                # Backend environment template
│   ├── package.json                # Backend dependencies & script definitions
│   ├── server.js                   # Main application entry point (Port 5001)
│   └── testApi.js                  # Automated endpoint verification suite
│
├── frontend/                       # Next.js 14 Client App (App Router + Tailwind)
│   ├── public/                     # Brand assets, vectors, and icons
│   │   ├── logo.png
│   │   ├── logo-full.png
│   │   └── logo-icon.png
│   ├── src/
│   │   ├── app/                    # Next.js App Router (Layout & Entry Page)
│   │   │   ├── globals.css         # Custom typography & design system tokens
│   │   │   ├── layout.tsx          # Root HTML layout with viewport & font configs
│   │   │   └── page.tsx            # Dynamic tab-driven workspace shell
│   │   ├── components/             # Reusable, Accessible Component Architecture
│   │   │   ├── charts/             # Interactive data visualizations (Recharts)
│   │   │   │   ├── BudgetBarChart.tsx
│   │   │   │   ├── CashFlowChart.tsx
│   │   │   │   └── CategoryDonut.tsx
│   │   │   ├── dashboard/          # Metric cards, savings goals, recent transactions
│   │   │   │   ├── RecentTransactionsTable.tsx
│   │   │   │   ├── SavingsGoalCard.tsx
│   │   │   │   └── StatCard.tsx
│   │   │   ├── modals/             # Action dialogs
│   │   │   │   ├── AddTransactionModal.tsx
│   │   │   │   └── ImportTransactionsModal.tsx # With on-the-fly Project Creator
│   │   │   ├── shared/             # Layout navigation & shared controls
│   │   │   │   ├── CommandPalette.tsx          # Keyboard-driven (⌘K) quick launcher
│   │   │   │   ├── Header.tsx                  # Executive SaaS navigation bar
│   │   │   │   ├── Sidebar.tsx                 # Sleek desktop & mobile navigation
│   │   │   │   └── TimeRangeSection.tsx        # Horizon audit bar (Today to Year)
│   │   │   └── views/              # Full-featured tab views
│   │   │       ├── AnalyticsView.tsx
│   │   │       ├── BudgetsView.tsx
│   │   │       ├── DashboardView.tsx
│   │   │       ├── HRView.tsx                  # Payroll & employee claims portal
│   │   │       ├── LandingPageView.tsx         # Product story & solution architecture
│   │   │       ├── ProjectsView.tsx            # Multi-entity & project folder manager
│   │   │       ├── SettingsView.tsx            # Data management & profile config
│   │   │       └── TransactionsView.tsx        # Full ledger explorer
│   │   ├── context/
│   │   │   └── FinFlowContext.tsx  # Centralized reactive state store
│   │   └── lib/
│   │       ├── mockData.ts         # Enterprise financial baseline dataset
│   │       ├── types.ts            # Strict TypeScript interfaces
│   │       ├── utils.ts            # Formatting (INR/USD), dates, styling helpers
│   │       └── validators/         # Zod schemas for ledger ingestion
│   ├── next.config.mjs             # Next.js runtime configuration
│   ├── package.json                # Frontend client dependencies
│   ├── tailwind.config.ts          # Tailwind palette & typography system
│   └── tsconfig.json               # TypeScript strict configuration
│
├── .gitignore                      # Monorepo unified gitignore
├── package.json                    # Root task runner scripts (run both or either)
└── README.md                       # Comprehensive platform documentation
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/durga-ojha611/finflow.git
cd FINFLOW
```

### 2. Install All Dependencies (Single Command)
From the root directory, install dependencies for both backend and frontend simultaneously:
```bash
npm run install:all
```
*(Or navigate to `backend/` and `frontend/` individually and run `npm install`.)*

### 3. Environment Configuration
The backend comes pre-configured with **Zero-Config In-Memory MongoDB** out of the box, meaning you can start the application immediately without installing MongoDB locally or providing an Atlas cluster!

If you wish to customize keys:
```bash
cd backend
cp .env.example .env
```
Inside `backend/.env`:
```ini
PORT=5001
NODE_ENV=development
# Leave blank to use zero-config embedded MongoDB, or provide MongoDB Atlas URI:
MONGODB_URI=
# Optional: Google Gemini API key for live AI forensic analysis
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
CORS_ORIGIN=*
```

---

## 🚀 Running the Platform

You can run the backend and frontend using either the root monorepo scripts or dedicated terminals:

### Option A: From Root Directory (Recommended)
Open two terminal tabs in the `FINFLOW/` root directory:

**Terminal 1 — Backend API Server (Port 5001):**
```bash
npm run start:backend
```

**Terminal 2 — Frontend Next.js Client (Port 3000):**
```bash
npm run dev:frontend
```

### Option B: From Individual Sub-Folders

**Start Backend:**
```bash
cd backend
npm start
# Active at http://localhost:5001
```

**Start Frontend:**
```bash
cd frontend
npm run dev
# Active at http://localhost:3000
```

Once running, navigate to **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🛠️ Key Platform Features

### 1. Multi-Entity & Project Workspace Folders
- Create dedicated workspace folders (e.g., `Q4 Logistics Expansion`, `Cloud Infrastructure Audit`).
- Scope all budgets, transactions, and metrics specifically to a single project or view the consolidated general ledger.
- **On-the-Fly Project Creation**: Create new entity folders directly inside the CSV Import modal without navigating away!

### 2. Autonomous CSV Ingestion & Parsing
- Drag-and-drop CSV parser handles thousands of ledger items in real time.
- Smart header auto-detection maps `Date`, `Vendor/Merchant`, `Amount`, `Category`, and `Reference/PO` columns automatically.
- Quick load preset: Includes a 1-click **1,250 Invoices Enterprise Batch** for high-volume load testing.

### 3. AI Forensic Discrepancy Analysis & Remediation
- Scans invoices for variance anomalies between operational POs and supplier invoices.
- **1-Click Remediation**: Applies mathematical variance reconciliation, generates audit-ready rationale, updates status to `RECONCILED`, and produces an immutable record.

### 4. Bidirectional SAP ERP Synchronization
- Simulates bidirectional ledger sync with enterprise SAP ERP systems.
- Visual staging indicator displays pending vs synced ledger records to ensure audit compliance.

### 5. HR & Payroll Operations
- Integrated portal for employee reimbursement claims.
- Track pending claim approvals, approve/reject with real-time budget deduction, and monitor company-wide payroll runs.

### 6. Keyboard Shortcuts & Command Palette
- Press **`Cmd + K`** (or `Ctrl + K`) anywhere to launch the global Command Palette.
- Press **`I`** to instantly trigger the CSV Ingestion Modal.

---

## 📡 Backend REST API Reference

The backend exposes a clean RESTful API mounted at `http://localhost:5001/api/v1`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server uptime and health verification status |
| `GET` | `/api/v1/dashboard/metrics` | Executive financial summary (Total spend, variance, discrepancy counts) |
| `GET` | `/api/v1/dashboard/invoices` | Paginated, filterable invoice ledger records |
| `GET` | `/api/v1/insights/analysis` | AI-powered discrepancy analysis & root cause breakdown |
| `POST` | `/api/v1/remediation/reconcile` | 1-Click remediation of discrepant invoices with audit log generation |
| `GET` | `/api/v1/remediation/logs` | Fetch all historical immutable remediation audit logs |
| `POST` | `/api/v1/sap/sync` | Trigger bidirectional synchronization with SAP ERP |
| `GET` | `/api/v1/reports/summary` | Generate executive treasury compliance & audit reports |

### Health Check Example
```bash
curl -X GET http://localhost:5001/health
```
**Response:**
```json
{
  "status": "HEALTHY",
  "service": "FinFlow AI Backend Engine",
  "uptime": 120,
  "timestamp": "2026-09-26T08:45:00.000Z"
}
```

---

## 📥 Sample CSV Format for Uploads

You can import any custom CSV file. FinFlow's parser automatically detects the following header conventions:

```csv
Date,Merchant,Category,Type,Amount,Notes
2026-09-15,Amazon Web Services,Utilities,EXPENSE,42500,Cloud compute invoice PO-8841
2026-09-18,Razorpay Technologies,Salary & Bonus,INCOME,285000,Q3 Treasury settlement
2026-09-20,WeWork Global,Housing,EXPENSE,65000,Bangalore headquarters lease
2026-09-22,Google Workspace,Utilities,EXPENSE,14200,Enterprise collaboration suite
2026-09-24,Tata Consultancy,Freelance,EXPENSE,120000,Contract development PO-9021
```

A downloadable sample template is also provided directly within the **Import CSV** modal in the UI.

---

## 🏗️ Production Build

To create an optimized production build of the frontend:

```bash
cd frontend
npm run build
npm run start
```

The production bundle is minified, statically optimized, and ready for high-concurrency enterprise deployment on Vercel, AWS ECS, or Docker.

---

## 🔒 Security & Data Integrity

- **Environment Isolation**: All sensitive credentials (`.env`) are strictly ignored from Git version control.
- **Input Validation**: Client-side validation powered by strict TypeScript types and Zod schemas, complemented by server-side Mongoose schema casting.
- **Audit Immutability**: All remediation actions append to an append-only audit trail collection with actor timestamps and before/after state diffs.

---

## 👥 Contributors & Acknowledgments

- **Product & Architecture**: FinFlow Engineering Team ([@durga-ojha611](https://github.com/durga-ojha611))
- **Design Philosophy**: Minimalist slate enterprise aesthetic inspired by modern treasury leaders (Stripe, Mercury, Ramp).

---

© 2026 FinFlow. All rights reserved. Smarter Finance. Faster Flow.
