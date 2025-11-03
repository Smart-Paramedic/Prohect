// ------------------------ بيانات الحالات ------------------------
const cases = {
  "كسر": "تثبيت الجزء المكسور وعدم تحريكه، وضع الثلج لتخفيف التورم، والاتصال بالطوارئ فورًا.",
  "نزيف": "اضغط مباشرة على مكان النزيف بقطعة قماش نظيفة، ارفع الجزء المصاب إن أمكن، واتصل بالطوارئ.",
  "انخفاض السكر": "أعط المصاب مصدر سكر سريع مثل عصير أو قطعة حلوى، ثم راقب حالته واطلب المساعدة الطبية."
};

// ------------------------ دالة النطق الصوتي ------------------------
const speak = (text) => {
  const utter = new SpeechSynthesisUtterance(text);
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
  resultEl.innerHTML = `<b>سمعت:</b> ${transcript}`;
  if (cases[transcript]) {
    speak(cases[transcript]);
    resultEl.innerHTML += `<p>${cases[transcript]}</p>`;
  } else {
    speak("لم أفهم الحالة، حاول قول كسر أو نزيف أو انخفاض السكر.");
  }
};

document.getElementById("startVoice").onclick = () => recognition.start();

// ------------------------ عرض الحالات النصية ------------------------
const casesListEl = document.getElementById('casesList');
Object.keys(cases).forEach(key => {
  const li = document.createElement('li');
  li.textContent = key;
  li.onclick = () => speak(cases[key]);
  casesListEl.appendChild(li);
});
