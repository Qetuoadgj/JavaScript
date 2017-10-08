// ==UserScript==
// @name		openload.co
// @icon		https://www.google.com/s2/favicons?domain=openload.co
// @version		1.2.7
// @description	Pure JavaScript version.
// @author		Ægir
// @grant		none
// @run-at		document-end
// @require		https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL	https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/openload.co.user.js
// @homepageURL	https://github.com/Qetuoadgj/JavaScript/tree/master/Misc

// @match		file:///*/HTML/html/video.html*

// @match		https://openload.co/embed/*
// @match		https://openload.co/f/*
// @match		https://oload.tv/f/*
// @match		https://oload.tv/f/*
// @match		https://oload.tv/embed/*
// @match		https://*.oloadcdn.net/dl/l/*

// @match		http://www.miscopy.com/wp-content/uploads/*/*/*

// @match		https://www.pornhub.com/embed/*
// @match		https://*.pornhub.com/videos/*.mp4?*
// @match		https://*.phncdn.com/videos/*.mp4?*

// @match		https://porndoe.com/video/embed/*
// @match		https://*.porndoe.com/movie/*/*/*/*/*/*.mp4*

// @match		http://www.eporner.com/embed/*
// @match		https://www.eporner.com/embed/*
// @match		https://*.eporner.com/*.mp4

// @match		http*://www.tube8.com/embed/*
// @match		https://*.t8cdn.com/*.mp4?*

// @match		http://streamin.to/embed*
// @match		http://pron.tv/embed/*
// @match		http://cdn.rhcdn.net/*.html
// @match		https://hqcollect.me/embed/*

/// @match		https://daxab.com/embed/*
/// @match		https://biqle.ru/RD/*

// @match		https://www.bitporno.sx/embed/*
// @match		https://www.bitporno.com/embed/*
// @match		https://*.playercdn.net/*/*.mp4

// @match		http://www.porn.com/videos/embed/*
// @match		http://www.porn.com/videos/*?EMBED

// @match		https://*.googlevideo.com/videoplayback?id=*
// @match		http://mcloud.hdporncollections.com/*.mp4
// @match		http://redirector.rhcdn.net/media/videos/hd/*.mp4
// @match		http://*.rhcdn.net/media/videos/hd/*.mp4?*

// @match		http://www.camwhores.tv/embed/*

// @match		http://e.yespornplease.com/e/*
// @match		http://vshare.io/v/*
// @match		https://vshare.io/v/*
// @match		https://*.vshare.io/*.mp4

// @match		http://www.miscopy.com/?*video_embed*

// @match		https://vidoza.net/embed-*
// @match		https://*.vidoza.net/*.mp4

// @match		http://www.txxx.com/embed/*
// @match		http://*.ahcdn.com/*/videos/*.mp4

// @match		https://www.playvids.com/embed/*
// @match		https://*.userscontent.net/w/*.mp4

// @match		https://drive.google.com/file/d/*/preview?*

// @match		https://yourporn.sexy/post/*.html
// @match		https://*.trafficdeposit.com/bvideo/*/*/*/*.mp4
// @match		https://*.atlas.cdnity.net/-*_*/

// @match		https://www.porntrex.com/embed/*
// @match		https://www.porntrex.com/video/*/*
// @match		https://*.porntrex.com/remote_control.php?*.mp4*

/// @match		https://daftsex.com/watch/*

// @match		https://videos.porndig.com/player/index*
// @match		https://*.porndig.com/videos/*.mp4*
// @match		https://*.ahcdn.com/*/videos/*.mp4

// @match		https://*.xfreehd.com/media/*.mp4

/// @match		http://dato.porn/embed-*.html

/// @match		https://*.thevideobee.to:*/*.mp4
/// @match		https://*.kingvid.tv/*.mp4
// ==/UserScript==

