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

  // Current local time from metadata
  const CURRENT_DATE = new Date("2026-07-11T16:28:24+01:00");

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
    }
  }

  // --- COMPANY PROFILE MANAGEMENT ---
  async function fetchCompanies() {
    try {
      const res = await fetch("/api/companies");
      companies = await res.json();
      populateCompanySelector();
    } catch (e) {
      console.error("Failed to load companies:", e);
    }
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
  async function updateDashboardData() {
    const comp = companies.find(c => c.id === currentCompanyId);
    if (!comp) return;

    try {
      // Fetch score and timelines from Express backend
      const res = await fetch(`/api/companies/${currentCompanyId}/timelines`);
      const data = await res.json();

      statScore.textContent = `${data.score}%`;
      statPending.textContent = data.pendingCount;

      const futureTimelines = data.timelines
        .filter(t => t.status !== "overdue" && t.status !== "compliant")
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      
      if (futureTimelines.length > 0) {
        const nextDue = new Date(futureTimelines[0].dueDate);
        statUpcomingDate.textContent = nextDue.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
      } else {
        statUpcomingDate.textContent = "None";
      }

      // Set Global status sidebar indicator
      const score = data.score;
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
      renderTimelineItems(data.timelines);

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
      if (item.status === "compliant") statusBadgeLabel = "Compliant";
      
      el.innerHTML = `
        <div class="timeline-info">
          <span class="timeline-title">${item.name}</span>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 500px;">${item.description}</p>
          <div class="timeline-meta">
            <span>Due Date: <strong>${formattedDate}</strong></span>
            <span>Penalty risk: <strong>${item.scoreImpact}% Score</strong></span>
          </div>
        </div>
        <span class="timeline-badge ${item.badgeType}">${statusBadgeLabel}</span>
      `;
      
      timelineListContainer.appendChild(el);
    });
  }

  async function fetchRegulatoryUpdates() {
    try {
      const res = await fetch("/api/compliance/updates");
      const updates = await res.json();

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
      console.error("Failed to fetch updates:", e);
    }
  }

  // --- ACTIVE BUSINESS INCOME TRACKER ---
  async function fetchIncomeRows() {
    try {
      const res = await fetch(`/api/companies/${currentCompanyId}/income`);
      const rows = await res.json();
      
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
      
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem; text-align: center;">
        Note: These estimates are statutory projections based on current tax law structures and are not final tax filings.
      </div>
    `;
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
  }

  // Execute App
  init();
});
