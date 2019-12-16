// ==UserScript==
// @name         YouTube.URL.TimeStamp.Remove
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.01
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.URL.TimeStamp.Remove.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        none
// @run-at       document-end
// @noframes
// @match        *://www.youtube.com/watch*&t=*
// @match        *://www.youtube.com/watch?t=*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let b_Refresh = 1, s_Berfore = location.href, s_After = s_Berfore.replace(/^(.*)\bt=\d+s(.*)$/, '$1$2').replace(/&$/, '');
    console.log('YouTube.URL.TimeStamp.Remove', s_Berfore, s_After);
    if (b_Refresh) location.href = s_After; else history.pushState(location.pathname, '', s_After);
})();
