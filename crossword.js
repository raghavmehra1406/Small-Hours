const crossword = {
  size: 5,
  rows: [
    "MAINS",
    "A#D#I",
    "TREND",
    "E#A#E",
    "SILOS"
  ],
  clues: {
    across: [
      { number: 1, row: 0, col: 0, answer: "MAINS", clue: "Principal pipes, or central lines" },
      { number: 4, row: 2, col: 0, answer: "TREND", clue: "Pattern people start noticing" },
      { number: 5, row: 4, col: 0, answer: "SILOS", clue: "Places to store grain — or isolated teams" }
    ],
    down: [
      { number: 1, row: 0, col: 0, answer: "MATES", clue: "Friends, casually" },
      { number: 2, row: 0, col: 2, answer: "IDEAL", clue: "Perfect, in theory" },
      { number: 3, row: 0, col: 4, answer: "SIDES", clue: "Teams in a debate" }
    ]
  }
};

const grid = document.querySelector("#crossword-grid");
const acrossClues = document.querySelector("#across-clues");
const downClues = document.querySelector("#down-clues");
const message = document.querySelector("#crossword-message");
const filledText = document.querySelector("#crossword-filled");
const checkButton = document.querySelector("#crossword-check");
const revealButton = document.querySelector("#crossword-reveal");
const resetButton = document.querySelector("#crossword-reset");

const numbering = new Map();
const playableCells = [];
let direction = "across";
let activeInput = null;

function cellKey(row, col) {
  return `${row}-${col}`;
}

function isBlock(row, col) {
  return crossword.rows[row][col] === "#";
}

function getInput(row, col) {
  return playableCells.find((input) => Number(input.dataset.row) === row && Number(input.dataset.col) === col);
}

function findNumbers() {
  [...crossword.clues.across, ...crossword.clues.down].forEach((clue) => {
    numbering.set(cellKey(clue.row, clue.col), clue.number);
  });
}

function renderGrid() {
  grid.innerHTML = "";
  playableCells.length = 0;

  for (let row = 0; row < crossword.size; row += 1) {
    for (let col = 0; col < crossword.size; col += 1) {
      const square = document.createElement("div");
      square.className = "crossword-cell";

      if (isBlock(row, col)) {
        square.classList.add("block");
        grid.appendChild(square);
        continue;
      }

      const number = numbering.get(cellKey(row, col));
      if (number) {
        const label = document.createElement("span");
        label.textContent = number;
        square.appendChild(label);
      }

      const input = document.createElement("input");
      input.maxLength = 1;
      input.dataset.row = row;
      input.dataset.col = col;
      input.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}`);
      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleKeydown);
      input.addEventListener("focus", () => selectCell(input));
      input.addEventListener("click", () => {
        if (activeInput === input) toggleDirection();
      });
      square.appendChild(input);
      grid.appendChild(square);
      playableCells.push(input);
    }
  }
}

function renderClues() {
  acrossClues.innerHTML = crossword.clues.across
    .map((clue) => `<li><span>${clue.number}.</span> ${clue.clue}</li>`)
    .join("");
  downClues.innerHTML = crossword.clues.down
    .map((clue) => `<li><span>${clue.number}.</span> ${clue.clue}</li>`)
    .join("");
}

function handleInput(event) {
  const input = event.target;
  input.value = input.value.toUpperCase().replace(/[^A-Z]/g, "");
  input.classList.remove("wrong", "right");

  if (input.value) {
    moveFrom(input, 1);
  }

  updateFilled();
}

function handleKeydown(event) {
  const input = event.target;

  if (event.key === "Backspace" && !input.value) {
    event.preventDefault();
    moveFrom(input, -1);
    return;
  }

  const arrows = {
    ArrowRight: ["across", 1],
    ArrowLeft: ["across", -1],
    ArrowDown: ["down", 1],
    ArrowUp: ["down", -1]
  };

  if (arrows[event.key]) {
    event.preventDefault();
    direction = arrows[event.key][0];
    moveFrom(input, arrows[event.key][1]);
    updateDirectionMessage();
  }
}

function selectCell(input) {
  activeInput = input;
  highlightActiveEntry();
  updateDirectionMessage();
}

function toggleDirection() {
  direction = direction === "across" ? "down" : "across";
  highlightActiveEntry();
  updateDirectionMessage();
}

function moveFrom(input, step) {
  const row = Number(input.dataset.row);
  const col = Number(input.dataset.col);
  const nextRow = direction === "down" ? row + step : row;
  const nextCol = direction === "across" ? col + step : col;
  const nextInput = getInput(nextRow, nextCol);

  if (nextInput) nextInput.focus();
}

function updateDirectionMessage() {
  message.textContent = `Typing ${direction}. Click the same square to switch.`;
}

function highlightActiveEntry() {
  playableCells.forEach((input) => input.parentElement.classList.remove("active-entry"));
  if (!activeInput) return;

  const row = Number(activeInput.dataset.row);
  const col = Number(activeInput.dataset.col);

  if (direction === "across") {
    for (let c = col; c >= 0 && !isBlock(row, c); c -= 1) getInput(row, c)?.parentElement.classList.add("active-entry");
    for (let c = col + 1; c < crossword.size && !isBlock(row, c); c += 1) getInput(row, c)?.parentElement.classList.add("active-entry");
  } else {
    for (let r = row; r >= 0 && !isBlock(r, col); r -= 1) getInput(r, col)?.parentElement.classList.add("active-entry");
    for (let r = row + 1; r < crossword.size && !isBlock(r, col); r += 1) getInput(r, col)?.parentElement.classList.add("active-entry");
  }
}

function updateFilled() {
  const filled = playableCells.filter((input) => input.value).length;
  filledText.textContent = filled;
}

function checkPuzzle() {
  let correct = 0;

  playableCells.forEach((input) => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    const answer = crossword.rows[row][col];

    input.classList.remove("wrong", "right");

    if (!input.value) return;

    if (input.value === answer) {
      input.classList.add("right");
      correct += 1;
    } else {
      input.classList.add("wrong");
    }
  });

  if (correct === playableCells.length) {
    message.textContent = "Solved. Nicely done.";
  } else {
    message.textContent = `${correct} correct so far.`;
  }
}

function revealPuzzle() {
  playableCells.forEach((input) => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    input.value = crossword.rows[row][col];
    input.classList.remove("wrong");
    input.classList.add("right");
  });
  updateFilled();
  message.textContent = "Revealed.";
}

function resetPuzzle() {
  playableCells.forEach((input) => {
    input.value = "";
    input.classList.remove("wrong", "right");
  });
  updateFilled();
  direction = "across";
  message.textContent = "Fill the grid.";
  playableCells[0]?.focus();
}

checkButton.addEventListener("click", checkPuzzle);
revealButton.addEventListener("click", revealPuzzle);
resetButton.addEventListener("click", resetPuzzle);

findNumbers();
renderGrid();
renderClues();
updateFilled();
