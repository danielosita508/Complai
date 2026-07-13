// Automated API Verification Test Suite for Complai Compliance Agent
const PORT = 8080;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runTests() {
  console.log("=== COMPLAI COMPLIANCE AGENT AUTOMATED TEST SUITE ===");

  try {
    // Test 1: Fetch Companies List
    console.log("\n[TEST 1] Fetching companies list...");
    const resCompanies = await fetch(`${BASE_URL}/api/companies`);
    if (!resCompanies.ok) throw new Error("Fetch companies failed");
    const companies = await resCompanies.json();
    console.log(`Successfully fetched ${companies.length} companies.`);
    console.log("Companies:", companies.map(c => `${c.name} (${c.sector})`).join(", "));

    // Test 2: Calculate Timeline & Score
    console.log("\n[TEST 2] Fetching initial timelines for comp-1...");
    const resTimelines = await fetch(`${BASE_URL}/api/companies/comp-1/timelines`);
    if (!resTimelines.ok) throw new Error("Fetch timelines failed");
    const timelineData = await resTimelines.json();
    console.log("Initial Compliance Score:", timelineData.score + "%");
    console.log("Timeline events count:", timelineData.timelines.length);
    const initialScore = timelineData.score;

    // Test 3: Add Income Row (Calculations linkage)
    console.log("\n[TEST 3] Adding B2B SaaS subscription income of ₦5,000,000...");
    const resIncome = await fetch(`${BASE_URL}/api/companies/comp-1/income`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 5000000,
        description: "B2B SaaS Annual License Fee",
        date: "2026-07-11"
      })
    });
    if (!resIncome.ok) throw new Error("Add income failed");
    const incomeData = await resIncome.json();
    console.log("Income Row added:", incomeData);

    // Fetch updated income sum
    const resIncomeList = await fetch(`${BASE_URL}/api/companies/comp-1/income`);
    const incomeRows = await resIncomeList.json();
    const sum = incomeRows.reduce((a, b) => a + b.amount, 0);
    console.log("Total active income rows sum:", `₦${sum.toLocaleString()}`);

    // Test 4: AI Advisor Chat Endpoint with Local Fallback
    console.log("\n[TEST 4] Triggering AI Law Advisor endpoint with query 'What is SCUML?'...");
    const resAdvisor = await fetch(`${BASE_URL}/api/compliance/advisor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "What is SCUML?",
        companyProfile: companies[0]
      })
    });
    if (!resAdvisor.ok) throw new Error("AI Advisor failed");
    const advisorData = await resAdvisor.json();
    console.log("Advisor Response Source:", advisorData.source);
    console.log("Advisor Answer Preview:\n", advisorData.answer.substring(0, 300) + "...\n");

    // Test 5: CAC VAS JSON Mapping Registry Endpoint
    console.log("\n[TEST 5] Testing CAC VAS Registration Schema mapper...");
    const resRegister = await fetch(`${BASE_URL}/api/compliance/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        proposedName1: "Apex Innovate Ltd",
        proposedName2: "Apex Systems Ltd",
        shareCapital: 1000000,
        shareSplit: [70, 30],
        directors: [
          { name: "Adewale Balogun", idNum: "NG-NIN-99281726" },
          { name: "Chinwe Egwu", idNum: "NG-NIN-10293847" }
        ],
        address: "15 Herbert Macaulay Way, Yaba, Lagos",
        companyType: "LTD"
      })
    });
    if (!resRegister.ok) throw new Error("CAC mapping failed");
    const registerData = await resRegister.json();
    console.log("Target CAC Endpoint:", registerData.cacVasEndpoint);
    console.log("Mapped payload stampDutyInfo:", registerData.mappedPayload.registrationDetails.stampDutyInfo);

    // Test 6: Regulatory Updates stream
    console.log("\n[TEST 6] Fetching regulatory updates stream...");
    const resUpdates = await fetch(`${BASE_URL}/api/compliance/updates`);
    if (!resUpdates.ok) throw new Error("Fetch updates failed");
    const updates = await resUpdates.json();
    console.log(`Successfully fetched ${updates.length} updates.`);

    // Test 7: DB Diagnostics Endpoint
    console.log("\n[TEST 7] Fetching DB diagnostics...");
    const resDiagnostics = await fetch(`${BASE_URL}/api/diagnostics/db`);
    if (!resDiagnostics.ok) throw new Error("Diagnostics endpoint failed");
    const diagnosticsData = await resDiagnostics.json();
    console.log(`DB Status: ${diagnosticsData.status} | Database Type: ${diagnosticsData.database}`);
    console.log("Diagnostics Tables Status:", diagnosticsData.tables);

    // Test 8: Filing Overrides - Create filing
    console.log("\n[TEST 8] Fetching initial timelines for comp-2 to establish baseline...");
    const resTimelines2 = await fetch(`${BASE_URL}/api/companies/comp-2/timelines`);
    const timelineData2 = await resTimelines2.json();
    const initialScore2 = timelineData2.score;
    console.log("Initial Compliance Score for comp-2:", initialScore2 + "%");

    console.log("Creating a filing override for 'cac_returns' on comp-2...");
    const resCreateFiling = await fetch(`${BASE_URL}/api/companies/comp-2/filings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timelineId: "cac_returns",
        status: "filed"
      })
    });
    if (!resCreateFiling.ok) throw new Error("Create filing override failed");
    const createFilingData = await resCreateFiling.json();
    console.log("Filing override created:", createFilingData);

    // Test 9: Verify Filing Override lists correctly
    console.log("\n[TEST 9] Fetching filing overrides list for comp-2...");
    const resFilingsList = await fetch(`${BASE_URL}/api/companies/comp-2/filings`);
    const filingsList = await resFilingsList.json();
    console.log("Active filings overrides:", filingsList);
    if (filingsList.length === 0) throw new Error("Filing override was not saved");

    // Test 10: Verify score increases after override
    console.log("\n[TEST 10] Checking compliance score for comp-2 after filing override...");
    const resTimelinesAfter = await fetch(`${BASE_URL}/api/companies/comp-2/timelines`);
    const timelineDataAfter = await resTimelinesAfter.json();
    console.log("New Compliance Score for comp-2:", timelineDataAfter.score + "%");
    const newScore = timelineDataAfter.score;
    if (newScore <= initialScore2) throw new Error("Filing override did not increase compliance score");

    // Test 11: Delete Filing Override (Undo)
    console.log("\n[TEST 11] Undoing filing override for 'cac_returns' on comp-2...");
    const resDeleteFiling = await fetch(`${BASE_URL}/api/companies/comp-2/filings/cac_returns`, {
      method: "DELETE"
    });
    if (!resDeleteFiling.ok) throw new Error("Delete filing override failed");
    
    // Check score is back to initial
    const resTimelinesUndo = await fetch(`${BASE_URL}/api/companies/comp-2/timelines`);
    const timelineDataUndo = await resTimelinesUndo.json();
    console.log("Compliance Score after Undo:", timelineDataUndo.score + "%");
    if (timelineDataUndo.score !== initialScore2) throw new Error("Undo did not restore initial compliance score");

    // Test 12: Tax History
    console.log("\n[TEST 12] Saving a tax calculation snapshot...");
    const resSaveTax = await fetch(`${BASE_URL}/api/companies/comp-1/tax-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        revenue: 45000000,
        profit: 8000000,
        payroll: 3500000,
        employees: 12,
        cit_estimate: 1600000,
        vat_estimate: 3375000,
        pension_estimate: 4200000,
        nsitf_estimate: 420000,
        itf_estimate: 420000,
        total_obligations: 10015000
      })
    });
    if (!resSaveTax.ok) throw new Error("Save tax history failed");
    const saveTaxData = await resSaveTax.json();
    console.log("Saved Tax snapshot ID:", saveTaxData.id);

    // Fetch tax history
    const resTaxHistory = await fetch(`${BASE_URL}/api/companies/comp-1/tax-history`);
    const taxHistory = await resTaxHistory.json();
    console.log(`Fetched ${taxHistory.length} tax history records.`);
    if (taxHistory.length === 0) throw new Error("Tax history record was not saved");

    // Test 13: Notifications and Mark-as-read
    console.log("\n[TEST 13] Verification of notifications endpoint...");
    const resNotifications = await fetch(`${BASE_URL}/api/companies/comp-1/notifications`);
    const notifications = await resNotifications.json();
    console.log(`Fetched ${notifications.length} notifications.`);

    console.log("\nMarking notifications as read...");
    const resRead = await fetch(`${BASE_URL}/api/companies/comp-1/notifications/read`, { method: "POST" });
    if (!resRead.ok) throw new Error("Mark read failed");
    console.log("Notifications marked read successfully.");

    console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY WITHOUT ERRORS!");

  } catch (error) {
    console.error("\n❌ TEST SUITE FAILURE:", error.message);
    process.exit(1);
  }
}

runTests();
