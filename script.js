// === بيانات الحالات ===
const CASES = {
  "الحروق": [
    "حروق الدرجة الأولى (الخفيفة):",
    "تبريد الحرق بماء جاري معتدل لمدة 10-15 دقيقة.",
    "إزالة الإكسسوارات والملابس الضيقة قبل الانتفاخ.",
    "تغطية منطقة الحرق بضمادة رطبة أو قطعة قماش نظيفة.",
    "لا تلمس الفقاعات أو تضع مراهم أو ثلج مباشرة.",
    "اتصل بالإسعاف فوراً على 997."
  ],
  "الصرع": [
    "لاحظ وقت نوبة الصرع وسجل الوقت.",
    "احمِ المصاب من الأجسام القريبة التي قد تصيبه.",
    "ادعم رأس المصاب بقطعة قماش أو وسادة لئلا يصطدم.",
    "لا تضع شيئًا في فم المصاب.",
    "بعد انتهاء النوبة ضع المصاب على جانبه وراقب تنفسه.",
    "اتصل بالإسعاف فوراً على 997 إذا استمرت النوبة أو بعد فقدان الوعي."
  ],
  "انخفاض الضغط": [
    "مدد المصاب على ظهره وارفع قدميه قليلاً.",
    "افتح ملابسه الضيقة وطمئن المصاب.",
    "قدم سوائل إن كان واعيًا ويمكنه البلع.",
    "راقب العلامات الحيوية واطلب المساعدة إذا لم يتحسن.",
    "اتصل بالإسعاف فوراً على 997 إذا تدهورت الحالة."
  ],
  "الاختناق": [
    "قف خلف الشخص وضع إحدى قدميك أمام الأخرى لتحقيق التوازن.",
    "لف ذراعيك حول خصر المصاب وضع قبضتك فوق السرة.",
    "اضغط بقوة وسرعة باتجاه أعلى البطن (مناورة هيمليك) 6-10 مرات.",
    "إذا فقد المصاب وعيه ابدأ الإنعاش القلبي الرئوي واطلب الإسعاف.",
    "اتصل بالإسعاف فوراً على 997."
  ]
};

// === عناصر DOM ===
const casesList = document.getElementById('casesList');
const emergencyBtn = document.getElementById('emergencyBtn');
const hint = document.getElementById('hint');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');

let synth = window.speechSynthesis;
let lastSpoken = [];
let recognition = null;

// === تهيئة التبويبات ===
function showTabById(id){
  tabs.forEach(t => t.classList.remove('active'));
  const target = document.getElementById(id);
  if(target) target.classList.add('active');
  // عند الانتقال لغلق أي قراءة أو كارد
  stopSpeech();
}
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if(target) showTabById(target);
  });
});

// === عرض الكروت ===
function renderCases(){
  casesList.innerHTML = '';
  Object.keys(CASES).forEach(caseName => {
    const card = document.createElement('div');
    card.className = 'card';
    const ul = document.createElement('ul');
    CASES[caseName].forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      ul.appendChild(li);
    });

    // أزرار أسفل الكارد: إعادة استماع / إيقاف / اتصال
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const replayBtn = document.createElement('button');
    replayBtn.textContent = 'إعادة الاستماع';
    replayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      speakSteps(CASES[caseName], caseName);
    });

    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'إيقاف';
    stopBtn.addEventListener('click', (e) => { e.stopPropagation(); stopSpeech(); });

    const callBtn = document.createElement('button');
    callBtn.textContent = '📞 الاتصال بالطوارئ';
    callBtn.className = 'call';
    callBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if(confirm('هل تريد الاتصال بالإسعاف الآن؟')) {
        // تنفيذ اتصال (في الهاتف) أو مجرد توجيه
        window.location.href = 'tel:997';
      }
    });

    actions.appendChild(replayBtn);
    actions.appendChild(stopBtn);
    actions.appendChild(callBtn);

    // عند النقر على الكارد نعطي خيار عرض/قراءة سريعة
    card.addEventListener('click', () => {
      speakSteps(CASES[caseName], caseName);
      // ننتقل لتبويب الحالات لكي تكون مرئية
      showTabById('cases');
    });

    card.innerHTML = `<h3>${caseName}</h3>`;
    card.appendChild(ul);
    card.appendChild(actions);
    casesList.appendChild(card);
  });
}
renderCases();

// === النطق ===
function speakSteps(steps, title){
  stopSpeech();
  lastSpoken = steps.slice();
  if(!('speechSynthesis' in window)) return alert('جهازك لا يدعم النطق الصوتي');
  const text = `خطوات الإسعاف في حالة ${title}: ` + steps.join('، ');
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-SA';
  synth.speak(u);
}

function stopSpeech(){
  if(synth && synth.speaking) synth.cancel();
}

// === التعرف الصوتي ===
function initRecognition(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR) return null;
  const r = new SR();
  r.lang = 'ar-SA';
  r.continuous = false;
  r.interimResults = false;

  r.onresult = (ev) => {
    const text = ev.results[0][0].transcript.trim();
    hint.textContent = `تم التعرف: ${text}`;
    handleVoice(text);
  };
  r.onerror = (err) => {
    console.warn('Recognition error', err);
  };
  return r;
}

function handleVoice(text){
  const low = text.toLowerCase();
  // تحقق من كل حالة بواسطة كلمات مفتاحية مرنة
  for(const key of Object.keys(CASES)){
    const k = key.replace(/\s+/g,'').replace(/[^ء-ي]/g,''); // تبسيط
    const normalizedText = low.replace(/[^ء-ي\s]/g,'');
    if(normalizedText.includes(k) || (key.includes('حروق') && normalizedText.includes('حرق')) ||
       (key.includes('صرع') && normalizedText.includes('صرع')) ||
       (key.includes('اختناق') && normalizedText.includes('اختناق')) ||
       (key.includes('انخفاض') && (normalizedText.includes('انخفاض') || normalizedText.includes('ضغط')))) {
      // عرض وقراءة
      speakSteps(CASES[key], key);
      showTabById('cases');
      return;
    }
  }
  alert('لم أتعرف على الحالة، كرر الكلمة (مثال: حروق، صرع، اختناق، انخفاض الضغط).');
}

// زر الطوارئ يبدأ الاستماع أو يطلب الإذن
emergencyBtn.addEventListener('click', () => {
  hint.textContent = 'استماع... قل اسم الحالة الآن';
  if(!recognition) recognition = initRecognition();
  if(!recognition) return alert('التعرف الصوتي غير مدعوم في متصفحك.');
  try {
    recognition.start();
  } catch(e){
    // بعض المتصفحات تمنع start متكرر؛ نوقف ثم نبدأ
    try { recognition.stop(); recognition.start(); } catch(err){ console.warn(err); }
  }
});

// عند تغيير تبويب من الفوتر: اغلاق النطق
tabBtns.forEach(b => b.addEventListener('click', () => {
  hint.textContent = 'تحدث أو انقر على الزر لذكر الحالة';
  stopSpeech();
}));

// === نموذج التسجيل (بإرسال بسيط - يمكن تعديل المسار لاحقًا) ===
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  // إرسال عبر fetch إلى api/register_user.php لو موجود (هنا عرض تجريبي)
  alert('تم استلام بيانات التسجيل (هذا مثال - اربط register_user.php لعمل حقيقي).');
  registerForm.reset();
});
