// ==UserScript==
// @name         SERVICES
// @version      1.1.1
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
    var iframeElement, parentDocument;
    mainFunction = function() {
      contentURL = parentDocument.querySelector('video').src;
      changeQualityButton('.jwhd', parentDocument);
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video');
      appendPosition = 'after';
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
    };
    if (
      pageURL.matchLink('sexix.net/video') ||
      pageURL.matchLink('hdpoz.com/HD')
    ) {
      // waitForElement('video', 'src', mainFunction, 1000, 3, '.videoContainer > iframe');
      waitForElement('video', 'src', function(){
        iframeElement = document.querySelector('.videoContainer > iframe');
        parentDocument = iframeElement ? (iframeElement.contentDocument || iframeElement.contentWindow.document) : document;
        var menuElements, hdOptions, hdButton, btnToClick;
        menuElements = parentDocument.querySelectorAll('#player_controlbar_hd > .jwoption');
        hdOptions = ['1080p', '720p'];
        hdButton = getHDButton2(menuElements, hdOptions)[0];
        btnToClick = hdButton;
        var checkPressed = function(option){return btnToClick.classList.contains('active');};
        pressHDButton(btnToClick, checkPressed, 500);
        mainFunction();
      }, 1000, 30, '.videoContainer > iframe');
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
    };
    waitForElement('.my_gallery', false, mainFunction, 1000, 30);
    if (test) alert('test: 5');
  }

  else if (
    pageURL.matchLink('http://www.xvideos.com/video*')
  ) {
    var forceHLS = true;
    var menuElements, hdOptions, hdButton, btnToClick;
    mainFunction = function() {
      forEach(document.scripts, function(index, self) {
        var text = self.text;
        if (hdButton || forceHLS) contentURL = text.match('html5player.setVideoHLS') ? text.match(/html5player\.setVideoHLS\('(.*?)'\)/i)[1] : contentURL; // HD
        else contentURL = text.match('html5player.setVideoUrlHigh') ? text.match(/html5player\.setVideoUrlHigh\('(.*?)'\)/i)[1] : contentURL; // HQ
      });
      contentURL = contentURL || document.querySelector('#tabEmbed > input').value.replace(/.*src="(.*?)".*/i, '$1');
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video-player-bg');
      appendPosition = 'after';
      embedCodeFrame_BackgroundColor = getElementComputedStyle(document.body, 'background-color');
      addEmbedCodeFrame();
      addKeyComboCtrlC(true);
    };
    waitForElement('meta[property="og:image"]', 'content', function(){
      menuElements = document.querySelectorAll('.parameter_element_txt');
      hdOptions = ['1080p', '720p'];
      hdButton = getHDButton(menuElements, hdOptions)[0];
      btnToClick = hdButton.parentNode;
      var checkPressed = function(option){return btnToClick.classList.contains('parameterelmt_forced');};
      pressHDButton(btnToClick, checkPressed, 500);
      mainFunction();
    }, 1000, 30, false);
    // var mainFrame = document.querySelector('div#content');
    // mainFrame.style['max-width'] = '1280px';
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
    };
    waitForCondition(function(){return flashvars;}, mainFunction, 1000, 30);
    if (test) alert('test: 9');
  }
})();
