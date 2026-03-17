let questions = JSON.parse(localStorage.getItem('examQuestions')) || {};
function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.add('hidden')); document.getElementById(id).classList.remove('hidden'); }
function promptAdmin() { let pass = prompt("Password ያስገቡ:"); if(pass === "Mertule Mariyam@2026") showPage('admin-panel'); else alert("የተሳሳተ ፓስወርድ!"); }
function processAndSave() {
    let sub = document.getElementById('admin-subject').value;
    let raw = document.getElementById('raw-input').value;
    if(!questions[sub]) questions[sub] = [];
    let lines = raw.split('\n');
    lines.forEach(line => {
        if(line.includes('[')) {
            let q = line.split('[')[0].trim();
            let options = line.split('[')[1].split(']')[0].split(',').map(s => s.trim());
            let ans = line.split(']')[1].trim();
            questions[sub].push({q, options, ans});
        }
    });
    localStorage.setItem('examQuestions', JSON.stringify(questions));
    alert("ጥያቄዎቹ ተጭነዋል!");
    showPage('main-page');
}
function clearSystem() { if(confirm("ሁሉንም ጥያቄዎች ማጥፋት ይፈልጋሉ?")) { localStorage.clear(); location.reload(); } }
