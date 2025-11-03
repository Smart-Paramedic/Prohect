const emergencyBtn = document.getElementById("emergencyBtn");
const showCasesBtn = document.getElementById("showCasesBtn");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("playBtn");
const backBtnEl = document.getElementById("back");
const instruction = document.getElementById("instruction");
const hint = document.getElementById("hint");

const synth = window.speechSynthesis;
let recognition = null;
let currentUtterance = null;

const cases = [
  {name:"نزيف", steps:["اضغط على مكان النزيف","ارفع الجزء المصاب","اطلب مساعدة طبية"], info:"اضغط على مكان النزيف واطلب المساعدة فورًا"},
  {name:"كسر", steps:["ثبت الجزء المكسور","تجنب تحريك المصاب","اطلب مساعدة طبية"], info:"ثبت الجزء المكسور واطلب المساعدة فورًا"},
  {name:"انخفاض السكر", steps:["قدم للمصاب عصير أو حلوى","اجلس المصاب","اطلب مساعدة طبية"], info:"قدم سكريات سريعة للمصاب وأجلسه"}
];

// عرض الخطوات وقراءتها صوتياً
function showSteps(c){
  stepsSection.style.display = "block";
  caseTitle.textContent = c.name;
  stepsList.innerHTML = "";
  c.steps.forEach(s=>{
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

// عرض الحالات نصيًا
showCasesBtn.addEventListener("click", () => {
  casesList.innerHTML = "";
  cases.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${c.name}</h3><p>${c.info}</p>`;
    casesList.appendChild(card);
  });
  casesList.classList.toggle("hidden");
});

// التعرف على الصوت مباشرة
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function(event){
    const last = event.results[event.results.length -1];
    const word = last[0].transcript.trim().toLowerCase();
    console.log("سمعت:", word);

    const found = cases.find(c=>word.includes(c.name.toLowerCase()));
    if(found){
      showSteps(found);
    }
  };

  recognition.onerror = function(e){console.log(e);}
  recognition.start(); // يبدأ تلقائيًا
}

// تفعيل المايك عند الضغط على زر الطوارئ
emergencyBtn.addEventListener("click", ()=>{
  if(recognition){
    recognition.start();
  }
});

// التحكم اليدوي بالصوت
stopBtn.addEventListener("click", stopSpeech);
playBtn.addEventListener("click", playLast);

// زر الرجوع
backBtnEl.addEventListener("click", ()=>{
  stepsSection.style.display = "none";
  if(synth.speaking) synth.cancel();
  emergencyBtn.style.display = "inline-block";
  showCasesBtn.style.display = "inline-block";
  hint.style.display = "block";
  instruction.textContent = "اضغط زر الطوارئ للبدء";
});
