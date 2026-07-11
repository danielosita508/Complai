// Automated API Verification Test Suite for NaijaComply

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log("=== NAIJACOMPLY API AUTOMATED TEST SUITE ===");

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
    console.log("First event:", timelineData.timelines[0].name, "| Status:", timelineData.timelines[0].status);

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
    console.log("Mapped payload has requestMetadata:", !!registerData.mappedPayload.requestMetadata);
    console.log("Mapped stampDutyInfo:", registerData.mappedPayload.registrationDetails.stampDutyInfo);
    console.log("First Director Name:", registerData.mappedPayload.registrationDetails.directorsList[0].fullName, "| Share %:", registerData.mappedPayload.registrationDetails.directorsList[0].shareHoldingsPercentage);

    // Test 6: Regulatory Updates stream
    console.log("\n[TEST 6] Fetching regulatory updates stream...");
    const resUpdates = await fetch(`${BASE_URL}/api/compliance/updates`);
    if (!resUpdates.ok) throw new Error("Fetch updates failed");
    const updates = await resUpdates.json();
    console.log(`Successfully fetched ${updates.length} updates.`);
    console.log("Updates headlines:", updates.map(u => `${u.title} (${u.source})`).join(" | "));

    console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY WITHOUT ERRORS!");

  } catch (error) {
    console.error("\n❌ TEST SUITE FAILURE:", error.message);
    process.exit(1);
  }
}

runTests();
