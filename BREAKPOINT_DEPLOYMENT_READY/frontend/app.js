(() => {
  // Base API configuration
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
    vulnerability: '../vulnerability/index.html',
    vulnerabilities: '../vulnerabilities/index.html',
    assets: '../assets/index.html',
    'attack-paths': '../attack-paths/index.html',
    simulation: '../simulation/index.html',
    'what-if': '../what-if/index.html',
    validation: '../validation/index.html',
    auth: '../auth/index.html'
  };

  const go = k => { if (routes[k]) location.href = routes[k]; };
  const token = () => localStorage.getItem('BREAKPOINT_TOKEN');
  const save = (k, v) => {
    state[k] = Number(v);
    localStorage.setItem('BREAKPOINT_' + k.replace(/[A-Z]/g, m => '_' + m).toUpperCase(), String(v));
  };
  const textContent = el => (el?.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();

  // Helper fetch function
  async function json(url, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    if (token()) headers.Authorization = 'Bearer ' + token();
    const r = await fetch(API + url, { ...opts, headers });
    let data = null;
    try { data = await r.json(); } catch {}
    if (!r.ok) throw new Error(data?.detail || data?.message || `HTTP ${r.status}`);
    return data;
  }

  // Global Toast function
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
  window.BPToast = toast;

  // Modals & Actions
  async function createProject() {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;background:#000c;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
    wrap.innerHTML = `<div style="width:min(560px,100%);background:#131315;border:1px solid #58413f;padding:28px;color:#f0f0f0;font-family:Arial"><div style="font:700 22px monospace">INITIALIZE BREAKPOINT</div><div style="color:#a78a87;font:12px monospace;margin:8px 0 20px">Controlled defensive assessment. No real attacks are executed.</div><label>PROJECT NAME</label><input id="bp-name" style="width:100%;margin:6px 0 12px;padding:12px;background:#0e0e10;border:1px solid #333;color:white" value="Demo Web Application"><label>TARGET URL</label><input id="bp-url" style="width:100%;margin:6px 0 12px;padding:12px;background:#0e0e10;border:1px solid #333;color:white" value="https://demo.breakpoint.local"><label>DESCRIPTION</label><textarea id="bp-desc" style="width:100%;height:80px;margin:6px 0;padding:12px;background:#0e0e10;border:1px solid #333;color:white">Controlled security assessment demo</textarea><div style="display:flex;gap:10px;margin-top:18px"><button id="bp-create" style="flex:1;padding:13px;background:#8b1a1a;color:#fff;border:0;font:12px monospace">CREATE PROJECT</button><button id="bp-cancel" style="padding:13px;background:transparent;color:#fff;border:1px solid #333;font:12px monospace">CANCEL</button></div></div>`;
    document.body.appendChild(wrap);
    wrap.querySelector('#bp-cancel').onclick = () => wrap.remove();
    wrap.querySelector('#bp-create').onclick = async () => {
      try {
        const p = await json('/projects', { method: 'POST', body: JSON.stringify({ name: wrap.querySelector('#bp-name').value.trim(), target_url: wrap.querySelector('#bp-url').value.trim(), description: wrap.querySelector('#bp-desc').value.trim() }) });
        save('projectId', p.id);
        toast('Project created');
        setTimeout(() => go('dashboard'), 250);
      } catch (e) { toast('Could not create project: ' + e.message, false); }
    };
  }

  async function startScan() {
    if (!state.projectId) { toast('Create a project first.', false); return go('welcome'); }
    try {
      toast('Running safe demo scan...');
      const s = await json(`/projects/${state.projectId}/scans`, { method: 'POST' });
      save('scanId', s.id);
      toast('Scan complete — findings are ready');
      setTimeout(() => go('scans'), 300);
    } catch (e) { toast('Scan failed: ' + e.message, false); }
  }
  window.BPStartScan = startScan;

  async function runSimulation() {
    if (!state.projectId) return go('welcome');
    try {
      const v = state.vulnId ? await json(`/vulnerabilities/${state.vulnId}`) : null;
      const r = await json(`/projects/${state.projectId}/simulations`, { method: 'POST', body: JSON.stringify({ scenario: v?.title || 'Authentication Bypass Simulation', target_component: v?.affected_component || 'Demo Application' }) });
      toast('Safe simulation completed: ' + r.risk_level.toUpperCase());
    } catch (e) { toast('Simulation failed: ' + e.message, false); }
  }

  async function runWhatIf() {
    if (!state.projectId || !state.vulnId) { toast('Select a vulnerability first.', false); return; }
    try {
      const r = await json(`/projects/${state.projectId}/what-if`, { method: 'POST', body: JSON.stringify({ vulnerability_id: state.vulnId, proposed_fix: 'Apply MFA, least privilege and hardened security configuration' }) });
      toast(`Risk: ${r.current_risk.toUpperCase()} → ${r.predicted_risk.toUpperCase()}`);
    } catch (e) { toast('Analysis failed: ' + e.message, false); }
  }

  async function runValidation() {
    if (!state.projectId) { toast('Create a project first.', false); return go('welcome'); }
    try {
      const r = await json(`/projects/${state.projectId}/validation`, { method: 'POST' });
      renderValidation(r);
    } catch (e) { toast('Validation failed: ' + e.message, false); }
  }

  function renderValidation(r) {
    const vals = { beforeRisk: r.risk_before, afterRisk: r.risk_after, fixed: r.vulnerabilities_fixed, remaining: r.vulnerabilities_remaining, beforePaths: r.attack_paths_before, afterPaths: r.attack_paths_after, result: r.overall_result };
    const all = [...document.querySelectorAll('main *')];
    const set = (needle, value) => { const el = all.find(x => textContent(x) === needle); if (el) el.textContent = String(value); };
    set('42', vals.beforeRisk.toUpperCase() === 'HIGH' ? '42' : vals.beforeRisk);
    set('76', vals.afterRisk.toUpperCase() === 'LOW' ? '76' : vals.afterRisk);
    set('3', vals.beforePaths);
    set('1', vals.afterPaths);
    const badges = all.filter(x => textContent(x).includes('SECURITY IMPROVEMENT VERIFIED'));
    if (badges[0]) badges[0].innerHTML = '<span class="material-symbols-outlined text-[14px]">check_circle</span> ' + String(vals.result || 'SECURITY IMPROVEMENT VERIFIED').toUpperCase();
    toast(`Validation: ${vals.result} — ${vals.beforeRisk.toUpperCase()} → ${vals.afterRisk.toUpperCase()}`);
  }

  // Auth Handler
  async function authMount() {
    const form = document.getElementById('form'), msg = document.getElementById('msg');
    const tabSignIn = document.getElementById('tab-signin'), tabSignUp = document.getElementById('tab-signup');
    if (!form || !msg) return;
    let mode = 'signin';

    function updateTabs() {
      if (!tabSignIn || !tabSignUp) return;
      tabSignIn.className = mode === 'signin' ? 'mono text-xs cursor-pointer border-b-2 border-red-600 pb-1 text-white font-bold' : 'mono text-xs cursor-pointer pb-1 text-[#888] hover:text-white';
      tabSignUp.className = mode === 'signup' ? 'mono text-xs cursor-pointer border-b-2 border-red-600 pb-1 text-white font-bold' : 'mono text-xs cursor-pointer pb-1 text-[#888] hover:text-white';
    }

    function render() {
      updateTabs();
      form.innerHTML = mode === 'signin' ? `
        <label class="mono text-xs">EMAIL</label>
        <input id="email" type="email" required class="w-full mt-2 mb-4 p-3 bg-[#0e0e10] border border-[#333] text-white" placeholder="you@example.com">
        <label class="mono text-xs">PASSWORD</label>
        <input id="password" type="password" required class="w-full mt-2 p-3 bg-[#0e0e10] border border-[#333] text-white" placeholder="••••••••">
        <button id="submit" type="button" class="w-full mt-5 p-3 bg-[#8b1a1a] text-white mono text-xs font-bold hover:bg-[#a32222]">SIGN IN</button>
      ` : `
        <label class="mono text-xs">NAME</label>
        <input id="name" required class="w-full mt-2 mb-4 p-3 bg-[#0e0e10] border border-[#333] text-white" placeholder="Your name">
        <label class="mono text-xs">EMAIL</label>
        <input id="email" type="email" required class="w-full mt-2 mb-4 p-3 bg-[#0e0e10] border border-[#333] text-white" placeholder="you@example.com">
        <label class="mono text-xs">PASSWORD</label>
        <input id="password" type="password" required class="w-full mt-2 p-3 bg-[#0e0e10] border border-[#333] text-white" placeholder="Minimum 8 characters">
        <button id="submit" type="button" class="w-full mt-5 p-3 bg-[#8b1a1a] text-white mono text-xs font-bold hover:bg-[#a32222]">CREATE ACCOUNT</button>
      `;

      document.getElementById('submit').onclick = async () => {
        msg.textContent = 'Processing request...';
        msg.style.color = '#aaa';
        try {
          const emailEl = document.getElementById('email'), passwordEl = document.getElementById('password'), nameEl = document.getElementById('name');
          const payload = mode === 'signin' ? { email: emailEl.value, password: passwordEl.value } : { name: nameEl.value, email: emailEl.value, password: passwordEl.value };
          const endpoint = mode === 'signin' ? '/auth/login' : '/auth/signup';
          const r = await json(endpoint, { method: 'POST', body: JSON.stringify(payload) });

          if (r.token || r.access_token) {
            localStorage.setItem('BREAKPOINT_TOKEN', r.token || r.access_token);
            localStorage.setItem('BREAKPOINT_USER', JSON.stringify(r.user || { name: nameEl?.value || 'User', email: emailEl.value }));
            msg.style.color = '#8bb28f';
            msg.textContent = 'Success. Opening BREAKPOINT…';
            setTimeout(() => go('dashboard'), 400);
          } else { throw new Error('Invalid token response from server'); }
        } catch (e) {
          msg.style.color = '#d77';
          msg.textContent = e.message;
        }
      };
    }

    if (tabSignIn) tabSignIn.onclick = () => { mode = 'signin'; render(); };
    if (tabSignUp) tabSignUp.onclick = () => { mode = 'signup'; render(); };
    render();
  }

  // Data Loading Handlers
  async function loadVulnerabilities() {
    const list = document.getElementById('list'), status = document.getElementById('status');
    if (!list || !status) return;
    if (!state.projectId) { status.textContent = 'No project selected. Create a project first.'; return; }
    try {
      const vs = await json(`/projects/${state.projectId}/vulnerabilities`);
      status.textContent = vs.length ? `${vs.length} vulnerabilities found in the latest scan.` : 'No vulnerabilities found. Run a scan.';
      list.innerHTML = vs.map(v => `<button type="button" data-v="${v.id}" class="w-full text-left border border-[#2d2d31] bg-[#131315] p-5 hover:border-[#8b1a1a] transition-colors mb-3"><div class="flex justify-between gap-4"><div><div class="font-bold text-white">${v.title}</div><div class="text-xs text-[#888] mt-2">${v.category} · ${v.affected_component}</div></div><span class="text-xs text-[#d66] font-bold">${v.severity}</span></div><div class="text-xs text-[#aaa] mt-4">CVSS ${v.cvss_score} · ${v.status}</div></button>`).join('');
      list.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { save('vulnId', b.dataset.v); go('vulnerability'); });
    } catch (e) { status.textContent = 'Unable to load vulnerabilities: ' + e.message; }
  }

  async function loadAssets() {
    const grid = document.getElementById('grid'), status = document.getElementById('status'), count = document.getElementById('count');
    if (!grid || !status) return;
    if (!state.projectId) { status.textContent = 'No project selected. Create a project first.'; return; }
    try {
      const d = await json(`/projects/${state.projectId}/assets`);
      if (count) count.textContent = `${d.count} ASSETS INDEXED`;
      status.textContent = 'Asset inventory from the latest safe demo scan.';
      grid.innerHTML = d.assets.map(x => `<div class="border border-[#2d2d31] bg-[#131315] p-5"><div class="flex justify-between gap-3"><div><div class="text-lg font-bold text-white">${x.name}</div><div class="text-xs text-[#888] mt-1">${x.type}</div></div><span class="text-xs ${x.status === 'At Risk' ? 'text-[#d66]' : 'text-[#8db58f]'}">${x.status.toUpperCase()}</span></div><div class="grid grid-cols-2 gap-3 mt-5 text-xs text-white"><div><div class="text-[#777]">CRITICALITY</div><div class="mt-1">${x.criticality}</div></div><div><div class="text-[#777]">RISK</div><div class="mt-1">${x.risk.toUpperCase()}</div></div></div></div>`).join('');
    } catch (e) { status.textContent = 'Unable to load assets: ' + e.message; }
  }

  // Navigation Event Listener
  function bindGlobalNavigation() {
    document.querySelectorAll('a, button').forEach(el => {
      const txt = textContent(el);
      if (txt === 'INITIALIZE SESSION' || txt === 'NEW_SESSION') el.onclick = createProject;
      if (txt.includes('RUN NEW SCAN') || txt === 'RE-SCAN') el.onclick = startScan;
      if (txt === 'START SIMULATION' || txt.includes('EXECUTE SIMULATION')) el.onclick = runSimulation;
      if (txt.includes('SAVE CONFIGURATION') || txt.includes('APPLY TO TESTBED')) el.onclick = runWhatIf;
      if (txt.includes('RUN NEW ANALYSIS')) el.onclick = runValidation;
      
      if (txt === 'DASHBOARD' || txt === 'OVERVIEW') el.onclick = e => { e.preventDefault(); go('dashboard'); };
      if (txt.includes('FINDING') || txt === 'SECURITY RESULTS') el.onclick = e => { e.preventDefault(); go('scans'); };
      if (txt.includes('ATTACK PATH')) el.onclick = e => { e.preventDefault(); go('attack-paths'); };
      if (txt.includes('SIMULATION')) el.onclick = e => { e.preventDefault(); go('simulation'); };
      if (txt.includes('WHAT-IF')) el.onclick = e => { e.preventDefault(); go('what-if'); };
      if (txt.includes('VALIDATION') || txt.includes('BEFORE/AFTER')) el.onclick = e => { e.preventDefault(); go('validation'); };
      if (txt.includes('ASSET')) el.onclick = e => { e.preventDefault(); go('assets'); };
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    bindGlobalNavigation();
    if (location.pathname.includes('/auth/')) authMount();
    if (location.pathname.includes('/vulnerabilities/')) loadVulnerabilities();
    if (location.pathname.includes('/assets/')) loadAssets();
    if (location.pathname.includes('/validation/')) runValidation();
  });
})();
