// ================== البيانات الأساسية للحالات ==================
const CASES = {
    "الحروق": [
        "حروق الدرجة الأولى (الخفيفة).",
        "تبريد الحرق بوضع المنطقة المصابة تحت ماء جاري لمدة 10-15 دقيقة.",
        "إزالة الإكسسوارات والملابس الضيقة قبل انتفاخ المنطقة.",
        "تغطية منطقة الحرق بضمادة رطبة أو قطعة قماش نظيفة.",
        "أخذ مسكن الألم إذا لزم الأمر.",
        "لا تحاول لمس الفقاعات.",
        "لا تضع أي مراهم أو معجون أسنان على الحرق.",
        "لا تستخدم الثلج مباشرة.",
        "اتصل بالإسعاف فوراً على 997."
    ],
    "الصرع": [
        "لاحظ الوقت المستغرق في النوبة.",
        "احمِ المصاب من الأجسام المحيطة.",
        "أبعد النظارات إن كان يرتديها.",
        "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
        "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
        "لا تقيّد حركات المصاب ولا تضع شيء في فمه.",
        "بعد انتهاء النوبة، ضع المصاب على جانبه.",
        "ابقَ معه حتى يستعيد وعيه.",
        "اتصل بالإسعاف فوراً على 997 إذا لم يستعد وعيه."
    ],
    "انخفاض الضغط": [
        "اطلب من المصاب الاستلقاء ورفع رجليه قليلاً.",
        "راقب التنفس والنبض.",
        "إذا شعر المصاب بالدوار، ساعده على البقاء مستلقياً.",
        "تقديم الماء إذا كان واعياً.",
        "اتصل بالإسعاف فوراً على 997 إذا استمرت الأعراض."
    ],
    "الاختناق": [
        "الوقوف خلف الشخص المصاب.",
        "ضع إحدى قدميك أمام الأخرى لتحقيق التوازن.",
        "لف ذراعيك حول خصر الشخص المصاب.",
        "أمل رأسه للأمام قليلاً.",
        "اصنع قبضة وضعها فوق السرة.",
        "اضغط بالقبضة الأخرى بقوة وسرعة نحو الأعلى.",
        "كرر من 6 إلى 10 مرات حتى يزول الجسم العالق.",
        "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي فوراً.",
        "اتصل بالإسعاف فوراً على 997."
    ]
};

// ================== متغيرات لتتبع الحالة الحالية ==================
let lastCaseName = null;
let lastSteps = [];

// ================== إيقاف الصوت فورًا ==================
function stopSpeech() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

// ================== عرض التبويب المطلوب ==================
function showTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    if(event) event.currentTarget.classList.add('active');

    stopSpeech(); // إيقاف الصوت عند التنقل
}

// ================== تحويل الخطوات إلى صوت ==================
function speakSteps(steps) {
    if (!('speechSynthesis' in window)) return;
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    utterance.text = steps.join('. ');
    window.speechSynthesis.speak(utterance);
}

// ================== إعادة تشغيل آخر حالة ==================
function playLast() {
    if(lastSteps.length > 0) speakSteps([lastCaseName, ...lastSteps]);
}

// ================== عرض خطوات الحالة عند النقر على كارد ==================
function showSteps(caseName) {
    lastCaseName = caseName;
    lastSteps = CASES[caseName];

    const stepsContainer = document.getElementById('stepsContainer');
    stepsContainer.innerHTML = `<h3>إجراءات الإسعافات الأولية: ${caseName}</h3>`;

    CASES[caseName].forEach((step, idx) => {
        const div = document.createElement('div');
        div.classList.add('step');
        div.textContent = `${idx + 1}. ${step}`;
        stepsContainer.appendChild(div);
    });

    // إضافة زر الاتصال بالإسعاف
    const callBtn = document.createElement('button');
    callBtn.classList.add('call-btn');
    callBtn.textContent = 'الاتصال بالإسعاف 997';
    callBtn.onclick = (e) => {
        e.stopPropagation();
        if(confirm('هل تريد الاتصال بالإسعاف على 997؟')) {
            window.location.href = 'tel:997';
        }
    };
    stepsContainer.appendChild(callBtn);

    // تشغيل الصوت تلقائياً عند عرض الخطوات
    speakSteps([caseName, ...CASES[caseName]]);
}

// ================== توليد كروت الحالات ==================
function renderCases() {
    const container = document.getElementById('casesContainer');
    container.innerHTML = '';

    Object.keys(CASES).forEach(caseName => {
        const card = document.createElement('div');
        card.classList.add('case-card');
        card.textContent = caseName;

        card.onclick = () => showSteps(caseName);

        container.appendChild(card);
    });
}

// ================== التعرف الصوتي ==================
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ar-SA';
recognition.interimResults = false;

recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript.trim();
    // التحقق إذا كان المستخدم ذكر اسم حالة
    Object.keys(CASES).forEach(caseName => {
        if(spoken.includes(caseName)) {
            showSteps(caseName);
        }
    });
};

// ================== زر الطوارئ ==================
const emergencyBtn = document.getElementById('emergencyBtn');
emergencyBtn.onclick = () => {
    const allSteps = [];
    Object.keys(CASES).forEach(caseName => {
        allSteps.push(caseName);
        allSteps.push(...CASES[caseName]);
    });
    speakSteps(allSteps);
};

// ================== تهيئة الصفحة ==================
document.addEventListener('DOMContentLoaded', () => {
    renderCases();
});
