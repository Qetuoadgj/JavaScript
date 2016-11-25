// ==UserScript==
// @name         ph.com
// @icon         https://www.google.com/s2/favicons?domain=pornhub.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-start
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/ph.com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        http://www.pornhub.com/*
// @match        https://www.pornhub.com/embed/*
// @match        http://cdn-d-vid-public.pornhub.com/videos/*/*/*/*.mp4?*
// @match        http://*.rncdn3.com/videos/*/*/*/*.mp4?*
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
  /* // redirect to pseudo redirection page
  if (
    pageURL.match(/^https:\/\/www.pornhub.com\/embed\/.*?\?EmbedHD$/) // https://www.pornhub.com/embed/384102535?EmbedHD
  ) {
    window.location = 'http://www.pornhub.com/view_video.php?viewkey='+pageURL.replace(/.*\/embed\/(.*?)\?EmbedHD/, '$1')+'&'+'EmbedHD'; // http://www.pornhub.com/view_video.php?viewkey=384102535&EmbedHD
  }

  // get HD video URL and redirect to it
  else if (
    pageURL.matchLink('http://www.pornhub.com/view_video.php[?]viewkey=*&EmbedHD') // http://www.pornhub.com/view_video.php?viewkey=384102535&EmbedHD
  ) {
    document.addEventListener("DOMContentLoaded", function() { // @run-at document-end sumulation
      var VideoURL;
      if (typeof player_quality_1080p !== 'undefined') VideoURL = player_quality_1080p;
      else if (typeof player_quality_720p !== 'undefined') VideoURL = player_quality_720p;
      console.log('VideoURL: '+VideoURL);
      window.location = VideoURL;
    });
  } */

  // play HD or LQ Embed video
  if (
    // pageURL.matchLink('http://cdn-d-vid-public.pornhub.com/videos/*/*/*/*.mp4[?]*') || // http://cdn-d-vid-public.pornhub.com/videos/201507/17/53029121/vl_720_972k_53029121.mp4?ttl=1479173454&ri=2252800&rs=1216&hash=810dfc9325538b92012b2a437365118b
    // pageURL.matchLink('http://*.rncdn3.com/videos/*/*/*/*.mp4[?]*') || // http://ic.25197200.037f74.6.c3605.d.rncdn3.com/videos/201507/17/53029121/vl_720_972k_53029121.mp4?ipa=37.25.114.58&rs=152&ri=2200&s=1479168721&e=1479175921&h=12ea825d2bd1b86557cc6c3402f7e6d4
    pageURL.matchLink('https://www.pornhub.com/embed/*') // https://www.pornhub.com/embed/384102535
  ) {
    mainFunction = function() {
      videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
      console.log('videoSource: '+videoSource);
      videoPoster = null; //video.poster
    };
    initFunction = function(){mainFunction(); applyVideoSettings();};
    waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, false, false);
  }

  else if (
    pageURL.matchLink('http://www.pornhub.com/*') // http://www.pornhub.com/view_video.php?viewkey=384102535
  ) {
    document.addEventListener("DOMContentLoaded", function() { // @run-at document-end sumulation
      addOpenInNewTabProperty('.phimage a');
      addPageControlKeys('.page_previous.alpha > a', '.page_next.omega > a');
      if (pageURL.matchLink('http://www.pornhub.com/view_video.php[?]viewkey=*')) {
        mainFunction = function() {
          contentURL = document.querySelector('meta[name="twitter:player"]').content;
          // if (typeof player_quality_1080p !== 'undefined') contentURL += '?'+'EmbedHD';
          // else if (typeof player_quality_720p !== 'undefined') contentURL += '?'+'EmbedHD';
          posterURL = document.querySelector('meta[name="twitter:image"]').content;
          appendToFrame = document.querySelector('.video-actions-container');
          appendPosition = 'before';
          addEmbedCodeFrame(mainFunction);
          addKeyComboCtrlC(true);
        };
        waitForElement('meta[name="twitter:player"]', 'content', initFunction, delay, tries, false);
      }
    });
  }
})();