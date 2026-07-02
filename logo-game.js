const puzzles = [
  {
    answer: "orbit",
    choices: ["Orbit", "Nova", "Pulse", "Arc"],
    logoClass: "logo-orbit",
    markup: `
      <span class="logo-ring"></span>
      <span class="logo-dot"></span>
      <span class="logo-word">orbit</span>
    `
  },
  {
    answer: "nova",
    choices: ["Halo", "Nova", "Signal", "Vault"],
    logoClass: "logo-nova",
    markup: `
      <span class="logo-star"></span>
      <span class="logo-word">nova</span>
    `
  },
  {
    answer: "pulse",
    choices: ["Pulse", "Thread", "Beacon", "Kite"],
    logoClass: "logo-pulse",
    markup: `
      <span class="logo-line"></span>
      <span class="logo-line small"></span>
      <span class="logo-word">pulse</span>
    `
  },
  {
    answer: "arc",
    choices: ["Field", "Arc", "Drift", "North"],
    logoClass: "logo-arc",
    markup: `
      <span class="logo-arch"></span>
      <span class="logo-block"></span>
      <span class="logo-word">arc</span>
    `
  }
];

const maxReveal = 5;

const logoMask = document.querySelector("#logo-mask");
const fakeLogo = document.querySelector("#fake-logo");
const message = document.querySelector("#logo-message");
const scoreText = document.querySelector("#logo-score");
const roundText = document.querySelector("#logo-round");
const options = document.querySelector("#logo-options");
const revealButton = document.querySelector("#reveal-btn");
const nextButton = document.querySelector("#next-logo-btn");
const resetButton = document.querySelector("#logo-reset-btn");
const shareButton = document.querySelector("#logo-share-btn");

let currentPuzzle = 0;
let revealLevel = 1;
let roundSolved = false;
let totalScore = 0;
let roundsPlayed = 0;

function puzzle() {
  return puzzles[currentPuzzle];
}

function currentScore() {
  return Math.max(20, 120 - revealLevel * 20);
}

function updateReveal() {
  logoMask.className = `logo-mask reveal-${revealLevel}`;
  scoreText.textContent = totalScore + (roundSolved ? 0 : currentScore());
  roundText.textContent = `${currentPuzzle + 1} / ${puzzles.length}`;
}

function renderLogo() {
  fakeLogo.className = `fake-logo ${puzzle().logoClass}`;
  fakeLogo.innerHTML = puzzle().markup;
}

function renderOptions() {
  options.innerHTML = puzzle().choices
    .map((choice) => `<button class="logo-option" type="button">${choice}</button>`)
    .join("");

  document.querySelectorAll(".logo-option").forEach((button) => {
    button.addEventListener("click", () => guessOption(button));
  });
}

function finishRound(text, points = 0) {
  roundSolved = true;
  roundsPlayed += 1;
  totalScore += points;
  message.textContent = text;

  document.querySelectorAll(".logo-option").forEach((button) => {
    button.disabled = true;
  });

  revealButton.disabled = true;
  logoMask.className = "logo-mask reveal-5 solved";
  scoreText.textContent = totalScore;

  if (currentPuzzle < puzzles.length - 1) {
    nextButton.hidden = false;
  } else {
    shareButton.hidden = false;
    message.textContent = `${text} Final score: ${totalScore}.`;
  }
}

function guessOption(button) {
  if (roundSolved) return;

  const guess = button.textContent.trim().toLowerCase();

  if (guess === puzzle().answer) {
    button.classList.add("correct");
    finishRound(`Correct — ${currentScore()} points.`, currentScore());
    return;
  }

  button.classList.add("wrong");
  button.disabled = true;
  message.textContent = "Nope. Try another option or reveal more.";
}

function loadRound(index) {
  currentPuzzle = index;
  revealLevel = 1;
  roundSolved = false;
  revealButton.disabled = false;
  nextButton.hidden = true;
  shareButton.hidden = true;
  message.textContent = "Guess the brand from the first reveal.";
  renderLogo();
  renderOptions();
  updateReveal();
}

revealButton.addEventListener("click", () => {
  if (roundSolved) return;

  revealLevel += 1;
  updateReveal();

  if (revealLevel === maxReveal) {
    finishRound(`Fully revealed. The answer was ${puzzle().answer}.`, 0);
  } else {
    message.textContent = "More of the logo is visible.";
  }
});

nextButton.addEventListener("click", () => {
  loadRound(currentPuzzle + 1);
});

resetButton.addEventListener("click", () => {
  totalScore = 0;
  roundsPlayed = 0;
  loadRound(0);
});

shareButton.addEventListener("click", () => {
  const text = `Guess the Logo — ${totalScore} points across ${roundsPlayed}/${puzzles.length} logos\nsmall hours`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    message.textContent = "Result copied.";
  } else {
    message.textContent = text;
  }
});

loadRound(0);
