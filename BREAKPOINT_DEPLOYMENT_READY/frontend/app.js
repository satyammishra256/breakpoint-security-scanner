(() => {
  const API = (localStorage.getItem('BREAKPOINT_API') || window.BREAKPOINT_API_URL || 'https://YOUR-RENDER-SERVICE.onrender.com/api').replace(/\/$/,'');
  const state={projectId:Number(localStorage.getItem('BREAKPOINT_PROJECT_ID')||0),scanId:Number(localStorage.getItem('BREAKPOINT_SCAN_ID')||0),vulnId:Number(localStorage.getItem('BREAKPOINT_VULN_ID')||0)};
  const routes={welcome:'../welcome/index.html',dashboard:'../dashboard/index.html',scans:'../scans/index.html',vulnerability:'../vulnerability/index.html','attack-paths':'../attack-paths/index.html',simulation:'../simulation/index.html','what-if':'../what-if/index.html',validation:'../validation/index.html',auth:'../auth/index.html'};
  const go=k=>{if(routes[k]) location.href=routes[k]};
  const token=()=>localStorage.getItem('BREAKPOINT_TOKEN');
  const save=(k,v)=>{state[k]=Number(v);localStorage.setItem('BREAKPOINT_'+k.replace(/[A-Z]/g,m=>'_'+m).toUpperCase(),String(v))};
  const textContent=el=>(el?.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
  async function json(url,opts={}){const headers={'Content-Type':'application/json',...(opts.headers||{})};if(token())headers.Authorization='Bearer '+token();const r=await fetch(API+url,{...opts,headers});let data=null;try{data=await r.json()}catch{}if(!r.ok)throw new Error(data?.detail||data?.message||`HTTP ${r.status}`);return data}
  function toast(msg,ok=true){let t=document.getElementById('bp-toast');if(!t){t=document.createElement('div');t.id='bp-toast';t.style.cssText='position:fixed;right:22px;bottom:22px;z-index:999999;max-width:460px;padding:14px 18px;border:1px solid #58413f;background:#1b1b1d;color:#f0f0f0;font:12px monospace;box-shadow:0 8px 30px #0008';document.body.appendChild(t)}t.textContent=msg;t.style.borderColor=ok?'#4d6b51':'#8b1a1a';clearTimeout(t._x);t._x=setTimeout(()=>t.remove(),5000)}
  function ensureAuth(){if(location.pathname.includes('/auth/'))return true;if(!token())return true;return true}
  async function createProject(){const wrap=document.createElement('div');wrap.style.cssText='position:fixed;inset:0;background:#000c;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';wrap.innerHTML=`<div style="width:min(560px,100%);background:#131315;border:1px solid #58413f;padding:28px;color:#f0f0f0;font-family:Arial"><div style="font:700 22px monospace">INITIALIZE BREAKPOINT</div><div style="color:#a78a87;font:12px monospace;margin:8px 0 20px">Controlled defensive assessment. No real attacks are executed.</div><label>PROJECT NAME</label><input id="bp-name" style="width:100%;margin:6px 0 12px;padding:12px;background:#0e0e10;border:1px solid #333;color:white" value="Demo Web Application"><label>TARGET URL</label><input id="bp-url" style="width:100%;margin:6px 0 12px;padding:12px;background:#0e0e10;border:1px solid #333;color:white" value="https://demo.breakpoint.local"><label>DESCRIPTION</label><textarea id="bp-desc" style="width:100%;height:80px;margin:6px 0;padding:12px;background:#0e0e10;border:1px solid #333;color:white">Controlled security assessment demo</textarea><div style="display:flex;gap:10px;margin-top:18px"><button id="bp-create" style="flex:1;padding:13px;background:#8b1a1a;color:#fff;border:0;font:12px monospace">CREATE PROJECT</button><button id="bp-cancel" style="padding:13px;background:transparent;color:#fff;border:1px solid #333;font:12px monospace">CANCEL</button></div></div>`;document.body.appendChild(wrap);wrap.querySelector('#bp-cancel').onclick=()=>wrap.remove();wrap.querySelector('#bp-create').onclick=async()=>{try{const p=await json('/projects',{method:'POST',body:JSON.stringify({name:wrap.querySelector('#bp-name').value.trim(),target_url:wrap.querySelector('#bp-url').value.trim(),description:wrap.querySelector('#bp-desc').value.trim()})});save('projectId',p.id);toast('Project created');setTimeout(()=>go('dashboard'),250)}catch(e){toast('Could not create project: '+e.message,false)}}}
  async function startScan(){if(!state.projectId){toast('Create a project first.',false);return go('welcome')}try{toast('Running safe demo scan...');const s=await json(`/projects/${state.projectId}/scans`,{method:'POST'});save('scanId',s.id);toast('Scan complete — findings are ready');setTimeout(()=>go('scans'),300)}catch(e){toast('Scan failed: '+e.message,false)}}
  async function runSimulation(){if(!state.projectId)return go('welcome');try{const v=state.vulnId?await json(`/vulnerabilities/${state.vulnId}`):null;const r=await json(`/projects/${state.projectId}/simulations`,{method:'POST',body:JSON.stringify({scenario:v?.title||'Authentication Bypass Simulation',target_component:v?.affected_component||'Demo Application'})});toast('Safe simulation completed: '+r.risk_level.toUpperCase());}catch(e){toast('Simulation failed: '+e.message,false)}}
  async function runWhatIf(){if(!state.projectId||!state.vulnId){toast('Select a vulnerability first.',false);return}try{const r=await json(`/projects/${state.projectId}/what-if`,{method:'POST',body:JSON.stringify({vulnerability_id:state.vulnId,proposed_fix:'Apply MFA, least privilege and hardened security configuration'})});toast(`Risk: ${r.current_risk.toUpperCase()} → ${r.predicted_risk.toUpperCase()}`)}catch(e){toast('Analysis failed: '+e.message,false)}}
  async function runValidation(){if(!state.projectId){toast('Create a project first.',false);return}try{const r=await json(`/projects/${state.projectId}/validation`,{method:'POST'});toast(`Validation complete: ${r.risk_before.toUpperCase()} → ${r.risk_after.toUpperCase()}`)}catch(e){toast('Validation failed: '+e.message,false)}}
  async function dashboard(){if(!state.projectId)return;try{const p=await json(`/projects/${state.projectId}`);const ss=await json(`/projects/${state.projectId}/scans`);document.title='BREAKPOINT - '+p.name;const scan=ss[0];if(scan)save('scanId',scan.id)}catch(e){toast('Dashboard data unavailable: '+e.message,false)}}
  async function scans(){if(!state.scanId&&state.projectId){try{const ss=await json(`/projects/${state.projectId}/scans`);if(ss[0])save('scanId',ss[0].id)}catch(e){toast(e.message,false)}}if(!state.scanId)return;try{const vs=await json(`/scans/${state.scanId}/vulnerabilities`);const candidates=[...document.querySelectorAll('button,a,[role=button]')].filter(e=>/WEAK AUTH|SECURITY HEADER|PERMISSION|ERROR|VULNERABILITY/i.test(textContent(e)));vs.forEach((v,i)=>{if(candidates[i])candidates[i].onclick=()=>{save('vulnId',v.id);go('vulnerability')}})}catch(e){toast('Unable to load findings: '+e.message,false)}}
  async function vulnerability(){if(!state.vulnId)return;try{const v=await json(`/vulnerabilities/${state.vulnId}`);document.title='Vulnerability - '+v.title;toast(`${v.title} loaded — ${v.severity} risk`)}catch(e){toast('Vulnerability not found. Open Scan Results first.',false)}}
  async function validation(){if(!state.projectId){toast('Create a project first.',false);return go('welcome')}try{const r=await json(`/projects/${state.projectId}/reports/latest`);renderValidation(r)}catch(e){if(String(e.message).includes('No validation report')){try{const r=await json(`/projects/${state.projectId}/validation`,{method:'POST'});renderValidation(r)}catch(err){toast('Validation unavailable: '+err.message,false)}}else toast('Validation unavailable: '+e.message,false)}}
  function renderValidation(r){const vals={beforeRisk:r.risk_before,afterRisk:r.risk_after,fixed:r.vulnerabilities_fixed,remaining:r.vulnerabilities_remaining,beforePaths:r.attack_paths_before,afterPaths:r.attack_paths_after,result:r.overall_result};const all=[...document.querySelectorAll('main *')];const set=(needle,value)=>{const el=all.find(x=>textContent(x)===needle);if(el)el.textContent=String(value)};set('42',vals.beforeRisk.toUpperCase()==='HIGH'?'42':vals.beforeRisk);set('76',vals.afterRisk.toUpperCase()==='LOW'?'76':vals.afterRisk);set('3',vals.beforePaths);set('1',vals.afterPaths);const badges=all.filter(x=>textContent(x).includes('SECURITY IMPROVEMENT VERIFIED'));if(badges[0])badges[0].innerHTML='<span class="material-symbols-outlined text-[14px]">check_circle</span> '+String(vals.result||'SECURITY IMPROVEMENT VERIFIED').toUpperCase();const remaining=all.find(x=>textContent(x)==='0');if(remaining&&vals.remaining!==undefined)remaining.textContent=String(vals.remaining);toast(`Validation: ${vals.result} — ${vals.beforeRisk.toUpperCase()} → ${vals.afterRisk.toUpperCase()}`)}
  function bindButtons(){document.querySelectorAll('button').forEach(b=>{const t=textContent(b);if(t.includes('INITIALIZE SESSION'))b.onclick=createProject;if(t.includes('RUN NEW SCAN'))b.onclick=startScan;if(t==='START')b.onclick=location.pathname.includes('/simulation/')?runSimulation:startScan;if(t.includes('VIEW SECURITY RESULTS'))b.onclick=()=>go('scans');if(t.includes('EXPLORE ATTACK PATH'))b.onclick=()=>go('attack-paths');if(t==='MITIGATE'||t.includes('WHAT-IF'))b.onclick=()=>go('what-if');if(t.includes('TEST THIS FIX'))b.onclick=()=>go('simulation');if(t.includes('INITIATE REMEDIATION'))b.onclick=()=>go('what-if');if(t.includes('BACK TO FINDINGS'))b.onclick=()=>go('scans');if(t.includes('NEW_SESSION'))b.onclick=createProject;if(t.includes('RUN NEW ANALYSIS'))b.onclick=location.pathname.includes('/validation/')?runValidation:()=>go('what-if');if(t.includes('SAVE CONFIGURATION')||t.includes('APPLY TO TESTBED'))b.onclick=runWhatIf;if(t.includes('EXECUTE SIMULATION')||t.includes('RUN')&&t.includes('SIMULATION'))b.onclick=runSimulation;if(t.includes('VALIDATION'))b.onclick=()=>go('validation')});document.querySelectorAll('a[href="#"]').forEach(a=>{const t=textContent(a);a.onclick=e=>{e.preventDefault();if(t.includes('DASHBOARD')||t==='OVERVIEW')go('dashboard');else if(t.includes('FINDING')||t.includes('SECURITY RESULTS'))go('scans');else if(t.includes('ATTACK PATH'))go('attack-paths');else if(t.includes('SIMULATION'))go('simulation');else if(t.includes('WHAT-IF')||t.includes('ANALYSIS'))go('what-if');else if(t.includes('VALIDATION'))go('validation');else if(t.includes('SETTING'))showSettings()}})}
  function mountAccount(){if(location.pathname.includes('/auth/'))return;const el=document.createElement('div');el.id='bp-account';el.style.cssText='position:fixed;top:62px;right:18px;z-index:99990;display:flex;gap:6px;align-items:center;font:11px monospace';el.innerHTML=`<button id="bp-user" style="background:#171719;border:1px solid #38383d;color:#ddd;padding:8px 10px">ACCOUNT</button><button id="bp-settings" style="background:#171719;border:1px solid #38383d;color:#aaa;padding:8px 10px">SETTINGS</button>`;document.body.appendChild(el);el.querySelector('#bp-user').onclick=()=>token()?showAccount():go('auth');el.querySelector('#bp-settings').onclick=showSettings}
  function showAccount(){const u=JSON.parse(localStorage.getItem('BREAKPOINT_USER')||'null');const m=document.createElement('div');m.style.cssText='position:fixed;inset:0;background:#000b;z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px';m.innerHTML=`<div style="width:min(420px,100%);background:#131315;border:1px solid #444;padding:24px;color:#fff;font-family:Arial"><div style="font:700 20px monospace">ACCOUNT</div><p style="color:#aaa;margin:12px 0">${u?.name||'User'}<br>${u?.email||''}</p><button id="bp-out" style="width:100%;padding:12px;background:#8b1a1a;color:white;border:0;font:12px monospace">SIGN OUT</button><button id="bp-close" style="width:100%;padding:12px;margin-top:8px;background:transparent;color:#fff;border:1px solid #333;font:12px monospace">CLOSE</button></div>`;document.body.appendChild(m);m.querySelector('#bp-close').onclick=()=>m.remove();m.querySelector('#bp-out').onclick=()=>{['BREAKPOINT_TOKEN','BREAKPOINT_USER','BREAKPOINT_PROJECT_ID','BREAKPOINT_SCAN_ID','BREAKPOINT_VULN_ID'].forEach(k=>localStorage.removeItem(k));location.href='../auth/index.html'}}
  function showSettings(){const m=document.createElement('div');m.style.cssText='position:fixed;inset:0;background:#000b;z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px';m.innerHTML=`<div style="width:min(560px,100%);background:#131315;border:1px solid #444;padding:24px;color:#fff;font-family:Arial"><div style="font:700 20px monospace">SETTINGS</div><p style="color:#999;font:12px monospace">Application configuration</p><label style="display:block;margin-top:16px;font:11px monospace">API BASE URL</label><input id="bp-api" value="${API}" style="width:100%;box-sizing:border-box;margin-top:6px;padding:11px;background:#0e0e10;border:1px solid #333;color:#fff"><label style="display:flex;gap:8px;align-items:center;margin-top:16px;font:11px monospace"><input id="bp-demo" type="checkbox" ${localStorage.getItem('BREAKPOINT_DEMO_MODE')!=='false'?'checked':''}> SAFE DEMO MODE</label><p style="color:#777;font-size:12px;margin-top:8px">Safe demo mode keeps simulations non-destructive and uses controlled data.</p><div style="display:flex;gap:8px;margin-top:20px"><button id="bp-save-settings" style="flex:1;padding:12px;background:#8b1a1a;color:#fff;border:0;font:12px monospace">SAVE</button><button id="bp-close-settings" style="padding:12px;background:transparent;color:#fff;border:1px solid #333;font:12px monospace">CLOSE</button></div></div>`;document.body.appendChild(m);m.querySelector('#bp-close-settings').onclick=()=>m.remove();m.querySelector('#bp-save-settings').onclick=()=>{localStorage.setItem('BREAKPOINT_API',m.querySelector('#bp-api').value.replace(/\/$/,''));localStorage.setItem('BREAKPOINT_DEMO_MODE',m.querySelector('#bp-demo').checked);toast('Settings saved. Reloading...');setTimeout(()=>location.reload(),500)}}
  async function askAI(){let old=document.getElementById('bp-ai-modal');if(old){old.remove();return}const modal=document.createElement('div');modal.id='bp-ai-modal';modal.style.cssText='position:fixed;inset:0;background:#000c;z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px';modal.innerHTML=`<div style="width:min(720px,100%);background:#131315;border:1px solid #58413f;color:#f0f0f0;padding:24px;font-family:Arial"><div style="display:flex;justify-content:space-between"><div><div style="font:700 20px monospace">BREAKPOINT AI ANALYST</div><div style="font:12px monospace;color:#a78a87">Defensive analysis powered by OpenAI</div></div><button id="bp-ai-close" style="background:none;border:1px solid #333;color:#aaa;padding:7px 10px">×</button></div><textarea id="bp-ai-input" placeholder="Ask about a finding, risk, remediation, or validation..." style="width:100%;height:120px;margin-top:20px;padding:14px;background:#0e0e10;border:1px solid #2a2a2e;color:#fff;box-sizing:border-box"></textarea><button id="bp-ai-send" style="margin-top:12px;width:100%;padding:13px;background:#8b1a1a;color:#fff;border:0;font:12px monospace">ANALYZE</button><pre id="bp-ai-output" style="white-space:pre-wrap;line-height:1.5;color:#d9d9d9;max-height:340px;overflow:auto;margin-top:18px"></pre></div>`;document.body.appendChild(modal);modal.querySelector('#bp-ai-close').onclick=()=>modal.remove();modal.querySelector('#bp-ai-send').onclick=async()=>{const out=modal.querySelector('#bp-ai-output'),prompt=modal.querySelector('#bp-ai-input').value.trim();if(!prompt)return;out.textContent='Analyzing…';try{let context={page:location.pathname,project_id:state.projectId,scan_id:state.scanId,vulnerability_id:state.vulnId};if(state.vulnId){try{context.vulnerability=await json(`/vulnerabilities/${state.vulnId}`)}catch{}}const r=await json('/ai/analyze',{method:'POST',body:JSON.stringify({prompt,context})});out.textContent=r.answer}catch(e){out.textContent='AI unavailable: '+e.message}}}
  function mountAI(){if(location.pathname.includes('/auth/'))return;const b=document.createElement('button');b.id='bp-ai-button';b.textContent='AI ANALYST';b.style.cssText='position:fixed;right:22px;bottom:22px;z-index:99998;padding:12px 16px;background:#8b1a1a;color:#fff;border:1px solid #b24a4a;font:700 11px monospace;letter-spacing:.5px;box-shadow:0 8px 30px #0008';b.onclick=askAI;document.body.appendChild(b)}
  async function authMount(){const form=document.getElementById('form'),msg=document.getElementById('msg');let mode='signin';function render(){form.innerHTML=mode==='signin'?`<label class="mono text-xs">EMAIL</label><input id="email" type="email" required class="w-full mt-2 mb-4 p-3 bg-[#0e0e10] border border-[#333]" placeholder="you@example.com"><label class="mono text-xs">PASSWORD</label><input id="password" type="password" required class="w-full mt-2 p-3 bg-[#0e0e10] border border-[#333]" placeholder="••••••••"><button id="submit" class="w-full mt-5 p-3 bg-[#8b1a1a] mono text-xs">SIGN IN</button>`:`<label class="mono text-xs">NAME</label><input id="name" required class="w-full mt-2 mb-4 p-3 bg-[#0e0e10] border border-[#333]" placeholder="Your name"><label class="mono text-xs">EMAIL</label><input id="email" type="email" required class="w-full mt-2 mb-4 p-3 bg-[#0e0e10] border border-[#333]" placeholder="you@example.com"><label class="mono text-xs">PASSWORD</label><input id="password" type="password" required class="w-full mt-2 p-3 bg-[#0e0e10] border border-[#333]" placeholder="Minimum 8 characters"><button id="submit" class="w-full mt-5 p-3 bg-[#8b1a1a] mono text-xs">CREATE ACCOUNT</button>`;document.getElementById('submit').onclick=async()=>{msg.textContent='';try{const emailEl=document.getElementById('email'), passwordEl=document.getElementById('password'), nameEl=document.getElementById('name'); const payload=mode==='signin'?{email:emailEl.value,password:passwordEl.value}:{name:nameEl.value,email:emailEl.value,password:passwordEl.value};const r=await json('/auth/'+mode,payload?{method:'POST',body:JSON.stringify(payload)}:{});localStorage.setItem('BREAKPOINT_TOKEN',r.token);localStorage.setItem('BREAKPOINT_USER',JSON.stringify(r.user));msg.style.color='#8bb28f';msg.textContent='Success. Opening BREAKPOINT…';setTimeout(()=>go('dashboard'),300)}catch(e){msg.style.color='#d77';msg.textContent=e.message}}}document.getElementById('tab-signin').onclick=()=>{mode='signin';render()};document.getElementById('tab-signup').onclick=()=>{mode='signup';render()};render()}
  window.BPAuth={mount:authMount};
  document.addEventListener('DOMContentLoaded',()=>{if(window.BP_AUTH_PAGE)return;mountAI();mountAccount();bindButtons();if(location.pathname.includes('/dashboard/'))dashboard();if(location.pathname.includes('/scans/'))scans();if(location.pathname.includes('/vulnerability/'))vulnerability();if(location.pathname.includes('/validation/'))validation();});
})();

// --- Final navigation + data bindings for Assets, Vulnerabilities, Re-scan and Before/After ---
(function(){
  const A=(localStorage.getItem('BREAKPOINT_API')||window.BREAKPOINT_API_URL||'http://127.0.0.1:8000/api').replace(/\/$/,'');
  const pid=()=>Number(localStorage.getItem('BREAKPOINT_PROJECT_ID')||0);
  const sid=()=>Number(localStorage.getItem('BREAKPOINT_SCAN_ID')||0);
  const tok=()=>localStorage.getItem('BREAKPOINT_TOKEN');
  async function api(path,opts={}){const h={'Content-Type':'application/json',...(opts.headers||{})};if(tok())h.Authorization='Bearer '+tok();const r=await fetch(A+path,{...opts,headers:h});let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.detail||`HTTP ${r.status}`);return d}
  const toast2=m=>{if(window.BPToast)window.BPToast(m);else alert(m)};
  async function rescan(){if(!pid())return location.href='../welcome/index.html';try{toast2('Running safe re-scan...');const s=await api(`/projects/${pid()}/scans`,{method:'POST'});localStorage.setItem('BREAKPOINT_SCAN_ID',s.id);toast2('Re-scan complete. Findings updated.');setTimeout(()=>location.href='../scans/index.html',250)}catch(e){toast2('Re-scan failed: '+e.message)}}
  window.BPStartScan=rescan;
  function nav(text){const t=text.replace(/\s+/g,' ').trim().toUpperCase();if(t==='DASHBOARD')return '../dashboard/index.html';if(t==='SECURITY SCAN'||t==='RE-SCAN')return '../scans/index.html';if(t==='ATTACK PATHS')return '../attack-paths/index.html';if(t==='VULNERABILITIES')return '../vulnerabilities/index.html';if(t==='ASSETS')return '../assets/index.html';if(t==='ATTACK SIMULATION')return '../simulation/index.html';if(t==='WHAT-IF ANALYSIS')return '../what-if/index.html';if(t==='BEFORE/AFTER')return '../validation/index.html';return null}
  function bindSide(){document.querySelectorAll('a').forEach(a=>{const href=a.getAttribute('href');const n=nav(a.innerText||'');if(n && (href==='#'||!href||href.startsWith('#'))){a.onclick=e=>{e.preventDefault();if((a.innerText||'').trim().toUpperCase()==='RE-SCAN')rescan();else location.href=n}}});document.querySelectorAll('button').forEach(b=>{const t=(b.innerText||'').replace(/\s+/g,' ').trim().toUpperCase();if(t.includes('RE-SCAN'))b.onclick=rescan;if(t.includes('RUN NEW SCAN'))b.onclick=rescan})}
  async function assetsPage(){if(!pid())return;const st=document.getElementById('status'),grid=document.getElementById('grid'),count=document.getElementById('count');if(!st||!grid)return;try{const d=await api(`/projects/${pid()}/assets`);count.textContent=`${d.count} ASSETS INDEXED`;st.textContent='Live inventory from the latest demo scan.';grid.innerHTML=d.assets.map(x=>`<div class="border border-[#2d2d31] bg-[#131315] p-5"><div class="flex justify-between gap-3"><div><div class="text-lg font-bold">${x.name}</div><div class="text-xs text-[#888] mt-1">${x.type}</div></div><span class="text-xs ${x.status==='At Risk'?'text-[#d66]':'text-[#8db58f]'}">${x.status.toUpperCase()}</span></div><div class="grid grid-cols-2 gap-3 mt-5 text-xs"><div><div class="text-[#777]">CRITICALITY</div><div class="mt-1">${x.criticality}</div></div><div><div class="text-[#777]">RISK</div><div class="mt-1">${x.risk.toUpperCase()}</div></div></div></div>`).join('')}catch(e){st.textContent='Unable to load assets: '+e.message}}
  async function vulnPage(){if(!pid())return;const st=document.getElementById('status'),list=document.getElementById('list');if(!st||!list)return;try{let vs=await api(`/projects/${pid()}/vulnerabilities`);st.textContent=vs.length?`${vs.length} findings loaded from the latest scan.`:'No findings yet. Run a scan.';list.innerHTML=vs.map(v=>`<button data-v="${v.id}" class="w-full text-left border border-[#2d2d31] bg-[#131315] p-5 hover:border-[#8b1a1a]"><div class="flex justify-between gap-4"><div><div class="font-bold">${v.title}</div><div class="text-xs text-[#888] mt-2">${v.category} · ${v.affected_component}</div></div><span class="text-xs">${v.severity}</span></div><div class="text-xs text-[#aaa] mt-4">CVSS ${v.cvss_score} · ${v.status}</div></button>`).join('');list.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{localStorage.setItem('BREAKPOINT_VULN_ID',b.dataset.v);location.href='../vulnerability/index.html'})}catch(e){st.textContent='Unable to load vulnerabilities: '+e.message}}
  document.addEventListener('DOMContentLoaded',()=>{bindSide();if(location.pathname.includes('/assets/'))assetsPage();if(location.pathname.includes('/vulnerabilities/'))vulnPage();});
})();
(function(){
 document.addEventListener('DOMContentLoaded',()=>{
   if(!location.pathname.includes('/validation/')) return;
   const A=(localStorage.getItem('BREAKPOINT_API')||window.BREAKPOINT_API_URL||'http://127.0.0.1:8000/api').replace(/\/$/,'');
   const pid=Number(localStorage.getItem('BREAKPOINT_PROJECT_ID')||0), tok=localStorage.getItem('BREAKPOINT_TOKEN');
   const toast3=m=>{let t=document.getElementById('bp-toast');if(t){t.textContent=m;return}alert(m)};
   async function run(){if(!pid)return location.href='../welcome/index.html';try{const h={'Content-Type':'application/json'};if(tok)h.Authorization='Bearer '+tok;let r=await fetch(A+`/projects/${pid}/validation`,{method:'POST',headers:h});let d=await r.json();if(!r.ok)throw new Error(d.detail||'Validation failed');apply(d)}catch(e){toast3('Before/After failed: '+e.message)}}
   function apply(d){
     const nums=[...document.querySelectorAll('main div')].filter(x=>/^\\d+$/.test((x.textContent||'').trim()) && (x.children.length===0));
     const labels=[...document.querySelectorAll('main div')].filter(x=>['CALCULATED RISK SCORE','EXPOSED PATHS','COMPROMISED ASSETS'].includes((x.textContent||'').trim().toUpperCase()));
     const setNear=(label,val)=>{const parent=label?.parentElement;if(!parent)return;const target=[...parent.querySelectorAll('div')].find(x=>/^\\d+$/.test((x.textContent||'').trim()));if(target)target.textContent=String(val)};
     const cards=[...document.querySelectorAll('main > div, main section, main .grid')];
     setNear(labels[0],d.risk_before_score||42); setNear(labels[1],d.attack_paths_before||3); setNear(labels[2],d.compromised_assets_before??2);
     setNear(labels[3],d.risk_after_score||76); setNear(labels[4],d.attack_paths_after||1); setNear(labels[5],d.compromised_assets_after??0);
     const badge=[...document.querySelectorAll('main *')].find(x=>(x.textContent||'').trim().includes('SECURITY IMPROVEMENT VERIFIED'));if(badge)badge.textContent=String(d.overall_result||'Security improvement verified').toUpperCase();
   }
   document.querySelectorAll('button').forEach(b=>{if((b.innerText||'').toUpperCase().includes('RUN NEW ANALYSIS'))b.onclick=run});
   run();
 });
})();


