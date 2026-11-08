const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Keep the page readable even when JavaScript or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.documentElement.classList.add('js-ready');
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

const header = document.querySelector('.header');
const menu = document.querySelector('.menu-toggle');
function closeMenu() {
  header.classList.remove('menu-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
}
menu.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

const progress = document.querySelector('.scroll-progress');
const heroSection = document.querySelector('.hero');
const heroArtwork = document.querySelector('.hero-art');
const projectArtwork = document.querySelectorAll('.project-art');
let scrollScheduled = false;
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = 'scaleX(' + (scrollable > 0 ? window.scrollY / scrollable : 0) + ')';
  if (!reducedMotion.matches) {
    const heroBounds = heroSection.getBoundingClientRect();
    if (heroBounds.bottom > 0 && heroBounds.top < window.innerHeight) {
      const heroProgress = Math.min(Math.max(-heroBounds.top / Math.max(heroBounds.height, 1), 0), 1);
      heroArtwork.style.setProperty('--hero-drift', (heroProgress * 30).toFixed(1) + 'px');
      heroArtwork.style.setProperty('--orbit-drift', (heroProgress * -13.5).toFixed(1) + 'px');
    }
    projectArtwork.forEach((artwork) => {
      const bounds = artwork.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const distance = (bounds.top + bounds.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2 + bounds.height / 2);
      artwork.style.setProperty('--art-drift', (Math.max(-1, Math.min(1, distance)) * -14).toFixed(1) + 'px');
    });
  }
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) { requestAnimationFrame(updateProgress); scrollScheduled = true; }
}, { passive: true });
window.addEventListener('resize', () => {
  if (!scrollScheduled) { requestAnimationFrame(updateProgress); scrollScheduled = true; }
}, { passive: true });
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    heroArtwork.style.removeProperty('--hero-drift');
    heroArtwork.style.removeProperty('--orbit-drift');
    projectArtwork.forEach((artwork) => artwork.style.removeProperty('--art-drift'));
  }
  updateProgress();
});
updateProgress();

const rotatingText = document.querySelector('.rotating-text');
const phrases = ['reliable backends.', 'practical AI.', 'useful products.'];
let phraseIndex = 0;
if (!reducedMotion.matches) {
  window.setInterval(() => {
    if (document.hidden || reducedMotion.matches) return;
    rotatingText.classList.add('is-changing');
    window.setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      rotatingText.textContent = phrases[phraseIndex];
      rotatingText.classList.remove('is-changing');
    }, 250);
  }, 3200);
}

const waveform = document.querySelector('.waveform');
for (let i = 0; i < 48; i += 1) {
  const bar = document.createElement('i');
  const height = 12 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.27)) * 75;
  bar.style.setProperty('--height', height.toFixed(1) + '%');
  bar.style.setProperty('--delay', (i % 9 * -0.13).toFixed(2) + 's');
  waveform.appendChild(bar);
}
const spine = document.querySelector('.spine-column');
for (let i = 0; i < 9; i += 1) spine.appendChild(document.createElement('i'));

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.project-card, [data-tilt]').forEach((target) => {
    const visual = target.matches('.project-card') ? target.querySelector('.project-art') : target;
    target.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches) return;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
      visual.style.setProperty('--ry', (x * 4).toFixed(2) + 'deg');
      visual.style.setProperty('--pointer-x', ((x + 0.5) * 100).toFixed(1) + '%');
      visual.style.setProperty('--pointer-y', ((y + 0.5) * 100).toFixed(1) + '%');
    });
    target.addEventListener('pointerleave', () => {
      visual.style.removeProperty('--rx');
      visual.style.removeProperty('--ry');
      visual.style.removeProperty('--pointer-x');
      visual.style.removeProperty('--pointer-y');
    });
  });
}

