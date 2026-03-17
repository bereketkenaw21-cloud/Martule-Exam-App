// 1. የቋንቋ ዳታ (Translation Data)
const i18n = {
    am: {
        welcome: "እንኳን ወደ መርጡለ ማሪያም 2ኛ ደረጃ ትምህርት ቤት የፈተና መለማመጃ ገፅ በደህና መጣቹህ",
        creator: "አዘጋጅ፡ በረከት ቀናው",
        studentBtn: "የተማሪዎች መግቢያ",
        adminBtn: "አስተዳዳሪ (Admin)",
        streamTitle: "የጥናት ዘርፍዎን ይምረጡ",
        timerText: "የቀረ ጊዜ፡ ",
        next: "ቀጣይ",
        submit: "ጨርስ",
        back: "ተመለስ"
    },
    en: {
        welcome: "Welcome to Mertule Mariyam Secondary School Exam Practice System",
        creator: "Developed by: Bereket Kenaw",
        studentBtn: "Student Entrance",
        adminBtn: "Admin",
        streamTitle: "Select Your Stream",
        timerText: "Time Left: ",
        next: "Next",
        submit: "Submit",
        back: "Back"
    }
};

let currentLang = 'am';

// 2. ዳታ ቤዝ (Database) - ከኮምፒውተሩ Memory ይፈልጋል
let questionsDB = JSON.parse(localStorage.getItem('mertule_db')) || {
    Natural: { Mathematics: [], Physics: [], Biology: [], Chemistry: [], English: [] },
    Social: { History: [], Geography: [], Economics: [], Civics: [], Mathematics: [], English: [] }
};

// 3. Variables
let currentSubject = [];
let qIndex = 0;
let score = 0;
let timeLeft = 90 * 60; // 1 ሰዓት ከ 30 ደቂቃ በሰከንድ
let timerInterval;
let selectedValue = "";

// 4. ቋንቋ መቀየሪያ (ባንዲራዎቹን ሲነኩ የሚሰራ)
function setLanguage(lang) {
    currentLang = lang;
    // index.html ላይ ያሉትን ጽሁፎች በሙሉ ይቀይራል
    document.getElementById('welcome-text').innerText = i18n[lang].welcome;
    document.getElementById('creator-text').innerText = i18n[lang].creator;
    document.getElementById('student-btn').innerText = i18n[lang].studentBtn;
    document.getElementById('admin-btn').innerText = i18n[lang].adminBtn;
    
    // የኋላ ቁልፎችን (Back buttons) ለመቀየር
    document.querySelectorAll('.back-link').forEach(btn => {
        btn.innerText = i18n[lang].back;
    });
}

// 5. የአድሚን መግቢያ (Password: Mertule Mariyam@2026)
function promptAdmin() {
    let pw = prompt("የአስተዳዳሪ ኮድ ያስገቡ (Admin Password):");
    if(pw === "Mertule Mariyam@2026") {
        showPage('admin-panel');
    } else {
        alert("የተሳሳተ ኮድ ነው!");
    }
}

// 6. ጥያቄዎችን በጅምላ መጫኛ (PDF Parser logic)
function processAndSave() {
    let stream = prompt("ዘርፍ ይምረጡ (Natural/Social):");
    if (stream !== "Natural" && stream !== "Social") {
        alert("እባክዎ Natural ወይም Social ብለው በትክክል ያስገቡ!");
        return;
    }
    
    let subject = document.getElementById('admin-subject').value;
    let rawText = document.getElementById('raw-input').value;

    let lines = rawText.split('\n');
    let addedCount = 0;

    lines.forEach(line => {
        if(line.includes('?')) {
            try {
                let parts = line.split('?');
                let q = parts[0] + "?";
                let rest = parts[1].split(']');
                let opts = rest[0].replace('[','').split(',');
                let ans = rest[1].trim();

                questionsDB[stream][subject].push({
                    q: q,
                    options: opts.map(o => o.trim()),
                    answer: ans
                });
                addedCount++;
            } catch(e) {
                console.log("መስመሩ ሊነበብ አልቻለም: " + line);
            }
        }
    });

    localStorage.setItem('mertule_db', JSON.stringify(questionsDB));
    alert(addedCount + " ጥያቄዎች በተሳካ ሁኔታ ተጭነዋል!");
    document.getElementById('raw-input').value = ""; // ሳጥኑን ባዶ ለማድረግ
}

