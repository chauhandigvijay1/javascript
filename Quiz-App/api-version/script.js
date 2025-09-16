// Variables
let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;
let currentCategory = "";

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

const darkToggle = document.getElementById("dark-toggle");

// Dark Mode
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
  darkToggle.textContent = "☀️ Light Mode";
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
    darkToggle.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkToggle.textContent = "🌙 Dark Mode";
  }
});

// Subject selection
document.querySelectorAll(".quiz-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    fetchQuestions(currentCategory);
  });
});

// Fetch questions from API
async function fetchQuestions(category) {
  try {
    const res = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=medium&type=multiple`);
    const data = await res.json();
    questions = data.results.map(q => {
      const options = [...q.incorrect_answers];
      const correctIndex = Math.floor(Math.random() * (options.length + 1));
      options.splice(correctIndex, 0, q.correct_answer);
      return {
        question: decodeHTML(q.question),
        options: options.map(o => decodeHTML(o)),
        answer: correctIndex
      };
    });
    startQuiz();
  } catch (error) {
    questionEl.textContent = "Failed to load questions. Try again!";
  }
}

// Decode HTML entities
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

// Start Quiz
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

  const q = questions[currentQuestion];
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
  if (index === questions[currentQuestion].answer) score++;
  nextQuestion();
}

// Next question
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) loadQuestion();
  else endQuiz();
}

// End quiz
function endQuiz() {
  clearInterval(timer);
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreEl.textContent = `${score} / ${questions.length}`;
  saveScore(currentCategory, score);
  showHistory();
}

// Save score in localStorage per category
function saveScore(category, score) {
  let scores = JSON.parse(localStorage.getItem("quizScores")) || {};
  if (!scores[category]) scores[category] = [];
  scores[category].push(score);
  localStorage.setItem("quizScores", JSON.stringify(scores));
}

// Show history
function showHistory() {
  let scores = JSON.parse(localStorage.getItem("quizScores")) || {};
  historyEl.innerHTML = "";
  Object.keys(scores).forEach(cat => {
    const title = document.createElement("h4");
    title.textContent = `${cat} Quiz:`;
    historyEl.appendChild(title);
    scores[cat].forEach((s, i) => {
      const li = document.createElement("li");
      li.textContent = `Attempt ${i + 1}: ${s} / 10`;
      historyEl.appendChild(li);
    });
  });
}

// Restart
restartBtn.addEventListener("click", () => fetchQuestions(currentCategory));

// Back to menu
homeBtn.addEventListener("click", () => {
  resultBox.classList.add("hidden");
  menuBox.classList.remove("hidden");
});

// Next button
nextBtn.addEventListener("click", nextQuestion);

// Init
showHistory();
