// ==UserScript==
// @name         openload.co
// @icon         https://www.google.com/s2/favicons?domain=openload.co
// @version      1.2.5
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/openload.co.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        https://openload.co/embed/*
// @match        https://openload.co/f/*
// @match        https://oload.tv/f/*
// @match        https://oload.tv/f/*
// @match        https://oload.tv/embed/*
// @match        https://www.pornhub.com/embed/*
// @match        http://porndoe.com/video/embed/*
// @match        http://www.eporner.com/embed/*
// @match        https://www.eporner.com/embed/*
// @match        http*://www.tube8.com/embed/*
// @match        http://streamin.to/embed*
// @match        http://pron.tv/embed/*
// @match        http://cdn.rhcdn.net/*.html
// @match        https://hqcollect.me/embed/*

/// @match        https://daxab.com/embed/*
/// @match        https://biqle.ru/RD/*

// @match        https://www.bitporno.sx/embed/*
// @match        https://www.bitporno.com/embed/*

// @match        http://www.porn.com/videos/embed/*
// @match        http://www.porn.com/videos/*?EMBED

// @match        https://*.googlevideo.com/videoplayback?id=*
// @match        http://*.porndoe.com/movie/*/*/*/*/*/*.mp4*
// @match        http://*.eporner.com/*/*/*-*p.mp4
// @match        http://mcloud.hdporncollections.com/*.mp4
// @match        http://redirector.rhcdn.net/media/videos/hd/*.mp4
// @match        http://*.rhcdn.net/media/videos/hd/*.mp4?*
// @match        https://*.pornhub.com/videos/*/*/*/*.mp4?*

// @match       http://www.camwhores.tv/embed/*

// @match        http://e.yespornplease.com/e/*
// @match        http://vshare.io/v/*

// @match        http://www.miscopy.com/?*video_embed*
// @match        https://vidoza.net/embed-*

// @match        http://www.txxx.com/embed/*

// @match        https://www.playvids.com/embed/*

// @match       https://drive.google.com/file/d/*/preview?*

// @match       https://*.trafficdeposit.com/bvideo/*/*/*/*.mp4
// @match       https://*.atlas.cdnity.net/-*_*/
// ==/UserScript==

