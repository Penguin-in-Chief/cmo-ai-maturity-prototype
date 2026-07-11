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
