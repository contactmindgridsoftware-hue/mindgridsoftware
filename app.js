/**
 * ==========================================================================
 * MINDGRID SOFTWARE — APP CONTROLLER & INTERACTION LOGIC
 * ==========================================================================
 */

// 1. Backend Service Configuration (WCF Integration Layer)
const CONFIG = {
  // TOGGLE: Set to true when you want to connect to your live .NET WCF Service
  USE_WCF_BACKEND: false,

  // Base URL of your WCF Service (IIS Express or Production IIS endpoint)
  // Example WCF WebHttpBinding REST endpoint
  WCF_BASE_URL: 'http://localhost:50321/MindGridService.svc',

  // WCF Endpoints Map (RESTful JSON contract)
  ENDPOINTS: {
    getProjects: '/GetProjects',         // HTTP GET (returns JSON array of projects)
    getTestimonials: '/GetTestimonials', // HTTP GET (returns JSON array of testimonials)
    submitContact: '/SubmitContact'      // HTTP POST (receives JSON contact form object)
  },

  // WhatsApp click-to-chat redirect settings (opens WhatsApp with a pre-filled message)
  WHATSAPP: {
    ENABLED: false, // Set to true if you want to redirect the user to WhatsApp
    PHONE: '917667201734' // Recipient phone number (international format, no + or leading zeros)
  },

  // Email notification settings (sends a silent email in the background without redirecting)
  EMAIL: {
    ENABLED: true,
    ACCESS_KEY: '668a81d5-e67a-4feb-8c77-e51dfeb6b5b5' // Get a free access key at https://web3forms.com
  }
};

/**
 * WCF Service implementation guide in C# (.NET Framework / .NET Core CoreWCF):
 * 
 * [ServiceContract]
 * public interface IMindGridService {
 *     [OperationContract]
 *     [WebGet(UriTemplate = "/GetProjects", ResponseFormat = WebMessageFormat.Json)]
 *     List<ProjectDto> GetProjects();
 * 
 *     [OperationContract]
 *     [WebGet(UriTemplate = "/GetTestimonials", ResponseFormat = WebMessageFormat.Json)]
 *     List<TestimonialDto> GetTestimonials();
 * 
 *     [OperationContract]
 *     [WebInvoke(Method = "POST", UriTemplate = "/SubmitContact", 
 *                RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
 *     SubmitResult SubmitContact(ContactFormDto form);
 * }
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Page Scroll Animations
  initScrollAnimations();

  // Load Portfolio Projects
  loadPortfolio();

  // Load Testimonials Carousel
  loadTestimonials();

  // Initialize Stats Count-Up
  initStatsCounter();

  // Handle Contact Form Submission
  initContactForm();

  // Sticky Navbar background adjustment on scroll
  handleNavbarScroll();
});

/* ==========================================================================
   2. Sticky Navbar & Active Link Highlights
   ========================================================================== */
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
    highlightActiveSection();
  });
}

