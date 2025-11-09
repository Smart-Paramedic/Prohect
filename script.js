let currentUtterance = null;

const CASES = {
    "حروق": [
        "تبريد الحرق لمدة 10-15 دقيقة تحت ماء معتدل.",
        "إزالة الإكسسوارات والملابس الضيقة.",
        "تغطية منطقة الحرق بقطعة قماش نظيفة.",
        "اتصل بالإسعاف فوراً على 997."
    ],
    "صرع": [
        "احمِ المصاب من الأجسام المحيطة.",
        "ادعم رأس المصاب بقطعة قماش.",
        "إذا استمرت النوبة أكثر من 5 دقائق، اطلب الإسعاف فوراً.",
        "بعد انتهاء النوبة ضع المصاب على جانبه."
    ],
    "انخفاض الضغط": [
        "أجلس المصاب أو استلقِ برفع رجليه.",
        "أعطِ المصاب ماء أو عصير إذا كان واعياً.",
        "راقب التنفس والنبض.",
        "اتصل بالإسعاف فوراً على 997 إذا استدعى الأمر."
    ],
    "اختناق": [
        "قف خلف الشخص المصاب.",
        "ضع ذراعيك حول خصره.",
        "اضغط بقوة نحو الأعلى عدة مرات حتى يزول الجسم العالق.",
        "إذا فقد وعيه، ابدأ بالإنعاش القلبي الرئوي فوراً."
    ]
};

function showTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    stopSpeech();
}

function showCaseSteps(caseName) {
    stopSpeech();
    const container = document.getElementById(`steps-${caseName}`);
    container.innerHTML = "";
    CASES[caseName].forEach((step, index) => {
        container.innerHTML += `<p>${index+1}. ${step}</p>`;
    });
    speakText(CASES[caseName].join(". "));
}

function speakText(text) {
    stopSpeech();
    currentUtterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
    if(currentUtterance) {
        window.speechSynthesis.cancel();
        currentUtterance = null;
    }
}

document.getElementById('emergencyBtn').addEventListener('click', function() {
    const allSteps = Object.values(CASES).flat().join(". ");
    speakText(allSteps);
});

function callEmergency(event, number){
    event.stopPropagation();
    if(confirm(`هل تريد الاتصال بالطوارئ على الرقم ${number}؟`)){
        window.location.href = `tel:${number}`;
    }
}
