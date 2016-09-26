// ==UserScript==
// @name         YouTube.com
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.1
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        https://www.youtube.com/watch?*
// ==/UserScript==

(function() {
  'use strict';

  /* JS.AddEmbedCodeFrame.Lib.user.js GLOBAL VARIABLES
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
    var canBeEmbed = document.querySelector('link[itemprop="embedURL"]');
    if (!canBeEmbed) return msgbox('YouTube', 'This video can not be embed!', 2000, 250, 120);
    var flashvars = '?' +
        'start=0' +'&'+    // Start time
        'autoplay=1' +'&'+ // Enable Autoplay
        'hd=1' +'&'+       // Watch in HD
        'iv_load_policy=3' // Disable Annotations
    ;
    pageURL = document.querySelector('meta[itemprop="videoId"]').content.replace(/(.*)/i, 'https://www.youtube.com/watch/$1');
    contentURL = document.querySelector('meta[itemprop="videoId"]').content.replace(/(.*)/i, 'https://www.youtube.com/embed/$1') + flashvars;
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
