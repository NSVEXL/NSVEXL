/* =============================================
   VNGELS — MAIN SCRIPT
   ============================================= */

/* ── Particles ─────────────────────────────── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.init(); }
  init() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - .5) * .45;
    this.vy = (Math.random() - .5) * .45;
    this.r  = Math.random() * 1.8 + .4;
    this.a  = Math.random() * .45 + .08;
    this.c  = Math.random() > .5 ? '0,212,255' : '123,47,255';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.c},${this.a})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: 65 }, () => new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 130) * .12})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
}

(function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(loop);
})();

/* ── Navbar scroll ──────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile menu ────────────────────────────── */
const navToggle  = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

navToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

/* ── Typing effect ──────────────────────────── */
const words   = ['Inteligencia Artificial', 'Automatización', 'Transformación Digital', 'Innovación'];
const typingEl = document.getElementById('typing-text');
let wIdx = 0, cIdx = 0, deleting = false;

function type() {
  const word = words[wIdx];
  if (deleting) {
    cIdx--;
  } else {
    cIdx++;
  }
  typingEl.innerHTML = word.slice(0, cIdx) + '<span class="cursor"></span>';

  let delay = deleting ? 48 : 95;
  if (!deleting && cIdx === word.length) { delay = 2200; deleting = true; }
  else if (deleting && cIdx === 0)       { deleting = false; wIdx = (wIdx + 1) % words.length; delay = 380; }

  setTimeout(type, delay);
}
type();

/* ── Smooth scroll ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── Intersection Observer helper ──────────── */
function observe(selector, className, options = {}) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add(className), delay);
      io.unobserve(el);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px', ...options });

  document.querySelectorAll(selector).forEach(el => io.observe(el));
}

observe('.svc-card',  'visible');
observe('.stat-box',  'visible');
observe('.proc-step', 'visible');

/* ── Counter animation ──────────────────────── */
function animateCount(el, target) {
  const t0 = performance.now();
  const dur = 2000;
  (function tick(now) {
    const prog = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.round(target * ease);
    if (prog < 1) requestAnimationFrame(tick);
  })(t0);
}

const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target, +entry.target.dataset.target);
    counterIO.unobserve(entry.target);
  });
}, { threshold: .5 });

document.querySelectorAll('.sval[data-target]').forEach(el => counterIO.observe(el));

/* ── Metric bars ────────────────────────────── */
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.mfill').forEach(fill => {
      const w = fill.dataset.w;
      fill.style.width = '0';
      requestAnimationFrame(() => {
        setTimeout(() => fill.style.width = w + '%', 100);
      });
    });
    barIO.unobserve(entry.target);
  });
}, { threshold: .3 });

const cardMain = document.querySelector('.card-main');
if (cardMain) barIO.observe(cardMain);

/* ── Contact form ───────────────────────────── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Mensaje enviado <i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg,#00b884,#00d4a0)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

/* ── Cursor glow follow (desktop) ───────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:400px;height:400px;border-radius:50%;
    background:radial-gradient(circle,rgba(0,212,255,.06),transparent 70%);
    pointer-events:none;z-index:0;transform:translate(-50%,-50%);
    transition:left .12s ease,top .12s ease;
  `;
  document.body.appendChild(glow);
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}
