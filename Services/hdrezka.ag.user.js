// ==UserScript==
// @name         hdrezka.ag
// @icon         https://www.google.com/s2/favicons?domain=rezka.ag
// @version      1.0.15
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/hdrezka.ag.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @match        *://hdrezka.ag/films/*.html
// @match        *://hdrezka.ag/series/*.html
// @match        *://hdrezka.me/films/*.html
// @match        *://hdrezka.me/series/*.html
//
// @match        *://hdrezka.ag/*/*.html
// @match        *://hdrezka.me/*/*.html
//
// @match        *://rezka.ag/*/*.html
// @match        *://rezka.me/*/*.html

// @match        *://filmix.co/uzhasy/*.html
// @match        *://filmix.co/play/*
//// @grant        none
// ==/UserScript==

/* uBlock Filter:
! 23.10.2018, 18:28:40 http://hdrezka.ag/films/foreign/3040-kabelschik.html
*rezka*.*###send-video-issue
*rezka*.*##.b-post__social_holder
*rezka*.*##.b-post__support_holder
*rezka*.*##.b-post__lastepisodeout
*rezka*.*##.b-post__mixedtext

! 10.11.2018, 5:53:35 hdrezka.ag
||fs*.fex.net/get/*$media,important
||ankunding.biz^$media,important

! 13.05.2019 rezka.ag
||*.mp4$media,domain=streamguard.cc,important
*/

