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

// 3. የትምህርት አይነቶች ዝርዝር
const subjects = {
    Natural: ["ሒሳብ", "ፊዚክስ", "ኬሚስትሪ", "ባዮሎጂ", "አይሲቲ"],
    Social: ["እንግሊዝኛ", "ታሪክ", "ጂኦግራፊ", "ኢኮኖሚክስ", "ሲቪክስ"]
};

// 4. የጥያቄዎች ማከማቻ (እዚህ ጋር ነው ጥያቄዎቹን የምታስገባው)
const questionBank = {
    "ሒሳብ": [
        { id: 1, q: "የ 5 + 5 ድምር ስንት ነው?", options: ["8", "10", "12", "9"], answer: "10" },
        { id: 2, q: "የ 2 * 3 ስንት ነው?", options: ["5", "6", "7", "8"], answer: "6" }
        // እዚህ ላይ እንደዚህ እያልክ እስከ 100 ጥያቄ ትቀጥላለህ
    ]
};

// 5. የተማሪ የትምህርት ዘርፍ ምርጫ
function selectStream(stream) {
    const container = document.getElementById('subjects-container');
    container.innerHTML = '';
    document.getElementById('stream-title').innerText = (stream === 'Natural' ? 'ናቹራል ሳይንስ' : 'ሶሻል ሳይንስ');
    subjects[stream].forEach(subject => {
        let btn = document.createElement('button');
        btn.innerText = subject;
        btn.onclick = function() { startExam(subject); };
        container.appendChild(btn);
    });
    showPage('subject-list'); 
}

// 6. ፈተና መጀመሪያ እና ጥያቄ ማሳያ
let currentQIndex = 0;
function startExam(subject) {
    currentQIndex = 0;
    showQuestion(subject);
}

function showQuestion(subject) {
    if(!questionBank[subject] || currentQIndex >= questionBank[subject].length) {
        alert("በዚህ ትምህርት ውስጥ ጥያቄዎች ገና አልተዘጋጁም!");
        return;
    }
    showPage('quiz-page');
    let qData = questionBank[subject][currentQIndex];
    document.getElementById('q-text').innerText = qData.id + ". " + qData.q;
    const optContainer = document.getElementById('options-container');
    optContainer.innerHTML = '';
    qData.options.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => {
            currentQIndex++;
            if (currentQIndex < questionBank[subject].length) {
                showQuestion(subject);
            } else {
                alert("ፈተና ተጠናቀቀ!");
                showPage('selection');
            }
        };
        optContainer.appendChild(btn);
    });
}

// 7. የአስተዳደር ጥያቄ ማስገቢያ
function saveQuestion() {
    let q = document.getElementById('questionInput').value;
    if(q) {
        alert("ጥያቄው ተቀምጧል");
        document.getElementById('questionInput').value = '';
    } else {
        alert("እባክዎ ጥያቄ ይጻፉ!");
    }
}
