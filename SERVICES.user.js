// ==UserScript==
// @name         SERVICES
// @version      1.0.3
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/addEmbedCodeFrame.user.js
// @run-at       document-end
// @noframes
// @match        http://porndoe.com/video/*
// @match        http://www.porntrex.com/video/*/*
// @match        http://sexix.net/video*
// @match        http://i.sexix.net/video*
// @match        http://sexix.net/*
// @match        http://hdpoz.com/HD*
// @match        http://i.hdpoz.com/HD*
// @match        http://hdpoz.com/*
// @match        http://spankbang.com/*/video/*
// @match        http://www.babesandstars.com/*/*/*/

// ==/UserScript==

(function() {
  'use strict';

  var test = false;
  // var test = true;

  if (
    pageURL.matchLink('http://porndoe.com/video/*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('video.jw-video').src;
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('div.video');
      appendPosition = 'after';
      changeQualityButton('.jw-icon-hd');
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    waitForElement('video.jw-video', 'src', mainFunction, 1000, 30);
    if (test) alert('test: 1');
  }

  else if (
    pageURL.matchLink('http://www.porntrex.com/video/*/*')
  ) {
    mainFunction = function() {
      contentURL = pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'http://www.porntrex.com/mobile_hd_src.php?id=$1');
      posters = [
        document.querySelector('meta[property="og:image"]').content,
        pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'http://www.porntrex.com/media/videos/tmb/$1/1.jpg'),
        pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'http://www.porntrex.com/media/videos/tmb1/$1/1.jpg'),
      ];
      appendToFrame = document.querySelector('.video-container');
      appendPosition = 'after';
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    waitForElement('meta[property="og:image"]', 'content', mainFunction, 1000, 30);
    if (test) alert('test: 2');
  }

  else if (
    pageURL.matchLink('http://sexix.net/*') ||
    pageURL.matchLink('http://i.sexix.net/*') ||
    pageURL.matchLink('http://hdpoz.com/*') ||
    pageURL.matchLink('http://i.hdpoz.com/*')
  ) {
    var iframeElement = document.querySelector('.videoContainer > iframe');
    mainFunction = function() {
      if (iframeElement) {
        contentURL = getAttributeInIframe(iframeElement, 'video', 'src');
        var innerDoc = iframeElement.contentDocument || iframeElement.contentWindow.document;
        changeQualityButton('.jwhd', innerDoc);
      } else {
        contentURL = document.querySelector('#player_media > video').src;
        changeQualityButton('.jwhd');
      }
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video');
      appendPosition = 'after';
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    if (
      pageURL.matchLink('sexix.net/video') ||
      pageURL.matchLink('hdpoz.com/HD')
    ) {
      if (iframeElement) {
        waitForCondition(function(){return getAttributeInIframe(iframeElement, 'video', 'src');}, mainFunction, 1000, 30);
      } else {
        waitForElement('#player_media > video', 'src', mainFunction, 1000, 30);
      }
    }
    addGlobalStyle('.clip > img {position: relative; width: 140px; z-index: 10000;}');
    if (test) alert('test: 3');
  }

  else if (
    pageURL.matchLink('http://spankbang.com/*/video/*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('#video_player').src;
      posterURL = document.querySelector('#video > div.left > section.timeline > figure > img:nth-child(6)').src;
      appendToFrame = document.querySelector('.toolbar');
      appendPosition = 'after';
      embedCodeFrame_Margin = '0.2% 0px';
      changeQualityButton('div.jw-group.jw-controlbar-right-group.jw-reset');
      changeQualityButton('nav > ul.right_set');
      // embedCodeText = false;
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    waitForElement('meta[property="og:image"]', 'content', mainFunction, 1000, 30);
    if (test) alert('test: 4');
  }

  else if (
    pageURL.matchLink('http://www.babesandstars.com/*/*/*/')
  ) {
    mainFunction = function() {
      var gallery, images = [];
      gallery = document.querySelector('.my_gallery');
      images = gallery.querySelectorAll('figure > a > img');
      forEach(images, function(index, self) {
        contentURL = self.parentNode.href;
        posterURL = self.src;
        contentTitle = ''; //pageTitle.replace(/^.{1} /i, '').Capitalize();
        if (embedCodeText) {embedCodeText = embedCodeText + '\n' + '<div class="thumbnail"';} else {embedCodeText = '<div class="thumbnail"';}
        if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
        if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
        embedCodeText += ' content="'+contentURL+'"';
        if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
        embedCodeText += '></div>';
      });
      appendToFrame = gallery;
      appendPosition = 'after';
      addEmbedCodeFrame();
      auto_grow(document.getElementById("oldEmbedCodeFrame").querySelector('textarea'));
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    waitForElement('.my_gallery', false, mainFunction, 1000, 30);
    if (test) alert('test: 5');
  }
})();