// 7. የፈተና ሂደት
function loadSubjects(stream) {
    const list = document.getElementById('subject-list');
    list.innerHTML = '';
    document.getElementById('stream-title').innerText = i18n[currentLang].streamTitle + " (" + stream + ")";
    
    Object.keys(questionsDB[stream]).forEach(sub => {
        let btn = document.createElement('button');
        btn.className = 'card';
        btn.innerText = sub;
        btn.onclick = () => startExam(stream, sub);
        list.appendChild(btn);
    });
    showPage('subject-page');
}

function startExam(stream, subject) {
    currentSubject = questionsDB[stream][subject];
    if(currentSubject.length === 0) return alert("በዚህ ትምህርት ጥያቄ አልተጫነም!");
    
    qIndex = 0; score = 0; timeLeft = 90 * 60;
    showPage('quiz-page');
    displayQuestion();
    startTimer();
}

// 8. ጥያቄዎችን A, B, C, D ብሎ የሚያሳይ ተግባር
function displayQuestion() {
    let qData = currentSubject[qIndex];
    const prefixes = ['A', 'B', 'C', 'D']; // ፊደላቱን ለመጨመር
    
    document.getElementById('q-counter').innerText = `ጥያቄ ${qIndex + 1}/${currentSubject.length}`;
    document.getElementById('q-text').innerText = qData.q;
    
    const optCont = document.getElementById('options');
    optCont.innerHTML = '';
    
    qData.options.forEach((opt, i) => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        // እዚህ ጋር ነው A, B, C, D የሚቀመጠው
        btn.innerHTML = `<span style="font-weight:bold; color:#1a73e8;">${prefixes[i]}.</span> ${opt}`;
        btn.onclick = () => selectOption(btn, opt);
        optCont.appendChild(btn);
    });
    document.getElementById('next-btn').disabled = true;
}

function selectOption(btn, val) {
    selectedValue = val;
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('next-btn').disabled = false;
}

function submitAnswer() {
    if(selectedValue === currentSubject[qIndex].answer) score++;
    
    // ወደ ኋላ መመለስ ስለማይቻል qIndex ን ወደፊት ብቻ እንገፋለን
    qIndex++;
    
    if(qIndex < currentSubject.length) {
        displayQuestion();
    } else {
        endExam();
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        
        let hrs = Math.floor(timeLeft / 3600);
        let min = Math.floor((timeLeft % 3600) / 60);
        let sec = timeLeft % 60;
        
        // ሰዓቱን 00:00:00 በሚል ፎርማት ያሳያል
        let timeString = `${hrs < 10 ? '0'+hrs : hrs}:${min < 10 ? '0'+min : min}:${sec < 10 ? '0'+sec : sec}`;
        document.getElementById('timer').innerText = i18n[currentLang].timerText + timeString;
        
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("ጊዜዎ አልቋል! ሲስተሙ ተቆልፏል።");
            endExam();
        }
    }, 1000);
}

function endExam() {
    clearInterval(timerInterval);
    showPage('result-page');
    document.getElementById('score-display').innerText = `${score} / ${currentSubject.length}`;
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// ሁሉንም ዳታ ማጥፊያ (Admin ብቻ)
function clearSystem() {
    if(confirm("ሁሉንም ዳታ ለማጥፋት እርግጠኛ ነዎት?")) {
        localStorage.removeItem('mertule_db');
        location.reload();
    }
}
