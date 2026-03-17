// በአድሚን የተጫኑ ጥያቄዎችን ከሚሞሪ ያመጣል
let questions = JSON.parse(localStorage.getItem('examQuestions')) || {};
let currentQuestions = [];
let qIndex = 0, score = 0, timeLeft = 90 * 60, timerInterval;

// ገጾችን ለመቀያየር የሚያገለግል
function showPage(id) {
    // ሁሉንም ገጾች ደብቅ
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    // የተመረጠውን ገጽ ብቻ አሳይ
    const targetPage = document.getElementById(id);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

// አድሚን መግቢያ
function promptAdmin() {
    const pass = prompt("Password ያስገቡ:");
    if(pass === "Mertule Mariyam@2026") {
        showPage('admin-panel');
    } else {
        alert("የተሳሳተ ፓስወርድ!");
    }
}

// *** ዋናው ችግር ያለበት ቦታ - ተስተካክሏል ***
function loadSubjects(stream) {
    const list = document.getElementById('subject-list');
    const title = document.getElementById('stream-display-title');
    
    if (!list) return; // ኤለመንቱ ከሌለ ስራውን ያቆማል

    list.innerHTML = ""; // የቆየ ዝርዝር ካለ ያጸዳል
    title.innerText = stream + " Science Subjects";

    // በዘርፉ ያሉ ሳብጀክቶች ዝርዝር
    const subs = stream === 'Natural' 
        ? ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'English', 'Civics'] 
        : ['Geography', 'History', 'Economics', 'Mathematics', 'English', 'Civics'];

    // ለእያንዳንዱ ሳብጀክት በተን ይፈጥራል
    subs.forEach(s => {
        let b = document.createElement('button');
        b.className = 'card'; 
        b.innerText = s;
        b.style.display = "block"; // እንዲታይ ማረጋገጫ
        b.onclick = () => startExam(s);
        list.appendChild(b);
    });

    showPage('subject-page'); // ወደ ሳብጀክት ገጽ ይወስዳል
}

function startExam(sub) {
    if (!questions[sub] || questions[sub].length === 0) {
        return alert(sub + " ላይ እስካሁን ምንም ጥያቄ አልተጫነም! እባክዎ አድሚን ገብተው ይጫኑ።");
    }
    
    currentQuestions = questions[sub]; 
    qIndex = 0; score = 0; timeLeft = 90 * 60;
    
    showPage('quiz-page'); 
    displayQuestion(); 
    startTimer();
}

function displayQuestion() {
    let q = currentQuestions[qIndex];
    document.getElementById('q-counter').innerText = `ጥያቄ ${qIndex+1}/${currentQuestions.length}`;
    document.getElementById('q-text').innerText = q.q;
    let optDiv = document.getElementById('options'); 
    optDiv.innerHTML = "";
    
    q.options.forEach(o => {
        let b = document.createElement('button'); 
        b.className = 'option-btn'; 
        b.innerText = o;
        b.onclick = () => { 
            document.querySelectorAll('.option-btn').forEach(x => x.style.background=''); 
            b.style.background='#e8f0fe'; 
            b.dataset.ans = o; 
            document.getElementById('next-btn').disabled = false; 
        };
        optDiv.appendChild(b);
    });
}

function submitAnswer() {
    let selected = document.querySelector('.option-btn[style*="background"]');
    if(selected && selected.dataset.ans === currentQuestions[qIndex].ans) score++;
    
    qIndex++; 
    if(qIndex < currentQuestions.length) displayQuestion(); 
    else endExam();
}

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        let h = Math.floor(timeLeft/3600), m = Math.floor((timeLeft%3600)/60), s = timeLeft%60;
        document.getElementById('timer').innerText = `ጊዜ፡ ${h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
        if(timeLeft <= 0) endExam();
    }, 1000);
}

function endExam() { 
    clearInterval(timerInterval); 
    showPage('result-page'); 
    document.getElementById('score-display').innerText = `${score} / ${currentQuestions.length}`; 
}

function processAndSave() {
    let sub = document.getElementById('admin-subject').value;
    let raw = document.getElementById('raw-input').value;
    if(!raw.trim()) return alert("ጥያቄ ያስገቡ!");
    
    if(!questions[sub]) questions[sub] = [];
    raw.split('\n').forEach(l => {
        if(l.includes('[') && l.includes(']')) {
            let q = l.split('[')[0].trim();
            let opts = l.split('[')[1].split(']')[0].split(',').map(x=>x.trim());
            let ans = l.split(']')[1].trim();
            questions[sub].push({q, options: opts, ans});
        }
    });
    localStorage.setItem('examQuestions', JSON.stringify(questions));
    alert("ተጭኗል!"); 
    document.getElementById('raw-input').value = "";
    showPage('main-page');
}

function clearSystem() {
    if(confirm("ሁሉንም ዳታ ማጥፋት ይፈልጋሉ?")) {
        localStorage.clear();
        location.reload();
    }
}
