// ============================================================
// LITTLE WORLD BIRTHDAY — Enhanced Interactive Script
// ============================================================

// ─── Configuration ───
// خصّص هذا الملف: الاسم، الرسالة، الصور، والذكريات.
const CONFIG = {
  herName: "", // اكتب اسمها إذا بتحب، مثال: "لولو"
  photos: [
    // ضع الصور في assets/photos/ واكتب المسارات هنا:
    // { src: "assets/photos/memory-1.jpg", caption: "أول ذكرى", note: "تعليقك الشخصي هون" },
    // { src: "assets/photos/memory-2.jpg", caption: "ضحكتنا", note: "تعليق صغير عن الصورة" },
    // { src: "assets/photos/memory-3.jpg", caption: "يوم مميز", note: "ليش بتحب هاي اللحظة؟" },
  ],
  // استبدل النصوص التجريبية بالذكريات الحقيقية قبل مشاركة الرابط.
};

// ─── Helpers ───
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================================
// 1. SPLASH SCREEN
// ============================================================
(function initSplash() {
  const splash = $("#splash");
  if (!splash) return;

  // Wait for splash animation to play, then open curtains
  setTimeout(() => {
    splash.classList.add("open");
  }, 3500);

  // After curtains open, remove splash and start hero entrance
  setTimeout(() => {
    splash.classList.add("dismissed");
    triggerHeroEntrance();
    initParticles();
  }, 4900);
})();

