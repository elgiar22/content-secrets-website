/* ==========================================================================
   أسرار كتابة المحتوى — Interactive Landing Page Script
   ========================================================================== */

(() => {
  'use strict';

  const WHATSAPP_NUMBER = '201029364770';
  const DISPLAY_PHONE = '01029364770';

  // --- Toast Helper ---
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2600);
  }

  // --- Scroll Progress & Sticky Header Shadow ---
  const scrollProgress = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('siteHeader');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    if (scrollProgress) scrollProgress.style.width = `${pct}%`;
    if (siteHeader) siteHeader.classList.toggle('scrolled', scrollTop > 20);
  }, { passive: true });

  // --- Reliable Cross-Device Clipboard Copy Helper ---
  function copyTextReliably(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch {
      showToast('انسخ النص يدوياً');
    }
    document.body.removeChild(ta);
  }

  // --- Mobile Navigation Drawer ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    if (!menuToggle || !mobileNav) return;
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  // --- Subtle 3D Tilt on Hero Book Cover ---
  const bookStage = document.getElementById('bookStage');
  const bookCard3d = document.getElementById('bookCard3d');

  if (bookStage && bookCard3d && window.matchMedia('(pointer: fine)').matches) {
    bookStage.addEventListener('mousemove', (e) => {
      const rect = bookStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      bookCard3d.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg)`;
    });

    bookStage.addEventListener('mouseleave', () => {
      bookCard3d.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  // --- Reveal on Scroll & Count-up Metrics ---
  const revealEls = document.querySelectorAll('.reveal');
  const metricEls = document.querySelectorAll('.metric-value');

  function animateMetric(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString('en-US') + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-US') + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const metric = entry.target.querySelector('.metric-value');
          if (metric) animateMetric(metric);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
    metricEls.forEach(animateMetric);
  }

  // --- Chapter Category Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const chapterCards = document.querySelectorAll('.chapter-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      chapterCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  // --- Interactive Section Tabs ---
  const itabBtns = document.querySelectorAll('.itab-btn');
  const itabPanels = document.querySelectorAll('.itab-panel');

  itabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      itabBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      itabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === targetId);
      });
    });
  });

  // --- Tool 1: Hook Formula Generator (Based directly on Chapter 6 of the book) ---
  const hookTopicInput = document.getElementById('hookTopic');
  const hookTypePills = document.querySelectorAll('#hookTypePills .pill-choice');
  const generateHooksBtn = document.getElementById('generateHooksBtn');
  const hooksOutputList = document.getElementById('hooksOutputList');
  let selectedHookType = 'experiment';

  const hookTemplates = {
    experiment: [
      (t) => `أنا جربت أتعلم ${t} في 5 ساعات بس.. وده اللي حصل!`,
      (t) => `جربت ألتزم بـ ${t} لمدة 7 أيام متواصلة، والنتيجة صدمتني!`,
      (t) => `النهارده قررت أبدأ في ${t} من الصفر بأبسط إمكانيات.. تعال أحكيلك!`
    ],
    contrarian: [
      (t) => `أنت مش محتاج معدات غالية ولا كورسات معقدة عشان تنجح في ${t}!`,
      (t) => `الشغل الكتير في ${t} مش هو سبب نجاحك.. السر في خطوة واحدة بس!`,
      (t) => `90% من الناس فاهمين ${t} غلط.. وأنت ممكن تكون واحد منهم!`
    ],
    transform: [
      (t) => `إزاي اتحولت من شخص عشوائي وتايه في ${t} لشخص منظم بيحقق نتائج في 30 يوم؟`,
      (t) => `من الصفر إلى أول نتيجة حقيقية في ${t} بدون ما أصرف جنيه إعلانات!`,
      (t) => `كنت بعمل الغلطة دي في ${t} لحد ما غيرت حاجة واحدة وفرقت 180 درجة!`
    ],
    secret: [
      (t) => `سر واحد من أسرار ${t} قليل جداً اللي يعرفه.. بس هيفرق معاك جداً!`,
      (t) => `5 أسرار في ${t} هيخلّوك تتفوق على أغلب المنافسين من أول أسبوع`,
      (t) => `بعض أسرارنا في ${t} اللي اختصرت علينا سنين من التجربة والخطأ!`
    ],
    numbers: [
      (t) => `خلال 30 يوم هتتعلم إزاي تتقن ${t} خطوة بخطوة`,
      (t) => `4 خطوات عملية في ${t} غيرت مستوايا 180 درجة`,
      (t) => `3 أخطاء قاتلة في ${t} بتضيع مجهودك كل يوم (تجنبها فوراً)`
    ],
    result: [
      (t) => `قضيت شهور بحاول في ${t} بدون نتيجة، لحد ما غيرت حاجة واحدة.. تعال أحكيلك!`,
      (t) => `بطّلت أضيع وقت في ${t} وإنتاجيتي زادت 3 أمثال.. السر هنا!`,
      (t) => `أكتر نتيجة حققتها في ${t} اتعملت في ساعتين بس، وده اللي علّمني مبدأ مهم جداً!`
    ]
  };

  function renderHooks() {
    if (!hooksOutputList) return;
    const rawTopic = (hookTopicInput?.value || '').trim() || 'كتابة المحتوى';
    const builders = hookTemplates[selectedHookType] || hookTemplates.experiment;

    hooksOutputList.innerHTML = '';
    builders.forEach((fn) => {
      const text = fn(rawTopic);
      const item = document.createElement('div');
      item.className = 'hook-output-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      const p = document.createElement('p');
      p.textContent = `«${text}»`;

      const badge = document.createElement('span');
      badge.className = 'copy-badge';
      badge.textContent = 'نسخ';

      item.appendChild(p);
      item.appendChild(badge);

      const copyAction = () => {
        copyTextReliably(text, 'تم نسخ الخطاف بنجاح ✓');
      };

      item.addEventListener('click', copyAction);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          copyAction();
        }
      });

      hooksOutputList.appendChild(item);
    });
  }

  hookTypePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      hookTypePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      selectedHookType = pill.dataset.type || 'experiment';
      renderHooks();
    });
  });

  if (generateHooksBtn) {
    generateHooksBtn.addEventListener('click', renderHooks);
  }

  if (hookTopicInput) {
    hookTopicInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        renderHooks();
      }
    });
  }

  renderHooks();

  // --- Tool 2: Interactive Content Checklist (Based on Page 60) ---
  const checklistInputs = document.querySelectorAll('.book-check');
  const scoreRingFill = document.getElementById('scoreRingFill');
  const scorePercent = document.getElementById('scorePercent');
  const scoreTitle = document.getElementById('scoreTitle');
  const scoreDesc = document.getElementById('scoreDesc');
  const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // ~326.73

  function updateChecklistScore() {
    const total = checklistInputs.length;
    const checked = Array.from(checklistInputs).filter((c) => c.checked).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

    if (scorePercent) scorePercent.textContent = `${pct}%`;
    if (scoreRingFill) {
      const offset = RING_CIRCUMFERENCE * (1 - pct / 100);
      scoreRingFill.style.strokeDasharray = String(RING_CIRCUMFERENCE);
      scoreRingFill.style.strokeDashoffset = String(offset);
    }

    if (scoreTitle && scoreDesc) {
      if (pct === 100) {
        scoreTitle.textContent = 'ممتاز! البوست جاهز ينتشر 🔥';
        scoreDesc.textContent = 'طبّقت كل عناصر التشيك ليست.. اضغط نشر وتوكل على الله!';
      } else if (pct >= 70) {
        scoreTitle.textContent = 'قريب جداً من المثالية!';
        scoreDesc.textContent = 'فاضل عنصر أو اتنين بس والبوست بتاعك يكون في أقوى صورة ممكنة.';
      } else if (pct >= 40) {
        scoreTitle.textContent = 'بداية كويسة.. كمّل العناصر!';
        scoreDesc.textContent = 'راجع التوجيه العملي والكول تو أكشن عشان تضمن أعلى تفاعل.';
      } else {
        scoreTitle.textContent = 'استنى قبل ما تنشر!';
        scoreDesc.textContent = 'محتاج تقوّي العنوان والفائدة وتنسيق الفقرات عشان القارئ ميعملش سكيب.';
      }
    }
  }

  checklistInputs.forEach((cb) => cb.addEventListener('change', updateChecklistScore));
  updateChecklistScore();

  // --- Copy Phone Number ---
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      copyTextReliably(DISPLAY_PHONE, `تم نسخ الرقم ${DISPLAY_PHONE} ✓`);
    });
  }

  // --- WhatsApp Order Form (Mobile-safe deep linking) ---
  const whatsappOrderForm = document.getElementById('whatsappOrderForm');
  if (whatsappOrderForm) {
    whatsappOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('buyerName')?.value || '').trim();
      const goal = (document.getElementById('buyerGoal')?.value || '').trim();

      const lines = [
        'السلام عليكم أستاذ عبدالله،',
        'حابب أطلب نسخة من كتاب «أسرار كتابة المحتوى».'
      ];
      if (name) lines.push(`الاسم: ${name}`);
      if (goal) lines.push(`هدفي من الكتاب: ${goal}`);

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }
})();
