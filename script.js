document.documentElement.classList.add('js-enabled');

const cursor = document.querySelector('.cursor');
const cursorGlow = document.querySelector('.cursor-glow');

if (cursor && cursorGlow) {
  cursor.classList.add('active');
  cursorGlow.classList.add('active');

  document.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    cursor.style.transform = `translate(${x - 8}px, ${y - 8}px)`;
    cursorGlow.style.transform = `translate(${x - 17}px, ${y - 17}px)`;
  });

  document.addEventListener('touchstart', () => {
    cursor.classList.remove('active');
    cursorGlow.classList.remove('active');
  }, { once: true });
}

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navbar-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    if (navbar) {
      navbar.classList.add('scrolled');
    }
  } else {
    if (navbar) {
      navbar.classList.remove('scrolled');
    }
  }

  document.documentElement.style.setProperty('--page-scroll', `${window.scrollY}px`);
});

const typewriter = document.querySelector('.typewriter');
if (typewriter) {
  const text = typewriter.textContent || '';
  let index = 0;
  typewriter.textContent = '';
  typewriter.style.borderRight = '2px solid var(--neon-blue)';

  const type = () => {
    if (index < text.length) {
      typewriter.textContent += text.charAt(index);
      index += 1;
      setTimeout(type, 65);
    } else {
      setTimeout(() => {
        typewriter.style.borderRight = 'none';
      }, 300);
    }
  };

  window.addEventListener('load', () => {
    setTimeout(type, 350);
  });
}

const initParticleSystem = () => {
  if (typeof THREE === 'undefined') {
    return;
  }

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.z = 50;

  const particleCount = 120;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200;
    positions[i + 1] = (Math.random() - 0.5) * 200;
    positions[i + 2] = (Math.random() - 0.5) * 200;

    velocities[i] = (Math.random() - 0.5) * 0.14;
    velocities[i + 1] = (Math.random() - 0.5) * 0.14;
    velocities[i + 2] = (Math.random() - 0.5) * 0.14;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.55,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const animate = () => {
    requestAnimationFrame(animate);

    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] += velocities[i];
      pos[i + 1] += velocities[i + 1];
      pos[i + 2] += velocities[i + 2];

      if (pos[i] > 100 || pos[i] < -100) velocities[i] *= -1;
      if (pos[i + 1] > 100 || pos[i + 1] < -100) velocities[i + 1] *= -1;
      if (pos[i + 2] > 100 || pos[i + 2] < -100) velocities[i + 2] *= -1;
    }

    geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.0008;
    renderer.render(scene, camera);
  };

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach((element) => observer.observe(element));
} else {
  // Fallback for browsers/environments without IntersectionObserver support.
  revealElements.forEach((element) => element.classList.add('in-view'));
}

const statsSection = document.querySelector('.stats-row');
if (statsSection) {
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const tick = () => {
      current += step;
      if (current < target) {
        counter.textContent = String(Math.floor(current));
        requestAnimationFrame(tick);
      } else {
        counter.textContent = String(target);
      }
    };

    tick();
  };

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach((counter) => animateCounter(counter));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    statsObserver.observe(statsSection);
  } else {
    statsSection.querySelectorAll('.stat-number').forEach((counter) => animateCounter(counter));
  }
}

const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

const updateActiveLink = () => {
  const scrollPosition = window.scrollY + 160;
  let currentId = '';

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPosition >= top && scrollPosition < top + height) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const target = href.replace('#', '');
    link.classList.toggle('active', target === currentId);
  });
};

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

const magneticElements = document.querySelectorAll('.magnetic, .btn, .nav-cta');
magneticElements.forEach((element) => {
  element.addEventListener('mousemove', (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = 'translate(0, 0)';
  });
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thank you, your message has been noted. I will get back to you soon.');
    contactForm.reset();
  });
}

// Swipe left/right on touch screens to reveal or hide project details.
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card) => {
  let startX = 0;
  let startY = 0;
  let swiped = false;

  card.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    swiped = false;
  }, { passive: true });

  card.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) > 24 && Math.abs(deltaX) > Math.abs(deltaY)) {
      swiped = true;
      if (deltaX < 0) {
        card.classList.add('touch-reveal');
      } else {
        card.classList.remove('touch-reveal');
      }
      event.preventDefault();
    }
  }, { passive: false });

  card.addEventListener('touchend', () => {
    if (!swiped) {
      return;
    }
  }, { passive: true });
});

window.addEventListener('load', initParticleSystem);
window.addEventListener('load', () => {
  document.documentElement.style.setProperty('--page-scroll', `${window.scrollY}px`);
});
