// 1. ገጾችን ለማቀያየር የሚረዳ ዋና ተግባር
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// 2. የአስተዳደር ኮድ ፍተሻ
function checkAdmin() {
    let code = prompt("እባክዎ የአስተዳደር ኮድ ያስገቡ:");
    if(code === "12161921") {
        showPage('admin-panel'); 
    } else {
        alert("የተሳሳተ ኮድ!");
    }
}

// 3. ጥያቄዎችን በBulk (ከPDF/Text) ለማስገባት የሚያስችል አዲስ ሲስተም
function parseAndSaveBulk() {
    let rawText = document.getElementById('bulkInput').value; // በ HTML ላይ ይህን Input ጨምር
    let subject = document.getElementById('subjectInput').value;
    let lines = rawText.split('\n');
    let data = JSON.parse(localStorage.getItem(subject)) || [];

    // እያንዳንዱ 5 መስመር እንደ አንድ ጥያቄ ይቆጠራል (ጥያቄ + 4 አማራጮች)
    for(let i=0; i < lines.length; i += 5) {
        if(lines[i]) {
            data.push({
                q: lines[i],
                options: [lines[i+1], lines[i+2], lines[i+3], lines[i+4]],
                answer: lines[i+1] // መጀመሪያው አማራጭ ትክክለኛ መልስ ተደርጎ ይወሰዳል
            });
        }
    }
    localStorage.setItem(subject, JSON.stringify(data));
    alert("ጥያቄዎች በስኬት ተመዝግበዋል!");
}

// 4. የትምህርት ዘርፍ እና አይነት ምርጫ
const subjects = {
    Natural: ["ሒሳብ", "ፊዚክስ", "ኬሚስትሪ", "ባዮሎጂ", "አይሲቲ"],
    Social: ["እንግሊዝኛ", "ታሪክ", "ጂኦግራፊ", "ኢኮኖሚክስ", "ሲቪክስ"]
};

function selectStream(stream) {
    const container = document.getElementById('subjects-container');
    container.innerHTML = '';
    document.getElementById('stream-title').innerText = (stream === 'Natural' ? 'ናቹራል ሳይንስ' : 'ሶሻል ሳይንስ');
    subjects[stream].forEach(subject => {
        let btn = document.createElement('button');
        btn.innerText = subject;
        btn.onclick = () => startExam(subject);
        container.appendChild(btn);
    });
    showPage('subject-list'); 
}

// 5. ፈተና መጀመሪያ እና ሰዓት ቆጣሪ
let currentQIndex = 0;
let score = 0;
let timerInterval;

function startExam(subject) {
    currentQIndex = 0;
    score = 0;
    let questions = JSON.parse(localStorage.getItem(subject)) || [];
    if(questions.length === 0) { alert("ጥያቄዎች አልተዘጋጁም!"); return; }
    
    showPage('quiz-page');
    startTimer();
    showQuestion(subject, questions);
}

function startTimer() {
    let timeLeft = 60;
    document.getElementById('timer').innerText = "የቀረዎት ሰዓት: " + timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = "የቀረዎት ሰዓት: " + timeLeft;
        if(timeLeft <= 0) { clearInterval(timerInterval); alert("ጊዜ አልቋል!"); showPage('selection'); }
    }, 1000);
}

// 6. ጥያቄዎችን ማሳየት እና A, B, C, D አማራጮችን መፈተሽ
function showQuestion(subject, questions) {
    let qData = questions[currentQIndex];
    document.getElementById('q-text').innerText = (currentQIndex + 1) + ". " + qData.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    let labels = ['A', 'B', 'C', 'D'];
    qData.options.forEach((opt, index) => {
        let btn = document.createElement('button');
        btn.innerText = labels[index] + ") " + opt; // እዚህ ጋር A, B, C, D ታክሏል
        btn.onclick = () => {
            if(opt === qData.answer) score++;
            currentQIndex++;
            if (currentQIndex < questions.length) {
                showQuestion(subject, questions);
            } else {
                clearInterval(timerInterval);
                alert("ፈተና ተጠናቀቀ! ውጤትዎ: " + score + "/" + questions.length);
                showPage('selection');
            }
        };
        container.appendChild(btn);
    });
}
