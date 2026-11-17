// Loads my custom Chatling chatbot (from Lab 3) on every page that includes this file
window.chtlConfig = { chatbotId: "5287967244" };
(function () {
  var s = document.createElement('script');
  s.async = true;
  s.id = 'chtl-script';
  s.type = 'text/javascript';
  s.setAttribute('data-id', '5287967244');
  s.src = 'https://chatling.ai/js/embed.js';
  document.body.appendChild(s);
})();
