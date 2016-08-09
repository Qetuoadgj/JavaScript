// ==UserScript==
// @name         YouTube.com
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.01
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/YouTube.com.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/addEmbedCodeFrame.user.js
// @run-at       document-end
// @noframes
// @match        https://www.youtube.com/watch?*
// ==/UserScript==


(function() {
  'use strict';

  var test = false;
  // var test = true;

  if (
    pageURL.matchLink('https://www.youtube.com/watch?*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('meta[property="og:url"]').content;
      contentURL = contentURL.replace(/(.*)[?].*/i, '$1') + '?start=0';
      posterURL = document.querySelector('meta[property="og:image"]').content;
      posterURL = posterURL.replace(/(.*)\/.*default.jpg$/i, '$1/mqdefault.jpg');
      appendToFrame = document.querySelector('#watch-description');
      appendPosition = 'after';
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    var ClipConverterFixStyle = function() {
      var buttons = document.querySelectorAll('span#clipconverter > a > button'), i;
      for (i = 0; i < buttons.length; ++i) {
        var btn = buttons[i];
        var span = btn.querySelector('span');
        if (!span) {
          var text = btn.innerHTML;
          btn.innerHTML = '<span class="yt-uix-button-content"><strong>' + text + '</strong></span>';
        }
        btn.setAttribute('class', 'yt-uix-button yt-uix-button-opacity yt-uix-tooltip');
      }
    };
    var MagicOptionsFixStyle = function() {
      var panel = nthParent(document.querySelector('div[title="Magic Options"]'), 2);
      if (panel) panel.style.position = 'inherit';
    };
    waitForElement('meta[property="og:url"]', 'content', mainFunction, 1000, 30);
    waitForElement('span#clipconverter > a > button', false, ClipConverterFixStyle, 250, 30);
    waitForElement('div[title="Magic Options"]', false, MagicOptionsFixStyle, 250, 30);
    if (test) alert('test: 1');
  }
})();
