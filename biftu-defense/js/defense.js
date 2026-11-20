/**
 * BIFTU DEFENSE (2035) · Tactical C2 Cockpit Script
 * Telemetry HUD, Dynamic Radar Pings, and Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Tactical Theme Control (Default: Light Mode / Daylight)
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const savedTheme = localStorage.getItem('bf-defense-theme') || 'light';

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
      if (themeLabel) themeLabel.textContent = 'TACTICAL VOID';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark');
      if (themeLabel) themeLabel.textContent = 'DAYLIGHT';
    }
    localStorage.setItem('bf-defense-theme', theme);
  }

  // Initial application (defaults to light mode)
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // 1. Dynamic Radar Blips Animation
  const radarBox = document.querySelector('.radar-box');
  if (radarBox) {
    setInterval(() => {
      // Create random tactical ping
      const ping = document.createElement('div');
      ping.className = 'radar-ping';
      
      const top = Math.floor(Math.random() * 60) + 20;
      const left = Math.floor(Math.random() * 60) + 20;
      
      ping.style.top = `${top}%`;
      ping.style.left = `${left}%`;
      
      const isAmber = Math.random() > 0.6;
      if (isAmber) {
        ping.style.background = 'var(--c2-amber)';
        ping.style.boxShadow = '0 0 10px var(--c2-amber)';
      }

      radarBox.appendChild(ping);

      // Fade out after 3.5 seconds
      setTimeout(() => {
        ping.style.transition = 'opacity 1s ease';
        ping.style.opacity = '0';
        setTimeout(() => ping.remove(), 1000);
      }, 3500);
    }, 2400);
  }

  // 2. Smooth Scroll for Tactical Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 3. Interactive Revenue Breakdown Rows
  const revRows = document.querySelectorAll('.rev-row');
  revRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const fill = row.querySelector('.rev-bar-fill');
      if (fill) fill.style.background = 'var(--c2-amber)';
    });
    row.addEventListener('mouseleave', () => {
      const fill = row.querySelector('.rev-bar-fill');
      if (fill) fill.style.background = 'var(--c2-green)';
    });
  });
});
