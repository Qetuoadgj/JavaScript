// ==UserScript==
// @name         YouTube.Audio.Boost
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Audio.Boost.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @match        https://www.youtube.com/watch?v=*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var myVideoElement = document.querySelector('.html5-video-container > video');

    // create an audio context and hook up the video element as the source
    var audioCtx = new AudioContext();
    var source = audioCtx.createMediaElementSource(myVideoElement);

    // create a gain node
    var gainNode = audioCtx.createGain();
    let volume_mult = GM_getValue('volume_mult', 1.0) || 1.0;
    gainNode.gain.value = volume_mult; // boost the volume
    source.connect(gainNode);

    // connect the gain node to an output destination
    gainNode.connect(audioCtx.destination);

    function callPrompt() {
        let volume_mult = GM_getValue('volume_mult', 2.0);
        let result = prompt('Boost by', volume_mult || 1.0);
        if (result === null) {
            return;
        }
        GM_setValue('volume_mult', result);
        gainNode.gain.value = result*1; // double the volume
    };

    setTimeout(function() {
        GM_registerMenuCommand('Boost Volume', callPrompt, "");
    }, 1000);

})();