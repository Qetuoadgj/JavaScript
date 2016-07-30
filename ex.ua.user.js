// ==UserScript==
// @name         ex.ua
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @match        http://www.ex.ua/*
// @grant        none
// @updateURL    https://github.com/Qetuoadgj/JavaScript/raw/master/ex.ua.user.js
// @icon         https://www.google.com/s2/favicons?domain=ex.ua
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}

  String.prototype.Capitalize = function() {
    return this.split(' ').map(capFirst).join(' ');
    function capFirst(str) {
      return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);
    }
  };

  function textFrameAutoHeight(element) {
    var lineHeight = element.style['font-size'].replace('px', '');
    var frameHeight = element.scrollHeight;
    var numberOfLines = Math.floor(frameHeight/lineHeight);
    element.style.height = lineHeight * (numberOfLines+0.5) + 'px';
    element.style.rows = numberOfLines;
    if (!element.value || element.value === '') element.style.height = '0px';
  }

  function addGlobalStyle(css, cssClass) {
    var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
    var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
    if (cssClass) style.setAttribute('class', cssClass);
    head.appendChild(style);
  }

  function appendFrame(targetFrame, appendPosition, appendToFrame) {
    if (appendPosition == 'after') {
      appendToFrame.parentNode.insertBefore(targetFrame, appendToFrame.nextSibling);
    } else if (appendPosition == 'before') {
      appendToFrame.parentNode.insertBefore(targetFrame, appendToFrame);
    } else if (appendPosition == 'append') {
      appendToFrame.appendChild(targetFrame);
    }
  }

  function CreateFileList(optimized, download) {
    var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
    var targetFrame, embedFrameMargin, embedLinkMargin, embedFrameBackgroundColor;

    targetFrame = document.querySelector('#body_element');
    if (targetFrame) {
      var title = pageTitle.replace(/^.{1} /i, '').Capitalize();

      var oldEmbedFrame = document.getElementById("ShowEmbedCode_Frame"); if (oldEmbedFrame) {oldEmbedFrame.remove();}

      var embedFrame = document.createElement('div');
      embedFrame.setAttribute('id', 'ShowEmbedCode_Frame');
      embedFrame.style.display = "block"; embedFrame.style['word-wrap'] = "break-word";
      // embedFrame.style.width = document.querySelector('div.l-content-wrap').offsetWidth - 20 + 'px';
      if (embedFrameMargin) {embedFrame.style.margin = embedFrameMargin;}
      if (embedFrameBackgroundColor) {embedFrame.style.backgroundColor = embedFrameBackgroundColor;}
      // targetFrame.parentNode.insertBefore(embedFrame, targetFrame.nextSibling);
      appendFrame(embedFrame, 'append', targetFrame);

      var textFrame = parent.document.createElement('textarea');
      textFrame.setAttribute('id', 'embedCodeTextFrame');
      textFrame.style.display = 'block'; textFrame.style.border = 'none';
      textFrame.style.rows = '2'; textFrame.style.overflow = 'hidden';
      textFrame.style['background-color'] = 'transparent'; textFrame.style.width = '100%';
      textFrame.style['font-size'] = '12px'; textFrame.style.color = 'grey';
      textFrame.setAttribute('readonly', 'readonly'); textFrame.setAttribute('onclick', 'this.focus(); this.select();');
      embedFrame.appendChild(textFrame);

      var embedCode;
      var generatePlaylist = function() {
        var groupTitle = title;

        var player_info_array = player_info;
        var player_list_array = player_list;
        player_list_array = player_list_array.replace(/"(type|url)":/gi, "$1:");
        player_list_array = player_list_array.replace(/"/g, "'");
        player_list_array = 'new Array('+player_list_array+')';
        player_list_array = eval(player_list_array);
        var tmpArray = [], playList = [];

        forEach(player_info_array, function(index, self) {
          var position = self.pos;
          var title = self.title;
          title = title.replace(/(.*)\..*$/g, "$1");
          tmpArray.push(title);
        });

        forEach(player_list_array, function(index, self) {
          var videoSrc = self.url;
          var videoTitle = tmpArray[index];
          if (index < 1) embedCode = '#EXTM3U\n';
          embedCode = embedCode + ('#EXTINF: -1 group-title="'+groupTitle+'",'+videoTitle+'\n'+videoSrc) + '\n';
        });

        textFrame.value = embedCode;
        textFrameAutoHeight(textFrame);
      };

      generatePlaylist();
    }
  }
  CreateFileList();
})();
