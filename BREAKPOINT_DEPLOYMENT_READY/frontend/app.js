(() => {
  const API = (localStorage.getItem('BREAKPOINT_API') || window.BREAKPOINT_API_URL || 'https://breakpoint-security-scanner-7.onrender.com/api').replace(/\/$/, '');
  
  const state = {
    projectId: Number(localStorage.getItem('BREAKPOINT_PROJECT_ID') || 0),
    scanId: Number(localStorage.getItem('BREAKPOINT_SCAN_ID') || 0),
    vulnId: Number(localStorage.getItem('BREAKPOINT_VULN_ID') || 0)
  };

  const routes = {
    welcome: '../welcome/index.html',
    dashboard: '../dashboard/index.html',
    scans: '../scans/index.html',
    vulnerabilities: '../vulnerabilities/index.html',
    vulnerability: '../vulnerability/index.html',
    assets: '../assets/index.html',
    'attack-paths': '../attack-paths/index.html',
    simulation: '../simulation/index.html',
    'what-if': '../what-if/index.html',
    validation: '../validation/index.html',
    settings: '../settings/index.html',
    auth: '../auth/index.html'
  };

  const go = target => {
    if (routes[target]) {
      window.location.href = routes[target];
    }
  };

  const token = () => localStorage.getItem('BREAKPOINT_TOKEN');
  
  async function json(url, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token()) headers.Authorization = 'Bearer ' + token();
    const r = await fetch(API + url, { ...opts, headers });
    let data = null;
    try { data = await r.json(); } catch {}
    if (!r.ok) throw new Error(data?.detail || data?.message || `HTTP ${r.status}`);
    return data;
  }

  function toast(msg, ok = true) {
    let t = document.getElementById('bp-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'bp-toast';
      t.style.cssText = 'position:fixed;right:22px;bottom:22px;z-index:999999;max-width:460px;padding:14px 18px;border:1px solid #58413f;background:#1b1b1d;color:#f0f0f0;font:12px monospace;box-shadow:0 8px 30px #0008';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.borderColor = ok ? '#4d6b51' : '#8b1a1a';
    clearTimeout(t._x);
    t._x = setTimeout(() => t.remove(), 5000);
  }

  // Bind Logout
  document.addEventListener('click', e => {
    const target = e.target.closest('#btn-logout, [href*="auth"]');
    if (target && target.textContent.includes('LOGOUT')) {
      localStorage.removeItem('BREAKPOINT_TOKEN');
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    // Inject Settings & Logout dynamically if missing from HTML
    const navRight = document.querySelector('nav .ml-auto, header .ml-auto');
    if (navRight && !navRight.querySelector('[href*="settings"]')) {
      const settingsLink = document.createElement('a');
      settingsLink.href = routes.settings;
      settingsLink.className = 'mono text-xs text-[#aaa] hover:text-white mr-4';
      settingsLink.textContent = 'SETTINGS';
      
      const logoutBtn = document.createElement('a');
      logoutBtn.href = routes.auth;
      logoutBtn.id = 'btn-logout';
      logoutBtn.className = 'mono text-xs text-red-400 hover:text-red-300';
      logoutBtn.textContent = 'LOGOUT';
      logoutBtn.onclick = () => localStorage.removeItem('BREAKPOINT_TOKEN');

      navRight.appendChild(settingsLink);
      navRight.appendChild(logoutBtn);
    }
  });
})();
