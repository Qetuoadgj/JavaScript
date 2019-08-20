// ==UserScript==
// @name         SoundSnap.Com
// @icon         https://www.google.com/s2/favicons?domain=soundsnap.com
// @version      1.0.01
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
    function eventFire(el, etype) {
        if (el.fireEvent) {el.fireEvent('on' + etype);}
        else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        };
    };
    function clearAllEventListeners(element) {element.parentNode.replaceChild(element.cloneNode(true), element);}
    function changeDownloadButtons() {
        var keepClassNames = ['si_buttons', 'si_download'];
        var audio_previews = document.querySelectorAll('.wave > audio');
        for (var audio of audio_previews) {
            var link = audio.getAttribute('src');
            var parent = audio.parentNode;
            var n = 0; while (n < 10) {
                if (parent.classList.contains('audio-row')) break;
                parent = parent.parentNode;
                n++;
            };
            var download_buttons = parent.querySelectorAll('a.si_download');
            for (var button of download_buttons) {
                button.setAttribute('href', link);
                button.removeAttribute('onclick');
                button.setAttribute('target', '_blank');
                button.setAttribute('rel', 'noopener noreferrer');
                for (var className of button.classList) {
                    if (keepClassNames.includes(className)) continue;
                    button.classList.remove(className);
                };
                button.style.color = 'black';
                button.setAttribute('onmouseover', 'this.style.color="white";');
                button.setAttribute('onmouseout', 'this.style.color="black";');
                clearAllEventListeners(button);
            };
            // console.log(parent);
            // console.log(audio);
        };
    };
    function changeDownloadButton(playButton) {
        var keepClassNames = ['si_buttons', 'si_download'];
        var player = playButton.parentNode.parentNode.parentNode;
        var audio_previews = document.querySelectorAll('.wave > audio');
        for (var audio of audio_previews) {
            var link = audio.getAttribute('src');
            var parent = audio.parentNode;
            var n = 0; while (n < 10) {
                if (parent.classList.contains('audio-row')) break;
                parent = parent.parentNode;
                n++;
            };
            //console.log(parent, player, parent === player);
            // if (parent === player) {
            var download_buttons = parent.querySelectorAll('a.si_download');
            for (var button of download_buttons) {
                button.setAttribute('href', link);
                button.removeAttribute('onclick');
                button.setAttribute('target', '_blank');
                button.setAttribute('rel', 'noopener noreferrer');
                for (var className of button.classList) {
                    if (keepClassNames.includes(className)) continue;
                    button.classList.remove(className);
                };
                button.style.color = 'black';
                button.setAttribute('onmouseover', 'this.style.color="white";');
                button.setAttribute('onmouseout', 'this.style.color="black";');
                clearAllEventListeners(button);
            };
            // console.log(parent);
            // console.log(audio);
        };
        // };
    };
    var playButtonsArray = document.querySelectorAll('.ojoo-button.ojoo-play');
    for (let playButton of playButtonsArray) {
        playButton.addEventListener('click', function(e){changeDownloadButton(playButton);}, false);
    };
    /*
    var mainTimerCounter = 0, stepDelay = 1050, mainTimer = setInterval(function() {
        let play_button = playButtonsArray[mainTimerCounter];
        console.log(mainTimerCounter, playButtonsArray.length-1, playButtonsArray.length-1 == mainTimerCounter)
        eventFire(play_button, 'click');
        if (playButtonsArray.length-1 == mainTimerCounter) {
            changeDownloadButtons();
            clearInterval(mainTimer);
        };
        mainTimerCounter++;
    }, stepDelay);
    */
})();