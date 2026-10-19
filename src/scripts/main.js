/* ==========================================================================
   MAIN JAVASCRIPT CONTROLLER - PARTHIV GUPTA PORTFOLIO
   Modular, accessible, lightweight, performance-first
   ========================================================================== */

import { projectsData } from './projects-data.js';

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initSideNav();
  initHeroMotion();
  initPortraitSwitcher();
  initProjectsCarousel();
  initProjectModal();
  initScrollReveal();
  initCardScrollReveal();
  initKineticTextReveal();
  initCopyButtons();
  initContactForm();
});

/* ==========================================================================
   2. HERO ENTRANCE & PARALLAX MOTION
   ========================================================================== */
function initHeroMotion() {
  const hero = document.getElementById('hero');
  const heroContent = hero?.querySelector('.hero-content');
  const heroVisual = hero?.querySelector('.hero-visual');
  if (!hero || !heroContent || !heroVisual) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.classList.add('hero-motion-ready');
    return;
  }

  requestAnimationFrame(() => hero.classList.add('hero-motion-ready'));

  let ticking = false;
  function updateParallax() {
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    const fade = Math.max(1 - progress * 1.35, 0);

    heroContent.style.setProperty('--hero-shift-y', `${progress * -38}px`);
    heroVisual.style.setProperty('--hero-shift-y', `${progress * 52}px`);
    hero.style.setProperty('--hero-fade', fade.toFixed(3));
    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate, { passive: true });
  updateParallax();
}

/* ==========================================================================
   3. SIDE NAVIGATION & SCROLL SPY
   ========================================================================== */
function initSideNav() {
  const sidebar = document.getElementById('sideNav');
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const backdrop = document.getElementById('sidebarBackdrop');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavIndicator() {
    const activeLink = document.querySelector('.sidebar-link.active');
    if (!activeLink) return;

    const indicatorPosition = activeLink.offsetTop + (activeLink.offsetHeight / 2) - 16;
    sidebarLinks[0]?.parentElement?.style.setProperty(
      '--nav-indicator-y',
      `${indicatorPosition}px`
    );
  }

  function toggleSidebar(open) {
    const shouldOpen = open !== undefined ? open : !sidebar.classList.contains('open');
    if (shouldOpen) {
      sidebar.classList.add('open');
      backdrop.classList.add('open');
      if (toggleBtn) {
        toggleBtn.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    } else {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
      if (toggleBtn) {
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => toggleSidebar());
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => toggleSidebar(false));
  }

  // Smooth, continuous scroll navigation without abrupt button click jumps
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          e.preventDefault();
          const targetOffset = targetSection.getBoundingClientRect().top + window.pageYOffset - 40;
          
          window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
          });

          // Softly highlight target link without harsh instant snap
          sidebarLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          updateNavIndicator();

          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      }

      if (window.innerWidth < 1024) {
        toggleSidebar(false);
      }
    });
  });

  // Hysteresis scroll spy for fluid sidebar indication
  let isScrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        const viewportMiddle = scrollY + (window.innerHeight * 0.35);

        let currentActiveSectionId = null;
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
            currentActiveSectionId = section.getAttribute('id');
          }
        });

        // Edge case: when at the very bottom of the page, activate the last link
        if ((window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60)) {
          const lastSection = sections[sections.length - 1];
          if (lastSection) currentActiveSectionId = lastSection.getAttribute('id');
        }

        if (currentActiveSectionId) {
          sidebarLinks.forEach(link => {
            const matches = link.getAttribute('href') === `#${currentActiveSectionId}` || 
                            link.dataset.section === currentActiveSectionId;
            if (matches && !link.classList.contains('active')) {
              sidebarLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
              updateNavIndicator();
            }
          });
        }

        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  }, { passive: true });

  updateNavIndicator();
  window.addEventListener('resize', updateNavIndicator, { passive: true });
}

/* ==========================================================================
   2. PERSONAL PORTRAIT VIEW SWITCHER
   ========================================================================== */
