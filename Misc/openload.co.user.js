// ==UserScript==
// @name         openload.co
// @icon         https://www.google.com/s2/favicons?domain=openload.co
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
//// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/openload.co.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        https://openload.co/embed/*
// @match        https://openload.co/f/*
// @match        https://www.pornhub.com/embed/*
// ==/UserScript==

(function() {
  'use strict';

  // THIS FILE GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  var videoElement, videoSource, videoPoster, videoCleaned;
  var mainFunction, initFunction = function(){mainFunction();};
  var delay = 1000, tries = 15;
  // ====================================================================================================================

  if (
    pageURL.matchLink('https://openload.co/*')
  ) {
    // https://openload.co/embed/pM1MQGKY7z4/
    mainFunction = function() {
      videoElement = document.querySelector('#olvideo_html5_api');
      videoSource = '/stream/' + document.querySelector('#streamurl').innerText + '?mime=true';
      videoPoster = null; //video.poster
      videoCleaned = getCleanVideo(videoSource, videoPoster);
      videoCleaned.play();
      videoCleaned.volume = 0.5;
      addMouseWheelAudioControl(videoCleaned, 5);
    };
    waitForElement('#olvideo_html5_api', null, initFunction, delay, tries, null);
  }

  else if (
    pageURL.matchLink('https://www.pornhub.com/*')
  ) {
    // https://www.pornhub.com/embed/ph55b7a22ed4339
    mainFunction = function() {
      // videoElement = document.querySelector('video');
      videoSource =  document.querySelector('video > source[type="video/mp4"]').src;
      // videoSource = videoSource.replace('cdn-d-vid-embed', 'cdn-d-vid-public');
      // videoSource = videoSource.replace('/vl_480P_339', '/vl_720P_549');
      videoPoster = null; //video.poster
      videoCleaned = getCleanVideo(videoSource, videoPoster);
      videoCleaned.play();
      videoCleaned.volume = 0.5;
      addMouseWheelAudioControl(videoCleaned, 5);
    };
    waitForElement('video > source[type="video/mp4"]', 'src', initFunction, delay, tries, null);
  }
})();