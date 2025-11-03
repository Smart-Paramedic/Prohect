const emergencyBtn = document.getElementById("emergencyBtn");
const showCasesBtn = document.getElementById("showCasesBtn");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const stopBtn = document.getElementById("stopBtn");
const playBtn = document.getElementById("playBtn");
const backBtn = document.getElementById("back");
const instruction = document.getElementById("instruction");
const hint = document.getElementById("hint");

const synth = window.speechSynthesis;
let recognition = null;
let currentUtterance = null;

const cases = [
  {name:"نزيف", steps:["1. اضغط على مكان النزيف","2. ارفع الجزء المصاب","3. اطلب مساعدة طبية 📞997"], info:"اضغط على مكان النزيف واطلب المساعدة فورًا"},
  {name:"كسر", steps:["1. ثبت الجزء المكسور","2. تجنب تحريك المصاب","3. اطلب مساعدة طبية 📞997"], info:"ثبت الجزء المكسور واطلب المساعدة فورًا"},
  {name:"انخفاض السكر", steps:["1. قدم للمصاب عصير أو حلوى","2. اجلس المصاب","3. اطلب مساعدة طبية 📞997"], info:"قدم سكريات سريعة للمصاب وأجلسه"}
];

function showSteps(c){
  stepsSection.classList.remove("hidden");
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
