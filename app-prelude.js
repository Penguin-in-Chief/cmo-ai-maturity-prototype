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