(function() {
    'use strict';

    // Your code here...
    var userLang = navigator.language || navigator.userLanguage;
    var str_title_nightMode = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Ночной режим' : 'Night Mode',
        str_title_autoScale = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Авто-размер' : 'Auto-Scale'
    ;
    var nightModeEnable = GM_getValue('nightModeEnable', 1);
    var autoScaleEnable = GM_getValue('autoScaleEnable', 1);
    var videoScale = GM_getValue('videoScale', 1);
    var ignoreResize = 0;

    function addGlobalStyle(css, cssClass) {
        var head = document.getElementsByTagName('head')[0]; if (!head) { return; }
        var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
    }
    function scaleToElement(element, defaultWidth = 640, defaultHeight = 360) {
        var elementWidth = element ? element.clientWidth : defaultWidth;
        var elementHeight = element ? element.clientHeight : defaultHeight;
        var ratio = 1; //elementWidth / elementHeight;
        return Math.min((window.innerWidth - (20 + 4)*ratio) / elementWidth, (window.innerHeight - (20 + 4)) / elementHeight);
    }
    // addGlobalStyle("#ownplayer, #videoplayer, #player, #cdn-player {zoom: 1.15; z-index: 10;}\nbody.active-brand #wrapper, .b-wrapper {width: 1200px;}", "zoomMode");
    var playerElement = document.querySelectorAll('#videoplayer, iframe[allowfullscreen=true]')[0];
    var playerWidth = playerElement ? playerElement.clientWidth : 640;
    var playerHeight = playerElement ? playerElement.clientHeight : 360;
    // initScale = 2.0 * window.innerWidth/(1200 + 50);
    var initScale = scaleToElement(playerElement); // Math.min((window.innerWidth - (20 - 8)) / playerWidth, (window.innerHeight - (20 - 8)) / playerHeight);
    var minScale = 1, maxScale = initScale; // 2.5;
    var scale = initScale; scale = Math.min(Math.max(minScale, scale), maxScale);
    function scalePlayer(scale) {
        var style = document.querySelector('head > style.zoomMode'); if (style) style.remove();
        var css = [
            "#player {zoom: "+(scale)+"; z-index: 10; padding: 0;}",
            "body.active-brand #wrapper, .b-wrapper {width: "+Math.max(640*scale, 1000)+"px; padding: 10px 20px;}",
        ].join('\n');
        if (window.location.href.match('/filmix.co/')) {
            css += [
                '.player-item, .players {width: auto !important; height: auto !important;}',
            ].join('\n');
        };
        style = addGlobalStyle(css, "zoomMode");
        GM_setValue('videoScale', scale);
    }
    // scalePlayer(scale);
    function toggleAutoScale() {
        if (ignoreResize) return;
        if (autoScaleEnable) {
            playerElement = document.querySelectorAll('#videoplayer, iframe[allowfullscreen=true]')[0];
            playerWidth = playerElement ? playerElement.clientWidth : 640;
            playerHeight = playerElement ? playerElement.clientHeight : 360;
            initScale = scaleToElement(playerElement); // Math.min((window.innerWidth - (20 - 8)) / playerWidth, (window.innerHeight - (20 - 8)) / playerHeight);
            minScale = 1;
            maxScale = initScale; // 2.5;
            scale = initScale; scale = Math.min(Math.max(minScale, scale), maxScale);
            autoScaleEnable = 1;
        }
        else {
            scale = 1;
            autoScaleEnable = 0;
        }
        scalePlayer(scale);
        GM_setValue('autoScaleEnable', autoScaleEnable);
    }
    toggleAutoScale();
    //
    // https://filmix.co/uzhasy/3857-vozvraschenie-zhivyh-mertvecov-the-return-of-the-living-dead-1985.html
    var css = [
        '.container-main.main-block{width: auto;}',
        '\n#content {width: 100%;}',
        '\naside, .android-telegram-main, #top {display: none !important;}'
    ].join('\n');
    addGlobalStyle(css, 'pageFix');
    function toggleNightMode(force) {
        var css = [
            "div, body, .night_mode, body.active-brand #wrapper, .comments-tree-list, .ava {background: black !important; background-color: black !important}",
            "h2, .b-post__description_text, td, .misc, div#hd-comments-list * {color: wheat;}",
            "/*.b-post__social_holder_wrapper, table.b-post__rating_table, table.b-post__actions {display: none;}*/",
            "::-webkit-scrollbar {width: 18px; height: 18px;}",
            "::-webkit-scrollbar-button {background: no-repeat #222; background-size: 18px; background-position: center bottom;}",
            "::-webkit-scrollbar-button:vertical:decrement {background-image: url(" +
            '"' +
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%235a6268'><polygon points='25,66 50,33 75,66'/></svg>" +
            '");}',
            "::-webkit-scrollbar-button:vertical:increment {background-image: url(" +
            '"' +
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%235a6268'><polygon points='25,33 50,66 75,33'/></svg>" +
            '");}',
            "::-webkit-scrollbar-button:horizontal:decrement {background-image: url(" +
            '"' +
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%235a6268'><polygon points='33,50 66,75 66,25'/></svg>" +
            '");}',
            "::-webkit-scrollbar-button:horizontal:increment {background-image: url(" +
            '"' +
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%235a6268'><polygon points='33,75 66,50 33,25'/></svg>" +
            '");}',
            "::-webkit-scrollbar-track-piece {background: #111;}",
            "::-webkit-scrollbar-thumb {background: #222; border-radius: 3px;}",
            "::-webkit-scrollbar-thumb:hover {background: #444;}",
            "::-webkit-scrollbar-corner {background-color: #111;}",
            //
            "iframe#cdn-player {border: 1px #111 solid;}",
        ].join('\n');
        if (window.location.href.match('/filmix.co/')) {
            css += [
                'body * {color: wheat !important;}',
                '#content {width: 100%; background-color: black;}',
            ].join('\n');
        };
        document.body.classList.add('night_mode');
        var style = document.querySelector('head > style.nightMode');
        if (force && style) style.remove();
        if (style) {
            style.remove();
            nightModeEnable = 0;
        }
        else {
            addGlobalStyle(css, 'nightMode');
            nightModeEnable = 1;
        }
        GM_setValue('nightModeEnable', nightModeEnable);
    }
    if (nightModeEnable) toggleNightMode(1);
    //
    var KEY_BACKSPACE = 8,
        KEY_TAB = 9,
        KEY_ENTER = 13,
        KEY_SHIFT = 16,
        KEY_CTRL = 17,
        KEY_ALT = 18,
        KEY_PAUSE_BREAK = 19,
        KEY_CAPS_LOCK = 20,
        KEY_ESCAPE = 27,
        KEY_SPACE = 32,
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
        KEY_CLOSE_BRAKET = 221,
        KEY_SINGLE_QUOTE = 222
    ;
    function onKeyDown(e, code) {
        e = e || window.event;
        var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
        var shiftDown = !!window.event.shiftKey;
        var targetType = e.target.tagName.toLowerCase();
        if (code) e.keyCode = code;
        if (!(targetType == 'input' || targetType == 'textarea')) {
            if (shiftDown && e.keyCode == KEY_UP_ARROW) {
                ignoreResize = 1;
                scale += 0.1;
                scale = Math.min(Math.max(minScale, scale), maxScale);
                scalePlayer(scale);
                e.preventDefault();
            }
            else if (shiftDown && e.keyCode == KEY_DOWN_ARROW) {
                ignoreResize = 1;
                scale -= 0.1;
                scale = Math.min(Math.max(minScale, scale), maxScale);
                scalePlayer(scale);
                e.preventDefault();
            }
            else if (shiftDown && e.keyCode == KEY_ENTER) {
                toggleNightMode();
                e.preventDefault();
            }
            else if (shiftDown && e.keyCode == KEY_LEFT_ARROW) {
                ignoreResize = 0;
                autoScaleEnable = !autoScaleEnable;
                toggleAutoScale();
                e.preventDefault();
            }
            else if (shiftDown && e.keyCode == KEY_SPACE) {
                var player_window = document.querySelectorAll('#ownplayer, iframe[allowfullscreen=true]')[0];
                if (player_window) {
                    player_window.scrollIntoView();
                    window.scrollBy(0, -1);
                }
                e.preventDefault();
            }
        }
    }

    window.addEventListener('keydown', function(e){onKeyDown(e);}, false);

    setTimeout(function() {
        GM_registerMenuCommand(str_title_nightMode, toggleNightMode, '');
        GM_registerMenuCommand(str_title_autoScale, function() {
            ignoreResize = 0;
            autoScaleEnable = !autoScaleEnable;
            toggleAutoScale();
        }, '');
    }, 1000);

    var addEvent = function(object, type, callback) {
        if (object == null || typeof(object) == 'undefined') return;
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
        } else if (object.attachEvent) {
            object.attachEvent('on' + type, callback);
        } else {
            object['on'+type] = callback;
        }
    };

    addEvent(window, 'resize', function(event) {
        toggleAutoScale();
    });

    var G_title_1 = document.querySelector('.b-content__main > .b-post__title > h1[itemprop="name"]').innerText,
        G_title_2 = document.querySelector('.b-content__main div[itemprop="alternativeHeadline"]').innerText,
        G_titleFull = G_title_1 + ' / ' + G_title_2
    ;
    //
    window.addEventListener('message', function(e) {
        if(typeof e.data === 'object' && e.data.sender === 'QUESTION' && e.data.reason === 'HREF') {
            // alert('ANSWER.data.url: ' + e.data.url);
            let G_messageTarget = document.querySelector('iframe#cdn-player').contentWindow;
            if (G_messageTarget) {
                let titleActive = document.querySelector('.b-simple_episode__item.active');
                titleActive = titleActive ? titleActive.innerText : null;
                G_messageTarget.postMessage({
                    sender: 'ANSWER',
                    title: G_titleFull,
                    url: window.location.href,
                    origin: window.location.origin,
                    pathname: window.location.pathname,
                    active : titleActive,
                }, '*');
            };
        };
    });
})();
