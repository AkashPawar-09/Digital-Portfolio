/* ════════════════════════════════════════════════════════
   AKASH PAWAR — PORTFOLIO  |  script.js
   ════════════════════════════════════════════════════════ */

/* ── 1. Custom Cursor ── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Scale cursor on interactive elements
document.querySelectorAll('a, button, .project-card, .glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
    cursorRing.style.borderColor = 'rgba(0, 217, 245, 0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.borderColor = 'rgba(0, 217, 245, 0.35)';
  });
});

// Hide on mobile
if (window.matchMedia('(pointer: coarse)').matches) {
  cursorDot.style.display  = 'none';
  cursorRing.style.display = 'none';
}


/* ── 2. Navbar Scroll & Active Link ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else                      navbar.classList.remove('scrolled');
  highlightNav();
  toggleBackToTop();
});

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    const id  = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bot) link.classList.add('active');
      else                                      link.classList.remove('active');
    }
  });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    // Close mobile menu
    document.getElementById('navLinks').classList.remove('open');
  });
});


/* ── 3. Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger bars
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});


/* ── 4. Typewriter Effect ── */
const typewriterEl = document.getElementById('typewriter');
const words = [
  'ENTC Engineer 🔌',
  'Web Developer 🌐',
  'Arduino Builder ⚙️',
  'Problem Solver 🧠',
  'Python Learner 🐍',
  'DSA Enthusiast 📊',
];
let wordIdx  = 0;
let charIdx  = 0;
let deleting = false;
let typePause = false;

function typeWriter() {
  if (typePause) return;
  const currentWord = words[wordIdx];

  if (!deleting) {
    typewriterEl.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === currentWord.length) {
      typePause = true;
      setTimeout(() => { typePause = false; deleting = true; }, 1800);
    }
  } else {
    typewriterEl.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
    }
  }
  setTimeout(typeWriter, deleting ? 60 : 95);
}
typeWriter();


/* ── 5. Scroll Animations (Intersection Observer) ── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('animated'), delay);
      animObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));


/* ── 6. Skill Bar Fill on Scroll ── */
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const target = bar.dataset.width;
        setTimeout(() => bar.style.width = target + '%', 300);
      });
      skillBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category-card').forEach(card => skillBarObserver.observe(card));


/* ── 7. Animated Stat Counters ── */
function animateCounter(el) {
  const target    = parseFloat(el.dataset.count);
  const isDecimal = target % 1 !== 0;
  const duration  = 1800;
  const start     = performance.now();

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = target * eased;
    el.textContent = isDecimal ? value.toFixed(2) : Math.floor(value);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(2) : target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));


/* ── 8. Contact Form (mailto link) ── */
function sendMessage() {
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMessage').value.trim();
  const formMsg = document.getElementById('formMsg');

  formMsg.className = 'form-message';
  formMsg.style.display = 'none';

  if (!name || !email || !message) {
    formMsg.className = 'form-message error';
    formMsg.textContent = '⚠ Please fill in all fields.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMsg.className = 'form-message error';
    formMsg.textContent = '⚠ Please enter a valid email address.';
    return;
  }

  const subject = encodeURIComponent(`Portfolio Message from ${name}`);
  const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailTo  = `mailto:akashpawar.official.acc@gmail.com?subject=${subject}&body=${body}`;

  window.location.href = mailTo;

  formMsg.className = 'form-message success';
  formMsg.textContent = '✓ Opening email client... Thanks for reaching out!';

  document.getElementById('cName').value    = '';
  document.getElementById('cEmail').value   = '';
  document.getElementById('cMessage').value = '';
}

// Also allow pressing Enter in inputs
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') sendMessage();
  });
});


/* ── 9. Back to Top Button ── */
const btt = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) btt.classList.add('visible');
  else                       btt.classList.remove('visible');
}

btt.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── 10. Section reveal on Hero buttons ── */
// Ensure scroll-padding works for all browsers
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ── 11. Glowing grid parallax on hero ── */
const heroBg = document.querySelector('.hero-grid-bg');
if (heroBg) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroBg.style.transform = `translate(${x}px, ${y}px)`;
  });
}


/* ── 12. Project card tilt effect ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const cx    = rect.width  / 2;
    const cy    = rect.height / 2;
    const rotX  = ((y - cy) / cy) * -4;
    const rotY  = ((x - cx) / cx) *  4;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ── 13. Console Easter Egg ── */
console.log('%c👋 Hi there, developer!', 'color: #00d9f5; font-size: 1.2rem; font-weight: bold;');
console.log('%cThis portfolio was built with ❤ by Akash Pawar', 'color: #f97316; font-size: 0.9rem;');
console.log('%cHTML · CSS · Vanilla JS — No frameworks needed!', 'color: #8b5cf6; font-size: 0.85rem;');
