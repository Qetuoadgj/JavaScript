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
// ==/UserScript==

(function() {
  'use strict';

  // https://openload.co/embed/pM1MQGKY7z4/
  // document.querySelector("#videooverlay").remove();
  // document.querySelector(".title").remove();
  // document.querySelector(".logocontainer").remove();
  var video = document.querySelector("#olvideo_html5_api").cloneNode(true);
  var poster = video.poster;
  var srclink = "/stream/" + document.querySelector("#streamurl").innerText + "?mime=true";
  video = document.createElement('video');
  video.setAttribute('src', srclink);
  // video.setAttribute('poster', poster);
  video.setAttribute('controls', '');
  video.setAttribute('webkitallowfullscreen', '');
  video.setAttribute('mozallowfullscreen', '');
  video.setAttribute('allowfullscreen', '');
  document.documentElement.innerHTML = '';
  document.body.appendChild(video);
  addGlobalStyle('video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black;}');
  addGlobalStyle('body {margin: 0; background: black;}');
  video.play();
  video.volume = 0.5;
  addMouseWheelAudioControl(video, 5);
})();