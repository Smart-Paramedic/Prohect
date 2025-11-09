// ================== البيانات الأساسية للحالات ==================
const CASES = {
    "الحروق": [
        "تبريد المنطقة المصابة تحت ماء جاري 10-15 دقيقة.",
        "إزالة الإكسسوارات والملابس الضيقة.",
        "تغطية منطقة الحرق بضمادة نظيفة.",
        "لا تلمس الفقاعات ولا تضع مراهم أو معجون أسنان.",
        "اتصل بالإسعاف فوراً على 997."
    ],
    "الصرع": [
        "لاحظ الوقت المستغرق في النوبة.",
        "احمِ المصاب من الأجسام المحيطة.",
        "ادعم رأس المصاب بقطعة قماش أو جاكيت.",
        "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
        "بعد انتهاء النوبة، ضع المصاب على جانبه."
    ],
    "انخفاض الضغط": [
        "اجعل المصاب مستلقياً وارفع ساقيه.",
        "راقب العلامات الحيوية والتنفس.",
        "أعطه ماء إذا كان واعياً.",
        "اتصل بالإسعاف إذا لم يتحسن."
    ],
    "الاختناق": [
        "الوقوف خلف الشخص المصاب.",
        "لف ذراعيك حول خصره.",
        "اضغط بسرعة نحو الأعلى.",
        "كرر من 6 إلى 10 مرات حتى يزول الجسم العالق.",
        "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي فوراً."
    ]
};

// ================== التبويبات ==================
function showTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    event.currentTarget.classList.add('active');

    stopSpeech();
}

// ================== عرض كروت الحالات ==================
const casesContainer = document.getElementById('cases-container');
for (let caseName in CASES) {
    const card = document.createElement('div');
    card.classList.add('case-card');
    card.innerHTML = `<h3>${caseName}</h3>
                      <div class="steps-container" style="display:none;"></div>
                      <button class="emergency-btn" onclick="callEmergency('${caseName}')">الاتصال بالطوارئ</button>`;
    card.addEventListener('click', () => {
        const stepsDiv = card.querySelector('.steps-container');
        if (stepsDiv.style.display === 'none') {
            stopSpeech();
            stepsDiv.innerHTML = CASES[caseName].map(step => `<p>${step}</p>`).join('');
            stepsDiv.style.display = 'block';
            speakSteps(CASES[caseName]);
        } else {
            stopSpeech();
            stepsDiv.style.display = 'none';
        }
    });
    casesContainer.appendChild(card);
}

// ================== الاتصال بالطوارئ ==================
function callEmergency(caseName) {
    if (confirm(`هل تريد الاتصال بالطوارئ لحالة ${caseName}؟`)) {
        window.location.href = "tel:997";
    }
}

// ================== استجابة صوتية ==================
let speech;
function speakSteps(steps) {
    if ('speechSynthesis' in window) {
        speech = new SpeechSynthesisUtterance(steps.join('، '));
        speech.lang = 'ar-SA';
        window.speechSynthesis.speak(speech);
    }
}

function stopSpeech() {
    if (speech) window.speechSynthesis.cancel();
}

// ================== زر الطوارئ في الرئيسية ==================
document.getElementById('emergencyBtn').addEventListener('click', () => {
    const caseName = prompt("اذكر حالة الطوارئ (الحروق، الصرع، انخفاض الضغط، الاختناق):");
    if (CASES[caseName]) {
        stopSpeech();
        speakSteps(CASES[caseName]);
        alert("عرضت خطوات الحالة: " + caseName);
    } else {
        alert("الحالة غير موجودة.");
    }
});
