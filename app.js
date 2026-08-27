const dimensions = {
  strategy: {
    label: "Strategy and Leadership",
    points: 20,
    recommendation:
      "Clarify ownership, tie AI work to GTM priorities, and make progress part of the regular executive operating rhythm.",
  },
  workflow: {
    label: "Workflow Operationalization",
    points: 24,
    gate: true,
    recommendation:
      "Move from isolated use cases to repeatable AI-enabled workflows, stronger data readiness, and cross-GTM orchestration.",
  },
  talent: {
    label: "Talent and Change Readiness",
    points: 16,
    recommendation:
      "Build role clarity, practical enablement, workflow libraries, and change management for teams still outside the AI motion.",
  },
  governance: {
    label: "Governance and Investment Discipline",
    points: 18,
    gate: true,
    recommendation:
      "Document governance, define risk-based oversight, and add disciplined investment and buy/build decision criteria.",
  },
  measurement: {
    label: "Measurement and Business Impact",
    points: 22,
    gate: true,
    recommendation:
      "Instrument AI-enabled workflows so adoption, productivity, workflow performance, capacity, and business outcomes can guide decisions.",
  },
};

const sections = [
  {
    id: "company",
    label: "Company Profile",
    questions: [
      {
        id: "company_industry",
        short: "Q1",
        title: "Select the industry that best describes your company:",
        type: "radio",
        required: true,
        options: [
          "B2B Software / SaaS / Cybersecurity",
          "AI-Native Software",
          "B2B Services / Consulting",
          "Manufacturing / Industrial",
          "Financial Services / Insurance",
          "Healthcare / Life Sciences",
          "Technology Hardware / Infrastructure",
          "Other",
        ],
      },
      {
        id: "company_revenue",
        short: "Q2",
        title: "Select the total revenue for your last fiscal year:",
        type: "radio",
        required: true,
        options: [
          "< $10M",
          "$10M - $20M",
          "$20M - $50M",
          "$50M - $100M",
          "$100M - $250M",
          "$250M - $500M",
          "$500M - $1B",
          "> $1B",
        ],
      },
      {
        id: "company_gtm",
        short: "Q3",
        title: "Select your primary go-to-market model:",
        type: "radio",
        required: true,
        options: ["Sales-led (SLG)", "Product-led (PLG)", "Hybrid (PLG + Sales)"],
      },
      {
        id: "company_funding",
        short: "Q4",
        title: "How is your company funded?",
        type: "radio",
        required: true,
        options: [
          "Bootstrapped",
          "Venture-backed",
          "Private equity-backed",
          "Publicly traded",
        ],
      },
    ],
  },
  {
    id: "strategy",
    label: "Strategy (20)",
    questions: [
      scoredRadio(
        "q1_owner",
        "Q5",
        "Who owns Marketing AI strategy and execution today?",
        "strategy",
        7,
        [
          "No clear owner",
          "Individual contributors or informal champions",
          "Marketing team leaders",
          "CMO or senior Marketing leadership",
          "Cross-functional GTM or executive leadership group",
        ],
      ),
      scoredRadio(
        "q2_alignment",
        "Q6",
        "Which best describes how Marketing AI priorities are set?",
        "strategy",
        7,
        [
          "Based mainly on individual experimentation",
          "Based on team-level opportunities",
          "Based on selected Marketing priorities",
          "Based on defined GTM or company objectives",
          "Reviewed as part of planning, budget, and operating decisions",
        ],
      ),
      scoredRadio(
        "q3_review",
        "Q7",
        "How often is Marketing AI progress reviewed with executive or GTM leadership?",
        "strategy",
        6,
        [
          "Rarely or never",
          "Occasionally",
          "Quarterly or during planning cycles",
          "Regularly as part of Marketing or GTM operating reviews",
          "As a standing executive agenda item with decisions, owners, and follow-up actions",
        ],
      ),
      {
        id: "q5_self",
        short: "Q8",
        title: "Which statement best reflects your Marketing organization's use of AI today?",
        type: "radio",
        required: true,
        perception: true,
        scoringLabel: "Unscored perception gap",
        options: [
          "We are experimenting with AI tools through individual use and limited coordination",
          "We are using AI in some repeatable workflows, but adoption is not yet scaled",
          "We are standardizing AI across teams and core Marketing workflows",
          "We have redesigned meaningful parts of our GTM motion with AI-enabled workflows, new operating practices, and measurable impact",
        ],
      },
    ],
  },
  {
    id: "workflow",
    label: "Workflow (24)",
    questions: [
      {
        id: "q6_functions",
        short: "Q9",
        title: "Which Marketing functions or program areas use AI in a repeatable way today?",
        helper: "Select all that apply.",
        type: "checkbox",
        required: true,
        dimension: "workflow",
        weight: 4,
        scoreFn: scoreFunctionsBreadth,
        options: [
          "Content",
          "Demand generation",
          "AEO / GEO / LLM discovery",
          "ABM",
          "Analytics and reporting",
          "Data management",
          "Sales enablement",
          "Customer marketing",
          "None",
        ],
      },
      scoredRadio(
        "q8_agentic",
        "Q10",
        "Does Marketing use AI-enabled multi-step or agentic workflows in production?",
        "workflow",
        7,
        [
          "No",
          "We are piloting one or two workflows",
          "We have several defined workflows in use",
          "We have scaled AI-enabled workflows across multiple Marketing functions",
          "We have AI-enabled workflows orchestrated across Marketing and other GTM teams",
        ],
      ),
      scoredRadio(
        "q9_gtm_integration",
        "Q11",
        "How integrated are Marketing AI workflows with broader GTM processes?",
        "workflow",
        7,
        [
          "Not integrated; AI use is mostly within individual Marketing tasks",
          "Connected to some Marketing-owned workflows",
          "Integrated with selected Sales, RevOps, or Customer Success handoffs",
          "Used across multiple GTM processes such as lead routing, sales enablement, expansion, or lifecycle marketing",
          "Orchestrated across GTM teams with shared data, workflows, governance, and measurement",
        ],
      ),
      scoredRadio(
        "q10_data_foundation",
        "Q12",
        "Which best describes the data foundation supporting Marketing AI workflows?",
        "workflow",
        6,
        [
          "Data is fragmented, inconsistent, or difficult to access",
          "Some teams can access useful data, but quality and integration vary",
          "Key Marketing data sources are connected for selected AI use cases",
          "Marketing AI workflows use governed, reliable data across core systems",
          "Marketing and GTM AI workflows use shared, trusted data with clear ownership, quality standards, and feedback loops",
        ],
      ),
    ],
  },
  {
    id: "talent",
    label: "Talent (16)",
    questions: [
      {
        id: "q12_roles",
        short: "Q13",
        title:
          "Which dedicated AI-related capabilities or roles exist in your Marketing organization today?",
        helper: "Select all that apply.",
        type: "checkbox",
        required: true,
        dimension: "talent",
        weight: 5,
        scoreFn: scoreRoles,
        options: [
          "AI operations",
          "GTM engineer",
          "AI strategist",
          "Prompt or workflow specialist",
          "Data / analytics engineer",
          "Informal AI champions",
          "None",
          "Other",
        ],
      },
      {
        id: "q13_programs",
        short: "Q14",
        title: "What programs exist to build AI competency in the Marketing team?",
        helper: "Select all that apply.",
        type: "checkbox",
        required: true,
        dimension: "talent",
        weight: 5,
        scoreFn: scorePrograms,
        options: [
          "Structured AI training or certification programs",
          "AI playbooks or usage guidelines",
          "Workflow libraries or templates",
          "Dedicated AI experimentation time or sprints",
          "Vendor-led enablement",
          "External coaching or AI consultants",
          "None",
          "Other",
        ],
      },
      scoredRadio(
        "q14_change",
        "Q15",
        "How does your organization address team members who are not engaging with AI tools, training, or new AI-enabled ways of working?",
        "talent",
        6,
        [
          "AI adoption is voluntary; no specific action is taken",
          "We encourage adoption but do not require it",
          "AI competency is included in goals, reviews, or role expectations",
          "Non-adoption is actively managed as a performance or capability issue",
          "We have a structured change management program to drive adoption and address resistance",
        ],
      ),
    ],
  },
  {
    id: "governance",
    label: "Governance (18)",
    questions: [
      scoredRadio(
        "q15_governance",
        "Q16",
        "Which best describes your Marketing AI governance practices today?",
        "governance",
        5,
        [
          "We do not have defined governance practices for Marketing AI",
          "We have basic guidance, but practices vary by team or use case",
          "We have documented standards for approved tools, data use, and review processes",
          "Governance practices are built into key AI-enabled Marketing workflows",
          "Governance is coordinated across relevant functions and reviewed on a regular cadence",
        ],
      ),
      scoredRadio(
        "q16_oversight",
        "Q17",
        "How does your organization manage human oversight in AI-enabled Marketing workflows?",
        "governance",
        5,
        [
          "We do not have defined oversight practices",
          "Humans review AI outputs informally or inconsistently",
          "Humans review outputs for most AI-assisted workflows",
          "Review and approval points are defined based on workflow risk or business impact",
          "Oversight requirements are documented by workflow type and updated based on quality, brand, legal, performance, or customer-impact data",
        ],
      ),
      scoredRadio(
        "q17_investment",
        "Q18",
        "Which best describes how AI investments used by Marketing are funded and governed?",
        "governance",
        4,
        [
          "Mostly individual or team-level tool purchases with limited coordination",
          "Funding comes from multiple sources, but there is limited visibility into total Marketing AI usage or cost",
          "Funding is managed through Marketing, IT, or shared budgets for selected AI initiatives",
          "AI investments used by Marketing are prioritized as a portfolio with owners, expected outcomes, and cost visibility",
          "AI investments used by Marketing are reviewed regularly across Marketing, IT/Finance, and relevant business owners, with decision criteria for usage, cost, value, and risk",
        ],
      ),
      scoredRadio(
        "q18_buy_build",
        "Q19",
        "Which best describes how your organization evaluates whether to buy, build, or customize AI capabilities used by Marketing?",
        "governance",
        4,
        [
          "We do not have a defined approach",
          "Decisions are made case by case, mostly based on immediate need or tool availability",
          "We consider cost, speed, and internal capability, but criteria vary by team or use case",
          "We use defined criteria to decide when to buy, build, customize, or combine solutions",
          "We regularly evaluate buy/build decisions based on cost, differentiation, integration, security, maintainability, and expected business value",
        ],
      ),
    ],
  },
  {
    id: "measurement",
    label: "Measurement (22)",
    questions: [
      scoredRadio(
        "q19_roi",
        "Q20",
        "Which best describes how your organization measures the impact of AI in Marketing?",
        "measurement",
        9,
        [
          "We do not formally measure AI impact today",
          "We primarily track adoption or usage of AI tools",
          "We measure productivity, time savings, or output gains for selected tasks",
          "We measure workflow-level impact such as cost, speed, quality, conversion, or campaign performance",
          "We connect AI-enabled workflows to business or capacity metrics such as pipeline per employee, revenue per employee, cost per campaign, or GTM productivity",
        ],
      ),
      {
        id: "q20_impact_where",
        short: "Q21",
        title: "Where has AI produced measurable impact in Marketing?",
        helper: "Select all that apply.",
        type: "checkbox",
        required: true,
        dimension: "measurement",
        weight: 5,
        scoreFn: scoreImpactAreas,
        options: [
          "No measurable impact yet",
          "Personal productivity",
          "Content volume or production speed",
          "Campaign speed or efficiency",
          "Campaign performance",
          "Pipeline contribution",
          "Revenue or customer outcomes",
          "Cost reduction",
        ],
      },
      scoredRadio(
        "q22_results",
        "Q22",
        "How are AI performance insights used in Marketing decisions?",
        "measurement",
        8,
        [
          "They are not used in decisions today",
          "They are discussed informally",
          "They inform selected workflow or campaign improvements",
          "They inform budget, staffing, vendor, or process decisions",
          "They are part of regular Marketing or GTM operating reviews and investment decisions",
        ],
      ),
    ],
  },
  {
    id: "participant",
    label: "Participant Profile",
    questions: [
      {
        id: "participant_level",
        short: "Q23",
        title: "Select your current job level:",
        type: "radio",
        required: true,
        options: [
          "C-Level (CMO, CCO, or equivalent)",
          "Senior Vice President",
          "Vice President",
          "Director",
          "Manager",
          "Individual Contributor",
        ],
      },
      {
        id: "participant_function",
        short: "Q24",
        title: "Select your current job function:",
        type: "radio",
        required: true,
        options: [
          "Marketing - Brand and Content",
          "Marketing - Demand Generation and Pipeline",
          "Marketing - Product Marketing",
          "Marketing - Marketing Operations and RevOps",
          "Marketing - Leadership (CMO / VP / Director level)",
          "Other",
        ],
      },
      {
        id: "participant_email",
        short: "Q25",
        title:
          "What email address should we use if you would like CMO Huddles follow-up?",
        helper: "Use the email address where you want to receive CMO Huddles updates.",
        type: "email",
        required: false,
      },
    ],
  },
];

