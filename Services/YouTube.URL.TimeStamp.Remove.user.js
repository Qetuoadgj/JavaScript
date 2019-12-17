// ==UserScript==
// @name         YouTube.URL.TimeStamp.Remove
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.03
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.URL.TimeStamp.Remove.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        none
// @run-at       document-start
// @noframes
// @match        *://www.youtube.com/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function mainFunc() {
        if (location.search.match(/^(.*)\bt=\d+s(.*)$/)) {
            let s_Berfore = location.href, s_After = s_Berfore.replace(/^(.*)\bt=\d+s(.*)$/, '$1$2').replace(/&$/, '');
            console.log('YouTube.URL.TimeStamp.Remove', s_Berfore, s_After);
            localStorage.alreadyRefreshed = true;
            location.href = s_After;
        };
    }
    // --------------------------------------------------
    var videoElementSelector = [
        '.html5-video-container > video', // [YouTube.com]
    ].join(', ');
    function handleNewElements(event) {
        let element = event.target;
        if (element.tagName == 'VIDEO') {
            let myVideoElement = document.querySelectorAll(videoElementSelector)[0];
            if (myVideoElement && myVideoElement == element) {
                myVideoElement.addEventListener('loadedmetadata', mainFunc);
                // document.removeEventListener('DOMNodeInserted', handleNewElements);
            };
        };
    };
    document.addEventListener('DOMNodeInserted', handleNewElements, false);
})();
