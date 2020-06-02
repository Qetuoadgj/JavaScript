// ==UserScript==
// @name         nexusmods.com
// @icon         https://www.google.com/s2/favicons?domain=nexusmods.com
// @version      1.0.03
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/nexusmods.com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-start
// @noframes
// @match        *://*.nexusmods.com/mods/*
// @match        *://www.nexusmods.com/*/mods/*?tab=files&file_id=*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // ---------------------
    if (
        location.search.match('tab=files&file_id=')
    ) {
        function getDownlodURL() {
            const downloadButton = document.querySelector('button[data-download-url]');
            if (downloadButton) {
                return downloadButton.dataset.downloadUrl;
            };
        };
        // ---------------------
        function handleNewElements(event) {
            const element = event ? event.target : null;
            const URL = getDownlodURL();
            if (URL) {
                document.removeEventListener('DOMNodeInserted', handleNewElements);
                location.href = URL;
                location.search = '?tab=files';
            };
        };
        document.addEventListener('DOMNodeInserted', handleNewElements, false);
    }

    else {
        if (location.host.match(/^www\./)) return;
        const game = (location.host.match('(.*?)\.nexusmods.com') || [])[1];
        const mod_id = (location.pathname.match(/(\d+)\b/) || location.search.match(/(\d+)\b/) || [])[1];
        // Page Redirection
        if (game && mod_id) location.href = location.protocol + `//www.nexusmods.com/${game}/mods/${mod_id}`;
    };
})();