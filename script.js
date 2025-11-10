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

const emergencyBtn = document.getElementById('emergencyBtn');
const casesContainer = document.getElementById('cases-container');
const registerForm = document.getElementById('registerForm');

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

function renderCases(filtered = null) {
  casesContainer.innerHTML = '';
  const toShow = filtered ? { [
