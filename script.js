function showTab(tabId, event) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  event?.currentTarget?.classList.add('active');
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
    // هنا تضيفين منطق الحالات حسب الصوت
  };

  recognition.onerror = err => {
    console.warn('خطأ في التعرف الصوتي:', err);
  };

  document.getElementById('emergencyBtn').onclick = () => {
    try { recognition.start(); } catch {}
  };
}
