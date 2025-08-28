/* Global UI behavior: nav toggle + sliders + form handling */

/* NAV TOGGLE (per page identifiers) */
function setupNav(toggleId, navId) {
  const btn = document.getElementById(toggleId);
  const nav = document.getElementById(navId);
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const showing = nav.style.display === 'flex' || nav.style.display === 'block';
    nav.style.display = showing ? 'none' : 'flex';
  });
}
/* Setup toggles for possible pages */
setupNav('navToggle', 'mainNav');
setupNav('navToggleAbout', 'mainNavAbout');
setupNav('navToggleCourses', 'mainNavCourses');
setupNav('navToggleContact', 'mainNavContact');

/* SIMPLE SLIDER: supports multiple sliders on page */
class SimpleSlider {
  constructor(root) {
    this.root = root;
    this.slidesEl = root.querySelector('.slides');
    this.slides = Array.from(root.querySelectorAll('.slide'));
    this.prev = root.querySelector('.slider-btn.prev');
    this.next = root.querySelector('.slider-btn.next');
    this.dotsEl = root.querySelector('.dots');
    this.index = 0;

    // responsive multiple-per-view handling
    this.updateView();
    window.addEventListener('resize', () => this.updateView());

    if (this.prev) this.prev.addEventListener('click', () => this.move(this.index - 1));
    if (this.next) this.next.addEventListener('click', () => this.move(this.index + 1));

    this.createDots();
    this.move(0);
  }

  updateView(){
    // If viewport wide enough and slider type is "courses" we show 2 per view
    const type = this.root.dataset.type;
    this.perView = (window.innerWidth > 880 && type === 'courses') ? 2 : 1;
    // set slide width via transform calculations (CSS handles sizing)
  }

  createDots(){
    if (!this.dotsEl) return;
    this.dotsEl.innerHTML = '';
    const pages = Math.max(1, Math.ceil(this.slides.length / this.perView));
    for (let i=0;i<pages;i++){
      const btn = document.createElement('button');
      btn.addEventListener('click', () => this.move(i * this.perView));
      this.dotsEl.appendChild(btn);
    }
    this.updateDots();
  }

  updateDots(){
    if (!this.dotsEl) return;
    const dots = Array.from(this.dotsEl.children);
    const pages = Math.ceil(this.slides.length / this.perView);
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === Math.floor(this.index / this.perView));
    });
  }

  move(newIndex){
    const maxIndex = Math.max(0, this.slides.length - this.perView);
    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;
    this.index = newIndex;
    const offset = this.slides[0].offsetWidth + parseInt(getComputedStyle(this.slides[0]).gap || 12);
    const translateX = -(this.index * this.slides[0].offsetWidth + (this.index * 12));
    // Use percentage transform so it behaves responsively
    const percentage = -(this.index * (100 / this.perView));
    this.slidesEl.style.transform = `translateX(${percentage}%)`;
    this.updateDots();
  }
}

/* Initialize all sliders on page */
document.addEventListener('DOMContentLoaded', () => {
  const sliders = Array.from(document.querySelectorAll('.slider'));
  sliders.forEach(s => new SimpleSlider(s));
});

/* Enquiry Form handling (Contact page)
   - Currently client-only: shows success and resets form
   - To persist/store, send POST to your backend:
       Example Flask (Python) endpoint:
         @app.route('/api/enquiry', methods=['POST'])
         def enquiry():
             data = request.json
             # validate & save to DB / send email
             return jsonify({"ok":True}), 201

       Example Java (Spring Boot):
         @PostMapping("/api/enquiry")
         public ResponseEntity<?> enquiry(@RequestBody EnquiryDto dto){
             // save & return
             return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true));
         }
*/
const form = document.getElementById('enquiryForm');
if (form) {
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      document.getElementById('formMessage').textContent = 'Please complete all fields.';
      return;
    }

    // Client-only success for now:
    document.getElementById('formMessage').textContent = 'Thank you! Your enquiry has been submitted.';
    form.reset();

    /* Uncomment and change URL to send data to backend:
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name, email, message})
      });
      if (res.ok) {
        document.getElementById('formMessage').textContent = 'Thank you! Your enquiry has been submitted.';
        form.reset();
      } else {
        document.getElementById('formMessage').textContent = 'Submission failed. Please try again later.';
      }
    } catch (err) {
      document.getElementById('formMessage').textContent = 'Submission failed. Please check your connection.';
    }
    */
  });
}