function initPortraitSwitcher() {
  const portraitImg = document.getElementById('heroPortraitImg');
  const switchBtns = document.querySelectorAll('.btn-switch');
  const badgeTitle = document.getElementById('portraitBadgeTitle');
  const badgeDesc = document.getElementById('portraitBadgeDesc');

  if (!portraitImg || switchBtns.length === 0) return;

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.portraitMode;
      if (mode === 'studio') {
        portraitImg.src = '/assets/images/parthiv-portrait.webp';
        portraitImg.alt = 'Parthiv Gupta - Software Engineer';
        if (badgeTitle) badgeTitle.textContent = 'Parthiv Gupta';
        if (badgeDesc) badgeDesc.textContent = 'Software Development Engineer';
      } else {
        portraitImg.src = '/assets/images/parthiv-artistic.png';
        portraitImg.alt = 'Parthiv Gupta - Editorial Artwork';
        if (badgeTitle) badgeTitle.textContent = 'Creative Developer';
        if (badgeDesc) badgeDesc.textContent = 'Systems & AI Exploration';
      }
    });
  });
}

/* ==========================================================================
   3. SKIPER 54 CLIP-PATH CAROUSEL CONTROLLER
   ========================================================================== */
function initProjectsCarousel() {
  const track = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const paginationContainer = document.getElementById('carouselPagination');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!track || !viewport) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let isAutoplayPaused = false;
  let startX = 0;
  let isDragging = false;

  // 1. Render all slides from projectsData
  track.innerHTML = '';
  paginationContainer.innerHTML = '';

  projectsData.forEach((project, idx) => {
    const slide = document.createElement('div');
    slide.className = `skiper-slide ${idx === 0 ? 'active' : ''}`;
    slide.setAttribute('data-index', idx);
    slide.setAttribute('data-project-id', project.id);
    slide.setAttribute('data-category', project.category);
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `${project.title} (${idx + 1} of ${projectsData.length})`);

    const tagsHtml = project.techStack.slice(0, 4).map(tech => 
      `<span class="skiper-slide-tag">${tech}</span>`
    ).join('');

    slide.innerHTML = `
      <div class="skiper-slide-inner">
        <img 
          src="${project.image}" 
          alt="${project.title} Architectural Graphic" 
          class="skiper-slide-media" 
          loading="lazy" 
        />
        <div class="skiper-slide-overlay"></div>
        <div class="skiper-slide-badge">
          <span class="pulse-dot"></span>
          <span>${project.badgeLabel}</span>
        </div>
        <div class="skiper-slide-content">
          <div class="skiper-slide-header">
            <span class="skiper-slide-category">${project.category.toUpperCase()}</span>
            <h3 class="skiper-slide-title">${project.title}</h3>
          </div>
          <div class="skiper-slide-hover-content">
            <p class="skiper-slide-tagline">${project.tagline}</p>
            <div class="skiper-slide-tags">
              ${tagsHtml}
              ${project.techStack.length > 4 ? `<span class="skiper-slide-tag">+${project.techStack.length - 4}</span>` : ''}
            </div>
            <button class="skiper-slide-action" data-project-id="${project.id}" aria-label="Know more about ${project.title}">
              <span>Know More & Details</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    track.appendChild(slide);

    // Create Pagination Dot
    const dot = document.createElement('button');
    dot.className = `skiper-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', `Navigate to ${project.title}`);
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoplay();
    });
    paginationContainer.appendChild(dot);
  });

  const slides = track.querySelectorAll('.skiper-slide');
  const dots = paginationContainer.querySelectorAll('.skiper-dot');

  // 2. Position track and update active state
  function updateCarouselPosition() {
    const viewportWidth = viewport.offsetWidth;
    const activeSlide = slides[currentIndex];
    if (!activeSlide) return;

    const slideWidth = activeSlide.offsetWidth;
    const slideLeft = activeSlide.offsetLeft;
    const targetOffset = (viewportWidth / 2) - (slideLeft + (slideWidth / 2));

    track.style.transform = `translateX(${targetOffset}px)`;

    // Update active class on slides
    slides.forEach((s, i) => {
      if (i === currentIndex) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    // Update pagination dots
    dots.forEach((d, i) => {
      if (i === currentIndex) {
        d.classList.add('active');
        d.setAttribute('aria-selected', 'true');
      } else {
        d.classList.remove('active');
        d.setAttribute('aria-selected', 'false');
      }
    });

  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = projectsData.length - 1;
    } else if (index >= projectsData.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateCarouselPosition();
  }

  // Next & Prev handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    });
  }

  // Slide click handlers:
  // If clicking active slide or button: open modal!
  // If clicking inactive slide: go to that slide!
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (idx !== currentIndex) {
        goToSlide(idx);
        resetAutoplay();
      } else {
        const projectId = slide.getAttribute('data-project-id');
        openModalWithProject(projectId);
      }
    });

    const actionBtn = slide.querySelector('.skiper-slide-action');
    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = actionBtn.getAttribute('data-project-id');
        openModalWithProject(projectId);
      });
    }
  });

  // Filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      if (cat === 'all') {
        goToSlide(0);
      } else {
        const targetIdx = projectsData.findIndex(p => p.category === cat);
        if (targetIdx !== -1) {
          goToSlide(targetIdx);
        }
      }
      resetAutoplay();
    });
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('projectModal');
    if (modal && modal.classList.contains('open')) return;

    if (e.key === 'ArrowLeft') {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    }
  });

  // Pointer/Touch Swipe
  viewport.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
      resetAutoplay();
    }
  });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      const modal = document.getElementById('projectModal');
      if (modal && modal.classList.contains('open')) return;
      if (!isAutoplayPaused) {
        goToSlide(currentIndex + 1);
      }
    }, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  viewport.addEventListener('mouseenter', () => { isAutoplayPaused = true; });
  viewport.addEventListener('mouseleave', () => { isAutoplayPaused = false; });

  // Window resize observer
  window.addEventListener('resize', () => {
    updateCarouselPosition();
  });

  // Initial call
  setTimeout(() => {
    updateCarouselPosition();
    startAutoplay();
  }, 100);
}

