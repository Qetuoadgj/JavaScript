// ==UserScript==
// @name         complete.misc.v2
// @icon         https://www.google.com/s2/favicons?domain=jquery.com
// @namespace    complete.misc
// @version      2.0.91
// @description  try to take over the world!
// @author       You
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/complete.misc.v2.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @match        file:///*/2.*.*.html*
// @match        *://www.eporner.com/hd-porn/*/*/
// @match        *://www.eporner.eu/hd-porn/*/*/
// @match        *://www.eporner.com/embed/*
// @match        *://www.4tube.com/videos/*
// @match        *://www.4tube.com/embed/*
// @match        *://redtube.com/*
// @match        *://*.redtube.com/*
// @match        *://yespornplease.com/v/*
// @match        *://yespornplease.com/view/*
// @match        *://e.yespornplease.com/v/*
// @match        *://*.trendyporn.com/*
// @match        *://vshare.io/v/*
// @exclude      *://vshare.io/v/404/*
// @match        *://www.porntrex.com/video/*/*
// @match        *://www.porntrex.com/*
// @match        *://www.ebalovo.pro/video/*
// @match        *://sxyprn.com/post/*
// @match        *://sxyprn.net/post/*
// @match        *://upornia.com/videos/*/*
// @match        *://txxx.tube/videos/*/*
// @match        *://*.pornhub.com/*
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://www.pornhub.com/embed/*
// @match        *://www.playvids.com/*/*
// @match        *://www.pornoeggs.com/*
// @match        *://www.pornflip.com/*/*
// @match        *://www.youjizz.com/videos/*.html
// @match        *://www.veporns.com/video/*
// @match        *://openload.co/embed/*
// @match        *://oload.download/embed/*
// @match        *://oload.stream/embed/*
// @match        *://oload.info/embed/*
// @match        *://oload.life/embed/*
// @match        *://oload.xyz/embed/*
// @match        *://oload.biz/embed/*
// @match        *://oload.tv/embed/*
// @match        *://www.jjgirls.com/pornpics/*
// @match        *://jjgirls.com/pornpics/*
// @match        *://www.babesandstars.com/*/*/*/
// @match        *://www.definebabe.com/gallery/*
// @match        *://hqporner.com/hdporn/*.html
// @match        *://mydaddy.cc/video/*
// @match        *://hqwo.cc/player/*
// @match        *://www.sex.com/picture/*/
// @match        *://www.sex.com/pin/*/
// @match        *://www.sex.com/*
// @match        *://www.pornpics.com/*

// @match        *://biqle.ru/watch/*
// @match        *://biqle.org/watch/*
// @match        *://biqle.com/watch/*
// @match        *://daftsex.com/watch/*
// @match        *://daxab.com/player/*
// @match        *://dxb.to/player/*

// @match        *://www.pornesq.com/video/*/*
// @match        *://www.pornesq.com/embed/*

// @match        *://www.porngo.com/videos/*/*
// @match        *://www.xxxfiles.com/videos/*

// @match        *://txxx.com/videos/*/*
// @match        *://txxx.com/embed/*

// @match        *://netfapx.com/*

