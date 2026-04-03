/* =========================================================
   main.js — Portafolio Johanna Vargas
   ========================================================= */

/* ── AÑO ACTUAL EN FOOTER ── */
document.getElementById('yr').textContent = new Date().getFullYear();


/* =========================================================
   PARTÍCULAS EN CANVAS
   ========================================================= */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let W, H, stars = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Star {
  constructor() { this.reset(); }

  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 0.9 + 0.2;
    this.a  = Math.random();
    this.da = (Math.random() - 0.5) * 0.008;
    this.vx = (Math.random() - 0.5) * 0.12;
    this.vy = (Math.random() - 0.5) * 0.12;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.a += this.da;
    if (this.a <= 0 || this.a >= 1) this.da = -this.da;
    if (this.x < -2 || this.x > W + 2 || this.y < -2 || this.y > H + 2) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 220, 255, ${this.a * 0.5})`;
    ctx.fill();
  }
}

// Crear 180 estrellas
for (let i = 0; i < 180; i++) stars.push(new Star());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);

  // Líneas de conexión entre partículas cercanas
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);

      if (d < 90) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(0, 180, 255, ${(1 - d / 90) * 0.06})`;
        ctx.lineWidth   = 0.4;
        ctx.stroke();
      }
    }
    stars[i].update();
    stars[i].draw();
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();


/* =========================================================
   NAVEGACIÓN — scroll + active link
   ========================================================= */
const nav      = document.getElementById('nav');
const navLinks = document.querySelectorAll('#nav-ul a');
const sections = ['hero', 'skills', 'experiencia', 'certificados'];

window.addEventListener('scroll', () => {
  // Clase "scrolled" para el fondo del nav
  nav.classList.toggle('scrolled', window.scrollY > 60);

  // Detectar sección activa
  let current = 'hero';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });

  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// Scroll suave al hacer click en nav
navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* =========================================================
   REVEAL — elementos aparecen al hacer scroll
   ========================================================= */
const revEls = document.querySelectorAll('.rev');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revEls.forEach(el => revealObserver.observe(el));


/* =========================================================
   BARRAS DE SKILLS — animación al entrar en viewport
   ========================================================= */
const fills = document.querySelectorAll('.sk-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Pequeño delay para que se vea mejor después del reveal
      setTimeout(() => {
        entry.target.style.width = entry.target.dataset.w + '%';
      }, 150);
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });

fills.forEach(fill => barObserver.observe(fill));