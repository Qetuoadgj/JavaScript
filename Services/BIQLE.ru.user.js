// ==UserScript==
// @name         BIQLE.ru
// @icon         https://www.google.com/s2/favicons?domain=biqle.ru
// @version      1.0.4
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-start
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/BIQLE.ru.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        https://biqle.ru/*
// @match        https://daxab.com/embed/*
// @match        https://daxab.com/player/*
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  // THIS FILE GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  var videoSourceSelector = 'video > source[type="video/mp4"], video';
  var videoElement, videoSource, videoPoster, videoCleaned;
  var mainFunction, initFunction = function(){mainFunction();};
  var delay = 1000, tries = 15;
  // var mainFunctionTG = [];

  var useVolumeCookie = function(mediaElementSelector, cookieName) {
    cookieName = cookieName || 'media';
    var volumeCookie = cookieName+'Volume';
    var mediaVolume = getCookie(volumeCookie);
    var mutedCookie = cookieName+'Muted';
    var mediaMuted = getCookie(mutedCookie);
    if (mediaMuted == 'false') mediaMuted = false; // normalize
    var mediaElementsArray = document.querySelectorAll(mediaElementSelector);
    for (var i = 0; i < mediaElementsArray.length; ++i) {
      var mediaElement = mediaElementsArray[i];
      if (mediaVolume) mediaElement.volume = mediaVolume;
      mediaElement.muted = mediaMuted;
      mediaElement.addEventListener('volumechange', function() {
        setCookie(volumeCookie, mediaElement.volume || 0, 1);
        setCookie(mutedCookie, mediaElement.muted, 1);
      }, false);
      console.log('mediaElement: ' + mediaElement);
      console.log('volumeCookie: ' + volumeCookie + ' = ' + getCookie(volumeCookie));
      console.log('mutedCookie: ' + mutedCookie + ' = ' + getCookie(mutedCookie));
    }
  };

  function addHDtext(selector, color) {
    selector = selector || 'a';
    var linksArray = document.querySelectorAll(selector);
    for (var i = 0; i < linksArray.length; ++i) {
      var link = linksArray[i], thumb = link.parentNode, title = link.title || link.innerText;
      var quality = title ? title.match('(1080)p?') || title.match('(720)p?') : null;
      var hdIcon = thumb.querySelector('.hd_icon');
      if (quality && !hdIcon) {
        quality = quality[1];
        var text = document.createElement('div');
        if (quality == '1080') text.style.background = 'rgba(255, 0, 0, 0.15)';
        else if (quality == '720') text.style.background = 'rgba(0, 45, 255, 0.25)';
        text.style.zIndex = 2147483647; // '10000';
        text.style.position = 'absolute'; // 'inherit'
        text.style.width = 'auto';
        text.style.height = '20px';
        text.style.float = 'right';
        if (color) text.style.color = color; // 'rgba(0, 253, 255, 0)';
        text.style.padding = '0px 2px';
        text.style.border = '1px solid rgba(255,255,255,0.2)';
        text.innerText = quality+'p';
        // thumb.appendChild(text);
        thumb.insertBefore(text, thumb.firstChild);
        // thumb.appendChild(document.createTextNode("HD"));
        text.style.right = '0';
        text.className = 'hd_icon';
      }
    }
  }

  function getCleanVideo(videoSrc, posterSrc) {
    var video = document.createElement('video');
    video.setAttribute('src', videoSrc);
    if (posterSrc) video.setAttribute('poster', posterSrc);
    video.setAttribute('controls', '');
    video.setAttribute('webkitallowfullscreen', '');
    video.setAttribute('mozallowfullscreen', '');
    video.setAttribute('allowfullscreen', '');
    document.documentElement.innerHTML = '';
    document.body.appendChild(video);
    addGlobalStyle('video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black;}');
    addGlobalStyle('body {margin: 0; background: black;}');
    console.log('video: '+videoSrc);
    return video;
  }

  function applyVideoSettings() {
    videoSource = videoSource || document.querySelectorAttribute(videoSourceSelector, 'src');
    // videoPoster = null; //video.poster
    videoCleaned = getCleanVideo(videoSource, videoPoster);
    videoCleaned.play();
    videoCleaned.volume = 0.5;
    addMouseWheelAudioControl(videoCleaned, 5);
    useVolumeCookie('body > video', null);
    // mainFunctionTG = null;
  }

  // ====================================================================================================================

  // redirect to https://biqle.ru (pseudo redirection page)
  if (
    pageURL.matchLink('^https://daxab.com/embed/*/RD') // https://daxab.com/embed/-37492055_456242005/RD
  ) window.location = 'https://biqle.ru/RD'+'/'+pageURL.replace(/\/RD$/, ''); // https://daxab.com/embed/-37492055_456242005
  // else if (
  //   pageURL.matchLink('^https://daxab.com/player/RD/*') // https://daxab.com/player/RD/?oid=-109163984&id=456241096
  // ) window.location = 'https://biqle.ru/RD'+'/'+pageURL.replace(/\/RD\//, '/'); // https://daxab.com/player/?oid=-109163984&id=456241096

  // play embed video
  else if (
    pageURL.matchLink('^https://daxab.com/embed/*') || // https://daxab.com/embed/-37492055_45624200
    pageURL.matchLink('^https://daxab.com/player/*')  // https://daxab.com/player/?oid=-109163984&id=456241096
  ) {
    initFunction = function(){mainFunction(); applyVideoSettings();};
    document.addEventListener("DOMContentLoaded", function() { // @run-at document-end sumulation
      waitForElement(videoSourceSelector, 'src', applyVideoSettings, 10, false, false, false);
    });
  }

  // redirect back to embed video page
  else if (pageURL.matchLink('^https://biqle.ru/RD/*')) { // https://biqle.ru/RD/https://daxab.com/embed/-37492055_456242005
    // document.head.innerHTML = null; document.body.innerHTML = null;
    document.open(); // empty document
    window.location = pageURL.replace('https://biqle.ru/RD/', '');
  }

  else if (pageURL.matchLink('^https://biqle.ru/*')) {
    var handleNewElements = function(target) {
      var targetClassName = 'video-item';
      var parsedClassName = 'no_hd_icon';
      if (target.classList && target.classList.contains(targetClassName) && !target.classList.contains(parsedClassName)) {
        addHDtext('.video-title', 'rgba(255, 255, 255, 1)');
        addOpenInNewTabProperty('.video-item > a');
        target.addClass(parsedClassName);
      }
    };
    document.addEventListener('DOMNodeInserted', function(event){handleNewElements(event.target);} , false);
    window.onload = function() { // @run-at document-end sumulation
      addHDtext('.video-title', 'rgba(255, 255, 255, 1)');
      addOpenInNewTabProperty('.video-item > a');
    };

    if (pageURL.matchLink('https://biqle.ru/watch/*')) { // https://biqle.ru/watch/-109163984_456241096
      mainFunction = function() {
        contentURL = document.querySelector('iframe').src;
        if (contentURL.match('https://daxab.com/player/')) contentURL = contentURL.replace('/player/?oid=', '/player/RD/?oid=');
        else if (contentURL.match('https://daxab.com/embed/')) contentURL = contentURL + '/RD';
        posterURL = document.querySelector('link[itemprop="thumbnailUrl"]').href;
        appendToFrame = document.querySelector('.heading');
        appendPosition = 'before';
        addEmbedCodeFrame(mainFunction);
        addKeyComboCtrlC(true);
      };
      document.addEventListener("DOMContentLoaded", function() { // @run-at document-end sumulation
        waitForElement('iframe', 'src', mainFunction, delay, tries, false, false);
      });
    }
  }
})();