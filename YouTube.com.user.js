// ==UserScript==
// @name         YouTube.com
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/YouTube.user.js
// @match        https://www.youtube.com/watch?*
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  var mainFunction = function() {
    contentURL = document.querySelector('meta[property="og:url"]').content.replace(/(.*)[?].*/i, '$1') + '?start=0';
    posterURL = document.querySelector('meta[property="og:image"]').content.replace(/(.*)\/.*default.jpg$/i, '$1/mqdefault.jpg');
    appendToFrame = document.querySelector('#watch-description');
    appendPosition = 'after';
    addEmbedCodeFrame(mainFunction);
    addKeyComboCtrlC(true);
  };
  var ClipConverterFixStyle = function() {
    var buttons = document.querySelectorAll('span#clipconverter > a > button');
    for (var index = 0; index < buttons.length; index++) {
      var button = buttons[index];
      var span = button.querySelector('span');
      if (!span) {
        var text = button.innerHTML;
        button.innerHTML = '<span class="yt-uix-button-content"><strong>' + text + '</strong></span>';
      }
      button.setAttribute('class', 'yt-uix-button yt-uix-button-opacity yt-uix-tooltip');
    }
  };
  var MagicOptionsFixStyle = function() {
    var panel = document.querySelector('div[title="Magic Options"]').nthParentNode(2);
    if (panel) panel.style.position = 'inherit';
  };
  waitForElement('meta[property="og:url"]', 'content', mainFunction, 1000, 5, false);
  waitForElement('span#clipconverter > a > button', false, ClipConverterFixStyle, 250, 20, false);
  waitForElement('div[title="Magic Options"]', false, MagicOptionsFixStyle, 250, 20, false);
})();