function highlightActiveSection() {
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  let currentActiveId = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentActiveId = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActiveId}`) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   3. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.fade-in-up');

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observerInstance.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   4. Local Fallback Data (for file:// protocol CORS restrictions)
   ========================================================================== */
const FALLBACK_DATA = {
  projects: [
  {
    "id": 1,
    "title": "Shop Portfolio Web Application",
    "category": "Web",
    "description": "A scalable, high-end e-commerce platform for clothing and jewelry, featuring an AI-driven recommendation engine built on .NET that suggests products based on user browsing habits.",
    "tech": ["ASP.NET Core MVC", "Entity Framework", "Azure OpenAI", "SQL Server"],
    "image": "images/portfolio_shop.jpg",
    "link": "case-study.html?id=1"
  },
  {
    "id": 2,
    "title": "School ERP System",
    "category": "Web",
    "description": "An integrated student and fee management system. Includes a machine learning module utilizing ML.NET to predict student dropout risks and optimize fee collection schedules.",
    "tech": ["Blazor WebAssembly", "ASP.NET Core API", "ML.NET", "PostgreSQL"],
    "image": "images/portfolio_school.jpg",
    "link": "case-study.html?id=2"
  },
  {
    "id": 3,
    "title": "Web & WhatsApp Bot with AI",
    "category": "AI",
    "description": "An automated customer support solution combining a modern web dashboard and a WhatsApp bot. Powered by Semantic Kernel and Azure AI to handle natural language queries.",
    "tech": ["C# .NET 8", "Semantic Kernel", "WhatsApp API", "Azure AI"],
    "image": "images/portfolio_bot.jpg",
    "link": "case-study.html?id=3"
  },
  {
    "id": 4,
    "title": "College Portfolio Builder",
    "category": "Web",
    "description": "An interactive platform for students to build professional portfolios. Leverages Azure AI Vision to automatically tag and categorize uploaded certificates and project screenshots.",
    "tech": ["ASP.NET Core", "React", "Azure AI Vision", "Cosmos DB"],
    "image": "images/portfolio_college.jpg",
    "link": "case-study.html?id=4"
  },
  {
    "id": 5,
    "title": "Custom Web Application",
    "category": "Cloud",
    "description": "A highly modular enterprise web application custom-built for specific client requirements. Features AI-powered data visualization and automated report generation via natural language.",
    "tech": ["C# Microservices", "OpenAI API", "Redis", "Docker"],
    "image": "images/portfolio_custom.jpg",
    "link": "case-study.html?id=5"
  }
]
,
  testimonials: [
    {
      "quote": "MindGrid Software delivered our core transaction ledger system three weeks ahead of schedule. Their technical architecture is sound, and their engineers integrated seamlessly with our internal security and compliance teams.",
      "clientName": "Rajesh Subramanian",
      "company": "Chief Technology Officer, Vertex Assets"
    },
    {
      "quote": "Their cloud-native architecture review and implementation helped us scale our logistics pipeline during peak holiday demand without a single second of downtime. An exceptional engineering partner.",
      "clientName": "Priya Nair",
      "company": "VP of Engineering, LogiSpeed India"
    },
    {
      "quote": "The predictive forecasting models developed by MindGrid have transformed how we plan our retail inventory. We have seen a direct, measurable reduction in holding costs and out-of-stock scenarios.",
      "clientName": "David Miller",
      "company": "Director of Supply Chain, Apex Retail Group"
    },
    {
      "quote": "Developing a HIPAA-compliant app requires deep attention to detail. MindGrid exceeded our expectations, delivering an intuitive, fully encrypted platform that our doctors and patients love.",
      "clientName": "Dr. Amit Verma",
      "company": "Co-Founder, CareConnect Health"
    }
  ],
  contactResponse: {
    "success": true,
    "message": "Thank you! Your discovery call request has been sent successfully. Our solutions team will contact you within 24 business hours (Loaded from Local Mock)."
  }
};

/* ==========================================================================
   5. Portfolio Dynamics & AJAX Filtering
   ========================================================================== */
let allProjects = [];

async function loadPortfolio() {
  const gridContainer = document.getElementById('portfolio-grid');

  // Show skeleton loader spinner
  gridContainer.innerHTML = `
    <div class="skeleton-loader" id="portfolio-loader">
      <div class="spinner-border skeleton-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Retrieving selected work...</p>
    </div>
  `;

  try {
    let data;
    if (CONFIG.USE_WCF_BACKEND) {
      const response = await fetch(`${CONFIG.WCF_BASE_URL}${CONFIG.ENDPOINTS.getProjects}`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      data = await response.json();
    } else {
      // Fetch local mock projects.json
      try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        data = await response.json();
      } catch (localFetchError) {
        // Fallback for file:// protocol
        console.warn('Local projects fetch failed (possibly file:// protocol restriction). Using fallback data.');
        data = FALLBACK_DATA.projects;
      }
    }

    allProjects = data;
    renderProjects(allProjects);
    initPortfolioFilters();
  } catch (error) {
    console.error('Failed to load portfolio:', error);
    gridContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-exclamation-triangle text-danger fs-1"></i>
        <p class="mt-3 text-muted">Could not retrieve portfolio items. Please check the network connection.</p>
      </div>
    `;
  }
}

