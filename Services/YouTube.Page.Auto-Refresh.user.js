// ==UserScript==
// @name         YouTube.Page.Auto-Refresh
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.00
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.URL.TimeStamp.Remove.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        none
// @run-at       document-start
// @noframes
// @match        *://www.youtube.com/watch*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let b_alreadyRefreshed = localStorage.alreadyRefreshed
    if (b_alreadyRefreshed && typeof b_alreadyRefreshed !== 'undefined') {
        localStorage.removeItem('alreadyRefreshed');
        console.log('YouTube.Page.Auto-Refresh: ','localStorage.alreadyRefreshed =', localStorage.alreadyRefreshed, '\nOK');
    }
    else {
        console.log('YouTube.Page.Auto-Refresh: ','localStorage.alreadyRefreshed =', localStorage.alreadyRefreshed, '\nReloading');
        localStorage.alreadyRefreshed = true;
        location.reload();
    }
})();
