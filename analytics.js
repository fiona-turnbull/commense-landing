// Initialize Vercel Web Analytics
// This script uses the @vercel/analytics package installed via npm

(function() {
  'use strict';
  
  // Initialize the queue for analytics events
  if (window.va) return;
  
  window.va = function() {
    (window.vaq = window.vaq || []).push(arguments);
  };
  
  // Load the Vercel Analytics script
  // When deployed to Vercel, this will automatically connect to your project's analytics
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  
  // Fallback: if not on Vercel or in development, we still initialize the queue
  script.onerror = function() {
    console.info('Vercel Analytics: Script not loaded. Analytics will be enabled when deployed to Vercel.');
  };
  
  document.head.appendChild(script);
})();
