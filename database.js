// Nigeria Compliance Agent - Regulatory and Legal Knowledge Base

const COMPLIANCE_DATABASE = {
  laws: [
    {
      id: "cama_2020",
      name: "Companies and Allied Matters Act (CAMA) 2020",
      authority: "Corporate Affairs Commission (CAC)",
      scope: "Corporate Governance & Company Law",
      summary: "Governs the incorporation, management, and dissolution of all corporate entities in Nigeria. Introduces single-member companies, electronic filings, and virtual general meetings.",
      requirements: [
        "Mandatory incorporation to conduct business under a corporate name.",
        "Requirement of a minimum of 2 directors (except for small companies which can have 1).",
        "Filing of Annual Returns accompanied by audited financial statements.",
        "Holding of Annual General Meetings (AGM) within 18 months of incorporation and subsequently every calendar year.",
        "Notification of changes in share capital, directors, or registered address to the CAC."
      ],
      deadlines: {
        annualReturns: "For new companies: within 18 months of incorporation. For existing companies: within 42 days after the AGM.",
        postIncorporationChanges: "Usually within 14 days of passing the resolution (e.g., change of directors, address)."
      },
      penalties: "Late filing fees for annual returns; potential striking off from the register for default over consecutive years."
    },
    {
      id: "startup_act_2022",
      name: "Nigerian Startup Act 2022",
      authority: "National Information Technology Development Agency (NITDA) & Secretariat",
      scope: "Tech Startups & Innovation",
      summary: "Creates an enabling environment for tech-enabled startups in Nigeria through funding, tax incentives, and simplified regulatory sandboxes.",
      requirements: [
        "Must be registered as a Limited Liability Company with the CAC.",
        "Must have been in existence for not more than 10 years.",
        "Must hold a 'Startup Label' issued via the Startup Support and Engagement Portal.",
        "Must have objectives centered on innovation, digital technology, or registered software.",
        "Must have at least one Nigerian founder/co-founder."
      ],
      benefits: [
        "Access to the Startup Investment Seed Fund.",
        "Pioneer Status Incentive (PSI) granting 3-4 years tax holiday.",
        "4% tax relief on employee salaries for labelled startups.",
        "Accelerated CAC, CBN, and SEC registration and regulatory sandbox entries."
      ],
      deadlines: {
        labelRenewal: "Subject to periodic validation via the Startup Portal."
      }
    },
    {
      id: "cita_2004",
      name: "Companies Income Tax Act (CITA) Cap C21 LFN 2004 (As Amended)",
      authority: "Federal Inland Revenue Service (FIRS)",
      scope: "Corporate Taxation",
      summary: "Governs the taxation of profits of all companies operating in Nigeria, excluding oil and gas companies (which pay Petroleum Profits Tax).",
      requirements: [
        "Mandatory filing of tax returns regardless of profit or loss.",
        "Small companies (turnover under ₦25 million) are exempt from CIT (but must still file).",
        "Medium companies (turnover between ₦25 million and ₦100 million) pay 20% CIT.",
        "Large companies (turnover above ₦100 million) pay 30% CIT.",
        "Filing must include audited financial statements, tax computations, and capital allowances schedules."
      ],
      deadlines: {
        filing: "Within 6 months from the end of the company's financial year (e.g., June 30th for companies whose financial year ends December 31st). For new companies, within 18 months of incorporation or 6 months after its first accounting period, whichever is earlier."
      },
      penalties: "₦25,000 for the first month of default and ₦5,000 for each subsequent month of non-compliance."
    },
    {
      id: "pita_2004",
      name: "Personal Income Tax Act (PITA) Cap P8 LFN 2004 (As Amended)",
      authority: "State Internal Revenue Services (SIRS, e.g., LIRS for Lagos)",
      scope: "Employment & Personal Taxation",
      summary: "Governs the taxation of individuals, partnerships, and sole proprietors. Establishes the Pay-As-You-Earn (PAYE) employee payroll tax system.",
      requirements: [
        "Employers must deduct PAYE tax from all employees' monthly salaries.",
        "Calculate Consolidated Relief Allowance (CRA): ₦200,000 or 1% of gross income (whichever is higher) + 20% of gross income.",
        "Taxable income is taxed progressively: 7%, 11%, 15%, 19%, 21%, up to 24% (for taxable income over ₦3.2 million).",
        "Employers must register with the relevant State IRS where employees reside."
      ],
      deadlines: {
        monthlyRemittance: "By the 10th day of the succeeding month.",
        annualEmployerReturn: "Form H1: due by January 31st of every year.",
        annualIndividualReturn: "Form A: due by March 31st of every year."
      },
      penalties: "10% penalty on unremitted tax, plus interest at the CBN monetary policy rate."
    },
    {
      id: "vata_2004",
      name: "Value Added Tax Act (VATA) Cap V1 LFN 2004 (As Amended)",
      authority: "Federal Inland Revenue Service (FIRS)",
      scope: "Indirect Consumption Tax",
      summary: "Imposes a tax on the supply of goods and services in Nigeria. The current standard rate is 7.5%.",
      requirements: [
        "All companies must register for VAT within 6 months of starting business.",
        "Charge VAT at 7.5% on all invoices for non-exempt goods/services.",
        "Collect and remit the VAT, filing monthly VAT returns (Form VAT 002).",
        "Exceptions: Basic food items, medical products, educational books, and small companies (turnover under ₦25 million) are exempt from charging VAT."
      ],
      deadlines: {
        remittance: "On or before the 21st day of the month following the transaction month."
      },
      penalties: "₦50,000 for the first month of default and ₦25,000 for each subsequent month of non-filing."
    },
    {
      id: "money_laundering_2022",
      name: "Money Laundering (Prevention and Prohibition) Act 2022",
      authority: "Special Control Unit Against Money Laundering (SCUML) / EFCC",
      scope: "Financial Intelligence & Anti-Money Laundering",
      summary: "Imposes compliance requirements on Designated Non-Financial Businesses and Professions (DNFBPs) to prevent money laundering.",
      requirements: [
        "Registration with SCUML is mandatory for DNFBPs (e.g., consultants, lawyers, hotels, accountants, real estate developers).",
        "Implement Know-Your-Customer (KYC) procedures for all clients.",
        "Report single cash transactions exceeding ₦5,000,000 (individuals) or ₦10,000,000 (corporate bodies).",
        "File weekly/monthly suspicious transaction reports (STRs)."
      ],
      deadlines: {
        registration: "Prior to opening corporate bank accounts for DNFBPs.",
        reporting: "Weekly or monthly depending on transaction volume."
      },
      penalties: "Freezing of bank accounts, administrative fines, and revocation of operating licenses."
    },
    {
      id: "pension_reform_2014",
      name: "Pension Reform Act (PRA) 2014",
      authority: "National Pension Commission (PenCom)",
      scope: "Employee Retirement Benefits",
      summary: "Establishes a contributory pension scheme for employees in both the public and private sectors.",
      requirements: [
        "Mandatory for all private employers with 15 or more employees (though optional or lower thresholds apply for smaller businesses, 3+ is the standard PenCom target).",
        "Deduct 8% of the employee's monthly gross salary.",
        "Contribute 10% of the employee's monthly gross salary from the employer.",
        "Remit the combined 18% into the employee's Pension Fund Account (PFA)."
      ],
      deadlines: {
        remittance: "Within 7 working days from the payment of salaries."
      },
      penalties: "Interest charge of not less than 2% per month on the unremitted amount."
    },
    {
      id: "employees_compensation_2010",
      name: "Employee's Compensation Act (ECA) 2010",
      authority: "Nigeria Social Insurance Trust Fund (NSITF)",
      scope: "Social Insurance",
      summary: "Provides compensation to employees or their dependents for work-related injuries, diseases, or death.",
      requirements: [
        "Mandatory registration of all employees with the NSITF.",
        "Contribution of 1% of the total monthly gross payroll of the company."
      ],
      deadlines: {
        remittance: "Monthly, typically alongside salary payments."
      },
      penalties: "Fines and potential prosecution of directors."
    },
    {
      id: "itf_act_2004",
      name: "Industrial Training Fund (ITF) Act Cap I9 LFN 2004 (As Amended)",
      authority: "Industrial Training Fund (ITF) Governing Council",
      scope: "Workforce Training",
      summary: "Requires employers to contribute to a national fund used to train and develop the Nigerian workforce.",
      requirements: [
        "Mandatory for employers with 5 or more employees, or with an annual turnover of ₦50 million and above.",
        "Contribute 1% of the company's annual payroll."
      ],
      deadlines: {
        filing: "Annually, on or before April 1st of the succeeding year."
      },
      benefits: "Employers can claim up to 50% refund of contributions if they provide evidence of training conducted for employees."
    },
    {
      id: "data_protection_2023",
      name: "Nigeria Data Protection Act (NDPA) 2023",
      authority: "Nigeria Data Protection Commission (NDPC)",
      scope: "Privacy & Data Protection",
      summary: "Regulates the processing of personal data of Nigerian citizens and residents. Replaces and expands the NDPR 2019.",
      requirements: [
        "Appoint a Data Protection Officer (DPO).",
        "Conduct Data Protection Impact Assessments (DPIA) for high-risk processing.",
        "Publish a clear Privacy Policy on websites/applications.",
        "Submit an annual Data Protection Compliance Audit Report (CAR) if processing data of >1,000 data subjects (under NDPR) or as categorized by the NDPC."
      ],
      deadlines: {
        auditFiling: "Annually on or before March 15th."
      },
      penalties: "Fines of up to ₦10,000,000 or 2% of annual gross turnover (whichever is higher) for major data processors."
    }
  ],

  wizards: {
    cac: {
      title: "CAC Company Registration",
      steps: [
        {
          title: "Entity Selection",
          description: "Choose your corporate vehicle. The most common for startups is a Private Limited Liability Company (LTD). Business Names (Sole Proprietorship/Partnership) are cheaper but do not offer limited liability or share structures.",
          requirements: ["Decide on LTD vs. Business Name", "Determine Share Capital (Startup standard: minimum 1,000,000 shares)"]
        },
        {
          title: "Name Reservation",
          description: "Submit 2 proposed company names to the CAC for availability search and reservation.",
          requirements: ["Proposed Name 1", "Proposed Name 2", "CAC Reservation Fee (₦500)"]
        },
        {
          title: "Company Details & Objectives",
          description: "Enter company address, principal activity, and the Memorandums and Articles of Association (MEMART). For startups, objective clauses must capture tech innovation.",
          requirements: ["Registered office address in Nigeria", "Email and phone number of the company", "MEMART objectives description"]
        },
        {
          title: "Directors, Shareholders & Secretary",
          description: "Provide details of the stakeholders. Small companies can have 1 director and 1 shareholder, but they must be different if not a single-member entity. Secretary is optional for small companies.",
          requirements: ["Government ID (International Passport, National ID, or Voter's Card)", "Signature specimen", "Proof of address", "Share split details (e.g., 70% Founder A, 30% Founder B)"]
        },
        {
          title: "Payment & Document Upload",
          description: "Pay the CAC filing fees and stamp duties to the Federal Inland Revenue Service (FIRS) electronically via Remita. Upload signed documents.",
          requirements: ["CAC Registration Fee (depends on share capital, e.g., ₦15,000 for 1m capital)", "Stamp Duty Fee (0.75% of share capital, e.g., ₦7,500)", "Signed CAC form 1.1 / CAC portals outputs"]
        }
      ]
    },
    scuml: {
      title: "SCUML Registration Checklist",
      eligibility: [
        "Consulting Firms",
        "Law Firms / Legal Practitioners",
        "Audit, Accounting & Tax Advisory Firms",
        "Real Estate Developers & Estate Surveyors/Valuers",
        "Hotels, Casinos & Hospitality Outlets",
        "Dealers in Precious Stones, Metals & Jewelry",
        "Supermarkets & Import/Export Businesses"
      ],
      steps: [
        {
          title: "Profile Creation",
          description: "Create an account on the official SCUML portal (scuml.efcc.gov.ng).",
          requirements: ["Valid corporate email", "Company phone number"]
        },
        {
          title: "Document Compilation",
          description: "Gather all necessary CAC corporate documents and tax certifications.",
          requirements: [
            "CAC Certificate of Incorporation / Business Name Registration",
            "MEMART (for LTDs)",
            "CAC Status Report (Form CAC 1.1 / CAC 2 & 7)",
            "Tax Identification Number (TIN) letter/certificate",
            "BVN of directors/proprietors",
            "Professional affiliation certificate (e.g., ICAN, NBA, AMDON, JMAN) where applicable"
          ]
        },
        {
          title: "Form Submission",
          description: "Fill the online application form and scan & upload all documents in PDF format.",
          requirements: ["Complete description of business operations", "Uploading clear, color scans of CAC documents"]
        },
        {
          title: "Verification & Collection",
          description: "The SCUML unit processes the application (typically takes 1-3 weeks). Once approved, the SCUML certificate can be downloaded or collected from the designated EFCC office.",
          requirements: ["Wait for email approval", "Note: Registration is 100% free; no government fees apply"]
        }
      ]
    },
    trademark: {
      title: "Trademark Registration Process",
      steps: [
        {
          title: "Trademark Search",
          description: "Conduct a search at the Trademark Registry (Commercial Law Department) to ensure the logo, brand name, or slogan is not identical or confusingly similar to an existing trademark.",
          requirements: ["Representation of the trademark (logo image or wordmark text)", "Search Fee (approx. ₦5,000 if using agent)"]
        },
        {
          title: "Application & Acknowledgement",
          description: "Submit the trademark application under the relevant Class (Nice Classification system of 45 classes). An official Acknowledgement Document is issued containing the application number.",
          requirements: ["Applicant details", "Trademark Class selection", "Filing Fee payment"]
        },
        {
          title: "Examination & Acceptance",
          description: "The registrar reviews the application for distinctiveness and compliance. If accepted, an 'Acceptance Letter' is issued.",
          requirements: ["Wait 1-3 months for the registrar's review"]
        },
        {
          title: "Publication in Trademark Journal",
          description: "The accepted trademark is published in the Trademark Journal. This allows any third party to oppose the registration within 2 months of publication.",
          requirements: ["Journal publication fee payment", "Monitoring the 2-month opposition period"]
        },
        {
          title: "Registration Certificate",
          description: "If no opposition is filed (or if opposition is resolved in favor of the applicant), the Registrar issues the Certificate of Registration.",
          requirements: ["Trademark Registration Certificate", "Validity: 7 years, renewable every 14 years"]
        }
      ]
    }
  },

  contractTemplates: {
    employment: {
      name: "Standard Nigerian Employment Agreement",
      description: "A comprehensive employment contract compliant with the Labor Act and standard corporate practices in Nigeria, incorporating pension contributions, PAYE tax withholding, and intellectual property transfer.",
      fields: [
        { id: "employerName", label: "Employer (Company Name)", placeholder: "e.g., Antigravity Labs Ltd" },
        { id: "employeeName", label: "Employee Full Name", placeholder: "e.g., Chidi Okafor" },
        { id: "employeeAddress", label: "Employee Address", placeholder: "e.g., 12 Herbert Macaulay Way, Yaba, Lagos" },
        { id: "jobTitle", label: "Job Title", placeholder: "e.g., Senior Software Engineer" },
        { id: "startDate", label: "Start Date", type: "date" },
        { id: "probationMonths", label: "Probation Period (Months)", placeholder: "e.g., 3", default: "3" },
        { id: "monthlyGrossSalary", label: "Monthly Gross Salary (₦)", placeholder: "e.g., 800000" },
        { id: "leaveDays", label: "Annual Paid Leave (Days)", placeholder: "e.g., 20", default: "20" }
      ],
      generate: (f) => {
        const salary = parseFloat(f.monthlyGrossSalary) || 0;
        const basic = salary * 0.5;
        const housing = salary * 0.3;
        const transport = salary * 0.2;
        
        const pensionBase = basic + housing + transport;
        const employeePension = pensionBase * 0.08;
        const employerPension = pensionBase * 0.10;

        return `EMPLOYMENT CONTRACT

THIS EMPLOYMENT AGREEMENT (the "Agreement") is made this ________ day of 2026.

BETWEEN:
${f.employerName || "[Employer Name]"}, a company incorporated under the laws of the Federal Republic of Nigeria, with its registered office at ____________________________________ (hereinafter referred to as the "Employer") of the one part;

AND:
${f.employeeName || "[Employee Name]"} of ${f.employeeAddress || "[Employee Address]"} (hereinafter referred to as the "Employee") of the other part.

WHEREAS:
The Employer desires to employ the Employee, and the Employee agrees to accept employment with the Employer under the terms and conditions set forth herein.

IT IS AGREED AS FOLLOWS:

1. POSITION AND DUTIES
1.1 The Employee is appointed in the position of ${f.jobTitle || "[Job Title]"}.
1.2 The Employee shall perform such duties as are standard for this position and other duties assigned by the management from time to time.
1.3 The Employee shall devote their full business time, attention, and skills to the business of the Employer and shall comply with all corporate policies.

2. COMMENCEMENT AND PROBATION
2.1 This Agreement shall commence on ${f.startDate || "[Start Date]"} (the "Commencement Date").
2.2 The Employee's employment shall be subject to an initial probationary period of ${f.probationMonths || "3"} months. During the probationary period, either party may terminate this Agreement by giving one (1) week's written notice or payment of salary in lieu of notice.

3. COMPENSATION AND BENEFITS
3.1 The Employee shall receive a monthly gross salary of ₦${salary.toLocaleString('en-NG')} (excluding statutory deductions).
3.2 The compensation split is designated as follows:
    - Basic Salary (50%): ₦${basic.toLocaleString('en-NG')}
    - Housing Allowance (30%): ₦${housing.toLocaleString('en-NG')}
    - Transport Allowance (20%): ₦${transport.toLocaleString('en-NG')}
3.3 Statutory Deductions and Contributions:
    a) Pay-As-You-Earn (PAYE): The Employer shall deduct personal income tax in accordance with the Personal Income Tax Act (PITA) and remit it to the relevant State Internal Revenue Service.
    b) Pensions: In accordance with the Pension Reform Act 2014, the Employee shall contribute 8% (₦${employeePension.toLocaleString('en-NG')}) and the Employer shall contribute 10% (₦${employerPension.toLocaleString('en-NG')}) of the employee's designated pensionable salary (Basic + Housing + Transport) to the Employee's designated PFA.
    c) Other Deductions: Any other statutory contributions (e.g., NHF) shall be deducted at source.

4. WORKING HOURS AND LEAVE
4.1 The standard working hours shall be Monday through Friday, 8:00 AM to 5:00 PM, or as determined by operational requirements.
4.2 The Employee is entitled to ${f.leaveDays || "20"} days of paid annual leave per calendar year, to be accrued pro-rata, in addition to public holidays declared by the Federal Government of Nigeria.

5. INTELLECTUAL PROPERTY
5.1 The Employee agrees that all intellectual property, including inventions, software code, designs, business plans, patents, and copyrightable works created or developed by the Employee in the course of their employment with the Employer shall be the sole and exclusive property of the Employer.
5.2 The Employee hereby assigns all rights, titles, and interests in such intellectual property to the Employer and agrees to execute any documents necessary to formalize such assignment.

6. CONFIDENTIALITY
6.1 The Employee shall not, during the term of this Agreement or at any time thereafter, disclose, copy, or use any confidential information, proprietary tech, or trade secrets of the Employer for their own benefit or the benefit of any third party.

7. TERMINATION
7.1 Post-probation, either party may terminate this Agreement by giving one (1) month's written notice or payment of one (1) month's gross salary in lieu of notice.
7.2 The Employer may terminate this Agreement summarily without notice or salary in lieu of notice for gross misconduct, fraud, dishonesty, criminal offense, or material breach of this Agreement.

8. GOVERNING LAW AND DISPUTE RESOLUTION
8.1 This Agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
8.2 Any dispute arising out of or in connection with this Agreement shall first be settled amicably through negotiation. Where negotiation fails, the dispute shall be referred to the National Industrial Court of Nigeria (NICN).

IN WITNESS WHEREOF the parties have executed this Agreement the day and year first above written.

_______________________________          _______________________________
For: ${f.employerName || "[Employer Name]"}              ${f.employeeName || "[Employee Name]"}
Authorized Signatory                     Employee`;
      }
    },
    nda: {
      name: "Mutual Non-Disclosure Agreement (NDA)",
      description: "A standard corporate NDA drafted in accordance with Nigerian contract law principles, protecting intellectual property and sensitive startup data during partner discussions.",
      fields: [
        { id: "partyA", label: "Party A (Company Name)", placeholder: "e.g., Antigravity Labs Ltd" },
        { id: "partyB", label: "Party B (Partner Name)", placeholder: "e.g., Zenith Ventures Nigeria Ltd" },
        { id: "purpose", label: "Purpose of Disclosures", placeholder: "e.g., discussing a potential software development collaboration and investment opportunity" },
        { id: "termYears", label: "Confidentiality Term (Years)", placeholder: "e.g., 3", default: "3" }
      ],
      generate: (f) => {
        return `MUTUAL NON-DISCLOSURE AGREEMENT

THIS NON-DISCLOSURE AGREEMENT (the "Agreement") is entered into this ________ day of 2026.

BETWEEN:
${f.partyA || "[Party A Name]"}, a company incorporated under the laws of the Federal Republic of Nigeria, with its registered office at ____________________________________ (hereinafter referred to as "Party A");

AND:
${f.partyB || "[Party B Name]"}, a company incorporated under the laws of the Federal Republic of Nigeria, with its registered office at ____________________________________ (hereinafter referred to as "Party B").

Party A and Party B may collectively be referred to as the "Parties" or individually as a "Party."

1. PURPOSE
The Parties wish to disclose to each other certain proprietary, technical, and business information for the sole purpose of:
"${f.purpose || '[Enter purpose of disclosures here]'}"
(hereinafter referred to as the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any proprietary information disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party") either directly or indirectly, in writing, orally, or by inspection of tangible objects, which is designated as "Confidential" or "Proprietary" or which, by its nature, ought reasonably to be understood as confidential.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party shall:
3.1 Hold the Confidential Information in strict confidence and use at least the same degree of care to protect it as it uses for its own confidential information of a similar nature, but in no event less than a reasonable degree of care.
3.2 Use the Confidential Information solely for the Purpose.
3.3 Limit access to the Confidential Information to its employees, directors, and professional advisors who need to know it for the Purpose, provided they are bound by confidentiality obligations no less restrictive than those in this Agreement.
3.4 Not disclose any Confidential Information to any third party without the prior written consent of the Disclosing Party.

4. EXCLUSIONS
Confidential Information does not include information that:
4.1 Is or becomes publicly known through no breach of this Agreement by the Receiving Party.
4.2 Was already in the Receiving Party's possession prior to disclosure by the Disclosing Party, as evidenced by written records.
4.3 Is obtained from a third party who has the legal right to disclose such information without restriction.
4.4 Is independently developed by the Receiving Party without reference to or reliance on the Disclosing Party's Confidential Information.

5. REMEDIES AND STAMP DUTIES
5.1 The Receiving Party acknowledges that a breach of this Agreement would cause irreparable harm to the Disclosing Party for which monetary damages alone would be inadequate. The Disclosing Party shall be entitled to seek injunctive relief, specific performance, and any other remedies available under law or equity.
5.2 To be fully enforceable in court proceedings in Nigeria, this Agreement may be stamped in accordance with the Stamp Duties Act. The costs of any such stamping shall be borne equally by the Parties.

6. TERM
The obligations under this Agreement shall remain in effect for a period of ${f.termYears || "3"} years from the date of this Agreement, notwithstanding the termination of any business discussions between the Parties.

7. GOVERNING LAW AND JURISDICTION
7.1 This Agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
7.2 Any dispute arising from or related to this Agreement shall be referred to arbitration in Nigeria under the Arbitration and Mediation Act 2023. The seat of the arbitration shall be Lagos, Nigeria, and the language shall be English.

IN WITNESS WHEREOF, the Parties have caused this Agreement to be executed by their duly authorized representatives.

_______________________________          _______________________________
For: ${f.partyA || "[Party A Name]"}              For: ${f.partyB || "[Party B Name]"}
Name:                                    Name:
Title:                                   Title:`;
      }
    }
  },

  expatriateFaq: [
    {
      q: "What is an Expatriate Quota, and who needs it?",
      a: "An Expatriate Quota is a permit granted by the Federal Ministry of Interior in Nigeria allowing a company to employ foreign nationals for specific positions. Any registered company in Nigeria wishing to employ non-citizens must obtain this quota prior to hiring."
    },
    {
      q: "What is the STR Visa and how is it different from a Business Visa?",
      a: "A Business Visa is only for short-term entry (e.g., attending meetings, conferences, or negotiations) and does not permit full-time employment in Nigeria. An STR (Subject to Regularization) Visa is specifically issued to foreign workers who have received a formal offer of employment from a company holding an approved Expatriate Quota. The STR visa is what the expatriate uses to enter Nigeria before applying for a residency card (CERPAC)."
    },
    {
      q: "What are the rules regarding 'Understudies' for foreign hires?",
      a: "Under the guidelines of the Ministry of Interior, for every expatriate employed under an Expatriate Quota, the company must employ two qualified Nigerian citizens as 'understudies'. The goal is to facilitate technology and skills transfer over a 3-year period so that the local understudies can eventually take over the position."
    },
    {
      q: "How do Transfer Pricing regulations affect hiring from a foreign parent company?",
      a: "When a foreign parent company 'seconds' or transfers an employee to its Nigerian subsidiary, the cost of that employee (salaries, travel, housing, management fees) must be charged at an arm's length price under the FIRS Transfer Pricing Regulations 2018. The FIRS expects proper documentation (a Secondment Agreement) and will penalize transactions structured to shift profits out of Nigeria."
    },
    {
      q: "What is an eCCI, and why is it important for foreign investors?",
      a: "An electronic Certificate of Capital Importation (eCCI) is a certificate issued by an authorized dealer (usually a commercial bank) on behalf of the Central Bank of Nigeria. It serves as official proof that foreign investment capital (equity or debt) was brought into Nigeria in foreign currency. It is critical for compliance because, without an eCCI, the FIRS and CBN will not permit the company to legally repatriate dividends, profits, or capital to foreign investors."
    }
  ]
};

// Export database for browser use
if (typeof module !== "undefined" && module.exports) {
  module.exports = COMPLIANCE_DATABASE;
} else {
  window.COMPLIANCE_DATABASE = COMPLIANCE_DATABASE;
}
