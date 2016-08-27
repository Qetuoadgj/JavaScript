// ==UserScript==
// @name         YouTube.com
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/JS.Add.Embed.Code.Frame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/YouTube.user.js
// @match        https://www.youtube.com/watch?*
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  /* JS.Add.Embed.Code.Frame.Lib.user.js GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  var createLink = true, createPoster = true, contentURL, posterURL, appendToFrame, appendPosition;
  var embedCodeFrame_Margin, embedCodeLink_Margin, embedCodeFrame_BackgroundColor;
  var contentTitle;
  var embedCodeText;
  var posters = [];
  var qualityButtons = [];
  var textAreaAutoHeight = false, textAreaFixedHeight = false;
  var embedCodeTextRefresh = true;
  */

  // THIS FILE GLOBAL VARIABLES
  // ====================================================================================================================
  var mainFunction;
  var delay = 1000,
      tries = 15;
  // ====================================================================================================================

  mainFunction = function() {
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
  waitForElement('meta[property="og:url"]', 'content', mainFunction, delay, tries, false);
  waitForElement('span#clipconverter > a > button', false, ClipConverterFixStyle, delay, tries, false);
  waitForElement('div[title="Magic Options"]', false, MagicOptionsFixStyle, delay, tries, false);
})();