const state = {
  current: 0,
  answers: {},
  latestScore: null,
  latestBenchmark: null,
  responseId: null,
  completionSaved: false,
};

const flatQuestions = sections.flatMap((section) =>
  section.questions.map((question) => ({ ...question, sectionId: section.id, sectionLabel: section.label })),
);

const questionHost = document.querySelector("#questionHost");
const sectionNav = document.querySelector("#sectionNav");
const progressPill = document.querySelector("#progressPill");
const intro = document.querySelector("#intro");
const surveyForm = document.querySelector("#surveyForm");
const results = document.querySelector("#results");
const backButton = document.querySelector("#backButton");
const nextButton = document.querySelector("#nextButton");
const reportRequestForm = document.querySelector("#reportRequestForm");
const copyReportButton = document.querySelector("#copyReportButton");

const SUPABASE_URL = "https://sesqavjfashncijbupqd.supabase.co";
const SUPABASE_KEY = "sb_publishable_l6MwbtnLzeNLFU3B4cjpJA_MxzW5nqK";
const isTestMode = new URLSearchParams(window.location.search).has("test");
const responseSource = isTestMode ? "github_pages_test" : "github_pages_webflow";

const benchmark = window.realBenchmark || createFallbackBenchmark();
const benchmarkCohort = benchmark.scores;
let resizeTimer;

