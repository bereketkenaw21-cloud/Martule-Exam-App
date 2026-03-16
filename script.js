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

// 3. ጥያቄዎችን ለማስቀመጥ (LocalStorage)
function saveQuestion() {
    let subject = document.getElementById('subjectInput').value;
    let q = document.getElementById('questionInput').value;
    let options = [document.getElementById('optA').value, document.getElementById('optB').value, document.getElementById('optC').value, document.getElementById('optD').value];
    let answer = document.getElementById('ansInput').value;

    let newQuestion = { q, options, answer };
    let data = JSON.parse(localStorage.getItem(subject)) || [];
    data.push(newQuestion);
    localStorage.setItem(subject, JSON.stringify(data));
    alert("ጥያቄው ተመዝግቧል!");
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

// 6. ጥያቄዎችን ማሳየት እና መልስ መፈተሽ
function showQuestion(subject, questions) {
    let qData = questions[currentQIndex];
    document.getElementById('q-text').innerText = (currentQIndex + 1) + ". " + qData.q;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    qData.options.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt;
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
