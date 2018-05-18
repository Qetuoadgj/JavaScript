// ==UserScript==
// @name         YouTube Polymer Disable
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.1.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube_Polymer_Disable.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-start
// @noframes
// @match        *://www.youtube.com/*
// @exclude      *://www.youtube.com/embed/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = window.location.href;
    if (url.indexOf("disable_polymer") === -1) {
        if (url.indexOf("?") > 0) {
            url += "&";
        } else {
            url += "?";
        }
        url += "disable_polymer=1";
        window.location.href = url;
    }
})();
