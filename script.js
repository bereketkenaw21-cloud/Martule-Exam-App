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

// 3. የትምህርት አይነቶች ዝርዝር (ለ 2018 ካሪኩለም)
const subjects = {
    Natural: ["ሒሳብ", "ፊዚክስ", "ኬሚስትሪ", "ባዮሎጂ", "አይሲቲ"],
    Social: ["እንግሊዝኛ", "ታሪክ", "ጂኦግራፊ", "ኢኮኖሚክስ", "ሲቪክስ"]
};

// 4. የተማሪ የትምህርት ዘርፍ ምርጫ ተግባር (አሁን ትምህርቶቹን በራስ-ሰር ይጭናል)
function selectStream(stream) {
    const container = document.getElementById('subjects-container');
    container.innerHTML = ''; // የነበሩትን ያጸዳል

    // የዘርፉን ስም ያስተካክላል
    document.getElementById('stream-title').innerText = (stream === 'Natural' ? 'ናቹራል ሳይንስ' : 'ሶሻል ሳይንስ');

    // የትምህርት አይነቶችን በአዝራር መልክ ይፈጥራል
    subjects[stream].forEach(subject => {
        let btn = document.createElement('button');
        btn.innerText = subject;
        btn.onclick = function() { startExam(subject); };
        container.appendChild(btn);
    });

    showPage('subject-list'); 
}

// 5. ፈተና መጀመሪያ
function startExam(subject) {
    alert(subject + " ፈተና እየጀመሩ ነው...");
}

// 6. የአስተዳደር ጥያቄ ማስገቢያ
function saveQuestion() {
    let q = document.getElementById('questionInput').value;
    if(q) {
        alert("ጥያቄው ተቀምጧል፦ " + q);
        document.getElementById('questionInput').value = '';
    } else {
        alert("እባክዎ ጥያቄ ይጻፉ!");
    }
}
