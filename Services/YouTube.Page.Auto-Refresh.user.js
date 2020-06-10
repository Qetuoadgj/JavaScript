// ==UserScript==
// @name         YouTube.Page.Auto-Refresh
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.03
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Page.Auto-Refresh.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        none
// @run-at       document-start
// @noframes
// @match        *://www.youtube.com/watch*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function mainFunc(e) {
        if (location.href !== localStorage.lastPlayed) {
            localStorage.lastPlayed = location.href;
            location.reload();
            return true;
        };
    };
    // --------------------------------------------------
    // mainFunc();
    // --------------------------------------------------
    //     function handleNewElements(event) {
    //         let element = event ? event.target : null;
    //         if (element && element.tagName == 'DIV' /*&& element.id == "progress"*/ || element.tagName == 'VIDEO') {
    //             if (mainFunc()) console.log(element);
    //             // window.stop();
    //         };
    //         // console.log('el:', element);
    //     };
    //     document.addEventListener('DOMNodeInserted', handleNewElements, false);
    // --------------------------------------------------
    // document.addEventListener('DOMContentLoaded', mainFunc, false);
    // --------------------------------------------------
    var videoElementSelector = [
        '.html5-video-container > video', // [YouTube.com]
    ].join(', ');
    // --------------------------------------------------
    function handleNewElements(event) {
        let element = event.target;
        if (element.tagName == 'VIDEO') {
            let myVideoElement = document.querySelectorAll(videoElementSelector)[0];
            if (myVideoElement && myVideoElement == element && !myVideoElement.classList.contains('loadstart_reload')) {
                // alert('YouTube.Page.Auto-Refresh');
                myVideoElement.addEventListener('loadstart', mainFunc);
                myVideoElement.classList.add('loadstart_reload');
            };
        };
    };
    // --------------------------------------------------
    document.addEventListener('DOMNodeInserted', handleNewElements, false);
})();
