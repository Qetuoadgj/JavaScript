// ==UserScript==
// @name         Video Controls
/// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Video%20Controls.user.js
// @match        https://*.googlevideo.com/videoplayback?id=*
// @match        http://*.ex.ua/show/*/*/*.mp4
// @match        http://*.porndoe.com/movie/*/*/*/*/*/*.mp4?*
// @match        http://*.eporner.com/*/*/*-*p.mp4
// ==/UserScript==

(function() {
  'use strict';

  function LaunchVideo() {
    var videoFrame = document.querySelector('body > video');
    videoFrame.play();
    videoFrame.volume = 0.5;
    MouseWheelAudioControl(videoFrame, 5);
  }

  waitForElement('body > video', false, LaunchVideo, 250, 30);
})();
