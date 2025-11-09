// ================= البيانات الأساسية للحالات ==================
const CASES = {
    "الحروق": [
        "تبريد الحرق بوضعه تحت ماء جاري لمدة 10-15 دقيقة.",
        "إزالة الإكسسوارات والملابس الضيقة.",
        "تغطية الحرق بضمادة نظيفة.",
        "عدم لمس الفقاعات أو وضع أي مراهم.",
        "الاتصال بالإسعاف فوراً على 997."
    ],
    "الصرع": [
        "لاحظ الوقت المستغرق في النوبة.",
        "احمِ المصاب من الأجسام المحيطة.",
        "ادعم رأس المصاب.",
        "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف.",
        "لا تضع شيء في فمه.",
        "بعد انتهاء النوبة، ضع المصاب على جانبه."
    ],
    "انخفاض الضغط": [
        "اجعل المصاب مستلقياً وارفع قدميه قليلاً.",
        "أعطه ماء إذا كان واعياً.",
        "راقب العلامات الحيوية.",
        "اتصل بالإسعاف عند الحاجة."
    ],
    "الاختناق": [
        "قف خلف الشخص المصاب وامسكه.",
        "اصنع قبضة واضغط على السرة عدة مرات.",
        "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي.",
        "اتصل بالإسعاف فوراً على 997."
    ]
};

// ================= التبويبات ==================
function showTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    event.currentTarget.classList.add('active');

    stopSpeech(); // إيقاف أي كلام صوتي عند تغيير التبويب
}

// ================= زر الطوارئ ==================
const emergencyBtn = document.getElementById('emergencyBtn');
emergencyBtn.addEventListener('click', () => {
    const caseName = prompt("أدخل اسم الحالة: الحروق، الصرع، انخفاض الضغط، الاختناق");
    if (CASES[caseName]) {
        speakSteps(caseName);
    } else {
        alert("الحالة غير موجودة.");
    }
});

// ================= استجابة صوتية ==================
let speech;
function speakSteps(caseName) {
    stopSpeech();
    const steps = CASES[caseName];
    speech = new SpeechSynthesisUtterance();
    speech.lang = "ar-SA";
    speech.text = `خطوات الإسعاف للحالة ${caseName}: ${steps.join('، ')}`;
    window.speechSynthesis.speak(speech);
}

function stopSpeech() {
    if (speech) {
        window.speechSynthesis.cancel();
    }
}

// ================= عرض كروت الحالات ==================
const casesContainer = document.getElementById('casesContainer');
for (let caseName in CASES) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `<h3>${caseName}</h3>`;
    
    const stepsDiv = document.createElement('div');
    CASES[caseName].forEach(step => {
        const stepEl = document.createElement('div');
        stepEl.className = 'step';
        stepEl.textContent = step;
        stepsDiv.appendChild(stepEl);
    });
    card.appendChild(stepsDiv);

    const callBtn = document.createElement('button');
    callBtn.textContent = 'الاتصال بالطوارئ';
    callBtn.addEventListener('click', () => {
        if (confirm("هل تريد الاتصال بالإسعاف على الرقم 997؟")) {
            window.location.href = "tel:997";
        }
    });
    card.appendChild(callBtn);

    card.addEventListener('click', () => speakSteps(caseName));
    casesContainer.appendChild(card);
}
