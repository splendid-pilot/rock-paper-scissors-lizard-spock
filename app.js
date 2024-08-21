const CHOICES = ["rock", "paper", "scissors", "lizard", "spock"];
const EMOJIS = {
  rock: "🪨",
  paper: "✋",
  scissors: "✂️",
  lizard: "🦎",
  spock: "🖖",
};

const RULES = [
  { winner: "scissors", loser: "paper", rule: "Scissors cuts Paper" },
  { winner: "paper", loser: "rock", rule: "Paper covers Rock" },
  { winner: "rock", loser: "lizard", rule: "Rock crushes Lizard" },
  { winner: "lizard", loser: "spock", rule: "Lizard poisons Spock" },
  { winner: "spock", loser: "scissors", rule: "Spock smashes Scissors" },
  { winner: "scissors", loser: "lizard", rule: "Scissors decapitates Lizard" },
  { winner: "lizard", loser: "paper", rule: "Lizard eats Paper" },
  { winner: "paper", loser: "spock", rule: "Paper disproves Spock" },
  { winner: "spock", loser: "rock", rule: "Spock vaporizes Rock" },
  { winner: "rock", loser: "scissors", rule: "Rock crushes Scissors" },
];

const WINNING_COMBOS = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["paper", "spock"],
  spock: ["rock", "scissors"],
};

const MESSAGES = {
  draw: "Tie!",
  win: "You Won!",
  lose: "You Lost!",
};

const MAX_TURNS = 5;

class Game {
  constructor() {
    this.turn = 0;
    this.userWins = 0;
    this.setupEventListeners();
    this.resetGame();
  }

  setupEventListeners() {
    CHOICES.forEach((choice) => {
      document
        .querySelector(`.${choice}`)
        .addEventListener("click", () => this.play(choice));
    });
    let resetBtn = document.querySelector(".play-again");
    resetBtn.addEventListener("click", () => this.resetGame());
  }
  resetGame() {
    this.turn = 0;
    this.userWins = 0;
    document.querySelector(".user").innerHTML = "<th>User</th>";
    document.querySelector(".computer").innerHTML = "<th>Computer</th>";
    const resultMessage = document.querySelector(".result-message");
    if (resultMessage) resultMessage.innerText = "";
    this.removeHighlight();
  }
  removeHighlight() {
    document.querySelectorAll(".rules li").forEach((li) => {
      li.classList.remove("highlight");
    });
  }
  getComputerChoice() {
    return CHOICES[Math.floor(Math.random() * CHOICES.length)];
  }

  judge(userChoice, computerChoice) {
    if (userChoice === computerChoice) return MESSAGES.draw;
    if (WINNING_COMBOS[userChoice].includes(computerChoice))
      return MESSAGES.win;
    return MESSAGES.lose;
  }

  highlightRule(userChoice, computerChoice) {
    this.removeHighlight();
    const relevantRule = RULES.find(
      (rule) =>
        (rule.winner === userChoice && rule.loser === computerChoice) ||
        (rule.winner === computerChoice && rule.loser === userChoice),
    );

    if (relevantRule) {
      const ruleElement = Array.from(
        document.querySelectorAll(".rules li"),
      ).find((li) => li.textContent === relevantRule.rule);
      if (ruleElement) {
        ruleElement.classList.add("highlight");
      }
    }
  }
  play(userChoice) {
    if (this.turn >= MAX_TURNS) return;

    const computerChoice = this.getComputerChoice();
    this.updateUI(userChoice, computerChoice);

    this.highlightRule(userChoice, computerChoice);

    const result = this.judge(userChoice, computerChoice);
    if (result === MESSAGES.win) this.userWins++;

    this.turn++;
    if (this.turn === MAX_TURNS) this.showFinalResult();
  }

  updateUI(userChoice, computerChoice) {
    const userTd = document.createElement("td");
    const computerTd = document.createElement("td");

    userTd.innerText = EMOJIS[userChoice];
    computerTd.innerText = EMOJIS[computerChoice];

    if (this.judge(userChoice, computerChoice) === MESSAGES.win) {
      computerTd.style.background = "red";
    } else if (this.judge(userChoice, computerChoice) === MESSAGES.lose) {
      userTd.style.background = "red";
    }

    document.querySelector(".user").appendChild(userTd);
    document.querySelector(".computer").appendChild(computerTd);
  }

  showFinalResult() {
    const resultMessage = document.querySelector(".result-message");
    resultMessage.innerText =
      this.userWins > MAX_TURNS / 2 ? "You Won!" : "You Lost!";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
});
