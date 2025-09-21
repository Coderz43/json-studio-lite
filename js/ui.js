(function(){
  const $ = s => document.querySelector(s);
  const yearEl = $('#year'); if(yearEl) yearEl.textContent = new Date().getFullYear();
  const btn = $('#themeToggle');
  if(btn){
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem('jsl-theme', next); } catch(e){}
    });
  }
  try {
    const saved = localStorage.getItem('jsl-theme');
    if(saved) document.documentElement.setAttribute('data-theme', saved);
  } catch(e){}
})();