function renderProjects(projects) {
  const gridContainer = document.getElementById('portfolio-grid');
  gridContainer.innerHTML = '';

  if (projects.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">No projects found in this category.</p>
      </div>
    `;
    return;
  }

  projects.forEach(project => {
    // Generate Bootstrap Icons based on category
    let iconClass = 'bi-laptop';
    if (project.category === 'Mobile') iconClass = 'bi-phone';
    if (project.category === 'AI') iconClass = 'bi-cpu';
    if (project.category === 'Cloud') iconClass = 'bi-cloud-arrow-up';

    const techPills = project.tech.map(t => `<span class="portfolio-tag">${t}</span>`).join('');

    const bgImage = project.image ? `background-image: url('${project.image}'); background-size: cover; background-position: center;` : '';
    const overlay = project.image ? `<div style="background: rgba(0,0,0,0.5); width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 0;"></div>` : '';
    const iconStyle = project.image ? 'color: white; z-index: 1; text-shadow: 0 2px 4px rgba(0,0,0,0.5);' : '';

    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="portfolio-card">
        <div class="portfolio-card-header" style="${bgImage}">
          ${overlay}
          <span class="category-badge" style="z-index: 1;">${project.category}</span>
          <i class="bi ${iconClass} portfolio-header-icon" style="${iconStyle}"></i>
        </div>
        <div class="portfolio-card-body">
          <h3 class="portfolio-card-title">${project.title}</h3>
          <p class="portfolio-card-desc">${project.description}</p>
          
          <a href="#" onclick="openCaseStudyModal(${project.id}); return false;" class="portfolio-link">
            View Case Study <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    gridContainer.appendChild(col);
  });
}

function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.portfolio-tab-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filterVal = e.target.getAttribute('data-filter');
      if (filterVal === 'All') {
        renderProjects(allProjects);
      } else {
        const filtered = allProjects.filter(p => p.category.toLowerCase() === filterVal.toLowerCase());
        renderProjects(filtered);
      }
    });
  });
}

/* ==========================================================================
   6. Testimonials Carousel AJAX Load
   ========================================================================== */
async function loadTestimonials() {
  const carouselInner = document.getElementById('testimonials-carousel-inner');
  if (!carouselInner) return;

  try {
    let data;
    if (CONFIG.USE_WCF_BACKEND) {
      const response = await fetch(`${CONFIG.WCF_BASE_URL}${CONFIG.ENDPOINTS.getTestimonials}`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      data = await response.json();
    } else {
      // Fetch local mock testimonials.json
      try {
        const response = await fetch('testimonials.json');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        data = await response.json();
      } catch (localFetchError) {
        // Fallback for file:// protocol
        console.warn('Local testimonials fetch failed. Using fallback data.');
        data = FALLBACK_DATA.testimonials;
      }
    }

    carouselInner.innerHTML = '';

    data.forEach((test, index) => {
      const activeClass = index === 0 ? 'active' : '';
      const slide = document.createElement('div');
      slide.className = `carousel-item ${activeClass}`;
      slide.innerHTML = `
        <div class="testimonial-item">
          <blockquote class="testimonial-quote">
            "${test.quote}"
          </blockquote>
          <h4 class="testimonial-author">${test.clientName}</h4>
          <p class="testimonial-company">${test.company}</p>
        </div>
      `;
      carouselInner.appendChild(slide);
    });

  } catch (error) {
    console.error('Failed to load testimonials:', error);
    carouselInner.innerHTML = `
      <div class="carousel-item active">
        <div class="testimonial-item text-center">
          <p class="text-muted">Testimonials are currently unavailable.</p>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   7. Stats Section Count-Up Animation (IntersectionObserver)
   ========================================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('stats-section');
  if (!statsSection) return;

  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          animateCountUp(stat);
        });
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

