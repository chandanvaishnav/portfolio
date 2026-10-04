/**
 * Chandan Vishnav - Recruiter Portfolio JavaScript
 * Handles: Theme toggle (with persistence), mobile navigation, active section scrollspy,
 * graceful image fallbacks, copy-to-clipboard, and placeholder toast feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Dark / Light Theme Toggle with LocalStorage ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // --- 2. Mobile Hamburger Navigation Menu ---
  const navToggleBtn = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggleBtn && mainNav) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
        navToggleBtn.focus();
      }
    });

    // Close when clicking outside header
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !navToggleBtn.contains(e.target) && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 3. Scrollspy: Active Section Highlighting ---
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // --- 4. Toast Notification System ---
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastClose = document.getElementById('toast-close');
  let toastTimeout = null;

  function showToast(msg, duration = 4000) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.removeAttribute('hidden');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.setAttribute('hidden', '');
    }, duration);
  }

  if (toastClose) {
    toastClose.addEventListener('click', () => {
      if (toast) toast.setAttribute('hidden', '');
    });
  }

  // --- 5. Copy Email to Clipboard ---
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailValueEl = document.getElementById('email-value');

  if (copyEmailBtn && emailValueEl) {
    copyEmailBtn.addEventListener('click', async () => {
      const emailText = emailValueEl.textContent.trim();

      try {
        await navigator.clipboard.writeText(emailText);
        showToast('Email address copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = emailText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email address copied to clipboard!');
      }
    });
  }

  // --- 6b. Copy Phone to Clipboard ---
  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  const phoneValueEl = document.getElementById('phone-value');

  if (copyPhoneBtn && phoneValueEl) {
    copyPhoneBtn.addEventListener('click', async () => {
      const phoneText = phoneValueEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(phoneText);
        showToast('Phone number copied to clipboard!');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = phoneText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Phone number copied to clipboard!');
      }
    });
  }

  // --- 7. Automatic Footer Year ---
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // --- 8. Profile Photo Fallback Double-Check ---
  const profileImg = document.getElementById('profile-img');
  if (profileImg) {
    profileImg.addEventListener('error', () => {
      profileImg.src = 'assets/avatar-placeholder.svg';
    });
  }
});