const projects = {
  tutoraaya: {
    category: 'Marketplace · Mobile product', title: 'TutorAaya',
    description: 'A local tutoring marketplace that connects students with verified tutors and makes booking easier.',
    metrics: [['Offline-first', 'Architecture'], ['SSE + Redis', 'Real-time'], ['Docker', 'Deployment']],
    detail: 'Built around proximity matching, tutor verification, and a real-time booking flow.',
    tech: ['React Native', 'FastAPI', 'PostgreSQL', 'Redis', 'TypeScript']
  },
  'voicemail-ai': {
    category: 'Applied AI · Speech intelligence', title: 'Voicemail AI',
    description: 'An audio classification platform that distinguishes a live person from voicemail or IVR early in a call.',
    metrics: [['96.31%', 'Accuracy'], ['92.87%', 'F1 score'], ['6 seconds', 'Audio window']],
    detail: 'Combines acoustic features and speech transcription in an event-driven processing pipeline.',
    tech: ['Python', 'FastAPI', 'Vosk', 'scikit-learn', 'Redis']
  },
  'geolocation-service': {
    category: 'Production system · Backend', title: 'IP Geolocation',
    description: 'A FastAPI service for Linkio FiberNet that resolves IPv4 and IPv6 addresses into location and network data.',
    metrics: [['24 hours', 'Cache TTL'], ['IPv4 + IPv6', 'Protocols'], ['Redis', 'Cache layer']],
    detail: 'Uses a cache-first design, local databases, and fallback sources to keep lookups responsive.',
    tech: ['Python', 'FastAPI', 'Redis', 'Pydantic', 'Docker']
  },
  'spine-classifier': {
    category: 'Research · Computer vision', title: 'Spine Vision',
    description: 'A deep learning project exploring the classification of lumbar spine deformities from medical images.',
    metrics: [['MobileNetV2', 'Backbone'], ['Medical CV', 'Domain'], ['TensorFlow', 'Framework']],
    detail: 'Uses transfer learning, image preprocessing, and augmentation to study patterns in lumbar scans.',
    tech: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'Computer Vision']
  }
};
const dialog = document.querySelector('.project-dialog');
const dialogContent = document.querySelector('#dialog-content');
let lastProjectButton = null;
document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    lastProjectButton = button;
    dialogContent.innerHTML = '<div class="dialog-eyebrow">' + project.category + '</div>' +
      '<h2 id="dialog-title">' + project.title + '</h2>' +
      '<p class="dialog-description">' + project.description + '</p>' +
      '<div class="dialog-metrics">' + project.metrics.map((metric) => '<div><strong>' + metric[0] + '</strong><span>' + metric[1] + '</span></div>').join('') + '</div>' +
      '<div class="dialog-detail-label">The idea in practice</div><p class="dialog-detail">' + project.detail + '</p>' +
      '<div class="dialog-tags">' + project.tech.map((tag) => '<span>' + tag + '</span>').join('') + '</div>';
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  if (lastProjectButton) lastProjectButton.focus();
});

const copyButton = document.querySelector('.copy-email');
const toast = document.querySelector('.toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('parthivguptashahganj@gmail.com');
    showToast('Email copied to clipboard');
  } catch {
    showToast('Could not copy. Select the email address to copy it.');
  }
});

const contactForm = document.querySelector('.contact-form');
const contactName = document.querySelector('#contact-name');
const contactEmail = document.querySelector('#contact-email');
const contactMessage = document.querySelector('#contact-message');
[contactName, contactMessage].forEach((field) => {
  field.addEventListener('input', () => field.setCustomValidity(''));
});
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  [contactName, contactMessage].forEach((field) => {
    field.setCustomValidity(field.value.trim() ? '' : 'Please enter a value.');
  });
  if (!contactForm.reportValidity()) return;

  const subject = 'Portfolio enquiry from ' + contactName.value.trim();
  const body = 'Name: ' + contactName.value.trim() + '\nEmail: ' + contactEmail.value.trim() + '\n\n' + contactMessage.value.trim();
  window.location.href = 'mailto:parthivguptashahganj@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});
document.querySelector('#year').textContent = new Date().getFullYear();
