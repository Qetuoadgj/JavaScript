// ==UserScript==
// @name         YouTube.Audio.Boost
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.06
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Audio.Boost.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
/// @noframes
// @match        *://www.youtube.com/watch?v=*
// @match        *://magicianer.cc/video/*
// @match        *://streamguard.cc/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var G_gainNode;
    var userLang = navigator.language || navigator.userLanguage;
    var str_title_prompt = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Множитель громкости' : 'Volume multiplier',
        str_title_menu = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Усилить громкость видео' : 'Boost video volume',
        str_on_menu = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Включить' : 'Turn On',
        str_off_menu = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Отключить' : 'Turn Off'
    ;
    if (GM_getValue('volume_mult', null) === null) { // assign default value
        GM_setValue('volume_mult', 4);
    };
    if (GM_getValue('enabled', null) === null) { // assign default value
        GM_setValue('enabled', false);
    };
    function callPrompt(gainNode) {
        let volume_mult = GM_getValue('volume_mult');
        let result = prompt(str_title_prompt, volume_mult);
        if (result === null) {return;}
        GM_setValue('volume_mult', result);
        result = GM_getValue('enabled') == true ? result : 1;
        gainNode.gain.value = result*1; // boost the volume
    };
    function connectBoost(myVideoElement) {
        // create an audio context and hook up the video element as the source
        var audioCtx = new AudioContext();
        var source = audioCtx.createMediaElementSource(myVideoElement);
        // create a gain node
        var gainNode = audioCtx.createGain();
        let volume_mult = GM_getValue('enabled') == true ? GM_getValue('volume_mult') : 1;
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
    var cmdOff, cmdOn,
        turnOn = function() {
            GM_setValue('enabled', true);
            G_gainNode.gain.value = GM_getValue('volume_mult');
            GM_unregisterMenuCommand(cmdOn);
            cmdOff = GM_registerMenuCommand(str_off_menu, function(){
                turnOff();
            }, '');
        },
        turnOff = function() {
            GM_setValue('enabled', false);
            G_gainNode.gain.value = 1;
            GM_unregisterMenuCommand(cmdOff);
            cmdOn = GM_registerMenuCommand(str_on_menu, function(){
                turnOn();
            }, '');
        };
    ;
    var iteration = 0, interval = 1000, limit = 60*5, findSource = setInterval(function() {
        iteration++;
        let myVideoElement = document.querySelectorAll(videoElementSelector)[0]; // 1st match
        if (!G_gainNode && myVideoElement) {
            G_gainNode = connectBoost(myVideoElement);
            if (G_gainNode) {
                GM_registerMenuCommand(str_title_menu, function(){callPrompt(G_gainNode);}, '');
                if (GM_getValue('enabled') == true) {
                    cmdOff = GM_registerMenuCommand(str_off_menu, function(){turnOff();}, '');
                }
                else {
                    cmdOn = GM_registerMenuCommand(str_on_menu, function(){turnOn();}, '');
                };
            };
        };
        if (G_gainNode || iteration >= limit) {clearInterval(findSource);};
    }, interval);
})();