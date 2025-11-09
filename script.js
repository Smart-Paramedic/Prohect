const tabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const emergencyBtn = document.getElementById('emergencyBtn');
let synth = window.speechSynthesis;
let currentUtterances = [];

const CASES = {
    "الحروق": [
        "تبريد الحرق بوضع المنطقة المصابة تحت ماء جاري 10-15 دقيقة.",
        "إزالة الإكسسوارات والملابس الضيقة.",
        "تغطية منطقة الحرق بضمادة نظيفة.",
        "اتصل بالإسعاف فوراً على 997."
    ],
    "الصرع": [
        "احمِ المصاب من الأجسام المحيطة.",
        "ادعم رأس المصاب بقطعة قماش.",
        "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
        "بعد انتهاء النوبة ضع المصاب على جانبه."
    ],
    "انخفاض الضغط": [
        "أعط المصاب شيئًا يحتوي على سكر سريع.",
        "راقب تنفسه ونبضه.",
        "إذا فقد وعيه لا تعطه شيئًا عن طريق الفم.",
        "اتصل بالإسعاف فوراً على 997."
    ],
    "الاختناق": [
        "الوقوف خلف الشخص المصاب.",
        "ضع إحدى قدميك أمام الأخرى لتحقيق التوازن.",
        "لف ذراعيك حول خصر الشخص المصاب واضغط بقوة نحو الأعلى.",
        "إذا فقد وعيه، ابدأ بالإنعاش فوراً.",
        "اتصل بالإسعاف فوراً على 997."
    ]
};

// عرض التبويب المطلوب وإيقاف الصوت
function showTab(tabId, event){
    stopSpeech();
    tabContents.forEach(tc => tc.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    tabs.forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// توليد كروت الحالات
function renderCases() {
    const container = document.getElementById('cases-container');
    container.innerHTML = '';
    for(let caseName in CASES){
        const card = document.createElement('div');
        card.classList.add('case-card');
        card.innerHTML = `<div class="case-title">${caseName}</div>`;
        CASES[caseName].forEach(step => {
            const p = document.createElement('div');
            p.classList.add('step');
            p.textContent = step;
            card.appendChild(p);
        });
        const callBtn = document.createElement('button');
        callBtn.textContent = "اتصال بالإسعاف 997";
        callBtn.classList.add('emergency-call-btn');
        callBtn.onclick = () => alert("تأكيد: سيتم الاتصال بالإسعاف على الرقم 997");
        card.appendChild(callBtn);

        card.onclick = () => speakSteps(CASES[caseName]);
        container.appendChild(card);
    }
}

// تحويل الخطوات إلى صوت
function speakSteps(steps){
    stopSpeech();
    steps.forEach(text => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        synth.speak(utterance);
        currentUtterances.push(utterance);
    });
}

// إيقاف الصوت فورًا
function stopSpeech(){
    synth.cancel();
    currentUtterances = [];
}

// زر الطوارئ
emergencyBtn.onclick = () => {
    let allSteps = [];
    for(let caseName in CASES){
        allSteps = allSteps.concat([caseName]).concat(CASES[caseName]);
    }
    speakSteps(allSteps);
}

// بدء التهيئة
document.addEventListener('DOMContentLoaded', () => {
    renderCases();
});
