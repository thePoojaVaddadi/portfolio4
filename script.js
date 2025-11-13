// script_unique.js - Elegant Dark Aurora theme: aurora canvas, progress bar, responsive menu, fade-in reveals
(function(){
  // Elements
  const progress = document.getElementById('progress');
  const canvas = document.getElementById('auroraCanvas');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navButtons = Array.from(document.querySelectorAll('[data-target]'));

  // Safety checks
  if (!progress) console.warn('Progress element missing');
  if (!canvas || !ctx) console.warn('Aurora canvas not available; background will be static');

  // Smooth scrolling behavior
  document.documentElement.style.scrollBehavior = 'smooth';

  // Responsive mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Nav button scrolling
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
    });
  });

  // Progress bar update
  function updateProgress(){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / (h || 1)) * 100;
    if (progress) progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Reveal on scroll (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    // fallback: simply show them
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Canvas aurora: subtle moving gradients (teal <-> violet)
  function setupCanvas() {
    if (!canvas || !ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let t = 0;

    function draw() {
      t += 0.002; // slow time
      // clear with transparent so body bg shows through
      ctx.clearRect(0,0,w,h);
      // draw layered soft radial gradients for aurora mist
      const gradients = [
        { x: w * 0.15 + Math.sin(t*1.1)*120, y: h * 0.25 + Math.cos(t*0.9)*80, r: Math.min(w,h)*0.9, c1: 'rgba(56,198,214,0.06)', c2: 'rgba(56,198,214,0)'},
        { x: w * 0.85 + Math.cos(t*0.8)*140, y: h * 0.6 + Math.sin(t*1.3)*100, r: Math.min(w,h)*0.8, c1: 'rgba(155,108,255,0.06)', c2: 'rgba(155,108,255,0)' },
        { x: w * 0.5 + Math.sin(t*0.5)*100, y: h * 0.45 + Math.cos(t*0.7)*60, r: Math.min(w,h)*0.7, c1: 'rgba(88,140,200,0.03)', c2: 'rgba(88,140,200,0)' }
      ];
      gradients.forEach(g => {
        const grd = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        grd.addColorStop(0, g.c1);
        grd.addColorStop(1, g.c2);
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,w,h);
      });
      requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
  }
  setupCanvas();

  // Accessibility: allow keyboard nav for buttons with data-target
  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') btn.click();
    });
  });

})();