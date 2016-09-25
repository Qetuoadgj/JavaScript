// ==UserScript==
// @name         noLinkRedirection
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @match        http://tampermonkey.net/*
// @exclude      http://*
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/noLinkRedirection.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// ==/UserScript==

(function() {
  'use strict';

  var linksArray = document.querySelectorAll('a[href*="?url"]');
  // alert(selector+'\n'+linksArray.length);
  for (var i = 0; i < linksArray.length; ++i) {
    var link = linksArray[i], href = link.href;
    if (href) {
      var match = href.match(/.*\?url=(http:\/\/.*)/i);
      if (match) link.href = match[1];
      // link.setAttribute('target', '_blank');
    }
  }
})();