(function() {
	'use strict';

	// THIS FILE GLOBAL VARIABLES
	// ====================================================================================================================
	var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
	var videoElement, videoSource, videoPoster, videoCleaned;
	var videoSourceSelector = 'video > source[type="video/mp4"], video';
	var waitGroup = []; // waitForElement() timers group.

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
			}
		};
		window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
	};

	function showMsgBox(video) {
		var width = video.videoWidth, height = video.videoHeight;
		console.log('video: '+video.src+' ['+width+'x'+height+']');
		var msg = msgbox('Video', 'Size: '+(width+' x '+height)+'\n'+getDomain(pageURL), 2000, 250, 120);
		msg.style.right = 0 + 'px';
		msg.style.bottom = 32 + 'px';
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
				video.focus();
				video.currentTime = video.pause();
			}
		};
		window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
	};



	var getCleanVideo = function(videoSrc, posterSrc) {
		var video = document.createElement('video');
		video.setAttribute('src', videoSrc);
		if (posterSrc) video.setAttribute('poster', posterSrc);
		video.setAttribute('controls', '');
		video.setAttribute('webkitallowfullscreen', '');
		video.setAttribute('mozallowfullscreen', '');
		video.setAttribute('allowfullscreen', '');
		document.documentElement.innerHTML = '';
		// document.removeChild(document.documentElement); // clear document
		document.body.appendChild(video);
		/*
		if (inIframe()) {
            addGlobalStyle('video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black;}');
        } else {
            addGlobalStyle('video {position: absolute; width: auto; height: auto; max-height: 100%; max-width: 100%; background: black; transform: translate(-50%, -50%); top: 50%; left: 50%;}');
        }
	    */
		addGlobalStyle('video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black;}');
		// addGlobalStyle('video {transform: translate(-50%, -50%); top: 50%; left: 50%;}');
		addGlobalStyle('body {margin: 0; background: black;}');

		video.addEventListener("loadedmetadata",function(e){showMsgBox(video);},false);
		X_Key_ShowMsgBox(video);

		CtrlC_FocusParent();
		addVideoControlShortcuts(video);
		return video;
	};

	var getCleanMedia = function(mediaSrc, posterSrc, mediaType) {
		var media = document.createElement(mediaType);
		media.setAttribute('src', mediaSrc);
		if (posterSrc)  media.setAttribute('poster', posterSrc);
		media.setAttribute('controls', '');
		media.setAttribute('webkitallowfullscreen', '');
		media.setAttribute('mozallowfullscreen', '');
		media.setAttribute('allowfullscreen', '');
		document.documentElement.innerHTML = '';
		// document.removeChild(document.documentElement); // clear document
		document.body.appendChild( media);
		var mediaStyle = 'position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black;';
		media.setAttribute('style', mediaStyle);
		return  media;
	};

	function applyVideoSettings() {
		videoSource = videoSource || document.querySelectorAttribute(videoSourceSelector, 'src');
		// videoPoster = null; //video.poster
		videoCleaned = getCleanVideo(videoSource, videoPoster);
		// videoCleaned.play();
		videoCleaned.autoplay = false; // videoCleaned.preload = "none";
		videoCleaned.volume = 0.5;
		addMouseWheelAudioControl(videoCleaned, 5);
		useVolumeCookie('body > video', null);
		waitGroup = null;
	}
	var mainFunction, initFunction = function(){mainFunction(); applyVideoSettings();}, getSource;
	var delay = 10, tries = 1500;
	var playButtonSelector;
	var clickPlay = function(){var p = document.querySelector(playButtonSelector); p.click(); waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, null, waitGroup);};
	// ====================================================================================================================

	if (pageURL.matchLink('https://openload.co/*') || pageURL.matchLink('https://oload.tv/*')) { // https://openload.co/embed/pM1MQGKY7z4/
		mainFunction = function() {
			videoSource = '/stream/' + document.querySelector('#streamurl').innerText + '?mime=true';
			videoPoster = null; //document.querySelector('#olvideo_html5_api').poster
		};
		waitForElement('#streamurl', false, initFunction, delay, tries, false, waitGroup);
	}

	else if (
		pageURL.matchLink('https://www.pornhub.com/*') || // https://www.pornhub.com/embed/ph55b7a22ed4339
		pageURL.matchLink('http[s]?://www.tube8.com/embed/*') || // http://www.tube8.com/embed/teen/all-a-slut-needs-is-a-reason/31637961/
		pageURL.matchLink('http://porndoe.com/*') || // http://porndoe.com/video/embed/45914/deep-throat-fucking-sasha-grey
		pageURL.matchLink('http://streamin.to/*') // http://streamin.to/embed-zlu0667c26hp-828x480.html
	) {
		mainFunction = function() {
			videoSource =  document.querySelectorAttribute(videoSourceSelector, 'src');
			videoPoster = null; //video.poster
		};
		waitForElement(videoSourceSelector, 'src', initFunction, delay, tries, false, waitGroup);
	}

	else if (pageURL.matchLink('http[s]?://www.eporner.com/*')) { // http://www.eporner.com/embed/ddPNLJUuNih/
		mainFunction = function() {
			videoSource =  document.querySelectorAttribute('#EPvideo_html5_api', 'src');
			videoPoster = null; //video.poster
		};
		waitForElement('#EPvideo_html5_api', 'src', initFunction, delay, tries, false, waitGroup);
	}

	else if (
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
	}

	else if (
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
		pageURL.matchLink('https://www.bitporno.com/embed/*')   // https://www.bitporno.com/embed/uu25seLu
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
	}

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

	else if (typeof flashvars !== "undefined" && flashvars.video_url) { // http://www.camwhores.tv/embed/127910?utm_source=prontv&utm_campaign=prontv&utm_medium=prontv
		mainFunction = function() {
			videoSource = flashvars.video_url;
			videoPoster = flashvars.preview_url;
		};
		initFunction();
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
						m3u8_url =  text.match(/var m3u8_url="(.*)"/i);
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
		mainFunction = function() {
			var maxQualityButton = document.querySelector('#mediaPlayerQualityList > .item[data-quality]');
			document.querySelectorAll('#mediaPlayerQualityList > .item[data-quality]').forEach(function(e) {
				var quality = e.dataset.quality;
				if (quality > maxQualityButton.dataset.quality) maxQualityButton = e;
			});
			if (maxQualityButton) maxQualityButton.click();
			// videoSource = document.querySelector(videoSourceSelector).getAttribute('src');
			// videoPoster = null; //document.querySelector('#olvideo_html5_api').poster
		};
		// initFunction();
		waitForElement('#mediaPlayerQualityList > .item[data-index="1"]', null, mainFunction, delay, tries, false, waitGroup);
	}

	else if (pageURL.matchLink('https://drive.google.com/file/d/*/preview[?]*(start=1|autoplay=1)')) { // https://drive.google.com/file/d/0B8vZ-fFzt8h8Y2VWbVdGQ2dFdzA/preview?start=1&autoplay=1
		mainFunction = function() {
			var playButton = document.querySelector('div.drive-viewer-video-preview > img');
			if (playButton) playButton.click();
		};
		waitForElement('.drive-viewer-video-preview-img', 'src', mainFunction, delay, tries, false, waitGroup);
	}

	else {
		waitForElement(videoSourceSelector, 'src', applyVideoSettings, delay, tries, false, waitGroup);
	}
})();