function animateCountUp(element) {
  const targetText = element.getAttribute('data-target');
  const target = parseInt(targetText, 10);
  const isPlus = targetText.includes('+');
  const isPercent = targetText.includes('%');

  let current = 0;
  const duration = 1200; // 1.2 seconds count duration
  const frameRate = 1000 / 60; // 60 FPS
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    // Ease out cubic multiplier
    const progress = frame / totalFrames;
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    current = Math.round(easeProgress * target);

    if (frame >= totalFrames) {
      current = target;
      clearInterval(counter);
    }

    let suffix = '';
    if (isPlus) suffix = '+';
    if (isPercent) suffix = '%';

    element.textContent = `${current}${suffix}`;
  }, frameRate);
}

/* ==========================================================================
   8. Contact Form Handler (AJAX Submit)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Perform validation check
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      showToast('danger', 'Please correct the fields in the form before submitting.');
      return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Sending Message...
    `;

    // Gather Form Data
    const formData = {
      name: document.getElementById('contactName').value.trim(),
      email: document.getElementById('contactEmail').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      service: document.getElementById('contactService').value,
      message: document.getElementById('contactMessage').value.trim()
    };

    try {
      let result;
      if (CONFIG.USE_WCF_BACKEND) {
        // Real connection to WCF REST Endpoint
        const response = await fetch(`${CONFIG.WCF_BASE_URL}${CONFIG.ENDPOINTS.submitContact}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('WCF Service connection failed');
        result = await response.json();
      } else {
        // Send email in the background via Web3Forms (does not redirect)
        if (CONFIG.EMAIL && CONFIG.EMAIL.ENABLED && CONFIG.EMAIL.ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
          try {
            const emailResponse = await fetch('https://api.web3forms.com/submit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                access_key: CONFIG.EMAIL.ACCESS_KEY,
                subject: `New MindGrid Lead from ${formData.name}`,
                from_name: 'MindGrid Portfolio Website',
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                service: formData.service,
                message: formData.message
              })
            });
            const emailResult = await emailResponse.json();
            if (!emailResult.success) {
              console.error('Web3Forms failed:', emailResult);
            }
          } catch (err) {
            console.error('Web3Forms background transfer error:', err);
          }
        }

        // Fetch local contact_response.json file as request result
        try {
          const response = await fetch('contact_response.json');
          if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
          result = await response.json();
        } catch (localFetchError) {
          // Fallback if local file:// protocol prevents loading
          console.warn('Local contact_response fetch failed. Using fallback data.');
          result = FALLBACK_DATA.contactResponse;
        }
      }

      if (result.success) {
        showToast('success', result.message || 'Message sent successfully!');

        // Redirect to WhatsApp automatically if configured
        if (CONFIG.WHATSAPP && CONFIG.WHATSAPP.ENABLED) {
          const waMessageText = `*New MindGrid Inquiry*\n\n` +
            `*Name:* ${formData.name}\n` +
            `*Email:* ${formData.email}\n` +
            `*Phone:* ${formData.phone}\n` +
            `*Requested Service:* ${formData.service}\n\n` +
            `*Project Brief / Challenge:*\n${formData.message}`;

          const waUrl = `https://wa.me/${CONFIG.WHATSAPP.PHONE}?text=${encodeURIComponent(waMessageText)}`;

          // Open WhatsApp web/app in a new window/tab after a short delay so the toast is readable
          setTimeout(() => {
            window.open(waUrl, '_blank');
          }, 1500);
        }

        form.reset();
        form.classList.remove('was-validated');
      } else {
        showToast('danger', result.message || 'Failed to submit form. Please check input values.');
      }

    } catch (error) {
      console.error('Contact submission error:', error);
      showToast('danger', 'An error occurred while sending your message. Please verify network access.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* ==========================================================================
   9. Alert Notification Toast Display Helper
   ========================================================================== */