/* ==========================================================================
   4. PROJECT DEEP DIVE MODAL
   ========================================================================== */
function initProjectModal() {
  const backdrop = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!backdrop) return;

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal tab switching
  const tabBtns = backdrop.querySelectorAll('.modal-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.targetTab;
      const contents = backdrop.querySelectorAll('.modal-tab-content');
      contents.forEach(c => {
        c.classList.remove('active');
        if (c.id === `tabContent-${targetTab}`) {
          c.classList.add('active');
        }
      });
    });
  });
}

function openModalWithProject(projectId) {
  const project = projectsData.find(p => p.id === projectId);
  if (!project) return;

  const backdrop = document.getElementById('projectModal');
  const titleEl = document.getElementById('modalTitle');
  const badgeEl = document.getElementById('modalBadge');
  const imgEl = document.getElementById('modalBannerImg');
  const archContent = document.getElementById('tabContent-arch');
  const probContent = document.getElementById('tabContent-problem');
  const codeContent = document.getElementById('tabContent-code');
  const metricsContent = document.getElementById('tabContent-metrics');

  if (!backdrop) return;

  titleEl.textContent = project.title;
  badgeEl.textContent = project.badgeLabel;
  badgeEl.className = `badge ${project.badgeClass}`;
  imgEl.src = project.image;
  imgEl.alt = `${project.title} Architectural Preview`;

  // 1. Architecture Tab
  archContent.innerHTML = `
    <h4 class="modal-section-title">System Architecture & Engineering Blueprint</h4>
    <p>${project.shortDesc}</p>
    <ul class="modal-bullet-list">
      ${project.architectureDetails.map(item => `
        <li>
          <span class="bullet-icon">▸</span>
          <span>${item}</span>
        </li>
      `).join('')}
    </ul>
    <h4 class="modal-section-title" style="margin-top:20px;">Complete Technology Stack</h4>
    <div class="project-tech-stack">
      ${project.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('')}
    </div>
  `;

  // 2. Problem & Solution Tab
  probContent.innerHTML = `
    <h4 class="modal-section-title">The Engineering Challenge</h4>
    <p>${project.problem}</p>
    <h4 class="modal-section-title" style="margin-top:24px;">Engineered Technical Solution</h4>
    <p>${project.solution}</p>
    <h4 class="modal-section-title" style="margin-top:24px;">Key Architectural Decisions</h4>
    <ul class="modal-bullet-list">
      ${project.highlights.map(h => `
        <li>
          <span class="bullet-icon">✓</span>
          <span>${h}</span>
        </li>
      `).join('')}
    </ul>
  `;

  // 3. Code & Implementation Tab
  codeContent.innerHTML = `
    <h4 class="modal-section-title">Core Implementation Snapshot</h4>
    <p style="color:var(--text-muted);font-size:0.8125rem;">Production logic snippet representing critical data flow, algorithms, or API routes:</p>
    <pre class="code-snippet-box"><code>${escapeHtml(project.codeSnippet)}</code></pre>
  `;

  // 4. Metrics & Performance Tab
  metricsContent.innerHTML = `
    <h4 class="modal-section-title">Measured Outcomes & Performance Telemetry</h4>
    <div class="hero-telemetry" style="margin-top:16px; margin-bottom:24px;">
      ${project.metrics.map(m => `
        <div class="telemetry-item">
          <span class="telemetry-val ${m.type === 'highlight' ? 'amber' : (m.type === 'cyan' ? 'blue' : 'magenta')}">${m.val}</span>
          <span class="telemetry-label">${m.label}</span>
        </div>
      `).join('')}
    </div>
    <ul class="modal-bullet-list">
      ${project.highlights.map(h => `
        <li>
          <span class="bullet-icon">▸</span>
          <span>${h}</span>
        </li>
      `).join('')}
    </ul>
  `;

  // Reset to first tab
  const tabBtns = backdrop.querySelectorAll('.modal-tab-btn');
  tabBtns.forEach((b, i) => b.classList.toggle('active', i === 0));
  backdrop.querySelectorAll('.modal-tab-content').forEach((c, i) => c.classList.toggle('active', i === 0));

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ==========================================================================
   5. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastNoticeText');

  let toastTimer;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copyText;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        showToast(`Copied to clipboard: ${textToCopy}`);
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy', err);
      });
    });
  });
}

