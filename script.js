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

// ተማሪው የመረጠው ዘርፍ መሰረት ሳብጀክቶችን የሚያመጣው ክፍል
function loadSubjects(stream) {
    const list = document.getElementById('subject-list');
    const title = document.getElementById('stream-display-title');
    
    // የሳብጀክቱን ዝርዝር ያጸዳል
    list.innerHTML = "";
    
    // የገጹን ርዕስ ይቀይራል
    title.innerText = stream + " Science Subjects";
    
    // የሳብጀክቶች ዝርዝር
    const subs = stream === 'Natural' 
        ? ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'English', 'Civics'] 
        : ['Geography', 'History', 'Economics', 'Mathematics', 'English', 'Civics'];
    
    // ሳብጀክቶቹን በዲዛይን መልክ ይደረድራል
    subs.forEach(s => {
        let b = document.createElement('button');
        b.className = 'card'; 
        b.innerText = s;
        b.onclick = () => startExam(s);
        list.appendChild(b);
    });
    
    showPage('subject-page');
}

function startExam(sub) {
    // በአድሚን በኩል ጥያቄ መጫኑን ያረጋግጣል
    if (!questions[sub] || questions[sub].length === 0) {
        return alert(sub + " ላይ እስካሁን ምንም ጥያቄ አልተጫነም! እባክዎ አድሚን ገብተው ይጫኑ።");
    }
    
    currentQuestions = questions[sub]; 
    qIndex = 0; 
    score = 0; 
    timeLeft = 90 * 60; // 1 ሰዓት ከ 30 ደቂቃ
    
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
    if(selected && selected.dataset.ans === currentQuestions[qIndex].ans) {
        score++;
    }
    
    qIndex++; 
    if(qIndex < currentQuestions.length) {
        displayQuestion();
    } else {
        endExam();
    }
}

function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        let h = Math.floor(timeLeft/3600);
        let m = Math.floor((timeLeft%3600)/60);
        let s = timeLeft%60;
        
        // ሰዓቱ 00:00:00 በሚል ፎርማት እንዲታይ
        document.getElementById('timer').innerText = `ጊዜ፡ ${h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
        
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

function processAndSave() {
    let sub = document.getElementById('admin-subject').value;
    let raw = document.getElementById('raw-input').value;
    
    if(!raw.trim()) return alert("እባክዎ ጥያቄዎችን ያስገቡ!");
    
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
    alert(sub + " ላይ ጥያቄዎች ተጭነዋል!"); 
    document.getElementById('raw-input').value = "";
    showPage('main-page');
}

function clearSystem() {
    if(confirm("ሁሉንም ዳታ ማጥፋት ይፈልጋሉ?")) {
        localStorage.clear();
        location.reload();
    }
}
