// ==UserScript==
// @name         hdrezka.video.resume
// @icon         https://www.google.com/s2/favicons?domain=rezka.ag
// @version      1.0.01
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
    var G_videoPage, G_videoTitle, G_videoOrigin, G_titleSerie, G_titleSeason;
    window.addEventListener('message', function(e) {
        if(typeof e.data === 'object' && e.data.sender === 'ANSWER' && e.data.url) {
            // alert('ANSWER.data.url: ' + e.data.url);
            G_videoPage = e.data.url;
            G_videoTitle = e.data.title;
            G_videoOrigin = e.data.origin + '' + e.data.pathname;
            G_titleSerie = e.data.serie || 'Без серий';
            G_titleSeason = e.data.season || 'Без сезонов';
        };
        //
        let videoData = GM_getValue('videoData') || {};
        for (let title of Object.keys(videoData)) {
            if (title == G_videoTitle) {
                if (videoData[title]) {
                    if (videoData[title][G_videoOrigin]) {
                        if (videoData[title][G_videoOrigin][G_titleSeason]) {
                            let data = videoData[title][G_videoOrigin][G_titleSeason][G_titleSerie];
                            if (typeof data === "object") {
                                if (data.currentTime) G_videoElement.currentTime = data.currentTime; // <===
                                break;
                            };
                        };
                    };
                };
            };
        };
        var G_timePlayingLast = 0, isBusy = false;
        function updateData(ignoreDelays = false) {
            if (isBusy) return;
            isBusy = true;
            if (G_videoElement) {
                let videoData = GM_getValue('videoData') || {};
                //if (G_videoElement.paused === false) {
                if (
                    ignoreDelays ||
                    (Math.abs(G_videoElement.currentTime - G_timePlayingLast) >= 10) ||
                    ((G_videoElement.currentTime < G_skipSec) || ((G_videoElement.duration - G_videoElement.currentTime) <= G_skipSec))
                ) {
                    if (
                        G_videoElement.duration > 0 &&
                        typeof videoData[G_videoTitle] === "object" &&
                        typeof videoData[G_videoTitle][G_videoOrigin] === "object" &&
                        typeof videoData[G_videoTitle][G_videoOrigin][G_titleSeason] === "object" &&
                        typeof videoData[G_videoTitle][G_videoOrigin][G_titleSeason][G_titleSerie] === "object" &&
                        (
                            G_videoElement.currentTime < G_skipSec /*||
                            G_videoElement.duration-G_videoElement.currentTime <= G_skipSec*/
                        )
                    ) {
                        delete videoData[G_videoTitle][G_videoOrigin][G_titleSeason][G_titleSerie].currentTime;
                        delete videoData[G_videoTitle][G_videoOrigin][G_titleSeason][G_titleSerie];
                        if (Object.keys(videoData[G_videoTitle][G_videoOrigin][G_titleSeason]).length == 0) delete videoData[G_videoTitle][G_videoOrigin][G_titleSeason];
                        if (Object.keys(videoData[G_videoTitle][G_videoOrigin]).length == 0) delete videoData[G_videoTitle][G_videoOrigin];
                        if (Object.keys(videoData[G_videoTitle]).length == 0) delete videoData[G_videoTitle];
                        // if (Object.keys(videoData).length == 0) GM_deleteValue('videoData');
                        console.log(G_titleSerie, Math.floor(Math.abs(G_videoElement.currentTime - G_timePlayingLast)), Math.floor(G_videoElement.currentTime), 'ERASED');
                    }
                    else if (
                        G_videoElement.duration > 0 &&
                        !(
                            G_videoElement.currentTime < G_skipSec /*||
                            G_videoElement.duration-G_videoElement.currentTime <= G_skipSec*/
                        )
                    ) {
                        videoData[G_videoTitle] = videoData[G_videoTitle] || {};
                        videoData[G_videoTitle][G_videoOrigin] = videoData[G_videoTitle][G_videoOrigin] || {};
                        videoData[G_videoTitle][G_videoOrigin][G_titleSeason] = videoData[G_videoTitle][G_videoOrigin][G_titleSeason] || {};
                        videoData[G_videoTitle][G_videoOrigin][G_titleSeason][G_titleSerie] = videoData[G_videoTitle][G_videoOrigin][G_titleSeason][G_titleSerie] || {};
                        videoData[G_videoTitle][G_videoOrigin][G_titleSeason][G_titleSerie].currentTime = Math.floor(G_videoElement.currentTime);
                        videoData[G_videoTitle][G_videoOrigin][G_titleSeason][G_titleSerie].duration = Math.ceil(G_videoElement.duration);
                        console.log(G_titleSerie, Math.floor(Math.abs(G_videoElement.currentTime - G_timePlayingLast)), Math.floor(G_videoElement.currentTime), 'SAVED');
                    };
                    if (Object.keys(videoData).length > 0) {
                        GM_setValue('videoData', videoData);
                        G_messageTarget.postMessage({sender: 'ACTION', reason: 'UPDATE_BUTTON_PROGRESS', videoData: videoData}, '*');
                    } else {
                        GM_deleteValue('videoData');
                    };
                    G_timePlayingLast = G_videoElement.currentTime;
                };
                //};
            };
            setTimeout(function(){isBusy = false;}, 10);
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
    let videoData = GM_getValue('videoData') || {};
    if (Object.keys(videoData).length > 0) {
        window.parent.postMessage({sender: 'ACTION', reason: 'UPDATE_BUTTON_PROGRESS', videoData: videoData}, '*');
    };
})();