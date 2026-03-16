// ገጾችን ለማቀያየር የሚረዳ ተግባር
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// የአስተዳደር ኮድ ፍተሻ
function checkAdmin() {
    let code = prompt("እባክዎ የአስተዳደር ኮድ ያስገቡ:");
    if(code === "12161921") {
        alert("ወደ አስተዳደር ገጽ እየገቡ ነው...");
        // ወደ አስተዳደር ገጽ የመሄጃ ኮድ እዚህ ይገባል
    } else {
        alert("የተሳሳተ ኮድ!");
    }
}
