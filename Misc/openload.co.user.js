// ==UserScript==
// @name         openload.co
// @icon         https://www.google.com/s2/favicons?domain=openload.co
// @version      1.1.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/openload.co.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        https://openload.co/embed/*
// @match        https://openload.co/f/*
// @match        https://www.pornhub.com/embed/*
// @match        http://porndoe.com/video/embed/*
// @match        http://www.eporner.com/embed/*
// @match        https://www.eporner.com/embed/*
// @match        http://www.tube8.com/embed/*
// @match        http://streamin.to/embed*
// @match        http://pron.tv/embed/*
// @match        http://cdn.rhcdn.net/*.html
// @match        https://hqcollect.me/embed/*

/// @match        https://daxab.com/embed/*
/// @match        https://biqle.ru/RD/*

// @match        https://www.bitporno.sx/embed/*

// @match        https://*.googlevideo.com/videoplayback?id=*
// @match        http://*.porndoe.com/movie/*/*/*/*/*/*.mp4*
// @match        http://*.eporner.com/*/*/*-*p.mp4
// @match        http://mcloud.hdporncollections.com/*.mp4
// @match        http://redirector.rhcdn.net/media/videos/hd/*.mp4
// @match        http://*.rhcdn.net/media/videos/hd/*.mp4?*
// @match        https://*.pornhub.com/videos/*/*/*/*.mp4?*
// ==/UserScript==

(function() {
  'use strict';

  // THIS FILE GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  var videoElement, videoSource, videoPoster, videoCleaned;
  var videoSourceSelector = 'video > source[type="video/mp4"], video';
  var waitGroup = []; // waitForElement() timers group.

  var getCleanVideo = function(videoSrc, posterSrc) {
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
    return video;
  };

  function applyVideoSettings() {
    videoSource = videoSource || document.querySelectorAttribute(videoSourceSelector, 'src');
    // videoPoster = null; //video.poster
    videoCleaned = getCleanVideo(videoSource, videoPoster);
    videoCleaned.play();
    videoCleaned.volume = 0.5;
    addMouseWheelAudioControl(videoCleaned, 5);
    useVolumeCookie('body > video', null);
    waitGroup = null;
  }
  var mainFunction, initFunction = function(){mainFunction(); applyVideoSettings();}, getSource;
  var delay = 1000, tries = 15;
  var playButtonSelector;
  var clickPlay = function(){var p = document.querySelector(playButtonSelector); p.click(); waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, null, waitGroup);};
  // ====================================================================================================================

  if (pageURL.matchLink('https://openload.co/*')) { // https://openload.co/embed/pM1MQGKY7z4/
    mainFunction = function() {
      videoSource = '/stream/' + document.querySelector('#streamurl').innerText + '?mime=true';
      videoPoster = null; //document.querySelector('#olvideo_html5_api').poster
    };
    waitForElement('#olvideo_html5_api', null, initFunction, delay, tries, null, waitGroup);
  }

  else if (
    pageURL.matchLink('https://www.pornhub.com/*') || // https://www.pornhub.com/embed/ph55b7a22ed4339
    pageURL.matchLink('http://www.tube8.com/embed/*') || // http://www.tube8.com/embed/teen/all-a-slut-needs-is-a-reason/31637961/
    pageURL.matchLink('http://porndoe.com/*') || // http://porndoe.com/video/embed/45914/deep-throat-fucking-sasha-grey
    pageURL.matchLink('http://streamin.to/*') // http://streamin.to/embed-zlu0667c26hp-828x480.html
  ) {
    mainFunction = function() {
      videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
      videoPoster = null; //video.poster
    };
    waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, null, waitGroup);
  }

  else if (pageURL.matchLink('http://www.eporner.com/*') || pageURL.matchLink('https://www.eporner.com/*')) { // http://www.eporner.com/embed/ddPNLJUuNih/
    mainFunction = function() {
      videoSource =  document.querySelectorAttribute('#EPvideo_html5_api', 'src');
      videoPoster = null; //video.poster
    };
    waitForElement('#EPvideo_html5_api', 'src', initFunction, delay, tries, null, waitGroup);
  }

  else if (
    // pageURL.matchLink('http://pron.tv/embed/*') || // http://pron.tv/embed/id%3Arws2x9se
    pageURL.matchLink('http://cdn.rhcdn.net/*.html') // http://cdn.rhcdn.net/6043.html
  ) {
    getSource = function() {
      var source = player ? player.playerInfo.options.source : document.querySelectorAttribute(videoSourceSelector, 'src');
      console.log('source: '+source);
      return source;
    };
    mainFunction = function() {
      var videoSource = getSource();
      if (videoSource.match('/index.m3u8')) {
        window.open('chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html#'+videoSource, '_self');
      } else {
        videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
        videoPoster = null; //video.poster
        applyVideoSettings();
      }
      waitGroup = null;
    };
    waitForCondition(getSource, mainFunction, delay, tries, null, waitGroup);
  }

  else if (
    pageURL.matchLink('https://hqcollect.me/embed/*') // https://hqcollect.me/embed/214394
  ) {
    mainFunction = function() {
      videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
      videoPoster = null; //video.poster
    };
    playButtonSelector = 'div.fp-ui';
    waitForElement(playButtonSelector, null, clickPlay, delay, tries, null, waitGroup);
  }

  else if (
    pageURL.matchLink('https://www.bitporno.sx/embed/*') // https://www.bitporno.sx/embed/WEKddpz0
  ) {
    mainFunction = function() {
      videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
      videoPoster = null; //video.poster
    };
    playButtonSelector = 'input[type="image"]';
    waitForElement(playButtonSelector, null, clickPlay, delay, tries, null, waitGroup);
    waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, null, waitGroup);
  }

  else if (
    pageURL.matchLink('https://daxab.com/embed/*') || // https://daxab.com/embed/-59740963_456244433 | https://daxab.com/embed/-59740963_456244433/RD
    pageURL.matchLink('https://biqle.ru/RD/*') // pseudo redirection page
  ) {
    var url;
    if (pageURL.matchLink('https://daxab.com/embed/*/RD')) { // redirect to https://biqle.ru (pseudo redirection page)
      url = pageURL.replace(/\/RD$/, '');
      window.location = 'https://biqle.ru/RD/'+url;
    } else if (pageURL.matchLink('https://biqle.ru/RD/*')) { // redirect back to embed video page
      url = pageURL.replace('https://biqle.ru/RD/', '');
      window.location = url;
    } else if (pageURL.matchLink('https://daxab.com/embed/*')) { // play embed video
      waitForElement(videoSourceSelector, 'src', applyVideoSettings, delay, tries, null, waitGroup);
    }
  }

  else {
    waitForElement(videoSourceSelector, 'src', applyVideoSettings, delay, tries, null, waitGroup);
  }
})();