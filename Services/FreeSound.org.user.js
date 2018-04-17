// ==UserScript==
// @name         FreeSound.org
// @icon         https://www.google.com/s2/favicons?domain=freesound.org
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/FreeSound.org.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-end
// @noframes
// @match        *://freesound.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // https://freesound.org/people/CGEffex/sounds/158979/

    function addLink(url, title, id, parent) {
        var a = document.querySelector('#'+id);
        if (!a) {
            a = document.createElement('a');
            parent = parent || document.querySelector('body');
            parent.appendChild(a);
        }
        a.href = url;
        a.title = title;
        a.innerText = title;
        a.style.display = 'block';
        return a;
    }

    var downloads = document.querySelector('#download_text');

    if (downloads) {
        downloads.querySelector('a').remove();

        var ogg_file = document.querySelector('.ogg_file').href;
        var mp3_file = document.querySelector('.mp3_file').href;

        addLink(ogg_file, 'Download *.OGG', 'ogg_file', downloads);
        addLink(mp3_file, 'Download *.MP3', 'mp3_file', downloads);
    }
})();
