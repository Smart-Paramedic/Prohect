// ================== البيانات الأساسية للحالات ==================
const CASES = {
    "الحروق": [
        "تبريد الحرق بوضع المنطقة المصابة تحت ماء جاري لمدة 10-15 دقيقة.",
        "إزالة الإكسسوارات والملابس الضيقة قبل انتفاخ المنطقة.",
        "تغطية منطقة الحرق بضمادة نظيفة.",
        "اتصل بالإسعاف فوراً على 997."
    ],
    "الصرع": [
        "لاحظ الوقت المستغرق في النوبة.",
        "احمِ المصاب من الأجسام المحيطة.",
        "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
        "بعد انتهاء النوبة، ضع المصاب على جانبه.",
        "اتصل بالإسعاف فوراً على 997 إذا لم يستعد وعيه."
    ],
    "انخفاض الضغط": [
        "اطلب من المصاب الاستلقاء ورفع الأرجل قليلاً.",
        "راقب التنفس والنبض.",
        "اتصل بالإسعاف فوراً على 997."
    ],
    "الاختناق": [
        "قف خلف الشخص المصاب وضع إحدى قدميك أمام الأخرى.",
        "لف ذراعيك حول خصر الشخص المصاب واضغط بقوة على البطن.",
        "كرر حتى يزول الجسم العالق.",
        "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي فوراً.",
        "اتصل بالإسعاف فوراً على 997."
    ]
};

// ================== التفاعل بين التبويبات ==================
function showTab(tabId, tabElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    tabElement.classList.add('active');

    // إيقاف أي صوت عند التنقل
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

// ================== إنشاء كروت الحالات ==================
function loadCases() {
    const container = document.getElementById('casesContainer');
    container.innerHTML = '';

    Object.keys(CASES).forEach(caseName => {
        let card = document.createElement('div');
        card.classList.add('case-card');

        let title = document.createElement('div');
        title.classList.add('case-title');
        title.textContent = caseName;
        card.appendChild(title);

        let stepsDiv = document.createElement('div');
        stepsDiv.classList.add('case-steps');
        CASES[caseName].forEach((step, idx) => {
            let p = document.createElement('div');
            p.classList.add('step');
            p.textContent = `${idx + 1}. ${step}`;
            stepsDiv.appendChild(p);
        });
        card.appendChild(stepsDiv);

        // زر الاتصال بالإسعاف
        let callBtn = document.createElement('button');
        callBtn.classList.add('call-btn');
        callBtn.textContent = 'الاتصال بالإسعاف 997';
        callBtn.onclick = () => {
            if (confirm('هل تريد الاتصال بالإسعاف على 997؟')) {
                window.location.href = 'tel:997';
            }
        };
        card.appendChild(callBtn);

        // النطق الصوتي عند النقر على الكارد
        card.onclick = () => {
            speakSteps(caseName);
        };

        container.appendChild(card);
    });
}

// ================== الاستجابة الصوتية ==================
function speakSteps(caseName) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // إيقاف أي كلام سابق

    let utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'ar-SA';
    utterance.text = `${caseName}. ${CASES[caseName].join('. ')}`;
    utterance.rate = 0.9; // ضبط سرعة الصوت
    window.speechSynthesis.speak(utterance);
}

// ================== زر الطوارئ ==================
document.getElementById('emergencyBtn').addEventListener('click', () => {
    let selectedCase = prompt("اذكر الحالة: الحروق، الصرع، انخفاض الضغط، الاختناق");
    if (selectedCase && CASES[selectedCase]) {
        speakSteps(selectedCase);
    } else {
        alert('الحالة غير موجودة!');
    }
});

// تحميل الحالات عند بدء الصفحة
loadCases();
