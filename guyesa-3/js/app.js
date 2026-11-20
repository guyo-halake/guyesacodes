/**
 * Guyesa-3 Portfolio JavaScript
 * Clean category filtering, theme management, and email copy
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Light mode is DEFAULT)
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('gh_theme') || 'light';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('gh_theme', isDark ? 'dark' : 'light');
    });
  }

  // 2. Project Category Filtering
  const filterBtns = document.querySelectorAll('.cat-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Email Copy to Clipboard
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyToast = document.getElementById('copyToast');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email') || 'guyohalakeofficial@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showToast).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      function showToast() {
        if (!copyToast) return;
        copyToast.style.display = 'inline-block';
        setTimeout(() => {
          copyToast.style.display = 'none';
        }, 3000);
      }

      function fallbackCopy() {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showToast();
        } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }
});
