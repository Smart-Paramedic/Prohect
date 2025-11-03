const emergencyBtn = document.getElementById("emergencyBtn");
const showTabs = document.querySelectorAll(".tab");
const casesList = document.getElementById("casesList");
const stepsSection = document.getElementById("stepsSection");
const caseTitle = document.getElementById("caseTitle");
const stepsList = document.getElementById("stepsList");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");
const instruction = document.getElementById("instruction");
const hint = document.getElementById("hint");

const synth = window.speechSynthesis;
let recognition = null;
let currentUtterance = null;

const cases = [
  {name:"نزيف", steps:["اضغط على مكان النزيف","ارفع الجزء المصاب","اطلب مساعدة طبية 📞997"]},
  {name:"كسر", steps:["ثبت الجزء المكسور","تجنب تحريك المصاب","اطلب مساعدة طبية 📞997"]},
  {name:"انخفاض السكر", steps:["قدم للمصاب عصير أو حلوى","اجلس المصاب","اطلب مساعدة طبية 📞997"]}
];

function showTab(id){
  showTabs.forEach(tab => tab.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function showSteps(c){
  stepsSection.classList.remove("hidden");
  caseTitle.textContent = c.name;
  stepsList.innerHTML = "";
  c.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  speakSteps(c.steps);
  emergencyBtn.style.display = "none";
  hint.style.display = "none";
}

function speakSteps(steps){
  if(synth.speaking) synth.cancel();
  currentUtterance = new SpeechSynthesisUtterance(steps.join(". "));
  currentUtterance.lang = "ar-SA";
  synth.speak(currentUtterance);
}

playBtn.addEventListener("click", () => {
  if(currentUtter