(function() {
	'use strict';

	// THIS FILE GLOBAL VARIABLES
	// ====================================================================================================================
	// window.stop();

	var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
	var shortURL = location.protocol + '//' + location.host + location.pathname;
	var videoElement, videoSource, videoPoster, videoCleaned;
	var videoSourceSelector = 'video, video > source[type="video/mp4"]';
	var waitGroup = []; // waitForElement() timers group.

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

	function empty(e) {
		while (e.firstChild) {
			e.removeChild(e.firstChild);
		}
	}
	function insert(tagName, parentNode, innerHTML) {
		var e = document.createElement(tagName);
		if (typeof parentNode == "string") parentNode = document.querySelector(parentNode);
		parentNode.appendChild(e);
		if (innerHTML) e.innerHTML = innerHTML;
		return e;
	}
	function refine(e) {
		var doc = document.documentElement; var doc_clone = doc.cloneNode();
		while (doc.firstChild) {
			doc_clone.appendChild(doc.lastChild);
		}
		doc.parentNode.replaceChild(doc_clone, doc);
		//
		var clone = e.cloneNode(1);
		var html = document.documentElement;
		empty(html);
		insert('head', html, 0);
		insert('body', html, 0);
		document.body.appendChild(clone);
		return clone;
	}
	function maximize(e) {
		e = refine(e);
		e.style = "position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black; padding: 0; margin: 0; top: 0; left: 0;";
		document.body.style = "position: absolute; width: 100%; height: 100%; overflow: hidden; padding: 0; margin: 0; top: 0; left: 0;";
		return e;
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

	function inIframe() {
		var inIframe = window.self !== window.top;
		console.log('inIframe: '+inIframe);
		return inIframe;
	}

	var CtrlC_FocusParent = function() {
		var onKeyDown = function(e) {
			e = e || window.event;
			var cKey = 67;
			var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
			// var targetType = e.target.tagName.toLowerCase();
			if (ctrlDown && e.keyCode == cKey) {
				parent.focus();
				xonsole.log('document.activeElement:' + document.activeElement);
			}
		};
		window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
	};

	function showMsgBox(video) {
		var width = video.videoWidth, height = video.videoHeight;
		console.log('video: '+video.src+' ['+width+'x'+height+']');
		var host = getDomain(video.src);
		host = hosts[host] ? host + '\n['+hosts[host]+']' : host;
		var msg = msgbox('Video', (width+' x '+height)+'\n'+host, 2000, 250, 120);
		msg.style.right = 0 + 'px';
		msg.style.bottom = 32 + 'px';
		// var params = {
		//	width: width,
		//	height: height
		// };
		// localStorage.setItem('GM_LocalStorage', width+'x'+height);
		// var GM_LocalStorage = localStorage.getItem('GM_LocalStorage');
		// console.log('GM_LocalStorage: '+GM_LocalStorage);
	}

	var X_Key_ShowMsgBox = function(video) {
		var onKeyDown = function(e) {
			e = e || window.event;
			var xKey = 88;
			var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
			// var targetType = e.target.tagName.toLowerCase();
			if (e.keyCode == xKey) {
				video.focus();
				showMsgBox(video);
			}
		};
		window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
	};

	var addVideoControlShortcuts = function(video) {
		var onKeyDown = function(e) {
			e = e || window.event;
			var lArrow = 37, rArrow = 39, kSpace = 32;
			var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
			// var targetType = e.target.tagName.toLowerCase();
			if (e.keyCode == lArrow) {
				video.focus();
				video.currentTime = video.currentTime - 5;
			}
			if (e.keyCode == rArrow) {
				video.focus();
				video.currentTime = video.currentTime + 5;
			}
			if (e.keyCode == kSpace) {
				if (video.paused) video.play(); else video.pause();
			}
			e.preventDefault();
		};
		window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
	};

	var getCleanVideo = function(videoSrc, posterSrc) {
		var video;
		if (videoSrc && videoSrc != window.location) window.location = videoSrc;
		// else {
		// 	window.location = "file:///D:/Google%20%D0%94%D0%B8%D1%81%D0%BA/HTML/html/video.html?video_url=" + videoSrc;
		// 	return;
		// }
		// else {
		video = document.createElement('video');
		video.setAttribute('src', videoSrc);
		if (posterSrc) video.setAttribute('poster', posterSrc);
		video.setAttribute('controls', '');
		video.setAttribute('webkitallowfullscreen', '');
		video.setAttribute('mozallowfullscreen', '');
		video.setAttribute('allowfullscreen', '');
		//
		// video.setAttribute('x-webkit-airplay', 'allow');
		// video.setAttribute('webkit-playsinline', '');
		//
		document.documentElement.innerHTML = '';
		document.body.appendChild(video);
		video = maximize(video);
		video.addEventListener("loadedmetadata",function(e){showMsgBox(video);},false);
		X_Key_ShowMsgBox(video);
		CtrlC_FocusParent();
		addVideoControlShortcuts(video);
		// }
		return video;
	};

	var getCleanMedia = function(mediaSrc, posterSrc, mediaType) {
		if (mediaSrc != window.location) window.location = mediaSrc;
		var media = document.createElement(mediaType);
		media.setAttribute('src', mediaSrc);
		if (posterSrc) media.setAttribute('poster', posterSrc);
		media.setAttribute('controls', '');
		media.setAttribute('webkitallowfullscreen', '');
		media.setAttribute('mozallowfullscreen', '');
		media.setAttribute('allowfullscreen', '');
		document.documentElement.innerHTML = '';
		document.body.appendChild(media);
		media = maximize(media);
		media.addEventListener("loadedmetadata",function(e){showMsgBox(media);},false);
		X_Key_ShowMsgBox(media);
		CtrlC_FocusParent();
		addVideoControlShortcuts(media);
		return media;
	};

	var toHHMMSS = (secs) => {
		var sec_num = parseInt(secs, 10);
		var hours   = Math.floor(sec_num / 3600) % 24;
		var minutes = Math.floor(sec_num / 60) % 60;
		var seconds = sec_num % 60;
		return [hours,minutes,seconds]
			.map(v => v < 10 ? "0" + v : v)
			.filter((v,i) => v !== "00" || i > 0)
			.join(":");
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
			} else {
				media.attachEvent("onvolumechange", setVolumeText); // IE 6/7/8
				media.attachEvent("onseeking", setTimeText); // IE 6/7/8
			}
		};
		setTimeout(addEventHandlers, 10);
		return mediaTextIndicator;
	}

	function addMouseWheelAudioControl(media, step) {
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
		if (media.addEventListener) {
			media.addEventListener("mousewheel", mouseWheelAudioHandler, false); // IE9, Chrome, Safari, Opera
			media.addEventListener("DOMMouseScroll", mouseWheelAudioHandler, false); // Firefox
		} else {
			media.attachEvent("onmousewheel", mouseWheelAudioHandler); // IE 6/7/8
		}
		var mediaTextIndicator = addMediaTextIndicator(media, 56);
	}

	function applyVideoSettings() {
		videoSource = videoSource || document.querySelectorAttribute(videoSourceSelector, 'src');
		// videoPoster = null; //video.poster
		videoCleaned = getCleanVideo(videoSource, videoPoster);
		if (videoCleaned) {
			// videoCleaned.play();
			videoCleaned.autoplay = false; // videoCleaned.preload = "none";
			videoCleaned.volume = 0.5;
			useVolumeCookie('body > video', null);
			addMouseWheelAudioControl(videoCleaned, 5);
		}
		waitGroup = null;
	}
	var mainFunction, initFunction = function(){mainFunction(); applyVideoSettings();}, getSource;
	var delay = 10, tries = 1500;
	var playButtonSelector;
	var clickPlay = function(){var p = document.querySelector(playButtonSelector); p.click(); waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, null, waitGroup);};
	var clickElement = function(querySelector) {
		var element =  document.querySelector('.jwdisplayIcon');
		if (element) element.click();
		return element;
	};

	var useVolumeCookie = function(mediaElementSelector, cookieName) {
		cookieName = cookieName || 'media';
		var volumeCookie = cookieName+'Volume';
		var mediaVolume = getCookie(volumeCookie);
		var mutedCookie = cookieName+'Muted';
		var mediaMuted = getCookie(mutedCookie);
		if (mediaMuted == 'false') mediaMuted = false; // normalize
		var mediaElementsArray = document.querySelectorAll(mediaElementSelector);
		for (var i = 0; i < mediaElementsArray.length; ++i) {
			var mediaElement = mediaElementsArray[i];
			if (mediaVolume) mediaElement.volume = mediaVolume;
			mediaElement.muted = mediaMuted;
			mediaElement.addEventListener('volumechange', function() {
				setCookie(volumeCookie, mediaElement.volume || 0, 1);
				setCookie(mutedCookie, mediaElement.muted, 1);
			}, false);
			console.log('mediaElement: ',mediaElement);
			console.log('volumeCookie: ' + volumeCookie + ' = ' + getCookie(volumeCookie));
			console.log('mutedCookie: ' + mutedCookie + ' = ' + getCookie(mutedCookie));
		}
	};

	var useLocalVolumeCookie = function(mediaElementSelector, cookieName) {
		cookieName = cookieName || 'media';
		var mediaVolume = localStorage.getItem("media_volume");
		var mediaMuted = localStorage.getItem("media_muted");
		if (mediaMuted == "false") mediaMuted = false; // normalize
		var mediaElementsArray = document.querySelectorAll(mediaElementSelector);
		for (var i = 0; i < mediaElementsArray.length; ++i) {
			var mediaElement = mediaElementsArray[i];
			if (mediaVolume) mediaElement.volume = mediaVolume;
			mediaElement.muted = mediaMuted;
			mediaElement.addEventListener("volumechange", function() {
				localStorage.setItem("media_volume", mediaElement.volume || 0);
				localStorage.setItem("media_muted", mediaElement.muted);
			}, false);
			console.log('mediaElement: ', mediaElement);
			console.log("localStorage.media_volume: ", localStorage.getItem("media_volume"));
			console.log("localStorage.media_muted: ", localStorage.getItem("media_muted"));
		}
	};

	// ====================================================================================================================

	if (pageURL.matchLink('file:///*/HTML/html/video.html')) { // file:///D:/Google%20%D0%94%D0%B8%D1%81%D0%BA/HTML/html/video.html?video_url=https://s2-n5-nl-cdn.eporner.com/28fbeb7d149d7fff46d8abad2a69cc79/59d9a15f010600/1101004-480p.mp4
		var main_video = document.querySelector("body > video");
		console.log("main_video: ",main_video);

		main_video.autoplay = false; // videoCleaned.preload = "none";
		main_video.volume = 0.5;
		useLocalVolumeCookie("body > video", null);

		addVideoControlShortcuts(main_video);
		addMouseWheelAudioControl(main_video, 5);
		X_Key_ShowMsgBox(main_video);
		main_video.addEventListener("loadedmetadata",function(e){showMsgBox(main_video);},false);
	}

	else if (pageURL.matchLink('https://openload.co/*') || pageURL.matchLink('https://oload.tv/*')) { // https://openload.co/embed/pM1MQGKY7z4/
		mainFunction = function() {
			videoSource = '/stream/' + document.querySelector('#streamurl').innerText + '?mime=true';
			videoPoster = null; //document.querySelector('#olvideo_html5_api').poster
		};
		waitForElement('#streamurl', false, initFunction, delay, tries, false, waitGroup);
	}

	else if (
		pageURL.matchLink('http[s]?://www.pornhub.com/*') || // https://www.pornhub.com/embed/ph55b7a22ed4339
		pageURL.matchLink('http[s]?://www.tube8.com/embed/*') || // http://www.tube8.com/embed/teen/all-a-slut-needs-is-a-reason/31637961/
		pageURL.matchLink('http[s]?://porndoe.com/*') || // http://porndoe.com/video/embed/45914/deep-throat-fucking-sasha-grey
		pageURL.matchLink('http[s]?://streamin.to/*') // http://streamin.to/embed-zlu0667c26hp-828x480.html
	) {
		mainFunction = function() {
			videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
			videoPoster = null; //video.poster
		};
		waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, false, waitGroup);
	}

	else if (pageURL.matchLink('http[s]?://www.eporner.com/*')) { // http://www.eporner.com/embed/ddPNLJUuNih/
		mainFunction = function() {
			var quality = 0, src;
			var qualityTable = {};
			document.querySelectorAll('.vjs-menu-content > .vjs-menu-item').forEach(function(item) { // https://www.eporner.com/embed/HYmQUXbhRrR
				var button = item.querySelector('.vjs-menu-item-text');
				var text = button ? button.innerText : '';
				var q = Number(text.match(/\d+/));
				if (q > quality) {quality = q; src = item;}
			});
			if (src) src.click();
			console.log('quality: '+quality);
			var video = document.querySelector('video'), videoContent = document.querySelector('meta[itemprop="contentUrl"]'); // https://www.eporner.com/embed/86xEgVrJQD3
			if (videoContent && video.getAttribute('src').match(/^blob:/i)) {
				video.addEventListener("loadedmetadata",function(e){initFunction();},false);
				video.setAttribute('src', videoContent.content);
			} else {
				videoSource = video.getAttribute('src'); //document.querySelectorAttribute('#EPvideo_html5_api', 'src');
				videoPoster = null; //video.poster
				applyVideoSettings();
			}
		};
		waitForElement('#EPvideo_html5_api', 'src', mainFunction, delay, tries, false, waitGroup);
	}

	/*else if (
		// pageURL.matchLink('http://pron.tv/embed/*') || // http://pron.tv/embed/id%3Arws2x9se
		pageURL.matchLink('http://cdn.rhcdn.net/*.html')  // http://cdn.rhcdn.net/6043.html
	) {
		getSource = function() {
			var source = player ? player.playerInfo.options.source : document.querySelectorAttribute(videoSourceSelector, 'src');
			console.log('source: '+source);
			return source;
		};
		mainFunction = function() {
			var videoSource = getSource();
			if (videoSource.match('/index.m3u8')) {
				window.open('chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html#'+videoSource, '_self');
			} else {
				videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
				videoPoster = null; //video.poster
				applyVideoSettings();
			}
			waitGroup = null;
		};
		waitForCondition(getSource, mainFunction, delay, tries, false, waitGroup);
	}*/

	/*else if (
		pageURL.matchLink('https://hqcollect.me/embed/*') // https://hqcollect.me/embed/214394
	) {
		playButtonSelector = 'div.fp-ui';
		mainFunction = function() {
			videoSource = document.querySelectorAttribute(videoSourceSelector, 'src');
			videoPoster = null; //video.poster
		};
		waitForElement(playButtonSelector, false, clickPlay, delay, tries, false, waitGroup);
	}

	else if (
		pageURL.matchLink('https://www.bitporno.sx/embed/*') || // https://www.bitporno.sx/embed/WEKddpz0
		pageURL.matchLink('https://www.bitporno.com/embed/*')	// https://www.bitporno.com/embed/uu25seLu
	) {
		videoSourceSelector = '.jw-media > video';
		playButtonSelector = 'input[type="image"]';
		mainFunction = function() {
			videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
			videoPoster = null; //video.poster
			videoPoster = document.querySelector('.jw-preview.jw-reset').style.backgroundImage.replace(/url\("(.*?)"\)/, '$1');
			console.log('videoPoster: '+videoPoster);
		};
		waitForElement(playButtonSelector, false, clickPlay, delay, tries, false, waitGroup);
		waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, false, waitGroup);
	}*/

	else if (
		pageURL.matchLink('https://daxab.com/embed/*') || // https://daxab.com/embed/-59740963_456244433 | https://daxab.com/embed/-59740963_456244433/RD
		pageURL.matchLink('https://biqle.ru/RD/*') // pseudo redirection page
	) {
		var url;
		if (pageURL.matchLink('https://daxab.com/embed/*/RD')) { // redirect to https://biqle.ru (pseudo redirection page)
			url = pageURL.replace(/\/RD$/, '');
			window.location = 'https://biqle.ru/RD/'+url;
		} else if (pageURL.matchLink('https://biqle.ru/RD/*')) { // redirect back to embed video page
			url = pageURL.replace('https://biqle.ru/RD/', '');
			window.location = url;
		} else if (pageURL.matchLink('https://daxab.com/embed/*')) { // play embed video
			waitForElement(videoSourceSelector, 'src', applyVideoSettings, delay, tries, false, waitGroup);
		}
	}

	else if (pageURL.matchLink('http://www.porn.com/videos/embed/*[?]*')) { // http://www.porn.com/videos/embed/29282?http://www.porn.com/download/480/29282.mp4
		mainFunction = function() {
			var url = pageURL.replace(/.*[?](.*)/, '$1');
			videoSource = url;
			videoPoster = null; //document.querySelector('#olvideo_html5_api').poster
		};
		waitForElement(videoSourceSelector, false, initFunction, delay, tries, false, waitGroup);
	}

	else if (pageURL.matchLink('http://www.porn.com/videos/*[?]EMBED')) { // http://www.porn.com/videos/horny-cock-sluts-aggressively-pull-off-plumber-s-clothes-29282?EMBED
		mainFunction = function() {
			var scriptsArray = document.scripts;
			for (var i = 0; i < document.scripts.length; ++i) {
				var script = document.scripts[i];
				var text = script.text;
				if (text.match('window.ActivitySocketURI')) {
					var hdUrl = text.match(/id:"hd",url:"(.*?)"/i);
					var hqUrl = text.match(/id:"hq",url:"(.*?)"/i);
					videoSource = hdUrl ? hdUrl[1] : hqUrl[1];
					console.log('videoSource: '+videoSource);
					break;
				}
			}
			videoPoster = null; //document.querySelector('#olvideo_html5_api').poster
		};
		initFunction();
	}

	else if (pageURL.matchLink('http[s]?://e.yespornplease.com/e/*')) {
		mainFunction = function() {
			var mediaSrc = document.querySelector('iframe').src;
			var posterSrc = null;
			var mediaType = 'iframe';
			getCleanMedia(mediaSrc, posterSrc, mediaType);
			addGlobalStyle('body {margin: -2; background: black;}');
		};
		waitForElement('iframe', 'src', mainFunction, delay, tries, false, waitGroup);
	}

	else if (pageURL.matchLink('https?://www.txxx.com/embed/*')) { // http://www.txxx.com/embed/4042421?promo=13876
		mainFunction = function() {
			var scriptsArray = document.scripts;
			for (var i = 0; i < document.scripts.length; ++i) {
				var script = document.scripts[i];
				var text = script.text;
				if (text.match('var video_url="(.*)"')) {
					var video_url = text.match(/var video_url="(.*)"/i),
						video_alt_url = text.match(/var video_alt_url="(.*)"/i),
						m3u8_url =	text.match(/var m3u8_url="(.*)"/i);
					videoSource = (
						video_url ? video_url[1] :
						video_alt_url ? video_alt_url[1] :
						m3u8_url ? m3u8_url[1] : null );
					console.log('videoSource: '+videoSource);
					break;
				}
			}
			videoSource = Dpww3Dw64(videoSource);
			videoPoster = null; //document.querySelector('#olvideo_html5_api').poster
		};
		initFunction();
	}

	else if (pageURL.matchLink('https?://vidoza.net/embed-*')) { // https://vidoza.net/embed-hjpqtb45ooie.html
		mainFunction = function() {
			var scriptsArray = document.scripts;
			for (var i = 0; i < document.scripts.length; ++i) {
				var script = document.scripts[i];
				var text = script.text;
				if (text.match(/{file:.*"(.*.mp4)",label:"\d+p"}/i)) {
					var video_url = text.match(/{file:.*"(.*.mp4)",label:"\d+p"}/i);
					videoSource = video_url ? video_url[1] : null;
					console.log('videoSource: '+videoSource);
					break;
				}
			}
			videoPoster = null; //document.querySelector('#olvideo_html5_api').poster
		};
		initFunction();
	}

	else if (pageURL.matchLink('https://www.playvids.com/embed/*')) { // https://www.playvids.com/embed/AHfgODSuCP7?quality=720
		/*
		mainFunction = function() {
			var maxQualityButton = document.querySelector('#mediaPlayerQualityList > .item[data-quality]');
			document.querySelectorAll('#mediaPlayerQualityList > .item[data-quality]').forEach(function(e) {
				var quality = Number(e.dataset.quality);
				if (quality > Number(maxQualityButton.dataset.quality)) maxQualityButton = e;
			});
			if (maxQualityButton) maxQualityButton.click();
		};
		waitForElement('#mediaPlayerQualityList > .item[data-index="1"]', null, mainFunction, delay, tries, false, waitGroup);
		*/
		mainFunction = function() {
			var quality = 0, src;
			var scriptsArray = document.querySelectorAll('.mediaPlayerNoscript');
			for (var i = 0; i < scriptsArray.length; ++i) {
				var script = scriptsArray[i];
				var text = decodeURIComponent(script.innerText);
				var matches = text.match(/\[video_urls\]\[(.+?)\].*?&/ig);
				for (i = 0; i < matches.length; ++i) {
					var match = matches[i];
					var params = match.match(/\[video_urls\]\[(\d+)p\]=(.*?)&/i);
					if (Number(params[1]) > quality) {
						src = params[2];
						quality = Number(params[1]);
					}
				}
				console.log('quality: '+quality);
				videoSource = src ? src : null;
			}
		};
		initFunction();
	}

	else if (pageURL.matchLink('https://drive.google.com/file/d/*/preview[?]*(start=1|autoplay=1)')) { // https://drive.google.com/file/d/0B8vZ-fFzt8h8Y2VWbVdGQ2dFdzA/preview?start=1&autoplay=1
		mainFunction = function() {
			var playButton = document.querySelector('div.drive-viewer-video-preview > img');
			if (playButton) playButton.click();
		};
		waitForElement('.drive-viewer-video-preview-img', 'src', mainFunction, delay, tries, false, waitGroup);
	}

	else if (pageURL.matchLink('https://yourporn.sexy/*')) {
		if (pageURL.match('#onlyVideo')) { // https://yourporn.sexy/post/59772cebee27b.html#onlyVideo
			waitForElement(videoSourceSelector, 'src', applyVideoSettings, delay, tries, false, waitGroup);
		}
	}

	else if (pageURL.matchLink('https?://www.porntrex.com/*')) {
		if (pageURL.match('#onlyVideo')) { // https://www.porntrex.com/video/162636/kiera-winters-sex-queen-and-her-prince#onlyVideo
			if (typeof flashvars !== "undefined" && flashvars.video_url) {
				mainFunction = function() {
					videoSource = (
						flashvars.video_alt_url3 ? flashvars.video_alt_url3 :
						flashvars.video_alt_url2 ? flashvars.video_alt_url2 :
						flashvars.video_alt_url ? flashvars.video_alt_url :
						flashvars.video_url
					);
					videoPoster = flashvars.preview_url;
				};
				initFunction();
			}
		}
		else if (pageURL.matchLink('https?://www.porntrex.com/embed/*')) { // https://www.porntrex.com/embed/162636
			if (typeof flashvars !== "undefined" && flashvars.video_url) {
				mainFunction = function() {
					videoSource = (
						flashvars.video_alt_url3 ? flashvars.video_alt_url3 :
						flashvars.video_alt_url2 ? flashvars.video_alt_url2 :
						flashvars.video_alt_url ? flashvars.video_alt_url :
						flashvars.video_url
					);
					videoPoster = flashvars.preview_url;
				};
				initFunction();
			}
		}
	}

	else if (pageURL.matchLink('https?://daftsex.com/watch/*')) {
		var video = document.querySelector('iframe');
		video = maximize(video);
	}

	else if (pageURL.matchLink('https://videos.porndig.com/player/index*')) { // https://videos.porndig.com/player/index/178913/1035/13800#
		mainFunction = function() {
			var quality = 0, src;
			document.querySelectorAll('video > source[label]').forEach(function(item) {
				var q = Number(item.getAttribute('label').match(/\d+/));
				if (q > quality) {
					quality = q;
					src = item.src;
				}
			});
			console.log('quality: '+quality);
			videoSource = src;
		};
		initFunction();
	}

	// else if (!document.querySelector('video[src]') && document.querySelectorAll('.jwdisplayIcon, #vplayer_display_button')) {
	// 	console.log('openload.co.user.js: ','skipped');
	// }

	else if (typeof flashvars !== "undefined" && flashvars.video_url) { // http://www.camwhores.tv/embed/127910?utm_source=prontv&utm_campaign=prontv&utm_medium=prontv
		mainFunction = function() {
			videoSource = flashvars.video_alt_url ? flashvars.video_alt_url : flashvars.video_url;
			videoPoster = flashvars.preview_url;
		};
		initFunction();
	} else {
		// if (!document.querySelector('video[src]')) {
		// 	var clicked = false, clickSelector = '.jwdisplayIcon';  // https://kingvid.tv/embed-kyy73pww38ox.html
		// 	clicked = clickElement(clickSelector); if (!clicked) {document.addEventListener('DOMNodeInserted', function handleNewElements(event){if (!clicked) clicked = clickElement(clickSelector);} , false);}
		// }
		waitForElement(videoSourceSelector, 'src', applyVideoSettings, delay, tries, false, waitGroup);
	}
})();