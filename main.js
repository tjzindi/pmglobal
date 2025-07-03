// --- Preloader & Hero Animation on Load ---
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.classList.add('preloader-hidden');
  }

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    // Use a small timeout to let the preloader fade-out animation begin
    setTimeout(() => {
      heroContent.classList.add('visible');
    }, 300);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector('.main-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) { // A small threshold to prevent activation on minor scrolls
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check on page load in case it's reloaded while scrolled
    handleScroll();
  }

  const sections = document.querySelectorAll(".section, .hero");

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target); // Animate once, remove observer
        }
      });
    },
    {
      root: null,           // viewport
      rootMargin: "0px",
      threshold: 0.2        // Trigger when 20% of section is visible
    }
  );

  sections.forEach(section => {
    observer.observe(section);
  });

  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('nav-active');
      navToggle.classList.toggle('open');
    });

    // --- Close mobile nav when a link is clicked ---
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        navToggle.classList.remove('open');
      });
    });
  }

  // --- Scrollspy for Active Navigation Link ---
  const sectionsForSpy = document.querySelectorAll('section[id]');
  const navLinksForSpy = document.querySelectorAll('.nav-links a');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);

          // Only proceed if there is a nav link for the current section
          if (activeLink) {
            navLinksForSpy.forEach((link) => link.classList.remove('active'));
            activeLink.classList.add('active');
          }
        }
      });
    },
    {
      // Defines a "trigger zone" in the middle 40% of the viewport
      rootMargin: "-30% 0px -30% 0px",
    }
  );

  sectionsForSpy.forEach((section) => spyObserver.observe(section));

  // --- Back to Top Button Logic ---
  const backToTopBtn = document.querySelector('.back-to-top-btn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      // Show button if user has scrolled down 300px
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
  }

  // --- Cookie Consent Banner Logic ---
  const cookieBanner = document.querySelector('.cookie-consent-banner');
  const cookieAcceptBtn = document.querySelector('.cookie-accept-btn');

  if (cookieBanner && cookieAcceptBtn) {
    // Check if consent has already been given
    if (!localStorage.getItem('cookieConsent')) {
      // Use setTimeout to let the page load a bit before showing the banner
      setTimeout(() => {
        cookieBanner.classList.remove('hidden');
      }, 1500);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      cookieBanner.classList.add('hidden');
      localStorage.setItem('cookieConsent', 'true');
    });
  }

  // --- Contact Form Success Message & Submission Handling ---
  const contactForm = document.querySelector('.contact-form');
  const successMessage = document.getElementById('form-success');
  const resetBtn = document.getElementById('reset-form-btn');

  if (contactForm && successMessage && resetBtn) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent the default mailto: action to take control

      // Hide form and show success message
      contactForm.classList.add('form-hidden');
      successMessage.classList.add('visible');

      // Construct and trigger the mailto link programmatically
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      const subject = `Contact from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      
      // A small delay can help ensure the UI updates before the mail client is triggered
      setTimeout(() => {
        window.location.href = `mailto:lzindi@manyikaresources.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }, 100);
    });

    resetBtn.addEventListener('click', () => {
      successMessage.classList.remove('visible');
      contactForm.classList.remove('form-hidden');
      contactForm.reset(); // Clear the form fields
    });
  }

  // --- Carousel Component ---
  const track = document.querySelector('.carousel-track');
  let items = track ? Array.from(track.children) : [];
  let currentIndex = 1; // Start at 1 (first real item, after prepended clone)
  let autoMoveInterval = null;

  // Remove any existing clones (for hot reload or multiple inits)
  if (track) {
    Array.from(track.querySelectorAll('.clone')).forEach(clone => clone.remove());
    items = Array.from(track.children);
  }

  // Clone first and last for seamless looping
  if (track && items.length > 1) {
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[items.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    track.insertBefore(lastClone, items[0]);
    track.appendChild(firstClone);
    items = Array.from(track.children);
  }

  function getItemWidth() {
    return track.children[1].getBoundingClientRect().width + 20;
  }

  function updateCarousel(transition = true) {
    if (!track || track.children.length === 0) return;
    track.style.transition = transition ? 'transform 0.7s cubic-bezier(0.77, 0, 0.18, 1)' : 'none';
    const itemWidth = getItemWidth();
    track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
  }

  function handleLoop() {
    const total = track.children.length;
    if (currentIndex === 0) {
      track.style.transition = 'none';
      currentIndex = total - 2;
      const itemWidth = getItemWidth();
      track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
      void track.offsetWidth;
      setTimeout(() => {
        track.style.transition = 'transform 0.7s cubic-bezier(0.77, 0, 0.18, 1)';
      }, 20);
    } else if (currentIndex === total - 1) {
      track.style.transition = 'none';
      currentIndex = 1;
      const itemWidth = getItemWidth();
      track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
      void track.offsetWidth;
      setTimeout(() => {
        track.style.transition = 'transform 0.7s cubic-bezier(0.77, 0, 0.18, 1)';
      }, 20);
    }
  }

  function startAutoMove() {
    if (autoMoveInterval) clearInterval(autoMoveInterval);
    autoMoveInterval = setInterval(() => {
      currentIndex++;
      updateCarousel();
    }, 4000);
  }

  if (track) {
    // Touch/Swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;
      if (dx > 50) {
        currentIndex--;
        updateCarousel();
        startAutoMove();
      } else if (dx < -50) {
        currentIndex++;
        updateCarousel();
        startAutoMove();
      }
    });

    track.addEventListener('transitionend', handleLoop);
    window.addEventListener('resize', () => updateCarousel(false));

    // Initial setup
    updateCarousel(false);
    startAutoMove();
  }
});
