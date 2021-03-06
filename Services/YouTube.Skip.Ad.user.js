// ==UserScript==
// @name         YouTube.Skip.Ad
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.04
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Skip.Ad.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @noframes
// @match        *://www.youtube.com/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var autoMode = true;
    function skipAd() {
        (() => {
            const video = document.querySelector('.html5-main-video');
            const selector = '.ytp-play-progress.ytp-swatch-background-color';
            const testColor = 'rgb(255, 204, 0)';
            const coloredProgress = document.querySelector(selector);
            if (coloredProgress && window.getComputedStyle(coloredProgress, null).getPropertyValue('background-color') == testColor) {
                video.currentTime = video.duration;
                console.log('skipAd:', 'progress', selector, testColor);
            };
        })();
        setTimeout(() => {
            const selector = '.ytp-ad-skip-button';
            const skipAdButton = document.querySelector(selector);
            if (skipAdButton) {
                skipAdButton.click();
                console.log('skipAd:', 'skip ad', selector);
            };
        }, 500/10/10);
        setTimeout(() => {
            const selector = '.ytp-ad-overlay-close-button';
            const skipAdButton = document.querySelector(selector);
            if (skipAdButton) {
                skipAdButton.click();
                console.log('skipAd:', 'close ad', selector);
            };
        }, 500/10/10);
    };
    // ---------------------
    function shiftKeyIsDown() {return !!window.event.shiftKey;}
    function ctrlKeyIsDown() {return !!(window.event.ctrlKey || window.event.metaKey);}
    function altKeyIsDown() {return !!window.event.altKey;}
    // ---------------------
    const KEY_BACKSPACE = 8,
          KEY_TAB = 9,
          KEY_ENTER = 13,
          KEY_SHIFT = 16,
          KEY_CTRL = 17,
          KEY_ALT = 18,
          KEY_PAUSE_BREAK = 19,
          KEY_CAPS_LOCK = 20,
          KEY_ESCAPE = 27,
          KEY_PAGE_UP = 33,
          KEY_PAGE_DOWN = 34,
          KEY_END = 35,
          KEY_HOME = 36,
          KEY_LEFT_ARROW = 37,
          KEY_UP_ARROW = 38,
          KEY_RIGHT_ARROW = 39,
          KEY_DOWN_ARROW = 40,
          KEY_INSERT = 45,
          KEY_DELETE = 46,
          KEY_0 = 48,
          KEY_1 = 49,
          KEY_2 = 50,
          KEY_3 = 51,
          KEY_4 = 52,
          KEY_5 = 53,
          KEY_6 = 54,
          KEY_7 = 55,
          KEY_8 = 56,
          KEY_9 = 57,
          KEY_A = 65,
          KEY_B = 66,
          KEY_C = 67,
          KEY_D = 68,
          KEY_E = 69,
          KEY_F = 70,
          KEY_G = 71,
          KEY_H = 72,
          KEY_I = 73,
          KEY_J = 74,
          KEY_K = 75,
          KEY_L = 76,
          KEY_M = 77,
          KEY_N = 78,
          KEY_O = 79,
          KEY_P = 80,
          KEY_Q = 81,
          KEY_R = 82,
          KEY_S = 83,
          KEY_T = 84,
          KEY_U = 85,
          KEY_V = 86,
          KEY_W = 87,
          KEY_X = 88,
          KEY_Y = 89,
          KEY_Z = 90,
          KEY_LEFT_WINDOW_KEY = 91,
          KEY_RIGHT_WINDOW_KEY = 92,
          KEY_SELECT_KEY = 93,
          KEY_NUMPAD_0 = 96,
          KEY_NUMPAD_1 = 97,
          KEY_NUMPAD_2 = 98,
          KEY_NUMPAD_3 = 99,
          KEY_NUMPAD_4 = 100,
          KEY_NUMPAD_5 = 101,
          KEY_NUMPAD_6 = 102,
          KEY_NUMPAD_7 = 103,
          KEY_NUMPAD_8 = 104,
          KEY_NUMPAD_9 = 105,
          KEY_MULTIPLY = 106,
          KEY_ADD = 107,
          KEY_SUBTRACT = 109,
          KEY_DECIMAL_POINT = 110,
          KEY_DIVIDE = 111,
          KEY_F1 = 112,
          KEY_F2 = 113,
          KEY_F3 = 114,
          KEY_F4 = 115,
          KEY_F5 = 116,
          KEY_F6 = 117,
          KEY_F7 = 118,
          KEY_F8 = 119,
          KEY_F9 = 120,
          KEY_F10 = 121,
          KEY_F11 = 122,
          KEY_F12 = 123,
          KEY_NUM_LOCK = 144,
          KEY_SCROLL_LOCK = 145,
          KEY_SEMI_COLON = 186,
          KEY_EQUAL_SIGN = 187,
          KEY_COMMA = 188,
          KEY_DASH = 189,
          KEY_PERIOD = 190,
          KEY_FORWARD_SLASH = 191,
          KEY_GRAVE_ACCENT = 192,
          KEY_OPEN_BRACKET = 219,
          KEY_BACK_SLASH = 220,
          KEY_CLOSE_BRACKET = 221,
          KEY_SINGLE_QUOTE = 222
    ;
    // ---------------------
    function onKeyDown(e, code) {
        e = e || window.event;
        let ctrlDown = e.ctrlKey || e.metaKey; // Mac support
        let shiftDown = !!window.event.shiftKey;
        let targetType = e.target.tagName.toLowerCase();
        if (code) e.keyCode = code;
        if (e.keyCode == KEY_ESCAPE) {
            e.preventDefault();
            skipAd();
        };
    };
    // ---------------------
    window.onkeydown = function(e){onKeyDown(e);};
    // ---------------------
    function handleNewElements(event) {
        let element = event ? event.target : null;
        if (element && element.tagName == 'DIV' /*&& element.id == "progress"*/ || element.tagName == 'VIDEO') {
            window.onkeydown = function(e){onKeyDown(e);};
            // window.stop();
        };
        if (autoMode) {
            skipAd();
        };
        // console.log('el:', element);
    };
    document.addEventListener('DOMNodeInserted', handleNewElements, false);
})();
