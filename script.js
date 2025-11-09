const CASES = {
    "الحروق": [
        "تبريد الحرق بوضعه تحت ماء جاري معتدل لمدة 10-15 دقيقة.",
        "إزالة الملابس الضيقة والأكسسوارات.",
        "تغطية الحرق بضمادة نظيفة.",
        "اتصل بالإسعاف فوراً على 997."
    ],
    "الصرع": [
        "لاحظ الوقت المستغرق في النوبة.",
        "احمِ المصاب من الأجسام المحيطة.",
        "ادعم رأس المصاب بقطعة قماش.",
        "لا تضع شيء في فم المصاب.",
        "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً."
    ],
    "انخفاض الضغط": [
        "أجلس المصاب أو اجعله يستلقي.",
        "ارفع قدميه قليلاً.",
        "أعطه ماء أو عصير إذا كان واعياً.",
        "اتصل بالإسعاف إذا لم يتحسن."
    ],
    "اختناق": [
        "قف خلف الشخص المصاب.",
        "اضغط بقوة وبسرعة فوق السرة لعدة مرات.",
        "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي.",
        "اتصل بالإسعاف فوراً على 997."
    ]
};

let currentUtterance = null;

document.getElementById('emergencyBtn').addEventListener('click', () => {
    stopSpeech();
    const caseName = prompt("اذكر الحالة: الحروق، الصرع، انخفاض الضغط، الاختناق");
    if (CASES[caseName]) {
        showCaseSteps(caseName);
        speakSteps(caseName);
    } else {
        alert("الحالة غير معروفة.");
    }
});

function showTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    stopSpeech();
}

function showCaseSteps(caseName) {
    // إخفاء جميع الخطوات أولاً
    Object.keys(CASES).forEach(c => {
        const container = document.getElementById(`steps-${c}`);
        if (container) container.innerHTML = "";
    });

    const container = document.getElementById(`steps-${caseName}`);
    if (container) {
        CASES[caseName].forEach((step, index) => {
            const p = document.createElement('p');
            p.textContent = `${index + 1}. ${step}`;
            container.appendChild(p);
        });
    }
}

function speakSteps(caseName) {
    stopSpeech();
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(CASES[caseName].join('. '));
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
    currentUtterance = utterance;
}

function stopSpeech() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    currentUtterance = null;
}

function callEmergency(event) {
    event.stopPropagation();
    if (confirm("هل تريد الاتصال بخدمة الطوارئ؟")) {
        alert("سيتم الاتصال بالطوارئ فوراً!");
        // هنا يمكن وضع كود الاتصال الفعلي إذا كان موقع على الهاتف
    }
}
