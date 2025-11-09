// ================= البيانات الأساسية للحالات =================
const CASES = {
    "الحروق": [
        "تبريد الحرق تحت ماء جاري لمدة 10-15 دقيقة",
        "إزالة الملابس الضيقة",
        "تغطية الحرق بضمادة نظيفة",
        "عدم لمس الفقاعات أو وضع أي مراهم",
        "الاتصال بالإسعاف فوراً على 997"
    ],
    "الصرع": [
        "لاحظ الوقت المستغرق في النوبة",
        "احمِ المصاب من الأجسام المحيطة",
        "ادعم رأس المصاب",
        "لا تضع شيء في فمه",
        "بعد انتهاء النوبة ضع المصاب على جانبه",
        "اتصل بالإسعاف إذا استمرت النوبة أكثر من 5 دقائق"
    ],
    "انخفاض الضغط": [
        "إجلس أو استلقِ المصاب",
        "رفع القدمين قليلاً",
        "تقديم ماء أو مشروبات بسيطة إذا كان واعياً",
        "مراقبة التنفس والنبض",
        "الاتصال بالإسعاف فوراً على 997 إذا لم يتحسن"
    ],
    "الاختناق": [
        "الوقوف خلف المصاب",
        "لف الذراعين حول خصر المصاب",
        "اصنع قبضة وضعها فوق السرة",
        "اضغط بقوة نحو الأعلى 6-10 مرات",
        "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي",
        "الاتصال بالإسعاف فوراً على 997"
    ]
};

// ================= التبويبات =================
function showTab(tabId, event) {
    stopSpeech();
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    if(event) event.currentTarget.classList.add('active');
}

// ================= توليد كروت الحالات =================
function renderCases(filteredCase = null) {
    const container = document.getElementById('cases-container');
    container.innerHTML = '';
    const casesToShow = filteredCase ? {[filteredCase]: CASES[filteredCase]} : CASES;

    for (let caseName in casesToShow) {
        const card = document.createElement('div');
        card.classList.add('case-card');

        let html = `<h3>${caseName}</h3><p class="step-title">خطوات الإسعافات الأولية:</p><ul>`;
        casesToShow[caseName].forEach(step => html += `<li>${step}</li>`);
        html += `</ul>
        <div>
            <button onclick="speakSteps([caseName].concat(CASES['${caseName}']))">▶ إعادة التشغيل</button>
            <button onclick="stopSpeech()">⏹ إيقاف</button>
            <button onclick="renderCases()">⏪ الرجوع</button>
            <button onclick="callEmergency('${caseName}')">📞 الاتصال بالإسعاف 997</button>
        </div>`;

        card.innerHTML = html;
        container.appendChild(card);
    }
}

// ================= تحويل الخطوات إلى صوت =================
let synth = window.speechSynthesis;
let currentUtterance;
let lastSpokenSteps = [];

function speakSteps(steps) {
    stopSpeech();
    lastSpokenSteps = steps;
    const text = steps.join('. ');
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'ar-SA';
    synth.speak(currentUtterance);
}

// ================= إيقاف الصوت =================
function stopSpeech() {
    if (synth.speaking) synth.cancel();
}

// ================= إعادة الصوت =================
function repeatSpeech() {
    if (lastSpokenSteps.length > 0) speakSteps(lastSpokenSteps);
}

// ================= الاتصال بالطوارئ =================
function callEmergency(caseName) {
    stopSpeech();
    if (confirm(`هل تريد الاتصال بالإسعاف 997 للحالة: ${caseName}؟`)) {
        window.location.href = 'tel:997';
    }
}

// ================= التعرف الصوتي =================
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ar-SA';
recognition.continuous = false;

recognition.onresult = function(event) {
    const spoken = event.results[0][0].transcript.trim();
    for (let caseName in CASES) {
        if (spoken.includes(caseName)) {
            showTab('cases', {currentTarget: document.querySelector('.nav-tab:nth-child(2)')});
            renderCases(caseName);
            speakSteps([caseName].concat(CASES[caseName]));
            break;
        }
    }
};

function startListening() {
    recognition.start();
}

// ================= زر الطوارئ =================
document.getElementById('emergencyBtn').onclick = startListening;

// ================= بدء تحميل الكروت =================
renderCases();
