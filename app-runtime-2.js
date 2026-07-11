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
  const medianComparison =
    score.overall > benchmark.median ? "above" : score.overall < benchmark.median ? "below" : "at";

  document.querySelector("#benchmarkSummary").innerHTML = `
    <div class="benchmark-card">
      <span class="metric">${benchmark.percentile}<small>th</small></span>
      <div>
        <strong>Estimated percentile vs seeded Founding Benchmark</strong>
        <p>This alpha uses placeholder benchmark data until Ray's fielded cohort is imported.</p>
      </div>
    </div>
    <div class="benchmark-grid">
      <div><strong>${benchmark.median}</strong><span>Seeded median</span></div>
      <div><strong>${benchmark.p75}</strong><span>Seeded 75th percentile</span></div>
      <div><strong>${medianComparison}</strong><span>Compared with median</span></div>
    </div>
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
    ["Top barriers", answerText("q11_barriers")],
    ["Optional use case", state.answers.q23_open || "Not provided"],
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
  const key = "cmo-ai-alpha-report-requests";
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
    source: "github_pages_alpha",
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
      acv: answerText("company_acv"),
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
    company_acv: answerText("company_acv"),
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
      <p>This alpha saved your interest in: <strong>${selected.join(", ")}</strong>.</p>
      <p>In production, these preferences can flow into the email/newsletter system and internal CMO Huddles follow-up workflow.</p>
    </section>
    <section>
      <h4>Your Instant Assessment</h4>
      <p>Your organization scored <strong>${score.overall}/100</strong>, placing it in the <strong>${score.tier.label}</strong> tier. In this seeded alpha benchmark, that is approximately the <strong>${benchmark.percentile}th percentile</strong>.</p>
    </section>
    <section>
      <h4>Helpful Follow-Up Context</h4>
      <p><strong>Strongest dimension:</strong> ${strongest[1].label} (${strongest[1].normalized}/100). ${dimensions[strongest[0]].recommendation}</p>
      <p><strong>Priority gap:</strong> ${weakest[1].label} (${weakest[1].normalized}/100). ${dimensions[weakest[0]].recommendation}</p>
    </section>
  `;
  document.querySelector("#fullReport").classList.remove("hidden");
  document.querySelector("#fullReport").scrollIntoView({ behavior: "smooth", block: "start" });
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

function createSeededBenchmark(count) {
  const scores = [];
  for (let index = 0; index < count; index += 1) {
    const wave = Math.sin(index * 1.7) * 10;
    const ramp = (index % 37) * 0.9;
    const cluster = index % 5 === 0 ? 12 : index % 7 === 0 ? -9 : 0;
    scores.push(clamp(Math.round(35 + ramp + wave + cluster), 8, 94));
  }
  return scores.sort((a, b) => a - b);
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

function percentileValue(values, percentile) {
  if (!values.length) return 0;
  const index = Math.round((percentile / 100) * (values.length - 1));
  return values[index];
}