// === BREAKPOINT FINAL INTERACTION CONTROLLER ===
(function () {
  const API = (localStorage.getItem('BREAKPOINT_API') || window.BREAKPOINT_API_URL || 'https://YOUR-RENDER-SERVICE.onrender.com/api').replace(/\/$/, '');
  const pid = () => Number(localStorage.getItem('BREAKPOINT_PROJECT_ID') || 0);
  const token = () => localStorage.getItem('BREAKPOINT_TOKEN');
  const toast = (msg, ok=true) => {
    let t=document.getElementById('bp-toast');
    if(!t){ t=document.createElement('div'); t.id='bp-toast'; t.style.cssText='position:fixed;right:22px;bottom:22px;z-index:999999;padding:13px 16px;max-width:520px;background:#171719;color:#eee;border:1px solid #4d6b51;font:12px monospace;box-shadow:0 8px 30px #0008'; document.body.appendChild(t); }
    t.textContent=msg; t.style.borderColor=ok?'#4d6b51':'#9a2d2d'; clearTimeout(t._x); t._x=setTimeout(()=>t.remove(),4500);
  };
  async function api(path, opts={}) {
    const headers={'Content-Type':'application/json',...(opts.headers||{})};
    if(token()) headers.Authorization='Bearer '+token();
    let r;
    try { r=await fetch(API+path,{...opts,headers}); }
    catch(e){ throw new Error('Backend unavailable. Start START_ALL.bat and try again.'); }
    let d={}; try{d=await r.json()}catch{}
    if(!r.ok) throw new Error(d.detail || d.message || `HTTP ${r.status}`);
    return d;
  }
  function clean(t){return (t||'').replace(/\s+/g,' ').trim().toUpperCase();}
  function navFor(text){
    const t=clean(text);
    if(t==='DASHBOARD'||t==='OVERVIEW') return '../dashboard/index.html';
    if(t==='SECURITY SCAN'||t==='SECURITY RESULTS') return '../scans/index.html';
    if(t==='VULNERABILITIES'||t.includes('VULNERABILITIES')) return '../vulnerabilities/index.html';
    if(t==='ASSETS'||t.includes('ASSETS')) return '../assets/index.html';
    if(t==='ATTACK PATHS'||t.includes('ATTACK PATH')) return '../attack-paths/index.html';
    if(t==='ATTACK SIMULATION'||t.includes('SIMULATION')) return '../simulation/index.html';
    if(t==='WHAT-IF ANALYSIS'||t.includes('WHAT-IF')) return '../what-if/index.html';
    if(t==='BEFORE/AFTER'||t.includes('BEFORE/AFTER')) return '../validation/index.html';
    return null;
  }
  async function rescan(){
    if(!pid()){ toast('Create a project first.',false); location.href='../welcome/index.html'; return; }
    try{
      toast('Running safe re-scan...');
      const scan=await api(`/projects/${pid()}/scans`,{method:'POST'});
      localStorage.setItem('BREAKPOINT_SCAN_ID',String(scan.id));
      toast('Re-scan complete — latest findings loaded.');
      setTimeout(()=>location.href='../scans/index.html',250);
    }catch(e){toast('Re-scan failed: '+e.message,false);}
  }
  window.BPStartScan=rescan;

  function bindNavigation(){
    document.querySelectorAll('a,button').forEach(el=>{
      const text=clean(el.innerText || el.textContent);
      const target=navFor(text);
      if(!target) return;
      if(text==='RE-SCAN' || text.includes('RUN NEW SCAN')) el.onclick=(e)=>{e.preventDefault();rescan();};
      else el.onclick=(e)=>{e.preventDefault();location.href=target;};
    });
  }

  async function loadVulnerabilities(){
    const list=document.getElementById('list'), status=document.getElementById('status');
    if(!list||!status) return;
    if(!pid()){status.textContent='No project selected. Create a project first.';return;}
    try{
      const vs=await api(`/projects/${pid()}/vulnerabilities`);
      status.textContent=vs.length?`${vs.length} vulnerabilities found in the latest scan.`:'No vulnerabilities found. Run a scan.';
      list.innerHTML=vs.map(v=>`<button type="button" data-v="${v.id}" style="width:100%;text-align:left" class="border border-[#2d2d31] bg-[#131315] p-5 hover:border-[#8b1a1a] transition-colors"><div class="flex justify-between gap-4"><div><div class="font-bold">${v.title}</div><div class="text-xs text-[#888] mt-2">${v.category} · ${v.affected_component}</div></div><span class="text-xs">${v.severity}</span></div><div class="text-xs text-[#aaa] mt-4">CVSS ${v.cvss_score} · ${v.status}</div></button>`).join('');
      list.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{localStorage.setItem('BREAKPOINT_VULN_ID',b.dataset.v);location.href='../vulnerability/index.html';});
    }catch(e){status.textContent='Unable to load vulnerabilities: '+e.message;toast('Vulnerabilities: '+e.message,false);}
  }

  async function loadAssets(){
    const grid=document.getElementById('grid'), status=document.getElementById('status'), count=document.getElementById('count');
    if(!grid||!status) return;
    if(!pid()){status.textContent='No project selected. Create a project first.';return;}
    try{
      const d=await api(`/projects/${pid()}/assets`);
      if(count) count.textContent=`${d.count} ASSETS INDEXED`;
      status.textContent='Asset inventory from the latest safe demo scan.';
      grid.innerHTML=d.assets.map(x=>`<div class="border border-[#2d2d31] bg-[#131315] p-5"><div class="flex justify-between gap-3"><div><div class="text-lg font-bold">${x.name}</div><div class="text-xs text-[#888] mt-1">${x.type}</div></div><span class="text-xs ${x.status==='At Risk'?'text-[#d66]':'text-[#8db58f]'}">${x.status.toUpperCase()}</span></div><div class="grid grid-cols-2 gap-3 mt-5 text-xs"><div><div class="text-[#777]">CRITICALITY</div><div class="mt-1">${x.criticality}</div></div><div><div class="text-[#777]">RISK</div><div class="mt-1">${x.risk.toUpperCase()}</div></div></div></div>`).join('');
    }catch(e){status.textContent='Unable to load assets: '+e.message;toast('Assets: '+e.message,false);}
  }

  async function runValidationFinal(){
    if(!pid()){toast('Create a project first.',false);location.href='../welcome/index.html';return;}
    try{
      toast('Running before/after validation...');
      const d=await api(`/projects/${pid()}/validation`,{method:'POST'});
      const set=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=String(val);};
      set('bp-before-risk',d.risk_before_score ?? 42); set('bp-before-paths',d.attack_paths_before ?? 3); set('bp-before-assets',d.compromised_assets_before ?? 2);
      set('bp-after-risk',d.risk_after_score ?? 76); set('bp-after-paths',d.attack_paths_after ?? 1); set('bp-after-assets',d.compromised_assets_after ?? 0);
      const badge=document.getElementById('bp-validation-result'); if(badge) badge.textContent=String(d.overall_result||'Security improvement verified').toUpperCase();
      const reduction=document.getElementById('bp-reduction'); if(reduction){const before=Number(d.risk_before_score??42), after=Number(d.risk_after_score??76); reduction.textContent=Math.max(0,Math.round((1-(after/100)/(before/100))*100))+'%';}
      toast('Before/After validation complete.');
    }catch(e){toast('Before/After failed: '+e.message,false);}
  }

  function markValidationIds(){
    if(!location.pathname.includes('/validation/')) return;
    const labels=[...document.querySelectorAll('main div')];
    const matches=(s)=>labels.find(e=>clean(e.textContent)===clean(s));
    const attach=(label,id)=>{const l=matches(label);const p=l&&l.parentElement;if(!p)return;const nums=[...p.querySelectorAll('div')].filter(e=>/^\d+$/.test((e.textContent||'').trim()));if(nums[0])nums[0].id=id;};
    attach('Calculated Risk Score','bp-before-risk');
    const before=[...document.querySelectorAll('main .bg-surface')].find(e=>clean(e.textContent).includes('BEFORE SECURITY CHANGE'));
    const after=[...document.querySelectorAll('main .bg-charcoal-surface')].find(e=>clean(e.textContent).includes('AFTER SECURITY CHANGE'));
    if(before){const nums=[...before.querySelectorAll('div')].filter(e=>/^\d+$/.test((e.textContent||'').trim())); if(nums[0])nums[0].id='bp-before-risk';if(nums[1])nums[1].id='bp-before-paths';if(nums[2])nums[2].id='bp-before-assets';}
    if(after){const nums=[...after.querySelectorAll('div')].filter(e=>/^\d+$/.test((e.textContent||'').trim())); if(nums[0])nums[0].id='bp-after-risk';if(nums[1])nums[1].id='bp-after-paths';if(nums[2])nums[2].id='bp-after-assets';}
    const badge=[...document.querySelectorAll('main *')].find(e=>clean(e.textContent).includes('SECURITY IMPROVEMENT VERIFIED')); if(badge)badge.id='bp-validation-result';
    const reduction=[...document.querySelectorAll('main *')].find(e=>clean(e.textContent).includes('REDUCTION IN CRITICAL-PATH EXPOSURE')); if(reduction){const parent=reduction.parentElement;const num=[...parent.querySelectorAll('span')].find(e=>/%$/.test((e.textContent||'').trim()));if(num)num.id='bp-reduction';}
  }

  document.addEventListener('DOMContentLoaded',()=>{
    bindNavigation();
    if(location.pathname.includes('/vulnerabilities/')) loadVulnerabilities();
    if(location.pathname.includes('/assets/')) loadAssets();
    if(location.pathname.includes('/validation/')){
      markValidationIds();
      document.querySelectorAll('button').forEach(b=>{if(clean(b.textContent).includes('RUN NEW ANALYSIS'))b.onclick=(e)=>{e.preventDefault();runValidationFinal();};});
      runValidationFinal();
    }
  });
})();

