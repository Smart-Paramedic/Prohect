// ------------------------ الرابط لقاعدة بيانات SheetDB ------------------------
const API = 'https://sheetdb.io/api/v1/pp3tkazlfqhvu';

// ------------------------ المتغيرات العامة ------------------------
let lastSpeech = "";
const utter = new SpeechSynthesisUtterance();
utter.lang = 'ar-SA';

// ------------------------ التبويبات ------------------------
const tabs = document.querySelectorAll('.tabBtn');
const contents = document.querySelectorAll('.tabContent');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    contents.forEach(c => c.style.display = 'none');
    document.getElementById(tab.dataset.tab).style.display = 'block';
  });
});

// ------------------------ دوال الصوت ------------------------
function speakSteps(text){
  lastSpeech = text.replace(/<[^>]*>?/gm,'');
  utter.text = lastSpeech;
  speechSynthesis.speak(utter);
}

function stopSpeech(){
  speechSynthesis.cancel();
}

function playLast(){
  if(lastSpeech){
    utter.text = lastSpeech;
    speechSynthesis.speak(utter);
  }
}

// ------------------------ العودة للشاشة الرئيسية ------------------------
function backBtn(){
  document.querySelector('.tabBtn[data-tab="home"]').click();
}

// ------------------------ عرض خطوات الحالة ------------------------
function showSteps(text){
  const resultEl = document.getElementById('result');
  resultEl.innerHTML = `<p>${text}</p>`;
  speakSteps(text);
}

// ------------------------ المسعف الصوتي ------------------------
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
  if(casesMap[transcript]){
    showSteps(casesMap[transcript]);
  } else {
    showSteps("لم أفهم الحالة، حاول قول كسر أو نزيف أو انخفاض السكر.");
  }
};

document.getElementById("startVoice").onclick = () => recognition.start();

// ------------------------ جلب البيانات من SheetDB ------------------------
let casesMap = {}; // لتخزين الحالات والخطوات

fetch(API)
  .then(res => {
    if(!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  })
  .then(data => {
    const casesListEl = document.getElementById('casesList');
    data.forEach(row => {
      if(row.case && row.steps){
        casesMap[row.case] = row.steps;
        const li = document.createElement('li');
        li.innerHTML = row.case;
        li.onclick = () => showSteps(row.steps);
        casesListEl.appendChild(li);
      }
    });
  })
  .catch(err => {
    console.error("خطأ عند جلب البيانات:", err);
   
  });

// ------------------------ التسجيل ------------------------
const form = document.getElementById('userForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  if(name){
    formStatus.textContent = `تم تسجيل ${name} بنجاح (اختياري).`;
    form.reset();
  } else {
    formStatus.textContent = "الرجاء إدخال اسمك.";
  }
});