function showToast(type, message) {
  // Check if container exists, else create it
  let container = document.getElementById('toast-container-custom');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container-custom';
    container.className = 'alert-toast-container';
    document.body.appendChild(container);
  }

  const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
  const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';

  const alertBox = document.createElement('div');
  alertBox.className = `alert ${alertClass} alert-dismissible fade show shadow-lg border-0 d-flex align-items-center py-3 pe-5`;
  alertBox.style.borderRadius = '8px';
  alertBox.style.minWidth = '300px';
  alertBox.style.transition = 'all 0.3s ease';

  alertBox.innerHTML = `
    <i class="bi ${iconClass} me-3 fs-5"></i>
    <div>${message}</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  container.appendChild(alertBox);

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    alertBox.classList.remove('show');
    setTimeout(() => {
      alertBox.remove();
    }, 300);
  }, 5000);
}

/* ==========================================================================
   10. Case Study Modal Logic
   ========================================================================== */
window.openCaseStudyModal = function(id) {
  const project = allProjects.find(p => p.id === id);
  if(!project) return;
  
  document.getElementById('csModalTitle').textContent = project.title;
  document.getElementById('csModalCategory').textContent = project.category.toUpperCase();
  document.getElementById('csModalDesc').innerHTML = project.caseStudyDetails || project.description;
  
  if(project.image) {
    document.getElementById('csModalImageContainer').style.backgroundImage = `url('${project.image}')`;
    document.getElementById('csModalImageContainer').style.display = 'block';
  } else {
    document.getElementById('csModalImageContainer').style.display = 'none';
  }
  
  document.getElementById('csModalTech').innerHTML = project.tech.map(t => `<span class="portfolio-tag">${t}</span>`).join('');
  
  const modal = new bootstrap.Modal(document.getElementById('caseStudyModal'));
  modal.show();
}


/* ==========================================================================
   11. Pricing Calculator
   ========================================================================== */
window.calculateTotal = function() {
  const inputs = document.querySelectorAll('.pricing-calc-input');
  let total = 0;
  inputs.forEach(input => {
    if(input.checked) {
      total += parseInt(input.getAttribute('data-price'));
    }
  });
  document.getElementById('pricingTotal').innerText = '₹' + total.toLocaleString('en-IN');
};

/* ==========================================================================
   12. AI Chatbot Widget Logic
   ========================================================================== */
window.toggleChatbot = function() {
  const win = document.getElementById('chatbotWindow');
  if(win.style.display === 'none') {
    win.style.display = 'flex';
    document.getElementById('chatbotInput').focus();
  } else {
    win.style.display = 'none';
  }
};

window.sendChat = function() {
  const input = document.getElementById('chatbotInput');
  const msg = input.value.trim();
  if(!msg) return;
  
  const container = document.getElementById('chatbotMessages');
  
  // User message
  const userDiv = document.createElement('div');
  userDiv.className = 'user-msg';
  userDiv.innerText = msg;
  container.appendChild(userDiv);
  input.value = '';
  container.scrollTop = container.scrollHeight;
  
  // Fake Bot Delay
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'bot-msg';
    botDiv.innerText = 'Thanks for reaching out! A MindGrid AI specialist will respond to you shortly.';
    container.appendChild(botDiv);
    container.scrollTop = container.scrollHeight;
  }, 1000);
};

window.handleChatInput = function(e) {
  if(e.key === 'Enter') {
    sendChat();
  }
};

/* ==========================================================================
   13. WhatsApp Sales Integration
   ========================================================================== */
window.contactSalesWhatsApp = function() {
  // Hide pricing modal
  const pricingModalEl = document.getElementById('pricingModal');
  const pricingModal = bootstrap.Modal.getInstance(pricingModalEl) || new bootstrap.Modal(pricingModalEl);
  pricingModal.hide();
  
  // Show details modal
  const contactModal = new bootstrap.Modal(document.getElementById('contactSalesModal'));
  contactModal.show();
};

window.submitToWhatsApp = function() {
  const nameInput = document.getElementById('salesName');
  const phoneInput = document.getElementById('salesPhone');
  const emailInput = document.getElementById('salesEmail');
  const reqsInput = document.getElementById('salesReqs');
  
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const upgrade = document.getElementById('salesUpgrade').value;
  const requirements = reqsInput.value.trim();

  let isValid = true;
  
  // Name Validation
  if(!name) {
    nameInput.classList.add('is-invalid');
    document.getElementById('salesNameError').classList.remove('d-none');
    document.getElementById('salesNameError').classList.add('d-block');
    isValid = false;
  } else {
    nameInput.classList.remove('is-invalid');
    document.getElementById('salesNameError').classList.remove('d-block');
    document.getElementById('salesNameError').classList.add('d-none');
  }

  // Phone Validation (Basic 10 digits check)
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if(!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
    phoneInput.classList.add('is-invalid');
    document.getElementById('salesPhoneError').classList.remove('d-none');
    document.getElementById('salesPhoneError').classList.add('d-block');
    isValid = false;
  } else {
    phoneInput.classList.remove('is-invalid');
    document.getElementById('salesPhoneError').classList.remove('d-block');
    document.getElementById('salesPhoneError').classList.add('d-none');
  }

  // Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!email || !emailRegex.test(email)) {
    emailInput.classList.add('is-invalid');
    document.getElementById('salesEmailError').classList.remove('d-none');
    document.getElementById('salesEmailError').classList.add('d-block');
    isValid = false;
  } else {
    emailInput.classList.remove('is-invalid');
    document.getElementById('salesEmailError').classList.remove('d-block');
    document.getElementById('salesEmailError').classList.add('d-none');
  }

  // Requirements Validation
  if(!requirements) {
    reqsInput.classList.add('is-invalid');
    document.getElementById('salesReqsError').classList.remove('d-none');
    document.getElementById('salesReqsError').classList.add('d-block');
    isValid = false;
  } else {
    reqsInput.classList.remove('is-invalid');
    document.getElementById('salesReqsError').classList.remove('d-block');
    document.getElementById('salesReqsError').classList.add('d-none');
  }

  if(!isValid) return;

  const inputs = document.querySelectorAll('.pricing-calc-input');
  let total = 0;
  let features = [];
  
  const baseTitle = document.getElementById('baseAppTitle').innerText;
  
  // Base Application
  if(inputs[0] && inputs[0].checked) {
    total += parseInt(inputs[0].getAttribute('data-price'));
    features.push(baseTitle);
  }
  // AI Chatbot
  if(inputs[1] && inputs[1].checked) {
    total += parseInt(inputs[1].getAttribute('data-price'));
    features.push("AI Chatbot Integration");
  }
  // Admin Dashboard
  if(inputs[2] && inputs[2].checked) {
    total += parseInt(inputs[2].getAttribute('data-price'));
    features.push("Advanced Admin Dashboard");
  }
  
  const formattedTotal = '₹' + total.toLocaleString('en-IN');
  const message = `Hello MindGrid Software Sales Team! I am interested in a Custom Plan.

