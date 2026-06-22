// =============================
// DATA
// =============================

const answers = {
    q1: "B",
    q2: "A",
    q3: "C",
    q4: "A",
    q5: "B"
};

let currentQuestion = 0;
const questions = document.querySelectorAll(".question-page");

let timeLeft = 25 * 60;
let timer;

let tabCount = 0;
let idleCount = 0;

let logs = [];
let idleTimer;

// =============================
// START EXAM
// =============================

function startExam() {

    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();

    if (nama === "" || nim === "") {
        alert("Silakan isi Nama dan NIM.");
        return;
    }

    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("examPage").classList.remove("hidden");

    startTimer();
    updateProgress();
    showQuestion(0);
    startWebcam();
    openFullscreen();
    resetIdleTimer();
}

// =============================
// TIMER
// =============================

function startTimer() {

    timer = setInterval(() => {

        let minute = Math.floor(timeLeft / 60);
        let second = timeLeft % 60;

        document.getElementById("timer").innerHTML =
            `${minute}:${second < 10 ? "0" : ""}${second}`;

        timeLeft--;

        if (timeLeft < 0) {
            finishExam();
        }

    }, 1000);

}

// =============================
// QUESTION
// =============================

function showQuestion(index) {

    questions.forEach(q => q.classList.remove("active"));

    questions[index].classList.add("active");

    currentQuestion = index;

    document.getElementById("currentQuestion").innerHTML = index + 1;

    updateProgress();

}

function nextQuestion() {

    if (currentQuestion < questions.length - 1) {

        showQuestion(currentQuestion + 1);

    }

}

function prevQuestion() {

    if (currentQuestion > 0) {

        showQuestion(currentQuestion - 1);

    }

}

// =============================
// PROGRESS BAR
// =============================

function updateProgress() {

    let percent = ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progressBar").style.width = percent + "%";

}

// =============================
// FULLSCREEN
// =============================

function openFullscreen() {

    let doc = document.documentElement;

    if (doc.requestFullscreen) {

        doc.requestFullscreen();

    }

}

// =============================
// WEBCAM
// =============================

async function startWebcam() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({

            video: true,
            audio: false

        });

        document.getElementById("webcam").srcObject = stream;

    } catch (e) {

        document.querySelector(".status").innerHTML =
            "❌ Webcam Tidak Aktif";

    }

}

// =============================
// IDLE DETECTOR
// =============================

function resetIdleTimer() {

    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {

        idleCount++;

        logs.push(

            "[" +
            new Date().toLocaleTimeString() +
            "] User AFK"

        );

        document.getElementById("warningBox").innerHTML =
            "User AFK";

    }, 15000);

}

["mousemove", "keydown", "click", "scroll"].forEach(event => {

    document.addEventListener(event, () => {

        resetIdleTimer();

    });

});

// =============================
// TAB DETECTOR
// =============================

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        tabCount++;

        logs.push(

            "[" +
            new Date().toLocaleTimeString() +
            "] Pindah Tab"

        );

        document.getElementById("warningBox").innerHTML =
            "Jangan pindah tab!";

        if (tabCount >= 3) {

            alert("Ujian dihentikan!");

            finishExam();

        }

    }

});

// =============================
// DISABLE RIGHT CLICK
// =============================

document.addEventListener("contextmenu", function (e) {

    e.preventDefault();

});

// =============================
// DISABLE COPY
// =============================

document.addEventListener("copy", function (e) {

    e.preventDefault();

});

// =============================
// DISABLE CTRL+C CTRL+U CTRL+S
// =============================

document.addEventListener("keydown", function (e) {

    if (e.ctrlKey &&
        (
            e.key === "c" ||
            e.key === "u" ||
            e.key === "s"
        )
    ) {

        e.preventDefault();

    }

});

// =============================
// FINISH EXAM
// =============================

function finishExam() {

    clearInterval(timer);

    let score = 0;

    for (let key in answers) {

        const selected =
            document.querySelector(
                `input[name="${key}"]:checked`
            );

        if (
            selected &&
            selected.value === answers[key]
        ) {

            score += 20;

        }

    }

    document.getElementById("examPage").classList.add("hidden");

    document.getElementById("resultPage").classList.remove("hidden");

    document.getElementById("score").innerHTML =
        "Nilai Anda : <b>" + score + "</b>";

    document.getElementById("tabViolations").innerHTML =
        "Pindah Tab : " + tabCount;

    document.getElementById("idleInfo").innerHTML =
        "AFK : " + idleCount;

    let list = document.getElementById("logList");

    list.innerHTML = "";

    logs.forEach(log => {

        let li = document.createElement("li");

        li.innerHTML = log;

        list.appendChild(li);

    });

}