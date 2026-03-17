let questions = JSON.parse(localStorage.getItem('examQuestions')) || {};
let currentQuestions = [];
let qIndex = 0, score = 0, timeLeft = 90 * 60, timerInterval;

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function promptAdmin() {
    if(prompt("Password:") === "Mertule Mariyam@2026") showPage('admin-panel');
}

function loadSubjects(stream) {
    const list = document.getElementById('subject-list');
    list.innerHTML = "";
    const subs = stream === 'Natural' ? ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'English', 'Civics'] : ['Geography', 'History', 'Economics', 'Mathematics', 'English', 'Civics'];
    subs.forEach(s => {
        let b = document.createElement('button');
        b.className = 'card'; b.innerText = s;
        b.onclick = () => startExam(s);
        list.appendChild(b);
    });
    showPage('subject-page');
}

function startExam(sub) {
    if (!questions[sub]) return alert("ጥያቄ አልተጫነም!");
    currentQuestions = questions[sub]; qIndex = 0; score = 0; timeLeft = 90 * 60;
    showPage('quiz-page'); displayQuestion(); startTimer();
}

function displayQuestion() {
    let q = currentQuestions[qIndex];
    document.getElementById('q-counter').innerText = `ጥያቄ ${qIndex+1}/${currentQuestions.length}`;
    document.getElementById('q-text').innerText = q.q;
    let optDiv = document.getElementById('options'); optDiv.innerHTML = "";
    q.options.forEach(o => {
        let b = document.createElement('button'); b.className = 'option-btn'; b.innerText = o;
        b.onclick = () => { document.querySelectorAll('.option-btn').forEach(x => x.style.background=''); b.style.background='#e8f0fe'; b.dataset.ans=o; document.getElementById('next-btn').disabled=false; };
        optDiv.appendChild(b);
    });
}

function submitAnswer() {
    if(document.querySelector('.option-btn[style*="background"]').dataset.ans === currentQuestions[qIndex].ans) score++;
    qIndex++; if(qIndex < currentQuestions.length) displayQuestion(); else endExam();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        let h = Math.floor(timeLeft/3600), m = Math.floor((timeLeft%3600)/60), s = timeLeft%60;
        document.getElementById('timer').innerText = `ጊዜ፡ ${h}:${m}:${s}`;
        if(timeLeft <= 0) endExam();
    }, 1000);
}

function endExam() { clearInterval(timerInterval); showPage('result-page'); document.getElementById('score-display').innerText = `${score} / ${currentQuestions.length}`; }

function processAndSave() {
    let sub = document.getElementById('admin-subject').value;
    let raw = document.getElementById('raw-input').value;
    if(!questions[sub]) questions[sub] = [];
    raw.split('\n').forEach(l => {
        if(l.includes('[')) {
            let q = l.split('[')[0].trim(), opts = l.split('[')[1].split(']')[0].split(',').map(x=>x.trim()), ans = l.split(']')[1].trim();
            questions[sub].push({q, options: opts, ans});
        }
    });
    localStorage.setItem('examQuestions', JSON.stringify(questions));
    alert("ተጭኗል!"); showPage('main-page');
}
