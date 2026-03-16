// ገጾችን ለማቀያየር የሚረዳ ዋና ተግባር
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// የአስተዳደር ኮድ ፍተሻ
function checkAdmin() {
    let code = prompt("እባክዎ የአስተዳደር ኮድ ያስገቡ:");
    if(code === "12161921") {
        alert("ወደ አስተዳደር ገጽ እየገቡ ነው...");
        // እዚህ ጋር ወደ አስተዳደር ፓናል የሚወስድ ገጽ (page) እንፈጥራለን
        showPage('admin-panel'); 
    } else {
        alert("የተሳሳተ ኮድ!");
    }
}

// የተማሪ የትምህርት ዘርፍ ምርጫ ተግባር
function selectStream(stream) {
    alert(stream + " ዘርፍን መረጡ። ወደ ሳብጀክቶች ገጽ እየወሰድንዎት ነው...");
    // ወደ ሳብጀክቶች ገጽ የሚወስድ ኮድ
    showPage('subject-list'); 
}