function sendFrameHeight() {
  const height = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.querySelector(".shell")?.scrollHeight || 0,
  );

  window.parent.postMessage(
    {
      type: "cmo-ai-maturity-height",
      height: height + 24,
    },
    "*",
  );
}

function scheduleFrameHeightUpdate() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(sendFrameHeight, 80);
}

window.addEventListener("load", sendFrameHeight);
window.addEventListener("resize", scheduleFrameHeightUpdate);

if ("ResizeObserver" in window) {
  new ResizeObserver(scheduleFrameHeightUpdate).observe(document.body);
}

document.querySelector("#startButton").addEventListener("click", () => {
  intro.classList.add("hidden");
  surveyForm.classList.remove("hidden");
  renderQuestion();
  scheduleFrameHeightUpdate();
});

backButton.addEventListener("click", () => {
  if (state.current === 0) {
    surveyForm.classList.add("hidden");
    intro.classList.remove("hidden");
    updateProgress();
    scheduleFrameHeightUpdate();
    return;
  }
  state.current -= 1;
  renderQuestion();
  scheduleFrameHeightUpdate();
});

nextButton.addEventListener("click", () => {
  const question = flatQuestions[state.current];
  if (!validate(question)) return;
  if (state.current === flatQuestions.length - 1) {
    renderResults();
    return;
  }
  state.current += 1;
  renderQuestion();
  scheduleFrameHeightUpdate();
});

reportRequestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleReportRequest();
});

copyReportButton.addEventListener("click", async () => {
  const reportText = document.querySelector("#fullReportContent").innerText;
  if (!reportText.trim()) return;
  try {
    await navigator.clipboard.writeText(reportText);
    setReportStatus("Report copied to clipboard.");
  } catch {
    setReportStatus("Copy failed in this browser. You can still select and copy the report text.");
  }
});

function scoredRadio(id, short, title, dimension, weight, options) {
  return {
    id,
    short,
    title,
    type: "radio",
    required: true,
    dimension,
    weight,
    scoringLabel: `${weight} points`,
    options,
    scoreFn: (answer) => Number(answer ?? 0),
  };
}

