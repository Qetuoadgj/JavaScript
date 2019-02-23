// ==UserScript==
// @name         SoundSnap.Com
// @icon         https://www.google.com/s2/favicons?domain=soundsnap.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/SoundSnap.Com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-end
// @noframes
// @match        *://www.soundsnap.com/*
// @exclude      *://www.youtube.com/embed/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function clearAllEventListeners(element) {
        var new_element = element.cloneNode(true);
        element.parentNode.replaceChild(new_element, element);
    }
    var keepClassNames = ['si_buttons','si_download']
    var audio_previews = document.querySelectorAll('.wave > audio');
    for (var audio of audio_previews) {
        var link = audio.getAttribute('src');
        var parent = audio.parentNode;
        var i = 0; while (i < 10) {
            if (parent.classList.contains('audio-row')) break;
            parent = parent.parentNode;
            i++;
        }
        var download_buttons = parent.querySelectorAll('a.si_download');
        for (var button of download_buttons) {
            button.setAttribute('href', link);
            button.removeAttribute('onclick');
            button.setAttribute('target', '_blank');
            button.setAttribute('rel', 'noopener noreferrer');
            for (var className of button.classList) {
                if (keepClassNames.contains(className)) continue;
                button.classList.remove(className);
            }
            clearAllEventListeners(button);
        }
        // console.log(parent);
        // console.log(audio);
    }
})();