*Contact Details:*
Name: ${name}
Phone: ${phone}
Email: ${email}

*Project Requirements:*
${requirements}

*Future Upgrade Plans:* ${upgrade}

*Features Selected:*
- ${features.join('\n- ')}

*Estimated Total:* ${formattedTotal}

Please let me know how we can proceed!`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // Randomly distribute leads, but prevent sending to the user's own number (if a sales rep is testing)
  const normalizedUserPhone = phone.replace(/\D/g, '').slice(-10);
  const salesNumbers = ['917667201734', '919514302850'];
  let selectedNumber = salesNumbers[Math.floor(Math.random() * salesNumbers.length)];
  
  if (selectedNumber.endsWith(normalizedUserPhone)) {
    selectedNumber = salesNumbers.find(num => !num.endsWith(normalizedUserPhone)) || salesNumbers[0];
  }
  
  const whatsappUrl = `https://wa.me/${selectedNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
  
  // Hide modal
  const contactModalEl = document.getElementById('contactSalesModal');
  const contactModal = bootstrap.Modal.getInstance(contactModalEl);
  if (contactModal) contactModal.hide();
};

window.openDynamicPricingModal = function(planName, basePrice) {
  // Update the modal's Base Application title and price
  document.getElementById('baseAppTitle').innerText = planName;
  
  const baseToggle = document.getElementById('baseAppToggle');
  baseToggle.setAttribute('data-price', basePrice);
  
  // Reset other toggles
  const inputs = document.querySelectorAll('.pricing-calc-input');
  if(inputs[1]) inputs[1].checked = false;
  if(inputs[2]) inputs[2].checked = false;
  
  // Recalculate total
  calculateTotal();
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('pricingModal'));
  modal.show();
};