function renderQuestion() {
  const question = flatQuestions[state.current];
  questionHost.innerHTML = `
    <section class="question-card">
      <div class="question-meta">
        <span class="question-number">${question.short}</span>
        ${question.scoringLabel ? `<span class="question-number">${question.scoringLabel}</span>` : ""}
        <h2>${question.title}</h2>
        ${question.helper ? `<p>${question.helper}</p>` : ""}
        <p>${question.sectionLabel}</p>
      </div>
      <div class="question-body">
        ${renderInput(question)}
        <div class="field-error hidden" id="fieldError"></div>
      </div>
    </section>
  `;

  bindInputs(question);
  renderSectionNav(question.sectionId);
  backButton.textContent = state.current === 0 ? "Intro" : "Back";
  nextButton.textContent = state.current === flatQuestions.length - 1 ? "See results" : "Next";
  updateProgress();
  scheduleFrameHeightUpdate();
}

function renderInput(question) {
  const value = state.answers[question.id];
  if (question.type === "radio") {
    return `
      <div class="option-list">
        ${question.options
          .map(
            (option, index) => `
              <label class="option">
                <input type="radio" name="${question.id}" value="${index}" ${String(value) === String(index) ? "checked" : ""}>
                <span>${option}</span>
              </label>
            `,
          )
          .join("")}
      </div>
    `;
  }

  if (question.type === "checkbox") {
    const selected = Array.isArray(value) ? value : [];
    return `
      <div class="option-list">
        ${question.options
          .map(
            (option, index) => `
              <label class="option">
                <input type="checkbox" name="${question.id}" value="${index}" ${selected.includes(index) ? "checked" : ""}>
                <span>${option}</span>
              </label>
            `,
          )
          .join("")}
      </div>
    `;
  }

  if (question.type === "rank") {
    const ranks = value || {};
    const maxRank = question.topOnly || question.options.length;
    return `
      <p class="helper">${question.topOnly ? "Choose 1, 2, and 3 for your top choices. Leave the rest blank." : "Use each rank once if possible."}</p>
      <div class="rank-grid">
        ${question.options
          .map(
            (option, index) => `
              <label class="rank-row">
                <span>${option}</span>
                <select name="${question.id}" data-rank-index="${index}">
                  <option value="">-</option>
                  ${Array.from({ length: maxRank }, (_, rankIndex) => rankIndex + 1)
                    .map(
                      (rank) =>
                        `<option value="${rank}" ${String(ranks[index] || "") === String(rank) ? "selected" : ""}>${rank}</option>`,
                    )
                    .join("")}
                </select>
              </label>
            `,
          )
          .join("")}
      </div>
    `;
  }

  if (question.type === "textarea") {
    return `<textarea name="${question.id}" placeholder="Optional">${value || ""}</textarea>`;
  }

  if (question.type === "email") {
    return `<input type="email" name="${question.id}" value="${value || ""}" placeholder="name@company.com">`;
  }

  return `<input type="text" name="${question.id}" value="${value || ""}">`;
}

function bindInputs(question) {
  const inputs = questionHost.querySelectorAll(`[name="${question.id}"]`);
  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (question.type === "radio") {
        state.answers[question.id] = Number(input.value);
      } else if (question.type === "checkbox") {
        const validChange = handleCheckboxChange(question, input);
        if (!validChange) {
          updateProgress();
          return;
        }
      } else if (question.type === "rank") {
        const ranks = state.answers[question.id] || {};
        const rankIndex = input.dataset.rankIndex;
        if (input.value) {
          ranks[rankIndex] = Number(input.value);
        } else {
          delete ranks[rankIndex];
        }
        state.answers[question.id] = ranks;
      } else {
        state.answers[question.id] = input.value;
      }
      hideError();
      updateProgress();
    });

    input.addEventListener("input", () => {
      if (["textarea", "email", "text"].includes(question.type)) {
        state.answers[question.id] = input.value;
        updateProgress();
      }
    });
  });
}

function handleCheckboxChange(question, input) {
  const current = new Set(Array.isArray(state.answers[question.id]) ? state.answers[question.id] : []);
  const index = Number(input.value);
  const noneIndex = question.options.findIndex((option) => option.toLowerCase().startsWith("none") || option.toLowerCase().startsWith("no measurable"));

  if (input.checked) {
    if (index === noneIndex && noneIndex >= 0) {
      current.clear();
      current.add(index);
      questionHost.querySelectorAll(`[name="${question.id}"]`).forEach((box) => {
        box.checked = Number(box.value) === index;
      });
    } else {
      current.delete(noneIndex);
      current.add(index);
      if (noneIndex >= 0) {
        const noneBox = questionHost.querySelector(`[name="${question.id}"][value="${noneIndex}"]`);
        if (noneBox) noneBox.checked = false;
      }
    }
  } else {
    current.delete(index);
  }

  if (question.max && current.size > question.max) {
    current.delete(index);
    input.checked = false;
    showError(`Select up to ${question.max}.`);
    state.answers[question.id] = Array.from(current).sort((a, b) => a - b);
    return false;
  }

  state.answers[question.id] = Array.from(current).sort((a, b) => a - b);
  return true;
}

function renderSectionNav(activeId) {
  sectionNav.innerHTML = sections
    .map((section) => {
      const firstIndex = flatQuestions.findIndex((question) => question.sectionId === section.id);
      return `<button class="section-tab ${section.id === activeId ? "active" : ""}" type="button" data-jump="${firstIndex}">${section.label}</button>`;
    })
    .join("");

  sectionNav.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      state.current = Number(button.dataset.jump);
      renderQuestion();
    });
  });
}

