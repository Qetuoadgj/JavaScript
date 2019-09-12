// ==UserScript==
// @name         hdrezka.video.resume
// @icon         https://www.google.com/s2/favicons?domain=rezka.ag
// @version      1.0.00
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/hdrezka.video.resume.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
/// @noframes
// @match        *://magicianer.cc/video/*
// @match        *://streamguard.cc/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var G_skipSec = 30;
    var G_videoElement, G_messageTarget;
    var videoElementSelector = [
        '.html5-video-container > video', // [YouTube.com]
        '#player video', // magicianer.cc, streamguard.cc [rezka.ag]
        'body video', // any page
    ].join(', ')
    var G_videoPage, G_videoTitle, G_videoOrigin;
    window.addEventListener('message', function(e) {
        if(typeof e.data === 'object' && e.data.sender === 'ANSWER' && e.data.url) {
            // alert('ANSWER.data.url: ' + e.data.url);
            G_videoPage = e.data.url;
            G_videoTitle = e.data.title;
            G_videoOrigin = e.data.origin + '' + e.data.pathname;
        };
        //
        let videoData = GM_getValue('videoData') || {};
        let videoDataIndex = 0;
        for (let key of Object.keys(videoData)) {
            if (key == G_videoTitle) {
                let data = videoData[key][G_videoPage];
                if (typeof data === "object") {
                    if (data.currentTime) G_videoElement.currentTime = data.currentTime; // <===
                    break;
                };
            };
            videoDataIndex++;
        };
        var G_timePlayingCur = 0, G_timePlayingLast = 0;
        function updateData(ignoreDelays = false) {
            if (G_videoElement) {
                if (G_videoElement.paused === false) {
                    G_timePlayingCur++;
                    if (ignoreDelays || (G_timePlayingCur - G_timePlayingLast) >= 10) {
                        let name = G_videoTitle;
                        if (typeof videoData[G_videoTitle] === "object" && typeof videoData[G_videoTitle][G_videoPage] === "object" && (G_videoElement.currentTime < G_skipSec)) {
                            delete videoData[G_videoTitle][G_videoPage];
                            if (typeof Object.keys(videoData[G_videoTitle])[0] === "undefined") delete videoData[G_videoTitle];
                            console.log(G_videoPage, G_timePlayingCur, G_videoElement.currentTime, 'ERASED');
                        }
                        else if (G_videoElement.currentTime >= G_skipSec) {
                            videoData[G_videoTitle] = videoData[G_videoTitle] || {};
                            videoData[G_videoTitle][G_videoPage] = videoData[G_videoTitle][G_videoPage] || {};
                            videoData[G_videoTitle][G_videoPage].currentTime = G_videoElement.currentTime;
                            console.log(G_videoPage, G_timePlayingCur, G_videoElement.currentTime, 'SAVED');
                        };
                        GM_setValue('videoData', videoData);
                        G_timePlayingLast = G_timePlayingCur;
                    };
                };
            };
        };
        G_videoElement.addEventListener('timeupdate', function(){updateData(false)}, false); // IE9, Chrome, Safari, Opera
        G_videoElement.addEventListener('seeked', function(){updateData(true)}, false); // IE9, Chrome, Safari, Opera
    });
    function initFunction() {
        G_videoElement = document.querySelectorAll(videoElementSelector)[0]; // 1st match
        if (G_videoElement) {
            G_messageTarget = G_messageTarget || window.parent;
            G_messageTarget.postMessage({sender: 'QUESTION', reason: 'HREF'}, '*');
        };
    };
    document.addEventListener('DOMNodeInserted', function handleNewElements(event) {
        let element = event.target;
        if (G_videoElement) {
            return;
        }
        else if (element.tagName == 'VIDEO') {
            initFunction();
        };
    } , false);
})();