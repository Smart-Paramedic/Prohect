// ================== البيانات الأساسية للحالات ==================
const CASES = {
    "الحروق": [
        {type:'إسعافي', title:'تبريد الحرق', desc:'ضع المنطقة المصابة تحت ماء جاري معتدل 10-15 دقيقة.'},
        {type:'إسعافي', title:'إزالة الإكسسوارات', desc:'أزل الملابس الضيقة قبل انتفاخ المنطقة.'},
        {type:'إسعافي', title:'تغطية الحرق', desc:'ضع ضمادة رطبة أو قطعة قماش نظيفة.'},
        {type:'اتصال', title:'اتصل بالإسعاف', desc:'اتصل بالإسعاف فوراً على 997.', number:'997'}
    ],
    "الصرع": [
        {type:'إسعافي', title:'حماية المصاب', desc:'احمِ المصاب من الأجسام المحيطة وادعم رأسه.'},
        {type:'إسعافي', title:'مراقبة النوبة', desc:'إذا استمرت أكثر من 5 دقائق، اتصل بالإسعاف فوراً.'},
        {type:'إسعافي', title:'بعد النوبة', desc:'ضع المصاب على جانبه وابقَ معه حتى يستعيد وعيه.'},
        {type:'اتصال', title:'اتصل بالإسعاف', desc:'اتصل بالإسعاف فوراً على 997.', number:'997'}
    ],
    "انخفاض الضغط": [
        {type:'إسعافي', title:'إعطاء سكر سريع', desc:'أعط المصاب عصير أو حلوى.'},
        {type:'إسعافي', title:'مراقبة المصاب', desc:'راقب تنفسه ونبضه.'},
        {type:'اتصال', title:'اتصل بالإسعاف', desc:'اتصل بالإسعاف فوراً على 997.', number:'997'}
    ],
    "الاختناق": [
        {type:'إسعافي', title:'الوقوف خلف المصاب', desc:'ضع إحدى قدميك أمام الأخرى لتحقيق التوازن.'},
        {type:'إسعافي', title:'الضغط على البطن', desc:'اصنع قبضة واضغط فوق السرة عدة مرات.'},
        {type:'إسعافي', title:'إذا فقد وعيه', desc:'ابدأ بالإنعاش القلبي الرئوي فوراً.'},
        {type:'اتصال', title:'اتصل بالإسعاف', desc:'اتصل بالإسعاف فوراً على 997.', number:'997'}
    ]
};

// ======== متغير للتحكم في القراءة الصوتية ========
let speechSynthesisUtterance = null;

// ======== إنشاء كروت الحالات ========
const casesContainer = document.getElementById('cases-container');
for (let caseName in CASES) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `<h3>${caseName}</h3>`;
    card.onclick = () => showCaseSteps(caseName);
    casesContainer.appendChild(card);
}

// ======== عرض خطوات الحالة ========
function showCaseSteps(caseName) {
    stopSpeech();
    const stepsContainer = document.getElementById('case-steps');
    const stepsList = document.getElementById('steps-list');
    const title = document.getElementById('case-title');

    title.textContent = `خطوات الإسعاف: ${caseName}`;
    stepsList.innerHTML = '';

    CASES[caseName].forEach(step => {
        const div = document.createElement('div');
        div.className = 'step ' + (step.type === 'تمهيدي' ? 'step-preliminary' : step.type === 'إسعافي' ? 'step-emergency' : 'step-contact');
        div.innerHTML = `<span class="step-type ${step.type === 'تمهيدي' ? 'type-preliminary' : step.type === 'إسعافي' ? 'type-emergency' : 'type-contact'}">${step.type}</span>
        <div class="step-title">${step.title}</div>
        <p>${step.desc}</p>`;
        if(step.number){
            const btn = document.createElement('button');
            btn.className = 'emergency-btn';
            btn.textContent = `📞 الاتصال بالطوارئ (${step.number})`;
            btn.onclick = () => { alert(`تأكيد الاتصال بالطوارئ: ${step.number}`); }
            div.appendChild(btn);
        }
        stepsList.appendChild(div);
    });

    stepsContainer.style.display = 'block';
    stepsContainer.scrollIntoView({behavior:'smooth'});

    // تشغيل الصوت
    speak(`خطوات الإسعاف: ${caseName}. ` + CASES[caseName].map(s => s.title + '. ' + s.desc).join(' '));
}

// ======== دوال النطق الصوتي ========
function speak(text){
    stopSpeech();
    speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.lang = 'ar-SA';
    window.speechSynthesis.speak(speechSynthesisUtterance);
}

function stopSpeech(){
    if(speechSynthesisUtterance){
        window.speechSynthesis.cancel();
        speechSynthesisUtterance = null;
    }
}

// ======== التنقل بين التبويبات ========
function showTab(tabId, element){
    stopSpeech();
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}
