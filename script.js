// 🩺 الحالات
const CASES = {
  "الحروق": [
    "تبريد الحرق تحت ماء جاري لمدة 10 إلى 15 دقيقة.",
    "إزالة الملابس الضيقة أو الإكسسوارات حول المنطقة.",
    "تغطية الحرق بضمادة نظيفة وطرية.",
    "عدم وضع مراهم أو زبدة أو الثلج مباشرة.",
    "الاتصال بالإسعاف فوراً على 997 إذا كانت المساحة واسعة."
  ],
  "الصرع": [
    "لاحظ وقت النوبة واحمِ المصاب من الأجسام الحادة.",
    "ادعم رأس المصاب بقطعة ناعمة لتقليل الإصابات.",
    "لا تضع أي شيء في فم المصاب.",
    "بعد انتهاء النوبة ضع المصاب على جانبه بحذر."
  ],
  "انخفاض الضغط": [
    "اجعل المصاب يجلس أو يستلقي في وضع مريح.",
    "رفع القدمين قليلاً لتحسين تدفق الدم.",
    "إعطاء ماء إذا كان المصاب واعياً.",
    "الاتصال بالإسعاف إذا لم يحدث تحسّن."
  ],
  "الاختناق": [
    "قف خلف المصاب ووضع إحدى قدميك أمام الأخرى للتوازن.",
    "لف ذراعيك حول خصر المصاب واصنع قبضة فوق السرة.",
    "اضغط بقوة وسرعة نحو الأعلى حتى يزول الجسم العالق.",
    "إذا فقد الوعي، ابدأ بالإنعاش القلبي الرئوي فوراً."
  ]
};

// 🎙 تعريف الصوت
const synth = window.speechSynthesis;
let recognition = null;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.continuous = false;
}

// 🎧 البدء بالاستماع
function startListening() {
  recognition?.start();
}

// 🗣 النطق
function speakSteps(steps) {
  const utterance = new SpeechSynthesisUtterance(steps.join('، '));
  utterance.lang = 'ar-SA';
  synth.speak(utterance);
}

// 🧭 التبويبات
function showTab(id, e) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  if (e) e.currentTarget.classList.add('active');
  if (id === 'cases') renderCases();
}

// 📋 عرض الحالات
function renderCases(filter = null) {
  const container = document.getElementById('cases-container');
  container.innerHTML = '';
  const shown = filter ? { [filter]: CASES[filter] } : CASES;
  for (const [name, steps] of Object.entries(shown)) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `
      <h3>${name}</h3>
      <div class="subtitle">خطوات الإسعافات الأولية</div>
      <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
      <div class="card-controls">
        <button onclick="speakSteps(['${name}', ...CASES['${name}']])">إعادة</button>
        <button onclick="synth.cancel()">إيقاف</button>
        <button onclick="renderCases()">رجوع</button>
        <button onclick="callEmergency('${name}')">اتصال 997</button>
      </div>`;
    container.appendChild(card);
  }
}

// ☎️ الاتصال بالإسعاف
function callEmergency(name) {
  if (confirm(`هل تريد الاتصال بالإسعاف 997 للحالة: ${name}؟`)) {
    window.location.href = 'tel:997';
  }
}

// ✅ التسجيل (يحفظ محليًا)
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  localStorage.setItem('registration', JSON.stringify(data));
  document.getElementById('successMessage').hidden = false;
  e.target.reset();
});

// 🎙 التعرف الصوتي عند النطق بالحالة
if (recognition) {
  recognition.onresult = event => {
    const spoken = event.results[0][0].transcript.trim();
    for (const caseName of Object.keys(CASES)) {
      if (spoken.includes(caseName)) {
        showTab('cases');
        renderCases(caseName);
        speakSteps([caseName, ...CASES[caseName]]);
        return;
      }
    }
  };
}

// 🚀 تشغيل تلقائي عند الدخول
window.onload = () => {
  renderCases();
  startListening();
};

document.getElementById('emergencyBtn').onclick = startListening;
