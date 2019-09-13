// ==UserScript==
// @name         GoogleFavicons
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @version      1.0.01
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
/// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/GoogleFavicons.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        https://encrypted.google.com/*
// @match        https://google.com/*
// @match        https://www.google.com/*
// ==/UserScript==

(function() {
  'use strict';

  var initFunction = function() {
    var resultsArray = document.querySelectorAll('div.rc > .r > a');
    for (var count = 0; count < resultsArray.length; ++count) {
      var a = resultsArray[count];
      var r = a.parentNode;
      var favicon = r.querySelector('.favicon');
      if (!favicon) {
        // var rc = r.parentNode;
        var host = a.href.replace(/.*https?:\/\//, '').replace(/\/.*$/,'');

        var i = document.createElement('img');
        i.style.position = 'relative';
        i.style.top = '1px';
        i.style.bottom = '0';
        i.style.left = '0';
        i.style.right = '0';
        // i.style.width = '50%';
        i.style.height = '16px';
        i.style.margin = '0px 4px 0px 0px';
        i.src = 'https://www.google.com/s2/favicons?domain=' + host;
        i.className = 'favicon';

        r.insertBefore(i, a);
        // r.appendChild(i);
      }
    }
  };
  // waitForElement('div.rc > .r > a', 'href', initFunction, 1000, 15, false);
  document.addEventListener('DOMNodeInserted', function handleNewFavicons(event){if (event.target.className != 'favicon') {initFunction();}} , false);
})();