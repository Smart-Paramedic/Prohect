// ================= بيانات الحالات =================
const CASES = {
    "الحروق": [
        "تبريد الحرق تحت ماء جاري 10-15 دقيقة",
        "إزالة الإكسسوارات والملابس الضيقة",
        "تغطية الحرق بضمادة نظيفة",
        "لا تضع معجون أسنان أو ثلج مباشرة",
        "اتصل بالإسعاف فوراً على 997"
    ],
    "الصرع": [
        "حماية المصاب من الاصطدام",
        "دعم الرأس بقطعة قماش",
        "لا تقيد حركاته أو تضع شيء في فمه",
        "بعد انتهاء النوبة ضع المصاب على جانبه",
        "اتصل بالإسعاف فوراً إذا استمرت النوبة أكثر من 5 دقائق"
    ],
    "انخفاض الضغط": [
        "إراحة المصاب واستلقائه",
        "رفع القدمين قليلاً",
        "تقديم ماء أو عصير إذا كان واعياً",
        "مراقبة التنفس والنبض",
        "اتصل بالإسعاف فوراً إذا فقد وعيه"
    ],
    "الاختناق": [
        "الوقوف خلف الشخص",
        "لف الذراعين حول الخصر",
        "الضغط بالقبضة فوق السرة نحو الأعلى 6-10 مرات",
        "إذا فقد الوعي ابدأ بالإنعاش القلبي الرئوي",
        "اتصل بالإسعاف فوراً على 997"
    ]
};

let synth = window.speechSynthesis;
let currentUtterance = null;

// ================= عرض التبويبات =================
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    event.currentTarget.classList.add('active');

    stopSpeech(); // إيقاف الصوت عند التبديل
}

// ================= إنشاء كروت الحالات =================
function loadCases() {
    const container = document.getElementById('casesContainer');
    container.innerHTML = '';
    for (const [caseName, steps] of Object.entries(CASES)) {
        const card = document.createElement('div');
        card.classList.add('case-card');

        let html = `<h3>${caseName}</h3>`;
        html += '<div class="steps-list">';
        steps.forEach((s, idx) => html += `<div class="step"><span class="step-type">خطوة ${idx+1}</span> ${s}</div>`);
        html += '</div>';
        html += `<button class="contact-btn" onclick="callEmergency('${caseName}')">اتصل بالإسعاف 997</button>`;

        card.innerHTML = html;
        card.addEventListener('click', () => speakCase(caseName));
        container.appendChild(card);
    }
}

// ================= الاستجابة الصوتية =================
function speakCase(caseName) {
    stopSpeech();
    const steps = CASES[caseName];
    const text = `إجراءات الإسعافات الأولية لحالة ${caseName}: ${steps.join('، ')}`;
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'ar-SA';
    synth.speak(currentUtterance);
}

function stopSpeech() {
    if (synth.speaking) synth.cancel();
}

// ================= زر الاتصال بالإسعاف =================
function callEmergency(caseName) {
    stopSpeech();
    if (confirm(`هل تريد الاتصال بالإسعاف 997 لحالة ${caseName}؟`)) {
        window.location.href = 'tel:997';
    }
}

// ================= زر الطوارئ =================
document.getElementById('emergencyBtn').addEventListener('click', () => {
    speakAllCases();
});

function speakAllCases() {
    stopSpeech();
    const text = Object.entries(CASES).map(([name, steps]) => `حالة ${name}: ${steps.join('، ')}`).join('، ');
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'ar-SA';
    synth.speak(currentUtterance);
}

// ================= تحميل الكروت عند فتح الصفحة =================
window.onload = loadCases;
