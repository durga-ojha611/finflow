# 🌊 FinFlow — Calm Financial Process Intelligence & Wealth Flow Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20(App%20Router)-black?style=flat&logo=next.js)](https://nextjs.org)
[![React 18](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Design_Tokens-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-22C55E?style=flat)](https://recharts.org)
[![Node.js](https://img.shields.io/badge/Node.js-v22-339933?style=flat&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?style=flat&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_%26_In--Memory-47A248?style=flat&logo=mongodb)](https://www.mongodb.com)
[![AI Engine](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-8E75C4?style=flat&logo=google)](https://ai.google.dev)
[![Status](https://img.shields.io/badge/Build-Passing%20(15%2F15)-success?style=flat)](#-verification--testing)

---

## 🌟 1. Executive Summary & Product Vision

**FinFlow** is a modern, light-themed financial process intelligence and wealth flow management platform designed around the philosophy of **calm confidence**. 

Financial software is often cluttered, loud, and stress-inducing. FinFlow strips away cognitive friction with generous whitespace, subtle hairline dividers, a serene emerald and slate color palette (`#10B981`), `tabular-nums` financial typography, and real-time reactive analytics. Users feel in absolute control of their financial trajectory without feeling overwhelmed.

---

## 📸 2. Quick Links

- 🌐 **Frontend Web Application (Main Dashboard):** [http://localhost:3000](http://localhost:3000)
- 📡 **Backend API & Service Discovery:** [http://localhost:5001/api/v1](http://localhost:5001/api/v1)
- 🩺 **System Health Check:** [http://localhost:5001/health](http://localhost:5001/health)

---

## 🎨 3. Design System & Branding Tokens

The design system enforces high visual harmony, content-first readability, and WCAG AA accessibility:

| Role | Token | Hex / Value | Usage & Intent |
|---|---|---|---|
| **Primary Background** | `--bg-primary` | `#FFFFFF` | Page canvas, elevated card backgrounds |
| **Secondary Background** | `--bg-secondary` | `#F8FAF9` | Main viewport contrast, subtle mint tint |
| **Brand Primary** | `--brand-500` | `#10B981` | Primary CTAs, active indicators, positive flows |
| **Brand Light** | `--brand-400` | `#34D399` | Hover states, gradient fills |
| **Brand Soft** | `--brand-50` | `#ECFDF5` | Badge backgrounds, active pill highlights |
| **Text Primary** | `--text-primary` | `#0F172A` | Slate-900 headlines & bold monetary figures |
| **Text Secondary** | `--text-secondary` | `#64748B` | Slate-500 labels, captions, metadata |
| **Border Subtle** | `--border-subtle` | `#E2E8F0` / `#F1F5F9` | Hairline dividers (`border-slate-100`) |
| **Inflow / Success** | `--success` | `#10B981` | Income additions, completed transactions |
| **Outflow / Danger** | `--danger` | `#EF4444` | Expenditures, budget overruns |
| **Warning / Alert** | `--warning` | `#F59E0B` | Approaching 80%+ threshold warning |

> **Design Rule:** Pure black (`#000000`) and uncalibrated greys are strictly prohibited. All typography routes through the Slate scale (`#0F172A` to `#64748B`) for warmth and visual cohesion.

---

## 🏛️ 4. Full-Stack Architecture

FinFlow is engineered with clean separation of concerns, featuring an App Router Next.js frontend alongside an autonomous Express/MongoDB AI backend:

```
FINFLOW/
│
├── frontend/                                # Next.js 14 + Tailwind CSS + TypeScript (Port 3000)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                   # Master RootLayout with typography, metadata & provider
│   │   │   ├── page.tsx                     # Core orchestrator: App shell, view routing, dialogs
│   │   │   └── globals.css                  # CSS variables, tabular-nums & custom scrollbar
│   │   │
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── Sidebar.tsx              # Collapsible desktop & mobile drawer with wave glyph logo
│   │   │   │   ├── Header.tsx               # Personalized greeting, date presets & quick actions
│   │   │   │   └── CommandPalette.tsx       # Global ⌘K search across ledger and system navigation
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── CashFlowChart.tsx        # Recharts dual-area chart (Inflow vs Outflow)
│   │   │   │   ├── CategoryDonut.tsx        # Recharts donut chart with interactive click-to-filter
│   │   │   │   └── BudgetBarChart.tsx       # Recharts budget vs actual with overage alerts
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.tsx             # 4-col summary card with SVG sparkline & trend chip
│   │   │   │   ├── SavingsGoalCard.tsx      # Goal progress meters with celebratory confetti
│   │   │   │   └── RecentTransactionsTable.tsx # Interactive ledger with filters & row actions
│   │   │   │
│   │   │   ├── modals/
│   │   │   │   └── AddTransactionModal.tsx  # Segmented Income/Expense modal with Zod validation
│   │   │   │
│   │   │   └── views/
│   │   │       ├── DashboardView.tsx        # Executive overview (KPIs, Cash Flow, Donut, Goals)
│   │   │       ├── TransactionsView.tsx     # Full ledger with CSV export & volume statistics
│   │   │       ├── AnalyticsView.tsx        # Financial Health Score (0-100 gauge), forensic cards
│   │   │       ├── BudgetsView.tsx          # Guardrail cards with progress meters & creation modal
│   │   │       └── SettingsView.tsx         # Currency switcher (INR, USD, EUR, GBP), linked banks
│   │   │
│   │   ├── context/
│   │   │   └── FinFlowContext.tsx           # Reactive global state with auto-computed KPIs
│   │   │
│   │   └── lib/
│   │       ├── types.ts                     # Strongly typed interfaces (Transaction, Budget, Goal)
│   │       ├── mockData.ts                  # Realistic 30+ transactions, budgets & savings goals
│   │       ├── utils.ts                     # Currency formatting (₹), date parsing, category colors
│   │       └── validators/
│   │           └── transactionSchema.ts     # Zod schema for validated inputs
│   │
│   ├── package.json
│   └── tailwind.config.ts                   # Custom typography, spacing & FinFlow colors
│
├── server.js                                # Express backend entrypoint & route mounter (Port 5001)
├── package.json                             # Root package & scripts (dev, dev:frontend, test:api)
├── .env / .env.example                      # Backend environment configuration
├── testApi.js                               # Automated End-to-End API test suite (15/15 passed)
│
├── config/
│   └── db.js                                # MongoDB Atlas connection with zero-setup in-memory fallback
│
├── models/
│   ├── Invoice.js                           # Mongoose schema with automated SLA & loss calculation hooks
│   └── RemediationLog.js                    # Audit trail schema for autonomous remediation actions
│
├── routes/
│   ├── index.js                             # Master /api/v1 router & service discovery
│   ├── sapRoutes.js                         # ERP invoice queries, 2-way sync, and seed triggers
│   ├── dashboardRoutes.js                   # Executive metrics & pipeline SLA benchmarks
│   ├── insightsRoutes.js                    # AI Forensic diagnostic engine endpoints
│   ├── remediationRoutes.js                 # 1-Click autonomous remediation triggers & audit logs
│   └── reportRoutes.js                      # CFO executive audit and savings projections
│
├── controllers/
│   ├── sapController.js                     # SAP ERP table queries, filtering, and OData sync
│   ├── dashboardController.js               # Real-time MongoDB aggregations for dashboard charts
│   ├── insightsController.js                # Controller bridging data to the AI forensic service
│   ├── remediationController.js             # Remediation trigger execution & log queries
│   └── reportController.js                  # CFO audit summary calculations & efficiency metrics
│
├── services/
│   ├── aiService.js                         # Gemini 2.5 Flash GenAI integration with heuristic fallback
│   ├── sapSyncService.js                    # SAP S/4HANA OData 2-way sync simulation engine
│   └── remediationService.js                # Remediation actions (Slack ping, Request Docs, Auto-Reroute)
│
├── middleware/
│   ├── errorHandler.js                      # Production-grade centralized error handler
│   └── notFound.js                          # 404 handler for unknown resources
│
└── utils/
    ├── calculationHelpers.js                # SLA targets, days stuck, and financial loss formulas
    ├── seedData.js                          # Realistic synthetic dataset generator (115 enterprise invoices)
    └── runSeed.js                           # Standalone CLI seeding script
```

---

## ⚡ 5. Quick Start & Local Execution

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Optional (FinFlow automatically starts an embedded zero-setup In-Memory MongoDB if no external Atlas URI is supplied)

### Step 1: Install Dependencies
```bash
# Install root and backend dependencies
npm install

# Install frontend dependencies
npm --prefix frontend install
```

### Step 2: Configure Environment
Copy the `.env.example` template:
```bash
cp .env.example .env
```
*(Default settings run out-of-the-box with embedded in-memory MongoDB and local heuristic AI fallback. You may optionally supply a `MONGODB_URI` and `GEMINI_API_KEY`.)*

### Step 3: Launch Both Frontend & Backend

You can run both concurrently in separate terminals:

```bash
# Terminal 1: Launch the Next.js Frontend (Port 3000)
npm run dev:frontend

# Terminal 2: Launch the Express Backend (Port 5001)
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🖥️ 6. Frontend Features & User Experience

### 6.1 Executive Dashboard View (`DashboardView`)
- **4-Column Dynamic KPI Cards**:
  - **Total Net Liquidity**: Displays combined liquid capital with background SVG sparklines and `+12.5%` trend chip.
  - **Monthly Inflows**: Tracks verified salaries, dividends, and consulting retainers.
  - **Monthly Outflows**: Outflow tracking with budget discipline comparison.
  - **Net Cash Retained**: Dynamic savings rate percentage badge.
- **Cash Flow Area Chart (`<CashFlowChart />`)**:
  - Recharts dual-area chart comparing Inflows vs Outflows across 6 months.
  - Emerald linear gradient fill (`#10B981` to transparent) with custom tabular tooltips.
- **Spending by Category (`<CategoryDonut />`)**:
  - Interactive donut chart with center total spend indicator.
  - **Click-to-filter capability**: Clicking any category slice filters the transaction table in real time.
- **Savings Goals Card (`<SavingsGoalCard />`)**:
  - Progress bars with target dates and funding percentages.
  - Quick "+₹25k" contribute button triggering celebratory confetti animations.

### 6.2 Transaction Ledger (`<TransactionsView />`)
- **Full Ledger Search**: Instant multi-attribute search across merchants, notes, and categories.
- **Segmented Filters**: Quick toggles for `All`, `Inflows (+)` and `Outflows (-)`.
- **Row Context Menu**: 1-click **Duplicate** or **Delete** actions with immediate state recalculation.
- **CSV Export**: Direct download of formatted CSV statements.

### 6.3 Autonomous Command Palette (`<CommandPalette />`)
- Accessible via **`⌘K`** (Mac) or **`Ctrl+K`** (Windows/Linux) or by clicking the header search input.
- Real-time fuzzy search across all recorded transactions.
- Quick navigation to any page or direct trigger for "+ Create New Transaction".

### 6.4 Add Transaction Modal (`<AddTransactionModal />`)
- Accessible via the top CTA or by pressing the **`N`** key.
- Segmented toggle between `Expense / Outflow` and `Income / Inflow`.
- Real-time Zod schema validation, numeric constraint enforcement, and micro-animated submission feedback.

### 6.5 Financial Health Index & Analytics (`<AnalyticsView />`)
- **0–100 Health Gauge**: Dynamically computed from savings rate, budget discipline, and debt-to-asset ratios.
- **AI Forensic Diagnostic Card**: Plain-English synthesis highlighting spending surges and cash yield opportunities.
- **Budget vs Actual Bar Chart (`<BudgetBarChart />`)**: Highlights over-budget categories in amber/red.

### 6.6 Budgets & Guardrails (`<BudgetsView />`)
- Card-based budget monitoring with progress bars that transition from green (`<80%`) to amber (`80-99%`) to red (`100%+`).
- "+ Create Budget" dialog with category selection and monthly limit assignment.

### 6.7 Settings & Multi-Currency (`<SettingsView />`)
- **Instant Currency Switcher**: Switch seamlessly between **INR (₹)**, **USD ($)**, **EUR (€)**, and **GBP (£)** — updating all monetary numbers across the app instantly.
- Profile management and synchronized banking entity overview.
- 1-click **"Reset Demo State"** to restore seed data.

---

## 🗄️ 7. Backend API Specification (`/api/v1`)

The backend exposes a clean, modular RESTful API under `/api/v1`:

### 7.1 SAP ERP & Sync Routes (`/api/v1/sap`)
| Method | Endpoint | Query / Body Params | Description |
|---|---|---|---|
| `GET` | `/api/v1/sap/invoices` | `?page=1&limit=10&status=&stage=&search=&sortBy=` | Paginated ERP invoices with multi-field search & filtering |
| `POST` | `/api/v1/sap/sync` | *None* | Simulates 2-way OData sync with SAP S/4HANA ERP; recalculates delay flags & SLA violations |
| `POST` | `/api/v1/sap/seed` | *None* | Wipes collections and seeds 100+ realistic synthetic enterprise invoices |

### 7.2 Executive Dashboard Routes (`/api/v1/dashboard`)
| Method | Endpoint | Description | Sample Output |
|---|---|---|---|
| `GET` | `/api/v1/dashboard/metrics` | Calculates total invoices, delayed count, total amount, primary bottleneck, and dynamic financial loss | `{ "totalInvoices": 115, "delayedInvoices": 53, "totalFinancialLoss": 2845000, "primaryBottleneckStage": "Manager Approval" }` |
| `GET` | `/api/v1/dashboard/pipeline` | Average cycle days per stage vs target SLA limits formatted for Chart.js / Recharts | `[{ "stage": "Manager Approval", "avgDays": 5.6, "targetSLA": 2, "status": "CRITICAL_BOTTLENECK" }]` |

### 7.3 AI Forensic Diagnostics (`/api/v1/insights`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/insights/analysis` | Triggers the AI Forensic Engine using Google Gemini 2.5 Flash (or local heuristic engine) to diagnose operational bottlenecks |

**Guaranteed AI JSON Response Schema:**
```json
{
  "primaryBottleneck": "Manager Approval Stage",
  "averageDelayDays": 4.8,
  "financialLossINR": 485000,
  "rootCauseBreakdown": [
    { "cause": "Missing GST/Tax Documents from Vendors", "percentage": 65 },
    { "cause": "Approval Workload Overload on Manager A", "percentage": 35 }
  ],
  "executiveSummary": "Manager Approval is experiencing a severe 4.8-day delay driven primarily by non-compliant vendor GST documentation and manager queue saturation.",
  "recommendedActions": [
    "Dispatch automated document upload links to blocked vendors",
    "Auto-reroute SLA-violated items to alternate co-approvers"
  ]
}
```

### 7.4 Autonomous Remediation Routes (`/api/v1/remediation`)
| Method | Endpoint | Payload | Description |
|---|---|---|---|
| `POST` | `/api/v1/remediation/trigger` | `{ "actionType": "REQUEST_DOCS" }` | Executes 1-click remediation (`SLACK_PING`, `REQUEST_DOCS`, or `AUTO_REROUTE`). **Dynamically reduces financial loss on the dashboard.** |
| `GET` | `/api/v1/remediation/logs` | `?page=1&limit=20` | Returns historical audit trail of all executed remediation runs |

### 7.5 CFO Executive Reports (`/api/v1/reports`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/reports/summary` | Returns CFO audit report metrics: projected annual savings in INR, cycle time reduction %, department ROI breakdown |

---

## 💰 8. Business Logic & Dynamic Loss Formula

### 8.1 Stage SLA Targets
| Stage | Target SLA |
|---|---|
| **Invoice Receipt** | 2 Days |
| **Verification** | 3 Days |
| **Manager Approval** | 2 Days |
| **Payment Disbursement** | 2 Days |
| **Total Standard Cycle** | **9 Days** |

### 8.2 Dynamic Financial Loss Formula
```
Total Financial Loss = Forfeited Early Settlement Discount + SLA Delay Penalty
```
- **Forfeited Early Discount**: `Invoice Amount * 2%` (2% early payment discount lost if payment is overdue).
- **SLA Delay Penalty**: `₹1,200 * Overdue Days` past `approvalDueDate`.
- **Dynamic Mitigation Loop**: Triggering `REQUEST_DOCS` resolves documentation issues to `Complete`, while `AUTO_REROUTE` reassigns overdue items to co-approvers with SLA extensions. Both actions immediately reset `isDelayed: false` and **dynamically decrement total financial loss on the executive dashboard**.

---

## 🧪 9. Verification & Testing

FinFlow includes an automated integration test suite that tests all 15 core API endpoints, validates JSON schemas, and asserts dynamic loss reduction:

```bash
# Run automated API validation suite
npm run test:api
```

**Test Execution Results:**
```
====================================================
🧪 Running FinFlow AI Backend API Validation Suite
Target: http://localhost:5001
====================================================

✔ PASS: System health check is online (uptime: 12s)
✔ PASS: API v1 discovery endpoint returned route map 
✔ PASS: Seeded 100+ synthetic financial invoices (Count: 115)
✔ PASS: Fetched ERP invoices with pagination & status filter (Returned: 5, Total matching: 29)
✔ PASS: Vendor search filtering works correctly (Found 9 matches for "Tata")
✔ PASS: SAP S/4HANA 2-way OData sync executed (Examined: 115, SLA Violations: 93)
✔ PASS: Dashboard aggregated metrics calculated (Loss: ₹39,25,639, Bottleneck: Verification)
✔ PASS: Pipeline stage vs SLA benchmarks retrieved (Stages: 4)
✔ PASS: AI Forensic Diagnostic returned strict JSON schema (Primary: Verification Stage, Delay: 15.7d)
✔ PASS: Remediation SLACK_PING alert dispatched (Approvers notified: 60)
✔ PASS: Remediation REQUEST_DOCS automated dispatch (Resolved documents on 74 invoices)
✔ PASS: Remediation AUTO_REROUTE executed (Rerouted 46 bottlenecked approvals)
✔ PASS: CRITICAL: Financial loss decreased dynamically on dashboard (Decreased by ₹20,22,802)
✔ PASS: Remediation audit logs retrieved with full history (Total logged actions: 4)
✔ PASS: CFO Executive Audit Report generated (Projected Annual Savings: ₹2,34,55,044)

====================================================
Test Results: 15 Passed | 0 Failed
====================================================
```

---

## ⌨️ 10. Keyboard Shortcuts Reference

| Shortcut | Action | Scope |
|---|---|---|
| **`⌘ + K`** / **`Ctrl + K`** | Open Command Palette (Search & Jump) | Global |
| **`N`** | Open "+ Add Transaction" Modal | Global (outside inputs) |
| **`Esc`** | Close any open modal / palette | Modals |

---

## 📜 11. Scripts Directory

| Script | Command | Action |
|---|---|---|
| `npm run dev:frontend` | `npm --prefix frontend run dev` | Starts Next.js dev server on `http://localhost:3000` |
| `npm run build:frontend` | `npm --prefix frontend run build` | Compiles optimized Next.js production build |
| `npm run start:frontend` | `npm --prefix frontend start` | Runs Next.js production server on `http://localhost:3000` |
| `npm run dev` | `node --watch server.js` | Starts Express backend on `http://localhost:5001` with auto-reload |
| `npm start` | `node server.js` | Starts Express backend in production mode |
| `npm run seed` | `node utils/runSeed.js` | Reseeds database with 115 synthetic financial invoices |
| `npm run test:api` | `node testApi.js` | Runs full 15-test automated validation suite |

---

## 📄 License
This project is licensed under the ISC License. Designed and built for FinFlow Process Intelligence.
# finflow