/* ==========================================================================
   8. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastNoticeText');

  if (!form) return;

  initSkiperAnimatedInputs(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const subject = form.querySelector('[name="subject"]').value;
    const message = form.querySelector('[name="message"]').value;

    const mailtoUrl = `mailto:parthivguptashahganj@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`Sender: ${name} (${email})\n\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoUrl;

    if (toast && toastText) {
      toastText.textContent = 'Opening your email client... Thank you!';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }

    form.reset();
  });
}

/* Skiper 68: Animated character spring reveal on typing with sleek cursor */
function initSkiperAnimatedInputs(form) {
  const wraps = form.querySelectorAll('.skiper-input-wrap');

  wraps.forEach((wrap) => {
    const input = wrap.querySelector('.skiper-input');
    const mirror = wrap.querySelector('.skiper-input-mirror');
    const group = wrap.closest('.form-group');

    if (!input || !mirror) return;

    let prevValue = input.value || '';
    let typingTimer = null;

    function render(isInitial = false) {
      const currValue = input.value;
      const isFocused = document.activeElement === input;
      const selStart = input.selectionStart ?? currValue.length;
      const selEnd = input.selectionEnd ?? currValue.length;

      if (currValue.length > 0) {
        wrap.classList.add('has-value');
      } else {
        wrap.classList.remove('has-value');
      }

      // Calculate newly added characters for spring animation
      let addedStart = -1;
      let addedEnd = -1;
      if (!isInitial && currValue.length > prevValue.length) {
        let start = 0;
        while (start < prevValue.length && start < currValue.length && prevValue[start] === currValue[start]) {
          start++;
        }
        let prevEnd = prevValue.length - 1;
        let currEnd = currValue.length - 1;
        while (prevEnd >= start && currEnd >= start && prevValue[prevEnd] === currValue[currEnd]) {
          prevEnd--;
          currEnd--;
        }
        addedStart = start;
        addedEnd = currEnd + 1;
      }

      mirror.innerHTML = '';
      const fragment = document.createDocumentFragment();

      // If empty and focused, render caret at start
      if (currValue.length === 0) {
        if (isFocused) {
          const caret = document.createElement('span');
          caret.className = 'skiper-caret';
          fragment.appendChild(caret);
        }
        mirror.appendChild(fragment);
        prevValue = currValue;
        return;
      }

      for (let i = 0; i < currValue.length; i++) {
        // Caret before current char
        if (isFocused && selStart === selEnd && i === selStart) {
          const caret = document.createElement('span');
          caret.className = 'skiper-caret';
          fragment.appendChild(caret);
        }

        const span = document.createElement('span');
        span.className = 'skiper-char';
        const ch = currValue[i];
        span.textContent = ch === ' ' ? '\u00A0' : ch;

        // Animate newly added character with spring
        if (i >= addedStart && i < addedEnd) {
          span.classList.add('char-entering');
        }

        // Selection highlight
        if (isFocused && selStart !== selEnd && i >= selStart && i < selEnd) {
          span.classList.add('char-selected');
        }

        fragment.appendChild(span);
      }

      // Caret at the end
      if (isFocused && selStart === selEnd && selStart >= currValue.length) {
        const caret = document.createElement('span');
        caret.className = 'skiper-caret';
        fragment.appendChild(caret);
      }

      mirror.appendChild(fragment);

      // Keep scroll in sync
      mirror.scrollLeft = input.scrollLeft;
      if (input.tagName === 'TEXTAREA') {
        mirror.scrollTop = input.scrollTop;
      }

      prevValue = currValue;
    }

    // Input event (typing, backspace, paste, autofill)
    input.addEventListener('input', () => {
      wrap.classList.add('is-typing');
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => wrap.classList.remove('is-typing'), 380);
      render(false);
    });

    // Focus & Blur
    input.addEventListener('focus', () => {
      wrap.classList.add('is-focused');
      if (group) group.classList.add('is-focused');
      render(true);
    });

    input.addEventListener('blur', () => {
      wrap.classList.remove('is-focused', 'is-typing');
      if (group) group.classList.remove('is-focused');
      render(true);
    });

    // Caret navigation via click or keyboard
    input.addEventListener('click', () => render(true));
    input.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        render(true);
      }
    });
    input.addEventListener('select', () => render(true));

    // Scroll sync
    input.addEventListener('scroll', () => {
      mirror.scrollLeft = input.scrollLeft;
      if (input.tagName === 'TEXTAREA') {
        mirror.scrollTop = input.scrollTop;
      }
    });

    // Initial render
    render(true);
  });

  // Handle form reset
  form.addEventListener('reset', () => {
    setTimeout(() => {
      wraps.forEach((wrap) => {
        const input = wrap.querySelector('.skiper-input');
        const mirror = wrap.querySelector('.skiper-input-mirror');
        wrap.classList.remove('has-value', 'is-focused', 'is-typing');
        if (mirror) mirror.innerHTML = '';
      });
    }, 10);
  });
}

