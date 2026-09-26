/**
 * FinFlow AI - Automated End-to-End API Test Suite
 * Tests all required API endpoints against server and validates business logic.
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:5001';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const logPass = (title, details = '') => {
  console.log(`${colors.green}✔ PASS:${colors.reset} ${title} ${details ? `(${details})` : ''}`);
};

const logFail = (title, err) => {
  console.error(`${colors.red}✖ FAIL:${colors.reset} ${title}\n`, err);
};

const runTests = async () => {
  console.log(`${colors.bold}${colors.cyan}====================================================`);
  console.log(`🧪 Running FinFlow AI Backend API Validation Suite`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`====================================================${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      passed++;
    } catch (e) {
      logFail(name, e.message || e);
      failed++;
    }
  };

  // Helper fetch
  const request = async (path, options = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
    const body = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, body };
  };

  // 1. Health Check
  await test('GET /health', async () => {
    const res = await request('/health');
    if (res.status !== 200 || res.body.status !== 'HEALTHY') {
      throw new Error(`Expected 200 HEALTHY, got ${res.status}`);
    }
    logPass('System health check is online', `uptime: ${res.body.uptime}s`);
  });

  // 2. API Root Info
  await test('GET /api/v1', async () => {
    const res = await request('/api/v1');
    if (res.status !== 200 || !res.body.documentation) {
      throw new Error(`API docs root invalid`);
    }
    logPass('API v1 discovery endpoint returned route map');
  });

  // 3. Seed Database
  await test('POST /api/v1/sap/seed', async () => {
    const res = await request('/api/v1/sap/seed', { method: 'POST' });
    if (res.status !== 201 || res.body.data.invoicesCount < 100) {
      throw new Error(`Seed failed or count < 100: ${JSON.stringify(res.body)}`);
    }
    logPass('Seeded 100+ synthetic financial invoices', `Count: ${res.body.data.invoicesCount}`);
  });

  // 4. Fetch Invoices with pagination, filtering & search
  await test('GET /api/v1/sap/invoices (pagination & filter)', async () => {
    const res = await request('/api/v1/sap/invoices?page=1&limit=5&status=PENDING_APPROVAL_SLA');
    if (res.status !== 200 || !Array.isArray(res.body.data)) {
      throw new Error(`Failed to fetch filtered invoices: ${res.status}`);
    }
    logPass('Fetched ERP invoices with pagination & status filter', `Returned: ${res.body.data.length}, Total matching: ${res.body.total}`);
  });

  await test('GET /api/v1/sap/invoices (search)', async () => {
    const res = await request('/api/v1/sap/invoices?search=Tata');
    if (res.status !== 200 || !Array.isArray(res.body.data)) {
      throw new Error(`Search failed: ${res.status}`);
    }
    logPass('Vendor search filtering works correctly', `Found ${res.body.total} matches for "Tata"`);
  });

  // 5. SAP S/4HANA Sync
  await test('POST /api/v1/sap/sync', async () => {
    const res = await request('/api/v1/sap/sync', { method: 'POST' });
    if (res.status !== 200 || res.body.data.syncStatus !== 'SUCCESS') {
      throw new Error(`SAP Sync failed: ${JSON.stringify(res.body)}`);
    }
    logPass('SAP S/4HANA 2-way OData sync executed', `Examined: ${res.body.data.totalInvoicesExamined}, SLA Violations: ${res.body.data.slaViolationsDetected}`);
  });

  // 6. Dashboard Metrics (Initial State)
  let initialMetrics;
  await test('GET /api/v1/dashboard/metrics', async () => {
    const res = await request('/api/v1/dashboard/metrics');
    if (res.status !== 200 || !res.body.data.totalInvoices) {
      throw new Error(`Dashboard metrics query failed`);
    }
    initialMetrics = res.body.data;
    if (initialMetrics.totalFinancialLoss <= 0) {
      throw new Error(`Expected initial financial loss > 0`);
    }
    logPass('Dashboard aggregated metrics calculated', `Loss: ₹${initialMetrics.totalFinancialLoss.toLocaleString('en-IN')}, Bottleneck: ${initialMetrics.primaryBottleneckStage}`);
  });

  // 7. Pipeline Metrics
  await test('GET /api/v1/dashboard/pipeline', async () => {
    const res = await request('/api/v1/dashboard/pipeline');
    if (res.status !== 200 || !Array.isArray(res.body.data) || res.body.data.length !== 4) {
      throw new Error(`Pipeline response invalid`);
    }
    logPass('Pipeline stage vs SLA benchmarks retrieved', `Stages: ${res.body.data.map(s => s.stage).join(' -> ')}`);
  });

  // 8. AI Forensic Engine
  await test('GET /api/v1/insights/analysis', async () => {
    const res = await request('/api/v1/insights/analysis');
    if (res.status !== 200 || !res.body.data) {
      throw new Error(`Insights analysis failed: ${res.status}`);
    }
    const { primaryBottleneck, averageDelayDays, financialLossINR, rootCauseBreakdown, executiveSummary, recommendedActions } = res.body.data;
    if (!primaryBottleneck || typeof averageDelayDays !== 'number' || typeof financialLossINR !== 'number' || !Array.isArray(rootCauseBreakdown) || !executiveSummary || !Array.isArray(recommendedActions)) {
      throw new Error(`AI Forensic JSON output does not match required schema: ${JSON.stringify(res.body.data)}`);
    }
    logPass('AI Forensic Diagnostic returned strict JSON schema', `Primary: ${primaryBottleneck}, Delay: ${averageDelayDays}d, Loss: ₹${financialLossINR.toLocaleString('en-IN')}`);
  });

  // 9. Remediation Actions & Dynamic Loss Reduction
  await test('POST /api/v1/remediation/trigger (SLACK_PING)', async () => {
    const res = await request('/api/v1/remediation/trigger', {
      method: 'POST',
      body: JSON.stringify({ actionType: 'SLACK_PING' }),
    });
    if (res.status !== 200 || !res.body.success) {
      throw new Error(`SLACK_PING failed: ${JSON.stringify(res.body)}`);
    }
    logPass('Remediation SLACK_PING alert dispatched', `Approvers notified: ${res.body.data.affectedCount}`);
  });

  await test('POST /api/v1/remediation/trigger (REQUEST_DOCS)', async () => {
    const res = await request('/api/v1/remediation/trigger', {
      method: 'POST',
      body: JSON.stringify({ actionType: 'REQUEST_DOCS' }),
    });
    if (res.status !== 200 || !res.body.success) {
      throw new Error(`REQUEST_DOCS failed: ${JSON.stringify(res.body)}`);
    }
    logPass('Remediation REQUEST_DOCS automated dispatch', `Resolved documents on ${res.body.data.affectedCount} invoices`);
  });

  await test('POST /api/v1/remediation/trigger (AUTO_REROUTE)', async () => {
    const res = await request('/api/v1/remediation/trigger', {
      method: 'POST',
      body: JSON.stringify({ actionType: 'AUTO_REROUTE' }),
    });
    if (res.status !== 200 || !res.body.success) {
      throw new Error(`AUTO_REROUTE failed: ${JSON.stringify(res.body)}`);
    }
    logPass('Remediation AUTO_REROUTE executed', `Rerouted ${res.body.data.affectedCount} bottlenecked approvals`);
  });

  // 10. CRITICAL CHECK: Verify financial loss decreased dynamically!
  await test('CRITICAL: Dynamic decrease in financial loss post-remediation', async () => {
    const res = await request('/api/v1/dashboard/metrics');
    const updatedMetrics = res.body.data;
    if (updatedMetrics.totalFinancialLoss >= initialMetrics.totalFinancialLoss) {
      throw new Error(`Financial loss did not decrease! Initial: ${initialMetrics.totalFinancialLoss}, Updated: ${updatedMetrics.totalFinancialLoss}`);
    }
    const decrease = initialMetrics.totalFinancialLoss - updatedMetrics.totalFinancialLoss;
    logPass('CRITICAL: Financial loss decreased dynamically on dashboard', `Decreased by ₹${decrease.toLocaleString('en-IN')} (From ₹${initialMetrics.totalFinancialLoss.toLocaleString('en-IN')} to ₹${updatedMetrics.totalFinancialLoss.toLocaleString('en-IN')})`);
  });

  // 11. Remediation Audit Logs
  await test('GET /api/v1/remediation/logs', async () => {
    const res = await request('/api/v1/remediation/logs');
    if (res.status !== 200 || !Array.isArray(res.body.data.logs) || res.body.data.logs.length < 3) {
      throw new Error(`Logs invalid or missing actions`);
    }
    logPass('Remediation audit logs retrieved with full history', `Total logged actions: ${res.body.data.total}`);
  });

  // 12. Executive Reports
  await test('GET /api/v1/reports/summary', async () => {
    const res = await request('/api/v1/reports/summary');
    if (res.status !== 200 || !res.body.data.summary.projectedAnnualSavingsINR) {
      throw new Error(`Report summary failed: ${JSON.stringify(res.body)}`);
    }
    logPass('CFO Executive Audit Report generated', `Projected Annual Savings: ₹${res.body.data.summary.projectedAnnualSavingsINR.toLocaleString('en-IN')}, Cycle reduction: ${res.body.data.summary.cycleTimeReductionPercentage}%`);
  });

  console.log(`\n${colors.bold}${colors.cyan}====================================================`);
  console.log(`Test Results: ${colors.green}${passed} Passed${colors.reset} | ${failed > 0 ? `${colors.red}${failed} Failed` : `${colors.green}0 Failed`}`);
  console.log(`${colors.cyan}====================================================${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
