const state = {
  current: 0,
  answers: {},
  latestScore: null,
  latestBenchmark: null,
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

const benchmarkCohort = createSeededBenchmark(220);

document.querySelector("#startButton").addEventListener("click", () => {
  intro.classList.add("hidden");
  surveyForm.classList.remove("hidden");
  renderQuestion();
});

backButton.addEventListener("click", () => {
  if (state.current === 0) {
    surveyForm.classList.add("hidden");
    intro.classList.remove("hidden");
    updateProgress();
    return;
  }
  state.current -= 1;
  renderQuestion();
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
});

document.querySelector("#editButton").addEventListener("click", () => {
  results.classList.add("hidden");
  surveyForm.classList.remove("hidden");
  renderQuestion();
});

document.querySelector("#resetButton").addEventListener("click", () => {
  state.current = 0;
  state.answers = {};
  state.latestScore = null;
  state.latestBenchmark = null;
  results.classList.add("hidden");
  document.querySelector("#fullReport").classList.add("hidden");
  reportRequestForm.reset();
  setReportStatus("");
  intro.classList.remove("hidden");
  updateProgress();
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
    if (question.id === "q21_business_outcomes" && Number(answer?.[7]) === 1) {
      return true;
    }
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
      if (question.id === "q21_business_outcomes" && Number(answer?.[7]) === 1) return true;
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
