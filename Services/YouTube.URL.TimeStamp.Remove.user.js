// ==UserScript==
// @name         YouTube.URL.TimeStamp.Remove
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.07
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
        const re = /[&?]\bt=\d+s\b/;
        if (location.search.match(re)) {
            let before = location.search, after = before.replace(re, '');
            localStorage.lastPlayed = location.origin + location.pathname + after;
            console.log('YouTube.URL.TimeStamp.Remove', before, after);
            location.search = location.search.replace(/[&?]\bt=\d+s\b/, '');
            return true;
        };
    };
    mainFunc();
    function handleNewElements(event) {
        let element = event ? event.target : null;
        if (element && element.tagName == 'DIV' /*&& element.id == "progress"*/ || element.tagName == 'VIDEO') {
            if (mainFunc()) console.log(element);
            // window.stop();
        };
        // console.log('el:', element);
    };
    document.addEventListener('DOMNodeInserted', handleNewElements, false);
    // document.addEventListener('DOMContentLoaded', mainFunc, false);
})();
