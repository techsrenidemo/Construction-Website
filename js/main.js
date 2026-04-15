(function() {
  'use strict';

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
      e.preventDefault();
    }
  });

  const devtools = { open: false };
  setInterval(() => {
    const threshold = 160;
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0d0d0d;font-family:sans-serif;color:#E8610A;font-size:1.5rem;letter-spacing:4px;text-transform:uppercase;">Access Restricted</div>';
      }
    } else { devtools.open = false; }
  }, 1000);

  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      setTimeout(() => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
      }, 80);
    });

    document.querySelectorAll('a, button, .service-card, .portfolio-item, .client-tile').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); follower.classList.add('hovered'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); follower.classList.remove('hovered'); });
    });
  }

  const loader = document.getElementById('loader');
  if (loader) {
    const bar = loader.querySelector('.loader-bar');
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
      loader.style.transition = 'opacity 0.6s ease';
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 600);
    }, 1600);
  }

  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), (entry.target.dataset.delay || 0) * 1000);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => obs.observe(el));
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObs.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = 16;
    const inc = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        portfolioItems.forEach(item => {
          const show = cat === 'all' || item.dataset.category === cat;
          item.style.opacity = show ? '1' : '0.15';
          item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
          item.style.pointerEvents = show ? '' : 'none';
          item.style.transition = 'opacity 0.4s, transform 0.4s';
        });
      });
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const status = document.getElementById('formStatus');
      btn.disabled = true;
      btn.textContent = 'Sending...';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <span>→</span>';
        if (status) { status.className = 'form-status success'; status.textContent = '✓ Message sent! We will get back to you shortly.'; }
        contactForm.reset();
        setTimeout(() => { if (status) status.className = 'form-status'; }, 5000);
      }, 1800);
    });
  }

  const activeLink = document.querySelector('nav .nav-links a[href="' + window.location.pathname.split('/').pop() + '"]');
  if (activeLink) activeLink.classList.add('active');

  const track = document.querySelector('.clients-track');
  if (track) {
    const clone = track.innerHTML;
    track.innerHTML += clone;
  }

})();
