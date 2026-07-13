// Nigeria Compliance Agent - Frontend Controller and Timeline Engine (API Integration)

document.addEventListener("DOMContentLoaded", () => {
  // --- APPLICATION STATE ---
  let companies = [];
  let currentCompanyId = "comp-1";
  let activeView = "dashboard";
  
  // Wizards state
  let activeWizard = "cac";
  let currentWizardStep = 0;

  // Contracts state
  let activeContractTemplate = "employment";

  // Current local time - live
  const CURRENT_DATE = new Date();

  // --- SELECTORS ---
  const companySelector = document.getElementById("company-selector");
  const btnOnboardNew = document.getElementById("btn-onboard-new");
  
  const navItems = document.querySelectorAll(".nav-menu .nav-item");
  const viewSections = document.querySelectorAll(".view-section");
  const headerTitle = document.getElementById("header-title");
  const currentTimeDisplay = document.getElementById("current-time-display");

  // Profile fields
  const onboardingForm = document.getElementById("onboarding-form");
  const compNameInput = document.getElementById("comp-name");
  const compTypeSelect = document.getElementById("comp-type");
  const compSectorSelect = document.getElementById("comp-sector");
  const compIncDateInput = document.getElementById("comp-inc-date");
  const compShareCapitalInput = document.getElementById("comp-share-capital");
  const compEmployeesInput = document.getElementById("comp-employees");
  const compForeignSelect = document.getElementById("comp-foreign");
  const compLabelStartupCheckbox = document.getElementById("comp-label-startup");
  const compHasScumlCheckbox = document.getElementById("comp-has-scuml");

  // Stat Boxes
  const statScore = document.getElementById("stat-score");
  const statPending = document.getElementById("stat-pending");
  const statUpcomingDate = document.getElementById("stat-upcoming-date");
  const globalStatusDot = document.getElementById("global-status-dot");
  const globalStatusText = document.getElementById("global-status-text");

  // Timeline list container
  const timelineListContainer = document.getElementById("compliance-timeline-list");

  // Law Library Search
  const librarySearchInput = document.getElementById("library-search");
  const lawLibraryGrid = document.getElementById("law-library-grid");

  // Modal
  const detailModal = document.getElementById("detail-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalTitleText = document.getElementById("modal-title-text");
  const modalSubtitleText = document.getElementById("modal-subtitle-text");
  const modalBodyContent = document.getElementById("modal-body-content");

  // Wizards
  const wizardNavButtons = document.querySelectorAll(".wizard-nav-btn");
  const wizardStepperHead = document.getElementById("wizard-stepper-head");
  const wizardStepBody = document.getElementById("wizard-step-body");
  const wizardPrevBtn = document.getElementById("wizard-prev-btn");
  const wizardNextBtn = document.getElementById("wizard-next-btn");

  // Contracts
  const contractTemplateList = document.getElementById("contract-template-list");
  const contractTitleDisplay = document.getElementById("contract-title-display");
  const contractDescDisplay = document.getElementById("contract-desc-display");
  const contractInputsContainer = document.getElementById("contract-inputs-container");
  const contractPreviewDisplay = document.getElementById("contract-preview-display");
  const btnCopyContract = document.getElementById("btn-copy-contract");

  // Calculator
  const calcForm = document.getElementById("calc-form");
  const calcRevenueInput = document.getElementById("calc-revenue");
  const calcNetProfitInput = document.getElementById("calc-net-profit");
  const calcPayrollInput = document.getElementById("calc-monthly-payroll");
  const calcEmployeesCountInput = document.getElementById("calc-employees-count");
  const calcIsStartupCheckbox = document.getElementById("calc-is-startup");
  const calcResultsBox = document.getElementById("calc-results-box");

  // Income Tracker elements
  const addIncomeForm = document.getElementById("add-income-form");
  const incomeTableBody = document.getElementById("income-table-body");

  // Notification elements
  const btnNotifications = document.getElementById("btn-notifications");
  const notifBadge = document.getElementById("notif-badge");
  const notificationPanel = document.getElementById("notification-panel");
  const notificationList = document.getElementById("notification-list");
  const btnMarkAllRead = document.getElementById("btn-mark-all-read");

  // DB Status elements
  const dbStatusDot = document.getElementById("db-status-dot");
  const dbStatusText = document.getElementById("db-status-text");

  // Tax History
  const taxHistoryContainer = document.getElementById("tax-history-container");

  // Chatbot
  const chatMsgPanel = document.getElementById("chat-msg-panel");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");
  const chatSuggestions = document.querySelectorAll(".chat-suggest-btn");

  // --- INITIALIZE APPLICATION ---
  async function init() {
    currentTimeDisplay.textContent = `Local Time: ${CURRENT_DATE.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    await fetchCompanies();
    await loadCompanyProfile(currentCompanyId);
    renderLawLibrary();
    initWizards();
    initContracts();
    setupEventListeners();
    checkDbStatus();
    fetchNotifications();
  }

  // --- NAVIGATION VIEW ROUTING ---
  function switchView(viewName) {
    activeView = viewName;
    
    // Update menu state
    navItems.forEach(item => {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update main section views
    viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // Update headers
    const titleMap = {
      dashboard: "Compliance Dashboard",
      profile: "Company Onboarding & Settings",
      wizards: "Statutory Filing & Registration Guides",
      contracts: "Nigerian Drafting Contract Generator",
      calculator: "Tax & Contributions Estimator",
      library: "Nigerian Regulatory Law Library",
      chatbot: "AI Corporate Law Advisor Chat"
    };
    headerTitle.textContent = titleMap[viewName] || "Compliance Agent";

    // Refresh view specific logic
    if (viewName === "dashboard") {
      updateDashboardData();
    } else if (viewName === "calculator") {
      fetchIncomeRows();
      fetchTaxHistory();
    }
  }

  // --- COMPANY PROFILE MANAGEMENT ---
  async function fetchCompanies() {
    try {
      const res = await fetch("/api/companies");
      if (!res.ok) throw new Error("API status " + res.status);
      const data = await res.json();
      if (Array.isArray(data)) {
        companies = data;
      } else {
        throw new Error("API did not return array");
      }
    } catch (e) {
      console.warn("Failed to load companies, using local fallback:", e);
      companies = [
        {
          id: "comp-1",
          name: "Apex Tech Ventures Ltd",
          type: "LTD",
          sector: "Tech Startup",
          incDate: "2025-02-15",
          shareCapital: 1000000,
          employees: 12,
          foreign: "no",
          isStartupLabelled: true,
          hasScuml: false
        },
        {
          id: "comp-2",
          name: "Zenith Real Estate & Build Co",
          type: "LTD",
          sector: "Real Estate",
          incDate: "2024-08-01",
          shareCapital: 5000000,
          employees: 6,
          foreign: "yes",
          isStartupLabelled: false,
          hasScuml: false
        }
      ];
    }
    populateCompanySelector();
  }

  function populateCompanySelector() {
    companySelector.innerHTML = "";
    companies.forEach(company => {
      const option = document.createElement("option");
      option.value = company.id;
      option.textContent = company.name;
      if (company.id === currentCompanyId) {
        option.selected = true;
      }
      companySelector.appendChild(option);
    });
  }

  async function loadCompanyProfile(companyId) {
    const comp = companies.find(c => c.id === companyId);
    if (!comp) return;

    compNameInput.value = comp.name;
    compTypeSelect.value = comp.type;
    compSectorSelect.value = comp.sector;
    compIncDateInput.value = comp.incDate;
    compShareCapitalInput.value = comp.shareCapital;
    compEmployeesInput.value = comp.employees;
    compForeignSelect.value = comp.foreign;
    compLabelStartupCheckbox.checked = comp.isStartupLabelled;
    compHasScumlCheckbox.checked = comp.hasScuml;

    await updateDashboardData();
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    
    let comp = companies.find(c => c.id === currentCompanyId);
    if (!comp) return;

    const updatedProfile = {
      id: currentCompanyId,
      name: compNameInput.value,
      type: compTypeSelect.value,
      sector: compSectorSelect.value,
      incDate: compIncDateInput.value,
      shareCapital: parseInt(compShareCapitalInput.value) || 0,
      employees: parseInt(compEmployeesInput.value) || 0,
      foreign: compForeignSelect.value,
      isStartupLabelled: compLabelStartupCheckbox.checked,
      hasScuml: compHasScumlCheckbox.checked
    };

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile)
      });
      if (res.ok) {
        await fetchCompanies();
        await updateDashboardData();
        alert(`Compliance Profile for "${updatedProfile.name}" has been updated and recalculated successfully!`);
        switchView("dashboard");
      }
    } catch (e) {
      console.error("Failed to save profile:", e);
    }
  }

  async function handleCreateNewCompany() {
    const newId = `comp-${companies.length + 1}`;
    const newComp = {
      id: newId,
      name: `New Startup Ltd #${companies.length + 1}`,
      type: "LTD",
      sector: "Tech Startup",
      incDate: CURRENT_DATE.toISOString().split('T')[0],
      shareCapital: 1000000,
      employees: 1,
      foreign: "no",
      isStartupLabelled: false,
      hasScuml: false
    };

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComp)
      });
      if (res.ok) {
        currentCompanyId = newId;
        await fetchCompanies();
        await loadCompanyProfile(newId);
        switchView("profile");
      }
    } catch (e) {
      console.error("Failed to create company:", e);
    }
  }

  // --- COMPLIANCE ENGINE & ROADMAP TIMELINE ---
  function calculateLocalTimelines(comp, CURRENT_DATE) {
    const timelines = [];
    const incDateObj = new Date(comp.incDate || comp.inc_date || "2025-02-15");
    const foreign = comp.foreign || comp.foreign_participation || "no";
    const hasScuml = comp.hasScuml || comp.has_scuml || false;

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
        status: hasScuml ? "compliant" : (CURRENT_DATE > scumlDue ? "overdue" : "pending"),
        badgeType: hasScuml ? "badge-compliant" : "badge-urgent",
        scoreImpact: 15
      });
    }

    // 7. NIPC Registration
    if (foreign === "yes") {
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

  async function updateDashboardData() {
    const comp = companies.find(c => c.id === currentCompanyId);
    if (!comp) return;

    try {
      let timelines = [];
      let score = 100;
      let pendingCount = 0;

      try {
        // Fetch score and timelines from Express backend
        const res = await fetch(`/api/companies/${currentCompanyId}/timelines`);
        if (!res.ok) throw new Error("API returned status " + res.status);
        const data = await res.json();
        if (!data || typeof data.score === 'undefined') throw new Error("Invalid structure");
        
        score = data.score;
        pendingCount = data.pendingCount;
        timelines = data.timelines;
      } catch (err) {
        console.warn("Backend timelines fetch failed, using local engine fallback:", err.message);
        timelines = calculateLocalTimelines(comp, CURRENT_DATE);
        
        timelines.forEach(t => {
          if (t.status === "overdue") {
            score -= t.scoreImpact;
            pendingCount++;
          } else if (t.status === "pending") {
            pendingCount++;
          }
        });
        const dnfbps = ["Real Estate", "Professional Services", "General Trade"];
        if (dnfbps.includes(comp.sector) && !comp.hasScuml) {
          score -= 15;
          pendingCount++;
        }
        score = Math.max(score, 10);
      }

      statScore.textContent = `${score}%`;
      statPending.textContent = pendingCount;

      const futureTimelines = timelines
        .filter(t => t.status !== "overdue" && t.status !== "compliant")
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      
      if (futureTimelines.length > 0) {
        const nextDue = new Date(futureTimelines[0].dueDate);
        statUpcomingDate.textContent = nextDue.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
      } else {
        statUpcomingDate.textContent = "None";
      }

      // Set Global status sidebar indicator
      if (score >= 90) {
        globalStatusDot.className = "status-dot";
        globalStatusText.textContent = "Compliant";
        globalStatusText.style.color = "var(--color-primary)";
      } else if (score >= 60) {
        globalStatusDot.className = "status-dot pending";
        globalStatusText.textContent = "Action Needed";
        globalStatusText.style.color = "var(--color-warning)";
      } else {
        globalStatusDot.className = "status-dot";
        globalStatusDot.style.backgroundColor = "var(--color-danger)";
        globalStatusDot.style.boxShadow = "0 0 10px var(--color-danger)";
        globalStatusText.textContent = "Critical Risk";
        globalStatusText.style.color = "var(--color-danger)";
      }

      // Render timeline lists
      renderTimelineItems(timelines);

      // Fetch and render regulatory updates from API
      await fetchRegulatoryUpdates();

    } catch (e) {
      console.error("Failed to update dashboard data:", e);
    }
  }

  function renderTimelineItems(timelines) {
    timelineListContainer.innerHTML = "";
    
    const sorted = timelines.sort((a, b) => {
      if (a.status === "overdue" && b.status !== "overdue") return -1;
      if (a.status !== "overdue" && b.status === "overdue") return 1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    sorted.forEach(item => {
      const el = document.createElement("div");
      el.className = "timeline-item";
      
      const formattedDate = new Date(item.dueDate).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });
      
      let statusBadgeLabel = item.status.toUpperCase();
      if (item.status === "compliant") statusBadgeLabel = "✓ Filed";
      
      // Build action button based on status
      let actionBtnHtml = "";
      if (item.status === "compliant") {
        actionBtnHtml = `<button class="filing-action-btn undo" data-timeline-id="${item.id}" title="Undo filing" style="background:rgba(255,71,87,0.15); border:1px solid rgba(255,71,87,0.3); color:var(--color-danger); border-radius:8px; padding:0.35rem 0.75rem; font-size:0.75rem; cursor:pointer; font-weight:600; transition: all 0.3s ease;">Undo</button>`;
      } else {
        actionBtnHtml = `<button class="filing-action-btn mark" data-timeline-id="${item.id}" title="Mark as filed" style="background:rgba(0,245,160,0.1); border:1px solid rgba(0,245,160,0.3); color:var(--color-primary); border-radius:8px; padding:0.35rem 0.75rem; font-size:0.75rem; cursor:pointer; font-weight:600; transition: all 0.3s ease;">Mark Filed</button>`;
      }

      el.innerHTML = `
        <div class="timeline-info">
          <span class="timeline-title">${item.name}</span>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 500px;">${item.description}</p>
          <div class="timeline-meta">
            <span>Due Date: <strong>${formattedDate}</strong></span>
            <span>Penalty risk: <strong>${item.scoreImpact}% Score</strong></span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem; flex-shrink:0;">
          ${actionBtnHtml}
          <span class="timeline-badge ${item.badgeType}">${statusBadgeLabel}</span>
        </div>
      `;
      
      timelineListContainer.appendChild(el);
    });

    // Attach filing action event listeners
    document.querySelectorAll(".filing-action-btn.mark").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const timelineId = e.currentTarget.getAttribute("data-timeline-id");
        await markFiling(timelineId);
      });
    });
    document.querySelectorAll(".filing-action-btn.undo").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const timelineId = e.currentTarget.getAttribute("data-timeline-id");
        await undoFiling(timelineId);
      });
    });
  }

  // --- FILING STATUS ACTIONS ---
  async function markFiling(timelineId) {
    try {
      const res = await fetch(`/api/companies/${currentCompanyId}/filings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timelineId, status: "filed" })
      });
      if (res.ok) {
        await updateDashboardData();
      }
    } catch (e) {
      console.error("Failed to mark filing:", e);
    }
  }

  async function undoFiling(timelineId) {
    try {
      const res = await fetch(`/api/companies/${currentCompanyId}/filings/${timelineId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await updateDashboardData();
      }
    } catch (e) {
      console.error("Failed to undo filing:", e);
    }
  }

  async function fetchRegulatoryUpdates() {
    try {
      const res = await fetch("/api/compliance/updates");
      if (!res.ok) throw new Error("API status " + res.status);
      const updates = await res.json();
      if (!Array.isArray(updates)) throw new Error("Updates is not an array");

      const updatesContainer = document.querySelector("#view-dashboard .dashboard-grid > div:last-child");
      if (updatesContainer) {
        updatesContainer.innerHTML = `
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Regulatory Updates & Circulars
          </h3>
        `;
        
        updates.forEach(u => {
          const div = document.createElement("div");
          div.style.cssText = "background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1rem; font-size: 0.9rem; margin-bottom: 0.75rem;";
          
          let color = "var(--color-primary)";
          if (u.source === "FIRS") color = "var(--color-warning)";
          if (u.source === "NDPC") color = "var(--color-secondary)";
          
          div.innerHTML = `
            <strong style="color: ${color}; display: block; margin-bottom: 0.25rem;">${u.title} (${u.source})</strong>
            ${u.content}
            <span style="display:block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Published: ${u.published_date}</span>
          `;
          updatesContainer.appendChild(div);
        });
      }
    } catch (e) {
      console.warn("Failed to fetch updates, keeping static placeholders:", e);
    }
  }

  // --- ACTIVE BUSINESS INCOME TRACKER ---
  async function fetchIncomeRows() {
    try {
      const res = await fetch(`/api/companies/${currentCompanyId}/income`);
      if (!res.ok) throw new Error("API status " + res.status);
      const rows = await res.json();
      if (!Array.isArray(rows)) throw new Error("Income rows is not an array");
      
      incomeTableBody.innerHTML = "";
      
      let totalAmount = 0;
      rows.forEach(r => {
        totalAmount += r.amount;
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid var(--border-glass)";
        tr.innerHTML = `
          <td style="padding: 0.75rem 1rem;">${r.description}</td>
          <td style="padding: 0.75rem 1rem; text-align: right; font-weight: 600; color: var(--color-primary);">₦${r.amount.toLocaleString('en-NG')}</td>
          <td style="padding: 0.75rem 1rem; text-align: right; color: var(--text-muted);">${r.date}</td>
        `;
        incomeTableBody.appendChild(tr);
      });

      // Automate calculations within Tax Calculator card based on active income rows!
      if (rows.length > 0) {
        calcRevenueInput.value = totalAmount;
        calcNetProfitInput.value = Math.round(totalAmount * 0.20); // standard 20% margin
        
        // Auto-run estimator calculations
        calcForm.dispatchEvent(new Event("submit"));
      } else {
        calcRevenueInput.value = 0;
        calcNetProfitInput.value = 0;
        calcResultsBox.style.display = "none";
      }

    } catch (e) {
      console.error("Failed to fetch income rows:", e);
    }
  }

  async function handleAddIncome(e) {
    e.preventDefault();
    const descEl = document.getElementById("inc-desc");
    const amountEl = document.getElementById("inc-amount");

    const amount = parseFloat(amountEl.value) || 0;
    const description = descEl.value.trim();
    const date = CURRENT_DATE.toISOString().split('T')[0];

    try {
      const res = await fetch(`/api/companies/${currentCompanyId}/income`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description, date })
      });
      if (res.ok) {
        descEl.value = "";
        amountEl.value = "";
        await fetchIncomeRows();
        await updateDashboardData(); // Recalculate score circle dynamically
      }
    } catch (e) {
      console.error("Failed to add income row:", e);
    }
  }

  // --- LAW LIBRARY & DETAILS MODAL ---
  function renderLawLibrary() {
    lawLibraryGrid.innerHTML = "";
    COMPLIANCE_DATABASE.laws.forEach(law => {
      const card = document.createElement("div");
      card.className = "law-card";
      card.innerHTML = `
        <div class="law-header">
          <span class="law-badge">${law.scope}</span>
          <h4>${law.name}</h4>
        </div>
        <p class="law-desc">${law.summary.substring(0, 110)}...</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top: auto;">
          <span style="font-size:0.8rem; color: var(--text-muted);">${law.authority}</span>
          <button class="law-action" data-law-id="${law.id}">
            View Obligations 
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      `;
      lawLibraryGrid.appendChild(card);
    });

    document.querySelectorAll(".law-action").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const lawId = e.currentTarget.getAttribute("data-law-id");
        openLawModal(lawId);
      });
    });
  }

  function openLawModal(lawId) {
    const law = COMPLIANCE_DATABASE.laws.find(l => l.id === lawId);
    if (!law) return;

    modalTitleText.textContent = law.name;
    modalSubtitleText.textContent = `${law.scope} • ${law.authority}`;
    
    let requirementsHtml = "";
    law.requirements.forEach(req => {
      requirementsHtml += `<li>${req}</li>`;
    });

    let benefitsHtml = "";
    if (law.benefits) {
      benefitsHtml = `<div class="modal-section-title">Incentives & Benefits</div>
                      <ul class="modal-list" style="margin-bottom: 1.5rem; color: var(--color-primary);">`;
      law.benefits.forEach(b => {
        benefitsHtml += `<li>${b}</li>`;
      });
      benefitsHtml += `</ul>`;
    }

    let deadlinesHtml = "";
    if (law.deadlines) {
      deadlinesHtml = `<div class="modal-section-title">Critical Filing Deadlines</div>
                       <div style="background:rgba(255,255,255,0.02); padding: 1rem; border-radius:10px; font-size: 0.95rem; margin-bottom: 1.5rem;">`;
      for (const [key, val] of Object.entries(law.deadlines)) {
        deadlinesHtml += `<p style="margin-bottom:0.5rem;"><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${val}</p>`;
      }
      deadlinesHtml += `</div>`;
    }

    modalBodyContent.innerHTML = `
      <p style="font-size: 1rem; color: #fff; background: rgba(0,210,255,0.02); padding: 1rem; border-radius:10px; border-left: 3px solid var(--color-secondary);">${law.summary}</p>
      
      <div class="modal-section-title">Key Regulatory Obligations</div>
      <ul class="modal-list" style="margin-bottom: 1.5rem;">
        ${requirementsHtml}
      </ul>

      ${benefitsHtml}
      ${deadlinesHtml}

      <div class="modal-section-title" style="color: var(--color-danger);">Statutory Fines / Non-Compliance Penalties</div>
      <p style="font-size: 0.95rem; color: var(--text-muted);">${law.penalties || "Penalties, late interest, and administrative restrictions imposed under the Act."}</p>
    `;

    detailModal.style.display = "flex";
  }

  function handleSearchLibrary() {
    const query = librarySearchInput.value.toLowerCase();
    const cards = lawLibraryGrid.querySelectorAll(".law-card");
    
    cards.forEach(card => {
      const title = card.querySelector("h4").textContent.toLowerCase();
      const scope = card.querySelector(".law-badge").textContent.toLowerCase();
      const desc = card.querySelector(".law-desc").textContent.toLowerCase();
      
      if (title.includes(query) || scope.includes(query) || desc.includes(query)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  // --- STATUTORY REGISTRATION WIZARDS & CAC VAS MAPPINGS ---
  function initWizards() {
    renderWizard();
  }

  function handleWizardNav(e) {
    wizardNavButtons.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    
    activeWizard = e.target.getAttribute("data-wizard");
    currentWizardStep = 0;
    renderWizard();
  }

  function renderWizard() {
    const wizard = COMPLIANCE_DATABASE.wizards[activeWizard];
    if (!wizard) return;

    wizardStepperHead.innerHTML = "";
    wizard.steps.forEach((step, idx) => {
      const stepNode = document.createElement("div");
      stepNode.className = "step-node";
      if (idx === currentWizardStep) stepNode.classList.add("active");
      if (idx < currentWizardStep) stepNode.classList.add("completed");
      
      stepNode.innerHTML = `
        <div class="step-circle">${idx + 1}</div>
        <span class="step-label">${step.title.split(' ')[0]}</span>
      `;
      wizardStepperHead.appendChild(stepNode);
    });

    const activeStep = wizard.steps[currentWizardStep];
    
    let checklistHtml = "";
    activeStep.requirements.forEach(req => {
      checklistHtml += `
        <label style="display:flex; align-items:flex-start; gap: 0.75rem; background:rgba(255,255,255,0.02); padding: 0.8rem; border-radius:10px; cursor:pointer; margin-bottom: 0.5rem;">
          <input type="checkbox" style="margin-top: 0.25rem;" checked>
          <span style="font-size: 0.95rem;">${req}</span>
        </label>
      `;
    });

    wizardStepBody.innerHTML = `
      <span class="law-badge" style="align-self: flex-start;">Step ${currentWizardStep + 1} of ${wizard.steps.length}</span>
      <h4>${activeStep.title}</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem;">${activeStep.description}</p>
      
      <div style="margin-top: 1rem;">
        <span style="font-family: var(--font-headings); font-weight: 600; display:block; margin-bottom: 0.75rem; color: var(--color-accent);">Required Information & Documents Checklist:</span>
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          ${checklistHtml}
        </div>
      </div>
    `;

    wizardPrevBtn.disabled = currentWizardStep === 0;
    if (currentWizardStep === wizard.steps.length - 1) {
      wizardNextBtn.textContent = "Finish & Validate";
      wizardNextBtn.style.background = "linear-gradient(135deg, var(--color-primary), var(--color-secondary))";
      wizardNextBtn.style.color = "var(--text-inverse)";
    } else {
      wizardNextBtn.textContent = "Next Step";
      wizardNextBtn.style.background = "linear-gradient(135deg, var(--color-accent), var(--color-secondary))";
      wizardNextBtn.style.color = "#fff";
    }
  }

  async function handleWizardNext() {
    const wizard = COMPLIANCE_DATABASE.wizards[activeWizard];
    if (currentWizardStep < wizard.steps.length - 1) {
      currentWizardStep++;
      renderWizard();
    } else {
      // Completed wizard
      if (activeWizard === "cac") {
        // Collect mock input data to send to CAC VAS mapping endpoint
        const directorsInput = [
          { name: "Adewale Balogun", idNum: "NG-NIN-99281726" },
          { name: "Chinwe Egwu", idNum: "NG-NIN-10293847" }
        ];
        const shareSplitInput = [60, 40];
        const proposedName1 = "Apex Innovate LTD";
        const proposedName2 = "Apex Solutions LTD";
        
        try {
          const res = await fetch("/api/compliance/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              proposedName1,
              proposedName2,
              shareCapital: 1000000,
              shareSplit: shareSplitInput,
              directors: directorsInput,
              address: "15 Herbert Macaulay Way, Yaba, Lagos",
              companyType: "LTD"
            })
          });
          const data = await res.json();
          
          // Display the mapped CAC VAS JSON output inside a detail modal
          modalTitleText.textContent = "CAC VAS JSON Payload Generated";
          modalSubtitleText.textContent = `Target API: ${data.cacVasEndpoint}`;
          modalBodyContent.innerHTML = `
            <p style="color:var(--color-primary); font-weight:600; margin-bottom: 0.5rem;">The following JSON payload has been dynamically mapped and structured to conform precisely to the official CAC Value Added Services (VAS) API endpoint for company registration:</p>
            <pre style="background:#070a14; border:1px solid var(--border-glass); border-radius:12px; padding: 1.5rem; color:#00f5a0; font-family:monospace; font-size:0.85rem; max-height: 400px; overflow-y: auto; white-space: pre-wrap;">${JSON.stringify(data.mappedPayload, null, 2)}</pre>
          `;
          detailModal.style.display = "flex";
          
        } catch (e) {
          console.error("Failed to map CAC VAS register:", e);
        }
      } else {
        alert(`All steps for the ${wizard.title} have been validated! Your document checklist is compiled. Please contact the AI Advisor for final submission templates.`);
      }
      currentWizardStep = 0;
      renderWizard();
    }
  }

  function handleWizardPrev() {
    if (currentWizardStep > 0) {
      currentWizardStep--;
      renderWizard();
    }
  }

  // --- CONTRACT DRAFT GENERATOR ---
  function initContracts() {
    contractTemplateList.innerHTML = "";
    for (const [key, value] of Object.entries(COMPLIANCE_DATABASE.contractTemplates)) {
      const btn = document.createElement("button");
      btn.className = `contract-card-btn ${key === activeContractTemplate ? 'active' : ''}`;
      btn.setAttribute("data-contract-key", key);
      btn.innerHTML = `
        <h4>${value.name}</h4>
        <p>${value.description.substring(0, 85)}...</p>
      `;
      contractTemplateList.appendChild(btn);
      
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".contract-card-btn").forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        activeContractTemplate = e.currentTarget.getAttribute("data-contract-key");
        renderContractForm();
      });
    }

    renderContractForm();
  }

  function renderContractForm() {
    const template = COMPLIANCE_DATABASE.contractTemplates[activeContractTemplate];
    if (!template) return;

    contractTitleDisplay.textContent = template.name;
    contractDescDisplay.textContent = template.description;
    
    contractInputsContainer.innerHTML = "";
    template.fields.forEach(field => {
      const group = document.createElement("div");
      group.className = "form-group";
      group.style.marginBottom = "0.75rem";
      
      const type = field.type || "text";
      const defaultValue = field.default || "";
      
      group.innerHTML = `
        <label for="fld-${field.id}" style="font-size:0.85rem;">${field.label}</label>
        <input type="${type}" id="fld-${field.id}" placeholder="${field.placeholder || ''}" value="${defaultValue}" class="contract-field-input" style="padding: 0.6rem 1rem; font-size: 0.9rem;">
      `;
      contractInputsContainer.appendChild(group);
    });

    document.querySelectorAll(".contract-field-input").forEach(input => {
      input.addEventListener("input", generateContractPreview);
    });

    generateContractPreview();
  }

  function generateContractPreview() {
    const template = COMPLIANCE_DATABASE.contractTemplates[activeContractTemplate];
    if (!template) return;

    const fieldValues = {};
    template.fields.forEach(field => {
      const inputEl = document.getElementById(`fld-${field.id}`);
      fieldValues[field.id] = inputEl ? inputEl.value : (field.default || "");
    });

    const textDraft = template.generate(fieldValues);
    contractPreviewDisplay.textContent = textDraft;
  }

  function handleCopyContract() {
    navigator.clipboard.writeText(contractPreviewDisplay.textContent)
      .then(() => alert("Contract draft copied to clipboard successfully!"))
      .catch(err => alert("Failed to copy text: " + err));
  }

  // --- STATUTORY TAX & LEVY CALCULATOR ---
  function handleCalculateTax(e) {
    e.preventDefault();
    
    const rev = parseFloat(calcRevenueInput.value) || 0;
    const profit = parseFloat(calcNetProfitInput.value) || 0;
    const monthlyPayroll = parseFloat(calcPayrollInput.value) || 0;
    const employeesCount = parseInt(calcEmployeesCountInput.value) || 0;
    const isStartupLabelled = calcIsStartupCheckbox.checked;

    let citPercent = 0.30;
    let citStatusText = "30% Large Company CIT Rate";
    
    if (rev < 25000000) {
      citPercent = 0.0;
      citStatusText = "0% Small Company Rate (Turnover < ₦25m)";
    } else if (rev <= 100000000) {
      citPercent = 0.20;
      citStatusText = "20% Medium Company Rate (Turnover ₦25m-₦100m)";
    }
    
    if (isStartupLabelled) {
      citPercent = 0.0;
      citStatusText = "0% Pioneer Tax Holiday (Startup Act 2022)";
    }
    const calculatedCIT = Math.max(profit * citPercent, 0);

    const calculatedVAT = rev * 0.075;
    const calculatedPension = monthlyPayroll * 12 * 0.10;
    const calculatedNSITF = monthlyPayroll * 12 * 0.01;

    let calculatedITF = 0;
    let itfStatusText = "Exempt (Staff < 5 & Turnover < ₦50m)";
    
    if (!isStartupLabelled && (employeesCount >= 5 || rev >= 50000000)) {
      calculatedITF = monthlyPayroll * 12 * 0.01;
      itfStatusText = "1% statutory levy (>= 5 employees or >= ₦50m turnover)";
    } else if (isStartupLabelled) {
      itfStatusText = "Exempt (Startup Act Label relief)";
    }

    const totalObligations = calculatedCIT + calculatedVAT + calculatedPension + calculatedNSITF + calculatedITF;

    calcResultsBox.style.display = "flex";
    calcResultsBox.innerHTML = `
      <h4>Statutory Estimations Breakdown</h4>
      <div class="result-row">
        <span>Companies Income Tax (CIT):</span>
        <strong>₦${calculatedCIT.toLocaleString('en-NG', { maximumFractionDigits: 2 })} <small style="color:var(--text-muted); font-weight:normal;">(${citStatusText})</small></strong>
      </div>
      <div class="result-row">
        <span>Estimated Collected VAT (7.5%):</span>
        <strong>₦${calculatedVAT.toLocaleString('en-NG', { maximumFractionDigits: 2 })} <small style="color:var(--text-muted); font-weight:normal;">(to be remitted monthly)</small></strong>
      </div>
      <div class="result-row">
        <span>Employer Pension Contribution (10%):</span>
        <strong>₦${calculatedPension.toLocaleString('en-NG', { maximumFractionDigits: 2 })} <small style="color:var(--text-muted); font-weight:normal;">(annualized sum)</small></strong>
      </div>
      <div class="result-row">
        <span>NSITF Social Contribution (1%):</span>
        <strong>₦${calculatedNSITF.toLocaleString('en-NG', { maximumFractionDigits: 2 })} <small style="color:var(--text-muted); font-weight:normal;">(annualized payroll levy)</small></strong>
      </div>
      <div class="result-row">
        <span>Industrial Training Fund (ITF):</span>
        <strong>₦${calculatedITF.toLocaleString('en-NG', { maximumFractionDigits: 2 })} <small style="color:var(--text-muted); font-weight:normal;">(${itfStatusText})</small></strong>
      </div>
      
      <div class="result-row total">
        <span>Total Annual Corporate Compliance Cost:</span>
        <strong style="color: var(--color-primary)">₦${totalObligations.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</strong>
      </div>
      
      <div style="display:flex; justify-content:center; margin-top:1rem;">
        <button type="button" id="btn-save-tax-calc" style="background: linear-gradient(135deg, var(--color-accent), var(--color-secondary)); color:#fff; border:none; border-radius:10px; padding:0.6rem 1.5rem; font-size:0.85rem; font-weight:600; cursor:pointer; transition: all 0.3s ease;">Save Calculation to History</button>
      </div>
      
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem; text-align: center;">
        Note: These estimates are statutory projections based on current tax law structures and are not final tax filings.
      </div>
    `;

    // Attach save handler
    const saveTaxBtn = document.getElementById("btn-save-tax-calc");
    if (saveTaxBtn) {
      saveTaxBtn.addEventListener("click", async () => {
        saveTaxBtn.textContent = "Saving...";
        saveTaxBtn.disabled = true;
        try {
          const res = await fetch(`/api/companies/${currentCompanyId}/tax-history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              revenue: rev,
              profit,
              payroll: monthlyPayroll,
              employees: employeesCount,
              cit_estimate: calculatedCIT,
              vat_estimate: calculatedVAT,
              pension_estimate: calculatedPension,
              nsitf_estimate: calculatedNSITF,
              itf_estimate: calculatedITF,
              total_obligations: totalObligations
            })
          });
          if (res.ok) {
            saveTaxBtn.textContent = "✓ Saved!";
            saveTaxBtn.style.background = "var(--color-primary)";
            await fetchTaxHistory();
          } else {
            saveTaxBtn.textContent = "Save Failed";
          }
        } catch (e) {
          console.error("Failed to save tax calc:", e);
          saveTaxBtn.textContent = "Save Failed";
        }
      });
    }
  }

  // --- AI LAW ADVISOR CHATBOT ---
  async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendChatMessage(text, "user");
    chatInput.value = "";

    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-bubble agent";
    typingBubble.id = "chat-typing-indicator";
    typingBubble.innerHTML = `<p><em>Complai is searching legal codes...</em></p>`;
    chatMsgPanel.appendChild(typingBubble);
    chatMsgPanel.scrollTop = chatMsgPanel.scrollHeight;

    try {
      const activeComp = companies.find(c => c.id === currentCompanyId);
      
      const res = await fetch("/api/compliance/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          companyProfile: activeComp
        })
      });
      const data = await res.json();
      
      const indicator = document.getElementById("chat-typing-indicator");
      if (indicator) indicator.remove();

      const formattedAnswer = `${data.answer}\n\n*<small style="color:var(--text-muted);">Source: ${data.source}</small>*`;
      appendChatMessage(formattedAnswer, "agent");

    } catch (e) {
      console.error("Chat advisor failed:", e);
      const indicator = document.getElementById("chat-typing-indicator");
      if (indicator) indicator.remove();
      appendChatMessage("Apologies, I encountered a communication error with the compliance server. Please try again.", "agent");
    }
  }

  function appendChatMessage(content, sender) {
    const msg = document.createElement("div");
    msg.className = `chat-bubble ${sender}`;
    msg.innerHTML = content.split("\n").map(paragraph => `<p>${paragraph}</p>`).join("");
    chatMsgPanel.appendChild(msg);
    chatMsgPanel.scrollTop = chatMsgPanel.scrollHeight;
  }

  // --- NOTIFICATIONS ENGINE ---
  async function fetchNotifications() {
    try {
      const res = await fetch(`/api/companies/${currentCompanyId}/notifications`);
      if (!res.ok) throw new Error("API status " + res.status);
      const notifications = await res.json();
      if (!Array.isArray(notifications)) throw new Error("Not an array");

      const unreadCount = notifications.filter(n => n.is_read === 0).length;

      if (notifBadge) {
        if (unreadCount > 0) {
          notifBadge.style.display = "flex";
          notifBadge.textContent = unreadCount > 9 ? "9+" : unreadCount;
        } else {
          notifBadge.style.display = "none";
        }
      }

      if (notificationList) {
        if (notifications.length === 0) {
          notificationList.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">No notifications yet. Overdue filings will appear here.</div>`;
        } else {
          notificationList.innerHTML = "";
          notifications.forEach(n => {
            const div = document.createElement("div");
            div.style.cssText = `padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-glass); font-size: 0.85rem; opacity: ${n.is_read ? '0.5' : '1'}; transition: opacity 0.3s;`;
            
            const typeColor = n.type === "warning" ? "var(--color-warning)" : "var(--color-danger)";
            const timeAgo = getTimeAgo(n.created_at);
            
            div.innerHTML = `
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                <div style="width:6px; height:6px; border-radius:50%; background:${typeColor}; flex-shrink:0;"></div>
                <span style="font-weight:600; color:${typeColor}; text-transform:uppercase; font-size:0.7rem;">${n.type}</span>
                <span style="margin-left:auto; font-size:0.7rem; color:var(--text-muted);">${timeAgo}</span>
              </div>
              <p style="margin:0; color:#ccc; line-height:1.4;">${n.message.replace(/\[.*?\]/, '')}</p>
            `;
            notificationList.appendChild(div);
          });
        }
      }
    } catch (e) {
      console.warn("Notifications fetch failed:", e.message);
    }
  }

  function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  async function markAllNotificationsRead() {
    try {
      await fetch(`/api/companies/${currentCompanyId}/notifications/read`, { method: "POST" });
      await fetchNotifications();
    } catch (e) {
      console.error("Failed to mark notifications as read:", e);
    }
  }

  // --- DB DIAGNOSTICS ---
  async function checkDbStatus() {
    try {
      const res = await fetch("/api/diagnostics/db");
      const data = await res.json();

      if (data.status === "connected" && dbStatusDot && dbStatusText) {
        dbStatusDot.style.background = "var(--color-primary)";
        dbStatusDot.style.boxShadow = "0 0 8px var(--color-primary)";
        const totalRecords = Object.values(data.tables).reduce((sum, v) => sum + v, 0);
        dbStatusText.textContent = `Cloud DB Active • ${totalRecords} records`;
        dbStatusText.style.color = "var(--color-primary)";
      } else {
        if (dbStatusDot) {
          dbStatusDot.style.background = "var(--color-danger)";
          dbStatusDot.style.boxShadow = "0 0 8px var(--color-danger)";
        }
        if (dbStatusText) {
          dbStatusText.textContent = "DB Disconnected • Local Fallback";
          dbStatusText.style.color = "var(--color-danger)";
        }
      }
    } catch (e) {
      if (dbStatusDot) {
        dbStatusDot.style.background = "var(--color-warning)";
      }
      if (dbStatusText) {
        dbStatusText.textContent = "Connection check failed";
        dbStatusText.style.color = "var(--color-warning)";
      }
    }
  }

  // --- TAX HISTORY ---
  async function fetchTaxHistory() {
    if (!taxHistoryContainer) return;
    try {
      const res = await fetch(`/api/companies/${currentCompanyId}/tax-history`);
      if (!res.ok) throw new Error("API status " + res.status);
      const history = await res.json();
      if (!Array.isArray(history)) throw new Error("Not an array");

      if (history.length === 0) {
        taxHistoryContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No calculations saved yet. Run the estimator above to begin tracking.</p>`;
        return;
      }

      taxHistoryContainer.innerHTML = "";
      history.forEach((h, idx) => {
        const date = new Date(h.calculated_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const div = document.createElement("div");
        div.style.cssText = "background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); border-radius:12px; padding:1rem; display:grid; grid-template-columns: 1fr 1fr 1fr; gap:0.5rem; font-size:0.8rem;";
        div.innerHTML = `
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Revenue</span>
            <strong style="color:var(--color-secondary);">₦${Number(h.revenue).toLocaleString('en-NG')}</strong>
          </div>
          <div>
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Total Obligations</span>
            <strong style="color:var(--color-primary);">₦${Number(h.total_obligations).toLocaleString('en-NG')}</strong>
          </div>
          <div style="text-align:right;">
            <span style="color:var(--text-muted); display:block; font-size:0.7rem;">Calculated</span>
            <strong style="color:var(--text-muted);">${date}</strong>
          </div>
        `;
        taxHistoryContainer.appendChild(div);
      });
    } catch (e) {
      console.warn("Tax history fetch failed:", e.message);
    }
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        const view = item.getAttribute("data-view");
        switchView(view);
      });
    });

    companySelector.addEventListener("change", (e) => {
      currentCompanyId = e.target.value;
      loadCompanyProfile(currentCompanyId);
      fetchNotifications();
      fetchTaxHistory();
    });

    btnOnboardNew.addEventListener("click", handleCreateNewCompany);
    onboardingForm.addEventListener("submit", handleSaveProfile);
    librarySearchInput.addEventListener("input", handleSearchLibrary);

    modalCloseBtn.addEventListener("click", () => {
      detailModal.style.display = "none";
    });

    detailModal.addEventListener("click", (e) => {
      if (e.target === detailModal) {
        detailModal.style.display = "none";
      }
    });

    wizardNavButtons.forEach(btn => {
      btn.addEventListener("click", handleWizardNav);
    });

    wizardNextBtn.addEventListener("click", handleWizardNext);
    wizardPrevBtn.addEventListener("click", handleWizardPrev);
    btnCopyContract.addEventListener("click", handleCopyContract);
    calcForm.addEventListener("submit", handleCalculateTax);

    // Automation: Add Income Form listener
    addIncomeForm.addEventListener("submit", handleAddIncome);

    chatSendBtn.addEventListener("click", handleSendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });

    chatSuggestions.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const query = e.target.getAttribute("data-query");
        chatInput.value = query;
        handleSendMessage();
      });
    });

    // Notification bell toggle
    if (btnNotifications) {
      btnNotifications.addEventListener("click", () => {
        const isVisible = notificationPanel.style.display === "block";
        notificationPanel.style.display = isVisible ? "none" : "block";
        if (!isVisible) fetchNotifications();
      });
    }

    // Mark all notifications read
    if (btnMarkAllRead) {
      btnMarkAllRead.addEventListener("click", markAllNotificationsRead);
    }

    // Close notification panel when clicking outside
    document.addEventListener("click", (e) => {
      if (notificationPanel && btnNotifications &&
          !notificationPanel.contains(e.target) &&
          !btnNotifications.contains(e.target)) {
        notificationPanel.style.display = "none";
      }
    });
  }

  // Execute App
  init();
});
