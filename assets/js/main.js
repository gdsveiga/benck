/**
 * BENCK. - Main JavaScript
 * Bold Editorial Design System
 */

(function() {
  'use strict';

  // ============================================
  // Utility Functions
  // ============================================

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  // ============================================
  // Navigation
  // ============================================

  const nav = document.querySelector('body > nav');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Scroll handler for navigation
  const handleNavScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll(); // Initial check

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // Smooth Scroll
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Scroll Animations with Intersection Observer
  // ============================================

  const animateElements = document.querySelectorAll('[data-animate]');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => {
    animationObserver.observe(el);
  });

  // ============================================
  // Hero Animations - Trigger on load
  // ============================================

  window.addEventListener('load', () => {
    // Animate hero elements immediately
    const heroAnimations = document.querySelectorAll('.hero [data-animate]');
    heroAnimations.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animated');
      }, index * 100);
    });
  });

  // ============================================
  // Parallax Effect for Hero Background Text
  // ============================================

  const heroBgText = document.querySelector('.hero-bg-text');

  if (heroBgText) {
    const handleParallax = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.3;
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
    };

    window.addEventListener('scroll', debounce(handleParallax, 10));
  }

  // ============================================
  // Service Items - Hover effect enhancement
  // ============================================

  const serviceItems = document.querySelectorAll('.service-item');

  serviceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '10';
    });

    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '1';
    });
  });

  // ============================================
  // Counter Animation for Stats
  // ============================================

  const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const isPercentage = element.textContent.includes('%');
    const hasPlus = element.textContent.includes('+');

    const updateCounter = () => {
      start += increment;
      if (start < target) {
        element.textContent = (hasPlus ? '+' : '') + Math.floor(start) + (isPercentage ? '%' : '');
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = (hasPlus ? '+' : '') + target + (isPercentage ? '%' : '');
      }
    };

    updateCounter();
  };

  // ============================================
  // Process Timeline Animation
  // ============================================

  const timelineLine = document.querySelector('.timeline-line');
  const processSteps = document.querySelectorAll('.process-step');

  if (timelineLine && processSteps.length > 0) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate the timeline line
          timelineLine.style.transition = 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
          timelineLine.style.transformOrigin = 'top';

          // Stagger step animations
          processSteps.forEach((step, index) => {
            setTimeout(() => {
              step.style.opacity = '1';
              step.style.transform = 'translateY(0)';
            }, index * 200);
          });

          processObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    processObserver.observe(document.querySelector('.process-timeline'));
  }

  // ============================================
  // Marquee - Pause on hover
  // ============================================

  const marquee = document.querySelector('.marquee-content');

  if (marquee) {
    const marqueeSection = document.querySelector('.marquee-section');

    marqueeSection.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
    });

    marqueeSection.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
    });
  }

  // ============================================
  // Cursor Effect for CTA Section (Desktop only)
  // ============================================

  const ctaSection = document.querySelector('.cta');

  if (ctaSection && window.matchMedia('(pointer: fine)').matches) {
    ctaSection.addEventListener('mousemove', (e) => {
      const rect = ctaSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

      const ctaLogo = ctaSection.querySelector('.cta-logo');
      if (ctaLogo) {
        ctaLogo.style.transform = `translate(${x}px, ${y}px)`;
      }
    });

    ctaSection.addEventListener('mouseleave', () => {
      const ctaLogo = ctaSection.querySelector('.cta-logo');
      if (ctaLogo) {
        ctaLogo.style.transform = 'translate(0, 0)';
        ctaLogo.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });
  }

  // ============================================
  // Benefit Cards - Stagger animation
  // ============================================

  const benefitCards = document.querySelectorAll('.benefit-card');

  if (benefitCards.length > 0) {
    const benefitsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          benefitCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animated');
            }, index * 150);
          });
          benefitsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    benefitsObserver.observe(document.querySelector('.benefits-cards'));
  }

  // ============================================
  // Problem Cards - Enhanced hover
  // ============================================

  const problemCards = document.querySelectorAll('.problem-card');

  problemCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });

  // ============================================
  // Contact Form Handling
  // ============================================

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Get the submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = '<span>Enviando...</span>';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      setTimeout(() => {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h3>Mensagem enviada!</h3>
          <p>Obrigado pelo contato. Retornaremos em breve.</p>
        `;

        // Replace form with success message
        contactForm.style.display = 'none';
        contactForm.parentNode.appendChild(successMessage);

        // Log form data (for development)
        console.log('Form submitted:', data);
      }, 1500);
    });
  }

  // ============================================
  // Preload critical animations
  // ============================================

  document.documentElement.classList.add('js-loaded');

})();
