// Complai Compliance Agent - Full-Stack Express Server & Supabase PostgreSQL Database

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase ssl connectivity
});

// Test Connection and Initialize Tables
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
  } else {
    console.log("Connected to Supabase PostgreSQL database successfully.");
    release();
    initDb();
  }
});

async function initDb() {
  try {
    // Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        sector TEXT NOT NULL,
        inc_date TEXT NOT NULL,
        share_capital INTEGER NOT NULL,
        employees INTEGER NOT NULL,
        foreign_participation TEXT NOT NULL,
        is_startup_labelled INTEGER DEFAULT 0,
        has_scuml INTEGER DEFAULT 0
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS income_rows (
        id SERIAL PRIMARY KEY,
        company_id TEXT NOT NULL,
        amount DOUBLE PRECISION NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS regulatory_updates (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        source TEXT NOT NULL,
        content TEXT NOT NULL,
        published_date TEXT NOT NULL
      )
    `);

    // Seed Initial Companies if table is empty
    const resComp = await pool.query("SELECT COUNT(*) as count FROM companies");
    if (parseInt(resComp.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO companies (id, name, type, sector, inc_date, share_capital, employees, foreign_participation, is_startup_labelled, has_scuml)
        VALUES 
          ('comp-1', 'Apex Tech Ventures Ltd', 'LTD', 'Tech Startup', '2025-02-15', 1000000, 12, 'no', 1, 0),
          ('comp-2', 'Zenith Real Estate & Build Co', 'LTD', 'Real Estate', '2024-08-01', 5000000, 6, 'yes', 0, 0)
      `);
      console.log("Seeded initial company compliance profiles.");
    }

    // Seed Regulatory Updates if empty
    const resUpdates = await pool.query("SELECT COUNT(*) as count FROM regulatory_updates");
    if (parseInt(resUpdates.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO regulatory_updates (title, source, content, published_date)
        VALUES 
          ('FIRS - WHT Amendment Regulations 2025', 'FIRS', 'New exemptions introduced for small businesses and lowered rates on specific local service contracts. Tax calculator updated.', '2026-06-15'),
          ('NDPC Data Protection Enforcement', 'NDPC', 'Registration portal is now fully active. Audits for all labelled startups must compile data maps by early 2027.', '2026-07-02'),
          ('CBN Foreign Exchange Policy 2026', 'CBN', 'Startups with eCCIs can now utilize single-window access for capital and dividend repatriation.', '2026-07-10')
      `);
      console.log("Seeded initial regulatory updates.");
    }
  } catch (err) {
    console.error("Database schema initialization failed:", err.message);
  }
}

// --- HELPER COMPLIANCE TIMELINE ENGINE ---
function calculateTimelines(comp, CURRENT_DATE) {
  const timelines = [];
  const incDateObj = new Date(comp.incDate);

  // 1. CAC Annual Returns
  let cacDueDate = new Date(incDateObj);
  cacDueDate.setMonth(cacDueDate.getMonth() + 18);
  const isOverdueCAC = CURRENT_DATE > cacDueDate;
  timelines.push({
    id: "cac_returns",
    name: "CAC Annual Returns Filing",
    description: "Mandatory corporate tax return and financial details filing to retain company registration.",
    dueDate: cacDueDate.toISOString().split('T')[0],
    status: isOverdueCAC ? "overdue" : "pending",
    badgeType: isOverdueCAC ? "badge-urgent" : "badge-upcoming",
    scoreImpact: 20
  });

  // 2. FIRS CIT
  let citDueDate = new Date(CURRENT_DATE.getFullYear(), 5, 30);
  if (CURRENT_DATE > citDueDate) {
    citDueDate = new Date(CURRENT_DATE.getFullYear() + 1, 5, 30);
  }
  timelines.push({
    id: "firs_cit",
    name: "FIRS Companies Income Tax (CIT)",
    description: "Annual filing of corporate tax computations based on the previous year's financials.",
    dueDate: citDueDate.toISOString().split('T')[0],
    status: "pending",
    badgeType: "badge-routine",
    scoreImpact: 15
  });

  // 3. FIRS VAT (21st of every month)
  let vatDueDate = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 21);
  if (CURRENT_DATE > vatDueDate) {
    vatDueDate = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth() + 1, 21);
  }
  timelines.push({
    id: "firs_vat",
    name: "Monthly FIRS VAT Remittance",
    description: "Monthly collection and filing of 7.5% Value Added Tax on eligible goods and services.",
    dueDate: vatDueDate.toISOString().split('T')[0],
    status: "pending",
    badgeType: "badge-routine",
    scoreImpact: 10
  });

  // 4. PAYE Tax (10th of every month)
  let payeDueDate = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 10);
  if (CURRENT_DATE > payeDueDate) {
    payeDueDate = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth() + 1, 10);
  }
  timelines.push({
    id: "paye_tax",
    name: "Monthly PAYE Income Tax Remittance",
    description: "Employer withholding of employees' progressive income tax paid to the State IRS.",
    dueDate: payeDueDate.toISOString().split('T')[0],
    status: "pending",
    badgeType: "badge-routine",
    scoreImpact: 10
  });

  // 5. Pension Remittance
  let pensionDueDate = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth() + 1, 7);
  timelines.push({
    id: "pension_pra",
    name: "Monthly PenCom Pension Remittance",
    description: "Combined 18% contribution (10% employer, 8% employee) to employee Pension Fund Accounts.",
    dueDate: pensionDueDate.toISOString().split('T')[0],
    status: "pending",
    badgeType: "badge-routine",
    scoreImpact: 10
  });

  // 6. SCUML Registration
  const dnfbps = ["Real Estate", "Professional Services", "General Trade"];
  if (dnfbps.includes(comp.sector)) {
    const scumlDue = new Date(incDateObj.getTime() + 30 * 24 * 60 * 60 * 1000);
    timelines.push({
      id: "scuml_reg",
      name: "SCUML AML Compliance Registration",
      description: "Special anti-money laundering registration for Designated Non-Financial Businesses (DNFBPs).",
      dueDate: scumlDue.toISOString().split('T')[0],
      status: comp.hasScuml ? "compliant" : (CURRENT_DATE > scumlDue ? "overdue" : "pending"),
      badgeType: comp.hasScuml ? "badge-compliant" : "badge-urgent",
      scoreImpact: 15
    });
  }

  // 7. NIPC Registration
  if (comp.foreign_participation === "yes") {
    const nipcDue = new Date(incDateObj.getTime() + 14 * 24 * 60 * 60 * 1000);
    timelines.push({
      id: "nipc_reg",
      name: "NIPC Foreign Investment Registration",
      description: "Mandatory registry of foreign investments and capital imports with the NIPC.",
      dueDate: nipcDue.toISOString().split('T')[0],
      status: CURRENT_DATE > nipcDue ? "overdue" : "pending",
      badgeType: CURRENT_DATE > nipcDue ? "badge-urgent" : "badge-upcoming",
      scoreImpact: 10
    });
  }

  // 8. NDPA Data Protection Audit
  let ndpaDueDate = new Date(CURRENT_DATE.getFullYear(), 2, 15);
  if (CURRENT_DATE > ndpaDueDate) {
    ndpaDueDate = new Date(CURRENT_DATE.getFullYear() + 1, 2, 15);
  }
  timelines.push({
    id: "ndpa_audit",
    name: "NDPC Annual Data Audit Report",
    description: "Mandatory filing of privacy policies and compliance audits to the Data Protection Commission.",
    dueDate: ndpaDueDate.toISOString().split('T')[0],
    status: "pending",
    badgeType: "badge-routine",
    scoreImpact: 10
  });

  return timelines;
}

// --- API ENDPOINTS ---

// 1. Get Companies List
app.get("/api/companies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM companies");
    res.json(result.rows.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      sector: r.sector,
      incDate: r.inc_date,
      shareCapital: r.share_capital,
      employees: r.employees,
      foreign: r.foreign_participation,
      isStartupLabelled: r.is_startup_labelled === 1,
      hasScuml: r.has_scuml === 1
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get specific Company
app.get("/api/companies/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM companies WHERE id = $1", [req.params.id]);
    const row = result.rows[0];
    if (!row) {
      res.status(404).json({ error: "Company not found" });
    } else {
      res.json({
        id: row.id,
        name: row.name,
        type: row.type,
        sector: row.sector,
        incDate: row.inc_date,
        shareCapital: row.share_capital,
        employees: row.employees,
        foreign: row.foreign_participation,
        isStartupLabelled: row.is_startup_labelled === 1,
        hasScuml: row.has_scuml === 1
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Save or Update Company Profile
app.post("/api/companies", async (req, res) => {
  const { id, name, type, sector, incDate, shareCapital, employees, foreign, isStartupLabelled, hasScuml } = req.body;
  
  if (!id || !name || !type || !sector || !incDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO companies (id, name, type, sector, inc_date, share_capital, employees, foreign_participation, is_startup_labelled, has_scuml)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT(id) DO UPDATE SET
      name=EXCLUDED.name,
      type=EXCLUDED.type,
      sector=EXCLUDED.sector,
      inc_date=EXCLUDED.inc_date,
      share_capital=EXCLUDED.share_capital,
      employees=EXCLUDED.employees,
      foreign_participation=EXCLUDED.foreign_participation,
      is_startup_labelled=EXCLUDED.is_startup_labelled,
      has_scuml=EXCLUDED.has_scuml
  `;

  try {
    await pool.query(query, [
      id, name, type, sector, incDate, 
      shareCapital || 1000000, 
      employees || 0, 
      foreign || "no", 
      isStartupLabelled ? 1 : 0, 
      hasScuml ? 1 : 0
    ]);
    res.json({ success: true, companyId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Calculate Timelines & Score dynamically
app.get("/api/companies/:id/timelines", async (req, res) => {
  const compId = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM companies WHERE id = $1", [compId]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: "Company not found" });
    }

    const company = {
      id: row.id,
      name: row.name,
      type: row.type,
      sector: row.sector,
      incDate: row.inc_date,
      shareCapital: row.share_capital,
      employees: row.employees,
      foreign_participation: row.foreign_participation,
      isStartupLabelled: row.is_startup_labelled === 1,
      hasScuml: row.has_scuml === 1
    };

    const CURRENT_DATE = new Date("2026-07-11T16:28:24+01:00");
    const timelines = calculateTimelines(company, CURRENT_DATE);

    // Calculate score
    let score = 100;
    let pendingCount = 0;

    timelines.forEach(t => {
      if (t.status === "overdue") {
        score -= t.scoreImpact;
        pendingCount++;
      } else if (t.status === "pending") {
        pendingCount++;
      }
    });

    const dnfbps = ["Real Estate", "Professional Services", "General Trade"];
    if (dnfbps.includes(company.sector) && !company.hasScuml) {
      score -= 15;
      pendingCount++;
    }

    score = Math.max(score, 10);

    res.json({
      score,
      pendingCount,
      timelines
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Company Active Income Rows
app.get("/api/companies/:id/income", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM income_rows WHERE company_id = $1 ORDER BY date DESC", [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Add Company Income Row
app.post("/api/companies/:id/income", async (req, res) => {
  const { amount, description, date } = req.body;
  const company_id = req.params.id;

  if (!amount || !date) {
    return res.status(400).json({ error: "Amount and date required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO income_rows (company_id, amount, description, date) VALUES ($1, $2, $3, $4) RETURNING id",
      [company_id, amount, description || "", date]
    );
    res.json({ id: result.rows[0].id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. AI Law Advisor Groq Router with Graceful Fallback
app.post("/api/compliance/advisor", async (req, res) => {
  const { query, companyProfile } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const isPlaceholder = !apiKey || apiKey.includes("placeholder") || apiKey.includes("your-groq");

  if (isPlaceholder) {
    console.log("Using Local Legal Engine Fallback (Groq API Key is a placeholder).");
    const localAnswer = generateLocalLegalResponse(query, companyProfile);
    return res.json({ answer: localAnswer, source: "Local Legal Matching Engine" });
  }

  try {
    const systemPrompt = `You are Complai, a world-class legal AI specializing in Nigerian Startup and Corporate Compliance. 
Your database is fully seeded with the Companies and Allied Matters Act (CAMA) 2020, Nigeria Startup Act 2022, Investment and Securities Act (ISA) 2007, Labor Act Cap L1, Pension Reform Act 2014, and Special Control Unit Against Money Laundering (SCUML) guidelines.

The user is managing a company with the following profile:
- Name: ${companyProfile?.name || "N/A"}
- Sector: ${companyProfile?.sector || "N/A"}
- Legal Entity: ${companyProfile?.type || "LTD"}
- Incorporation Date: ${companyProfile?.incDate || "N/A"}
- Staff Count: ${companyProfile?.employees || 0}
- Foreign Shareholders: ${companyProfile?.foreign || "no"}
- Startup Act Label: ${companyProfile?.isStartupLabelled ? "Yes" : "No"}
- SCUML Registered: ${companyProfile?.hasScuml ? "Yes" : "No"}

Provide professional, structured compliance milestones, due dates, penalty risks, and direct legal instructions. Speak in the tone of a premium corporate lawyer. Do not state you are an AI.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API returned error status: ${response.status}`);
    }

    const data = await response.json();
    const groqAnswer = data?.choices?.[0]?.message?.content || "No response generated from Groq.";
    res.json({ answer: groqAnswer, source: "Groq Llama-3 AI" });

  } catch (error) {
    console.error("Groq API Call Failed. Falling back to local engine:", error.message);
    const localAnswer = generateLocalLegalResponse(query, companyProfile);
    res.json({ answer: localAnswer, source: "Local Legal Matching Engine (Fallback)" });
  }
});

// 8. Regulatory Updates Feed
app.get("/api/compliance/updates", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM regulatory_updates ORDER BY published_date DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. CAC VAS Mappings Registration Endpoint
app.post("/api/compliance/register", (req, res) => {
  const { proposedName1, proposedName2, shareCapital, shareSplit, directors, address, companyType } = req.body;

  if (!proposedName1 || !directors || !address) {
    return res.status(400).json({ error: "Missing registration parameters" });
  }

  const vasPayload = {
    requestMetadata: {
      sourceAgent: "Complai-VAS-Portal",
      timestamp: new Date().toISOString(),
      countryCode: "NG"
    },
    registrationDetails: {
      entityType: companyType === "BN" ? "BUSINESS_NAME" : "PRIVATE_LIMITED_COMPANY",
      shareCapitalDeclared: parseInt(shareCapital) || 1000000,
      proposedNames: [
        { choiceNumber: 1, name: proposedName1 },
        { choiceNumber: 2, name: proposedName2 || "" }
      ],
      registeredOffice: {
        addressLine1: address,
        state: "Lagos",
        country: "Nigeria"
      },
      directorsList: directors.map((d, idx) => ({
        id: idx + 1,
        fullName: d.name,
        designation: "DIRECTOR",
        nationality: "Nigerian",
        shareHoldingsPercentage: parseFloat(shareSplit?.[idx]) || 100 / directors.length,
        identificationDetails: {
          idType: "NATIONAL_ID",
          idNumber: d.idNum || "NG-NIN-MOCK"
        }
      })),
      stampDutyInfo: {
        stampValue: (parseInt(shareCapital) || 1000000) * 0.0075,
        stampRemitaRef: "RRR-" + Math.floor(Math.random() * 900000000 + 100000000)
      }
    }
  };

  res.json({
    success: true,
    cacVasEndpoint: companyType === "BN" ? "/api/v2/cac/vas/register/business-name" : "/api/v2/cac/vas/register/limited-company",
    mappedPayload: vasPayload
  });
});

// --- LOCAL LEGAL ENGINE RESPONSES ---
function generateLocalLegalResponse(query, profile) {
  const q = query.toLowerCase();

  if (q.includes("scuml") || q.includes("money laundering")) {
    return `**Anti-Money Laundering Compliance (SCUML):**\n
Under the **Money Laundering (Prevention and Prohibition) Act 2022**, the sector: *${profile?.sector || "N/A"}* requires direct control. Startups classified as Designated Non-Financial Businesses (DNFBPs) must register with the EFCC Special Control Unit Against Money Laundering.\n
**Action Steps:**
1. Collect CAC registration documents (Form 1.1, Certificate, MEMART).
2. Gather directors' Bank Verification Numbers (BVN) and valid NINs.
3. Submit a free application on the SCUML portal. 
*Overdue Penalty:* Immediate freeze of corporate bank accounts.`;
  }

  if (q.includes("startup act") || q.includes("startup label")) {
    return `**Nigeria Startup Act 2022 Compliance Brief:**\n
Your company *${profile?.name || "N/A"}* incorporated on *${profile?.incDate || "N/A"}* is eligible for labeling since it is under 10 years old.
\n**Incentives Awaiting Activation:**
• **Pioneer Status:** 3-4 years tax holiday from FIRS.
• **ITF Exemption:** Waives the 1% annual training payroll levy.
• **Customs & FX Relief:** Accelerated channels for technological imports.`;
  }

  if (q.includes("pension") || q.includes("remittance")) {
    const employees = profile?.employees || 0;
    return `**Pension Reform Act 2014 Advisory:**\n
Since your company has *${employees}* employees, you must configure a PenCom account if you cross 15 employees (or 3 employees under strict PFA regulations).\n
• **Statutory Rate:** 10% Employer, 8% Employee contribution.
• **Timeline:** Due strictly within 7 working days from salary payment.
• **Penalty:** 2% monthly interest charges on outstanding remittance sums.`;
  }

  if (q.includes("expatriate") || q.includes("foreign employee") || q.includes("quota")) {
    return `**Expatriate Hiring Compliance:**\n
For foreign nationals, the Ministry of Interior requires an **Expatriate Quota**.\n
• **Subject to Regularization (STR) Visa:** Issued at consular embassies abroad.
• **CERPAC Permit:** Required within 90 days of arrival.
• **Understudy Rule:** Must employ two Nigerian understudies per expatriate.
• **Transfer Pricing:** Salaries paid to secondments from parent firms must conform to the FIRS TP Regulations 2018.`;
  }

  return `**Complai Legal Advisory:**\n
Based on your company sector (*${profile?.sector || "N/A"}*) and entity structure (*${profile?.type || "LTD"}*), you must track monthly FIRS VAT (due 21st), State PAYE (due 10th), and Pension filings (due 7th).\n
Let me know if you would like me to draft a contract or compile step-by-step checklists for your next compliance audit.`;
}

// --- BACKGROUND WORKER SIMULATION ---
cron.schedule("0 * * * *", async () => {
  console.log("[BACKGROUND WORKER] Scanning corporate database for filing deadlines...");
  try {
    const result = await pool.query("SELECT * FROM companies");
    result.rows.forEach(r => {
      const company = {
        id: r.id,
        name: r.name,
        type: r.type,
        sector: r.sector,
        incDate: r.inc_date,
        shareCapital: r.share_capital,
        employees: r.employees,
        foreign_participation: r.foreign_participation,
        isStartupLabelled: r.is_startup_labelled === 1,
        hasScuml: r.has_scuml === 1
      };
      
      const CURRENT_DATE = new Date("2026-07-11T16:28:24+01:00");
      const timelines = calculateTimelines(company, CURRENT_DATE);
      let score = 100;
      timelines.forEach(t => {
        if (t.status === "overdue") score -= t.scoreImpact;
      });
      const dnfbps = ["Real Estate", "Professional Services", "General Trade"];
      if (dnfbps.includes(company.sector) && company.hasScuml === 0) score -= 15;
      score = Math.max(score, 10);
      
      console.log(`[BACKGROUND WORKER] Company: ${company.name} | Compliance Score: ${score}% | Overdue checks complete.`);
    });
  } catch (err) {
    console.error("[BACKGROUND WORKER] Failed to scan database:", err.message);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Complai full-stack server running at http://localhost:${PORT}`);
});
