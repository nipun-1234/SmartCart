/**
 * SmartCart - Premium Cinematic Website Intro Controller
 * Controls particle engine, letter stagger, progress tracking, session memory,
 * page readiness coupling, and smooth homepage reveal.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'smartcart_cinematic_intro_shown';
  const MIN_INTRO_DURATION_MS = 2100; // Minimum time to savor the luxury choreography
  const MAX_SAFETY_TIMEOUT_MS = 3800; // Absolute safety cutoff preventing stuck overlays

  let introOverlay = null;
  let particleCanvas = null;
  let particleCtx = null;
  let particleAnimationId = null;
  let particles = [];
  let isDismissed = false;
  let startTime = 0;
  let progressInterval = null;
  let isPageLoaded = false;
  let currentProgress = 0;

  /**
   * Determine whether intro should play
   */
  function shouldPlayIntro() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      // Explicit override via ?intro=1 or ?replay=1
      if (urlParams.has('intro') || urlParams.has('replay')) {
        return true;
      }

      // Detect page refresh/reload
      const navEntries = window.performance?.getEntriesByType?.('navigation');
      const isReload = (navEntries && navEntries[0]?.type === 'reload') || 
                       (window.performance?.navigation?.type === 1);

      if (isReload) {
        return true;
      }

      // Check session storage for first visit of session
      const hasShown = sessionStorage.getItem(STORAGE_KEY) === 'true';
      return !hasShown;
    } catch (_e) {
      return true;
    }
  }

  /**
   * Check for prefers-reduced-motion
   */
  function isReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Initialize and run the cinematic intro
   */
  function initIntro() {
    introOverlay = document.getElementById('smartcartCinematicIntro');
    if (!introOverlay) return;

    // Check if should play
    if (!shouldPlayIntro()) {
      fastDismiss();
      return;
    }

    if (isReducedMotion()) {
      fastDismiss();
      return;
    }

    // Lock page scrolling during intro
    document.body.classList.add('sc-intro-active');
    document.body.classList.remove('sc-intro-revealed');
    introOverlay.classList.remove('sc-intro-hidden', 'sc-intro-dissolving');
    introOverlay.style.display = 'flex';
    introOverlay.setAttribute('aria-hidden', 'false');

    startTime = performance.now();

    // Render staggered wordmark characters
    buildWordmark();

    // Setup background particle canvas
    initParticleCanvas();

    // Setup skip button
    const skipBtn = document.getElementById('scIntroSkipBtn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dismissIntro();
      });
    }

    // Monitor page readiness
    if (document.readyState === 'complete') {
      isPageLoaded = true;
    } else {
      window.addEventListener('load', () => {
        isPageLoaded = true;
      });
    }

    // Start progress line choreography
    startProgressTracking();

    // Absolute fallback timer to prevent ever getting stuck
    setTimeout(() => {
      if (!isDismissed) {
        dismissIntro();
      }
    }, MAX_SAFETY_TIMEOUT_MS);

    // Announce developer helper in console
    if (!window.__smartcartIntroAnnounced) {
      console.log(
        '%c⚡ SmartCart Cinematic Intro active.%c Run %creplaySmartCartIntro()%c or add %c?intro=1%c to replay.',
        'color: #ff5722; font-weight: bold;',
        'color: #ffffff;',
        'background: #ff5722; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'color: #ffffff;',
        'color: #ffb800; font-weight: bold;',
        'color: #ffffff;'
      );
      window.__smartcartIntroAnnounced = true;
    }
  }

  /**
   * Build the letter-by-letter wordmark structure for SMARTCART
   */
  function buildWordmark() {
    const container = document.getElementById('scIntroWordmark');
    if (!container) return;

    // Word: SMART (white sheen) + CART (accent flame orange-red)
    const brand = [
      { char: 'S', isAccent: false },
      { char: 'M', isAccent: false },
      { char: 'A', isAccent: false },
      { char: 'R', isAccent: false },
      { char: 'T', isAccent: false },
      { char: 'C', isAccent: true },
      { char: 'A', isAccent: true },
      { char: 'R', isAccent: true },
      { char: 'T', isAccent: true }
    ];

    container.innerHTML = brand.map((item, idx) => {
      const cls = item.isAccent ? 'sc-intro-char sc-char-accent' : 'sc-intro-char';
      return `<span class="${cls}" style="--char-idx: ${idx};">${item.char}</span>`;
    }).join('');
  }

  /**
   * Subtle ambient warm particles on HTML5 Canvas
   */
  function initParticleCanvas() {
    particleCanvas = document.getElementById('scIntroParticleCanvas');
    if (!particleCanvas) return;

    particleCtx = particleCanvas.getContext('2d');
    if (!particleCtx) return;

    function resize() {
      if (!particleCanvas) return;
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Generate ~35 glowing luxury ember particles
    const count = window.innerWidth < 640 ? 22 : 36;
    particles = [];
    const colors = ['#ff5722', '#ff7043', '#ff8a50', '#ffb800', '#ffd54f', '#ffffff'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        radius: Math.random() * 1.8 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(Math.random() * 0.55 + 0.2), // gentle upward float
        pulseSpeed: Math.random() * 0.03 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    let frame = 0;
    function render() {
      if (isDismissed || !particleCtx || !particleCanvas) return;

      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      frame++;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(frame * 0.015 + p.pulseOffset) * 0.2;
        p.y += p.vy;

        // Wrap around edges
        if (p.y < -10) p.y = particleCanvas.height + 10;
        if (p.x < -10) p.x = particleCanvas.width + 10;
        if (p.x > particleCanvas.width + 10) p.x = -10;

        // Alpha breathing
        const curAlpha = p.baseAlpha + Math.sin(frame * p.pulseSpeed + p.pulseOffset) * 0.2;

        particleCtx.save();
        particleCtx.globalAlpha = Math.max(0.1, Math.min(1, curAlpha));
        particleCtx.shadowBlur = p.radius * 4;
        particleCtx.shadowColor = p.color;
        particleCtx.fillStyle = p.color;
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        particleCtx.fill();
        particleCtx.restore();
      }

      particleAnimationId = requestAnimationFrame(render);
    }

    render();
  }

  /**
   * Smoothly track and animate the glowing progress bar
   */
  function startProgressTracking() {
    const progressBar = document.getElementById('scIntroProgressBar');
    const percentEl = document.getElementById('scIntroPercent');
    const statusEl = document.getElementById('scIntroStatus');

    currentProgress = 14;

    function updateUI(val, statusText) {
      if (progressBar) progressBar.style.width = `${val}%`;
      if (percentEl) percentEl.textContent = `${Math.round(val)}%`;
      if (statusEl && statusText) statusEl.textContent = statusText;
    }

    updateUI(currentProgress, 'INITIALIZING SYSTEM');

    progressInterval = setInterval(() => {
      if (isDismissed) {
        clearInterval(progressInterval);
        return;
      }

      const elapsed = performance.now() - startTime;
      const progressRatio = Math.min(1, elapsed / MIN_INTRO_DURATION_MS);

      // Smooth progress climbing
      if (progressRatio < 0.35) {
        currentProgress = Math.min(48, currentProgress + 4.5);
        updateUI(currentProgress, 'CONNECTING CATALOG');
      } else if (progressRatio < 0.75) {
        currentProgress = Math.min(84, currentProgress + 3.8);
        updateUI(currentProgress, 'AUTHENTICATING ECOSYSTEM');
      } else {
        // Final stretch: Wait for minimum duration and page readiness
        if (isPageLoaded || elapsed >= MIN_INTRO_DURATION_MS) {
          currentProgress = Math.min(100, currentProgress + 6);
          updateUI(currentProgress, currentProgress >= 100 ? 'EXPERIENCE READY' : 'PREPARING SHOWCASE');

          if (currentProgress >= 100 && elapsed >= MIN_INTRO_DURATION_MS) {
            clearInterval(progressInterval);
            setTimeout(() => {
              dismissIntro();
            }, 180);
          }
        }
      }
    }, 45);
  }

  /**
   * Smoothly dissolve intro and reveal the homepage
   */
  function dismissIntro() {
    if (isDismissed) return;
    isDismissed = true;

    if (progressInterval) clearInterval(progressInterval);
    if (particleAnimationId) cancelAnimationFrame(particleAnimationId);

    // Save that intro has played in this session
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch (_e) {}

    if (!introOverlay) {
      fastDismiss();
      return;
    }

    // Trigger Outro Dissolve animation
    introOverlay.classList.add('sc-intro-dissolving');

    // Trigger Homepage content entrance lift
    document.body.classList.remove('sc-intro-active');
    document.body.classList.add('sc-intro-revealed');

    // Clean up completely after 750ms transition
    setTimeout(() => {
      if (introOverlay) {
        introOverlay.classList.add('sc-intro-hidden');
        introOverlay.style.display = 'none';
        introOverlay.setAttribute('aria-hidden', 'true');
      }
    }, 760);
  }

  /**
   * Fast skip without animations (for returning visitors / reduced motion)
   */
  function fastDismiss() {
    isDismissed = true;
    document.body.classList.remove('sc-intro-active');
    document.body.classList.add('sc-intro-revealed');
    if (introOverlay) {
      introOverlay.classList.add('sc-intro-hidden');
      introOverlay.style.display = 'none';
      introOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Exposed helper for developer testing and user replay
   */
  window.replaySmartCartIntro = function () {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (_e) {}

    isDismissed = false;
    currentProgress = 0;
    startTime = performance.now();

    if (introOverlay) {
      introOverlay.classList.remove('sc-intro-hidden', 'sc-intro-dissolving');
      introOverlay.style.display = 'flex';
      introOverlay.setAttribute('aria-hidden', 'false');
    }

    document.body.classList.add('sc-intro-active');
    document.body.classList.remove('sc-intro-revealed');

    buildWordmark();
    initParticleCanvas();
    startProgressTracking();
  };

  // Run on early DOM readiness so screen is never blank
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntro);
  } else {
    initIntro();
  }
})();