// @match        *://pornbox.video/video/*
// @match        *://player.flexcdn.cloud/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var G_debugMode = 0;
    // ================================================================================
    var G_pageHost = location.hostname,
        G_pageURL = location.href,
        G_pageTitle = document.title,
        G_shortURL = (location.protocol + '//' + location.host + location.pathname).trim(),
        G_pageDomain = /*window.*/ location.host.replace(/.*\.(.*\..*)/, '$1')
    ;
    // ================================================================================
    // var G_lastLogMessage = '';
    function log(showAlert, ...args) {
        // console.log(args);
        let string = args.join(' ').replace(/\n[\t ]/g, '\n');
        // if (G_lastLogMessage !== string) {
        // G_lastLogMessage = string;
        console.log(string);
        // };
        if (showAlert) alert(string);
    };
    // ================================================================================
    var G_userLang = navigator.language || navigator.userLanguage;
    var G_userLangShort = G_userLang.substr(0, 2);
    document.documentElement.lang = G_userLangShort; // disable "Google Translate Page" prompt
    // ================================================================================
    var G_funcToTest, G_funcToRun, G_funcResult, G_delay = 100, G_tries = 50, G_timerGroup = [];
    function waitForCondition(funcToTest = false, funcToRun = false, delay = 50, tries = 5, timerGroup = []) {
        let funcText = funcToTest.toString().replace(/\n+[ ]{4}/g, '').replace(/[{][ ]{4,}/g, '{').replace(/[ ]{4,}[}]/g, '}');
        // --------------------------------------------------------------------------------
        if ((funcToTest && (typeof funcToTest).toLowerCase() == 'function' && funcToRun && (typeof funcToRun).toLowerCase() == 'function')) {
            let timerGroupIndex = timerGroup.length;
            // --------------------------------------------------------------------------------
            function startIteration(iteration, delay, count, timerGroup, timerGroupIndex) {
                let timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
                if (timerGroup) timerGroup[timerGroupIndex] = timer; // add timer to timerGroup
            };
            // --------------------------------------------------------------------------------
            function clearTimers(timerGroup) {for (let timer of timerGroup) {clearTimeout(timer);}};
            // --------------------------------------------------------------------------------
            function iteration(count) {
                if (tries && (count < tries)) {
                    G_funcResult = funcToTest();
                    if (G_funcResult) {
                        let state = 'SUCCESS'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                        clearTimers(timerGroup);
                        funcToRun();
                        return;
                    }
                    else {
                        let state = 'keepRun'; log(0, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                        startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
                    };
                }
                else {
                    let state = 'FAIL'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                    // console.trace();
                };
            };
            // --------------------------------------------------------------------------------
            iteration(1); // launch 1st iteration
        };
        // --------------------------------------------------------------------------------
    };
    function waitForElement(elementSelector, attribute, funcToRun, delay, tries, timerGroup) {
        // --------------------------------------------------------------------------------
        let funcToTest = function () {
            console.log('elementSelector:', elementSelector, '\nattribute:', attribute);
            let result, elementsArray = document.querySelectorAll(elementSelector);
            for (let element of elementsArray) {
                let value = element ? /*element.getAttribute(attribute) ||*/ element[attribute] : null;
                result = attribute ? value : element;
                if (result && result !== '') {
                    G_funcResult = element;
                    break;
                };
            }
            if (!result) {
                // console.trace();
            };
            return result;
        };
        // --------------------------------------------------------------------------------
        waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
    };
    // ================================================================================
    G_funcToTest = function(){return 1;};
    G_funcToRun = function(){alert(G_funcResult);};
    // waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
    // waitForElement('video > source[src^="http"], video[src^="http"], video', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
    // ================================================================================
    var G_matchedLink;
    // ================================================================================
    String.prototype.matchLink = function(link, flags) {
        let result = this.match(new RegExp(link.replace(/[.\/]/g, "\\$&").replace(/\*/g, ".*"), flags));
        if (result) G_matchedLink = 'matchLink: ' + link + (flags ? ' ; flags: ' + flags : '');
        return result;
    };
    // ================================================================================
    Element.prototype.appendElement = function (stickTo, stickPosition = 0) {
        if (stickPosition > 0) stickTo.parentNode.insertBefore(this, stickTo.nextSibling);
        else if (stickPosition < 0) stickTo.parentNode.insertBefore(this, stickTo);
        else stickTo.appendChild(this);
    };
    String.prototype.capitalize = function() {
        function capFirst(str) { return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1); };
        return this.split(' ').map(capFirst).join(' ');
    };
    String.prototype.toTitleCase = function(lower) {
        let string = lower ? this.toLowerCase() : this;
        let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
        return string.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
            if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return match.toLowerCase();
            };
            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            };
            return match.charAt(0).toUpperCase() + match.substr(1);
        });
    };
    // ================================================================================
    var getAbsoluteUrl = (function () { let a; return function (url) { if (!a) a = document.createElement('a'); a.href = url; return a.href; }; })();
    function setSearchParam(param, value = '') {
        if (location.search === '') {
            return `?${param}=${value}`;
        }
        else {
            let matched = false;
            let symbol = location.search[0];
            let params_old = location.search.substring(1).split('&'), params_new = [];
            for (let p of params_old) {
                let match = p.split('=');
                if (match) {
                    let k = match[0], v = match[1];
                    matched = matched || k == param;
                    if (k == param) {
                        v = value;
                    };
                    params_new.push(v === '' ? `${k}` : `${k}=${v}`);
                }
                else {
                    matched = matched || p == param;
                    params_new.push(param);
                };
                // console.log(k, v);
            };
            if (!matched) params_new.push(value === '' ? `${param}` : `${param}=${value}`);
            return symbol + params_new.join('&');
        };
    };
    // ================================================================================
    // expected hue range: [0, 360)
    // expected saturation range: [0, 1]
    // expected lightness range: [0, 1]
    function hslToRgb(hue, saturation, lightness) { // SOURCE: https://stackoverflow.com/questions/27653757/how-to-use-hsl-to-rgb-conversion-function/27663212#27663212
        let red, green, blue;
        // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
        if (hue == undefined) return [0, 0, 0];
        let chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation,
            huePrime = hue / 60,
            secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1))
        ;
        huePrime = Math.floor(huePrime);
        if (huePrime === 0) {red = chroma; green = secondComponent; blue = 0;}
        else if (huePrime === 1) {red = secondComponent; green = chroma; blue = 0;}
        else if (huePrime === 2) {red = 0; green = chroma; blue = secondComponent;}
        else if (huePrime === 3) {red = 0; green = secondComponent; blue = chroma;}
        else if (huePrime === 4) {red = secondComponent; green = 0; blue = chroma;}
        else if (huePrime === 5) {red = chroma; green = 0; blue = secondComponent;}
        let lightnessAdjustment = lightness - (chroma / 2);
        red += lightnessAdjustment;
        green += lightnessAdjustment;
        blue += lightnessAdjustment;
        return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
    };
    // --------------------------------------------------------------------------------
    function valToColor(percent = 100, clip = 0, saturation = 1.0, start = 0, end = 100, toRGB = 0) {
        percent = Math.min(percent, 160); end = Math.min(end, 100);
        let a = (percent <= clip) ? 0 : (((percent - clip) / (100 - clip))),
            b = Math.abs(end - start) * a,
            c = (end > start) ? (start + b) : (start - b);
        let h = c, s = saturation, l = 0.5;
        if (toRGB) {
            let rgb = hslToRgb(h, s, l);
            return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        }
        else {
            return 'hsl(' + h + ', ' + (s*100) + '%, ' + (l*100) + '%)';
        };
    };
    // ================================================================================
    function addGlobalStyle(css, cssClass) {
        let head = document.getElementsByTagName('head')[0];
        if (!head) return;
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
        return style;
    };
    // ================================================================================
    function addKeyComboCtrlC(targetElement, preventDefault, ignoreSelections) {
        let keyCodes = {'c' : 67};
        let onKeyDown = function (e) {
            e = e || window.event;
            let ctrlDown = e.ctrlKey || e.metaKey; // Mac support
            if (targetElement && ctrlDown && e.keyCode == keyCodes.c) {
                let selectedText = window.getSelection().toString();
                selectedText = ignoreSelections ? false : (selectedText && selectedText !== '');
                if (!selectedText) {
                    targetElement.select();
                    document.execCommand('copy');
                    if (preventDefault) e.preventDefault();
                };
            }
        };
        window.addEventListener('keydown', function (e) {onKeyDown(e);}, false);
    };
    // ================================================================================
    function toHHMMSS(secs) {
        let sec_num = parseInt(secs, 10);
        let hours = Math.floor(sec_num / 3600) % 24;
        let minutes = Math.floor(sec_num / 60) % 60;
        let seconds = sec_num % 60;
        return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":");
    };
    // ================================================================================
    function addMediaTextIndicator(media, fontSize) {
        fontSize = fontSize || 72;
        let mediaTextIndicator = document.createElement('div');
        mediaTextIndicator.style.setProperty('color', 'yellow', 'important');
        mediaTextIndicator.style['font-size'] = fontSize + 'px';
        mediaTextIndicator.style.position = 'absolute';
        mediaTextIndicator.style['z-index'] = 2147483647; // Always on TOP
        mediaTextIndicator.style.top = '0px';
        mediaTextIndicator.style.left = (fontSize/4) + 'px';
        media.parentNode.insertBefore(mediaTextIndicator, media.nextSibling);
        let volumeTextFade = function(fadeDelay) {
            fadeDelay = fadeDelay || 2000;
            let fadeDelaySeconds = Math.floor(fadeDelay/1000);
            function textFadeStart(show) {
                let transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                mediaTextIndicator.style.opacity = show ? 1 : 0;
                mediaTextIndicator.style.transition = transition;
                mediaTextIndicator.style['-webkit-transition'] = transition; // Safari
            };
            textFadeStart(true);
            setTimeout(textFadeStart, fadeDelaySeconds*1000);
        };
        let setVolumeText = function() {
            volumeTextFade(2000);
            mediaTextIndicator.textContent = Math.round(media.volume * 100) > 0 ? Math.round(media.volume * 100) : 'Off';
        };
        let setTimeText = function() {
            volumeTextFade(2000);
            let duration = media.duration;
            let currentTime = media.currentTime;
            mediaTextIndicator.textContent = (toHHMMSS(currentTime) + "/" + toHHMMSS(duration));
        };
        let addEventHandlers = function() {
            if (media.addEventListener) {
                media.addEventListener("volumechange", setVolumeText, false); // IE9, Chrome, Safari, Opera
                media.addEventListener("seeking", setTimeText, false); // IE9, Chrome, Safari, Opera
            }
            else {
                media.attachEvent("onvolumechange", setVolumeText); // IE 6/7/8
                media.attachEvent("onseeking", setTimeText); // IE 6/7/8
            };
        };
        setTimeout(addEventHandlers, 10);
        return mediaTextIndicator;
    };
    // ================================================================================
    function msgbox(title, message, time = 2000, width = 250, height = 120) {
        let padding = 10;
        let w = width - padding*2,
            h = height - padding*2
        ;
        let centerX = function(e, fix) {
            let transform = e.style.transform;
            transform = transform + (fix ? 'translateY(0.5px) translateX(-50%)' : 'translateX(-50%)');
            e.style.left = 50 + '%';
            e.style['-ms-transform'] = transform;
            e.style['-moz-transform'] = transform;
            e.style['-webkit-transform'] = transform;
            e.style.transform = transform;
        };
        let centerY = function(e, fix) {
            let transform = e.style.transform;
            transform = transform + (fix ? 'translateX(0.5px) translateY(-50%)' : 'translateY(-50%)');
            e.style.top = 50 + '%';
            e.style['-ms-transform'] = transform;
            e.style['-moz-transform'] = transform;
            e.style['-webkit-transform'] = transform;
            e.style.transform = transform;
        };
        let fade = function(element, fadeDelay) {
            fadeDelay = fadeDelay || 2000;
            let fadeDelaySeconds = Math.floor(fadeDelay/1000);
            function fadeStart(show) {
                let transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                element.style.opacity = show ? 1 : 0;
                element.style.transition = transition;
                element.style['-webkit-transition'] = transition; // Safari
                if (!show) setTimeout(function(){element.remove();}, fadeDelay);
            };
            fadeStart(true);
            setTimeout(fadeStart, fadeDelaySeconds*1000);
        };
        let d = document.createElement('div');
        d.style.display = 'table';
        d.style.position = 'fixed';
        d.style.right = 10 + 'px';
        d.style.bottom = 10 + 'px';
        d.style.maxWidth = 90 + '%';
        d.style.maxHeight = 90 + '%';
        d.style.width = w + 'px';
        d.style.height = 'auto';
        d.style.minHeight = h + 'px';
        d.style.setProperty('background-color', 'white', 'important');
        d.style.border = '2px solid black';
        d.style.zIndex = 2147483647;
        document.body.appendChild(d);
        //
        if (title) {
            let titleElement = document.createElement('p');
            titleElement.style.borderBottom = '1px solid black';
            titleElement.style.margin = 0;
            titleElement.style.padding = (padding/2) + 'px';
            titleElement.style.setProperty('background-color', '#4CAF50', 'important');
            titleElement.style.setProperty('color', 'white', 'important');
            titleElement.innerText = title;
            d.appendChild(titleElement);
        };
        if (message) {
            let messageElement = document.createElement('p');
            messageElement.style.margin = 0;
            messageElement.style.padding = (padding/2) + 'px';
            messageElement.style.display = 'table-row';
            messageElement.style.textAlign = 'center';
            messageElement.style.verticalAlign = 'middle';
            messageElement.style.setProperty('color', 'black', 'important');
            messageElement.style.setProperty('background-color', 'white', 'important');
            messageElement.innerText = message;
            d.appendChild(messageElement);
        };
        if (time) fade(d, time);
        return d;
    };
    // ================================================================================
    function mediaMouseControls(eventCatcher, media, step) {
        step = (step === 0) ? 0 : (step || 1);
        let mouseWheelAudioHandler = function(e) {
            if (step !== 0) {
                // cross-browser wheel delta
                e = window.event || e; // old IE support
                let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                let amount = parseInt(delta*step), volume = parseInt(media.volume*100);
                let value = amount > 0 ? Math.floor((volume+amount)/step)*step : Math.ceil((volume+amount)/step)*step;
                media.volume = Math.max(0, Math.min(100, value)) / 100;
            };
            e.preventDefault();
        };
        let mouseWheelTimeHandler = function(e) {
            if (step !== 0) {
                // cross-browser wheel delta
                e = window.event || e; // old IE support
                let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                let amount = parseInt(delta*step);
                let mediaState = media.paused ? 0 : 1;
                setTimeout(function() {
                    if (delta < 0) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) - 5; if (mediaState == 1) media.play();
                    }
                    else if (delta > 0) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) + 5; if (mediaState == 1) media.play();
                    };
                }, 10);
            };
            e.preventDefault();
        };
        if (media.addEventListener) {
            eventCatcher.addEventListener("mousewheel", mouseWheelTimeHandler, false); // IE9, Chrome, Safari, Opera
            eventCatcher.addEventListener("DOMMouseScroll", mouseWheelTimeHandler, false); // Firefox
        }
        else {
            eventCatcher.attachEvent("onmousewheel", mouseWheelTimeHandler); // IE 6/7/8
        };
        let mediaTextIndicator = addMediaTextIndicator(media, 56/2);
        mediaTextIndicator.style.top = '5px';
    };
    // ================================================================================
    function fixURLProtocol(URL) {
        if (URL && !URL.match(/^http/)) {
            URL = location.protocol + '//' + URL.replace(/^\/\//, '');
        };
        return URL;
    };
    // ================================================================================
    function CreateLinksList(Haystack, NeedleRegEx, Replacement, StartNum, EndNum) {
        let Ret = [];
        if (Haystack.match(NeedleRegEx)) {
            let Result = Haystack.replace(NeedleRegEx, Replacement);
            StartNum = StartNum || 0; // StartNum > 1 ? StartNum : 1;
            EndNum = EndNum > StartNum ? EndNum : StartNum; // EndNum > 1 ? EndNum : 1;
            for (let i = StartNum; i <= EndNum; i++) {
                Ret[i] = fixURLProtocol(Result.replace('$NUM', i));
            };
            // console.log('G_posters:\n', G_posters);
            return Ret;
        };
    };
    // ================================================================================
    function injectNode(tagName, parentNode, innerHTML) {
        let e = document.createElement(tagName);
        if (typeof parentNode == "string") parentNode = document.querySelector(parentNode);
        parentNode.appendChild(e);
        if (innerHTML) e.innerHTML = innerHTML;
        return e;
    };
    // ================================================================================
    function getWindowVar(varName) {
        /* globals getVar */
        let script = injectNode('script', document.head, 'function getVar(varName){return window[varName];}');
        let result = getVar(varName);
        script.remove();
        return result;
    };
    // ================================================================================
    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {for(var j=i+1; j<a.length; ++j) {if (a[i] === a[j]) a.splice(j--, 1);}}
        return a;
    };
    // G_reCastHosts = G_reCastHosts.concat([]).unique();
    // ================================================================================
    if (location.href.match('autoplay=true')) {
        GM_setValue('autoplay', true);
    };
    var duration = location.href.match(/\bt\b=((\d+)(,\d+)?)/);
    if (duration) {
        GM_setValue('t', duration[1]);
    };
    var qualityLimitMatch = location.href.match(/qualityLimit=(\d+)/);
    if (qualityLimitMatch) {
        GM_setValue('qualityLimit', parseInt(qualityLimitMatch[1])*1.1); // +10%
    };
    const G_qualityLimit = GM_getValue('qualityLimit', 9999);
    var reflectMatch = location.href.match(/reflect=(\d+deg\b)/i);
    if (reflectMatch) {
        GM_setValue('reflect', reflectMatch[1]);
    };
    // ================================================================================
    function refineVideo(url, noPlayerExtension = false) {
        let autoplay = GM_getValue('autoplay', null), t = GM_getValue('t', null);
        console.log('autoplay: ' + autoplay || 'false');
        let url_base = url.split('?')[1] ? url.split('?')[0] : url,
            url_keys = url.split('?')[1] ? url.split('?')[1] : null
        ;
        // alert(url_keys);
        // alert(url_base);
        if (autoplay) {
            if (url_keys) {if (!url_keys.match('&autoplay=true')) {url = url + '&autoplay=true';}}
            else if (!url_base.match('autoplay=true')) {url = url + '?autoplay=true'; url_keys = url.replace(url_base, '');}
            GM_deleteValue('autoplay');
        };
        if (t) {
            console.log('t: ' + t);
            if (url_keys) {if (!url_keys.match('&t=' + t)) {url = url + '&t=' + t;}}
            else if (!url_base.match('t=' + t)) {url = url + '?t=' + t; url_keys = url.replace(url_base, '');}
            GM_deleteValue('t');
        };
        let reflect = GM_getValue('reflect', null);;
        if (reflect) {
            console.log('reflect: ' + reflect);
            if (url_keys) {if (!url_keys.match('&reflect='+reflect)) {url = url + '&reflect='+reflect;}}
            else if (!url_base.match('reflect='+reflect)) {url = url + '?reflect='+reflect; url_keys = url.replace(url_base, '');}
            GM_deleteValue('reflect');
        };
        let isInstalled = document.documentElement.getAttribute('clean-media-page-extension-installed');
        let playerPath = 'chrome-extension://bbaidcdbgbiachhpighhjgbeahoikjbp/player.html';
        if (noPlayerExtension) {
            playerPath = location.protocol + '//' + G_pageDomain + '/v/404/';
            return playerPath + url;
        };
        return playerPath + '#' + url;
    };
    function openURL(url) {
        log(G_debugMode, 'openURL.url: ' + url);
        GM_deleteValue('contentURL');
        GM_deleteValue('qualityLimit');
        // if (TEST_MODE) return;
        location.replace(url);
        // location.href = url;
    };
    // ================================================================================
    function eventFire(el, etype) {
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        }
        else {
            let evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        };
    };
    // ================================================================================
    var G_embedCodeFrame, G_stickTo, G_stickPosition; function addEmbedCodeFrame() {
        let parentDocument = document;
        // --------------------------------------------------------------------------------
        let elementID = 'uniqueEmbedCodeFrame';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element = parentDocument.createElement('div');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style['word-wrap'] = 'break-word';
        // --------------------------------------------------------------------------------
        element.appendElement(G_stickTo, G_stickPosition);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_RenameTable = [
        '18VirginSex.com',
        '21Naturals.com',
        '21Sextury.com',
        'AdultTime.com',
        'Babes.com',
        'BadTeensPunished.com',
        'Baeb.com',
        'Bang.com',
        'BangBros.com',
        'BellaFilms.com',
        'BellaPass.com',
        'BigTitsRoundAsses.com',
        'BrattySis.com',
        'Brazzers.com',
        'BrutalCastings.com',
        'BrutalPickups.com',
        'Bryci.com',
        'BurningAngel.com',
        'CastingCoach-X.com',
        'CherryPimps.com',
        'Colette.com',
        'CreampieAngels.com',
        'Cum4K.com',
        'CumLouder.com',
        'DDFNetwork.com',
        'DaneJones.com',
        'DarkX.com',
        'Deeper.com',
        'DigitalPlayground.com',
        'EroticaX.com',
        'EvilAngel.com',
        'Exotic4K.com',
        'Family.XXX',
        'FamilyHookups.com',
        'FamilyStrokes.com',
        'FantasyHD.com',
        'FantasyMassage.com',
        'FetishNetwork.com',
        'FuckingAwesome.com',
        'GFRevenge.com',
        'HardX.com',
        'HelplessTeens.com',
        'HollyRandall.com',
        'HookupHotshot.com',
        'HussiePass.com',
        'Hustler.com',
        'JaysPOV.net',
        'JeshByJesh.com',
        'JoyMii.com',
        'JulesJordan.com',
        'Karups.com',
        'KinkySpa.com',
        'Lubed.com',
        'MetroHD.com',
        'Mofos.com',
        'MySistersHotFriend.com',
        'NaughtyAmerica.com',
        'NewSensations.com',
        'NubileFilms.com',
        'NubilesPorn.com',
        'NuruMassage.com',
        'Nympho.com',
        'OnlyTeenBlowjobs.com',
        'POVD.com',
        'Passion-HD.com',
        'Penthouse.com',
        'Petite.XXX',
        'PornFidelity.com',
        'PornHub.com',
        'PornPros.com',
        'PornstarCamHouse.com',
        'PrettyDirty.com',
        'Private.com',
        'ProducersFun.com',
        'PublicAgent.com',
        'RealityKings.com',
        'RoccoSiffredi.com',
        'SexArt.com',
        'SpankMonster.com',
        'Spizoo.com',
        'SpyFam.com',
        'StepSiblingsCaught.com',
        'Swallowed.com',
        'SweetSinner.com',
        'TeamSkeet.com',
        'TeenFidelity.com',
        'TeensLoveHugeCocks.com',
        'Tiny4K.com',
        'ToughLoveX.com',
        'TrenchCoatX.com',
        'Tushy.com',
        'Twistys.com',
        'VOGOV.com',
        'Vixen.com',
        'WhteBoxxx.com',
        'WoodmanCastingX.com',
        'WowGirls.com',
        'X-Art.com',
        'YoungThroats.com',
        'ZTOD.com',
        // ---------------
        'GirlCum.com',
        'HotWifeXXX.com',
        'Wankz.com',
        'DevilsFilm.com',
        'ThirdMovies.com',
        'SheWillCheat.com',
        'BellasaFilms.com',
        'DetensionGirls.com',
        'Blacked.com',
        '5kPorn.com',
        'RealityJunkies.com',
        'MissaX.com',
        'PureTaboo.com',
        'AllFineGirls.com',
        'InTheCrack.com',
        'ATKGirlfriends.com',
        'MyLifeInMiami.com',
        'Wicked.com',
        'ElegantAngel.com',
        'DaughterSwap.com',
        'Submissived.com',
        'LesbianX.com',
        'Clips4Sale.com',
        'AllGirlMassage.com',
        'BlacksOnBlondes.com',
        'DeviceBondage.com',
        'TrueAnal.com',
        'KellyMadison.com',
        'SisLovesMe.com',
        '1000Facials.com',
        'JesseLoadsMonsterFacials.com',
        'DirtyFlix.com',
        'DadCrush.com',
        'ScrewBox.com',
        'FamilySinners.com',
        'CherryPop.com',
        'ErotiqueTvLive.com',
        'DeviantHardcore.com',
        'Throated.com',
        'PropertySex.com',
        'TeenMegaWorld.com',
        'BannedStories.com',
        'Thickumz.com',
        'MomsTeachSex.com',
        'IsThisReal.com',
        'SinsLife.com',
    ];
    G_RenameTable = [...new Set(G_RenameTable)].sort();
    function autoReplace(str) {
        str = str.trim().
        replace(/[,.\s]+(com)\b/g, '.$1').
        replace(/\s+,/g, ',').
        replace(/,\s+/g, ',').
        replace(/,+/g, ',').
        replace(/^,/g, '').
        replace(/,$/g, '').
        replace(/,/g, ', ').
        replace(/(\.com\b){2,}/g, '.com').
        replace(/M:, /g, 'M:')
        ;
        for (let word of G_RenameTable) {
            let re = new RegExp(word.replace(/\./g, '\.'), 'gi');
            str = str.replace(re, word);
        };
        let a = [];
        for (let word of str.split(', ')) {
            if (typeof word !== 'undefined') {
                word = word.trim()
                if (word !== '') {
                    word = word[0].toUpperCase() + word.slice(1);
                    a.push(word);
                };
            };
        };
        str = a.join(', ');
        console.log(str);
        return str;
    };
    function checkArrayMatch(array, str) {
        for (let item of array) {
            let match = str.match(item);
            if (match) return match;
        };
    };
    function autoSort(str) {
        let a = [];
        let t1 = [];
        let t2 = [];
        let t3 = [];
        let t4 = [];
        let domains = [/^[^\s]+\.[^\s]+$/];
        let extra = ['★', /^\d+fps$/, /^(HQ|OK|[^\w]+|\d+)$/];
        for (let word of str.split(', ')) {
            if (typeof word !== 'undefined') {
                word = word.trim()
                if (word !== '') {
                    if (word.match(/^M:/)) {
                        t1.push(word);
                    }
                    else if (checkArrayMatch(extra, word)) {
                        t4.push(word);
                    }
                    else if (checkArrayMatch(domains, word)) {
                        t3.push(word);
                    }
                    else {
                        t2.push(word);
                    };
                };
            };
        };
        a = t1.concat(t2.sort()).concat(t3.sort()).concat(t4.sort());
        str = a.join(', ');
        console.log(str);
        return str;
    };
    var G_embedCodeTextCategorie = GM_getValue('category', '') || '';
    var G_categories = {
        'M:' : '',
        '.com' : '',
        '60fps' : '',
        'HQ' : '',
        'OK' : '',
        'Anal' : '',
        '3some' : '',
        '4some' : '',
        'Orgy' : '',
        'Only blowjob' : '',
        'Creampie' : '',
        'Creampie, Cum in pussy' : '',
        'Creampie, Cum in ass' : '',
        // 'Fuck after Cumshot' : '',
        'Continue after cumshot' : '',
        'Fake cum': '',
        'PornHub.com': '',
        '★' : '',
        '-----------------------------' : '',
    };
    var G_embedCodeCatInput; function addEmbedCodeCatInput(embedCodeFrame) {
        let buttonHolderID = 'uniqueEmbedCodeCatButtonHolder';
        for (let element of document.querySelectorAll('#' + buttonHolderID)) {element.remove();};
        let buttonHolder = document.createElement('div');
        buttonHolder.setAttribute('id', buttonHolderID);
        // element0.style.background = 'red';
        buttonHolder.style.display = 'flex';
        buttonHolder.style.alignItems = 'center';
        // element0.style.border = '1px grey solid';
        buttonHolder.style.height = '26px';
        embedCodeFrame.appendChild(buttonHolder);
        // --------------------------------------------------------------------------------
        let element0ID = 'uniqueEmbedCodeCatInputHolder';
        for (let element of document.querySelectorAll('#' + element0ID)) {element.remove();};
        let element0 = document.createElement('div');
        element0.setAttribute('id', element0ID);
        // element0.style.background = 'red';
        element0.style.display = 'flex';
        element0.style.alignItems = 'center';
        // element0.style.border = '1px grey solid';
        element0.style.height = '26px';
        embedCodeFrame.appendChild(element0);
        // --------------------------------------------------------------------------------
        let elementID = 'uniqueEmbedCodeCatInput';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element = document.createElement('input');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'inline-block', 'important');
        element.style.border = 'none';
        element.style['background-color'] = 'transparent';
        element.style.width = '100%';
        element.style['max-width'] = '100%';
        // element.style.rows = '2';
        element.style.overflow = 'hidden';
        element.style['font-size'] = '12px';
        element.style.padding = '0px'; // '4px';
        element.style.color = G_embedCodeTextAreaColor;
        // element.setAttribute('readonly', 'readonly');
        // element.setAttribute('onclick', 'this.focus(); this.select();');
        element.placeholder = 'categories';
        element.autocomplete = 'on';
        G_embedCodeTextCategorie = G_embedCodeTextCategorie.trim();
        if (G_embedCodeTextCategorie !== '') element.value = G_embedCodeTextCategorie;
        element.addEventListener('change', function(e){
            G_embedCodeTextCategorie = e.target.value;
            G_embedCodeTextCategorie = autoReplace(G_embedCodeTextCategorie);
            G_embedCodeTextCategorie = autoSort(G_embedCodeTextCategorie);
            e.target.value = G_embedCodeTextCategorie;
            updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
            // ---
            for (let button of document.querySelectorAll('#uniqueEmbedCodeCatButtonHolder > button')) {
                // if (text == button.innerText.trim()) return;
                button.remove();
            };
            for (let word of e.target.value.split(', ')) {
                if (typeof word !== 'undefined') {
                    word = word.trim()
                    addCatButton(word, false);
                };
            };
        }, false);
        // --------------------------------------------------------------------------------
        element0.appendChild(element);
        // --------------------------------------------------------------------------------
        initSaveCategories(element);
        // --------------------------------------------------------------------------------
        let element3ID = 'uniqueEmbedCodeCatData';
        for (let element of document.querySelectorAll('#' + element3ID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element3 = document.createElement('datalist');
        element3.setAttribute('id', element3ID);
        for (let k of Object.keys(/*l*/ G_categories )) {
            let option = document.createElement('option');
            option.value = k;
            element3.appendChild(option);
            // console.log(option);
        };
        let option = document.createElement('option');
        option.value = '-----------------------------';
        element3.appendChild(option);
        // console.log(option);
        for (let word of G_RenameTable) {
            let option = document.createElement('option');
            option.value = word;
            element3.appendChild(option);
            // console.log(option);
        };
        // --------------------------------------------------------------------------------
        let element2ID = 'uniqueEmbedCodeCatList';
        for (let element of document.querySelectorAll('#' + element2ID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element2 = document.createElement('input');
        element2.setAttribute('id', element2ID);
        element2.type = 'search';
        element2.style.display = 'inline';
        element2.style.width = '200px';
        element2.style.margin = '0 1px';
        element0.appendChild(element2);
        // --------------------------------------------------------------------------------
        element0.appendChild(element3);
        element2.setAttribute('list', element3ID);
        element2.onclick = function(e) {
            G_embedCodeTextCategorie = GM_getValue('category', '') || '';
            element.value = G_embedCodeTextCategorie;
            let event = new Event('change');
            element.dispatchEvent(event);
        };
        // --------------------------------------------------------------------------------
        let element4ID = 'uniqueEmbedCodeCatButtonAdd';
        for (let element of document.querySelectorAll('#' + element4ID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element4 = document.createElement('button');
        element4.setAttribute('id', element4ID);
        element4.style.display = 'inline-flex';
        element4.style.width = '40px';
        element4.style.margin = '0px'; //'0px 0px 0px 1px'
        element4.style.height = '26px';
        element4.style.position = 'relative';
        // element4.style.top = '-2px';
        // element4.style['align-content'] = 'center';
        element4.style.justifyContent = 'center';
        element4.style.fontSize = '10px';
        element4.innerHTML = '+';
        element0.appendChild(element4);
        // --------------------------------------------------------------------------------
        addGlobalStyle('#uniqueEmbedCodeCatButtonHolder > button {height: 20px; font-size: 12px; width: max-content;}', 'buttons');
        function addCatButton(text, ignoreDupes = false) {
            text = text.trim();
            if (text == '') return;
            if (!ignoreDupes) {
                //                 let curValues = element.value.trim().split(', ');
                //                 if (curValues.includes(text)) return;
                for (let button of document.querySelectorAll('#uniqueEmbedCodeCatButtonHolder > button')) {
                    if (text == button.innerText.trim()) return;
                };
            };
            //--
            let b = document.createElement('button');
            buttonHolder.appendChild(b);
            b.innerText = text;
            b.onclick = (e) => {
                let b = e.target;
                b.remove();
                let text = b.innerText.trim();
                let curValues = element.value.trim().split(', ');
                // let firstValue = curValues[0], lastValue = curValues[curValues.length-1];
                let newValues = [];
                for (let word of text.split(', ')) {
                    for (let value of curValues) {
                        value = value.trim();
                        if (value == '') continue;
                        if (value == word) continue;
                        newValues.push(value);
                    };
                };
                element.value = newValues.join(', ');
                // Create a new 'change' event
                let event = new Event('change');
                // Dispatch it.
                element.dispatchEvent(event);
            };
            // console.log('b:', b);
        };
        element4.onclick = function(e) {
            let value1 = element.value.trim();
            let value2 = element2.value.trim();
            // ----
            //             let b = addCatButton(value2);
            //             console.log('b:', b);
            // ----
            let a = value1.split(', '); // [];
            for (let word of value2.split(', ')) {
                if (typeof word !== 'undefined') {
                    word = word.trim();
                    if (word == '') continue;
                    if (a.includes(word)) continue;
                    a.push(word);
                };
            };
            // console.log('a:', a);
            // a.push(value2);
            value1 = a.join(', ');
            element.value = value1;
            // Create a new 'change' event
            let event = new Event('change');
            // Dispatch it.
            element.dispatchEvent(event);
            // console.log(value1, notInArray);
            element2.value = '';
        };
        // --------------------------------------------------------------------------------
        let element5ID = 'uniqueEmbedCodeCatButtonRemove';
        for (let element of document.querySelectorAll('#' + element5ID)) {element.remove();};
        let element5 = element4.cloneNode(true);
        element5.innerHTML = '-';
        element.parentNode.insertBefore(element5, element2);
        element5.onclick = function(e) {
            let value1 = element.value.trim();
            let values = value1.split(', ');
            let firstValue = values[0], lastValue = values[values.length-1];
            firstValue = firstValue ? firstValue.trim() : ''
            if (firstValue !== '') {
                if (lastValue == firstValue) {
                    element.value = "";
                }
                else {
                    element.value = firstValue;
                };
                let event = new Event('change');
                element.dispatchEvent(event);
                element.value += ', ';
            };
        };
        // --------------------------------------------------------------------------------
        element.style.height = '100%'; element2.style.height = '100%'; // element4.style.height = '100%';
        element.style.width = 'calc(100% - ' + element2.style.width + ' - ' + element4.style.width + ' - 1px - ' + element5.style.width + ' - 1px)';
        element.style['max-width'] = element.style.width;
        // --------------------------------------------------------------------------------
        for (let word of element.value.split(', ')) {
            if (typeof word !== 'undefined') {
                word = word.trim()
                addCatButton(word, false);
            };
        };
        // --
        return element;
    };
    var G_embedCodeTextStart = '00:00:00';
    var G_embedCodeStartInput; function addEmbedCodeStartInput(embedCodeFrame) {
        let elementID = 'uniqueEmbedCodeStartInput';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element = document.createElement('input');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style.border = 'none';
        element.style['background-color'] = 'transparent';
        element.style.width = '100%';
        element.style['max-width'] = '100%';
        element.style.overflow = 'hidden';
        element.style['font-size'] = '12px';
        element.style.color = G_embedCodeTextAreaColor;
        element.placeholder = '00:00:00';
        G_embedCodeTextStart = G_embedCodeTextStart.trim();
        if (G_embedCodeTextStart !== '') element.value = G_embedCodeTextStart;
        element.addEventListener('change', function(e){
            G_embedCodeTextStart = e.target.value;
            updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        }, false);
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeTextImage = '';
    var G_embedCodeImageInput; function addEmbedCodeImageInput(embedCodeFrame) {
        let elementID = 'uniqueEmbedCodeImageInput';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element = document.createElement('input');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style.border = 'none';
        element.style['background-color'] = 'transparent';
        element.style.width = '100%';
        element.style['max-width'] = '100%';
        element.style.overflow = 'hidden';
        element.style['font-size'] = '12px';
        element.style.color = G_embedCodeTextAreaColor;
        if (typeof G_posterURL !== 'undefined') {
            G_embedCodeTextImage = G_posterURL.trim();
        };
        if (G_embedCodeTextImage !== '') {
            element.value = G_embedCodeTextImage;
            element.placeholder = G_embedCodeTextImage;
        };
        element.addEventListener('change', function(e){
            G_embedCodeTextImage = e.target.value.trim();
            if (!G_embedCodeTextImage.match(/^http/)) {
                G_embedCodeTextImage = location.protocol + '//' + G_embedCodeTextImage.replace(/^\/\//, '');
                element.value = G_embedCodeTextImage;
            };
            //
            G_posterURL = G_embedCodeTextImage;
            G_embedCodePoster.setAttribute('src', G_posterURL);
            resizeEmbedCodePoster(1.0, 0.5, 5000);
            //
            updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
            console.log('G_embedCodeTextImage:', G_embedCodeTextImage);
        }, false);
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeTextArea, G_embedCodeTextAreaColor = 'grey'; function addEmbedCodeTextArea(embedCodeFrame) {
        let elementID = 'uniqueEmbedCodeTextArea';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element = document.createElement('textarea');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style.border = 'none';
        element.style['background-color'] = 'transparent';
        element.style.width = '100%';
        element.style['max-width'] = '100%';
        element.style.rows = '2';
        element.style.overflow = 'hidden';
        element.style['font-size'] = '12px';
        element.style.color = G_embedCodeTextAreaColor;
        element.setAttribute('readonly', 'readonly');
        element.setAttribute('onclick', 'this.focus(); this.select();');
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodePoster, G_posterURL, G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
    function addEmbedCodePoster(embedCodeFrame, onClickFunc) {
        let elementID = 'uniqueEmbedCodePoster';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element = document.createElement('img');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'inline-block', 'important');
        element.style['vertical-align'] = 'inherit';
        element.style['max-height'] = '120px';
        element.style.width = 'auto';
        element.style.height = 'auto';
        element.style['min-width'] = '215px';
        element.style.height = '120px';
        element.setAttribute('src', fixURLProtocol(G_posterURL));
        for (let key in G_posterStyle) {
            element.style[key] = G_posterStyle[key];
            console.log(key, G_posterStyle[key])
        };
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        element.addEventListener('click', onClickFunc, false);
        element.addEventListener('mouseover', function(){resizeEmbedCodePoster(1.0, 0.5, 5000);}, false);
        element.addEventListener('load', function(e){
            G_embedCodeTextImage = e.target.src;
            G_embedCodeImageInput.value = G_embedCodeTextImage;
            updatePostersArrayStyle();
        }, false);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodePosterResizeTimer = null;
    function resizeEmbedCodePoster(before = 1.0, after = 0.5, delay = 5000) {
        G_embedCodePoster.style.zoom = before;
        clearTimeout(G_embedCodePosterResizeTimer);
        G_embedCodePosterResizeTimer = setTimeout(function() {
            G_embedCodePoster.style.zoom = after;
        }, delay);
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeLink, G_contentURL, G_allData; function addEmbedCodeLink(embedCodeFrame) {
        let elementID = 'uniqueEmbedCodeLink';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element = document.createElement('a');
        element.style.setProperty('display', 'block', 'important');
        element.style['font-size'] = '12px';
        element.style.color = '#086081';
        element.style.width = 'auto';
        element.setAttribute('target', '_blank'); // Open in new tab
        element.setAttribute('href', G_contentURL);
        element.text = element.href;
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeVideo, G_sampleURL, G_videoWidth = 0, G_videoHeight = 0, G_videoDuration = 0, G_videoQuality, G_forceLoad = true; function addEmbedCodeVideo(embedCodeFrame, onClickFunc, onLoadFunc, onErrorFunc, forceLoad = false) {
        let elementID = 'uniqueEmbedCodeVideo';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        let element = document.createElement('video');
        element.setAttribute('id', elementID);
        element.style = G_embedCodePoster.getAttribute('style');
        element.style['border-style'] = 'solid';
        element.style['border-width'] = (1+1) + 'px';
        element.setAttribute('preload', 'metadata');
        element.style.height = G_embedCodePoster.offsetHeight + 'px';
        element.style.width = G_embedCodePoster.offsetWidth + 'px';
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        element.addEventListener('loadedmetadata', function(e) {
            G_sampleURL = e.target.src;
            G_videoWidth = e.target.videoWidth;
            G_videoHeight = e.target.videoHeight;
            G_videoDuration = e.target.duration;
            G_videoQuality = G_videoQuality || G_videoHeight;
            if (onLoadFunc && (typeof onLoadFunc).toLowerCase() == 'function') onLoadFunc();
            if (forceLoad) e.target.remove();
        });
        element.addEventListener('error', function(e) {
            if (onErrorFunc && (typeof onErrorFunc).toLowerCase() == 'function') onErrorFunc();
        });
        // --------------------------------------------------------------------------------
        element.setAttribute('muted', 'muted');
        element.setAttribute('autoplay', '');
        // --------------------------------------------------------------------------------
        element.setAttribute('src', G_sampleURL);
        // --------------------------------------------------------------------------------
        if (forceLoad) {
            element.setAttribute('controls', '');
            let funcToTest = function() {return element.currentSrc && element.currentSrc !== ''};
            let funcToRun = function() {
                if (typeof element !== 'undefined' && typeof element.play == 'function' && element.paused) {
                    element.play();
                };
            };
            waitForCondition(funcToTest, funcToRun, 50, 5*10, []);
        };
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_previewURL;
    var G_embedCodeText, G_contentTitle, G_altText, G_delimiter; function updateEmbedCodeText(embedCodeTextArea, startNew = 0, delimiter = '') {
        G_posterURL = fixURLProtocol(G_posterURL)
        // G_contentTitle = G_contentTitle ? G_contentTitle : document.title.replace(/^.{1} /i, '').capitalize();
        // --------------------------------------------------------------------------------
        if (G_embedCodeText && !startNew) G_embedCodeText += '\n<div class="thumbnail"'; else G_embedCodeText = '<div class="thumbnail"';
        G_embedCodeText += ' data-title="' + G_contentTitle + '"';
        if (G_posterURL && G_posterURL !== G_contentURL) G_embedCodeText += ' data-image="' + G_posterURL + '"';
        if (G_previewURL) G_embedCodeText += ' data-video="' + G_previewURL + '"';
        G_embedCodeText += ' data-content="' + G_contentURL + '"';
        G_embedCodeText += ' data-url="' + G_pageURL + '"';
        if (G_altText) G_embedCodeText += ' alt="' + G_altText + '"';
        if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality="' + G_videoWidth + 'x' + G_videoHeight + '"';
        if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality-limit="' + 1080 + '"';
        if (G_videoDuration) {
            let videoDuration = G_videoDuration;
            console.log('G_videoDuration:', videoDuration);
            if (!(videoDuration+'').match(':')) videoDuration = toHHMMSS(videoDuration);
            G_embedCodeText += ' data-duration="' + videoDuration + '"';
        };
        if (G_embedCodeTextStart && G_embedCodeTextStart !== '00:00:00') {
            G_embedCodeText += ' data-start="' + G_embedCodeTextStart + '"';
        };
        G_embedCodeTextCategorie = G_embedCodeTextCategorie.trim().
        replace(/\s+,/g, ',').
        replace(/,\s+/g, ',').
        replace(/,+/g, ',').
        replace(/^,/g, '').
        replace(/,$/g, '').
        replace(/,/g, ', ')
        ;
        G_embedCodeText += ' data-categories="all,' + (G_embedCodeTextCategorie.length > 0 ? ' ' + G_embedCodeTextCategorie : '') + '"';
        G_embedCodeText += '></div>';
        // --------------------------------------------------------------------------------
        embedCodeTextArea.value = delimiter ? delimiter + G_embedCodeText : G_embedCodeText;
        // --------------------------------------------------------------------------------
        return G_embedCodeText;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodePosterSelector, G_postersArray = [], G_postersArrayStyle = document.createElement('style');
    G_postersArrayStyle.type = 'text/css'; document.getElementsByTagName('head')[0].appendChild(G_postersArrayStyle);
    function updatePostersArrayStyle() {
        const parentID = 'uniqueEmbedCodePosterSelector';
        if (!document.querySelectorAll('#' + parentID) || !G_postersArrayStyle) return;
        const posterURL = G_embedCodePoster.src.replace(/^.*?:/, '');
        const css = [
            'border-color: red;',
            'border-width: 6px;',
            'border-style: double;',
            'box-sizing: content-box;',
        ].join('\n\t');
        G_postersArrayStyle.innerHTML = `#${parentID} > img[src*="${posterURL}"] {${css}}`
    };
    function addEmbedCodePosterSelector(URLArray) {
        console.log('G_embedCodePosterSelector --> URLArray:', URLArray);
        URLArray = URLArray.unique();
        if (URLArray.length > 0) {
            let justRefresh = false;
            let elementID = 'uniqueEmbedCodePosterSelector';
            for (let element of document.querySelectorAll('#' + elementID)) {element.remove(); justRefresh = true;};
            // --------------------------------------------------------------------------------
            let element = document.createElement('div');
            element.setAttribute('id', elementID);
            (document.querySelector('uniqueEmbedCodeFrame') || G_embedCodeFrame).appendChild(element);
            function updateMainPoster(e) {
                let img = e.target;
                G_posterURL = img.getAttribute('src');
                updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                G_embedCodePoster.setAttribute('src', G_posterURL);
                resizeEmbedCodePoster(1.0, 0.5, 5000);
                updatePostersArrayStyle();
            };
            let imageStyle = G_embedCodePoster.getAttribute('style');
            imageStyle = 'display: inline-block !important; vertical-align: inherit; max-height: 120px; width: auto; height: auto; min-width: auto; min-height: 162px; zoom: 0.5;';
            let imageIndex = URLArray[0] ? 0 : 1;
            let loadImage = function() {
                let img = document.createElement('img');
                img.setAttribute('style', imageStyle);
                img.style.zoom = 0.5;
                img.setAttribute('src', URLArray[imageIndex]);
                img.setAttribute('onerror', 'this.remove();');
                /*G_embedCodeFrame*/ element.appendChild(img);
                img.addEventListener('click', updateMainPoster.bind(this), false);
                if (imageIndex < URLArray.length) {
                    img.addEventListener('load', function(){
                        imageIndex++;
                        loadImage();
                    }, false);
                };
                // console.log(URLArray[imageIndex], img);
                return img;
            };
            loadImage();
            //
            if (!justRefresh) {
                G_embedCodePoster.style.position = 'fixed';
                G_embedCodePoster.style.bottom = '10px';
                G_embedCodePoster.style.right = '10px';
                G_embedCodePoster.style.zIndex = '2147483647';
            };
            //
            G_embedCodePosterSelector = element;
            return element;
        };
    }
    // ================================================================================
    var G_noPlayerExtension = false, G_triesReCastMult = 2, /*G_progressThumbnailSrc,*/ G_standartReCastFunc = function() {
        console.log('G_standartReCastFunc:', G_pageURL);
        let media = G_funcResult, contentURL = G_contentURL ? G_contentURL : media.src;
        if (!contentURL.match(/^http/) && !contentURL.match(/^[/]/)) contentURL = (location.protocol + '//' + G_pageDomain) + G_contentURL;
        else if (contentURL.match(/^\/\//)) contentURL = location.protocol + G_contentURL;
        else if (contentURL.match(/^\//)) contentURL = (location.protocol + '//' + G_pageDomain) + G_contentURL;
        console.log('contentURL: ', contentURL);
        G_funcToRun = function() {
            let mediaData = {};
            mediaData.url = G_pageURL;
            mediaData.src = contentURL;
            mediaData.poster = G_posterURL;
            mediaData.refined = refineVideo(contentURL, G_noPlayerExtension);
            mediaData.width = media.videoWidth;
            mediaData.height = media.videoHeight;
            mediaData.duration = media.duration;
            if (G_allData) {
                mediaData.json = encodeURIComponent(JSON.stringify(G_allData)); //encodeURI(JSON.stringify(G_allData));
                // console.log(JSON.stringify(G_allData), mediaData.json, decodeURIComponent(mediaData.json)); alert(JSON.stringify(G_allData) == decodeURIComponent(mediaData.json));
                let symbol = mediaData.refined.match(/[?]/) ? '&' : '?';
                mediaData.refined = mediaData.refined + symbol + 'jjs=' + mediaData.json;
            };
            // alert(mediaData.json);
            // alert(mediaData.refined);
            if (window.top === window.self) {
                window.parent.postMessage(Object.assign({sender: 'ANSWER'}, mediaData), '*');
            }
            else {
                window.parent.postMessage(Object.assign({sender: 'ANSWER'}, mediaData), '*');
                openURL(mediaData.refined);
            };
        };
        G_funcToRun();
    };
    // ================================================================================
    function updateEmbedCodeTextColor() {
        let quality = (G_videoWidth && G_videoHeight) ? ((G_videoWidth * G_videoHeight) / (1920 * 1080)) : (G_videoQuality / 1080);
        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        G_embedCodeTextAreaColor = valToColor(quality * 100, 1, 1.0, 0, 100, 1);
        G_embedCodeTextArea.style.color = G_embedCodeTextAreaColor;
        log(G_debugMode, G_embedCodeTextAreaColor);
        // new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+Array(1e3).join(123)).play();
        // let A, o = (A = new AudioContext()).createOscillator(); o.connect(A.destination); o.start(0); setTimeout(function(){o.stop(0)}, 200);
        msgbox('Video', (G_videoWidth + ' x ' + G_videoHeight) + '\n' + (G_sampleURL || G_pageURL).replace(/.*?:\/\/(.*?)\/.*/, '$1'), 3000);
        // --------------------------------------------------------------------------------
        G_embedCodePoster.style.borderColor = G_embedCodeTextAreaColor;
        G_embedCodePoster.style.borderWidth = '2px';
        G_embedCodePoster.style.borderStyle = 'dashed';
        G_embedCodePoster.style.zoom = 1.0;
        resizeEmbedCodePoster(1.0, 0.5, 5000);
    };
    // ================================================================================
    var G_noQualitySample = false, G_qualitySampleSource = null, G_qualitySampleLastSrc = null, G_actorsSource = [], G_categoriesSource = [], G_standartAddEmbedCodeFunc = function() {
        // --------------------------------------------------------------------------------
        for (let a of G_actorsSource) {let s = 'M:' + a.innerText.trim(); G_categories[s] = '';};
        for (let a of G_categoriesSource) {let s = a.innerText.trim(); G_categories[s] = '';};
        G_contentTitle = G_contentTitle ? G_contentTitle : document.title.replace(/^.{1} /i, '').capitalize();
        G_delimiter = ''; // '<!-- ' + G_contentTitle + ' -->\n';
        G_embedCodeFrame = addEmbedCodeFrame(G_funcToRun);
        G_embedCodeCatInput = addEmbedCodeCatInput(G_embedCodeFrame);
        G_embedCodeStartInput = addEmbedCodeStartInput(G_embedCodeFrame);
        G_embedCodeImageInput = addEmbedCodeImageInput(G_embedCodeFrame);
        G_embedCodeTextArea = addEmbedCodeTextArea(G_embedCodeFrame);
        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        G_embedCodeLink = addEmbedCodeLink(G_embedCodeFrame);
        G_embedCodePoster = addEmbedCodePoster(G_embedCodeFrame, G_funcToRun);
        if (G_qualitySampleSource) {
            // document.querySelector('#EPvideo_html5_api').addEventListener('play', function(e) {
            function updateValues(e) {
                setTimeout(() => {
                    let changed = 0;
                    if (G_qualitySampleLastSrc == e.target.currentSrc && !e.target.currentSrc.includes('blob:')) return;
                    G_qualitySampleLastSrc = e.target.currentSrc;
                    G_sampleURL = e.target.currentSrc;
                    //if (G_videoWidth && G_videoHeight) {
                    if ((e.target.videoWidth * e.target.videoHeight) > (G_videoWidth * G_videoHeight)) {
                        G_videoWidth = e.target.videoWidth;
                        G_videoHeight = e.target.videoHeight;
                        changed = 1;
                    };
                    // console.log(e.target.readyState, e.type, e.target.videoHeight);
                    // console.log(e.target.duration, G_videoDuration, e.target.duration === G_videoDuration);
                    if (G_videoDuration !== e.target.duration) {
                        G_videoDuration = e.target.duration;
                        changed = 1;
                    };
                    if (changed === 1) {
                        G_videoQuality = G_videoHeight;
                        updateEmbedCodeTextColor();
                    };
                }, 250);
            };
            G_qualitySampleSource.addEventListener('playing', updateValues);
            G_qualitySampleSource.addEventListener('canplay', updateValues);
            G_qualitySampleSource.addEventListener('durationchange', updateValues);
            G_qualitySampleSource.addEventListener('loadedmetadata', updateValues);
            G_qualitySampleSource.addEventListener('loadeddata', updateValues);
        }
        else {
            if (G_sampleURL && !G_noQualitySample) {
                G_embedCodeVideo = addEmbedCodeVideo(G_embedCodeFrame, G_funcToRun, function onLoadFunc() {
                    updateEmbedCodeTextColor();
                }, function onErrorFunc() {
                    log(G_debugMode, 'G_embedCodeVideo: onErrorFunc');
                    updateEmbedCodeTextColor();
                }, G_forceLoad);
            };
        }
        addKeyComboCtrlC(G_embedCodeTextArea, 1, 0);
        if (G_postersArray && G_postersArray.length > 0) G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
        // --------------------------------------------------------------------------------
        log(G_debugMode, G_contentURL, '\n', G_sampleURL, '\n', G_posterURL);
    };
    // ================================================================================
    // getCookie(), setCookie(), deleteCookie() -- https://gist.github.com/akaramires/7577298
    function getCookie(name) { // возвращает cookie если есть или undefined
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };
    // --------------------------------------------------------------------------------
    // Аргументы:
    // name - название cookie
    // value - значение cookie (строка)
    // props - Объект с дополнительными свойствами для установки cookie:
    // expires - Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
    // - Если число - количество секунд до истечения.
    // - Если объект типа Date - точная дата истечения.
    // - Если expires в прошлом, то cookie будет удалено.
    // - Если expires отсутствует или равно 0, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
    // path - Путь для cookie.
    // domain - Домен для cookie.
    // secure - Пересылать cookie только по защищенному соединению.
    // --------------------------------------------------------------------------------
    function setCookie(name, value, props) { // уcтанавливает cookie
        props = props || {};
        let exp = props.expires;
        if (typeof exp == "number" && exp) {
            let d = new Date();
            d.setTime(d.getTime() + exp*1000);
            exp = props.expires = d;
        };
        if (exp && exp.toUTCString) props.expires = exp.toUTCString();
        value = encodeURIComponent(value)
        for (let propName in props) {if (propName == name) props[propName] = value;};
        let updatedProps = {}; for (let propName in props) {
            if (!updatedProps[propName]) updatedProps[propName] = props[propName];
        };
        let updatedCookie = ''; for (let propName in updatedProps) {
            updatedCookie += (propName + '=' + updatedProps[propName] + "; ");
        };
        document.cookie = updatedCookie.trim();
    };
    // --------------------------------------------------------------------------------
    function deleteCookie(name) { // удаляет cookie
        setCookie(name, null, { expires: -1 });
    };
    // ================================================================================
    function setCategory(category) {
        let result;
        if (typeof category == 'undefined') {
            category = GM_getValue('category', '');
            result = prompt('Category', category || '');
            if (result === null) {
                return;
            };
            GM_setValue('category', result);
            G_embedCodeTextCategorie = result;
            G_embedCodeCatInput.value = G_embedCodeTextCategorie;
            eventFire(G_embedCodeCatInput, 'change');
        }
        else {
            result = category;
            GM_setValue('category', result);
        };
    };
    GM_registerMenuCommand('Set Category', function(){setCategory();}, "");
    let updateVal = function(e) {setCategory(G_embedCodeCatInput.value);};
    function toggleSaveCategories() {
        let save_categories = !GM_getValue('save_categories', false) || false;
        G_embedCodeCatInput.removeEventListener('change', updateVal);
        if (save_categories) {
            G_embedCodeCatInput.style.color = 'cornflowerblue';
            G_embedCodeCatInput.addEventListener('change', updateVal);
            updateVal();
        }
        else {
            G_embedCodeCatInput.style.color = 'grey';
            setCategory('');
        };
        GM_setValue('save_categories', save_categories);
    };
    GM_registerMenuCommand('Toggle Save Category', function() {
        toggleSaveCategories();
    }, "");
    function initSaveCategories(input) {
        let save_categories = GM_getValue('save_categories', false) || false;
        input.removeEventListener('change', updateVal);
        if (save_categories) {
            input.style.color = 'cornflowerblue';
            input.addEventListener('change', updateVal);
        }
        else {
            input.style.color = 'grey';
            setCategory('');
        };
    };
    var G_messageTarget; GM_registerMenuCommand('Set Start Time', function(){
        if (!G_messageTarget) {
            return;
        }
        else if (G_messageTarget instanceof Element) {
            G_embedCodeTextStart = toHHMMSS(G_messageTarget.currentTime); // || '00:00:00';
            G_embedCodeStartInput.value = G_embedCodeTextStart;
            alert('G_messageTarget.currentTime: ' + G_embedCodeTextStart);
        }
        else {
            G_messageTarget = G_messageTarget || window.parent;
            G_messageTarget.postMessage({sender: 'QUESTION', data: null}, '*');
        };
    }, "");
    window.addEventListener('message', function(e) {
        if(typeof e.data === 'object' && e.data.sender === 'ANSWER' && e.data.currentTime) {
            G_embedCodeTextStart = toHHMMSS(e.data.currentTime); // || '00:00:00';
            alert('ANSWER.data.currentTime: ' + G_embedCodeTextStart);
            G_embedCodeStartInput.value = G_embedCodeTextStart;
            // console.log('received in script ' + me +': ', e.data.data);
        }
        else if(typeof e.data === 'object' && e.data.sender === 'ANSWER' && e.data.src) {
            if (G_pageURL.matchLink('#ReCast')) {
                console.log('e.data:',e.data);
                if (window.opener) {
                    window.opener.postMessage(e.data, '*');
                    window.close();
                };
            }
            else if (G_pageURL.matchLink('file:///*/2.*.*.html')) {
                let outputs = document.getElementById('content');
                if (outputs) {
                    let iframeOutput = outputs.querySelector('#content_iframe');
                    if (iframeOutput.style.display == 'block') {iframeOutput.src = e.data.refined;};
                };
            }
            else {
                G_sampleURL = e.data.src;
                G_videoWidth = e.data.width;
                G_videoHeight = e.data.height;
                G_videoDuration = e.data.duration;
                // G_posterURL = e.data.poster;
                // alert(G_posterURL);
                if (!G_embedCodeFrame) return;
                G_embedCodeVideo = addEmbedCodeVideo(G_embedCodeFrame, G_funcToRun, function onLoadFunc() {
                    updateEmbedCodeTextColor();
                    if (e.data.poster) {
                        if (!G_postersArray.includes(e.data.poster)) {
                            G_postersArray = G_postersArray.concat([e.data.poster]).unique();
                            if (G_postersArray && G_postersArray.length > 0) G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
                            let currentSrc = G_embedCodePoster.getAttribute('src');
                            if ( currentSrc == '' || currentSrc.match('/vk.com/images/video/thumbs/video_l.png')) {
                                G_embedCodePoster.setAttribute('src', e.data.poster);
                                G_posterURL = e.data.poster;
                                updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                            };
                        }
                    };
                }, function onErrorFunc() {
                    log(G_debugMode, 'G_embedCodeVideo: onErrorFunc');
                    updateEmbedCodeTextColor();
                    //                     if (G_posterURL) {
                    //                         if (!G_postersArray.includes(e.data.poster)) {
                    //                             G_postersArray = G_postersArray.concat([e.data.poster]).unique();
                    //                             if (G_postersArray && G_postersArray.length > 0) G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
                    //                         }
                    //                     };
                }, G_forceLoad);
            };
        };
    });
    // ================================================================================
    if (
        G_pageURL.matchLink('file:///*/2.*.*.html')
    ) {
        return
    };
    // ================================================================================
    if (
        G_pageURL.matchLink('https?://www.eporner.com') ||
        G_pageURL.matchLink('https?://www.eporner.eu')
    ) {
        if (
            G_pageURL.matchLink('https?://www.eporner.com/hd-porn/*/*/') || // https://www.eporner.com/hd-porn/uCS7LAWJ70b/TUSHY-Keisha-Grey-Anal-Stretching-And-Gapes/
            G_pageURL.matchLink('https?://www.eporner.eu/hd-porn/*/*/')
        ) {
            G_funcToRun = function() {
                G_contentURL = document.querySelector('#embright > .textare1 > textarea').value.match(/.*src="(.*?)".*/i)[1]; // https://www.eporner.com/embed/uCS7LAWJ70b
                G_posterURL = G_posterURL ? G_posterURL : document.querySelector('meta[property="og:image"]').content;
                G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*eporner.com\/thumbs\/.*)\/\d+_(\d+).jpg/i, '$1/$NUM_$2.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('#relateddiv'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_qualitySampleSource = document.querySelector('#EPvideo_html5_api');
                // https://static-eu-cdn.eporner.com/thumbs/static4/1/11/110/1101004/10_240.jpg
                // https://static-eu-cdn.eporner.com/thumbs/static4/1/11/110/1101004/1101004-preview.mp4
                G_previewURL = G_posterURL.replace(/^(.*\/(\d+))\/\d+_\d+\.jpg/, '$1/$2-preview.mp4'); // https://static-eu-cdn.eporner.com/thumbs/static4/1/11/110/1101004/1101004-preview.mp4
                G_actorsSource = document.querySelectorAll('.vit-pornstar > a');
                G_categoriesSource = document.querySelectorAll('.vit-category > a, .vit-tag > a');
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div[aria-label="Video Player"]');
                    media = media ? media : document.querySelector('video#EPvideo_html5_api');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
                // --------------------------------------------------------------------------------
                let maxQuality = 0, menuItem;
                for (let item of document.querySelectorAll('.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-icon-hd')) {
                    let button = item.querySelector('.vjs-menu-item-text');
                    let text = button ? button.innerText : '';
                    let match = text.match(/^(\d+)p\b.*$/);
                    if (match) {
                        let buttonQuality = Number(match[1]);
                        if (buttonQuality > maxQuality) {
                            maxQuality = buttonQuality;
                            menuItem = button;
                        };
                        console.log(text, button, buttonQuality);
                    };
                };
                // alert(maxQuality);
                // --------------------------------------------------------------------------------
                if (menuItem) {
                    if (G_qualitySampleSource.paused) G_qualitySampleSource.play();
                    menuItem.click();
                    setTimeout(function(){menuItem.click();}, 100);
                }
                // --------------------------------------------------------------------------------
                // setTimeout(function() {if (!G_qualitySampleSource.paused) G_qualitySampleSource.pause();}, 2500);
            };
            document.addEventListener('DOMContentLoaded', function(e) {
                // waitForElement('#EPvideo_html5_api', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
                waitForElement('.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-icon-hd .vjs-menu-item-text', 'innerText', G_funcToRun, G_delay, G_tries, G_timerGroup);
            }, false);
        }
        else if (
            G_pageURL.matchLink('https?://www.eporner.com/embed/*') || // https://www.eporner.com/embed/uCS7LAWJ70b
            G_pageURL.matchLink('https?://www.eporner.eu/embed/*')
        ) {
            G_funcToTest = function () {
                return document.querySelector('body video[src]'); // && document.querySelector('head > meta[itemprop="contentUrl"][content]');
            };
            G_funcToRun = function() {
                // --------------------------------------------------------------------------------
                let maxQuality = 0, menuItem;
                let buttonData = {};
                for (let item of document.querySelectorAll('.vjs-menu-content > .vjs-menu-item')) {
                    let button = item.querySelector('.vjs-menu-item-text');
                    let text = button ? button.innerText : '';
                    let matched = text.match(/(\d+)/);
                    if (matched) {
                        let buttonQuality = Number(matched[1]);
                        buttonData[String(buttonQuality)] = item;
                    };
                };
                let video = document.querySelector('body video'), src = video.currentSrc;
                let keys = Object.keys(buttonData), maxIndex = keys.length-1;
                for (let item of keys) {
                    let quality = Number(item);
                    let button = buttonData[String(quality)];
                    if (quality > maxQuality && quality < G_qualityLimit) {
                        maxQuality = quality;
                        menuItem = button;
                    };
                };
                let data = {}, index = 0;
                video.addEventListener('loadstart', function(e){
                    let media = e.target;
                    let src = media.currentSrc;
                    let match = src.match(/(\d+)p\.mp4/); // https://s15-n5-nl-cdn.eporner.com/403e70468a1f8d51c1d77daae18a3043/5ebf2186010600/1101004-480p.mp4
                    if (match) {
                        let quality = Number(match[1]);
                        let key = String(quality);
                        if (!data[key]) {
                            data[key] = src;
                            index++;
                            if (index <= maxIndex + 1) {
                                if (index <= maxIndex) {
                                    let button = buttonData[String(keys[index])];
                                    if (button) button.click();
                                }
                                else if (index == maxIndex + 1) {
                                    console.log('data:', data);
                                    // --------------
                                    G_allData = data;
                                    G_contentURL = G_allData[String(maxQuality)];
                                    // alert(maxQuality + ' : ' + G_contentURL);
                                    log(G_debugMode, 'G_contentURL:', G_contentURL);
                                    // --------------
                                    let refinedURL = refineVideo(G_contentURL);
                                    if (G_allData) {
                                        let jsonData = encodeURIComponent(JSON.stringify(G_allData));
                                        let symbol = refinedURL.match(/[?]/) ? '&' : '?';
                                        refinedURL = refinedURL + symbol + 'jjs=' + jsonData;
                                    };
                                    // openURL(refineVideo(contentURL));
                                    openURL(refinedURL);
                                    // --------------
                                };
                            };
                        };
                    };
                    console.log(e.target.currentSrc);
                });
                video.src = location.pathname;
                let button = buttonData[String(keys[index])];
                // alert(button);
                button.click();
                return;
                // --------------------------------------------------------------------------------
                if (menuItem) menuItem.click();
                // --------------------------------------------------------------------------------
                // let video = document.querySelector('body video'), src = video.currentSrc;
                if (src.match('blob:')) {
                    let content = ''; // document.querySelector('head > meta[itemprop="contentUrl"]').content;
                    video.src = content;
                    // setTimeout(function() {
                    waitForCondition(
                        // function() {return video.currentSrc != content;},
                        function() {return !video.currentSrc.match('blob:') && video.currentSrc != content;},
                        function() {
                            G_contentURL = video.currentSrc;
                            // alert(G_contentURL);
                            log(G_debugMode, 'G_contentURL:', G_contentURL);
                            openURL(refineVideo(G_contentURL));
                        }, G_delay, G_tries, G_timerGroup
                    );
                    // }, 250);
                }
                else {
                    G_contentURL = video.currentSrc;
                    log(G_debugMode, 'G_contentURL:', G_contentURL);
                    openURL(refineVideo(G_contentURL));
                };
                // --------------------------------------------------------------------------------
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.4tube.com')
    ) {
        if (
            G_pageURL.matchLink('https?://www.4tube.com/videos/*/*')
        ) {
            G_funcToRun = function() {
                let header = document.querySelector('.player');
                let iframe_id = 'thumbs';
                let iframe = document.querySelector('iframe#' + iframe_id);
                function checkIframeContent(iframe) {
                    let win = iframe.contentWindow;
                    let selector = '.thumb-link[href="'+ location.pathname + '"]'; // /v/232270580
                    let matched = win.document.querySelector(selector);
                    if (matched) {
                        let main_poster = matched.querySelector('li[data-src]');
                        if (main_poster) {
                            G_postersArray = [];
                            for (let item of matched.querySelectorAll('li[data-src]')) {
                                if (item) {G_postersArray.push(item.dataset.src);};
                            };
                            console.log('G_posters:\n', G_postersArray);
                            G_posterURL = G_posterURL ? G_posterURL : main_poster.dataset.src;
                            G_embedCodeImageInput.value = G_posterURL;
                            G_embedCodePoster.src = G_posterURL;
                            G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
                            iframe.remove();
                        };
                    };
                };
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = iframe_id;
                    iframe.onload = function(){checkIframeContent(iframe);};
                    header.appendChild(iframe);
                };
                iframe.setAttribute('target', '_self');
                iframe.setAttribute('sandbox', 'allow-same-origin');
                iframe.src = 'https://www.4tube.com/search?q=' + document.querySelector('meta[itemprop="name"]').content.replace(/\s+/g, '+');
                // --------------------------------------------------------------------------------
                G_contentURL = document.querySelector('meta[itemprop="embedUrl"]').content;
                G_posterURL = G_posterURL ? G_posterURL : document.querySelector('meta[itemprop="thumbnailUrl"]').content;
                G_stickTo = document.querySelector('.player'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_sampleURL = document.querySelectorAll('video#html5Videokodplayer_html5_api > source, video#html5Videokodplayer_html5_api')[0].src;
                G_actorsSource = document.querySelectorAll('.pornlist a[href*="/pornstars/"] > span');
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div.player');
                    media = media ? media : document.querySelector('video#html5Videokodplayer_html5_api');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('video#html5Videokodplayer_html5_api', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://www.4tube.com/embed/*') // https://www.4tube.com/embed/342362
        ) {
            /* globals playerloadb */
            G_funcToTest = function () {return typeof playerloadb !== 'undefined';};
            G_funcToRun = function() {
                window.stop();
                // G_contentURL = document.querySelectorAll('body video > source, body video')[0].src;
                let keys = Object.keys(playerloadb.availableRes);
                let maxRes = keys[keys.length-2];
                G_contentURL = playerloadb.availableRes[maxRes][0].src;
                log(G_debugMode, 'G_contentURL:', G_contentURL);
                openURL(refineVideo(G_contentURL));
                // --------------------------------------------------------------------------------
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://redtube.com') ||
        G_pageURL.matchLink('https?://*.redtube.com')
    ) {
        if (
            location.pathname.match(/^\/\d+/)
        ) {
            /* globals page_params */
            let maxQuality = 0, videoData = {};
            G_funcToTest = function () {
                const player = document.querySelector('#redtube-player');
                if (player) {
                    let playerID = player.dataset.videoId;
                    playerID = playerID ? playerID : document.querySelector('link[hreflang="x-default"]').href;
                    playerID = playerID ? playerID : location.pathname.replace(/^\/(\d+).*/, '$1');
                    if (page_params && page_params.video_player_setup) {
                        const playerVars = page_params.video_player_setup['playerDiv_' + playerID].playervars;
                        const keys = Object.keys(playerVars);
                        for (let keyName of keys) {
                            let match = keyName.match(/^quality_(\d+)p?$/);
                            if (match) {
                                let quality = parseInt(match[1]);
                                if (quality > maxQuality) {
                                    maxQuality = quality;
                                    videoData.key = match[0];
                                };
                            };
                        };
                        // console.log('maxQuality:', maxQuality);
                        const maxQualitySrc = playerVars[videoData.key];
                        if (maxQualitySrc) {
                            videoData.src = maxQualitySrc;
                            videoData.quality = maxQuality;
                            return maxQualitySrc;
                        };
                    };
                };
            };
            G_funcToRun = function() {
                G_contentURL = document.querySelector('link[hreflang="x-default"]').href;
                G_posterURL = G_posterURL ? G_posterURL : document.querySelector('meta[property="og:image"]').content;
                G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*)\/\d+.(jpe?g)/i, '$1/$NUM.$2', 1, 20); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelectorAll('#video_underplayer, #redtube-player')[0]; G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_sampleURL = videoData.src;
                G_actorsSource = document.querySelectorAll('.video-infobox-content > .pornstar-name > a[href*="/pornstar/"]');
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div#redtube-player');
                    media = media ? media : document.querySelector('div#redtube-player video');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }
    // ================================================================================

    else if (
        G_pageURL.matchLink('https?://(e\.)?yespornplease.com')
    ) {
        if (G_pageHost == 'e.yespornplease.com') {location.host = 'yespornplease.com';} // https://e.yespornplease.com/v/235160374
        else if (
            G_pageURL.matchLink('https?://yespornplease.com/view/*') // https://yespornplease.com/view/306756151
        ) {
            window.stop();
            location.replace(G_pageURL.replace('/view/', 'v').replace('[?].*', '')); // window.location.href = G_pageURL.replace('/view/', 'v').replace('[?].*', '');
        }
        else if (G_pageURL.match('#ReCast')) {
            return;
        }
        else if (
            G_pageURL.matchLink('https?://yespornplease.com/v/*') // https://yespornplease.com/v/306756151
        ) {
            G_funcToRun = function() {
                let header = document.querySelector('.nav.nav-tabs');
                let iframe_id = 'thumbs';
                let iframe = document.querySelector('iframe#' + iframe_id);
                function checkIframeContent(iframe) {
                    let win = iframe.contentWindow;
                    let selector = '.video-link[href="'+ location.pathname + '"]'; // /v/232270580
                    let matched = win.document.querySelector(selector);
                    if (matched) {
                        let main_poster = matched.querySelector('.img-responsive');
                        if (main_poster) {
                            G_posterURL = main_poster.src;
                            G_embedCodeImageInput.value = G_posterURL;
                            G_embedCodePoster.src = G_posterURL;
                            iframe.remove();
                        };
                    };
                };
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = iframe_id;
                    iframe.onload = function(){checkIframeContent(iframe);};
                    header.appendChild(iframe);
                };
                iframe.src = 'https://yespornplease.com/search?q=' + document.querySelector('.container .pull-left .hidden-xs').innerText;
                // --------------------------------------------------------------------------------
                G_contentURL = document.querySelector('iframe').src.replace(/\/width-\d+\/height-\d+\//i, '/width-882/height-496/');
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]').content
                );
                G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/i3.yespornplease.com/'); // '/i3.yespornplease.com/'
                G_postersArray = CreateLinksList(G_posterURL, /^(https:\/\/)?(.*yespornplease.com)\/(\d+\/.*?\/\d+x\d+)_\d+.jpg/i, location.protocol + '//$2/$3_$NUM.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_previewURL = G_posterURL.replace(/^(.*)\/\d+x\d+_\d+\.jpg/, '$1/video.mp4'); // https://i3.yespornplease.com/201906/bcrdnlu/video.mp4
                G_stickTo = document.querySelector('.container > .row'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_categoriesSource = document.querySelectorAll('.video-tags > a');
                G_standartAddEmbedCodeFunc();
                G_messageTarget = document.querySelector('iframe').contentWindow;
            };
            waitForElement('#video_embed_code', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://vshare.io/v/*/width-*/height-*/*')
    ) {
        // window.stop();
        G_noPlayerExtension = true;
        G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
        waitForElement('body video > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
    }
    // ================================================================================

    else if (
        G_pageURL.matchLink('https?://*.trendyporn.com')
    ) {
        if (G_pageURL.match('#ReCast')) {
            return;
        }
        else if (
            G_pageURL.matchLink('https?://videos.trendyporn.com/videos/*') // https://videos.trendyporn.com/videos/5/c/6/2/8/5c628f7518412-vixen-19-1-19-ellie-leen.mp4
        ) {
            window.stop();
            let contentURL = location.href;
            console.log('contentURL: ', contentURL);
            openURL(refineVideo(contentURL));
        }
        else if (
            location.pathname.match(/^\/video\//) // https://www.trendyporn.com/video/familystrokes-leda-lothario-twin-stepbrothers-cum-on-ledas-face-10586.html
        ) {
            G_funcToRun = function() {
                /*
                let header = document.querySelector('.nav.nav-tabs');
                let iframe_id = 'thumbs';
                let iframe = document.querySelector('iframe#' + iframe_id);
                function checkIframeContent(iframe) {
                    let win = iframe.contentWindow;
                    let selector = '.video-link[href="'+ location.pathname + '"]'; // /v/232270580
                    let matched = win.document.querySelector(selector);
                    if (matched) {
                        let main_poster = matched.querySelector('.img-responsive');
                        if (main_poster) {
                            G_posterURL = main_poster.src;
                            G_embedCodeImageInput.value = G_posterURL;
                            G_embedCodePoster.src = G_posterURL;
                            iframe.remove();
                        };
                    };
                };
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = iframe_id;
                    iframe.onload = function(){checkIframeContent(iframe);};
                    header.appendChild(iframe);
                };
                iframe.src = 'https://www.trendyporn.com/search/' + document.querySelector('.container .pull-left .hidden-xs').innerText + '/';
                */
                // --------------------------------------------------------------------------------
                G_contentURL = document.querySelectorAll('#player_html5_api[src], #player_html5_api > source[src]')[0].src;
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]').content
                );
                G_postersArray = CreateLinksList(G_posterURL, /^(.*)\d+(.*?).jpg/i, '$1$NUM.jpg', 1, 10); console.log('G_posters:\n', G_postersArray);
                G_previewURL = /*G_posterURL*/ location.pathname.replace(/^.*-(.+)\.html/, 'https://images.trendyporn.com/webm/$1/$1.webm'); // https://images.trendyporn.com/webm/6032/6032.webm
                G_sampleURL = document.querySelectorAll('#player_html5_api[src], #player_html5_api > source[src]')[0].src;
                G_stickTo = document.querySelector('#player-container'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_categoriesSource = document.querySelectorAll('.video-tags > a');
                G_standartAddEmbedCodeFunc();
            };
            waitForElement('#player_html5_api[src], #player_html5_api > source[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }
    // ================================================================================

    else if (
        G_pageURL.matchLink('https?://www.porntrex.com/*')
    ) {
        // https://www.porntrex.com/models/Brooklyn%20Gray/hd/longest/
        if (location.pathname.match('%20')) {
            let newPath = location.pathname.replace(/%20/g, '-');
            location.pathname = newPath;
        };
        let show = function() {let css = document.querySelectorAll('head > style.hide-private');for (let s of css) {s.remove();};}
        let hide = function() {show(); addGlobalStyle('.video-preview-screen.video-item.thumb-item.private {display: none;}', 'hide-private');};
        function toggleShowPrivate() {
            let hidePrivate = GM_getValue('hidePrivate', false);
            if (hidePrivate) {
                show();
                GM_setValue('hidePrivate', false)
            }
            else {
                hide();
                GM_setValue('hidePrivate', true)
            };
        }
        let hidePrivate = GM_getValue('hidePrivate', false);
        if (hidePrivate) {hide();};
        GM_registerMenuCommand('Toggle Show Private', function(){toggleShowPrivate();}, '');
        addGlobalStyle('.inf a {color: red; font-size: 9px;}', 'style-1');
        addGlobalStyle('.block-video .video-holder {width: 100%;}', 'style-2');
        if (
            location.pathname.match(/^\/video\//)
        ) {
            /* globals flashvars */
            G_funcToTest = function () {
                return typeof flashvars !== "undefined" && flashvars.video_url;
            };
            function getMaxQualityURL(limit = 0) {
                let maxQuality = 0, contentURL;
                G_allData = {};
                for (let i = 5; i >= 0; i--) {
                    let k = (
                        i == 0 ? 'video_url' :
                        i == 1 ? 'video_alt_url' :
                        'video_alt_url' + i
                    );
                    let url = flashvars[k];
                    if (url) {
                        // url = url.replace(/\/$/, '');
                        // if (flashvars.rnd) url = url + setSearchParam('rnd', flashvars.rnd);
                        let quality = flashvars[k+'_text'];
                        if (quality) {
                            quality = quality.match(/^(\d+).*$/)[1];
                            quality = parseInt(quality);
                            G_allData[quality] = url;
                            if (quality > maxQuality) {
                                if (limit && quality > limit) continue;
                                // alert(quality);
                                maxQuality = quality;
                                contentURL = url;
                            };
                        };
                    };
                };
                return contentURL;
            };
            if (G_pageURL.match('#OnlyVideo')) { // https://www.porntrex.com/video/162636/kiera-winters-sex-queen-and-her-prince#OnlyVideo
                // window.stop();
                G_funcToRun = function () {
                    let contentURL = getMaxQualityURL(G_qualityLimit);
                    let posterURL = flashvars.preview_url;
                    console.log('contentURL: ', contentURL);
                    let refinedURL = refineVideo(contentURL);
                    if (G_allData) {
                        let jsonData = encodeURIComponent(JSON.stringify(G_allData));
                        let symbol = refinedURL.match(/[?]/) ? '&' : '?';
                        refinedURL = refinedURL + symbol + 'jjs=' + jsonData;
                    };
                    // openURL(refineVideo(contentURL));
                    openURL(refinedURL);
                };
                waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
            }
            else {
                localStorage.kvsplayer_selected_format = localStorage.kvsplayer_selected_format || '1080p HD';
                localStorage.kvsplayer_selected_format = localStorage.kvsplayer_selected_format || '720p HD';
                G_funcToRun = function () {
                    G_contentURL = G_shortURL + '#OnlyVideo';
                    G_sampleURL = getMaxQualityURL(0);
                    localStorage.kvsplayer_selected_format = flashvars.video_alt_url3 ? '1080p HD' : '720p HD';
                    G_forceLoad = true;
                    G_posterURL = G_posterURL ? G_posterURL : document.querySelector('.block-screenshots > a > img.thumb[src]').src;
                    G_posterURL = G_posterURL.replace('/statics.cdntrex.com/', '/' + location.host + '/');
                    // G_postersArray = CreateLinksList(G_posterURL, /^.*\/\/.*.com\/(contents\/videos_screenshots\/\d+\/\d+\/\d+x\d+)\/\d+.jpg/i, location.protocol+'//www.porntrex.com/$1/$NUM.jpg', 1, document.querySelectorAll(".thumb.lazy-load").length); // console.log('G_posters:\n', G_postersArray);
                    G_postersArray = CreateLinksList(G_posterURL, /\/((?:contents\/)?videos_screenshots\/\d+\/\d+(?:\/.*)?\/\d+x\d+)\/\d+.jpg/i, '/$1/$NUM.jpg', 1, document.querySelectorAll('.block-screenshots > a > img.thumb[src]').length); // console.log('G_posters:\n', G_postersArray);
                    let timeLineThumbsMaxIndex = 500; // (60 * 60) / (flashvars.timeline_screens_interval * 1); // flashvars.timeline_screens_interval * 1;
                    for (let i = 1; i <= timeLineThumbsMaxIndex; i++) {
                        //statics.cdntrex.com/contents/videos_screenshots/62000/62730/timelines/timeline_mp4/200x116/{time}.jpg
                        G_postersArray[G_postersArray.length] = flashvars.timeline_screens_url.
                        replace('{time}', i).replace('^.*?//statics.cdntrex.com/', location.origin+'/');
                    };
                    // https://www.porntrex.com/contents/videos_screenshots/62000/62730/300x168/1.jpg
                    // https://statics.cdntrex.com/contents/videos_screenshots/62000/62730/timelines/timeline_mp4/200x116/69.jpg
                    G_actorsSource = document.querySelectorAll('#tab_video_info a[href*="/models/"]');
                    G_stickTo = document.querySelector('div.video-info'); G_stickPosition = -1;
                    // --------------------------------------------------------------------------------
                    G_standartAddEmbedCodeFunc();
                    // --------------------------------------------------------------------------------
                    let eventCatcher, media;
                    let handleNewElements = function (e) {
                        let element = e.target;
                        // console.log('element.tagName:', element.tagName);
                        if (element.tagName == 'VIDEO') {
                            document.removeEventListener('DOMNodeInserted', handleNewElements, false);
                            // alert(element);
                            if (element == document.querySelector('.fp-player > video')) {
                                eventCatcher = eventCatcher ? eventCatcher : document.querySelector('.fp-player');
                                media = media ? media : element; // || eventCatcher;
                                // if (media) {media = media.parentNode};
                                mediaMouseControls(eventCatcher, media, 1);
                                G_messageTarget = media;
                            };
                        };
                    };
                    document.addEventListener('DOMNodeInserted', handleNewElements, false);
                };
                waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
            };
        }
    }

    else if (
        G_pageURL.matchLink('https?://www.ebalovo.pro/*')
    ) {
        if (
            location.pathname.match(/^\/video\//)
        ) {
            //* globals flashvars */
            G_funcToTest = function () {
                return typeof flashvars !== "undefined" && flashvars.video_url;
            };
            function getMaxQualityURL(limit = 0) {
                let maxQuality = 0, contentURL;
                G_allData = {};
                for (let i = 5; i >= 0; i--) {
                    let k = (
                        i == 0 ? 'video_url' :
                        i == 1 ? 'video_alt_url' :
                        'video_alt_url' + i
                    );
                    let url = flashvars[k];
                    if (url) {
                        url = url.replace(/\/$/, '');
                        if (flashvars.rnd) url = url + setSearchParam('rnd', flashvars.rnd);
                        let quality = flashvars[k+'_text'];
                        if (quality) {
                            quality = quality.match(/^(\d+).*$/)[1];
                            quality = parseInt(quality);
                            G_allData[quality] = url;
                            if (quality > maxQuality) {
                                if (limit && quality > limit) continue;
                                // alert(quality);
                                maxQuality = quality;
                                contentURL = url;
                            };
                        };
                    };
                };
                return contentURL;
            };
            if (G_pageURL.match('#OnlyVideo')) { // https://www.ebalovo.pro/video/fotomodel-obslujivaet-tolpu-chernokojih/#OnlyVideo
                // window.stop();
                G_funcToRun = function () {
                    let contentURL = getMaxQualityURL(G_qualityLimit);
                    let posterURL = flashvars.preview_url;
                    console.log('contentURL: ', contentURL);
                    let refinedURL = refineVideo(contentURL);
                    if (G_allData) {
                        let jsonData = encodeURIComponent(JSON.stringify(G_allData));
                        let symbol = refinedURL.match(/[?]/) ? '&' : '?';
                        refinedURL = refinedURL + symbol + 'jjs=' + jsonData;
                    };
                    // openURL(refineVideo(contentURL));
                    openURL(refinedURL);
                };
                waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
            }
            else {
                localStorage.kvsplayer_selected_format = localStorage.kvsplayer_selected_format || '1080p';
                localStorage.kvsplayer_selected_format = localStorage.kvsplayer_selected_format || '720p';
                G_funcToRun = function () {
                    G_contentURL = G_shortURL + '#OnlyVideo';
                    G_sampleURL = getMaxQualityURL(0);
                    localStorage.kvsplayer_selected_format = flashvars.video_alt_url3 ? '1080p' : '720p';
                    G_forceLoad = true;
                    G_posterURL = G_posterURL ? G_posterURL : document.querySelector('#tab_screenshots .screenshot > img[data-src]').dataset.src;
                    G_posterURL = G_posterURL.replace(/^(.*)?(\/\/.*\.\w+?)\//, location.protocol+'$2/');
                    // console.log(document.querySelectorAll("#tab_screenshots .screenshot > img[data-src]"), G_posterURL, G_posterURL.replace(/^.*\/\/.*\.\w+\/((?:contents\/)?videos_screenshots\/\d+\/\d+(?:\/.*)?\/\d+x\d+)\/\d+.jpg/i, location.origin+'/$1/$NUM.jpg'));
                    // https://img.ebacdn.com/videos_screenshots/49000/49734/timelines/mp4/160x90/26.jpg
                    console.log(G_posterURL);
                    G_postersArray = CreateLinksList(G_posterURL, /\/((?:contents\/)?videos_screenshots\/\d+\/\d+(?:\/.*)?\/\d+x\d+)\/\d+.jpg/i, '/$1/$NUM.jpg', 1, document.querySelectorAll("#tab_screenshots .screenshot > img[data-src]").length); console.log('G_posters:\n', G_postersArray);
                    console.log(G_posterURL);
                    let timeLineThumbsMaxIndex = 500; // (60 * 60) / (flashvars.timeline_screens_interval * 1); // flashvars.timeline_screens_interval * 1;
                    for (let i = 1; i <= timeLineThumbsMaxIndex; i++) {
                        //statics.cdntrex.com/contents/videos_screenshots/62000/62730/timelines/timeline_mp4/200x116/{time}.jpg
                        G_postersArray[G_postersArray.length] = flashvars.timeline_screens_url.
                        replace('{time}', i); //.replace('^.*?//statics.cdntrex.com/', location.origin+'/');
                    };
                    // https://www.porntrex.com/contents/videos_screenshots/62000/62730/300x168/1.jpg
                    // https://statics.cdntrex.com/contents/videos_screenshots/62000/62730/timelines/timeline_mp4/200x116/69.jpg
                    G_actorsSource = document.querySelectorAll('#tab_video_info a[href*="/models/"]');
                    G_stickTo = document.querySelector('div.video-info'); G_stickPosition = -1;
                    // --------------------------------------------------------------------------------
                    G_standartAddEmbedCodeFunc();
                    // --------------------------------------------------------------------------------
                    let eventCatcher, media;
                    let handleNewElements = function (e) {
                        let element = e.target;
                        // console.log('element.tagName:', element.tagName);
                        if (element.tagName == 'VIDEO') {
                            document.removeEventListener('DOMNodeInserted', handleNewElements, false);
                            // alert(element);
                            if (element == document.querySelector('.fp-player > video')) {
                                eventCatcher = eventCatcher ? eventCatcher : document.querySelector('.fp-player');
                                media = media ? media : element; // || eventCatcher;
                                // if (media) {media = media.parentNode};
                                mediaMouseControls(eventCatcher, media, 1);
                                G_messageTarget = media;
                            };
                        };
                    };
                    document.addEventListener('DOMNodeInserted', handleNewElements, false);
                };
                waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
            };
        }
    }

    else if (
        G_pageURL.matchLink('https?://netfapx.com/*')
    ) {
        if (
            G_pageURL.matchLink('https?://netfapx.com/*/') // https://netfapx.com/passing-me-around/
        ) {
            if (G_pageURL.match('#OnlyVideo')) { // https://www.porntrex.com/video/162636/kiera-winters-sex-queen-and-her-prince#OnlyVideo
                // window.stop();
                G_funcToRun = function () {
                    let contentURL = G_funcResult;
                    // let posterURL = flashvars.preview_url;
                    console.log('contentURL: ', contentURL);
                    openURL(refineVideo(contentURL));
                };
                waitForElement('body video[src] > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            }
            else {
                G_funcToRun = function () {
                    G_contentURL = G_shortURL + '#OnlyVideo';
                    G_qualitySampleSource = document.querySelectorAll('body video[src] > source[src], body video[src]')[0];
                    G_forceLoad = true;
                    G_posterURL = G_posterURL ? G_posterURL : document.querySelector('.previewthumbnails img[src]').src;
                    G_postersArray = CreateLinksList(G_posterURL, /^(.*\/ID\d+)_\d+.jpg/i, '$1_$NUM.jpg', 1, 10); // console.log('G_posters:\n', G_postersArray);
                    if (G_qualitySampleSource.poster) {
                        G_postersArray.push(G_qualitySampleSource.poster);
                        G_posterURL = G_qualitySampleSource.poster;
                    };
                    G_actorsSource = document.querySelectorAll('.infovideo a[rel*="tag"]');
                    G_stickTo = document.querySelector('.contentbox > div'); G_stickPosition = 1;
                    // --------------------------------------------------------------------------------
                    G_standartAddEmbedCodeFunc();
                    // --------------------------------------------------------------------------------
                };
                waitForElement('body video[src] > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            };
        }
    }

    else if (
        G_pageURL.matchLink('https?://yourporn.sexy/*') ||
        G_pageURL.matchLink('https?://sxyprn.com/*') ||
        G_pageURL.matchLink('https?://sxyprn.net/*')
    ) {
        if (G_pageURL.match('#ReCast')) { // https://yourporn.sexy/post/59772cebee27b.html#ReCast
            // window.stop();
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            //  waitForElement('#vid_container_id video[src] > source[src], #vid_container_id video[src]', 'src', G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
            waitForElement('#vid_container_id video', 'currentSrc', G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        else if (
            location.pathname.matchLink('/post/*') // https://yourporn.sexy/post/56be2e8359051.html?sk=Carolina%20Abril&so=30
        ) {
            G_funcToRun = function () {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL; // + '#ReCast';
                G_posterURL = G_posterURL ? G_posterURL : getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
                // G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*eporner.com\/thumbs\/.*)\/\d+_(\d+).jpg/i, '$1/$NUM_$2.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelectorAll('div.comments_area, .combo_container')[0]; G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_qualitySampleSource = document.querySelector('#vid_container_id video[src]');
                G_previewURL = G_posterURL.replace('/full.jpg', '/vidthumb.mp4'); // https://s14.trafficdeposit.com//blog/vid/5ba53b584947a/5c3fa60edb1ed/vidthumb.mp4
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('#vid_container_id video[src]');
                    media = media ? media : eventCatcher;
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('#vid_container_id video[src] > source[src], #vid_container_id video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://upornia.com/*') || // https://upornia.com/videos/1080364/exotic-pornstars-melanie-rios-and-gigi-rivera-in-crazy-brunette-hd-sex-clip/
        G_pageURL.matchLink('https?://txxx.tube/*') // https://txxx.tube/videos/4497531/hottest-pornstars-nikki-hunter-and-rita-faltoyano-in-best-big-tits-brunette-sex-video/
    ) {
        let playerData;
        /* globals jwplayer pl3748 */
        G_funcToTest = function() {
            try {
                playerData = playerData ? playerData : pl3748.getPlaylist();
                playerData = playerData ? playerData : jwplayer().getPlaylist();
                playerData = playerData ? playerData[Object.keys(playerData).length-1] : playerData;
                return playerData;
            } catch(e) {};
        };
        if (G_pageURL.match('#ReCast')) { // https://upornia.com/videos/1080364/exotic-pornstars-melanie-rios-and-gigi-rivera-in-crazy-brunette-hd-sex-clip/#ReCast
            // window.stop();
            G_funcToRun = function() {G_contentURL = playerData.file.replace('&f=video.m3u8', ''); G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * 3, G_timerGroup);
        }
        else if (
            // G_pageURL.matchLink('https?://upornia.com/videos/*/*') // https://upornia.com/videos/1080364/exotic-pornstars-melanie-rios-and-gigi-rivera-in-crazy-brunette-hd-sex-clip/
            location.pathname.match(/^\/videos\//)
        ) {
            G_funcToRun = function () {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL; // + '#ReCast';https://cdn60563788.ahacdn.me/contents/videos_sources/1080000/1080364/screenshots/21.jpg
                G_posterURL = playerData.image;
                G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*\/screenshots)\/\d+.jpg/i, '$1/$NUM.jpg', 1, 20); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelectorAll('div.info, .underplayer')[0]; G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                // G_qualitySampleSource = document.querySelector('#kt_player video');
                G_sampleURL = playerData.file.replace('&f=video.m3u8', '');
                // G_previewURL = G_posterURL.replace('/full.jpg', '/vidthumb.mp4'); // https://s14.trafficdeposit.com//blog/vid/5ba53b584947a/5c3fa60edb1ed/vidthumb.mp4
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                let eventCatcher = G_qualitySampleSource, media = G_qualitySampleSource;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelectorAll('#kt_player video, #videoplayer video')[0];
                    media = media ? media : eventCatcher;
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * 3, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.porngo.com/*') ||
        G_pageURL.matchLink('https?://www.xxxfiles.com/*')
    ) {
        /* globals thumbnails player */
        function getMaxQuality(limit = 0) {
            let data = {};
            data.maxQuality = 0;
            let links = document.querySelectorAll('a.video-links__link[href*="/get_file/"]');
            for (let link of links) {
                let text = link.innerText;
                let match = link.innerText.match(/(\d+)[pk]/i);
                if (match) {
                    let quality = parseInt(match[1]);
                    if (quality < 16) {quality = Math.floor(1080*quality/2);};
                    let text = match[0].trim();
                    console.log(quality, text);
                    data[quality+'p'] = {};
                    data[quality+'p'].src = link.href;
                    if (limit && quality > limit*1.1) continue;
                    if (quality > data.maxQuality) data.maxQuality = quality;
                };
            };
            let maxQualityData = data[data.maxQuality+'p'];
            if (maxQualityData) {
                if (maxQualityData.src) {
                    data.maxQualitySrc = maxQualityData.src;
                    return data;
                };
            };
        };
        G_funcToTest = function () {
            return getMaxQuality(0);
        };
        if (G_pageURL.match('#ReCast')) { // https://www.porngo.com/videos/28489/passing-me-around/#ReCast
            // window.stop();
            G_funcToRun = function() {
                let data = getMaxQuality(G_qualityLimit);
                console.log(data);
                G_contentURL = data[data.maxQuality+'p'].src; // G_funcResult;
                G_standartReCastFunc();
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://www.porngo.com/videos/*/*') || // https://www.porngo.com/videos/28489/passing-me-around/
            G_pageURL.matchLink('https?://www.xxxfiles.com/videos/*/*') // https://www.porngo.com/videos/28489/passing-me-around/
        ) {
            G_funcToRun = function () {
                let data = getMaxQuality(0);
                for (let i in player.options_.sources) {
                    if (player.options_.sources[i].label) {
                        let match = player.options_.sources[i].label.match(/(\d+)p/i);
                        if (match) {
                            let quality = parseInt(match[1]);
                            if (quality < 16) {quality = Math.floor(1080*quality/2);};
                            let text = match[0].trim();
                            if (data[quality+'p']) {
                                player.options_.sources[i].src = data[quality+'p'].src;
                                console.log(player.options_.sources[i]);
                            };
                        };
                    };
                };
                console.log('data:', data);
                console.log('player.options_.sources:', player.options_.sources);
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL + '#ReCast';
                G_posterURL = document.querySelector('.player video').poster;
                G_posterURL = G_posterURL ? G_posterURL : getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
                G_postersArray = []; // CreateLinksList(G_posterURL, /^(.*)\/(.*)\.jpg/i, '$1/$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                if (thumbnails) for (let item of Object.keys(thumbnails)) {let url = thumbnails[item].src; G_postersArray.push(url);}; console.log('G_posters:\n', G_postersArray);
                G_previewURL = G_posterURL.replace(/^(.*):\/\/img(.*)\/.*\/(.*)\/(player|medium.*)\/.*/, '$1://cast$2/preview/$3.mp4');
                G_actorsSource = document.querySelectorAll('.video-links a.video-links__link[href*="/models/"]');
                G_stickTo = document.querySelector('div.player-holder'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                // G_forceLoad = false;
                G_sampleURL = data[data.maxQuality+'p'].src; // document.querySelector('.player video > source[src]').src;
                // G_qualitySampleSource = document.querySelector('.player video');
                // G_previewURL = G_posterURL.replace('(.*)/(.*)\.jpg', '$1/$2.mp4'); // https://s14.trafficdeposit.com//blog/vid/5ba53b584947a/5c3fa60edb1ed/vidthumb.mp4
                G_standartAddEmbedCodeFunc();
                // console.log(G_embedCodeVideo)
                // alert(G_sampleURL);
                // --------------------------------------------------------------------------------
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('.player video');
                    media = media ? media : eventCatcher;
                    // if (media) {media = media.parentNode};
                    G_messageTarget = media;
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://*.pornhub.com/*')
    ) {
        try {
            let mhp1138_player_data = JSON.parse(localStorage.mhp1138_player);
            if (!mhp1138_player_data.quality || mhp1138_player_data.quality !== 'hls') {
                mhp1138_player_data.quality = '1080';
                localStorage.mhp1138_player = JSON.stringify(mhp1138_player_data);
            };
        } catch(e) {};
        if (getCookie('lang') !== 'en') {
            setCookie('lang', 'en', {lang: 'en', domain: 'pornhub.com', expire: 0});
            location.host = 'pornhub.com';
        };
        addGlobalStyle('span.title a {font-size: 1vw;}', 'ph_Style_1');
        addGlobalStyle('.menu.realsex, .menu.community {display: none !important;}', 'ph_Style_2');
        // --------------------------------------------------------------------------------
        let actualSource = () => {
            G_allData = {};
            let contentURL;
            let flashvars = getWindowVar('flashvars');
            if (!flashvars) {
                for (let script of document.scripts) {
                    let text = script.text;
                    let match = text.match(/var flashvars_(.*?) = */i);
                    if (match) {
                        let id = match[1];
                        if (id) flashvars = getWindowVar('flashvars_' + id);
                        if (flashvars) break;
                    };
                }
            };
            if (flashvars) {
                let qualityTable = flashvars.defaultQuality, maxQuality = 0;
                for (let quality of qualityTable) {
                    //maxQuality = quality > maxQuality && flashvars['quality_' + quality + 'p'] ? quality : maxQuality;
                    if (quality > maxQuality) {
                        let url = flashvars['quality_' + quality + 'p'];
                        if (url) {
                            maxQuality = quality;
                            G_allData[quality+''] = url;
                            // alert(quality + ' : ' + url);
                        };
                    };
                };
                if (maxQuality > 0) {
                    console.log('quality: ' + maxQuality);
                    contentURL = flashvars['quality_' + maxQuality + 'p'];
                    return (contentURL); // openURL(refineVideo(contentURL));
                };
            };
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.pornhub.com/view_video.php?viewkey=ph5852ef85649df#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {console.log('G_allData:', G_allData); G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornhub.com/embed/*') // https://www.pornhub.com/embed/ph5852ef85649df
        ) {
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('video > source[src], video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://*.pornhub.com/view_video.php[?]viewkey=*') // https://www.pornhub.com/view_video.php?viewkey=ph5852ef85649df
        ) {
            G_funcToRun = function () {
                G_sampleURL = actualSource();
                G_pageURL = G_pageURL.replace(/(https?:\/\/).*?\.(pornhub\.com\/)/i, '$1$2');
                G_contentURL = document.querySelector('meta[name="twitter:player"]').content.replace(/(https?:\/\/).*?\.(pornhub\.com\/)/i, '$1$2'); //pageURL + '#ReCast';
                G_posterURL = document.querySelector('meta[name="twitter:image"]').content;
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 0, 15+2); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.video-actions-container'); G_stickPosition = -1;
                G_actorsSource = document.querySelectorAll('.video-detailed-info > .video-info-row a[href*="/model/"], .video-detailed-info > .video-info-row a[href*="/pornstar/"]');
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('.mhp1138_eventCatcher');
                    media = media ? media : document.querySelector('.mhp1138_videoWrapper > video');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                    G_messageTarget = media;
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('.video-actions-container', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://*.playvids.com/*') || // https://www.playvids.com/z_GWEZil5lC/massagereep-s-art-of-creepy-massages-lexi-belle-fucking-sexy-wife
        G_pageURL.matchLink('https?://*.pornoeggs.com/*') || // https://www.pornoeggs.com/watch?v=00RejSBM3Cl
        G_pageURL.matchLink('https?://*.pornflip.com/*') // https://www.pornflip.com/v/L1_WTxCvGpe
    ) {
        // --------------------------------------------------------------------------------
        let actualSource = () => {
            let video = document.querySelector('video[data-qualities]');
            if (!video) return;
            let qualities = video.dataset.qualities.split('|');
            let maxQuality = qualities[qualities.length-1];
            let contentURL = video.dataset['src' + maxQuality];
            return contentURL;
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.playvids.com/z_GWEZil5lC/massagereep-s-art-of-creepy-massages-lexi-belle-fucking-sexy-wife#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            location.pathname.matchLink('/embed/*') // https://www.playvids.com/embed/z_GWEZil5lC // https://www.pornflip.com/embed/L1_WTxCvGpe
        ) {
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                G_allData = {};
                G_allData['360'] = document.querySelector('video[data-qualities]').dataset.hlsSrc360;
                G_allData['720'] = document.querySelector('video[data-qualities]').dataset.hlsSrc720;
                G_contentURL = G_allData['720'];
                // if (G_contentURL) openURL(refineVideo(G_contentURL));
                // --------------
                let refinedURL = refineVideo(G_contentURL);
                if (G_allData) {
                    let jsonData = encodeURIComponent(JSON.stringify(G_allData));
                    let symbol = refinedURL.match(/[?]/) ? '&' : '?';
                    refinedURL = refinedURL + symbol + 'jjs=' + jsonData;
                };
                // openURL(refineVideo(contentURL));
                openURL(refinedURL);
                // --------------
            };
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            location.pathname.matchLink('/*/*') || // https://www.playvids.com/z_GWEZil5lC/massagereep-s-art-of-creepy-massages-lexi-belle-fucking-sexy-wife
            location.pathname.matchLink('/watch') // https://www.pornoeggs.com/watch?v=00RejSBM3Cl
        ) {
            G_funcToRun = function () {
                G_sampleURL = actualSource();
                if (!G_sampleURL) G_qualitySampleSource = document.querySelector('video[data-qualities]');
                // G_contentURL = document.querySelector('link[rel="canonical"]').href; //pageURL + '#ReCast';
                G_contentURL = document.querySelector('video[data-qualities]').dataset.embed;
                G_posterURL = document.querySelector('meta[property="og:image"]').content;
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                // G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.channel-info'); G_stickPosition = 1;
                G_actorsSource = document.querySelectorAll('.detail-video a[href*="/model/"], .detail-video a[href*="/pornstar/"]');
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div.mediaPlayerContainer');
                    media = media ? media : document.querySelector('video[data-qualities]'); // document.querySelector('div#player video > source');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://*.pornoeggs.com/*')
    ) {
        // --------------------------------------------------------------------------------
        let actualSource = () => {
            let video = document.querySelector('video[data-qualities]');
            let qualities = video.dataset.qualities.split('|');
            let maxQuality = qualities[qualities.length-1];
            let contentURL = video.dataset['src' + maxQuality];
            log(G_debugMode, 'maxQuality', 'src' + maxQuality + ' =', contentURL);
            return contentURL;
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.pornoeggs.com/watch?v=00RejSBM3Cl#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornoeggs.com/embed[?]v=*') // https://www.pornoeggs.com/embed?v=00RejSBM3Cl
        ) {
            return;
            // --------------------------------------------------------------------------------
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornoeggs.com/watch[?]v=*') // https://www.pornoeggs.com/watch?v=00RejSBM3Cl
        ) {
            G_funcToRun = function () {
                G_qualitySampleSource = document.querySelector('video[data-qualities]');
                G_contentURL = document.querySelector('video[data-qualities]').dataset.embed;
                G_posterURL = document.querySelector('meta[property="og:image"]').content;
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                G_stickTo = document.querySelector('.pcomments-left, .channel-info'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_previewURL = G_posterURL.replace(/^(.*)\/.*.jpg/, '$1/preview.mp4'); // https://cdn-img1.pornoeggs.com/thumbs/697/697331/preview.mp4
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div.mediaPlayerContainer');
                    media = media ? media : document.querySelector('video[data-qualities]'); // document.querySelector('div#player video > source');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://txxx.com/*')
    ) {
        // --------------------------------------------------------------------------------
        if (
            G_pageURL.matchLink('https?://txxx.com/embed/*') // https://txxx.com/embed/3049145
        ) {
            G_funcToRun = function () {
                G_contentURL = G_funcResult.currentSrc;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('.jwplayer video[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https://txxx.com/videos/*') // https://txxx.com/videos/3049145/horny-pornstar-gigi-rivera-in-fabulous-big-dick-cumshots-porn-video/
        ) {
            /* globals EoCR4 */
            G_funcToRun = function () {
                G_qualitySampleSource = document.querySelector('#videoplayer video[src]');
                G_contentURL = G_pageURL.replace(/^(.*)\/videos\/(.*?)\/.*$/, '$1/embed/$2');
                // https://cdn37804682.ahacdn.me/contents/videos_sources/3049000/3049145/screenshots/2.jpg
                // https://cdn37804682.ahacdn.me/contents/videos_screenshots/3049000/3049145/timelines/hq_mp4/150x113/sprite_1.jpg
                G_posterURL = document.querySelector('.jw-preview').style.backgroundImage.replace().replace(/^.*\("(.*)"\)$/, '$1');
                G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.content'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                // https://cdn56191079.ahacdn.me/c8/videos/3049000/3049145/3049145_tr.mp4
                // https://cdn37804682.ahacdn.me/c8/videos/13632000/13632958/13632958_tr.mp4
                // https://cdn62004373.ahacdn.me/c12/videos/13632000/13632958/13632958_tr.mp4
                G_previewURL = G_posterURL.replace(/^(.*)\/contents\/videos_\w+?\/(.*?\/(.*?))\/.*/, '$1/c8/videos/$2/$3_tr.mp4');
                G_previewURL = 'https://' + EoCR4[22] + G_posterURL.replace(/^(.*)\/contents\/videos_\w+?\/(.*?\/(.*?))\/.*/, '/$2/$3_tr.mp4');
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div#videoplayer');
                    media = media ? media : document.querySelector('.jwplayer video[src]');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('.jwplayer video[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.youjizz.com/videos/*.html')
    ) {
        /* globals mp4Encodings */
        if (G_pageURL.match('#OnlyVideo')) { // https://www.youjizz.com/videos/hot-white-girl-smooth-massage-32782801.html#OnlyVideo
            // window.stop();
            G_funcToTest = function () {
                return typeof mp4Encodings !== "undefined" && mp4Encodings[0];
            };
            G_funcToRun = function () {
                let contentURL = location.protocol + mp4Encodings[mp4Encodings.length-1].filename;
                console.log('contentURL: ', contentURL);
                openURL(refineVideo(contentURL));
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else {
            G_funcToTest = function () {
                return typeof mp4Encodings !== "undefined" && mp4Encodings[0];
            };
            G_funcToRun = function () {
                G_contentURL = G_shortURL + '#OnlyVideo';
                G_sampleURL = location.protocol + mp4Encodings[0].filename;
                G_posterURL = G_posterURL ? G_posterURL : location.protocol + document.querySelector('div[poster]').getAttribute('poster');
                G_postersArray = CreateLinksList(G_posterURL, /^.*\/\/(.*.com\/(.*?))-\d+.jpg/i, location.protocol+'//$1-$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.video-info'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
            };
            waitForElement('div[poster]', 'poster', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.veporns.com/')
    ) {
        if (
            G_pageURL.matchLink('https?://www.veporns.com/video/*') // http://www.veporns.com/video/eroticax-gina-valentina-happy-endings-h245979cc07d1676
        ) {
            G_funcToRun = function () {
                G_contentURL = document.querySelector('#playerbox > iframe[src^="http"]').src;
                G_posterURL = document.querySelector('meta[itemprop="thumbnailUrl"]').content;
                G_sampleURL = null;
                G_stickTo = document.querySelector('.box.info'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
            };
            function initFunc(e) {
                waitForElement('#playerbox > iframe[src^="http"]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            };
            for (let button of document.querySelectorAll('.controls > .r > a[href^="#server"]')) {
                button.addEventListener('click', initFunc);
            };
        }
    }

    else if (
        G_pageURL.matchLink('https?://hqporner.com')
    ) {
        /*
        const css = [
            `body * {`,
            `    background: black !important;`,
            `    color: brown;`, // darkgoldenrod
            `}`,
            `#main-wrapper {`,
            `    background: unset !important;`,
            `    border-top: unset !important;`,
            `    border-bottom: unset !important;`,
            `}`,
        ].join('\n');
        addGlobalStyle(css, 'night-mode');
        */
        if (
            G_pageURL.matchLink('https?://hqporner.com/hdporn/*') // https://hqporner.com/hdporn/83708-cute_teen_tied_to_tree_and_fucked.html
        ) {
            document.addEventListener("DOMContentLoaded", function(event) {
                let h = document.querySelector(`.main-h1.h2-main`); if (h && h.innerText == 'WHY DO I SEE IT?') {
                    location.pathname = location.pathname;
                };
            });
            G_funcToRun = function() {
                // https://hqporner.com/?q=GINA LOOKS GOOD IN RED
                let header = document.querySelector('.box.page-content header');
                let iframe_id = 'thumbs';
                let iframe = document.querySelector('iframe#' + iframe_id);
                function checkIframeContent(iframe) {
                    let matched = location.pathname.match(/.*\/(\d+).*$/);
                    if (matched) {
                        let id = matched[1];
                        if (id.match(/^\d+$/)) {
                            let win = iframe.contentWindow
                            let globals = Object.keys(win);
                            let variable = 'preload_' + id;
                            if (variable) {
                                G_postersArray = win[variable];
                                if (G_postersArray && G_postersArray.length > 0) {
                                    let tmp = []; for (let item of G_postersArray) {
                                        if (typeof item !== 'undefined') tmp.push(item);
                                    };
                                    G_postersArray = tmp;
                                    let main_poster = G_postersArray[G_postersArray.length-1].replace(/^(.*)_\d+\.jpg$/, '$1_main.jpg');
                                    G_postersArray.push(main_poster);
                                    G_posterURL = G_postersArray[G_postersArray.length-1];
                                    console.log('G_postersArray:', G_postersArray);
                                    G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
                                    G_embedCodeImageInput.value = G_posterURL;
                                    G_embedCodePoster.src = G_posterURL;
                                    iframe.remove();
                                };
                            };
                        };
                    };
                };
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = iframe_id;
                    iframe.onload = function(){checkIframeContent(iframe);};
                    header.appendChild(iframe);
                };
                let stars = document.querySelector('.icon.fa-star-o');
                stars = stars ? (' ' + stars.innerText) : '';
                iframe.src = 'https://hqporner.com/?q=' + header.querySelector('h1.main-h1').innerText + stars;
                // --------------------------------------------------------------------------------
                G_contentURL = document.querySelector('iframe').src;
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]') ?
                    document.querySelector('meta[property="og:image"]').content
                    : ''
                );
                G_stickTo = document.querySelector('div.content.content-left > div.box.page-content'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_actorsSource = document.querySelectorAll('a[href*="/actress/"]'); // https://hqporner.com/actress/lana-rhoades
                G_categoriesSource = document.querySelectorAll('a[href*="/category/"]'); // https://hqporner.com/category/60fps-porn
                G_standartAddEmbedCodeFunc();
            };
            waitForElement('iframe', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https://mydaddy.cc/video/*/')
    ) {
        // G_noPlayerExtension = true;
        let re;
        let regExp1 = /file:."(.*?\/(\d+)\.mp4)"/gi, matchedScriptText;
        let regExp2 = /src=\\"(.*?\/(\d+)\.mp4)\\"/gi; // src=\"//s13.bigcdn.cc/pubs/5e601c64b7100/360.mp4\"
        let getMatchedScriptText = function(regExp) {
            for (let script of document.scripts) {
                let text = script.text;
                if (text.match(regExp)) {
                    re = regExp;
                    return(text);
                };
            };
        };
        G_funcToTest = function() {
            matchedScriptText = getMatchedScriptText(regExp1) || getMatchedScriptText(regExp2);
            return matchedScriptText;
        };
        G_funcToRun = function() {
            window.stop();
            // --------------------------------------------------------------------------------
            let data = {}, result; while((result = re.exec(matchedScriptText)) !== null) {
                let url = result[1].replace(/^.*\/\//, '//').trim();
                if (url.match(/^\/\//)) url = location.protocol + url;
                let quality = Math.floor(result[2].trim());
                data[quality] = url;
                // console.log('url:', url);
                // console.log('quality:', quality);
            };
            G_allData = data;
            console.log('data:', data);
            let compare = 0; for (let quality of Object.keys(data)) {
                if (quality > compare && quality < G_qualityLimit) {
                    G_allData.quality = quality;
                    G_contentURL = /*location.protocol + */ data[quality];
                    console.log('url:', G_contentURL);
                    console.log('quality:', quality);
                };
            };
            console.log('G_contentURL:', G_contentURL);
            // return;
            // --------------------------------------------------------------------------------
            G_standartReCastFunc();
        };
        waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * G_triesReCastMult * 2, G_timerGroup);
    }
    // ================================================================================
    else if (
        G_pageURL.matchLink('https?://hqwo.cc/player/*') // https://hqwo.cc/player/ae3dea093fc0da4e19dae39cc2a2d9f5?img=Ly9ocXBvcm5lci5jb20vaW1ncy90aHVtYnMvNDcvNTUvYWUzZGVhMDkzZmMwZGE0X2NvdmVyLmpwZw==
    ) {
        G_funcToTest = function () {try {return jwplayer().getConfig().playlist[0].allSources;} catch(e){};};
        G_funcToRun = function() {
            // --------------------------------------------------------------------------------
            let data = {};
            let maxQuality = 0;
            let playerData = G_funcResult;
            let keys = Object.keys(playerData);
            for (let item of keys) {
                let label = playerData[item].label;
                if (label) {
                    let match = label.match(/(\d+)/);
                    if (match) {
                        let quality = Number(match[0]);
                        data[String(quality)] = playerData[item].file;
                        if (quality > maxQuality && quality < G_qualityLimit) {
                            maxQuality = quality;
                        };
                    };
                };
            };
            console.log('data:', data);
            // --------------
            G_allData = data;
            G_contentURL = G_allData[String(maxQuality)];
            // alert(maxQuality + ' : ' + G_contentURL);
            log(G_debugMode, 'G_contentURL:', G_contentURL);
            // --------------
            G_standartReCastFunc();
            // --------------------------------------------------------------------------------
        };
        waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
    }
    // ================================================================================

    else if (
        G_pageURL.matchLink('https?://openload.co/embed/*') || // https://openload.co/embed/GwWaJKr7q-g/
        G_pageURL.matchLink('https?://oload.tv/embed/*') || // https://oload.tv/embed/9RPKFjnnBCw/33628.mp4
        G_pageURL.matchLink('https?://oload.info/embed/*') || // https://oload.info/embed/GkrmWmRxsGM/
        G_pageURL.matchLink('https?://oload.stream/embed/*') || // https://oload.stream/embed/_5lSwGYiAMc/
        G_pageURL.matchLink('https?://oload.xyz/embed/*') || // https://oload.xyz/embed/kuar1R4lKQw/
        G_pageURL.matchLink('https?://oload.download/embed/*') || // https://oload.download/embed/MXmOoScjRCs/45275.mp4
        G_pageURL.matchLink('https?://oload.biz/embed/*') || // https://oload.download/embed/KPgg6tUV_n0/16396.mp4
        G_pageURL.matchLink('https?://oload.*/embed/*') // https://oload.life/embed/7zh5fZ9bofM
    ) {
        let src_span = document.querySelector('#streamurl') || document.querySelector('span[id^="stream"]');
        G_funcToTest = function () {
            let ready, url = src_span;
            if (url && url.innerText.trim() !== '' && !url.innerText.toLowerCase().match("HERE IS THE LINK".toLowerCase())) ready = true;
            else {
                if (!src_span) {
                    document.querySelectorAll('div > p, span').forEach(function (item) {
                        let text = item.innerText;
                        // let match = text.match(/^[\w\d]+-w~\d+~\d+\.\d+\.\d+\.\d+\~[\w\d]+$/); // https://openload.co/embed/en5tCxDT7-w/
                        // http://pron.tv/l/Jenna-Reid-MP4-mp4/ezcexss2 // yybXOZwKGAg~1523412842~37.25.0.0~_27EYtA9
                        let match = text.match(/^.+~\d+~\d+\.\d+\.\d+\.\d+~.+$/);
                        if (match && match[0]) {
                            src_span = document.createElement('span');
                            src_span.id = '#streamurl';
                            src_span.innerText = text;
                            document.body.appendChild(src_span);
                            src_span = item;
                            ready = true;
                        };
                    });
                };
            }
            return ready;
        };
        G_funcToRun = function () {
            let url = src_span;
            let contentURL = location.protocol + '//' + location.host + '/stream/' + url.innerText + '?mime=true';
            // let posterURL = document.querySelector('#olvideo_html5_api').poster;
            console.log('contentURL: ', contentURL);
            let mediaData = {};
            mediaData.url = G_pageURL; // queryURL;
            mediaData.src = contentURL;
            window.parent.postMessage(Object.assign({sender: 'ANSWER'}, mediaData), '*');
            openURL(refineVideo(contentURL));
        };
        waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        // ================================================================================
    }

    else if (
        G_pageURL.matchLink('https?://(www.)?jjgirls.com/*')
    ) {
        // addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
        if (
            G_pageURL.matchLink('https?://(www.)?jjgirls.com/pornpics/*') // https://www.jjgirls.com/pornpics/prettydirty-gina-valentina-brunette-latina-pee-wet
        ) {
            let show = function() {let css = document.querySelectorAll('head > style.hide-private');for (let s of css) {s.remove();};}
            let hide = function() {show(); addGlobalStyle('.xcam, .related a[href^="/direct/"] {display: none;}', 'hide-private');};
            function toggleShowPrivate() {
                let hidePrivate = GM_getValue('hidePrivate', false);
                if (hidePrivate) {
                    show();
                    GM_setValue('hidePrivate', false)
                }
                else {
                    hide();
                    GM_setValue('hidePrivate', true)
                };
            }
            let hidePrivate = GM_getValue('hidePrivate', false);
            if (hidePrivate) {hide();};
            GM_registerMenuCommand('Toggle Show Private', function(){toggleShowPrivate();}, '');
            //
            let imagesArray = [], thumbsArray = [];
            G_funcToRun = function () {
                if (imagesArray.length == 0) {
                    for (let link of document.querySelectorAll('div.related > a[href*="://pics.jjgirls.com/pictures/"]')) {
                        let imageURL = link.href, img = link.querySelector('img');
                        if (img) {
                            let thumbURL = ''; //img.src;
                            thumbsArray.push(thumbURL);
                            imagesArray.push(imageURL);
                        };
                    };
                    for (let img of document.querySelectorAll('a[href] > img[src]')) {
                        img.src = img.src.replace(/(.*)\/hd-(.*)/i, '$1/$2');
                    };
                };
                G_contentTitle = document.querySelector('h1.info.fss').innerText.trim(); // Free PornPics SexPhotos XXxImages HD Gallery!
                G_contentURL = imagesArray[imagesArray.length-1];
                G_posterURL = imagesArray[imagesArray.length-1]; // thumbsArray[0];
                G_postersArray = imagesArray; //thumbsArray; console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.related'); G_stickPosition = 1;
                G_standartAddEmbedCodeFunc();
                for (let i in thumbsArray) {
                    G_contentURL = imagesArray[i];
                    G_posterURL = thumbsArray[i];
                    updateEmbedCodeText(G_embedCodeTextArea, i == 0, G_delimiter);
                };
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            waitForElement('div.related > a[href^="http"]', 'href', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.babesandstars.com/*')
    ) {
        // addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
        if (
            G_pageURL.matchLink('https?://www.babesandstars.com/*/*/*/') // http://www.babesandstars.com/b/bethanie-badertscher/hlgk/
        ) {
            G_funcToRun = function () {
                let imagesArray = [], thumbsArray = [];
                for (let link of document.querySelectorAll('div.my_gallery figure > a[href]')) {
                    let imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        let thumbURL = img.src;
                        // let imageURL = thumbURL.replace(/(.*)\/t(\d+.jpg)/i, '$1/$2'); // http://static.babesandstars.com/galleries/62000/62874/t07.jpg --> http://static.babesandstars.com/galleries/62000/62874/07.jpg
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    };
                };
                G_contentTitle = document.querySelector('title').innerText.trim(); // Frisky teenagers Natalie Monroe and Ava Taylor are giving their mouths and nubs for fuck
                G_contentURL = imagesArray[imagesArray.length-1];
                G_posterURL = thumbsArray[thumbsArray.length-1]; // thumbsArray[0];
                // G_posterStyle = {'width' : '117px', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                G_postersArray = thumbsArray; console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.my_gallery'); G_stickPosition = 1;
                G_standartAddEmbedCodeFunc();
                for (let i in thumbsArray) {
                    G_contentURL = imagesArray[i];
                    G_posterURL = thumbsArray[i];
                    updateEmbedCodeText(G_embedCodeTextArea, i == 0, G_delimiter);
                };
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            waitForElement('div.my_gallery figure > a[href] img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.definebabe.com/*')
    ) {
        // addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
        if (
            G_pageURL.matchLink('https?://www.definebabe.com/gallery/*') // http://www.definebabe.com/gallery/2hha/ava-taylor/
        ) {
            G_funcToRun = function () {
                let imagesArray = [], thumbsArray = [];
                for (let link of document.querySelectorAll('div.gallery div.thumbnails a[href]')) {
                    let imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        let thumbURL = img.src;
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    };
                };
                G_contentTitle = document.querySelector('title').innerText.trim(); // Frisky teenagers Natalie Monroe and Ava Taylor are giving their mouths and nubs for fuck
                G_contentURL = imagesArray[imagesArray.length-1];
                G_posterURL = imagesArray[imagesArray.length-1]; // thumbsArray[0];
                G_postersArray = imagesArray; //thumbsArray; console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.thumbnails'); G_stickPosition = 1;
                G_standartAddEmbedCodeFunc();
                for (let i in thumbsArray) {
                    G_contentURL = imagesArray[i];
                    G_posterURL = thumbsArray[i];
                    updateEmbedCodeText(G_embedCodeTextArea, i == 0, G_delimiter);
                };
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            waitForElement('div.gallery div.thumbnails a[href] img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.pornpics.com')
    ) {
        let class_name = 'thumbwook';
        let valid = (item) => {return item.querySelector('a.rel-link > img');};
        let i = 1, append_text = (item) => {
            if (valid(item)) {
                let text = item.querySelector('p.image_number_text');
                if (!text) {
                    text = document.createElement('p');
                    item.appendChild(text);
                    text.innerText = '#' + i;
                    text.class = 'image_number_text';
                    text.style['font-size'] = 'x-large';
                    text.style.margin = '0';
                };
                i++;
            };
        };
        let array = document.querySelectorAll('.' + class_name);
        for (let item of array) {append_text(item);}
        document.addEventListener('DOMNodeInserted', function handleNewElements(event) {
            let item = event.target;
            let item_class = item.className ? item.className.trim() : '';
            if (item_class == class_name) { append_text(item); };
        }, false);
        if (
            G_pageURL.matchLink('https?://www.pornpics.com/galleries/*')
        ) {
            G_funcToRun = function () {
                let linksArray = document.querySelectorAll('#main li.thumbwook > a'), imagesArray = [], thumbsArray = [];
                for (let link of linksArray) {
                    let imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        let thumbURL = img.src;
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    };
                };
                G_contentTitle = document.querySelector('title').innerText.trim(); // Frisky teenagers Natalie Monroe and Ava Taylor are giving their mouths and nubs for fuck
                G_contentURL = imagesArray[imagesArray.length-1];
                G_posterURL = imagesArray[imagesArray.length-1]; // thumbsArray[0];
                G_postersArray = imagesArray; //thumbsArray; console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('#main'); G_stickPosition = 1;
                G_standartAddEmbedCodeFunc();
                for (let i in thumbsArray) {
                    G_contentURL = imagesArray[i];
                    G_posterURL = thumbsArray[i];
                    let link = linksArray[i];
                    G_videoWidth = link.dataset && link.dataset.size ? link.dataset.size.split('x')[0] : null;
                    G_videoHeight = link.dataset && link.dataset.size ? link.dataset.size.split('x')[1] : null;
                    updateEmbedCodeText(G_embedCodeTextArea, i == 0, G_delimiter);
                };
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            document.addEventListener("DOMContentLoaded", function(event) {
                waitForElement('#main', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            });
            // return; // SKIP REST OF THE CODE
        };
    }

    else if (
        G_pageURL.matchLink('https?://www.sex.com/*')
    ) {
        addGlobalStyle([
            'body * { background-color: rgb(24, 24, 24) !important; color: wheat;}',
            '::-webkit-scrollbar { width: 18px; height: 18px;}',
            '::-webkit-scrollbar-button { background: no-repeat #222; background-size: 18px; background-position: center bottom;}',
            "::-webkit-scrollbar-button:horizontal:decrement { background-image: url('" +
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="Wheat"><polygon points="24,64 48,32 72,64" transform="rotate(-90 48 48)"/>'+
            "</svg>');}" +
            "::-webkit-scrollbar-button:horizontal:increment { background-image: url('" +
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="Wheat"><polygon points="24,64 48,32 72,64" transform="rotate(90 48 48)"/>'+
            "</svg>');}" +
            "::-webkit-scrollbar-button:vertical:increment { background-image: url('" +
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="Wheat"><polygon points="24,64 48,32 72,64" transform="rotate(180 48 48)"/>'+
            "</svg>');}" +
            "::-webkit-scrollbar-button:vertical:decrement { background-image: url('" +
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" fill="Wheat"><polygon points="24,64 48,32 72,64" transform="rotate(0 48 48)"/>'+
            "</svg>');}" +
            '::-webkit-scrollbar-track-piece { background-color: #111;}',
            '::-webkit-scrollbar-thumb { background-color: #444; border-radius: 3px;}',
            '::-webkit-scrollbar-thumb:hover { background-color: #999;}',
            '::-webkit-scrollbar-corner { background-color: #111;}',
            'input * { borders: 1px wheat solid !important; color: wheat;}',
        ].join('\n'), 'misc_style');
        if (
            G_pageURL.matchLink('https?://www.sex.com/pin/*/') ||
            G_pageURL.matchLink('https?://www.sex.com/picture/*/')
        ) {
            G_funcToRun = function () {
                let source = document.querySelector('.image_frame img');
                G_contentURL = source.src.replace(/(.*?)\?.*/, '$1');
                G_posterURL = document.querySelector('meta[itemprop="thumbnail"]').content;
                G_stickTo = document.querySelector('.image_frame'); G_stickPosition = 1;
                G_videoWidth = source.naturalWidth; G_videoHeight = source.naturalHeight;
                G_standartAddEmbedCodeFunc();
                setTimeout(function() {
                    G_videoWidth = source.naturalWidth;
                    G_videoHeight = source.naturalHeight;
                    updateEmbedCodeTextColor();
                }, 1000);
            };
            // setTimeout(function() {
            waitForElement('.image_frame img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            //}, 2000);
        };
        //
        return; // SKIP REST OF THE CODE
    }

    else if (
        G_pageURL.matchLink('*.jpg')
    ) {
        G_funcToRun = function () {
            let val = 0;
            G_contentURL = G_shortURL;
            G_posterURL = G_shortURL;
            G_stickTo = document.querySelector('body'); G_stickPosition = 0;
            G_standartAddEmbedCodeFunc();
        };
        waitForElement('img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        return; // SKIP REST OF THE CODE
    }

    else if (
        G_pageURL.matchLink('https?://biqle.*/*') ||
        G_pageURL.matchLink('https?://daftsex.*/*')
    ) {
        if (G_pageURL.match('#ReCast')) { // https://biqle.ru/watch/-159565098_456242372#ReCast
            return;
        }
        else if (
            location.pathname.matchLink('^/watch/*') // https://biqle.ru/watch/-159565098_456242372  // https://daftsex.com/watch/-111379583_171930025
        ) {
            document.addEventListener('DOMContentLoaded', function onDOMContentLoaded(event) {
                for (let iframe of document.querySelectorAll('iframe')) {
                    iframe.setAttribute('target', '_self');
                    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
                };
            }, false);
            G_funcToRun = function() {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL; // + '#ReCast';
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]') ?
                    document.querySelector('meta[property="og:image"]').content :
                    null
                );
                let thumbNailSrc = document.querySelector('link[itemprop="thumbnailUrl"]');
                G_posterURL = G_posterURL ? G_posterURL :
                thumbNailSrc ? getAbsoluteUrl(thumbNailSrc.getAttribute('href', 2)) : G_posterURL;
                G_stickTo = document.querySelectorAll('.video .heading, .video_info_wrapper .heading')[0]; G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                G_messageTarget = document.querySelector('iframe').contentWindow;
            };
            waitForElement('iframe[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }

    else if (
        G_pageURL.matchLink('https?://daxab.com/player/*') ||
        G_pageURL.matchLink('https?://dxb.to/player/*')
    ) {
        /*
        G_funcToRun = function() {
            G_contentURL = document.querySelector('.videoplayer_dl_select ._item').href; // 1080p, 720p ...
            if (!G_contentURL || G_contentURL == '') {
                document.querySelector('.videoplayer_quality_select ._item').click();
                let G_funcToRun_2 = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
                waitForElement('.videoplayer_media_el', 'src', G_funcToRun_2, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
            }
            else {
                G_standartReCastFunc();
            };
        };
        waitForElement('.videoplayer_dl_select ._item', null, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        */
        /* globals globParams */
        function daxabGetMaxQualityURL(limit = 0) {
            G_allData = {};
            if (globParams.video.cdn_id) {
                let params = globParams.video.cdn_id.split('_');
                if (params[1]) {
                    let domain = location.protocol + document.querySelectorAll('body video > source[src], body video[src]')[0].src.replace(/.*\/\/(.*?)\/.*/, '//$1');
                    let id1 = params[0], id2 = params[1];
                    let maxQuality = 0, maxQualityURL = null;
                    for (let key of Object.keys(globParams.video.cdn_files)) {
                        let match = key.match(/^(.*)_(\d+)\w?$/)
                        if (match) {
                            let keyQuality = parseInt(match[2]);
                            if (limit && keyQuality > limit*1.1) continue;
                            if (keyQuality > maxQuality) {
                                let type = match[1];
                                maxQuality = keyQuality;
                                maxQualityURL = domain + globParams.video.cdn_files[key].replace(/(.*)?\.(.*)/, `/videos/${id1}/${id2}/$1.${type}?extra=$2`);
                                G_allData[String(keyQuality)] = maxQualityURL;
                            };
                        };
                    };
                    // let domain = location.protocol + document.querySelectorAll('body video > source[src], body video[src]')[0].src.replace(/.*\/\/(.*?)\/.*/, '//$1');
                    // maxQualityURL = domain + maxQualityURL;
                    // console.log('maxQualityURL:', maxQualityURL);
                    return maxQualityURL;
                };
            }
            else {
                let maxQuality = 0, maxQualityURL = null;
                for (let item of document.querySelectorAll('.videoplayer_controls_item.videoplayer_dl *[download]')) {
                    if (!item.download) continue;
                    let match = item.download.match(/^(\d+)\w?/)
                    if (match) {
                        if (!item.href) continue;
                        let itemQuality = parseInt(match[1]);
                        if (limit && itemQuality > limit*1.1) continue;
                        if (itemQuality > maxQuality) {
                            maxQuality = itemQuality;
                            maxQualityURL = item.href;
                        };
                    };
                };
                return maxQualityURL;
            };
        };
        G_funcToRun = function() {
            G_contentURL = daxabGetMaxQualityURL(0);
            G_posterURL = G_contentURL.replace(/(^.*videos\/.*?\/.*?)\/.*/, '$1/thumb.jpg');
            //psv53-1.daxab.com/videos/-146716990/456239017/thumb.jpg
            //             location.href = G_posterURL;
            // alert(G_contentURL);
            // alert(G_posterURL);
            G_standartReCastFunc();
        };
        waitForElement('.videoplayer_media_el[src], .videoplayer_controls_item.videoplayer_dl *[download]', null, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        // waitForCondition(daxabGetMaxQualityURL, G_funcToRun, G_delay, G_tries, G_timerGroup);
    }

    else if (
        G_pageURL.matchLink('https?://*.pornesq.com/*')
    ) {
        // --------------------------------------------------------------------------------
        let actualSource = () => {
            let source = document.querySelector('video#video_html5_api > source[src]');
            if (!source) return;
            let contentURL = source.src;
            return contentURL;
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.pornesq.com/video/21809/lana-rhoades-19-year-old-natural-busty-teen-gets-covered-in-cream#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries * G_triesReCastMult, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornesq.com/embed/*') // https://www.pornesq.com/embed/a531f21d4128a5efcf31
        ) {
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('video#video_html5_api > source[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.pornesq.com/video/*/*') // https://www.pornesq.com/video/21809/lana-rhoades-19-year-old-natural-busty-teen-gets-covered-in-cream
        ) {
            G_funcToRun = function () {
                G_sampleURL = actualSource();
                G_contentURL = document.querySelector('textarea#video_embed_code').value.match(/.*src="(.*?)".*/i)[1]; // https://www.pornesq.com/embed/a531f21d4128a5efcf31
                G_posterURL = document.querySelector('video#video_html5_api').poster; // https://www.pornesq.com/media/videos/tmb/21809/1.jpg
                G_postersArray = CreateLinksList(G_posterURL, /^(.*)\/.*?.jpg$/i, '$1/$NUM.jpg', 1, 20); console.log('G_posters:\n', G_postersArray);
                G_postersArray = [G_posterURL].concat(G_postersArray);
                G_stickTo = document.querySelector('.video-container'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                let eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div.video-container');
                    media = media ? media : document.querySelector('video#video_html5_api'); // document.querySelector('div#player video > source');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('video#video_html5_api > source[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }
    // --------------------------------------------------------------------------------
    else if (
        G_pageURL.matchLink('https?://pornbox.video/video/*')
    ) {
        if (G_pageURL.match('#ReCast')) { // https://pornbox.video/video/Gina-Valentina-Shopping-for-anal-5984.html
            return;
        }
        else if (
            location.pathname.matchLink('^/video/*') // https://biqle.ru/watch/-159565098_456242372  // https://daftsex.com/watch/-111379583_171930025
        ) {
            document.addEventListener('DOMContentLoaded', function onDOMContentLoaded(event) {
                for (let iframe of document.querySelectorAll('iframe')) {
                    iframe.setAttribute('target', '_self');
                    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
                };
            }, false);
            G_funcToRun = function() {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL; // + '#ReCast';
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]') ?
                    document.querySelector('meta[property="og:image"]').content :
                    null
                ); // https://pornbox.video/Assets/Previews/Medium/5984.jpg"
                let thumbNailSrc = document.querySelector('link[itemprop="thumbnailUrl"]');
                G_posterURL = G_posterURL ? G_posterURL :
                thumbNailSrc ? getAbsoluteUrl(thumbNailSrc.getAttribute('href', 2)) : G_posterURL;
                G_previewURL = G_posterURL.replace(/\/Assets\/Previews\/.*\/(.*)\.jpg/, '/Assets/Mediabooks/$1.mp4'); // https://pornbox.video/Assets/Mediabooks/5984.mp4
                G_stickTo = document.querySelectorAll('.player_page')[0]; G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                G_messageTarget = document.querySelector('iframe').contentWindow;
            };
            waitForElement('iframe[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        };
    }
    // --------------------------------------------------------------------------------
    else if (
        G_pageURL.matchLink('https?://player.flexcdn.cloud/*') // https://player.flexcdn.cloud/5d769d8aa78803079064c8ac
    ) {
        G_funcToRun = function () {
            G_contentURL = G_funcResult.src;
            // if (G_contentURL) openURL(refineVideo(G_contentURL));
            G_standartReCastFunc();
        };
        waitForElement('video[src], video > source[src]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
    }
    // --------------------------------------------------------------------------------
    else {
        // alert(G_pageURL);
        console.log('No Match:', G_pageURL);
    };

    console.log('G_matchedLink:', G_matchedLink);
})();