function validate(question) {
  if (!question.required) return true;
  const answer = state.answers[question.id];

  if (question.type === "rank") {
    const ranks = Object.values(answer || {}).filter(Boolean);
    const needed = question.topOnly || question.options.length;
    const uniqueRanks = new Set(ranks);
    if (ranks.length < needed) {
      showError(question.topOnly ? `Choose your top ${needed}.` : "Rank every option to continue.");
      return false;
    }
    if (uniqueRanks.size !== ranks.length) {
      showError("Use each rank only once.");
      return false;
    }
    return true;
  }

  const hasAnswer =
    Array.isArray(answer) ? answer.length > 0 : answer !== undefined && answer !== null && String(answer).trim() !== "";

  if (!hasAnswer) {
    showError("Choose an answer to continue.");
    return false;
  }
  return true;
}

function showError(message) {
  const error = questionHost.querySelector("#fieldError");
  if (!error) return;
  error.textContent = message;
  error.classList.remove("hidden");
}

function hideError() {
  const error = questionHost.querySelector("#fieldError");
  if (!error) return;
  error.textContent = "";
  error.classList.add("hidden");
}

function updateProgress() {
  const requiredQuestions = flatQuestions.filter((question) => question.required);
  const answered = requiredQuestions.filter((question) => {
    const answer = state.answers[question.id];
    if (question.type === "rank") {
      const ranks = Object.values(answer || {}).filter(Boolean);
      const needed = question.topOnly || question.options.length;
      return ranks.length >= needed && new Set(ranks).size === ranks.length;
    }
    return Array.isArray(answer) ? answer.length > 0 : answer !== undefined && answer !== "";
  }).length;
  progressPill.textContent = `${Math.round((answered / requiredQuestions.length) * 100)}% complete`;
}

function calculateScore() {
  const totals = Object.fromEntries(
    Object.entries(dimensions).map(([id, dimension]) => [
      id,
      {
        label: dimension.label,
        possible: dimension.points,
        earned: 0,
        normalized: 0,
        gate: Boolean(dimension.gate),
      },
    ]),
  );

  flatQuestions.forEach((question) => {
    if (!question.dimension || !question.weight || !question.scoreFn) return;
    const raw = clamp(question.scoreFn(state.answers[question.id], question), 0, 4);
    totals[question.dimension].earned += (raw / 4) * question.weight;
  });

  Object.values(totals).forEach((dimension) => {
    dimension.normalized = Math.round((dimension.earned / dimension.possible) * 100);
    dimension.earned = round1(dimension.earned);
  });

  const overall = Math.round(Object.values(totals).reduce((sum, dimension) => sum + dimension.earned, 0));
  const baseTier = getBaseTier(overall);
  const gatesPassed = ["workflow", "governance", "measurement"].every(
    (id) => totals[id].normalized >= 70,
  );
  const tier = baseTier.id === "transformer" && !gatesPassed ? tiers.orchestrator : baseTier;
  const perception = getPerceptionGap(tier.rank);

  return { overall, totals, tier, baseTier, gatesPassed, perception };
}

const tiers = {
  explorer: {
    id: "explorer",
    rank: 0,
    label: "Explorer",
    description:
      "Experimenting with AI tools, with limited coordination, workflow standardization, governance, or measurement.",
  },
  operator: {
    id: "operator",
    rank: 1,
    label: "Operator",
    description:
      "Using AI in repeatable ways, with some team-level adoption and early operating discipline.",
  },
  orchestrator: {
    id: "orchestrator",
    rank: 2,
    label: "Orchestrator",
    description:
      "Standardizing AI across teams and workflows, with clearer governance, enablement, and measurement.",
  },
  transformer: {
    id: "transformer",
    rank: 3,
    label: "Transformer",
    description:
      "Redesigning meaningful parts of GTM around AI-enabled workflows, cross-functional orchestration, and measurable business impact.",
  },
};

function getBaseTier(score) {
  if (score >= 80) return tiers.transformer;
  if (score >= 51) return tiers.orchestrator;
  if (score >= 26) return tiers.operator;
  return tiers.explorer;
}

function getPerceptionGap(calculatedRank) {
  const self = state.answers.q5_self;
  if (self === undefined) return { label: "Not available", detail: "Self-assessment was not captured." };
  const gap = Number(self) - calculatedRank;
  if (gap === 0) {
    return {
      label: "Aligned",
      detail: "Self-reported maturity matches the calculated tier.",
    };
  }
  if (gap > 0) {
    return {
      label: "Overstated",
      detail: `Self-reported maturity is ${gap} tier${gap > 1 ? "s" : ""} above the calculated tier.`,
    };
  }
  return {
    label: "Understated",
    detail: `Self-reported maturity is ${Math.abs(gap)} tier${Math.abs(gap) > 1 ? "s" : ""} below the calculated tier.`,
  };
}

