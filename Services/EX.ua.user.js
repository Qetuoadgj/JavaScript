// ==UserScript==
// @name         EX.ua
// @icon         https://www.google.com/s2/favicons?domain=ex.ua
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/EX.ua.user.js
// @match        http://www.ex.ua/*
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
    var tmpArray = [], playList = [];
    createLink = false;
    createPoster = false;
    textAreaAutoHeight = true;
    embedCodeTextRefresh = false;
    appendToFrame = document.querySelector('#body_element');
    appendPosition = 'append';

    var player_info_array = player_info;
    forEach(player_info_array, function(index, self) {
      // var position = self.pos;
      var title = self.title;
      title = title.replace(/(.*)\..*$/g, "$1");
      tmpArray.push(title);
    });

    var player_list_array = JSON.parse('['+player_list+']');
    forEach(player_list_array, function(index, self) {
      var videoSrc = self.url;
      var videoTitle = tmpArray[index];
      var groupTitle = pageTitle.replace('@ EX.UA', '');
      if (index < 1) embedCodeText = '#EXTM3U\n';
      embedCodeText = embedCodeText + ('#EXTINF: -1 group-title="'+groupTitle+'",'+videoTitle+'\n'+videoSrc) + '\n';
    });

    addEmbedCodeFrame(mainFunction);
    addKeyComboCtrlC(true);
  };

  mainFunction();
})();
