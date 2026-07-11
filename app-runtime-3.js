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
    company_acv: 5,
    company_gtm: 2,
    company_funding: 1,
    q1_owner: 3,
    q2_alignment: 3,
    q3_review: 2,
    q4_lens: { 0: 1, 2: 2, 3: 3, 4: 4, 5: 5, 1: 6, 6: 7 },
    q5_self: 2,
    q6_functions: [0, 1, 2, 4],
    q8_agentic: 2,
    q9_gtm_integration: 2,
    q10_data_foundation: 2,
    q11_barriers: [1, 2, 5],
    q12_roles: [0, 5],
    q13_programs: [0, 1, 2],
    q14_change: 2,
    q15_governance: 2,
    q16_oversight: 2,
    q17_investment: 2,
    q18_buy_build: 3,
    q19_roi: 2,
    q20_impact_where: [1, 2, 4],
    q21_business_outcomes: { 0: 1, 6: 2, 4: 3 },
    q22_results: 2,
    q23_open: "AI-assisted campaign planning and content production.",
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
    return JSON.parse(localStorage.getItem("cmo-ai-alpha-report-requests") || "[]");
  },
};

updateProgress();

if (new URLSearchParams(window.location.search).has("sample")) {
  window.cmoAiAlpha.loadSampleResponse();
}
