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