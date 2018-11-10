// ==UserScript==
// @name         hdrezka.ag
// @icon         https://www.google.com/s2/favicons?domain=hdrezka.ag
// @version      1.0.1
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/hdrezka.ag.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-end
// @noframes
// @match        *://hdrezka.ag/films/*/*.html
// @match        *://hdrezka.ag/series/*/*.html
// @grant        none
// ==/UserScript==

/* uBlock Filter:
! 23.10.2018, 18:28:40 http://hdrezka.ag/films/foreign/3040-kabelschik.html
hdrezka.ag###send-video-issue
hdrezka.ag##.b-post__social_holder
hdrezka.ag##.b-post__support_holder
hdrezka.ag##.b-post__lastepisodeout
hdrezka.ag##.b-post__mixedtext

! 10.11.2018, 5:53:35 hdrezka.ag
||fs*.fex.net/get/*$media,important
*/

(function() {
    'use strict';

    // Your code here...
    function addGlobalStyle(css, cssClass) {
        var head = document.getElementsByTagName('head')[0]; if (!head) { return; }
        var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
    }
    addGlobalStyle("div {background: black}", "nightMode");
})();
