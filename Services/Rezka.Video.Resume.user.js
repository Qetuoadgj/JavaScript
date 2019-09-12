// ==UserScript==
// @name         Rezka.Video.Resume
// @icon         https://www.google.com/s2/favicons?domain=rezka.ag
// @version      1.0.00
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/Rezka.Video.Resume.user.js
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
    var G_videoElement, G_messageTarget;
    var videoElementSelector = [
        '.html5-video-container > video', // [YouTube.com]
        '#player video', // magicianer.cc, streamguard.cc [rezka.ag]
        'body video', // any page
    ].join(', ')
    var G_videoPage, G_videoTitle;
    window.addEventListener('message', function(e) {
        if(typeof e.data === 'object' && e.data.sender === 'ANSWER' && e.data.url) {
            // alert('ANSWER.data.url: ' + e.data.url);
            G_videoPage = e.data.url;
            G_videoTitle = e.data.title;
        };
        //
        let videoData = GM_getValue('videoData') || {};
        let videoDataIndex = 0, dataFoundIndex = 0;
        for (let key of Object.keys(videoData)) {
            let data = videoData[key];
            // console.log('key', key);
            // console.log('data', data);
            // console.log('data.url', data.url);
            // console.log('G_videoPage', G_videoPage);
            if (data.url == G_videoPage) {
                if (data.currentTime) G_videoElement.currentTime = data.currentTime; // <===
                dataFoundIndex = videoDataIndex;
                break;
            };
            videoDataIndex++;
        };
        //
        let checkTime = setInterval(function() {
            if (G_videoElement) {
                if (G_videoElement.paused === false) {
                    let index = dataFoundIndex ? dataFoundIndex : videoDataIndex;
                    let name = index + ' ==> ' + G_videoTitle;
                    videoData[name] = {};
                    videoData[name].url = G_videoPage;
                    videoData[name].currentTime = G_videoElement.currentTime;
                    GM_setValue('videoData', videoData);
                    // console.log('videoDataIndex:', index);
                };
            };
        }, 1000);
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