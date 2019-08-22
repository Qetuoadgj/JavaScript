// ==UserScript==
// @name         vshare.player
// @icon         https://www.google.com/s2/favicons?domain=vshare.io
// @version      0.0.12
// @description  Pure JavaScript version.
// @author       Ægir
// @namespace    complete.misc
/// @grant       none
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/vshare.player.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        *://vshare.io/v/404/*
/// @match        *://*/v/404/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // https://vshare.io/v/404/https://s902.vshare.io:440/s,128-1000-22-1-2191707-bkxdtksrwj/186745/351673/185658/ff-8840c3e48fc8f80f67eeacc4b3fc3cdbb94c86b4,5c584cc5,2f23e49_480.mp4
    window.stop();
    // ---------------------------------------------------
    function removeEventListeners(elementSelector) {
        var elementsArray = document.querySelectorAll(elementSelector);
        for (var i = 0; i < elementsArray.length; i++) {
            var element = elementsArray[i];
            element.outerHTML = element.outerHTML;
        };
    }
    removeEventListeners('head');
    removeEventListeners('body');
    // ---------------------------------------------------
    function removeElement(elementSelector) {
        var elementsArray = document.querySelectorAll(elementSelector);
        for (var i = 0; i < elementsArray.length; i++) {
            var element = elementsArray[i];
            element.remove();
        };
    }
    removeElement('head'); // document.querySelector('head').remove();
    removeElement('body'); // document.querySelector('body').remove();
    var head = document.createElement('head'); document.documentElement.appendChild(head);
    var body = document.createElement('body'); document.documentElement.appendChild(body);
    // ---------------------------------------------------
    function addGlobalStyle(css, cssClass) {
        var head = document.getElementsByTagName('head')[0]; if (!head) { return; }
        var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
    }
    function prettyPrint(string) {
        return string.replace(/\{/g, '{\n\t').replace(/;\s+/g, ';\n\t').replace(/\}/g, '\n}').replace(/}([^\s]+)/g, '}\n$1');
    }
    // /*
    addGlobalStyle(
        prettyPrint(
            'body {position: absolute; width: 100%; height: 100%; overflow: hidden; padding: 0px; margin: 0px; top: 0px; left: 0px;}' +
            'video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black; padding: 0px; margin: 0px; top: 0px; left: 0px; background: black;}'
        ),
        'pageStyle'
    )
    // */
    // ---------------------------------------------------
    function failed(e) {
        // video playback failed - show a message saying why
        switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
                console.log('You aborted the video playback.');
                break;
            case e.target.error.MEDIA_ERR_NETWORK:
                console.log('A network error caused the video download to fail part-way.');
                break;
            case e.target.error.MEDIA_ERR_DECODE:
                console.log('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
                break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                console.log('The video could not be loaded, either because the server or network failed or because the format is not supported.');
                break;
            default:
                console.log('An unknown error occurred.');
                break;
        };
    };
    // ---------------------------------------------------
    var video = document.createElement('video');
    video.addEventListener('error', failed);
    video.setAttribute('id', 'cleaned_video');
    video.setAttribute('preload', 'metadata'); // none
    video.setAttribute('controls', '');
    video.setAttribute('webkitallowfullscreen', '');
    video.setAttribute('mozallowfullscreen', '');
    video.setAttribute('allowfullscreen', '');
    // video.setAttribute('onerror', 'failed(event);');
    // video.setAttribute('src', '');
    document.body.appendChild(video);
    // video.src = 'https://s902.vshare.io:440/s,128-1000-22-1-2191707-bkxdtksrwj/186745/351673/185658/ff-8840c3e48fc8f80f67eeacc4b3fc3cdbb94c86b4,5c584cc5,2f23e49_480.mp4';
    // ---------------------------------------------------
    function initPlayer() {
        // console.clear();

        var pageDomain = location.host.replace(/.*\.(.*\..*)/, '$1'); var paramStart = location.protocol + '//' + pageDomain + '/v/404/'; // paramStart;
        // var paramStart = /^.*?player\.html#/;
        console.log('location.href: ' + location.href);
        console.log('paramStart: ' + paramStart);

        function shiftKeyIsDown() {return !!window.event.shiftKey;}
        function ctrlKeyIsDown() {return !!(window.event.ctrlKey || window.event.metaKey);}
        function altKeyIsDown() {return !!window.event.altKey;}

        function msgbox(title, message, time, width, height) {
            width = width || 250;
            height = height || 120;

            var padding = 10;
            var w = width - padding*2,
                h = height - padding*2;

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

            // d.style.top = 50 + 'px';
            // centerX(d);

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

        var toHHMMSS = function(secs) {
            var sec_num = parseInt(secs, 10);
            var hours = Math.floor(sec_num / 3600) % 24;
            var minutes = Math.floor(sec_num / 60) % 60;
            var seconds = sec_num % 60;
            return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":");
        };

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
        }

        var mediaKeyboardControls = function(media) {
            var onKeyDown = function(e) {
                e = e || window.event;
                var lArrow = 37, rArrow = 39, kSpace = 32;
                var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
                var mediaState = media.paused ? 0 : 1;
                setTimeout(function() {
                    if (e.keyCode == lArrow) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) - 5; if (mediaState == 1) media.play();
                    }
                    else if (e.keyCode == rArrow) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) + 5; if (mediaState == 1) media.play();
                    }
                    else if (e.keyCode == kSpace) {
                        if (mediaState == 1) media.pause(); else media.play();
                    }
                }, 10);
                e.preventDefault();
            };
            window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
        };

        function mediaMouseControls(media, step) {
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
            var mouseWheelHandler = function(e) {
                if (shiftKeyIsDown()) {
                    mouseWheelAudioHandler(e);
                }
                else {
                    mouseWheelTimeHandler(e);
                }
            };
            if (media.addEventListener) {
                media.addEventListener("mousewheel", mouseWheelHandler, false); // IE9, Chrome, Safari, Opera
                media.addEventListener("DOMMouseScroll", mouseWheelHandler, false); // Firefox
            }
            else {
                media.attachEvent("onmousewheel", mouseWheelAudioHandler); // IE 6/7/8
            }
            var mediaTextIndicator = addMediaTextIndicator(media, 56);
        }

        // Convert search param string into an object or array
        // '?startIndex=1&pageSize=10' -> {startIndex: 1, pageSize: 10}
        function processSearchParams(search, preserveDuplicates) {
            //  option to preserve duplicate keys (e.g. 'sort=name&sort=age')
            preserveDuplicates = preserveDuplicates || false; // disabled by default

            var outputNoDupes = {};
            var outputWithDupes = []; // optional output array to preserve duplicate keys

            //  sanity check
            if(!search) throw new Error('processSearchParams: expecting "search" input parameter');

            //  remove ? separator (?foo=1&bar=2 -> 'foo=1&bar=2')
            search = search.split('?')[1];

            //  split apart keys into an array ('foo=1&bar=2' -> ['foo=1', 'bar=2'])
            search = search.split('&');

            //  separate keys from values (['foo=1', 'bar=2'] -> [{foo:1}, {bar:2}])
            //  also construct simplified outputObj
            outputWithDupes = search.map(function(keyval){
                var out = {};
                keyval = keyval.split('=');
                out[keyval[0]] = keyval[1];
                outputNoDupes[keyval[0]] = keyval[1]; //  might as well do the no-dupe work too while we're in the loop
                return out;
            });

            return (preserveDuplicates) ? outputWithDupes : outputNoDupes;
        }

        // Break apart any path into parts
        // 'http://example.com:12345/blog/foo/bar?startIndex=1&pageSize=10' ->
        // 	{
        // 	"host": "example.com",
        // 	"port": "12345",
        // 	"search": {
        // 		"startIndex": "1",
        // 		"pageSize": "10"
        // 	},
        // 	"path": "/blog/foo/bar",
        // 	"protocol": "http:"
        // }
        function getPathInfo(path) {
            //  create a link in the DOM and set its href
            var link = document.createElement('a');
            link.setAttribute('href', path);

            //  return an easy-to-use object that breaks apart the path
            return {
                host:     link.hostname, // 'example.com'
                port:     link.port, // 12345
                search:   processSearchParams(link.search || '?'), // {startIndex: 1, pageSize: 10}
                path:     link.pathname, // '/blog/foo/bar'
                protocol: link.protocol // 'http:'
            };
        }


        function getDomain(url, subdomain) {
            subdomain = subdomain || false;
            url = url.replace(/(https?:\/\/)?(www.)?/i, '');
            url = url.replace(/(.*?)\/.*/i, '$1');
            if (!subdomain) {
                url = url.split('.');
                url = url.slice(url.length - 2).join('.');
            }
            if (url.indexOf('/') !== -1) {
                return url.split('/')[0];
            }
            return url;
        }

        var mediaShowInfoBox = function(media) {
            var hosts = {
                "oloadcdn.net" : "openload.co",
                "phncdn.com" : "pornhub.com",
                "t8cdn.com" : "tube8.com",
                "playercdn.net" : "bitporno.com",
                "ahcdn.com" : "txxx.com | porndig.com",
                "userscontent.net" : "playvids.com",
                "trafficdeposit.com" : "yourporn.sexy",
                "cdnity.net" : "yourporn.sexy",
            };
            var showMsgBox = function(media) {
                var width = media.videoWidth, height = media.videoHeight;
                // console.log('media: '+media.src+' ['+width+'x'+height+']');
                var host = getPathInfo(media.src).host.replace(/^www\./, ''); // getDomain(media.src);
                host = hosts[host] ? host + '\n['+hosts[host]+']' : host;
                var msg = msgbox('Video', (width+' x '+height)+'\n'+host, 2000, 250, 120);
                msg.style.right = 0 + 'px';
                msg.style.bottom = 32 + 'px';
            };
            var onKeyDown = function(e) {
                e = e || window.event;
                var xKey = 88;
                var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
                if (e.keyCode == xKey) {
                    media.focus();
                    showMsgBox(media);
                }
            };
            window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
            media.addEventListener("loadedmetadata",function(e){
                showMsgBox(media);
                if (media.videoWidth) console.log('media: '+media.src+' ['+media.videoWidth+'x'+media.videoHeight+']');
            },false);
        };

        var useLocalVolumeCookie = function(mediaElementSelector, cookieName) {
            cookieName = cookieName || "media";
            var mediaVolume = localStorage.getItem(cookieName+"_volume");
            var mediaMuted = localStorage.getItem(cookieName+"_muted");
            if (mediaMuted == "false") mediaMuted = false; // normalize
            var mediaElementsArray = document.querySelectorAll(mediaElementSelector);
            function saveSettings() {
                localStorage.setItem(cookieName+"_volume", mediaElement.volume || 0);
                localStorage.setItem(cookieName+"_muted", mediaElement.muted);
            }
            for (var i = 0; i < mediaElementsArray.length; ++i) {
                var mediaElement = mediaElementsArray[i];
                if (mediaVolume) mediaElement.volume = mediaVolume;
                mediaElement.muted = mediaMuted;
                mediaElement.addEventListener("volumechange", saveSettings, false);
                // console.log("mediaElement: ", mediaElement);
                // console.log("localStorage."+cookieName+"_volume: ", localStorage.getItem(cookieName+"_volume"));
                // console.log("localStorage."+cookieName+"_muted: ", localStorage.getItem(cookieName+"_muted"));
            }
        };

        var useGMVolumeCookie = function(mediaElementSelector, cookieName) {
            cookieName = cookieName || "media";
            var mediaVolume = GM_getValue(cookieName+"_volume");
            var mediaMuted = GM_getValue(cookieName+"_muted");
            if (mediaMuted == "false") mediaMuted = false; // normalize
            var mediaElementsArray = document.querySelectorAll(mediaElementSelector);
            function saveSettings() {
                GM_setValue(cookieName+"_volume", mediaElement.volume || 0);
                GM_setValue(cookieName+"_muted", mediaElement.muted);
            }
            for (var i = 0; i < mediaElementsArray.length; ++i) {
                var mediaElement = mediaElementsArray[i];
                if (mediaVolume) mediaElement.volume = mediaVolume;
                mediaElement.muted = mediaMuted;
                mediaElement.addEventListener("volumechange", saveSettings, false);
                // console.log("mediaElement: ", mediaElement);
                // console.log("GM_getValue("+cookieName+"_volume): ", GM_getValue(cookieName+"_volume"));
                // console.log("GM_getValue("+cookieName+"_muted): ", GM_getValue(cookieName+"_muted"));
            }
        };

        function GetFirstCustomKey(searchArray, customKeysArray) {
            for(var i in searchArray){
                if (customKeysArray.indexOf(searchArray[i]) > -1) {
                    return i;
                }
            }
            return;
        }

        function getParamsFromURL(searchString) {
            var customKeysArray = ['autoplay', '#t'];
            var parse = function(params, pairs) {
                var pair = pairs[0];
                var parts = pair.split('=');
                var key = decodeURIComponent(parts[0]).replace(/.*?\?/, '');
                var value = decodeURIComponent(parts.slice(1).join('='));
                // Handle multiple parameters of the same name
                if (typeof params[key] === "undefined") params[key] = value;
                else params[key] = [].concat(params[key], value);
                params = pairs.length == 1 ? params : parse(params, pairs.slice(1));
                params.main_url = searchString;
                var firstCustomKeyIndex = GetFirstCustomKey(Object.keys(params), customKeysArray);
                // console.log('firstCustomKeyIndex = ' + firstCustomKeyIndex);
                if (firstCustomKeyIndex) {
                    var firstCustomKey = Object.keys(params)[firstCustomKeyIndex];
                    var startSymbol = (firstCustomKeyIndex == 0) ? '\\?' : '&';
                    var re = new RegExp(startSymbol + firstCustomKey + '.*');
                    params.main_url = searchString.replace(re, '');
                    params.first_key = firstCustomKey;
                }
                return params;
            };
            // Get rid of leading ?
            return searchString.length === 0 ? {} : parse({}, searchString.split('&')); // .substr(1)
        }

        // var url = location.href.split("#")[1].replace(/[?#&]\bREFINE_VIDEO\b/, '');

        // var url = location.href.split(paramStart)[1];
        var url = location.href.replace(paramStart, '');
        if (url && typeof url !== 'undefined') {url = url.replace(/[?#&]\bREFINE_VIDEO\b/, '');}

        function listParams(obj) {for(var i in obj){console.log(i + "=" + obj[i]);}}

        if (url) {
            console.log('url: ', url);
            var video = document.querySelector("body > video");
            if (video) {
                let event = new Event('click');
                video.dispatchEvent(event);
                //
                var href = location.href.replace(paramStart, ''); // location.href.split(paramStart)[1];
                console.log('href: ', href);
                var params = getParamsFromURL(href); // getParamsFromURL(location.search)
                console.log('params: ', params);
                listParams(params);
                if (params.autoplay && params.autoplay == 'true') {
                    video.setAttribute('autoplay', true);
                };
                var videoSrc = params.main_url;
                if (params.t) videoSrc = videoSrc + '#t=' + params.t;
                video.setAttribute('src', videoSrc);
                console.log('src: ', videoSrc);
                mediaKeyboardControls(video);
                mediaMouseControls(video, 5);
                mediaShowInfoBox(video);
                useGMVolumeCookie("body > video", "video");
                window.addEventListener('message', function(e) {
                    if(e.data.sender === 'QUESTION') {
                        setTimeout(function() {
                            window.top.postMessage({
                                sender: 'ANSWER',
                                // data: {
                                duration: video.duration,
                                currentTime: video.currentTime,
                                videoWidth: video.videoWidth,
                                videoHeight: video.videoHeight,
                                // }
                            }, '*');
                        }, 50);
                    }
                });
                // useLocalVolumeCookie("body > video", "video");
            }
        }
    };
    initPlayer();
    // ---------------------------------------------------
    // video.src = 'https://vshare.io/err105.mp4?error=expired&#t=5';
})();
