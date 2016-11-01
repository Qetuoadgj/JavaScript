// ==UserScript==
// @name         videoControls
// @icon         http://www.worldleathercongress2015.com/images/media_video.png
// @version      1.0.2
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/videoControls.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        https://*.googlevideo.com/videoplayback?id=*
// @match        http://*.ex.ua/show/*/*/*.mp4
// ==/UserScript==

(function() {
  'use strict';

  // THIS FILE GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  var delay = 1000, tries = 15;
  var videoSourceSelector = 'video > source[type="video/mp4"], video';
  var waitGroup = []; // waitForElement() timers group.
  // ====================================================================================================================
  function applyVideoSettings() {
    var videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
    var videoPoster = null; //video.poster
    var videoCleaned = getCleanVideo(videoSource, videoPoster);
    videoCleaned.play();
    videoCleaned.volume = 0.5;
    addMouseWheelAudioControl(videoCleaned, 5);
    useVolumeCookie('body > video', null);
    waitGroup = null;
  }
  waitForElement(videoSourceSelector, 'src', applyVideoSettings, delay, tries, null, waitGroup);
})();
