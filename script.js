// ================== البيانات الأساسية للحالات ==================
const CASES = {
    "الحروق": [
        {type:"تمهيدي", title:"حروق الدرجة الأولى", desc:"تبريد المنطقة المصابة بماء جاري لمدة 10-15 دقيقة."},
        {type:"إسعافي", title:"إزالة الإكسسوارات", desc:"قم بإزالة الملابس الضيقة والوشاح."},
        {type:"إسعافي", title:"تغطية الحرق", desc:"ضع ضمادة نظيفة على المنطقة."},
        {type:"اتصال", title:"طلب الإسعاف", desc:"اتصل بالإسعاف فورًا على 997"}
    ],
    "الصرع": [
        {type:"تمهيدي", title:"احمِ المصاب", desc:"قم بحماية رأسه من الاصطدام."},
        {type:"إسعافي", title:"وضع جانبي", desc:"ضع المصاب على جانبه بعد انتهاء النوبة."},
        {type:"اتصال", title:"طلب الإسعاف", desc:"إذا استمرت النوبة أكثر من 5 دقائق اتصل على 997"}
    ],
    "انخفاض الضغط": [
        {type:"تمهيدي", title:"ضع المصاب مستلقيًا", desc:"رفع الأرجل قليلاً لزيادة تدفق الدم."},
        {type:"إسعافي", title:"تجنب الوقوف المفاجئ", desc:"ساعده على الجلوس ببطء إذا استيقظ."},
        {type:"اتصال", title:"طلب الإسعاف", desc:"اتصل بالإسعاف إذا لم تتحسن حالته."}
    ],
    "الاختناق": [
        {type:"تمهيدي", title:"تقييم الوضع", desc:"تأكد أن الشخص يقف بشكل مستقر."},
        {type:"إسعافي", title:"الضغط على السرة", desc:"اضغط بقوة نحو الأعلى لتفريغ الجسم العالق."},
        {type:"اتصال", title:"طلب الإسعاف", desc:"إذا فقد وعيه، ابدأ الإنعاش واتصل بالاسعاف 997."}
    ]
};

let synth = window.speechSynthesis;
let currentUtterance = null;

// عرض الحالات
const casesContainer = document.getElementById('cases');
function displayCases() {
    casesContainer.innerHTML = '';
    for(let caseName in CASES) {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.innerHTML = `<h3>${caseName}</h3>`;
        
        CASES[caseName].forEach(step=>{
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step';
            stepDiv.innerHTML = `<div class="step-title">${step.title}</div><p>${step.desc}</p>`;
            card.appendChild(stepDiv);
        });

        const callBtn = document.createElement('button');
        callBtn.className = 'emergency-call-btn';
        callBtn.textContent = 'الاتصال بالطوارئ';
        callBtn.onclick = () => {
            alert(`تأكيد الاتصال بالطوارئ للحالة: ${caseName}`);
        };
        card.appendChild(callBtn);

        card.onclick = () => speakCase(caseName);
        casesContainer.appendChild(card);
    }
}
displayCases();

// استجابة صوتية
function speakCase(caseName) {
    if(currentUtterance) synth.cancel();
    const steps = CASES[caseName];
    let text = `خطوات الحالة: ${caseName}. `;
    steps.forEach(s => { text += `${s.title}: ${s.desc}. `; });

    currentUtterance = new SpeechSynthesisUtterance(text);
    synth.speak(currentUtterance);
}

// زر الطوارئ
document.getElementById('emergencyBtn').addEventListener('click', () => {
    if(currentUtterance) synth.cancel();
    alert('اضغط على كارد الحالة أو انطق اسمها لتشغيل خطوات الإسعاف.');
});

// تبويبات
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tc=>tc.classList.remove('active'));
        document.getElementById(tab.dataset.tab).classList.add('active');
        if(currentUtterance) synth.cancel();
    });
});