function renderResults() {
  const score = calculateScore();
  const benchmark = compareToBenchmark(score, benchmarkCohort);
  state.latestScore = score;
  state.latestBenchmark = benchmark;
  surveyForm.classList.add("hidden");
  results.classList.remove("hidden");
  progressPill.textContent = "Results";

  document.querySelector("#tierName").textContent = score.tier.label;
  document.querySelector("#tierDescription").textContent =
    score.baseTier.id === "transformer" && !score.gatesPassed
      ? `${score.tier.description} The total score reached Transformer range, but one or more required gate dimensions were below 70.`
      : score.tier.description;
  document.querySelector("#overallScore").textContent = score.overall;

  document.querySelector("#dimensionScores").innerHTML = Object.entries(score.totals)
    .map(
      ([id, dimension]) => `
        <div class="bar-row">
          <div class="bar-label">
            <span>${dimension.label}</span>
            <span>${dimension.normalized}/100</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width: ${dimension.normalized}%"></div></div>
        </div>
      `,
    )
    .join("");

  const gateText = score.gatesPassed
    ? "Workflow, governance, and measurement gates are all at or above 70."
    : "Transformer requires 70+ in workflow, governance, and measurement.";

  document.querySelector("#scoreSignals").innerHTML = `
    <div class="signal ${score.gatesPassed ? "good" : "warning"}">
      <strong>Transformer gate</strong>
      <p>${gateText}</p>
    </div>
    <div class="signal">
      <strong>Perception gap</strong>
      <p>${score.perception.label}: ${score.perception.detail}</p>
    </div>
    <div class="signal">
      <strong>Scoring basis</strong>
      <p>17 scored benchmark questions roll up to five weighted dimension scores.</p>
    </div>
  `;

  renderBenchmarkSummary(score, benchmark);
  renderRecommendations(score);
  renderSnapshot();
  prefillReportRequest();
  saveSurveyCompletion(score, benchmark);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderBenchmarkSummary(score, benchmark) {
  const segmentComparisons = getSegmentComparisons();
  const medianComparison = score.overall > benchmark.median ? "above" : score.overall < benchmark.median ? "below" : "at";

  document.querySelector("#benchmarkSummary").innerHTML = `
    <div class="benchmark-card">
      <span class="metric">${benchmark.percentile}<small>th</small></span>
      <div>
        <strong>Percentile vs ${window.realBenchmark ? "Founding Benchmark Cohort" : "benchmark preview"}</strong>
        <p>Compared with ${benchmark.count} scoreable responses fielded by CMO Huddles and Benchmarkit in July-August 2026.</p>
      </div>
    </div>
    <div class="benchmark-grid">
      <div><strong>${benchmark.median}</strong><span>Overall median</span></div>
      <div><strong>${benchmark.p75}</strong><span>75th percentile</span></div>
      <div><strong>${medianComparison}</strong><span>Compared with median</span></div>
    </div>
    ${renderSegmentComparisons(segmentComparisons)}
  `;
}

function renderRecommendations(score) {
  const weakest = Object.entries(score.totals)
    .sort((a, b) => a[1].normalized - b[1].normalized)
    .slice(0, 3);

  document.querySelector("#recommendations").innerHTML = weakest
    .map(
      ([id, dimension]) => `
        <div class="recommendation">
          <strong>${dimension.label}</strong>
          <p>${dimensions[id].recommendation}</p>
        </div>
      `,
    )
    .join("");
}

function renderSnapshot() {
  const profileRows = [
    ["Industry", answerText("company_industry")],
    ["Revenue", answerText("company_revenue")],
    ["GTM model", answerText("company_gtm")],
    ["AI investment governance", answerText("q17_investment")],
    ["Buy/build evaluation", answerText("q18_buy_build")],
  ];

  document.querySelector("#responseSnapshot").innerHTML = profileRows
    .map(
      ([label, value]) => `
        <div class="snapshot-row">
          <strong>${label}</strong>
          <p>${value}</p>
        </div>
      `,
    )
    .join("");
}

function prefillReportRequest() {
  document.querySelector("#reportEmail").value = state.answers.participant_email || "";
}

async function handleReportRequest() {
  const name = document.querySelector("#reportName").value.trim();
  const email = document.querySelector("#reportEmail").value.trim();
  const company = document.querySelector("#reportCompany").value.trim();
  const optBenchmarkReport = document.querySelector("#optBenchmarkReport").checked;
  const optNewsletter = document.querySelector("#optNewsletter").checked;
  const optStarter = document.querySelector("#optStarter").checked;
  const consentResearch = document.querySelector("#consentResearch").checked;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setReportStatus("Enter a valid email address to save your preferences.", true);
    return;
  }

  if (!optBenchmarkReport && !optNewsletter && !optStarter) {
    setReportStatus("Choose at least one option: benchmark report, newsletter, or Starter program interest.", true);
    return;
  }

  const request = {
    id: createId(),
    responseId: getResponseId(),
    createdAt: new Date().toISOString(),
    source: responseSource,
    name,
    email,
    company,
    optBenchmarkReport,
    optNewsletter,
    optStarter,
    consentResearch,
    score: state.latestScore,
    benchmark: state.latestBenchmark,
    answers: state.answers,
  };

  saveAlphaReportRequest(request);
  setReportStatus("Saving your preferences...");
  try {
    await saveOptInRequest(request);
    setReportStatus("Preferences saved.");
  } catch (error) {
    console.warn("Supabase opt-in save failed", error);
    setReportStatus("Preferences saved locally. Database save is not available yet.", true);
  }
  renderOptInConfirmation(request);
}

function setReportStatus(message, isError = false) {
  const status = document.querySelector("#reportRequestStatus");
  status.textContent = message;
  status.classList.toggle("error", Boolean(isError));
}

function saveAlphaReportRequest(request) {
  const key = "cmo-ai-report-requests";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  const withoutDuplicate = existing.filter((item) => item.email.toLowerCase() !== request.email.toLowerCase());
  withoutDuplicate.push(request);
  localStorage.setItem(key, JSON.stringify(withoutDuplicate.slice(-50)));
}

