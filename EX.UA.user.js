// ==UserScript==
// @name         EX.UA
// @icon         https://www.google.com/s2/favicons?domain=ex.ua
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/EX.UA.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/addEmbedCodeFrame.user.js
// @run-at       document-end
// @noframes
// @match        http://www.ex.ua/*
// ==/UserScript==


(function() {
  'use strict';

  var test = false;
  // var test = true;

  if (
    pageURL.matchLink('http://www.ex.ua/*')
  ) {
    mainFunction = function() {
      var tmpArray = [], playList = [];
      createLink = false;
      createPoster = false;
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

      addEmbedCodeFrame();
      auto_grow(document.getElementById("oldEmbedCodeFrame").querySelector('textarea'));
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    mainFunction();
    if (test) alert('test: 1');
  }
})();
