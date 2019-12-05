// ==UserScript==
// @name         YouTube.URL.TimeStamp.Remove
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.00
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.URL.TimeStamp.Remove.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        none
// @run-at       document-start
// @noframes
// @match        *://www.youtube.com/watch*&t=*
// @match        *://www.youtube.com/watch?t=*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let brfore = location.href, after = location.href.replace(/^(.*)\bt=\d+s(.*)$/, '$1$2').replace(/&$/, '');
    console.log('YouTube.URL.TimeStamp.Remove', brfore, after);
    history.pushState(location.pathname, '', after);
})();
