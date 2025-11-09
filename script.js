// ========== بيانات الحالات ==========
const CASES = {
  "الحروق": [
    "تبريد الحرق تحت ماء جاري لمدة 10 إلى 15 دقيقة.",
    "إزالة الملابس الضيقة أو الإكسسوارات حول المنطقة.",
    "تغطية منطقة الحرق بضمادة نظيفة وطرية.",
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
    "اضغط بقوة وسرعة نحو الأعلى 6-10 مرات حتى يزول الجسم العالق.",
    "إذا فقد الوعي، ابدأ بالإنعاش القلبي الرئوي فوراً."
  ]
};

// ========== عناصر DOM ==========
const emergencyBtn = document.getElementById('emergencyBtn');
const casesContainer = document.getElementById('cases-container');
const registerForm = document.getElementById('registerForm');

// ========== تكوين النطق ==========
const synth = window.speechSynthesis || null;
let lastSpokenSteps = [];
let currentUtterance = null;

function speakSteps(steps) {
  stopSpeech();
  lastSpokenSteps = steps;
  if (!synth) return;
  const text = steps.join('، ');
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'ar-SA';
  synth.speak(currentUtterance);
}
function stopSpeech() {
  if (!synth) return;
  if (synth.speaking || synth.pending) synth.cancel();
  currentUtterance = null;
}
function repeatSpeech() {
  if (lastSpokenSteps && lastSpokenSteps.length) speakSteps(lastSpokenSteps);
}

// ========== عرض الكروت (عرض كل الحالات أو حالة واحدة) ==========
function renderCases(filtered = null) {
  casesContainer.innerHTML = '';
  const toShow = filtered ? { [filtered]: CASES[filtered] } : CASES;
  for (const caseName of Object.keys(toShow)) {
    const steps = toShow[caseName];
    const card = document.createElement('article');
    card.className = 'case-card';
    card.innerHTML = `
      <h3>${caseName}</h3>
      <div class="subtitle">خطوات الإسعافات الأولية</div>
      <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
      <div class="card-controls" role="group" aria-label="أزرار التحكم">
        <button class="play-btn" type="button">إعادة التشغيل</button>
        <button class="stop-btn" type="button">إيقاف الصوت</button>
        <button class="back-btn" type="button">رجوع</button>
        <button class="call-btn" type="button">اتصال 997</button>
      </div>
    `;
    // ربط الأزرار
    const playBtn = card.querySelector('.play-btn');
    const stopBtn = card.querySelector('.stop-btn');
    const backBtn = card.querySelector('.back-btn');
    const callBtn = card.querySelector('.call-btn');

    playBtn.addEventListener('click', (ev) => { ev.stopPropagation(); speakSteps([caseName].concat(steps)); });
    stopBtn.addEventListener('click', (ev) => { ev.stopPropagation(); stopSpeech(); });
    backBtn.addEventListener('click', (ev) => { ev.stopPropagation(); renderCases(); });
    callBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      stopSpeech();
      if (confirm(`هل تريد الاتصال بالإسعاف 997 للحالة: ${caseName}؟`)) {
        window.location.href = 'tel:997';
      }
    });

    // لا نقرأ عند النقر على الكارد: القراءة مسموحة فقط عند التعرف الصوتي
    casesContainer.appendChild(card);
  }
}

// ========== التبويبات ==========
function showTab(tabId, event) {
  stopSpeech();
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  const el = document.getElementById(tabId);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

// ========== التعرف الصوتي ==========
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let recognition = null;
if (SpeechRec) {
  recognition = new SpeechRec();
  recognition.lang = 'ar-SA';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (e) => {
    const spoken = e.results[0][0].transcript.trim();
    const low = spoken.toLowerCase();
    // نبحث عن أي اسم حالة ظاهر في النص
    for (const caseName of Object.keys(CASES)) {
      if (low.includes(caseName.toLowerCase())) {
        showTab('cases');
        renderCases(caseName);
        speakSteps([caseName].concat(CASES[caseName]));
        return;
      }
    }
    alert('لم أتعرف على اسم حالة مناسب. كرر اسم الحالة مثل: الحروق أو الصرع.');
  };

  recognition.onstart = () => { /* متصفح طلب إذن مايك ثم بدأ الاستماع - لا نعرض مؤشر هنا */ };
  recognition.onend = () => { /* انتهى الاستماع */ };
  recognition.onerror = (err) => { console.warn('Recognition error', err); alert('حدث خطأ في التعرف الصوتي.'); };
}

// زر الطوارئ يبدأ الاستماع (مطلوب إذن مايك من المتصفح)
emergencyBtn.addEventListener('click', (e) => {
  e.preventDefault();
  stopSpeech();
  if (!recognition) {
    alert('متصفحك لا يدعم التعرف على الصوت (Web Speech API). استخدم Chrome أو Edge.');
    return;
  }
  try {
    recognition.start();
  } catch (err) {
    // بعض المتصفحات تمنع إعادة start إذا كان يعمل - نتعامل بهدوء
    console.warn('recognition.start() error', err);
  }
});

// ========== نموذج التسجيل (تجريبي) ==========
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('تم استلام بيانات التسجيل (تجريبياً).');
    e.target.reset();
  });
}

// ========== تهيئة أولية ==========
renderCases();
