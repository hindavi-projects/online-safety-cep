const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwon_vhnTEW1dBTNuUAdqlnU7JeIpzArpMSr1lAYdE462BQcZHBjpmuJJPWcOQPaydosg/exec";

const languageSelect = document.getElementById("languageSelect");
const studentForm = document.getElementById("studentForm");
const quizForm = document.getElementById("quizForm");
const questionsArea = document.getElementById("questionsArea");
const quizResult = document.getElementById("quizResult");
const scoreMessage = document.getElementById("scoreMessage");

let participant = {
  name: "",
  ageGroup: "",
  gender: ""
};

const quizQuestions = [
  {
    question: "Which information should you never share with anyone?",
    options: ["Your favourite colour", "OTP and password", "Your hobby"],
    answer: 1
  },
  {
    question: "What should you do if you receive a suspicious link?",
    options: ["Click it immediately", "Do not click it; block or report the sender", "Forward it to friends"],
    answer: 1
  },
  {
    question: "Which password is strongest?",
    options: ["123456", "password", "SaFe@2026!Learn"],
    answer: 2
  },
  {
    question: "What is the safest privacy setting for social media?",
    options: ["Private account", "Public account for everyone", "Share password with friends"],
    answer: 0
  },
  {
    question: "What should you do if someone bullies you online?",
    options: ["Reply with angry messages", "Save evidence, block them, and tell a trusted adult", "Share the message everywhere"],
    answer: 1
  },
  {
    question: "Should you share your live location publicly?",
    options: ["Yes, always", "No, never publicly", "Only with strangers"],
    answer: 1
  },
  {
    question: "What can unsafe downloads do?",
    options: ["Install viruses or malware", "Make your password stronger", "Make the internet faster"],
    answer: 0
  },
  {
    question: "Who should you tell if something online makes you uncomfortable?",
    options: ["A trusted adult, parent, teacher, or guardian", "Nobody", "The unknown person"],
    answer: 0
  }
];

function changeLanguage() {
  const language = languageSelect.value;

  document.querySelectorAll("[data-en]").forEach(function (element) {
    const translation = element.getAttribute("data-" + language);

    if (translation) {
      element.textContent = translation;
    }
  });
}

function renderQuiz() {
  questionsArea.innerHTML = "";

  quizQuestions.forEach(function (item, number) {
    let options = "";

    item.options.forEach(function (option, optionNumber) {
      options += `
        <label>
          <input type="radio" name="question${number}" value="${optionNumber}" required>
          ${option}
        </label>
      `;
    });

    questionsArea.innerHTML += `
      <div class="question">
        <p>${number + 1}. ${item.question}</p>
        ${options}
      </div>
    `;
  });
}

function saveQuizResult(score, answers) {
  if (GOOGLE_SHEET_URL === "1i8jSkBUi2i_JzP5-LSVYGMV3ob5rjFOZFNaiMPISlmQ") {
    return;
  }

  const data = {
    name: participant.name,
    ageGroup: participant.ageGroup,
    gender: participant.gender,
    score: score,
    total: quizQuestions.length,
    answers: answers.join(" | ")
  };

  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain"
    },
    body: JSON.stringify(data)
  });
}

if (languageSelect) {
  languageSelect.addEventListener("change", changeLanguage);
}

if (studentForm) {
  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    participant.name = document.getElementById("studentName").value.trim();
    participant.ageGroup = document.getElementById("studentAgeGroup").value;
    participant.gender = document.getElementById("studentGender").value;

    studentForm.classList.add("hidden");
    quizForm.classList.remove("hidden");

    renderQuiz();
  });
}

if (quizForm) {
  quizForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let score = 0;
    const answers = [];

    quizQuestions.forEach(function (item, number) {
      const selected = document.querySelector(
        'input[name="question' + number + '"]:checked'
      );

      const selectedNumber = Number(selected.value);
      answers.push("Q" + (number + 1) + ": " + item.options[selectedNumber]);

      if (selectedNumber === item.answer) {
        score++;
      }
    });

    saveQuizResult(score, answers);

    scoreMessage.textContent =
      "Your score: " + score + " / " + quizQuestions.length;

    quizForm.classList.add("hidden");
    quizResult.classList.remove("hidden");
  });
}