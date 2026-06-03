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
      "title": "FinTech Core Ledger Platform",
      "category": "Web",
      "description": "High-throughput transaction ledger and client dashboard built for an enterprise asset management firm, featuring real-time settlement and compliance reporting.",
      "tech": ["ASP.NET Core", "React", "SQL Server", "Redis"],
      "link": "#"
    },
    {
      "id": 2,
      "title": "Predictive Demand Forecasting Engine",
      "category": "AI",
      "description": "Machine learning system integrated with a global supply chain to forecast retail inventory requirements, reducing waste by 22% using advanced regression models.",
      "tech": ["Python", "TensorFlow", "AWS SageMaker", "PostgreSQL"],
      "link": "#"
    },
    {
      "id": 3,
      "title": "Healthcare Telemedicine Mobile App",
      "category": "Mobile",
      "description": "HIPAA-compliant native iOS and Android application with end-to-end encrypted video consultations, electronic prescriptions, and appointment scheduling.",
      "tech": ["Flutter", "Dart", "Firebase", "WebRTC"],
      "link": "#"
    },
    {
      "id": 4,
      "title": "Cloud-Native Logistics Orchestrator",
      "category": "Cloud",
      "description": "Serverless microservices architecture handling fleet routing, GPS tracking, and delivery dispatch for a pan-India third-party logistics provider.",
      "tech": ["AWS Lambda", "Node.js", "DynamoDB", "Terraform"],
      "link": "#"
    },
    {
      "id": 5,
      "title": "Autonomous Clinical Trial Analytics",
      "category": "AI",
      "description": "Natural language processing platform analyzing medical reports to accelerate patient cohort selection for multi-phase clinical oncology trials.",
      "tech": ["Python", "PyTorch", "FastAPI", "MongoDB"],
      "link": "#"
    },
    {
      "id": 6,
      "title": "Retail Omnichannel POS Portal",
      "category": "Web",
      "description": "Cloud-synchronized point of sale system with offline capability, real-time inventory updates, and multi-tenant store management consoles.",
      "tech": ["Vue.js", "Express", "SQLite", "Docker"],
      "link": "#"
    }
  ],
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

    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="portfolio-card">
        <div class="portfolio-card-header">
          <span class="category-badge">${project.category}</span>
          <i class="bi ${iconClass} portfolio-header-icon"></i>
        </div>
        <div class="portfolio-card-body">
          <h3 class="portfolio-card-title">${project.title}</h3>
          <p class="portfolio-card-desc">${project.description}</p>
          <div class="portfolio-tags">${techPills}</div>
          <a href="${project.link}" class="portfolio-link">
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

