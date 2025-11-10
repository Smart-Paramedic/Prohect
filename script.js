// 🩺 الحالات الطبية
const CASES = {
  "الحروق": [
    "تبريد الحرق تحت ماء جاري لمدة 10 إلى 15 دقيقة.",
    "إزالة الملابس الضيقة أو الإكسسوارات حول المنطقة.",
    "تغطية منطقة الحرق بضمادة نظيفة وطرية.",
    "عدم وضع مراهم أو زبدة أو الثلج مباشرة.",
    "اطلب المساعدة فورًا إذا كانت الحروق شديدة وتمتد لمساحات واسعة."
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
    "اضغط بقوة وسرعة نحو الأعلى 6-10 مرات حتى يزول الجسم العالق.",
    "إذا فقد الوعي، ابدأ بالإنعاش القلبي الرئوي فوراً."
  ]
};

// 🔗 عناصر DOM
const emergencyBtn = document.getElementById('emergencyBtn');
const casesContainer = document.getElementById('cases-container');
const registerForm = document.getElementById('registerForm');

// 🔊 إعدادات النطق
const synth = window.speechSynthesis || null;
let currentUtterance = null;

function speakSteps(steps) {
  stopSpeech();
  const text = steps.join('، ');
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'ar-SA';
  synth?.speak(currentUtterance);
}

function stopSpeech() {
  if (synth?.speaking || synth?.pending) synth.cancel();
  currentUtterance = null;
}

// 📋 عرض كل الحالات داخل تبويب "الحالات"
function renderCases(filtered = null) {
  casesContainer.innerHTML = '';
  const toShow = filtered ? { [filtered]: CASES[filtered] } : CASES;

  for (const [caseName, steps] of Object.entries(toShow)) {
    const card = document.createElement('article');
    card.className = 'case-card';
    card.innerHTML = `
      <h3>${caseName}</h3>
      <div class="subtitle">خطوات الإسعافات الأولية</div>
      <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
      <button class="call-btn">اتصال 997</button>
    `;
    card.querySelector('.call-btn').onclick = () => {
      stopSpeech();
      if (confirm(`هل تريد الاتصال بالإسعاف 997 للحالة: ${caseName}؟`)) {
        window.location.href = 'tel:997';
      }
    };
    casesContainer.appendChild(card);
  }
}

// 📋 عرض حالة واحدة عند التفاعل الصوتي
function renderFullCase(caseName, steps) {
  casesContainer.innerHTML = '';
  const card = document.createElement('article');
  card.className = 'case-card';
  card.innerHTML = `
    <h3>${caseName}</h3>
    <div class="subtitle">خطوات الإسعافات الأولية</div>
    <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
    <div class="card-controls">
      <button class="play-btn">إعادة التشغيل</button>
      <button class="stop-btn">إيقاف الصوت</button>
      <button class="back-btn">رجوع</button>
      <button class="call-btn">اتصال 997</button>
    </div>
  `;
  card.querySelector('.play-btn').onclick = () => speakSteps([caseName, ...steps]);
  card.querySelector('.stop-btn').onclick = () => stopSpeech();
  card.querySelector('.back-btn').onclick = () => showTab('home');
  card.querySelector('.call-btn').onclick = () => {
    stopSpeech();
    if (confirm(`هل تريد الاتصال بالإسعاف 997 للحالة: ${caseName}؟`)) {
      window.location.href = 'tel:997';
    }
  };
  casesContainer.appendChild(card);
}

// 🧭 التبويبات
function showTab(tabId, event = null) {
  stopSpeech();

  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  if (event?.currentTarget) event.currentTarget.classList.add('active');

  // عند فتح تبويب "الحالات" يدويًا، أعرض كل الحالات
  if (tabId === 'cases') {
    renderCases();
  }
}


// 🎙 التعرف الصوتي
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let recognition = null;

if (SpeechRec) {
  recognition = new SpeechRec();
  recognition.lang = 'ar-SA';
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onresult = e => {
    const spoken = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
    for (const caseName of Object.keys(CASES)) {
      if (spoken.includes(caseName.toLowerCase())) {
        showTab('cases');
        renderFullCase(caseName, CASES[caseName]);
        speakSteps([caseName, ...CASES[caseName]]);
        return;
      }
    }
  };

  recognition.onerror = err => {
    console.warn('Recognition error:', err);
  };
}

// 🎙 زر الطوارئ
emergencyBtn.onclick = e => {
  e.preventDefault();
  stopSpeech();
  try { recognition?.start(); } catch {}
};

// 📝 نموذج التسجيل
registerForm?.addEventListener('submit', e => {
  e.preventDefault();
  alert('تم استلام بيانات التسجيل (تجريبياً).');
  e.target.reset();
});

// 🚀 تهيئة الصفحة وتشغيل المايك تلقائيًا
document.addEventListener('DOMContentLoaded', () => {
  renderCases();
  try { recognition?.start(); } catch {}
  setInterval(() => {
    try { recognition?.start(); } catch {}
  }, 5000);
});


