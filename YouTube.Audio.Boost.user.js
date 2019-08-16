// ==UserScript==
// @name         YouTube.Audio.Boost
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.03
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Audio.Boost.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
/// @noframes
// @match        *://www.youtube.com/watch?v=*
// @match        *://magicianer.cc/video/*
// @match        *://streamguard.cc/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var userLang = navigator.language || navigator.userLanguage;
    var str_title_prompt = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Множитель громкости' : 'Volume multiplier',
        str_title_menu = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Усилить громкость видео' : 'Boost video volume'
    ;
    if (GM_getValue('volume_mult', null) === null) { // assign default value
        GM_setValue('volume_mult', 4);
    };
    function callPrompt(gainNode) {
        let volume_mult = GM_getValue('volume_mult');
        let result = prompt(str_title_prompt, volume_mult);
        if (result === null) {return;}
        GM_setValue('volume_mult', result);
        gainNode.gain.value = result*1; // boost the volume
    };
    function connectBoost(myVideoElement) {
        // create an audio context and hook up the video element as the source
        var audioCtx = new AudioContext();
        var source = audioCtx.createMediaElementSource(myVideoElement);
        // create a gain node
        var gainNode = audioCtx.createGain();
        let volume_mult = GM_getValue('volume_mult');
        gainNode.gain.value = volume_mult; // boost the volume
        source.connect(gainNode);
        // connect the gain node to an output destination
        gainNode.connect(audioCtx.destination);
        return gainNode;
    };
    var videoElementSelector = [
        '.html5-video-container > video', // [YouTube.com]
        '#player video', // magicianer.cc, streamguard.cc [rezka.ag]
        'body video', // any page
    ].join(', ')
    var gainNode, iteration = 0, interval = 1000, limit = 60*5, findSource = setInterval(function() {
        iteration++;
        let myVideoElement = document.querySelectorAll(videoElementSelector)[0]; // 1st match
        if (!gainNode && myVideoElement) {
            gainNode = connectBoost(myVideoElement)
            if (gainNode) {GM_registerMenuCommand(str_title_menu, function(){callPrompt(gainNode)}, '');};
        };
        if (gainNode || iteration >= limit) {clearInterval(findSource);};
    }, interval);
})();