// ========================
// Slider Initialization
// ========================
function initSlider(containerId, prevBtnId, nextBtnId, dotsId, interval = 5000) {
  const slider = document.getElementById(containerId);
  if (!slider) return;

  const slides = slider.querySelectorAll(".slide");
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const dotsContainer = document.getElementById(dotsId);

  let currentIndex = 0;
  let autoSlide;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }
    currentIndex = index;
  }

  function nextSlide() {
    const newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  }

  function prevSlide() {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  }

  // Setup navigation
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  // Setup dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => showSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  // Auto slide
  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, interval);
  }
  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  showSlide(0);
  startAutoSlide();
}

// Initialize sliders
document.addEventListener("DOMContentLoaded", () => {
  initSlider("slider", "prevBtn", "nextBtn", "sliderDots", 4000);
  initSlider("trusteeSlider", "trusteePrevBtn", "trusteeNextBtn", "trusteeSliderDots", 5000);
  initSlider("courseSlider", "coursePrevBtn", "courseNextBtn", "courseSliderDots", 5000);
});

// ========================
// Counter Animation
// ========================
function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const updateCount = () => {
      const current = +counter.innerText;
      const increment = Math.ceil(target / 200);
      if (current < target) {
        counter.innerText = current + increment;
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
}
window.addEventListener("scroll", () => {
  const countersSection = document.querySelector(".counters");
  if (countersSection) {
    const rect = countersSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && !countersSection.classList.contains("animated")) {
      countersSection.classList.add("animated");
      animateCounters();
    }
  }
});

// ========================
// Chart.js Impact Chart
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("impactChart");
  if (ctx) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["2023", "2024", "2025", "2026", "2027"],
        datasets: [{
          label: "Students Benefited",
          data: [800, 1500, 2500, 3500, 5000],
          backgroundColor: "#4CAF50"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
});

// ========================
// Fade-in Animation
// ========================
function handleScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", handleScrollAnimations);
window.addEventListener("load", handleScrollAnimations);

// ========================
// Mobile Navigation
// ========================
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.getElementById("mainNav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    mainNav.classList.toggle("open");
  });
}