/* ==========================================================================
   9. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-scroll-animate');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px 100px 0px',
      threshold: 0.08
    });

    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('active');
      } else {
        observer.observe(el);
      }
    });
  } else {
    reveals.forEach(el => el.classList.add('active'));
  }
}

/* ==========================================================================
   10. STACKED CARD SCROLL REVEAL
   ========================================================================== */
function initCardScrollReveal() {
  const cards = document.querySelectorAll('.principle-card, .timeline-card');
  if (cards.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('js-card-reveal');
  let ticking = false;

  function updateCardReveal() {
    const viewportHeight = window.innerHeight;
    const startTrigger = viewportHeight * 0.94;
    const endTrigger = viewportHeight * 0.32;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const progress = Math.min(Math.max(
        (startTrigger - rect.top) / (startTrigger - endTrigger),
        0
      ), 1);
      const easedProgress = progress * progress * (3 - 2 * progress);
      const translateY = (1 - easedProgress) * 36;
      const scale = 0.96 + (easedProgress * 0.04);

      card.style.setProperty('--card-reveal-progress', easedProgress.toFixed(3));
      card.style.setProperty('--card-reveal-y', `${translateY.toFixed(2)}px`);
      card.style.setProperty('--card-reveal-scale', scale.toFixed(3));
    });

    document.querySelectorAll('.timeline').forEach(timeline => {
      const rect = timeline.getBoundingClientRect();
      const pathProgress = Math.min(Math.max(
        (viewportHeight * 0.78 - rect.top) / Math.max(rect.height * 0.82, 1),
        0
      ), 1);
      timeline.style.setProperty('--timeline-progress', pathProgress.toFixed(3));
    });

    ticking = false;
  }

  function requestCardRevealUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateCardReveal);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestCardRevealUpdate, { passive: true });
  window.addEventListener('resize', requestCardRevealUpdate, { passive: true });
  updateCardReveal();
}

