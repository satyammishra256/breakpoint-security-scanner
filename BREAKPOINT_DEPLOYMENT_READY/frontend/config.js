window.BREAKPOINT_API_URL = "https://breakpoint-security-scanner-7.onrender.com/api/";/* Set this to your deployed FastAPI URL before deploying the frontend. */
(function(){
  const configured = window.BREAKPOINT_API_URL || localStorage.getItem('BREAKPOINT_API');
  if (configured) window.BREAKPOINT_API_URL = configured.replace(/\/$/,'');
  else window.BREAKPOINT_API_URL = 'https://YOUR-RENDER-SERVICE.onrender.com/api';
})();
