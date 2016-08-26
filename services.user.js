// ==UserScript==
// @name         services
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @noframes
// @run-at       document-end
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/services.user.js
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
  var iframeElement, parentDocument;
  // ====================================================================================================================

  if (
    pageURL.matchLink('http://porndoe.com/video/*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('video.jw-video').src;
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('div.video');
      appendPosition = 'after';
      qualityButtons = [document.querySelector('.jw-icon-hd')];
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('video.jw-video', 'src', mainFunction, 1000, 5, false);
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
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('meta[property="og:image"]', 'content', mainFunction, 1000, 5, false);
  }

  else if (
    pageURL.matchLink('http://sexix.net/*') ||
    pageURL.matchLink('http://i.sexix.net/*') ||
    pageURL.matchLink('http://hdpoz.com/*') ||
    pageURL.matchLink('http://i.hdpoz.com/*')
  ) {
    addGlobalStyle('.clip > img {position: relative; width: 140px; z-index: 10000;}');
    mainFunction = function() {
      iframeElement = document.querySelector('.videoContainer > iframe');
      parentDocument = iframeElement ? (iframeElement.contentDocument || iframeElement.contentWindow.document) : document;
      contentURL = parentDocument.querySelector('video').src;
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video');
      appendPosition = 'after';
      qualityButtons = [parentDocument.querySelector('.jwhd')];
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    if (
      pageURL.matchLink('sexix.net/video') ||
      pageURL.matchLink('hdpoz.com/HD')
    ) {
      waitForElement('video', 'src', mainFunction, 1000, 5, false);
      waitForElement('video', 'src', mainFunction, 1000, 5, '.videoContainer > iframe');
      /*waitForElement(
        'video', 'src',
        function() {
          iframeElement = document.querySelector('.videoContainer > iframe');
          parentDocument = iframeElement ? (iframeElement.contentDocument || iframeElement.contentWindow.document) : document;
          var menuElements, hdOptions, hdButton, btnToClick;
          menuElements = parentDocument.querySelectorAll('#player_controlbar_hd > .jwoption');
          hdOptions = ['1080p', '720p'];
          hdButton = getHDButton(menuElements, hdOptions)[0];
          btnToClick = hdButton;
          var checkPressed = function(option){return btnToClick.classList.contains('active');};
          pressHDButton(btnToClick, checkPressed, 500);
          mainFunction();
        }, 1000, 5, '.videoContainer > iframe'
      );*/
    }
  }

  else if (
    pageURL.matchLink('http://spankbang.com/*/video/*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('#video_player_html5_api').src;
      posterURL = document.querySelector('#video > div.left > section.timeline > figure > img:nth-child(6)').src;
      appendToFrame = document.querySelector('.toolbar');
      appendPosition = 'after';
      embedCodeFrame_Margin = '0.2% 0px';
      qualityButtons = asArray(document.querySelectorAll('#video > div.left > nav > ul.right_set > li.q_super'));
      qualityButtons = qualityButtons.concat(asArray(document.querySelectorAll('.vjs-resolution-button > div > ul > li.vjs-menu-item')));
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('meta[property="og:image"]', 'content', mainFunction, 1000, 5, false);
  }

  else if (
    pageURL.matchLink('http://www.babesandstars.com/*/*/*/')
  ) {
    embedCodeTextRefresh = false;
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
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('.my_gallery', false, mainFunction, 1000, 5, false);
  }

  else if (
    pageURL.matchLink('http://www.xvideos.com/video*')
  ) {
    var forceHLS = true;
    var menuElements, hdOptions, hdButtonData, hdButton, btnToClick;
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
      embedCodeFrame_BackgroundColor = document.body.getComputedProperty('background-color');
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    // waitForElement('meta[property="og:image"]', 'content', mainFunction, 1000, 5, false);
    waitForElement(
      'meta[property="og:image"]', 'content',
      function(){
        menuElements = document.querySelectorAll('.parameter_element_txt');
        hdOptions = ['1080p', '720p'];
        hdButtonData = getHDButton(menuElements, hdOptions);
        if (hdButtonData) {
          hdButton = getHDButton(menuElements, hdOptions)[0];
          btnToClick = hdButton.parentNode;
          var checkPressed = function(option){return btnToClick.classList.contains('parameterelmt_forced');};
          pressHDButton(btnToClick, checkPressed, 500);
        }
        mainFunction();
      },
      1000, 5, false
    );
  }

  else if (
    pageURL.matchLink('http://www.pornhub.com/view_video.php[?]viewkey=*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('meta[name="twitter:player"]').content;
      posterURL = document.querySelector('meta[name="twitter:image"]').content;
      appendToFrame = document.querySelector('.video-actions-container');
      appendPosition = 'before';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('meta[name="twitter:player"]', 'content', mainFunction, 1000, 5, false);
  }

  else if (
    pageURL.matchLink('http://www.eporner.com/hd-porn/*/*/')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('#EPvideo_html5_api').src;
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#cutscenes');
      appendPosition = 'before';
      qualityButtons = [document.querySelector('.vjs-control-bar > .vjs-icon-hd > .vjs-menu > .vjs-menu-content')];
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('#EPvideo_html5_api', 'src', mainFunction, 1000, 5, false);
  }

  else if (
    pageURL.matchLink('http://www.tube8.com/*/*/*/*')
  ) {
    mainFunction = function() {
      var data = flashvars; // tube8.com global
      contentURL = data.quality_1080p || data.quality_720p || data.quality_480p || data.quality_360p || data.quality_180p; // direct
      contentURL = page_params.embedCode ? page_params.embedCode.match(/.*src="(.*?)".*/i)[1] : contentURL; // embed
      posterURL = data.image_url;
      appendToFrame = document.querySelector('.underplayer_wrap');
      appendPosition = 'before';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForCondition(function(){return flashvars;}, mainFunction, 1000, 5, false);
  }

})();
