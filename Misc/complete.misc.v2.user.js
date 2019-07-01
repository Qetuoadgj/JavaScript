// ==UserScript==
// @name         complete.misc.v2
// @icon         https://www.google.com/s2/favicons?domain=jquery.com
// @namespace    complete.misc
// @version      2.0.03
// @description  try to take over the world!
// @author       You
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/complete.misc.v2.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @match        file:///*/2.*.*.html*
// @match        *://www.eporner.com/hd-porn/*/*/
// @match        *://www.eporner.eu/hd-porn/*/*/
// @match        *://www.eporner.com/embed/*
// @match        *://yespornplease.com/v/*
// @match        *://yespornplease.com/view/*
// @match        *://vshare.io/v/*
// @exclude      *://vshare.io/v/404/*
// @match        *://www.porntrex.com/video/*/*
// @match        *://sxyprn.com/post/*.html*
// @match        *://*.pornhub.com/view_video.php?viewkey=*
// @match        *://www.pornhub.com/embed/*
// @match        *://www.playvids.com/*/*
// @match        *://www.youjizz.com/videos/*.html
// @match        *://www.veporns.com/video/*
// @match        *://openload.co/embed/*
// @match        *://oload.*/embed/*
// @match        *://www.jjgirls.com/pornpics/*
// @match        *://www.babesandstars.com/*/*/*/
// @match        *://www.definebabe.com/gallery/*
// @match        *://hqporner.com/hdporn/*.html
// @match        *://mydaddy.cc/video/*
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
    function log(showAlert, ...args) {
        // console.log(args);
        var string = args.join(' ').replace(/\n[\t ]/g, '\n');
        console.log(string);
        if (showAlert) alert(string);
    }
    // ================================================================================
    var G_funcToTest, G_funcToRun, G_funcResult, G_delay = 100, G_tries = 50, G_timerGroup = [];
    function waitForCondition(funcToTest = false, funcToRun = false, delay = 50, tries = 5, timerGroup = []) {
        // --------------------------------------------------------------------------------
        if ((funcToTest && (typeof funcToTest).toLowerCase() == 'function' && funcToRun && (typeof funcToRun).toLowerCase() == 'function')) {
            var timerGroupIndex = timerGroup.length;
            // --------------------------------------------------------------------------------
            function startIteration(iteration, delay, count, timerGroup, timerGroupIndex) {
                var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
                if (timerGroup) timerGroup[timerGroupIndex] = timer; // add timer to timerGroup
            };
            // --------------------------------------------------------------------------------
            function clearTimers(timerGroup) {for (let timer of timerGroup) {clearTimeout(timer);}};
            // --------------------------------------------------------------------------------
            function iteration(count) {
                if (tries && (count < tries)) {
                    /*var*/ G_funcResult = funcToTest();
                    if (G_funcResult) {
                        let state = 'SUCCESS'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
                        clearTimers(timerGroup);
                        funcToRun();
                        return;
                    }
                    else {
                        let state = 'keepRun'; log(0, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
                        startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
                    }
                }
                else {
                    let state = 'FAIL'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
                    // console.trace();
                }
            };
            // --------------------------------------------------------------------------------
            iteration(1); // launch 1st iteration
        }
        // --------------------------------------------------------------------------------
    };
    function waitForElement(elementSelector, attribute, funcToRun, delay, tries, timerGroup) {
        // --------------------------------------------------------------------------------
        var funcToTest = function () {
            console.log('elementSelector:', elementSelector, '\nattribute:', attribute);
            var result, elementsArray = document.querySelectorAll(elementSelector);
            for (let element of elementsArray) {
                var value = element ? element.getAttribute(attribute) : null;
                result = attribute ? value : element;
                if (result && result !== '') {
                    G_funcResult = element;
                    break;
                }
            }
            if (!result) {
                // console.trace();
            }
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
        var result = this.match(new RegExp(link.replace(/[.\/]/g, "\\$&").replace(/\*/g, ".*"), flags));
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
        function capFirst(str) { return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1); }
        return this.split(' ').map(capFirst).join(' ');
    };
    String.prototype.toTitleCase = function(lower) {
        var string = lower ? this.toLowerCase() : this;
        var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
        return string.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
            if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
                return match.toLowerCase();
            }
            if (match.substr(1).search(/[A-Z]|\../) > -1) {
                return match;
            }
            return match.charAt(0).toUpperCase() + match.substr(1);
        });
    };
    // ================================================================================
    var getAbsoluteUrl = (function () { var a; return function (url) { if (!a) a = document.createElement('a'); a.href = url; return a.href; }; })();
    // ================================================================================
    // expected hue range: [0, 360)
    // expected saturation range: [0, 1]
    // expected lightness range: [0, 1]
    function hslToRgb(hue, saturation, lightness) { // SOURCE: https://stackoverflow.com/questions/27653757/how-to-use-hsl-to-rgb-conversion-function/27663212#27663212
        var red, green, blue;
        // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
        if (hue == undefined) return [0, 0, 0];
        var chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation,
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
        var lightnessAdjustment = lightness - (chroma / 2);
        red += lightnessAdjustment;
        green += lightnessAdjustment;
        blue += lightnessAdjustment;
        return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
    };
    // --------------------------------------------------------------------------------
    function valToColor(percent = 100, clip = 0, saturation = 1.0, start = 0, end = 100, toRGB = 0) {
        percent = Math.min(percent, 160); end = Math.min(end, 100);
        var a = (percent <= clip) ? 0 : (((percent - clip) / (100 - clip))),
            b = Math.abs(end - start) * a,
            c = (end > start) ? (start + b) : (start - b);
        var h = c, s = saturation, l = 0.5;
        if (toRGB) {
            var rgb = hslToRgb(h, s, l);
            return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
        }
        else {
            return 'hsl(' + h + ', ' + (s*100) + '%, ' + (l*100) + '%)';
        }
    };
    // ================================================================================
    function addKeyComboCtrlC(targetElement, preventDefault, ignoreSelections) {
        var keyCodes = {'c' : 67};
        var onKeyDown = function (e) {
            e = e || window.event;
            var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
            if (targetElement && ctrlDown && e.keyCode == keyCodes.c) {
                var selectedText = window.getSelection().toString();
                selectedText = ignoreSelections ? false : (selectedText && selectedText !== '');
                if (!selectedText) {
                    targetElement.select();
                    document.execCommand('copy');
                    if (preventDefault) e.preventDefault();
                }
            }
        };
        window.addEventListener('keydown', function (e) {onKeyDown(e);}, false);
    };
    // ================================================================================
    function toHHMMSS(secs) {
        var sec_num = parseInt(secs, 10);
        var hours = Math.floor(sec_num / 3600) % 24;
        var minutes = Math.floor(sec_num / 60) % 60;
        var seconds = sec_num % 60;
        return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":");
    };
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
            mediaTextIndicator.textContent = Math.round(media.volume * 100) > 0 ? Math.round(media.volume * 100) : '??N????».';
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
    function msgbox(title, message, time = 2000, width = 250, height = 120) {
        var padding = 10;
        var w = width - padding*2,
            h = height - padding*2
        ;
        var centerX = function(e, fix) {
            var transform = e.style.transform;
            transform = transform + (fix ? 'translateY(0.5px) translateX(-50%)' : 'translateX(-50%)');
            e.style.left = 50 + '%';
            e.style['-ms-transform'] = transform;
            e.style['-moz-transform'] = transform;
            e.style['-webkit-transform'] = transform;
            e.style.transform = transform;
        };
        var centerY = function(e, fix) {
            var transform = e.style.transform;
            transform = transform + (fix ? 'translateX(0.5px) translateY(-50%)' : 'translateY(-50%)');
            e.style.top = 50 + '%';
            e.style['-ms-transform'] = transform;
            e.style['-moz-transform'] = transform;
            e.style['-webkit-transform'] = transform;
            e.style.transform = transform;
        };
        var fade = function(element, fadeDelay) {
            fadeDelay = fadeDelay || 2000;
            var fadeDelaySeconds = Math.floor(fadeDelay/1000);
            function fadeStart(show) {
                var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                element.style.opacity = show ? 1 : 0;
                element.style.transition = transition;
                element.style['-webkit-transition'] = transition; // Safari
                if (!show) setTimeout(function(){element.remove();}, fadeDelay);
            }
            fadeStart(true);
            setTimeout(fadeStart, fadeDelaySeconds*1000);
        };
        var d = document.createElement('div');
        d.style.display = 'table';
        d.style.position = 'fixed';
        d.style.right = 10 + 'px';
        d.style.bottom = 10 + 'px';
        d.style.maxWidth = 90 + '%';
        d.style.maxHeight = 90 + '%';
        // d.style.padding = padding + 'px';
        d.style.width = w + 'px';
        d.style.height = 'auto';
        d.style.minHeight = h + 'px';
        d.style.setProperty('background', 'white', 'important');
        d.style.border = '2px solid black';
        d.style.zIndex = 2147483647;
        document.body.appendChild(d);
        //
        // d.style.top = 50 + 'px';
        // centerX(d);
        //
        if (title) {
            var titleElement = document.createElement('p');
            titleElement.style.borderBottom = '1px solid black';
            titleElement.style.margin = 0;
            titleElement.style.padding = (padding/2) + 'px';
            titleElement.style.setProperty('background', '#4CAF50', 'important');
            titleElement.style.setProperty('color', 'white', 'important');
            titleElement.innerText = title;
            d.appendChild(titleElement);
        }
        if (message) {
            var messageElement = document.createElement('p');
            messageElement.style.margin = 0;
            messageElement.style.padding = (padding/2) + 'px';
            messageElement.style.display = 'table-row';
            messageElement.style.textAlign = 'center';
            messageElement.style.verticalAlign = 'middle';
            messageElement.style.setProperty('color', 'black', 'important');
            messageElement.innerText = message;
            d.appendChild(messageElement);
        }
        if (time) fade(d, time);
        return d;
    }
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
        if (media.addEventListener) {
            eventCatcher.addEventListener("mousewheel", mouseWheelTimeHandler, false); // IE9, Chrome, Safari, Opera
            eventCatcher.addEventListener("DOMMouseScroll", mouseWheelTimeHandler, false); // Firefox
        }
        else {
            eventCatcher.attachEvent("onmousewheel", mouseWheelTimeHandler); // IE 6/7/8
        }
        var mediaTextIndicator = addMediaTextIndicator(media, 56/2);
        mediaTextIndicator.style.top = '5px';
    };
    // ================================================================================
    function CreateLinksList(Haystack, NeedleRegEx, Replacement, StartNum, EndNum) {
        var Ret = [];
        if (Haystack.match(NeedleRegEx)) {
            var Result = Haystack.replace(NeedleRegEx, Replacement);
            StartNum = StartNum > 1 ? StartNum : 1; EndNum = EndNum > 1 ? EndNum : 1;
            for (let i = StartNum; i < EndNum; i++) {
                Ret[i] = Result.replace('$NUM', i);
            }
            // console.log('G_posters:\n', G_posters);
            return Ret;
        }
    };
    // ================================================================================
    function injectNode(tagName, parentNode, innerHTML) {
        var e = document.createElement(tagName);
        if (typeof parentNode == "string") parentNode = document.querySelector(parentNode);
        parentNode.appendChild(e);
        if (innerHTML) e.innerHTML = innerHTML;
        return e;
    }
    // ================================================================================
    function getWindowVar(varName) {
        var script = injectNode('script', document.head, 'function getVar(varName){return window[varName];}');
        var result = unsafeWindow.getVar(varName);
        script.remove();
        return result;
    }
    // ================================================================================
    if (location.href.match('autoplay=true')) {
        GM_setValue('autoplay', true);
        var autoplay = GM_getValue('autoplay', null);
    };
    var duration = location.href.match(/\bt\b=((\d+)(,\d+)?)/);
    if (duration) {
        GM_setValue('t', duration[1]);
        var t = GM_getValue('t', null);
    };
    // ================================================================================
    function refineVideo(url, noPlayerExtension = false) {
        var autoplay = GM_getValue('autoplay', null), t = GM_getValue('t', null);
        console.log('autoplay: ' + autoplay || 'false');
        // alert('autoplay: ' + autoplay || 'false');
        var url_base = url.split('?')[1] ? url.split('?')[0] : url,
            url_keys = url.split('?')[1] ? url.split('?')[1] : null
        ;
        if (autoplay) {
            if (url_keys) {if (!url_keys.match('&autoplay=true')) {url = url + '&autoplay=true';}}
            else {url = url + '?autoplay=true'; url_keys = url.replace(url_base, '');}
            GM_deleteValue('autoplay');
        }
        if (t) {
            console.log('t: ' + t);
            if (url_keys) {if (!url_keys.match('&t=' + t)) {url = url + '&t=' + t;}}
            else {url = url + '?t=' + t; url_keys = url.replace(url_base, '');}
            GM_deleteValue('t');
        }
        // alert(url);
        // alert(url_keys);
        var isInstalled = document.documentElement.getAttribute('clean-media-page-extension-installed');
        var playerPath = 'chrome-extension://bbaidcdbgbiachhpighhjgbeahoikjbp/player.html';
        // alert(window.location.href + '\nisInstalled:' + isInstalled);
        if (noPlayerExtension) {
            playerPath = location.protocol + '//' + G_pageDomain + '/v/404/';
            return playerPath + url;
        }
        return playerPath + '#' + url;
    };
    var openURL = function (url) {
        log(G_debugMode, 'openURL.url: ' + url);
        GM_deleteValue('contentURL');
        // if (TEST_MODE) return;
        /*window.*/ location.href = url;
    };
    // ================================================================================
    var G_embedCodeFrame, G_stickTo, G_stickPosition; function addEmbedCodeFrame() {
        var parentDocument = document;
        // --------------------------------------------------------------------------------
        var elementID = 'uniqueEmbedCodeFrame';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = parentDocument.createElement('div');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'block', 'important');
        element.style['word-wrap'] = 'break-word';
        // --------------------------------------------------------------------------------
        element.appendElement(G_stickTo, G_stickPosition);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeTextArea, G_embedCodeTextAreaColor = 'grey'; function addEmbedCodeTextArea(embedCodeFrame) {
        var elementID = 'uniqueEmbedCodeTextArea';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('textarea');
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
        // element.value = '';
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodePoster, G_posterURL, G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
    function addEmbedCodePoster(embedCodeFrame, onClickFunc) {
        var elementID = 'uniqueEmbedCodePoster';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('img');
        element.setAttribute('id', elementID);
        element.style.setProperty('display', 'inline-block', 'important');
        element.style['vertical-align'] = 'inherit';
        element.style['max-height'] = '120px';
        // element.style['min-width'] = '90px';
        element.style.width = 'auto';
        element.style.height = 'auto';
        element.style['min-width'] = '215px';
        element.style.height = '120px';
        element.setAttribute('src', G_posterURL);
        for (var key in G_posterStyle) {
            element.style[key] = G_posterStyle[key];
            console.log(key, G_posterStyle[key])
        };
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        element.addEventListener('click', onClickFunc, false);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeLink, G_contentURL; function addEmbedCodeLink(embedCodeFrame) {
        var elementID = 'uniqueEmbedCodeLink';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('a');
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
    var G_embedCodeVideo, G_sampleURL, G_videoWidth, G_videoHeight, G_videoQuality, G_forceLoad = true; function addEmbedCodeVideo(embedCodeFrame, onClickFunc, onLoadFunc, onErrorFunc, forceLoad = false) {
        var elementID = 'uniqueEmbedCodeVideo';
        for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        var element = document.createElement('video');
        element.setAttribute('id', elementID);
        element.style = G_embedCodePoster.getAttribute('style');
        // element.style.display = 'none';
        element.style['border-style'] = 'solid';
        element.style['border-width'] = '1px';
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
            G_videoQuality = G_videoQuality || G_videoHeight;
            if (onLoadFunc && (typeof onLoadFunc).toLowerCase() == 'function') onLoadFunc();
        });
        element.addEventListener('error', function(e) {
            if (onErrorFunc && (typeof onErrorFunc).toLowerCase() == 'function') onErrorFunc();
        });
        // --------------------------------------------------------------------------------
        if (forceLoad) {
            element.setAttribute('controls', '');
            setTimeout(function() {
                element.addEventListener('loadedmetadata', function(e) {e.target.remove();});
                element.play();
            }, 250);
        }
        // --------------------------------------------------------------------------------
        element.setAttribute('src', G_sampleURL);
        // --------------------------------------------------------------------------------
        return element;
    }
    // --------------------------------------------------------------------------------
    var G_embedCodeText, G_contentTitle, G_altText, G_delimiter; function updateEmbedCodeText(embedCodeTextArea, startNew = 0, delimiter = '') {
        // G_contentTitle = G_contentTitle ? G_contentTitle : document.title.replace(/^.{1} /i, '').capitalize();
        // --------------------------------------------------------------------------------
        if (G_embedCodeText && !startNew) G_embedCodeText += '\n<div class="thumbnail"'; else G_embedCodeText = '<div class="thumbnail"';
        if (G_contentURL !== G_pageURL) G_embedCodeText += ' title="' + G_contentTitle + '"';
        if (G_posterURL && G_posterURL !== G_contentURL) G_embedCodeText += ' data-image="' + G_posterURL + '"';
        G_embedCodeText += ' data-content="' + G_contentURL + '"';
        if (G_contentURL !== G_pageURL) G_embedCodeText += ' data-url="' + G_pageURL + '"';
        if (G_altText) G_embedCodeText += ' alt="' + G_altText + '"';
        // if (G_videoQuality) G_embedCodeText += ' data-quality="' + G_videoQuality + 'p"';
        if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality="' + G_videoWidth + 'x' + G_videoHeight + '"';
        G_embedCodeText += ' data-categories="all,"';
        G_embedCodeText += '></div>';
        // --------------------------------------------------------------------------------
        embedCodeTextArea.value = delimiter ? delimiter + G_embedCodeText : G_embedCodeText;
        // --------------------------------------------------------------------------------
        return G_embedCodeText;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodePosterSelector, G_postersArray = [];
    function addEmbedCodePosterSelector(URLArray) {
        if (URLArray.length > 1) {
            var elementID = 'uniqueEmbedCodePosterSelector';
            for (let element of document.querySelectorAll('#' + elementID)) {element.remove();};
            // --------------------------------------------------------------------------------
            var element = document.createElement('div');
            element.setAttribute('id', elementID);
            G_embedCodeFrame.appendChild(element);
            function updateMainPoster(e) {
                var img = e.target;
                G_posterURL = img.getAttribute('src');
                updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                // G_embedCodeTextArea.value = G_embedCodeText;
                G_embedCodePoster.setAttribute('src', G_posterURL);
            }
            for (let posterURL of URLArray) {
                var img = document.createElement('img');
                img.setAttribute('style', G_embedCodePoster.getAttribute('style'));
                img.style.zoom = 0.5;
                img.setAttribute('src', posterURL);
                img.setAttribute('onerror', 'this.remove();');
                G_embedCodeFrame.appendChild(img);
                img.addEventListener('click', updateMainPoster.bind(this), false);
            }
            //
            G_embedCodePoster.style.position = 'fixed';
            G_embedCodePoster.style.bottom = '10px';
            G_embedCodePoster.style.right = '10px';
            G_embedCodePoster.style.zIndex = '2147483647';
            //
            G_embedCodePosterSelector = element;
            return element;
        }
    }
    // ================================================================================
    var G_noPlayerExtension = false, G_standartReCastFunc = function() {
        var media = G_funcResult, contentURL = G_contentURL ? G_contentURL : media.src;
        if (!contentURL.match(/^http/) && !contentURL.match(/^[/]/)) contentURL = (location.protocol + '//' + G_pageDomain) + G_contentURL;
        console.log('contentURL: ', contentURL);
        G_funcToTest = function() {
            if (window.top === window.self) {
                return 1;
            }
            var queryURL = GM_getValue('queryURL', null);
            return (G_pageURL == queryURL || G_pageURL.match(queryURL) || !queryURL);
        };
        G_funcToRun = function() {
            var queryURL = GM_getValue('queryURL', null);
            GM_setValue('queryURL', null); //  GM_deleteValue('queryURL');
            console.log('queryURL: ', queryURL);
            var mediaData = {};
            mediaData.url = queryURL;
            mediaData.src = contentURL;
            mediaData.refined = refineVideo(contentURL, G_noPlayerExtension);
            mediaData.width = media.videoWidth;
            mediaData.height = media.videoHeight;
            //
            if (window.top === window.self) {
                // alert(1);
                GM_setValue('mediaData', mediaData);
                openURL(mediaData.refined);
                window.close();
            }
            else {
                // alert(queryURL+'\n'+G_pageURL);
                //if (G_pageURL.match(queryURL)) {
                // alert(3);
                GM_setValue('mediaData', mediaData);
                openURL(mediaData.refined);
                //}
                //else {
                //alert(2);
                //};
            };
        };
        waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries*2, G_timerGroup);
    };
    // ================================================================================
    function updateEmbedCodeTextColor() {
        var quality = (G_videoWidth && G_videoHeight) ? ((G_videoWidth * G_videoHeight) / (1920 * 1080)) : (G_videoQuality / 1080);
        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        G_embedCodeTextAreaColor = valToColor(quality * 100, 1, 1.0, 0, 100, 1);
        G_embedCodeTextArea.style.color = G_embedCodeTextAreaColor;
        log(G_debugMode, G_embedCodeTextAreaColor);
        // new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+Array(1e3).join(123)).play();
        // var A, o = (A = new AudioContext()).createOscillator(); o.connect(A.destination); o.start(0); setTimeout(function(){o.stop(0)}, 200);
        msgbox('Video', (G_videoWidth + ' x ' + G_videoHeight) + '\n' + G_sampleURL.replace(/.*?:\/\/(.*?)\/.*/, '$1'), 3000);
    };
    // ================================================================================
    var G_noQualitySample = false, G_qualitySampleSource = null, G_queryURL = null, G_standartAddEmbedCodeFunc = function() {
        // --------------------------------------------------------------------------------
        G_contentTitle = G_contentTitle ? G_contentTitle : document.title.replace(/^.{1} /i, '').capitalize();
        G_delimiter = ''; // '<!-- ' + G_contentTitle + ' -->\n';
        G_embedCodeFrame = addEmbedCodeFrame(G_funcToRun);
        G_embedCodeTextArea = addEmbedCodeTextArea(G_embedCodeFrame);
        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        G_embedCodeLink = addEmbedCodeLink(G_embedCodeFrame);
        G_embedCodePoster = addEmbedCodePoster(G_embedCodeFrame, G_funcToRun);
        if (G_qualitySampleSource) {
            // document.querySelector('#EPvideo_html5_api').addEventListener('play', function(e) {
            G_qualitySampleSource.addEventListener('playing', function(e) {
                G_sampleURL = e.target.src;
                G_videoWidth = e.target.videoWidth;
                G_videoHeight = e.target.videoHeight;
                G_videoQuality = G_videoHeight;
                updateEmbedCodeTextColor();
            });
        }
        else {
            if (G_sampleURL && !G_noQualitySample) {
                G_embedCodeVideo = addEmbedCodeVideo(G_embedCodeFrame, G_funcToRun, function onLoadFunc() {
                    updateEmbedCodeTextColor();
                }, function onErrorFunc() {
                    log(G_debugMode, 'G_embedCodeVideo: onErrorFunc');
                    updateEmbedCodeTextColor();
                }, G_forceLoad);
            }
        }
        addKeyComboCtrlC(G_embedCodeTextArea, 1, 0);
        if (G_postersArray && G_postersArray.length > 1) G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
        // --------------------------------------------------------------------------------
        GM_setValue('queryURL', null); //  GM_deleteValue('queryURL');
        if (G_queryURL) {
            GM_setValue('queryURL', G_queryURL);
            GM_setValue('mediaData', null); GM_addValueChangeListener('mediaData', function(name, old_value, new_value, remote) {
                if (new_value.url == G_queryURL) {
                    console.log('mediaData:', new_value);
                    G_sampleURL = new_value.src;
                    G_videoWidth = new_value.width;
                    G_videoHeight = new_value.height;
                    G_embedCodeVideo = addEmbedCodeVideo(G_embedCodeFrame, G_funcToRun, function onLoadFunc() {
                        updateEmbedCodeTextColor();
                    }, function onErrorFunc() {
                        log(G_debugMode, 'G_embedCodeVideo: onErrorFunc');
                        updateEmbedCodeTextColor();
                    }, G_forceLoad);
                }
            });
        }
        // --------------------------------------------------------------------------------
        log(G_debugMode, G_contentURL, '\n', G_sampleURL, '\n', G_posterURL);
    };
    // ================================================================================
    // getCookie(), setCookie(), deleteCookie() -- https://gist.github.com/akaramires/7577298
    function getCookie(name) { // возвращает cookie если есть или undefined
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
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
        var exp = props.expires;
        if (typeof exp == "number" && exp) {
            var d = new Date();
            d.setTime(d.getTime() + exp*1000);
            exp = props.expires = d;
        }
        if (exp && exp.toUTCString) props.expires = exp.toUTCString();
        value = encodeURIComponent(value)
        for (let propName in props) {if (propName == name) props[propName] = value;};
        var updatedProps = {}; for (let propName in props) {
            if (!updatedProps[propName]) updatedProps[propName] = props[propName];
        };
        var updatedCookie = ''; for (let propName in updatedProps) {
            updatedCookie += (propName + '=' + updatedProps[propName] + "; ");
        };
        document.cookie = updatedCookie.trim();
    }
    // --------------------------------------------------------------------------------
    function deleteCookie(name) { // удаляет cookie
        setCookie(name, null, { expires: -1 });
    }
    // ================================================================================
    if (
        G_pageURL.matchLink('#ReCast')
    ) {
        GM_setValue('mediaData', null); GM_addValueChangeListener('mediaData', function(name, old_value, new_value, remote) {
            window.close();
        })
        // return
    }
    else if (
        G_pageURL.matchLink('file:///*/2.*.*.html')
    ) {
        GM_setValue('mediaData', null); GM_addValueChangeListener('mediaData', function(name, old_value, new_value, remote) {
            if (new_value && new_value != "") {
                var outputs = document.getElementById('content'), iframeOutput, imgOutput, outputsArray = [];
                if (outputs) {
                    iframeOutput = outputs.querySelector('#content_iframe');
                    imgOutput = outputs.querySelector('#content_img');
                    outputsArray.push(iframeOutput, imgOutput);
                    if (iframeOutput.style.display == 'block') {
                        iframeOutput.src = new_value.refined; //+ '?autoplay=true'; // refineVideo(videoURL);
                        // GM_deleteValue('mediaData');
                    }
                }
            }
        })
        return
    }
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
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                /*
                setTimeout(function() {
                    var eventCatcher = document.querySelector('div#moviexxx'), media = document.querySelector('body video[src]');
                    if (eventCatcher && media) {mediaMouseControls(eventCatcher, media, 1);}
                }, 500);
                */
            };
            // waitForElement('#embright > .textare1 > textarea', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            waitForElement('#EPvideo_html5_api', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://www.eporner.com/embed/*') || // https://www.eporner.com/embed/uCS7LAWJ70b
            G_pageURL.matchLink('https?://www.eporner.eu/embed/*')
        ) {
            G_funcToTest = function () {
                return document.querySelector('body video[src]') && document.querySelector('head > meta[itemprop="contentUrl"][content]');
            };
            G_funcToRun = function() {
                // --------------------------------------------------------------------------------
                var maxQuality = 0, menuItem;
                for (let item of document.querySelectorAll('.vjs-menu-content > .vjs-menu-item')) {
                    var button = item.querySelector('.vjs-menu-item-text');
                    var text = button ? button.innerText : '';
                    var buttonQuality = Number(text.match(/\d+/));
                    if (buttonQuality > maxQuality) { maxQuality = buttonQuality; menuItem = item; }
                }
                // --------------------------------------------------------------------------------
                if (menuItem) menuItem.click();
                // --------------------------------------------------------------------------------
                var video = document.querySelector('body video'), src = video.src;
                if (src.match('blob:')) {
                    var content = document.querySelector('head > meta[itemprop="contentUrl"]').content;
                    video.src = content;
                    waitForCondition(
                        function() {return video.src != content;},
                        function() {
                            G_contentURL = video.src;
                            log(G_debugMode, 'G_contentURL:', G_contentURL);
                            openURL(refineVideo(G_contentURL));
                        }, G_delay, G_tries, G_timerGroup
                    );
                }
                else {
                    G_contentURL = video.src;
                    log(G_debugMode, 'G_contentURL:', G_contentURL);
                    openURL(refineVideo(G_contentURL));
                }
                // --------------------------------------------------------------------------------
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
    }
    // ================================================================================
    else if (
        G_pageURL.matchLink('https?://yespornplease.com')
    ) {
        if (
            G_pageURL.matchLink('https?://yespornplease.com/v/*') || // https://yespornplease.com/v/306756151
            G_pageURL.matchLink('https?://yespornplease.com/view/*') // https://yespornplease.com/view/306756151
        ) {
            G_funcToRun = function() {
                // --------------------------------------------------------------------------------
                G_contentURL = document.querySelector('iframe').src.replace(/\/width-\d+\/height-\d+\//i, '/width-882/height-496/');
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]').content
                );
                // G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/itmx.yespornplease.com/'); // '/i3.yespornplease.com/'
                G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/i3.yespornplease.com/'); // '/i3.yespornplease.com/'
                console.log(G_posterURL);
                G_postersArray = CreateLinksList(G_posterURL, /^(https:\/\/)?(.*yespornplease.com)\/(\d+\/.*?\/\d+x\d+)_\d+.jpg/i, location.protocol + '//$2/$3_$NUM.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.container > .row'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_queryURL = document.querySelector('iframe').src;
                G_standartAddEmbedCodeFunc();
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('#video_embed_code', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://vshare.io/v/*/width-*/height-*/*')
    ) {
        G_noPlayerExtension = true;
        G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
        waitForElement('body video > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
    }

    else if (
        G_pageURL.matchLink('https?://www.porntrex.com/video/*/*')
    ) {
        if (G_pageURL.match('#OnlyVideo')) { // https://www.porntrex.com/video/162636/kiera-winters-sex-queen-and-her-prince#OnlyVideo
            // window.stop();
            G_funcToTest = function () {
                return typeof unsafeWindow.flashvars !== "undefined" && unsafeWindow.flashvars.video_url;
            };
            G_funcToRun = function () {
                var contentURL = (
                    unsafeWindow.flashvars.video_alt_url3 ? unsafeWindow.flashvars.video_alt_url3 :
                    unsafeWindow.flashvars.video_alt_url2 ? unsafeWindow.flashvars.video_alt_url2 :
                    unsafeWindow.flashvars.video_alt_url ? unsafeWindow.flashvars.video_alt_url :
                    unsafeWindow.flashvars.video_url
                );
                var posterURL = unsafeWindow.flashvars.preview_url;
                console.log('contentURL: ', contentURL);
                openURL(refineVideo(contentURL));
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else {
            G_funcToTest = function () {
                return typeof unsafeWindow.flashvars !== "undefined" && unsafeWindow.flashvars.video_url;
            };
            G_funcToRun = function () {
                G_contentURL = G_shortURL + '#OnlyVideo';
                G_sampleURL = (
                    unsafeWindow.flashvars.video_alt_url5 ? unsafeWindow.flashvars.video_alt_url5 :
                    unsafeWindow.flashvars.video_alt_url4 ? unsafeWindow.flashvars.video_alt_url4 :
                    unsafeWindow.flashvars.video_alt_url3 ? unsafeWindow.flashvars.video_alt_url3 : // 1080
                    unsafeWindow.flashvars.video_alt_url2 ? unsafeWindow.flashvars.video_alt_url2 :
                    unsafeWindow.flashvars.video_alt_url ? unsafeWindow.flashvars.video_alt_url :
                    unsafeWindow.flashvars.video_url
                );
                G_forceLoad = true;
                G_posterURL = G_posterURL ? G_posterURL : document.querySelector('.block-screenshots > a > img.thumb[src]').src;
                G_postersArray = CreateLinksList(G_posterURL, /^.*\/\/.*.com\/(contents\/videos_screenshots\/\d+\/\d+\/\d+x\d+)\/\d+.jpg/i, location.protocol+'//www.porntrex.com/$1/$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.video-info'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
            };
            /*
            // document.addEventListener("DOMContentLoaded", function(event) {
                waitForElement('meta[property="og:image"]', 'content', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
            */
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
    }

    else if (
        G_pageURL.matchLink('https?://yourporn.sexy/*') ||
        G_pageURL.matchLink('https?://sxyprn.com/*')
    ) {
        if (G_pageURL.match('#ReCast')) { // https://yourporn.sexy/post/59772cebee27b.html#ReCast
            // window.stop();
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForElement('body video[src] > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://yourporn.sexy/post/*') || // https://yourporn.sexy/post/56be2e8359051.html?sk=Carolina%20Abril&so=30
            G_pageURL.matchLink('https?://sxyprn.com/post/*')
        ) {
            G_funcToRun = function () {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL + '#ReCast';
                G_posterURL = G_posterURL ? G_posterURL : getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
                // G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*eporner.com\/thumbs\/.*)\/\d+_(\d+).jpg/i, '$1/$NUM_$2.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.comments_area'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_qualitySampleSource = document.querySelector('body video[src]');
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                /*
                setTimeout(function() {
                    var eventCatcher = document.querySelector('body video[src]'), media = eventCatcher;
                    if (eventCatcher && media) {mediaMouseControls(eventCatcher, media, 1);}
                }, 500);
                */
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div#player');
                    media = media ? media : eventCatcher;
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            waitForElement('body video[src] > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
    }

    else if (
        G_pageURL.matchLink('https?://*.pornhub.com/*')
    ) {
        // if (getCookie('lang') !== 'en') {deleteCookie('lang'); setCookie('lang', 'en', {expires: 0});};
        // --------------------------------------------------------------------------------
        var actualSource = () => {
            var contentURL;
            var flashvars = getWindowVar('flashvars');
            if (!flashvars) {
                for (let script of document.scripts) {
                    var text = script.text;
                    var match = text.match(/var flashvars_(.*?) = */i);
                    if (match) {
                        var id = match[1];
                        if (id) flashvars = getWindowVar('flashvars_' + id);
                        if (flashvars) break;
                    }
                }
            }
            if (flashvars) {
                var qualityTable = flashvars.defaultQuality, maxQuality = 0;
                for (let quality of qualityTable) {
                    maxQuality = quality > maxQuality && flashvars['quality_' + quality + 'p'] ? quality : maxQuality;
                }
                if (maxQuality > 0) {
                    console.log('quality: ' + maxQuality);
                    contentURL = flashvars['quality_' + maxQuality + 'p'];
                    return (contentURL); // openURL(refineVideo(contentURL));
                }
            }
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.pornhub.com/view_video.php?viewkey=ph5852ef85649df#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
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
                G_contentURL = document.querySelector('meta[name="twitter:player"]').content; //pageURL + '#ReCast';
                G_posterURL = document.querySelector('meta[name="twitter:image"]').content;
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.video-actions-container'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div#player');
                    media = media ? media : document.querySelector('div#player video > source');
                    if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('meta[name="twitter:player"]', 'content', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://*.playvids.com/*')
    ) {
        // if (getCookie('lang') !== 'en') {deleteCookie('lang'); setCookie('lang', 'en', {expires: 0});};
        // --------------------------------------------------------------------------------
        let actualSource = () => {
            var video = document.querySelector('video[data-qualities]');
            var qualities = video.dataset.qualities.split('|');
            var maxQuality = qualities[qualities.length-1];
            var contentURL = video.dataset['src' + maxQuality];
            return contentURL;
        };
        // --------------------------------------------------------------------------------
        if (G_pageURL.match('#ReCast')) { // https://www.playvids.com/z_GWEZil5lC/massagereep-s-art-of-creepy-massages-lexi-belle-fucking-sexy-wife#ReCast
            // window.stop();
            G_funcToTest = function() {return actualSource();};
            G_funcToRun = function() {G_contentURL = G_funcResult; G_standartReCastFunc();};
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.playvids.com/embed/*') // https://www.playvids.com/embed/z_GWEZil5lC
        ) {
            G_funcToRun = function () {
                G_contentURL = actualSource();
                G_contentURL = G_contentURL ? G_contentURL : G_funcResult.src;
                if (G_contentURL) openURL(refineVideo(G_contentURL));
            };
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        // --------------------------------------------------------------------------------
        else if (
            G_pageURL.matchLink('https?://www.playvids.com/*/*') // https://www.playvids.com/z_GWEZil5lC/massagereep-s-art-of-creepy-massages-lexi-belle-fucking-sexy-wife
        ) {
            G_funcToRun = function () {
                G_sampleURL = actualSource();
                // G_contentURL = document.querySelector('link[rel="canonical"]').href; //pageURL + '#ReCast';
                G_contentURL = document.querySelector('video[data-qualities]').dataset.embed;
                G_posterURL = document.querySelector('meta[property="og:image"]').content;
                // G_posterStyle = {'width' : 'auto', 'min-height' : '162px', 'min-width' : 'auto', 'max-height' :  'auto', 'height' : 'auto', 'zoom' : '0.5'};
                // G_postersArray = CreateLinksList(G_posterURL, /^(.*?)\d+.jpg$/i, '$1$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.channel-info'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
                var eventCatcher, media;
                waitForCondition(function(){
                    eventCatcher = eventCatcher ? eventCatcher : document.querySelector('div.mediaPlayerContainer');
                    media = media ? media : document.querySelector('video[data-qualities]'); // document.querySelector('div#player video > source');
                    // if (media) {media = media.parentNode};
                    return eventCatcher && media;
                }, function() {
                    mediaMouseControls(eventCatcher, media, 1);
                }, G_delay, G_tries, G_timerGroup);
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('video[data-qualities]', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://www.youjizz.com/videos/*.html')
    ) {
        if (G_pageURL.match('#OnlyVideo')) { // https://www.youjizz.com/videos/hot-white-girl-smooth-massage-32782801.html#OnlyVideo
            // window.stop();
            G_funcToTest = function () {
                return typeof unsafeWindow.mp4Encodings !== "undefined" && unsafeWindow.mp4Encodings[0];
            };
            G_funcToRun = function () {
                var contentURL = location.protocol + unsafeWindow.mp4Encodings[unsafeWindow.mp4Encodings.length-1].filename;
                console.log('contentURL: ', contentURL);
                // alert(refineVideo(contentURL));
                openURL(refineVideo(contentURL));
            };
            waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else {
            G_funcToTest = function () {
                return typeof unsafeWindow.mp4Encodings !== "undefined" && unsafeWindow.mp4Encodings[0];
            };
            G_funcToRun = function () {
                G_contentURL = G_shortURL + '#OnlyVideo';
                G_sampleURL = location.protocol + unsafeWindow.mp4Encodings[0].filename;
                // G_forceLoad = true;
                G_posterURL = G_posterURL ? G_posterURL : location.protocol + document.querySelector('div[poster]').getAttribute('poster');
                G_postersArray = CreateLinksList(G_posterURL, /^.*\/\/(.*.com\/(.*?))-\d+.jpg/i, location.protocol+'//$1-$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.video-info'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
            };
            waitForElement('div[poster]', 'poster', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
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
                G_queryURL = G_contentURL;
                G_standartAddEmbedCodeFunc();
            };
            function initFunc(e) {
                waitForElement('#playerbox > iframe[src^="http"]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            }
            // document.addEventListener("DOMContentLoaded", function(event) {
            for (let button of document.querySelectorAll('.controls > .r > a[href^="#server"]')) {
                button.addEventListener('click', initFunc);
            }
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https?://hqporner.com')
    ) {
        if (
            G_pageURL.matchLink('https?://hqporner.com/hdporn/*') // https://hqporner.com/hdporn/83708-cute_teen_tied_to_tree_and_fucked.html
        ) {
            G_funcToRun = function() {
                // --------------------------------------------------------------------------------
                G_contentURL = document.querySelector('iframe').src;
                G_posterURL = (
                    document.querySelector('meta[name="thumbnail"]') ?
                    document.querySelector('meta[name="thumbnail"]').content :
                    document.querySelector('meta[property="og:image"]') ?
                    document.querySelector('meta[property="og:image"]').content
                    : ''
                );
                // G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/itmx.yespornplease.com/'); // '/i3.yespornplease.com/'
                // G_posterURL = G_posterURL.replace('/yespornplease.com/images/', '/i3.yespornplease.com/'); // '/i3.yespornplease.com/'
                console.log(G_posterURL);
                // G_postersArray = CreateLinksList(G_posterURL, /^(https:\/\/)?(.*yespornplease.com)\/(\d+\/.*?\/\d+x\d+)_\d+.jpg/i, location.protocol + '//$2/$3_$NUM.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.content.content-left > div.box.page-content'); G_stickPosition = 1;
                // --------------------------------------------------------------------------------
                G_queryURL = document.querySelector('iframe').src;
                G_standartAddEmbedCodeFunc();
            };
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('iframe', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        }
    }

    else if (
        G_pageURL.matchLink('https://mydaddy.cc/video/*/')
    ) {
        // G_noPlayerExtension = true;
        let regExp = /file:."(.*?\/(\d+)\.mp4)"/gi, matchedScriptText;
        let getMatchedScriptText = function(regExp) {
            for (let script of document.scripts) {
                let text = script.text;
                if (text.match(regExp)) {
                    return(text);
                };
            };
        };
        G_funcToTest = function() {
            matchedScriptText = getMatchedScriptText(regExp);
            return matchedScriptText;
        };
        G_funcToRun = function() {
            // --------------------------------------------------------------------------------
            let data = {}, result; while((result = regExp.exec(matchedScriptText)) !== null) {
                let url = result[1].trim();
                let quality = Math.floor(result[2].trim());
                data[quality] = url;
                // console.log('url:', url);
                // console.log('quality:', quality);
            };
            console.log('data:', data);
            let compare = 0; for (let quality of Object.keys(data)) {
                if (quality > compare) {
                    G_contentURL = location.protocol + data[quality];
                    console.log('url:', G_contentURL);
                    console.log('quality:', quality);
                };
            };
            console.log('G_contentURL:', G_contentURL);
            // return;
            // --------------------------------------------------------------------------------
            G_standartReCastFunc();
        };
        // waitForElement('body video > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
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
        G_pageURL.matchLink('https?://oload.*/embed/*') // https://oload.download/embed/KPgg6tUV_n0/16396.mp4
    ) {
        var src_span = document.querySelector('#streamurl') || document.querySelector('span[id^="stream"]');
        G_funcToTest = function () {
            var ready, url = src_span;
            if (url && url.innerText.trim() !== '' && !url.innerText.toLowerCase().match("HERE IS THE LINK".toLowerCase())) ready = true;
            else {
                if (!src_span) {
                    document.querySelectorAll('div > p, span').forEach(function (item) { // https://www.eporner.com/embed/HYmQUXbhRrR
                        var text = item.innerText;
                        // var match = text.match(/^[\w\d]+-w~\d+~\d+\.\d+\.\d+\.\d+\~[\w\d]+$/); // https://openload.co/embed/en5tCxDT7-w/
                        // http://pron.tv/l/Jenna-Reid-MP4-mp4/ezcexss2 // yybXOZwKGAg~1523412842~37.25.0.0~_27EYtA9
                        var match = text.match(/^.+~\d+~\d+\.\d+\.\d+\.\d+~.+$/);
                        if (match && match[0]) {
                            src_span = document.createElement('span');
                            src_span.id = '#streamurl';
                            src_span.innerText = text;
                            document.body.appendChild(src_span);
                            src_span = item;
                            ready = true;
                        }
                    });
                }
            }
            return ready;
        };
        G_funcToRun = function () {
            var url = src_span;
            var contentURL = location.protocol + '//' + location.host + '/stream/' + url.innerText + '?mime=true';
            // var posterURL = document.querySelector('#olvideo_html5_api').poster;
            console.log('contentURL: ', contentURL);
            // G_contentURL = contentURL; G_standartReCastFunc();
            //
            var queryURL = GM_getValue('queryURL', null);
            var mediaData = {};
            mediaData.url = queryURL;
            mediaData.src = contentURL;
            GM_setValue('mediaData', mediaData);
            //
            openURL(refineVideo(contentURL));
        };
        waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
        // document.addEventListener('DOMContentLoaded', funcToRun, false);
        // ================================================================================
    }

    else if (
        G_pageURL.matchLink('https?://www.jjgirls.com/*')
    ) {
        // addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
        if (
            G_pageURL.matchLink('https?://www.jjgirls.com/pornpics/*') // https://www.jjgirls.com/pornpics/prettydirty-gina-valentina-brunette-latina-pee-wet
        ) {
            G_funcToRun = function () {
                var imagesArray = [], thumbsArray = [];
                for (let link of document.querySelectorAll('div.related > a[href*="://pics.jjgirls.com/pictures/"]')) {
                    var imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        var thumbURL = ''; //img.src;
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    }
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
                }
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            waitForElement('div.related > a[href^=http]', 'href', G_funcToRun, G_delay, G_tries, G_timerGroup);
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
                var imagesArray = [], thumbsArray = [];
                for (let link of document.querySelectorAll('div.my_gallery figure > a[href]')) {
                    var imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        var thumbURL = img.src;
                        // var imageURL = thumbURL.replace(/(.*)\/t(\d+.jpg)/i, '$1/$2'); // http://static.babesandstars.com/galleries/62000/62874/t07.jpg --> http://static.babesandstars.com/galleries/62000/62874/07.jpg
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    }
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
                }
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('div.my_gallery figure > a[href] img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
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
                var imagesArray = [], thumbsArray = [];
                for (let link of document.querySelectorAll('div.gallery div.thumbnails a[href]')) {
                    var imageURL = link.href, img = link.querySelector('img');
                    if (img) {
                        var thumbURL = img.src;
                        thumbsArray.push(thumbURL);
                        imagesArray.push(imageURL);
                    }
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
                }
                // G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
            // document.addEventListener("DOMContentLoaded", function(event) {
            waitForElement('div.gallery div.thumbnails a[href] img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
            // });
        };
    }

    else if (
        G_pageURL.matchLink('*.jpg')
    ) {
        G_funcToRun = function () {
            var val = 0;
            G_contentURL = G_shortURL;
            G_posterURL = G_shortURL;
            G_stickTo = document.querySelector('body'); G_stickPosition = 0;
            G_standartAddEmbedCodeFunc();
        };
        waitForElement('img', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        return; // SKIP REST OF THE CODE
    }

    else {
        // alert(G_pageURL);
    }
})();