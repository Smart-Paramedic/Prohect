// ------------------------ بيانات الحالات ------------------------
const cases = {
  "كسر": "تثبيت الجزء المكسور وعدم تحريكه، وضع الثلج لتخفيف التورم، والاتصال بالإسعاف: <a href='tel:997' class='call-emergency'>997</a>.",
  "نزيف": "اضغط مباشرة على مكان النزيف بقطعة قماش نظيفة، ارفع الجزء المصاب إن أمكن، واتصل بالإسعاف: <a href='tel:997' class='call-emergency'>997</a>.",
  "انخفاض السكر": "أعط المصاب مصدر سكر سريع مثل عصير أو قطعة حلوى، ثم راقب حالته واطلب المساعدة الطبية. في حالة الطوارئ اتصل بالإسعاف: <a href='tel:997' class='call-emergency'>997</a>."
};

// ------------------------ دالة النطق الصوتي ------------------------
const speak = (text) => {
  const utter = new SpeechSynthesisUtterance(text.replace(/<[^>]*>?/gm, '')); // إزالة HTML من النص عند النطق
  utter.lang = 'ar-SA';
  speechSynthesis.speak(utter);
};

// ------------------------ إعداد التعرف على الصوت ------------------------
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'ar-SA';
recognition.continuous = false;

const statusEl = document.getElementById('voiceStatus');
const resultEl = document.getElementById('result');

recognition.onstart = () => statusEl.textContent = "🎙️ جارٍ الاستماع...";
recognition.onerror = () => statusEl.textContent = "⚠️ لم أتعرف على الصوت، حاول مرة أخرى.";
recognition.onend = () => statusEl.textContent = "⏹️ تم إنهاء الاستماع.";
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim();
  if (cases[transcript]) {
    resultEl.innerHTML = `<b>سمعت:</b> ${transcript}<p>${cases[transcript]}</p>`;
    speak(cases[transcript]);
  } else {
    resultEl.innerHTML = `<b>سمعت:</b> ${transcript}<p>لم أفهم الحالة، حاول قول كسر أو نزيف أو انخفاض السكر.</p>`;
    speak("لم أفهم الحالة، حاول قول كسر أو نزيف أو انخفاض السكر.");
  }
};

document.getElementById("startVoice").onclick = () => recognition.start();

// ------------------------ عرض الحالات النصية ------------------------
const casesListEl = document.getElementById('casesList');
Object.keys(cases).forEach(key => {
  const li = document.createElement('li');
  li.innerHTML = key;
  li.onclick = () => speak(cases[key]);
  casesListEl.appendChild(li);
});

// ------------------------ زر التسجيل (اختياري) ------------------------
const form = document.getElementById('userForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  if (name) {
    formStatus.textContent = `تم تسجيل ${name} بنجاح (اختياري).`;
    form.reset();
  } else {
    formStatus.textContent = "الرجاء إدخال اسمك.";
  }
});
