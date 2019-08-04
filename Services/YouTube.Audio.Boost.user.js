// ==UserScript==
// @name         YouTube.Audio.Boost
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.01
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Audio.Boost.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
/// @noframes
// @match        *://www.youtube.com/watch?v=*
// @match        *://magicianer.cc/video/*
// @match        *://streamguard.cc/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function callPrompt(gainNode) {
        let volume_mult = GM_getValue('volume_mult', 2.0);
        let result = prompt('Boost by', volume_mult || 1.0);
        if (result === null) {
            return;
        }
        GM_setValue('volume_mult', result);
        gainNode.gain.value = result*1; // double the volume
    };

    /*
    setTimeout(function() {
        GM_registerMenuCommand('Boost Volume', callPrompt, "");
    }, 1000);
    */

    function connectBoost(myVideoElement) {
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

        return gainNode;
    };

    var triggerred = 0, iteration = 0, interval = 1000, limit = 90, findSource = setInterval(function() {
        iteration++;
        let myVideoElement = document.querySelectorAll(
            // youtube.com
            '.html5-video-container > video,' +
            // magicianer.cc, streamguard.cc (rezka.ag)
            '#player video,' +
            // any site
            'body video'
        )[0]; // 1st match
        if (triggerred == 0 && myVideoElement) {
            triggerred = 1;
            let gainNode = connectBoost(myVideoElement)
            GM_registerMenuCommand('Boost Volume', function(){
                callPrompt(gainNode)
            }, "");
        };
        if (triggerred || iteration >= limit) {
            clearInterval(findSource);
        };
    }, interval);
})();