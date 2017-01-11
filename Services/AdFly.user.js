// ==UserScript==
// @name         AdFly
// @icon         https://www.google.com/s2/favicons?domain=adf.ly
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/AdFly.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        http://adf.ly/*
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  var link = document.querySelector('meta[property="og:url"]');
  var url = link ? link.content : null;
  if (url && url !== location.href) {
    // document.open(); // empty document
    window.location = url;
  }
  console.log('URL: '+url);
})();