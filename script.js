function showTab(tabId, event) {
  // إيقاف الصوت عند التنقل
  stopSpeech();

  // تبديل التبويبات
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  event?.currentTarget?.classList.add('active');

  // إذا المستخدم فتح تبويب "الحالات" يدويًا، امسح الكارد
  if (tabId === 'cases') {
    const container = document.getElementById('cases-container');
    container.innerHTML = '';
  }
}

// التعرف الصوتي
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRec) {
  const recognition = new SpeechRec();
  recognition.lang = 'ar-SA';
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = e => {
    const spoken = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
    console.log('تم التعرف على:', spoken);

    if (spoken.includes('حروق')) {
      showTab('cases');
      renderBurnsCard();
    }
    // أضف حالات أخرى هنا مثل "الصرع"، "الضغط"، إلخ
  };

  recognition.onerror = err => {
    console.warn('خطأ في التعرف الصوتي:', err);
  };

  document.getElementById('emergencyBtn').onclick = () => {
    try { recognition.start(); } catch {}
  };
}

// عرض كارد الحروق
function renderBurnsCard() {
  const container = document.getElementById('cases-container');
  container.innerHTML = `
    <div class="case-card">
      <h3>الحروق</h3>
      <div class="subtitle">خطوات الإسعافات الأولية</div>
      <ul>
        <li>تبريد الحرق تحت ماء جاري لمدة 10 إلى 15 دقيقة.</li>
        <li>إزالة الملابس الضيقة أو الإكسسوارات حول المنطقة.</li>
        <li>تغطية منطقة الحرق بضمادة نظيفة ورطبة.</li>
        <li>عدم وضع مراهم أو زبدة أو الثلج مباشرة.</li>
        <li>الاتصال بالإسعاف فوراً على 997 إذا كانت المساحة واسعة.</li>
      </ul>
      <div class="card-controls">
        <button class="back-btn" onclick="showTab('home')">رجوع</button>
        <button class="call-btn" onclick="window.open('tel:997')">اتصال 997</button>
      </div>
    </div>
  `;
}

// إيقاف الصوت (احتياطي)
function stopSpeech() {
  if (typeof recognition !== 'undefined') {
    try { recognition.stop(); } catch {}
  }
}
