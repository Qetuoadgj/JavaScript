// ==UserScript==
// @name         FixURLs
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @match        http://tampermonkey.net/*
// @exclude      http://*
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/FixURLs.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// ==/UserScript==

(function() {
  'use strict';

  var linksArray = document.querySelectorAll('a[href*="?url"]');
  linksArray.forEach(function(link, index) {
    var href = link.href;
    if (href) {
      var match = href.match(/.*\?url=(http:\/\/.*)/i);
      if (match) link.href = match[1];
    }
  });
})();