/* ==========================================================================
   11. KINETIC TEXT SCROLL REVEAL (Interactive Typography)
   ========================================================================== */
function initKineticTextReveal() {
  const textContainers = document.querySelectorAll('[data-scroll-reveal-text]');
  if (textContainers.length === 0) return;

  textContainers.forEach(container => {
    const rawText = container.textContent.trim();
    const words = rawText.split(/\s+/);
    container.innerHTML = '';

    const wordSpans = words.map((word) => {
      const span = document.createElement('span');
      span.className = 'word';
      
      // Selectively highlight key engineering terms in brand colors
      const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
      if (['resilient', 'backend', 'scale', 'minimal'].includes(cleanWord)) {
        span.classList.add('highlight-red');
      } else if (['applied', 'intelligence', 'strict', 'contracts'].includes(cleanWord)) {
        span.classList.add('highlight-gold');
      }

      span.textContent = word;
      container.appendChild(span);
      return span;
    });

    // Animate words progressively as the container enters and travels across viewport
    let ticking = false;
    function updateWordReveal() {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Fraction from when element enters bottom of viewport (0) to when it reaches 45% of viewport (1)
      const startTrigger = viewportHeight * 0.9;
      const endTrigger = viewportHeight * 0.4;
      const progress = Math.min(Math.max((startTrigger - rect.top) / (startTrigger - endTrigger), 0), 1);

      wordSpans.forEach((span, idx) => {
        const wordProgress = Math.min(Math.max(
          (progress * wordSpans.length - idx) / 1.8,
          0
        ), 1);
        const easedProgress = wordProgress * wordProgress * (3 - 2 * wordProgress);
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const baseOpacity = isLight ? 0.4 : 0.25;
        const opacity = baseOpacity + (easedProgress * (1 - baseOpacity));
        const yOffset = (1 - easedProgress) * 0.4;

        span.style.opacity = opacity.toFixed(3);
        span.style.transform = `translate3d(0, ${yOffset.toFixed(3)}em, 0)`;

        if (easedProgress > 0.75) {
          span.classList.add('revealed');
        } else {
          span.classList.remove('revealed');
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateWordReveal);
        ticking = true;
      }
    }, { passive: true });

    // Initial check on load
    updateWordReveal();
    window.addEventListener('resize', updateWordReveal, { passive: true });
  });
}

/* ==========================================================================
   11. THEME SWITCHER (WHITE / LIGHT & DARK THEMES)
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const segmentBtns = document.querySelectorAll('.theme-segment-btn');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function applyTheme(theme, save = true) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    document.body.setAttribute('data-theme', validTheme);

    if (save) {
      try {
        localStorage.setItem('portfolio-theme', validTheme);
      } catch (err) {
        console.warn('Could not save theme preference:', err);
      }
    }

    // Update aria labels and titles
    const isDark = validTheme === 'dark';
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to white theme' : 'Switch to dark theme');
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to white theme' : 'Switch to dark theme');
    }
    if (mobileThemeToggleBtn) {
      mobileThemeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to white theme' : 'Switch to dark theme');
      mobileThemeToggleBtn.setAttribute('title', isDark ? 'Switch to white theme' : 'Switch to dark theme');
    }

    segmentBtns.forEach(btn => {
      const btnTheme = btn.getAttribute('data-theme-val');
      const isSelected = btnTheme === validTheme;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    // Update browser status bar / theme-color meta tag
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#000000' : '#ffffff');
    }
  }

  function toggleTheme() {
    const current = getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  }

  // Event Listeners for Header / Mobile Toggle Buttons
  themeToggleBtn?.addEventListener('click', toggleTheme);
  mobileThemeToggleBtn?.addEventListener('click', toggleTheme);

  // Event Listeners for Segmented Buttons in Sidebar Footer
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-val');
      if (selectedTheme) {
        applyTheme(selectedTheme, true);
      }
    });
  });

  // Listen for System Theme preference change if user hasn't set explicit preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try {
      if (!localStorage.getItem('portfolio-theme')) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    } catch (_) {}
  });

  // Initial Sync from DOM attribute (set by head script)
  applyTheme(getCurrentTheme(), false);
}

