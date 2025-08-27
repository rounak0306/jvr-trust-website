document.getElementById("enquiryForm").addEventListener("submit", function(e) {
  e.preventDefault();

  document.getElementById("formMessage").textContent = "Thank you! Your enquiry has been submitted.";
  this.reset();

  // In future: connect this form to Email/Database via backend (PHP/Node.js)
});
