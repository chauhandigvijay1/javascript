// All quizzes
const quizzes = {
  html: [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyperlinks and Text Markup Language",
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyperlinking Textual Markup Language"
      ],
      answer: 1
    },
    {
      question: "Which tag is used for the largest heading?",
      options: ["<heading>", "<h1>", "<h6>", "<head>"],
      answer: 1
    }
  ],
  css: [
    {
      question: "Which language is used for styling web pages?",
      options: ["HTML", "JQuery", "CSS", "XML"],
      answer: 2
    },
    {
      question: "Which property changes text color in CSS?",
      options: ["color", "font-color", "background-color", "text-style"],
      answer: 0
    }
  ],
  js: [
    {
      question: "Which is not a JavaScript framework?",
      options: ["Python Script", "JQuery", "Django", "NodeJS"],
      answer: 2
    },
    {
      question: "Inside which HTML element do we put JavaScript?",
      options: ["<script>", "<javascript>", "<js>", "<code>"],
      answer: 0
    }
  ]
};

// Variables
let currentQuiz = [];
let quizName = "";
let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;

// Elements
const menuBox = document.getElementById("menu-box");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const historyEl = document.getElementById("history");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const homeBtn = document.getElementById("home-btn");
const timeEl = document.getElementById("time");

// Select quiz
document.querySelectorAll(".quiz-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    quizName = btn.dataset.quiz;
    currentQuiz = quizzes[quizName];
    startQuiz();
  });
});

// Start quiz
function startQuiz() {
  menuBox.classList.add("hidden");
  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");

  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

// Load question
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  timeEl.textContent = timeLeft;
  startTimer();

  const q = currentQuiz[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach((opt, index) => {
    const li = document.createElement("li");
    li.textContent = opt;
    li.onclick = () => checkAnswer(index);
    optionsEl.appendChild(li);
  });
}

// Timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// Check answer
function checkAnswer(index) {
  if (index === currentQuiz[currentQuestion].answer) {
    score++;
  }
  nextQuestion();
}

// Next question
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < currentQuiz.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

// End quiz
function endQuiz() {
  clearInterval(timer);
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreEl.textContent = `${score} / ${currentQuiz.length}`;
  saveScore(quizName, score);
  showHistory();
}

// Save score
function saveScore(name, score) {
  let scores = JSON.parse(localStorage.getItem("quizScores")) || {};
  if (!scores[name]) scores[name] = [];
  scores[name].push(score);
  localStorage.setItem("quizScores", JSON.stringify(scores));
}

// Show history
function showHistory() {
  let scores = JSON.parse(localStorage.getItem("quizScores")) || {};
  historyEl.innerHTML = "";

  Object.keys(scores).forEach(name => {
    const title = document.createElement("h4");
    title.textContent = name.toUpperCase() + " Quiz:";
    historyEl.appendChild(title);

    scores[name].forEach((s, i) => {
      const li = document.createElement("li");
      li.textContent = `Attempt ${i + 1}: ${s} / ${quizzes[name].length}`;
      historyEl.appendChild(li);
    });
  });
}

// Restart quiz
restartBtn.addEventListener("click", startQuiz);

// Back to menu
homeBtn.addEventListener("click", () => {
  resultBox.classList.add("hidden");
  menuBox.classList.remove("hidden");
});

// Next button
nextBtn.addEventListener("click", nextQuestion);

// Init
showHistory();
