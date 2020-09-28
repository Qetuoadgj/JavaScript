// ==UserScript==
// @name         YouTube.Audio.Boost
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.16
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Audio.Boost.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @noframes
// @match        *://www.youtube.com/*
// @match        *://magicianer.cc/video/*
// @match        *://streamguard.cc/*
// @match        *://rezka.ag/*/*/*
// @match        *://filmix.co/*/*.html
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var G_gainNode, G_myVideoElement;
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
        console.log(myVideoElement);
        // create an audio context and hook up the video element as the source
        var audioCtx = new AudioContext();
        var source = audioCtx.createMediaElementSource(myVideoElement);
        // create a gain node
        var gainNode = audioCtx.createGain();
        var convolver = audioCtx.createConvolver();
        convolver.normalize = true;
        let volume_mult = GM_getValue('enabled') == true ? GM_getValue('volume_mult') : 1;
        gainNode.gain.value = volume_mult; // boost the volume
        source.connect(gainNode);
        source.connect(convolver);
        // connect the gain node to an output destination
        gainNode.connect(audioCtx.destination);
        convolver.connect(audioCtx.destination);
        return gainNode;
    };
    var G_videoElementSelector = [
        '.html5-video-container > video', // [YouTube.com]
        'pjsdiv video, #player video', // magicianer.cc, streamguard.cc [rezka.ag]
        'body video', // any page
    ].join(', ')
    G_videoElementSelector = location.host == 'rezka.ag' ? 'video[src^="blob:"]' : G_videoElementSelector;
    // --------------------------------------------------
    var cmdOff, cmdOn, turnOn, turnOff;
    turnOn = function() {
        GM_setValue('enabled', true);
        G_gainNode.gain.value = GM_getValue('volume_mult');
        GM_unregisterMenuCommand(cmdOn);
        cmdOff = GM_registerMenuCommand(str_off_menu, function(){turnOff();}, '');
    };
    turnOff = function() {
        GM_setValue('enabled', false);
        G_gainNode.gain.value = 1;
        GM_unregisterMenuCommand(cmdOff);
        cmdOn = GM_registerMenuCommand(str_on_menu, function(){turnOn();}, '');
    };
    // ================================================================================
    function toHHMMSS(secs = 0) {
        const sec_num = parseInt(secs, 10);
        const hours = Math.floor(sec_num / 3600) % 24;
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;
        return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v, i) => v !== "00" || i > 0).join(":");
    }
    // ================================================================================
    function addMediaTextIndicator(media, fontSize) {
        fontSize = fontSize || 72;
        var mediaTextIndicator = document.createElement('div');
        mediaTextIndicator.style.setProperty('color', 'yellow', 'important');
        mediaTextIndicator.style['font-size'] = fontSize + 'px';
        mediaTextIndicator.style.position = 'absolute';
        mediaTextIndicator.style['z-index'] = 2147483647; // Always on TOP
        mediaTextIndicator.style.top = '0px';
        mediaTextIndicator.style.left = (fontSize/4) + 'px';
        mediaTextIndicator.style.transform = 'translate(30px, 30px)';
        mediaTextIndicator.style.setProperty('background', 'transparent', 'important');
        media.parentNode.insertBefore(mediaTextIndicator, media.nextSibling);
        var volumeTextFade = function(fadeDelay) {
            fadeDelay = fadeDelay || 2000;
            var fadeDelaySeconds = Math.floor(fadeDelay/1000);
            function textFadeStart(show) {
                var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                mediaTextIndicator.style.opacity = show ? 1 : 0;
                mediaTextIndicator.style.transition = transition;
                mediaTextIndicator.style['-webkit-transition'] = transition; // Safari
            }
            textFadeStart(true);
            setTimeout(textFadeStart, fadeDelaySeconds*1000);
        };
        var setVolumeText = function() {
            volumeTextFade(2000);
            mediaTextIndicator.textContent = Math.round(media.volume * 100) > 0 ? Math.round(media.volume * 100) : 'Выкл.';
        };
        var setTimeText = function() {
            volumeTextFade(2000);
            var duration = media.duration;
            var currentTime = media.currentTime;
            mediaTextIndicator.textContent = (toHHMMSS(currentTime) + "/" + toHHMMSS(duration));
        };
        var addEventHandlers = function() {
            if (media.addEventListener) {
                media.addEventListener("volumechange", setVolumeText, false); // IE9, Chrome, Safari, Opera
                media.addEventListener("seeking", setTimeText, false); // IE9, Chrome, Safari, Opera
            }
            else {
                media.attachEvent("onvolumechange", setVolumeText); // IE 6/7/8
                media.attachEvent("onseeking", setTimeText); // IE 6/7/8
            }
        };
        setTimeout(addEventHandlers, 10);
        return mediaTextIndicator;
    };
    // ================================================================================
    function mediaMouseControls(eventCatcher, media, step) {
        step = (step === 0) ? 0 : (step || 1);
        var mouseWheelAudioHandler = function(e) {
            if (step !== 0) {
                // cross-browser wheel delta
                e = window.event || e; // old IE support
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                var amount = parseInt(delta*step), volume = parseInt(media.volume*100);
                var value = amount > 0 ? Math.floor((volume+amount)/step)*step : Math.ceil((volume+amount)/step)*step;
                media.volume = Math.max(0, Math.min(100, value)) / 100;
            }
            e.preventDefault();
        };
        var mouseWheelTimeHandler = function(e) {
            if (step !== 0) {
                // cross-browser wheel delta
                e = window.event || e; // old IE support
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                var amount = parseInt(delta*step);
                var mediaState = media.paused ? 0 : 1;
                setTimeout(function() {
                    if (delta < 0) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) - 5; if (mediaState == 1) media.play();
                    }
                    else if (delta > 0) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) + 5; if (mediaState == 1) media.play();
                    }
                }, 10);
            }
            e.preventDefault();
        };
        let startHandlerEvent = function(e) {
            var shiftDown = !!window.event.shiftKey;
            if (shiftDown) mouseWheelTimeHandler(e);
            else mouseWheelAudioHandler(e);
        }
        if (media.addEventListener) {
            eventCatcher.addEventListener("mousewheel", startHandlerEvent, false); // IE9, Chrome, Safari, Opera
            eventCatcher.addEventListener("DOMMouseScroll", startHandlerEvent, false); // Firefox
        }
        else {
            eventCatcher.attachEvent("onmousewheel", startHandlerEvent); // IE 6/7/8
        }
        var mediaTextIndicator = addMediaTextIndicator(media, 56/2);
        mediaTextIndicator.style.top = '5px';
    };
    // ================================================================================
    function isStale(element) {
        return element.closest('body').length > 0;
    };
    // ================================================================================
    function initFunction() {
        /*let*/ G_myVideoElement = document.querySelectorAll(G_videoElementSelector)[0]; // 1st match
        if (G_myVideoElement) {
            document.removeEventListener('DOMNodeInserted', handleNewElements);
            if (location.host == 'rezka.ag') mediaMouseControls(G_myVideoElement, G_myVideoElement, 1);
            G_gainNode = connectBoost(G_myVideoElement);
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
    };
    function handleNewElements(event) {
        let element = event.target;
        if (G_myVideoElement && isStale(G_myVideoElement) && G_gainNode) {
            return;
        }
        else if (element.tagName == 'VIDEO') {
            initFunction();
        };
    };
    document.addEventListener('DOMNodeInserted', handleNewElements, false);
    if (!G_gainNode) {initFunction();}
})();