/* BREAKPOINT FINAL SCAN HARDENING */
(function(){
  const API=(localStorage.getItem('BREAKPOINT_API')||window.BREAKPOINT_API_URL||'http://127.0.0.1:8000/api').replace(/\/$/,'');
  const projectId=()=>Number(localStorage.getItem('BREAKPOINT_PROJECT_ID')||0);
  const token=()=>localStorage.getItem('BREAKPOINT_TOKEN');
  async function request(path,opts={}){const h={'Content-Type':'application/json',...(opts.headers||{})};const t=token();if(t)h.Authorization='Bearer '+t;const r=await fetch(API+path,{...opts,headers:h});let d={};try{d=await r.json()}catch{}if(!r.ok)throw new Error(d.detail||d.message||('HTTP '+r.status));return d}
  function notify(m,ok=true){if(typeof window.BPToast==='function')return window.BPToast(m);let t=document.getElementById('bp-toast');if(!t){t=document.createElement('div');t.id='bp-toast';t.style='position:fixed;right:20px;bottom:20px;z-index:999999;padding:14px 18px;background:#171719;border:1px solid #8b1a1a;color:#fff;font:12px monospace';document.body.appendChild(t)}t.textContent=m;t.style.borderColor=ok?'#4d6b51':'#8b1a1a';clearTimeout(t._timer);t._timer=setTimeout(()=>t.remove(),5000)}
  async function hardScan(e){if(e){e.preventDefault();e.stopImmediatePropagation();}
    const pid=projectId();
    if(!pid){notify('Create a project first.',false);location.href='../welcome/index.html';return false;}
    try{
      notify('Checking BREAKPOINT scan engine…');
      await fetch(API.replace(/\/api$/,'')+'/health').then(async r=>{if(!r.ok)throw new Error('Backend health check failed (HTTP '+r.status+')')});
      notify('Running safe security scan…');
      const scan=await request('/projects/'+pid+'/scans',{method:'POST'});
      localStorage.setItem('BREAKPOINT_SCAN_ID',String(scan.id));
      notify('Security scan complete — '+(scan.total_findings||0)+' findings detected.');
      setTimeout(()=>{location.href='../scans/index.html'},350);
    }catch(err){
      notify('Security scan failed: '+err.message+'. Make sure START_ALL.bat is running.',false);
      console.error('BREAKPOINT scan error',err);
    }
    return false;
  }
  window.BPStartScan=hardScan;
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('button').forEach(b=>{
      const t=(b.innerText||'').replace(/\s+/g,' ').trim().toUpperCase();
      if(t.includes('RUN NEW SCAN')||t==='RE-SCAN'||t.includes('START SECURITY SCAN')){
        b.onclick=hardScan;
        b.addEventListener('click',hardScan,true);
      }
    });
    if(location.pathname.includes('/scans/')){
      const pid=projectId(), sid=Number(localStorage.getItem('BREAKPOINT_SCAN_ID')||0);
      const status=document.querySelector('[data-scan-status]')||document.querySelector('main p');
      if(pid && sid){request('/scans/'+sid+'/vulnerabilities').then(vs=>{window.BREAKPOINT_LATEST_VULNERABILITIES=vs;}).catch(()=>{});}
    }
  });
})();
