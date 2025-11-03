// ======= المتغيرات =======
const emergencyBtn = document.getElementById("emergencyBtn");
const showCasesBtn = document.getElementById("showCasesBtn");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("playBtn");
const callBtn = document.getElementById("callBtn");
const backBtnEl = document.getElementById("back");
const instruction = document.getElementById("instruction");
const hint = document.getElementById("hint");

const synth = window.speechSynthesis;
let recognition = null;
let currentUtterance = null;

// رابط قاعدة البيانات SheetDB
const API = 'https://sheetdb.io/api/v1/pp3tkazlfqhvu';
let cases = [];

// ======= جلب البيانات =======
fetch(API)
  .then(res => res.json())
  .then(data => {
    cases = data.map(row => ({
      name: row.case,
      steps: row.steps ? row.steps.split('|') : [],
      info: row.info || ''
    }));
    renderCases();
  })
  .catch(err => console.error("خطأ عند جلب البيانات:", err));

// ======= عرض الحالات نصيًا =======
function renderCases(){
  casesList.innerHTML = "";
  cases.forEach(c=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${c.name}</h3><p>${c.info}</p>`;
    card.onclick = () => showSteps(c);
    casesList.appendChild(card);
  });
  casesList.classList.remove("hidden");
}

// ======= عرض الخطوات وقراءتها صوتيًا =======
function showSteps(c){
  stepsSection.style.display = "block";
  caseTitle.textContent = c.name;
  stepsList.innerHTML = "";
  c.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  speakSteps(c.steps);

  emergencyBtn.style.display = "none";
  showCasesBtn.style.display = "none";
  hint.style.display = "none";
}

function speakSteps(steps){
  if(synth.speaking) synth.cancel();
  currentUtterance = new SpeechSynthesisUtterance(steps.join(". "));
  currentUtterance.lang = "ar-SA";
  synth.speak(currentUtterance);
}

function playLast(){
  if(currentUtterance){
    if(synth.speaking) synth.cancel();
    synth.speak(currentUtterance);
  }
}

function stopSpeech(){
  if(synth.speaking) synth.cancel();
}

// ======= زر الاتصال بالطوارئ =======
callBtn.addEventListener("click", ()=>{
  window.location.href = "tel:997";
});

// ======= زر عرض الحالات =======
showCasesBtn.addEventListener("click", renderCases);

// ======= التعرف على الصوت مباشرة =======
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function(event){
    const last = event.results[event.results.length-1][0].transcript.trim().toLowerCase();
    console.log("سمعت:", last);

    const found = cases.find(c => last.includes(c.name.toLowerCase()));
    if(found){
      showSteps(found);
    }
  };

  recognition.onerror = function(e){console.log(e);}
  recognition.start(); // يبدأ تلقائيًا
}

// ======= زر الطوارئ =======
emergencyBtn.addEventListener("click", ()=>{
  if(recognition){
    recognition.start();
  }
});

// ======= أزرار التحكم الصوتي =======
stopBtn.addEventListener("click", stopSpeech);
playBtn.addEventListener("click", playLast);

// ======= زر العودة =======
backBtnEl.addEventListener("click", ()=>{
  stepsSection.style.display = "none";
  if(synth.speaking) synth.cancel();
  emergencyBtn.style.display = "inline-block";
  showCasesBtn.style.display = "inline-block";
  hint.style.display = "block";
  instruction.textContent = "اضغط زر الطوارئ للبدء أو قل حالة من التلميح";
});