async function saveSurveyCompletion(score, benchmark) {
  if (state.completionSaved) return;
  state.completionSaved = true;
  const responseId = getResponseId();
  const payload = {
    response_id: responseId,
    source: responseSource,
    overall_score: score.overall,
    tier: score.tier.label,
    base_tier: score.baseTier.label,
    gates_passed: score.gatesPassed,
    percentile: benchmark.percentile,
    dimension_scores: score.totals,
    score_payload: score,
    benchmark_payload: benchmark,
    answers: state.answers,
    demographics: {
      industry: answerText("company_industry"),
      revenue: answerText("company_revenue"),
      gtm_model: answerText("company_gtm"),
      funding: answerText("company_funding"),
    },
    participant: {
      job_level: answerText("participant_level"),
      job_function: answerText("participant_function"),
      email: state.answers.participant_email || null,
    },
    company_industry: answerText("company_industry"),
    company_revenue: answerText("company_revenue"),
    company_gtm: answerText("company_gtm"),
    company_funding: answerText("company_funding"),
    participant_level: answerText("participant_level"),
    participant_function: answerText("participant_function"),
    participant_email: state.answers.participant_email || null,
    user_agent: navigator.userAgent,
  };

  try {
    await insertSupabase("cmo_ai_maturity_responses", payload);
  } catch (error) {
    state.completionSaved = false;
    console.warn("Supabase completion save failed", error);
  }
}

async function saveOptInRequest(request) {
  const payload = {
    response_id: request.responseId,
    name: request.name || null,
    email: request.email,
    company: request.company || null,
    opt_benchmark_report: request.optBenchmarkReport,
    opt_newsletter: request.optNewsletter,
    opt_starter: request.optStarter,
    consent_research: request.consentResearch,
    overall_score: request.score.overall,
    tier: request.score.tier.label,
    participant_level: answerText("participant_level"),
    participant_function: answerText("participant_function"),
    answers: state.answers,
  };
  await insertSupabase("cmo_ai_maturity_opt_ins", payload);
}

async function insertSupabase(table, payload) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
}

function getResponseId() {
  if (!state.responseId) state.responseId = createId();
  return state.responseId;
}

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderOptInConfirmation(request) {
  const { score, benchmark } = request;
  const sortedDimensions = getSortedDimensions(score);
  const weakest = sortedDimensions[0];
  const strongest = sortedDimensions.at(-1);
  const displayName = request.name || "there";
  const selected = [
    request.optBenchmarkReport ? "Full benchmark report" : "",
    request.optNewsletter ? "Huddle Up newsletter" : "",
    request.optStarter ? "Starter program interest" : "",
  ].filter(Boolean);

  document.querySelector("#reportTitle").textContent = `Thanks, ${displayName}`;
  document.querySelector("#fullReportContent").innerHTML = `
    <section>
      <h4>Saved Preferences</h4>
      <p>Your interest has been saved for: <strong>${selected.join(", ")}</strong>.</p>
    </section>
    <section>
      <h4>Your Instant Assessment</h4>
      <p>Your organization scored <strong>${score.overall}/100</strong>, placing it in the <strong>${score.tier.label}</strong> tier. Compared with the Founding Benchmark Cohort, that is approximately the <strong>${benchmark.percentile}th percentile</strong>.</p>
    </section>
    <section>
      <h4>Helpful Follow-Up Context</h4>
      <p><strong>Strongest dimension:</strong> ${strongest[1].label} (${strongest[1].normalized}/100). ${dimensions[strongest[0]].recommendation}</p>
      <p><strong>Priority gap:</strong> ${weakest[1].label} (${weakest[1].normalized}/100). ${dimensions[weakest[0]].recommendation}</p>
    </section>
  `;
  document.querySelector("#fullReport").classList.remove("hidden");
  document.querySelector("#fullReport").scrollIntoView({ behavior: "smooth", block: "start" });
  scheduleFrameHeightUpdate();
}

function getSortedDimensions(score) {
  return Object.entries(score.totals).sort((a, b) => a[1].normalized - b[1].normalized);
}

function getPriorityRecommendations(score) {
  const sorted = getSortedDimensions(score);
  const weakest = sorted[0][0];
  const priorities = [
    `Focus first on ${sorted[0][1].label}; it is the clearest constraint on the next stage of maturity.`,
    `Use ${sorted.at(-1)[1].label} as the source of momentum rather than starting from scratch.`,
  ];

  if (weakest === "measurement") {
    priorities.push("Define a small set of adoption, productivity, workflow, and capacity metrics before asking for broader AI investment.");
  } else if (weakest === "governance") {
    priorities.push("Create practical risk-based governance so teams can scale AI without slowing every workflow to a crawl.");
  } else if (weakest === "workflow") {
    priorities.push("Pick one high-value workflow and redesign it end to end instead of adding AI to isolated tasks.");
  } else if (weakest === "talent") {
    priorities.push("Turn AI enablement into role-specific expectations, templates, and coaching rather than generic training.");
  } else {
    priorities.push("Make ownership and executive review explicit so AI priorities connect to GTM operating decisions.");
  }

  return priorities;
}

function getPov(score, weakestId, strongestId) {
  const tierLead = {
    explorer: "The biggest opportunity is to turn useful experimentation into a clearer operating motion.",
    operator: "The organization has moved beyond isolated experimentation, but maturity now depends on repeatability, ownership, and measurement.",
    orchestrator: "The foundation is strong enough to scale, but the next move is to make AI part of how GTM decisions are made.",
    transformer: "The organization is showing the pattern of a marketing team that can use AI as an operating advantage, not just a productivity tool.",
  }[score.tier.id];

  return `${tierLead} Because ${dimensions[weakestId].label} is the lowest dimension and ${dimensions[strongestId].label} is the strongest, the path forward should pair practical improvement with the strengths already in place.`;
}

