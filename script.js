/* Global nav toggle */
document.querySelectorAll(".nav-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.id.replace("navToggle", "mainNav");
    const nav = document.getElementById(target);
    if (!nav) return;
    nav.classList.toggle("open");
  });
});

/* Initialize sliders on page */
function setupSlider(sliderId, opts = {}) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const slidesTrack = slider.querySelector(".slides");
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const dotsContainer = slider.querySelector(".dots");

  let index = 0;
  let autoTimer = null;
  const delay = opts.delay || 5000;
  const slideCount = slides.length;

  // create dots
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot";
    if (i === 0) d.classList.add("active");
    d.addEventListener("click", () => {
      goTo(i);
      restartAuto();
    });
    dotsContainer.appendChild(d);
  });
  const dots = Array.from(dotsContainer.children);

  // set active classes
  function setActive(i) {
    slides.forEach((s, idx) => {
      s.classList.toggle("active", idx === i);
    });
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }

  function goTo(i, smooth = true) {
    index = ((i % slideCount) + slideCount) % slideCount;
    const left = slidesTrack.clientWidth * index;
    slidesTrack.scrollTo({ left: left, behavior: smooth ? "smooth" : "auto" });
    setActive(index);
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  nextBtn && nextBtn.addEventListener("click", () => { next(); restartAuto(); });
  prevBtn && prevBtn.addEventListener("click", () => { prev(); restartAuto(); });

  // Auto slide
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => { next(); }, delay);
  }
  function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
  function restartAuto() { stopAuto(); startAuto(); }

  // Swipe detection (touch)
  let startX = 0;
  slidesTrack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stopAuto();
  }, {passive:true});

  slidesTrack.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); else prev();
    }
    restartAuto();
  });

  // Update index on manual scroll (snapping)
  let scrollTimeout = null;
  slidesTrack.addEventListener("scroll", () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const i = Math.round(slidesTrack.scrollLeft / slidesTrack.clientWidth);
      if (i !== index) {
        index = i;
        setActive(index);
      }
    }, 80);
  });

  // init
  goTo(0, false);
  startAuto();

  // expose for debugging (optional)
  slider._goTo = goTo;
  slider._startAuto = startAuto;
  slider._stopAuto = stopAuto;
}

/* Init the two main sliders if present */
setupSlider("trusteeSlider", { delay: 5000 });
setupSlider("courseSlider", { delay: 6000 });
