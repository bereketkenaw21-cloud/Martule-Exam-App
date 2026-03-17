// በአድሚን የተጫኑ ጥያቄዎችን ከኮምፒውተሩ ሚሞሪ ያመጣል
let questions = JSON.parse(localStorage.getItem('examQuestions')) || {};
let currentSubject = "";
let currentQuestions = [];
let qIndex = 0;
let score = 0;
let timeLeft = 90 * 60; // 1 ሰዓት ከ30 ደቂቃ (በሰከንድ)
let timerInterval;

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function promptAdmin() {
    let pass = prompt("Password ያስገቡ:");
    if(pass === "Mertule Mariyam@2026") showPage('admin-panel');
    else alert("የተሳሳተ ፓስወርድ!");
}

// ተማሪዎች ዘርፍ ሲመርጡ ሳብጀክቶችን ያሳያል
function loadSubjects(stream) {
    const subjectList = document.getElementById('subject-list');
    subjectList.innerHTML = "";
    
    // በዘርፉ ያሉ ሳብጀክቶች ዝርዝር
    const subjects = stream === 'Natural' 
        ? ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'English', 'Civics']
        : ['Geography', 'History', 'Economics', 'Mathematics', 'English', 'Civics'];

    subjects.forEach(sub => {
        let btn = document.createElement('button');
        btn.className = 'card';
        btn.innerText = sub;
        btn.onclick = () => startExam(sub);
        subjectList.appendChild(btn);
    });
    
    document.getElementById('stream-display-title').innerText = stream + " Subjects";
    showPage('subject-page');
}

// ፈተናውን ያስጀምራል
function startExam(sub) {
    if (!questions[sub] || questions[sub].length === 0) {
        alert(sub + " ላይ እስካሁን ምንም ጥያቄ አልተጫነም! እባክዎ በአድሚን በኩል ይጫኑ።");
        return;
    }
    
    currentSubject = sub;
    currentQuestions = questions[sub];
    qIndex = 0;
    score = 0;
    timeLeft = 90 * 60; // ጊዜውን ያድሳል (1:30)
    
    showPage('quiz-page');
    displayQuestion();
    startTimer();
}

function displayQuestion() {
    let qData = currentQuestions[qIndex];
    document.getElementById('q-counter').innerText = `ጥያቄ ${qIndex + 1}/${currentQuestions.length}`;
    document.getElementById('q-text').innerText = qData.q;
    
    let optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = "";
    
    qData.options.forEach(opt => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectAnswer(opt, btn);
        optionsDiv.appendChild(btn);
    });
    document.getElementById('next-btn').disabled = true;
}

function selectAnswer(opt, btn) {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if(opt === currentQuestions[qIndex].ans) score++;
    document.getElementById('next-btn').disabled = false;
}

function submitAnswer() {
    qIndex++;
    if(qIndex < currentQuestions.length) {
        displayQuestion();
    } else {
        endExam();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        let hrs = Math.floor(timeLeft / 3600);
        let mins = Math.floor((timeLeft % 3600) / 60);
        let secs = timeLeft % 60;
        document.getElementById('timer').innerText = `ጊዜ፡ ${hrs}:${mins < 10 ? '0'+mins : mins}:${secs < 10 ? '0'+secs : secs}`;
        
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("ጊዜዎ አልቋል!");
            endExam();
        }
    }, 1000);
}

function endExam() {
    clearInterval(timerInterval);
    showPage('result-page');
    document.getElementById('score-display').innerText = `${score} / ${currentQuestions.length}`;
}

// አድሚን ጥያቄ ሲጭን
function processAndSave() {
    let sub = document.getElementById('admin-subject').value;
    let raw = document.getElementById('raw-input').value;
    if(!questions[sub]) questions[sub] = [];
    
    // ጥያቄዎቹን የመለየት ሎጂክ
    let lines = raw.split('\n');
    lines.forEach(line => {
        if(line.includes('[') && line.includes(']')) {
            let q = line.split('[')[0].trim();
            let options = line.split('[')[1].split(']')[0].split(',').map(s => s.trim());
            let ans = line.split(']')[1].trim();
            questions[sub].push({q, options, ans});
        }
    });
    
    localStorage.setItem('examQuestions', JSON.stringify(questions));
    alert(sub + " ላይ ጥያቄዎች በትክክል ተጭነዋል!");
    document.getElementById('raw-input').value = "";
    showPage('main-page');
}

function clearSystem() {
    if(confirm("ሁሉንም ዳታ ማጥፋት ይፈልጋሉ?")) {
        localStorage.clear();
        location.reload();
    }
}
