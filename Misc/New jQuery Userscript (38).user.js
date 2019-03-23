// ==UserScript==
// @name         New jQuery Userscript
// @icon         https://www.google.com/s2/favicons?domain=jquery.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @match        http://*/*
// @match        https://*/*
// @match        file:///*/2.*.*.html
// @exclude      *://vshare.io/v/404/*
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
            function clearTimers(timerGroup) {for (var timer of timerGroup) {clearTimeout(timer);}};
            // --------------------------------------------------------------------------------
            function iteration(count) {
                var state;
                if (tries && (count < tries)) {
                    var G_funcResult = funcToTest();
                    if (G_funcResult) {
                        state = 'SUCCESS'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
                        clearTimers(timerGroup);
                        funcToRun();
                        return;
                    }
                    else {
                        state = 'keepRun'; log(0, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
                        startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
                    }
                }
                else {
                    state = 'FAIL'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
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
            for (var element of elementsArray) {
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
    String.prototype.matchLink = function (link, flags) {
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
    var toHHMMSS = function(secs) {
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
            for (var i = StartNum; i < EndNum; i++) {
                Ret[i] = Result.replace('$NUM', i);
            }
            // console.log('G_posters:\n', G_posters);
            return Ret;
        }
    };
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
        var url_base = url.split('?')[1] ? url.split('?')[0] : url, url_keys = url.split('?')[1] ? url.split('?')[1] : null;
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
        var playerPath = 'chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html';
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
        var elementID = 'uniqueEmbedCodeFrame', element;
        for (element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        element = parentDocument.createElement('div');
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
        var elementID = 'uniqueEmbedCodeTextArea', element;
        for (element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        element = document.createElement('textarea');
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
    var G_embedCodePoster, G_posterURL; function addEmbedCodePoster(embedCodeFrame, onClickFunc) {
        var elementID = 'uniqueEmbedCodePoster', element;
        for (element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        element = document.createElement('img');
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
        // --------------------------------------------------------------------------------
        embedCodeFrame.appendChild(element);
        // --------------------------------------------------------------------------------
        element.addEventListener('click', onClickFunc, false);
        // --------------------------------------------------------------------------------
        return element;
    };
    // --------------------------------------------------------------------------------
    var G_embedCodeLink, G_contentURL; function addEmbedCodeLink(embedCodeFrame) {
        var elementID = 'uniqueEmbedCodeLink', element;
        for (element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        element = document.createElement('a');
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
    var G_embedCodeVideo, G_sampleURL, G_videoWidth, G_videoHeight, G_videoQuality; function addEmbedCodeVideo(embedCodeFrame, onClickFunc, onLoadFunc, onErrorFunc, forceLoad = false) {
        var elementID = 'uniqueEmbedCodeVideo', element;
        for (element of document.querySelectorAll('#' + elementID)) {element.remove();};
        // --------------------------------------------------------------------------------
        element = document.createElement('video');
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
            element.addEventListener('playing', function(e) {e.target.remove();});
            element.setAttribute('controls', '');
            setTimeout(element.play(), 250);
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
            var elementID = 'uniqueEmbedCodePosterSelector', element;
            for (element of document.querySelectorAll('#' + elementID)) {element.remove();};
            // --------------------------------------------------------------------------------
            element = document.createElement('div');
            element.setAttribute('id', elementID);
            G_embedCodeFrame.appendChild(element);
            function updateMainPoster(e) {
                var img = e.target;
                G_posterURL = img.getAttribute('src');
                updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                // G_embedCodeTextArea.value = G_embedCodeText;
                G_embedCodePoster.setAttribute('src', G_posterURL);
            }
            for (var posterURL of URLArray) {
                var img = document.createElement('img');
                img.setAttribute('style', G_embedCodePoster.getAttribute('style'));
                img.style.zoom = 0.5;
                img.setAttribute('src', posterURL);
                img.setAttribute('onerror', 'this.remove();');
                G_embedCodeFrame.appendChild(img);
                img.addEventListener('click', updateMainPoster.bind(this), false);
            }
            G_embedCodePosterSelector = element;
            return element;
        }
    }
    // ================================================================================
    var G_noPlayerExtension = false, G_standartReCastFunc = function() {
        var contentURL = G_funcResult.src;
        console.log('contentURL: ', contentURL);
        //
        var queryURL = GM_getValue('queryURL', null);
        var mediaData = {};
        mediaData.url = queryURL;
        mediaData.src = contentURL;
        mediaData.refined = refineVideo(contentURL, G_noPlayerExtension);
        mediaData.width = G_funcResult.videoWidth;
        mediaData.height = G_funcResult.videoHeight;
        //
        if (window.top === window.self) {
            // alert(1);
            GM_setValue('mediaData', mediaData);
            openURL(mediaData.refined);
            window.close();
        }
        else {
            // alert(queryURL+'\n'+G_pageURL);
            if (G_pageURL.match(queryURL)) {
                // alert(3);
                GM_setValue('mediaData', mediaData);
                openURL(mediaData.refined);
            }
            else {
                // alert(2);
            }
        }
    };
    //
    var G_noQualitySample = false, G_qualitySampleSource = null, G_queryURL = null, G_standartAddEmbedCodeFunc = function() {
        // --------------------------------------------------------------------------------
        G_contentTitle = G_contentTitle ? G_contentTitle : document.title.replace(/^.{1} /i, '').capitalize();
        G_delimiter = '<!-- ' + G_contentTitle + ' -->\n';
        G_embedCodeFrame = addEmbedCodeFrame(G_funcToRun);
        G_embedCodeTextArea = addEmbedCodeTextArea(G_embedCodeFrame);
        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
        G_embedCodeLink = addEmbedCodeLink(G_embedCodeFrame);
        G_embedCodePoster = addEmbedCodePoster(G_embedCodeFrame, G_funcToRun);
        if (G_qualitySampleSource) {
            // document.querySelector('#EPvideo_html5_api').addEventListener('play', function(e) {
            G_qualitySampleSource.addEventListener('playing', function(e) {
                G_videoWidth = e.target.videoWidth;
                G_videoHeight = e.target.videoHeight;
                G_videoQuality = G_videoHeight;
                //
                G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                G_embedCodeTextAreaColor = valToColor((G_videoWidth * G_videoHeight) / (2048 * 1080) * 100, 1, 1.0, 0, 100, 1);
                G_embedCodeTextArea.style.color = G_embedCodeTextAreaColor;
                log(G_debugMode, G_embedCodeTextAreaColor);
            });
        }
        else {
            if (G_sampleURL && !G_noQualitySample) {
                G_embedCodeVideo = addEmbedCodeVideo(G_embedCodeFrame, G_funcToRun, function onLoadFunc() {
                    G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                    G_embedCodeTextAreaColor = valToColor((G_videoWidth * G_videoHeight) / (2048 * 1080) * 100, 1, 1.0, 0, 100, 1);
                    G_embedCodeTextArea.style.color = G_embedCodeTextAreaColor;
                    log(G_debugMode, G_embedCodeTextAreaColor);
                }, function onErrorFunc() {
                    log(G_debugMode, 'G_embedCodeVideo: onErrorFunc');
                    G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                    G_embedCodeTextAreaColor = valToColor((G_videoQuality / 1080) * 100, 1, 0.5, 0, 100, 1);
                    G_embedCodeTextArea.style.color = G_embedCodeTextAreaColor;
                    log(G_debugMode, G_embedCodeTextAreaColor);
                });
            }
        }
        addKeyComboCtrlC(G_embedCodeTextArea, 1, 0);
        if (G_postersArray && G_postersArray.length > 1) G_embedCodePosterSelector = addEmbedCodePosterSelector(G_postersArray);
        // --------------------------------------------------------------------------------
        GM_deleteValue('queryURL');
        if (G_queryURL) {
            GM_setValue('queryURL', G_queryURL);
            GM_setValue('mediaData', null); GM_addValueChangeListener('mediaData', function(name, old_value, new_value, remote) {
                if (new_value.url == G_queryURL) {
                    console.log('mediaData:', new_value);
                    G_videoWidth = new_value.width;
                    G_videoHeight = new_value.height;
                    G_sampleURL = new_value.src;
                    G_embedCodeVideo = addEmbedCodeVideo(G_embedCodeFrame, G_funcToRun, function onLoadFunc() {
                        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                        G_embedCodeTextAreaColor = valToColor((G_videoWidth * G_videoHeight) / (2048 * 1080) * 100, 1, 1.0, 0, 100, 1);
                        G_embedCodeTextArea.style.color = G_embedCodeTextAreaColor;
                        log(G_debugMode, G_embedCodeTextAreaColor);
                    }, function onErrorFunc() {
                        log(G_debugMode, 'G_embedCodeVideo: onErrorFunc');
                        G_embedCodeText = updateEmbedCodeText(G_embedCodeTextArea, 1, G_delimiter);
                        G_embedCodeTextAreaColor = valToColor((G_videoQuality / 1080) * 100, 1, 0.5, 0, 100, 1);
                        G_embedCodeTextArea.style.color = G_embedCodeTextAreaColor;
                        log(G_debugMode, G_embedCodeTextAreaColor);
                    });
                }
            });
        }
        // --------------------------------------------------------------------------------
        log(G_debugMode, G_contentURL, '\n', G_sampleURL, '\n', G_posterURL);
    };
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
                setTimeout(function() {
                    var eventCatcher = document.querySelector('div#moviexxx'), media = document.querySelector('body video[src]');
                    if (eventCatcher && media) {mediaMouseControls(eventCatcher, media, 1);}
                }, 500);
            };
            waitForElement('#embright > .textare1 > textarea', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
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
                for (var item of document.querySelectorAll('.vjs-menu-content > .vjs-menu-item')) {
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
                G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/yespornplease.com\/images\/\d+\/.*\/\d+x\d+)_\d+.jpg/i, '$1_$NUM.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('.video-tags'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_queryURL = document.querySelector('iframe').src;
                G_standartAddEmbedCodeFunc();
            };
            document.addEventListener("DOMContentLoaded", function(event) {
                waitForElement('#video_embed_code', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
            });
        }
    }

    else if (
        G_pageURL.matchLink('https?://vshare.io/v/*/width-*/height-*/*')
    ) {
        G_noPlayerExtension = true;
        G_funcToRun = G_standartReCastFunc;
        waitForElement('body video[src] > source[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
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
            G_funcToRun = function () {
                G_contentURL = G_shortURL + '#OnlyVideo';
                G_sampleURL = (
                    unsafeWindow.flashvars.video_alt_url3 ? unsafeWindow.flashvars.video_alt_url3 :
                    unsafeWindow.flashvars.video_alt_url2 ? unsafeWindow.flashvars.video_alt_url2 :
                    unsafeWindow.flashvars.video_alt_url ? unsafeWindow.flashvars.video_alt_url :
                    unsafeWindow.flashvars.video_url
                );
                G_posterURL = G_posterURL ? G_posterURL : document.querySelector('.block-screenshots > a > img.thumb[src]').src;
                G_postersArray = CreateLinksList(G_posterURL, /^.*\/\/.*.com\/(contents\/videos_screenshots\/\d+\/\d+\/\d+x\d+)\/\d+.jpg/i, location.protocol+'//www.porntrex.com/$1/$NUM.jpg', 1, 15); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.video-info'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_standartAddEmbedCodeFunc();
            };
            waitForElement('meta[property="og:image"]', 'content', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
    }

    else if (
        G_pageURL.matchLink('https?://yourporn.sexy/*')
    ) {
        if (G_pageURL.match('#ReCast')) { // https://yourporn.sexy/post/59772cebee27b.html#ReCast
            // window.stop();
            G_funcToRun = G_standartReCastFunc;
            waitForElement('body video[src] > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
        else if (
            G_pageURL.matchLink('https?://yourporn.sexy/post/*') // https://yourporn.sexy/post/56be2e8359051.html?sk=Carolina%20Abril&so=30
        ) {
            G_funcToRun = function () {
                // --------------------------------------------------------------------------------
                G_contentURL = G_shortURL + '#ReCast';
                G_posterURL = G_posterURL ? G_posterURL : getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
                G_postersArray = CreateLinksList(G_posterURL, /^(https?:\/\/.*eporner.com\/thumbs\/.*)\/\d+_(\d+).jpg/i, '$1/$NUM_$2.jpg', 1, 100); console.log('G_posters:\n', G_postersArray);
                G_stickTo = document.querySelector('div.comments_area'); G_stickPosition = -1;
                // --------------------------------------------------------------------------------
                G_qualitySampleSource = document.querySelector('body video[src]');
                G_standartAddEmbedCodeFunc();
                // --------------------------------------------------------------------------------
                setTimeout(function() {
                    var eventCatcher = document.querySelector('body video[src]'), media = eventCatcher;
                    if (eventCatcher && media) {mediaMouseControls(eventCatcher, media, 1);}
                }, 500);
            };
            waitForElement('body video[src] > source[src], body video[src]', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
        }
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
                for (var link of document.querySelectorAll('div.related > a[href*="://pics.jjgirls.com/pictures/"]')) {
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
                for (var index in thumbsArray) {
                    G_contentURL = imagesArray[index];
                    G_posterURL = thumbsArray[index];
                    updateEmbedCodeText(G_embedCodeTextArea, index == 0, G_delimiter);
                }
                G_embedCodeTextArea.value = '<!-- ' + G_contentTitle + ' -->\n' + G_embedCodeText;
            };
            // --------------------------------------------------------------------------------
        };
        waitForElement('div.related > a[href^=http]', 'href', G_funcToRun, G_delay, G_tries, G_timerGroup);
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