function getInfluenceGuidance(weakestId) {
  const guidance = {
    strategy: "Bring the CEO, CFO, Sales, Customer Success, and IT into a focused conversation about which GTM outcomes AI should improve first.",
    workflow: "Work with Sales, RevOps, Customer Success, and IT to choose one workflow where shared data and shared handoffs matter.",
    talent: "Align with People/HR and functional leaders so AI adoption becomes part of role clarity, enablement, and change management.",
    governance: "Partner with IT, Legal, Security, Finance, and brand owners to define oversight that reflects actual workflow risk.",
    measurement: "Work with Finance, RevOps, Sales, and Customer Success to connect AI activity to productivity, capacity, pipeline, or customer metrics.",
  };
  return guidance[weakestId];
}

function compareToBenchmark(score, cohort) {
  const belowOrEqual = cohort.filter((item) => item <= score.overall).length;
  return {
    count: cohort.length,
    percentile: Math.max(1, Math.min(99, Math.round((belowOrEqual / cohort.length) * 100))),
    median: percentileValue(cohort, 50),
    p75: percentileValue(cohort, 75),
  };
}

function getSegmentComparisons() {
  const segmentConfig = [
    { key: "industry", label: "Industry", answerId: "company_industry" },
    { key: "revenue", label: "Revenue", answerId: "company_revenue" },
    { key: "gtm", label: "GTM model", answerId: "company_gtm" },
  ];

  return segmentConfig
    .map((segment) => {
      const value = answerText(segment.answerId);
      const data = benchmark.segments?.[segment.key]?.[value];
      if (!data) return null;
      return { ...segment, value, ...data };
    })
    .filter(Boolean)
    .slice(0, 3);
}

function renderSegmentComparisons(comparisons) {
  if (!comparisons.length) {
    return `
      <div class="segment-note">
        Segment benchmark: this profile does not yet have enough matching responses for a reliable segment comparison.
      </div>
    `;
  }

  return `
    <div class="segment-comparisons">
      ${comparisons
        .map(
          (comparison) => `
            <div>
              <strong>${comparison.median}</strong>
              <span>${comparison.label}: ${comparison.value}</span>
              <small>n=${comparison.count}</small>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function percentileValue(values, percentile) {
  if (!values.length) return 0;
  const index = Math.round((percentile / 100) * (values.length - 1));
  return values[index];
}

function createFallbackBenchmark() {
  const scores = [7, 10, 18, 24, 28, 32, 35, 38, 42, 46, 49, 53, 57, 61, 65, 73, 80, 86, 90];
  return {
    label: "Benchmark Preview",
    fielded: "July-August 2026",
    source: "CMO Huddles and Benchmarkit",
    count: scores.length,
    scores,
    segments: {},
  };
}

function answerText(questionId) {
  const question = flatQuestions.find((item) => item.id === questionId);
  const answer = state.answers[questionId];
  if (!question || answer === undefined || answer === null || answer === "") return "Not provided";
  if (question.type === "radio") return question.options[answer] || "Not provided";
  if (question.type === "checkbox") return answer.map((index) => question.options[index]).join(", ");
  return String(answer);
}

function scoreFunctionsBreadth(answer) {
  if (!Array.isArray(answer) || answer.length === 0) return 0;
  if (answer.includes(8)) return 0;
  const count = answer.length;
  if (count >= 6) return 4;
  if (count >= 4) return 3;
  if (count >= 2) return 2;
  return 1;
}

function scoreRoles(answer) {
  if (!Array.isArray(answer) || answer.length === 0 || answer.includes(6)) return 0;
  const dedicated = answer.filter((index) => index <= 4).length;
  const champions = answer.includes(5);
  if (dedicated >= 4) return 4;
  if (dedicated >= 2) return 3;
  if (dedicated === 1) return champions ? 2 : 2;
  if (champions || answer.includes(7)) return 1;
  return 0;
}

function scorePrograms(answer) {
  if (!Array.isArray(answer) || answer.length === 0 || answer.includes(6)) return 0;
  const count = answer.filter((index) => index !== 7).length;
  if (count >= 5) return 4;
  if (count >= 3) return 3;
  if (count === 2) return 2;
  if (count === 1) return 1;
  return 0;
}

function scoreImpactAreas(answer) {
  if (!Array.isArray(answer) || answer.length === 0 || answer.includes(0)) return 0;
  let score = 0;
  if (answer.some((index) => [1, 2, 3, 7].includes(index))) score = Math.max(score, 2);
  if (answer.includes(4)) score = Math.max(score, 3);
  if (answer.some((index) => [5, 6].includes(index))) score = Math.max(score, 4);
  return score;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function getSampleResponse() {
  return {
    company_industry: 0,
    company_revenue: 4,
    company_gtm: 2,
    company_funding: 1,
    q1_owner: 3,
    q2_alignment: 3,
    q3_review: 2,
    q5_self: 2,
    q6_functions: [0, 1, 2, 4],
    q8_agentic: 2,
    q9_gtm_integration: 2,
    q10_data_foundation: 2,
    q12_roles: [0, 5],
    q13_programs: [0, 1, 2],
    q14_change: 2,
    q15_governance: 2,
    q16_oversight: 2,
    q17_investment: 2,
    q18_buy_build: 3,
    q19_roi: 2,
    q20_impact_where: [1, 2, 4],
    q22_results: 2,
    participant_level: 0,
    participant_function: 4,
    participant_email: "drew@example.com",
  };
}

window.cmoAiAlpha = {
  loadSampleResponse() {
    state.answers = getSampleResponse();
    renderResults();
    return calculateScore();
  },
  getSavedReportRequests() {
    return JSON.parse(localStorage.getItem("cmo-ai-report-requests") || "[]");
  },
  getResponseId,
};

updateProgress();
sendFrameHeight();

if (new URLSearchParams(window.location.search).has("sample")) {
  window.cmoAiAlpha.loadSampleResponse();
}
