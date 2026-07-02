const puzzle = {
  date: "Jul 2, 2026",
  groups: [
    {
      name: "Indian startups",
      words: ["Zomato", "Zepto", "Razorpay", "CRED"],
      color: "yellow"
    },
    {
      name: "Football clubs",
      words: ["Arsenal", "Chelsea", "Barcelona", "Juventus"],
      color: "green"
    },
    {
      name: "Music streaming",
      words: ["Spotify", "Apple", "Gaana", "JioSaavn"],
      color: "blue"
    },
    {
      name: "Geography terms",
      words: ["Delta", "Strait", "Plateau", "Isthmus"],
      color: "purple"
    }
  ]
};

const board = document.querySelector("#connections-board");
const solvedGroups = document.querySelector("#solved-groups");
const message = document.querySelector("#connections-message");
const mistakesLeft = document.querySelector("#mistakes-left");
const submitButton = document.querySelector("#submit-btn");
const clearButton = document.querySelector("#clear-btn");
const shuffleButton = document.querySelector("#shuffle-btn");
const shareButton = document.querySelector("#share-btn");

let selected = [];
let mistakes = 4;
let solved = [];
let finalScore = null;
let words = shuffle(puzzle.groups.flatMap((group) => group.words));

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function renderBoard() {
  board.innerHTML = "";
  words
    .filter((word) => !solved.some((group) => group.words.includes(word)))
    .forEach((word) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "connection-tile";
      tile.textContent = word;
      tile.setAttribute("aria-pressed", selected.includes(word));
      if (selected.includes(word)) tile.classList.add("selected");
      tile.addEventListener("click", () => toggleWord(word));
      board.appendChild(tile);
    });
}

function renderSolved() {
  solvedGroups.innerHTML = solved
    .map((group) => `
      <article class="solved-group ${group.color}">
        <h2>${group.name}</h2>
        <p>${group.words.join(" · ")}</p>
      </article>
    `)
    .join("");
}

function toggleWord(word) {
  if (selected.includes(word)) {
    selected = selected.filter((item) => item !== word);
  } else if (selected.length < 4) {
    selected = [...selected, word];
  } else {
    message.textContent = "Only four at a time.";
  }

  renderBoard();
}

function submitGuess() {
  if (selected.length !== 4) {
    message.textContent = "Pick exactly four tiles.";
    return;
  }

  const match = puzzle.groups.find((group) => {
    const groupWords = [...group.words].sort().join(",");
    const selectedWords = [...selected].sort().join(",");
    return groupWords === selectedWords;
  });

  if (match && !solved.includes(match)) {
    solved = [...solved, match];
    selected = [];
    message.textContent = solved.length === 4 ? "Solved. Very clean." : "Correct.";
    renderSolved();
    renderBoard();
    checkGameOver();
    return;
  }

  mistakes -= 1;
  mistakesLeft.textContent = mistakes;
  selected = [];
  message.textContent = mistakes === 0 ? "Game over — answers revealed." : "Not quite. Try again.";
  renderBoard();
  checkGameOver();
}

function checkGameOver() {
  if (solved.length === 4 || mistakes === 0) {
    finalScore = solved.length;

    if (mistakes === 0) {
      solved = [...puzzle.groups];
      renderSolved();
      renderBoard();
    }

    submitButton.disabled = true;
    clearButton.disabled = true;
    shuffleButton.disabled = true;
    shareButton.hidden = false;
  }
}

function shareResult() {
  const score = `${finalScore ?? solved.length}/4`;
  const text = `Daily Connections — ${puzzle.date}\n${score} groups found\nsmall hours`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    message.textContent = "Result copied.";
  } else {
    message.textContent = text;
  }
}

shuffleButton.addEventListener("click", () => {
  words = shuffle(words);
  renderBoard();
});

clearButton.addEventListener("click", () => {
  selected = [];
  message.textContent = "Selection cleared.";
  renderBoard();
});

submitButton.addEventListener("click", submitGuess);
shareButton.addEventListener("click", shareResult);

mistakesLeft.textContent = mistakes;
renderBoard();
