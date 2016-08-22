// ==UserScript==
// @name         SERVICES
// @version      1.0.9
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/SERVICES.user.js
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
// @match        http://www.xvideos.com/video*
// @match        http://www.pornhub.com/view_video.php?viewkey=*
// @match        http://www.eporner.com/hd-porn/*/*/
// @match        http://www.tube8.com/*/*/*/*
// ==/UserScript==

/* PATTERNS

else if (
  pageURL.matchLink('')
) {
}

*/

(function() {
  'use strict';

  var test = false;
  // var test = true;

  // addEmbedCodeFrame.user.js GLOBAL VARIABLES
  // ====================================================================================================================
  // contentTitle = false;
  // embedCodeText = false;
  // createLink = true;
  // createPoster = true;
  textAreaAutoHeight = false;
  // embedCodeTextRefresh = true;
  // ====================================================================================================================

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
      textAreaAutoHeight = true;
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    waitForElement('.my_gallery', false, mainFunction, 1000, 30);
    if (test) alert('test: 5');
  }

  else if (
    pageURL.matchLink('http://www.xvideos.com/video*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('#tabEmbed > input').value.replace(/.*src="(.*?)".*/i, '$1');

      var isHD = !true;
      if (!isHD) {
        var parametermenu = document.querySelectorAll('.parameter_element_txt');
        forEach(parametermenu, function(index, self) {
          if (!isHD) {
            var text = self.innerHTML;
            isHD = (text == '1080p HD') || (text == '720p HD') || isHD;
            if (isHD) self.parentNode.click();
          }
        });
      }

      isHD = true;

      forEach(document.scripts, function(index, self) {
        var text = self.text;
        if (isHD) contentURL = text.match('html5player.setVideoHLS') ? text.match(/html5player\.setVideoHLS\('(.*?)'\)/i)[1] : contentURL; // HD
        else contentURL = text.match('html5player.setVideoUrlHigh') ? text.match(/html5player\.setVideoUrlHigh\('(.*?)'\)/i)[1] : contentURL; // HQ
      });

      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video-player-bg');
      appendPosition = 'after';
      embedCodeFrame_BackgroundColor = getElementComputedStyle(document.body, 'background-color');
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    var mainFrame = document.querySelector('div#content');
    mainFrame.style['max-width'] = '1280px';
    waitForElement('meta[property="og:image"]', 'content', mainFunction, 1000, 30);
    if (test) alert('test: 6');
  }

  else if (
    pageURL.matchLink('http://www.pornhub.com/view_video.php[?]viewkey=*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('meta[name="twitter:player"]').content;
      posterURL = document.querySelector('meta[name="twitter:image"]').content;
      appendToFrame = document.querySelector('.video-actions-container');
      appendPosition = 'before';
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    waitForElement('meta[name="twitter:player"]', 'content', mainFunction, 1000, 30);
    if (test) alert('test: 7');
  }

  else if (
    pageURL.matchLink('http://www.eporner.com/hd-porn/*/*/')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('#EPvideo_html5_api').src;
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#cutscenes');
      appendPosition = 'before';
      changeQualityButton('.vjs-control-bar > .vjs-icon-hd > .vjs-menu > .vjs-menu-content');
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    waitForElement('#EPvideo_html5_api', 'src', mainFunction, 1000, 30);
    if (test) alert('test: 8');
  }

  else if (
    pageURL.matchLink('http://www.tube8.com/*/*/*/*')
  ) {
    mainFunction = function() {
      var data = flashvars;
      contentURL = data.quality_1080p || data.quality_720p || data.quality_480p || data.quality_360p || data.quality_180p; // direct
      contentURL = page_params.embedCode ? page_params.embedCode.match(/.*src="(.*?)".*/i)[1] : contentURL; // embed
      posterURL = data.image_url;
      appendToFrame = document.querySelector('.underplayer_wrap');
      appendPosition = 'before';
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
      clearTimeout();
    };
    waitForCondition(function(){return flashvars;}, mainFunction, 1000, 30);
    if (test) alert('test: 9');
  }
})();