// ============================================================
// 2. PARTICLE SYSTEM — Falling Petals
// ============================================================
function initParticles() {
  const canvas = $("#particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w, h;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const PETAL_COUNT = 35;
  const petals = [];
  const colors = [
    "rgba(244, 201, 205, 0.6)",   // pink
    "rgba(233, 226, 245, 0.5)",   // lavender
    "rgba(255, 241, 203, 0.5)",   // cream
    "rgba(199, 111, 128, 0.35)",  // rose
    "rgba(234, 217, 236, 0.5)",   // soft purple
  ];

  class Petal {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * w;
      this.y = initial ? Math.random() * -h : -20;
      this.size = Math.random() * 6 + 3;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 1.5 - 0.75;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    }
    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.5;
      this.rotation += this.rotSpeed;
      if (this.y > h + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Petal shape (teardrop-like ellipse)
      ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    petals.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================================
// 3. TYPEWRITER EFFECT
// ============================================================
function typeWriter(el, text, speed = 80, callback) {
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  type();
}

// ============================================================
// 4. HERO STAGGERED ENTRANCE
// ============================================================
function triggerHeroEntrance() {
  const items = $$(".hero-stagger");
  items.forEach((el) => {
    const delay = parseInt(el.dataset.delay || 0) * 180;
    setTimeout(() => el.classList.add("animate"), delay);
  });

  // Start typewriter after a brief pause
  setTimeout(() => {
    const twEl = $("#typewriter");
    if (twEl) {
      typeWriter(twEl, "كل عام وإنتِ\nأجمل حكاياتي ♡", 90, () => {
        // Hide cursor after typing
        const cursor = $(".typewriter-cursor");
        if (cursor) {
          setTimeout(() => { cursor.style.opacity = "0"; }, 1500);
        }
      });
    }
  }, 400);
}

// ============================================================
// 5. SCROLL REVEAL — IntersectionObserver
// ============================================================
(function initScrollReveal() {
  const reveals = $$(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children if they're reveal elements inside a grid
          const parent = entry.target.closest(".memory-grid, .extras-grid");
          if (parent) {
            const siblings = parent.querySelectorAll(".reveal");
            let idx = Array.from(siblings).indexOf(entry.target);
            setTimeout(() => entry.target.classList.add("revealed"), idx * 150);
          } else {
            entry.target.classList.add("revealed");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
})();

// ============================================================
// 6. TIMELINE LINE DRAWING
// ============================================================
(function initTimelineDraw() {
  const line = $("#timelineLine");
  if (!line) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          line.classList.add("drawn");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const timeline = $("#timeline");
  if (timeline) observer.observe(timeline);
})();

// ============================================================
// 7. NAVBAR SCROLL STATE
// ============================================================
(function initNavScroll() {
  const topbar = $("#topbar");
  if (!topbar) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        topbar.classList.toggle("scrolled", window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ============================================================
// 8. ENVELOPE — 3D Open/Close
// ============================================================
const envelope = $("#envelope");
const letterContent = $("#letterContent");
const toast = $("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 400);
  }, 2500);
}

if (envelope) {
  const handleEnvelopeOpen = () => {
    const isOpen = envelope.classList.toggle("open");
    envelope.setAttribute("aria-expanded", String(isOpen));
    letterContent.classList.toggle("hidden", !isOpen);
    if (isOpen) {
      showToast("من ئلبي إلك ♡");
      spawnFloatingHearts(envelope, 6);
    }
  };

  envelope.addEventListener("click", handleEnvelopeOpen);
}

// Open letter button
const openLetterBtn = $("#openLetter");
if (openLetterBtn) {
  openLetterBtn.addEventListener("click", () => {
    const letterSection = $("#letter");
    if (letterSection) letterSection.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      if (envelope && !envelope.classList.contains("open")) {
        envelope.classList.add("open");
        envelope.setAttribute("aria-expanded", "true");
        letterContent.classList.remove("hidden");
        showToast("رسالتك جاهزة للقراءة ♡");
        spawnFloatingHearts(envelope, 8);
      }
    }, 600);
  });
}

// ============================================================
// 9. FLOATING HEARTS
// ============================================================
function spawnFloatingHearts(target, count = 5) {
  const rect = target.getBoundingClientRect();
  const hearts = ["♡", "♥", "❤", "💗", "✿"];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = rect.left + Math.random() * rect.width + "px";
    heart.style.top = rect.top + Math.random() * rect.height * 0.5 + "px";
    heart.style.fontSize = Math.random() * 12 + 14 + "px";
    heart.style.animationDuration = Math.random() * 1 + 2 + "s";
    heart.style.animationDelay = Math.random() * 0.3 + "s";
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

// ============================================================
// 10. CONFETTI CANNON
// ============================================================
function launchConfetti() {
  const container = $("#confettiContainer");
  if (!container) return;

  const colors = [
    "#f4c9cd", "#c76f80", "#e9e2f5", "#fff1cb",
    "#ead9ec", "#b28ea9", "#8f4b60", "#ff9eb5",
    "#d4a5c9", "#a2a2c2", "#f7dce1",
  ];
  const count = 100;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = "50%";
    piece.style.top = "50%";
    piece.style.width = Math.random() * 8 + 5 + "px";
    piece.style.height = Math.random() * 8 + 5 + "px";
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    piece.style.setProperty("--x-end", (Math.random() - 0.5) * window.innerWidth * 0.8 + "px");
    piece.style.setProperty("--y-end", Math.random() * window.innerHeight * 0.7 + 100 + "px");
    piece.style.setProperty("--rot-end", Math.random() * 1080 - 540 + "deg");
    piece.style.setProperty("--fall-duration", Math.random() * 2 + 2 + "s");
    piece.style.setProperty("--fall-delay", Math.random() * 0.5 + "s");
    container.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

// ============================================================
// 11. PHOTO RENDERING (preserves original logic)
// ============================================================
function renderPhotos() {
  const grid = $("#memoryGrid");
  if (!CONFIG.photos.length || !grid) return;
  grid.innerHTML = "";
  CONFIG.photos.forEach((photo, idx) => {
    const card = document.createElement("article");
    card.className = "memory-card reveal";
    card.setAttribute("data-tilt", "");

    const frame = document.createElement("div");
    frame.className = "memory-photo";
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || "ذكرى جميلة";
    img.loading = "lazy";
    img.onerror = () => {
      frame.className = "memory-photo placeholder-photo";
      frame.style.background = `linear-gradient(145deg, #cf9eaa, #a2a2c2)`;
      frame.textContent = "تأكد من مسار الصورة";
    };
    frame.appendChild(img);

    const caption = document.createElement("p");
    caption.className = "memory-caption";
    caption.textContent = photo.caption || "ذكرى حلوة";
    const heart = document.createElement("span");
    heart.textContent = " ♡";
    caption.appendChild(heart);

    const note = document.createElement("small");
    note.textContent = photo.note || "";

    card.append(frame, caption, note);
    grid.appendChild(card);
  });

  // Re-observe new cards for reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  grid.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
renderPhotos();

// ============================================================
// 12. EXTRA CARDS — 3D Flip
// ============================================================
$$(".extra-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    if (card.classList.contains("flipped")) {
      spawnFloatingHearts(card, 3);
    }
  });
});

// ============================================================
// 13. FINAL BUTTON — Confetti + Reveal
// ============================================================
const finalBtn = $("#finalButton");
if (finalBtn) {
  finalBtn.addEventListener("click", () => {
    const hiddenMsg = $("#finalHidden");
    if (hiddenMsg) hiddenMsg.classList.remove("hidden");
    finalBtn.textContent = "انفتحت آخر مفاجأة ♡";
    finalBtn.disabled = true;
    finalBtn.style.opacity = ".8";

    // Launch confetti celebration!
    launchConfetti();
    spawnFloatingHearts(finalBtn, 10);

    // Second wave of confetti
    setTimeout(launchConfetti, 800);
  });
}

// ============================================================
// 14. MUSIC TOGGLE
// ============================================================
const musicBtn = $("#musicToggle");
const bgMusic = $("#bgMusic");

if (musicBtn && bgMusic) {
  musicBtn.addEventListener("click", () => {
    const cuteArrow = document.getElementById("cuteArrow");
    if (cuteArrow) cuteArrow.style.display = "none";
    
    if (bgMusic.paused) {
      bgMusic.play();
      musicBtn.classList.add("playing");
      showToast("🎶 تم تشغيل الموسيقى");
    } else {
      bgMusic.pause();
      musicBtn.classList.remove("playing");
      showToast("⏸️ تم إيقاف الموسيقى");
    }
  });
}

// ============================================================
// 15. VOICE PLAYER
// ============================================================
const voicePlayer = $("#voicePlayer");
if (voicePlayer) {
  voicePlayer.addEventListener("play", () => {
    if (bgMusic && !bgMusic.paused) {
      bgMusic.volume = 0.03;
    }
  });
  
  voicePlayer.addEventListener("pause", () => {
    if (bgMusic) {
      bgMusic.volume = 1.0;
    }
  });
  
  voicePlayer.addEventListener("ended", () => {
    if (bgMusic) {
      bgMusic.volume = 1.0;
    }
  });

  voicePlayer.addEventListener("error", () => {
    const hint = $("#audioHint");
    if (hint) hint.textContent = "حدث خطأ أثناء تحميل الصوت.";
  });
}

// ============================================================
// 16. CUSTOM CURSOR (Desktop Only)
// ============================================================
(function initCustomCursor() {
  const cursor = $("#customCursor");
  if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add("visible");
  });

  document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
  document.addEventListener("mouseup", () => cursor.classList.remove("clicking"));
  document.addEventListener("mouseleave", () => cursor.classList.remove("visible"));

  function updateCursor() {
    // Smooth follow
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
})();

// ============================================================
// 17. PARALLAX — Hero Art Mouse Move
// ============================================================
(function initParallax() {
  const heroArt = $("#heroArt");
  if (!heroArt || window.matchMedia("(pointer: coarse)").matches) return;

  const elements = heroArt.querySelectorAll(".parallax-el");

  document.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    elements.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.02;
      const x = dx * speed * 100;
      const y = dy * speed * 100;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
})();

// ============================================================
// 18. CARD TILT ON HOVER (Memory Cards)
// ============================================================
(function initCardTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotY = ((x - cx) / cx) * 8;
      const rotX = ((cy - y) / cy) * 8;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `rotate(var(--tilt, -1deg))`;
    });
  });
})();

// ============================================================
// 19. RIPPLE EFFECT ON BUTTONS
// ============================================================
$$(".primary-button").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    this.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

// ============================================================
// 20. TITLE UPDATE
// ============================================================
if (CONFIG.herName.trim()) {
  document.title = `إلى ${CONFIG.herName}، بكل الحب ♡`;
}

// Magic Polaroid Flip
const magicPolaroid = document.getElementById('magicPolaroid');
if (magicPolaroid) {
  magicPolaroid.addEventListener('click', function() {
    this.classList.toggle('flipped');
    if (this.classList.contains('flipped')) {
      if (typeof spawnFloatingHearts === 'function') {
        spawnFloatingHearts(this, 12);
      }
    }
  });
}
