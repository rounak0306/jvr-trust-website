// Helper: throttle
function throttle(fn, wait=100){
  let t=0; return (...args)=>{const now=Date.now(); if(now-t>=wait){t=now; fn(...args);} };
}

document.addEventListener("DOMContentLoaded", () => {
  /* ====== Mobile Nav ====== */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav){
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ====== Counters (once visible) ====== */
  const counters = document.querySelectorAll(".counter");
  const runCounters = () => {
    counters.forEach(counter => {
      const target = Number(counter.dataset.target || 0);
      let val = 0;
      const step = Math.max(1, Math.ceil(target / 160));
      const tick = () => {
        val += step;
        if (val < target) {
          counter.textContent = val.toLocaleString();
          requestAnimationFrame(tick);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };
      tick();
    });
  };
  const countersSection = document.querySelector(".counters");
  if (countersSection){
    let started = false;
    const onScroll = () => {
      const top = countersSection.getBoundingClientRect().top;
      if(!started && top < window.innerHeight - 60){
        started = true; runCounters(); window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive:true }); onScroll();
  }

  /* ====== Fade-in Observer ====== */
  const faders = document.querySelectorAll(".fade-in");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("appear"); io.unobserve(e.target); } });
  }, { threshold:.25, rootMargin:"0px 0px -80px 0px" });
  faders.forEach(el => io.observe(el));

  /* ====== Chart.js (Impact) ====== */
  const ctx = document.getElementById("impactChart");
  if (ctx){
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["2025","2026","2027","2028","2029","2030"],
        datasets: [
          { label:"Colleges Planned", data:[2,4,6,8,9,10], backgroundColor:"rgba(46,204,113,0.7)" },
          { label:"Students Benefited", data:[500,1200,2000,3000,4000,5000], backgroundColor:"rgba(52,152,219,0.7)" },
          { label:"Scholarships", data:[20,50,80,120,160,200], backgroundColor:"rgba(241,196,15,0.7)" }
        ]
      },
      options: { responsive:true, plugins:{ legend:{ position:"top" }}, scales:{ y:{ beginAtZero:true } } }
    });
  }

  /* ====== Modern Carousel: scroll-snap + auto + arrows + dots + swipe ====== */
  const slider = document.getElementById("slider");
  if (slider){
    const slides = Array.from(slider.querySelectorAll(".slide"));
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsWrap = document.getElementById("sliderDots");
    let current = 0;
    let timer = null;
    let width = slider.clientWidth;

    // Build dots
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("role","tab");
      b.setAttribute("aria-label",`Go to slide ${i+1}`);
      if (i===0) b.classList.add("active");
      dotsWrap.appendChild(b);
      b.addEventListener("click", () => goTo(i, true));
    });
    const dots = Array.from(dotsWrap.querySelectorAll("button"));

    // Update UI
    function updateUI(){
      slides.forEach((s,i)=> s.classList.toggle("active", i===current));
      dots.forEach((d,i)=> d.classList.toggle("active", i===current));
    }

    // Programmatic scroll
    function goTo(i, user=false){
      current = (i + slides.length) % slides.length;
      slider.scrollTo({ left: current * width, behavior:"smooth" });
      updateUI();
      if (user) resetAuto();
    }

    // Autoslide
    function startAuto(){ timer = setInterval(()=> goTo(current+1, false), 5000); }
    function resetAuto(){ clearInterval(timer); startAuto(); }

    // Resize handling for perfect snap
    const ro = new ResizeObserver(() => {
      width = slider.clientWidth;
      // re-snap to exact boundary to avoid sub-pixel drift
      slider.scrollTo({ left: current * width, behavior:"instant" in window ? "instant" : "auto" });
    });
    ro.observe(slider);

    // Keyboard
    [prevBtn, nextBtn].forEach(btn => btn && btn.addEventListener("click", () => {
      goTo(btn === prevBtn ? current-1 : current+1, true);
    }));
    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") goTo(current-1, true);
      if (e.key === "ArrowRight") goTo(current+1, true);
    });

    // Drag / Swipe with pointer events (iOS + Android + desktop)
    let isDown=false, startX=0, startScroll=0;
    const disableSnap = () => slider.style.scrollSnapType = "none";
    const enableSnap  = () => slider.style.scrollSnapType = "x mandatory";

    slider.addEventListener("pointerdown", e => {
      isDown = true; slider.setPointerCapture(e.pointerId);
      startX = e.clientX; startScroll = slider.scrollLeft; disableSnap(); clearInterval(timer);
    });
    slider.addEventListener("pointermove", e => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      slider.scrollLeft = startScroll - dx;
    });
    const onPointerUp = e => {
      if (!isDown) return; isDown = false; enableSnap();
      const index = Math.round(slider.scrollLeft / width);
      goTo(index, true);
    };
    slider.addEventListener("pointerup", onPointerUp);
    slider.addEventListener("pointercancel", onPointerUp);
    slider.addEventListener("pointerleave", onPointerUp);

    // Sync active slide when user scrolls inertially
    slider.addEventListener("scroll", throttle(() => {
      const index = Math.round(slider.scrollLeft / width);
      if (index !== current){ current = index; updateUI(); }
    }, 120), { passive:true });

    // Pause on hover (desktop)
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", () => resetAuto());

    // Init
    updateUI(); startAuto();
  }
});
