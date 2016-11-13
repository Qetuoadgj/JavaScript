// ==UserScript==
// @name         BIQLE.ru
// @icon         https://www.google.com/s2/favicons?domain=biqle.ru
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-start
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/BIQLE.ru.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        https://biqle.ru/RD/*
// @match        https://daxab.com/embed/*/RD
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  // THIS FILE GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  String.prototype.matchLink = function(link, flags) {
    link = link.replace(/[.\/]/g, "\\$&");
    link = link.replace(/\*/g, ".*");
    var re = new RegExp(link, flags);
    return this.match(re);
  };
  var url;
  // ====================================================================================================================

  // redirect to https://biqle.ru (pseudo redirection page)
  if (pageURL.matchLink('https://daxab.com/embed/*/RD')) { // https://daxab.com/embed/-37492055_456242005/RD
    url = pageURL.replace(/\/RD$/, '');
    window.location = 'https://biqle.ru/RD'+'/'+url;
  }

  // redirect back to embed video page
  else if (pageURL.matchLink('https://biqle.ru/RD/*')) { // https://biqle.ru/RD/https://daxab.com/embed/-37492055_456242005
    document.head.innerHTML = null;
    document.body.innerHTML = null;
    url = pageURL.replace('https://biqle.ru/RD/', '');
    window.location = url;
  }

})();