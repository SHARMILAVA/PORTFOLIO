const nav = document.querySelector('.nav');
const toggleBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modal = document.getElementById('section-modal');
const modalBody = document.getElementById('section-modal-body');
const modalTitle = document.getElementById('section-modal-title');
const modalCloseBtn = document.querySelector('.section-modal-close');

if (toggleBtn && navLinks && nav) {
  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    nav.classList.toggle('menu-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      nav.classList.remove('menu-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const openModalForSection = (section) => {
  if (!modal || !modalBody || !modalTitle || !section) {
    return;
  }

  const sectionClone = section.cloneNode(true);
  sectionClone.classList.remove('visible');
  modalBody.innerHTML = '';
  modalBody.appendChild(sectionClone);

  const heading = section.querySelector('h2');
  modalTitle.textContent = heading ? heading.textContent : 'Section';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

const closeModal = () => {
  if (!modal || !modalBody) {
    return;
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalBody.innerHTML = '';
};

if (navLinks) {
  navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#home') {
        return;
      }

      const section = document.querySelector(href);
      if (!section) {
        return;
      }

      event.preventDefault();
      openModalForSection(section);
    });
  });
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
    closeModal();
  }
});

const resumeLink = document.querySelector('.resume-download');

if (resumeLink) {
  let touchTriggered = false;

  const triggerResumeDownload = (event) => {
    event.preventDefault();

    const fileUrl = resumeLink.getAttribute('href');
    if (!fileUrl) {
      return;
    }

    const downloader = document.createElement('a');
    downloader.href = fileUrl;
    downloader.download = resumeLink.getAttribute('download') || 'Sharmila_V_Resume.pdf';
    document.body.appendChild(downloader);
    downloader.click();
    document.body.removeChild(downloader);
  };

  resumeLink.addEventListener('touchstart', (event) => {
    touchTriggered = true;
    triggerResumeDownload(event);
  });

  resumeLink.addEventListener('click', (event) => {
    if (touchTriggered) {
      touchTriggered = false;
      return;
    }

    triggerResumeDownload(event);
  });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('visible'));
}
