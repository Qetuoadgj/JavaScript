// ==UserScript==
// @name         complete.misc
// @icon         https://www.google.com/s2/favicons?domain=openload.co
// @version      0.0.01
// @description  Pure JavaScript version.
// @author       Ægir
// @namespace    complete.misc
// @grant        none
// @run-at       document-start

/// @noframes

// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/complete.misc.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc

// @require      https://code.jquery.com/jquery-3.2.1.min.js

// @match		 http://www.eporner.com/embed/*
// @match		 https://www.eporner.com/embed/*

// @match        http://openload.co/embed/*
// @match        https://openload.co/embed/*

// @match        http://yourporn.sexy/post/*.html
// @match        https://yourporn.sexy/post/*.html

// @match        http://www.camwhores.tv/embed/*
// @match        https://www.camwhores.tv/embed/*

// @match        http://www.bitporno.com/embed/*
// @match        https://www.bitporno.com/embed/*

// @match		 http://www.porntrex.com/video/*/*
// @match		 https://www.porntrex.com/video/*/*

// @match		 http://drive.google.com/file/d/*/preview?*
// @match		 https://drive.google.com/file/d/*/preview?*

// @match		 http://vidoza.net/embed-*
// @match		 https://vidoza.net/embed-*

// @match		 http://*.xfreehd.com/media/*.mp4
// @match		 https://*.xfreehd.com/media/*.mp4

// @match		 http://*.mp4
// @match		 https://*.mp4
// ==/UserScript==

(function() {
	'use strict';
	console.clear();
	// DEFAULT GLOBAL VARIABLES
	// ====================================================================================================================
	var pageHost = location.hostname,
		pageURL = location.href,
		pageTitle = document.title,
		shortURL = (location.protocol + '//' + location.host + location.pathname)
	;
	var refineVideoParam = 'REFINE_VIDEO';
	var refineVideo = function(url) {
		return 'chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html#' + url;
	};
	// ====================================================================================================================
	var funcToTest, funcToRun, delay = 10, tries = 500, timerGroup = [], waitForCondition = function(funcToTest, funcToRun, delay, tries, timerGroup) {
		if ((funcToTest && (typeof funcToTest).toLowerCase() == 'function') && (funcToRun && (typeof funcToRun).toLowerCase() == 'function')) {
			delay = delay || 1000; // defaults
			timerGroup = timerGroup || [];
			var timerGroupIndex = timerGroup ? (timerGroup.length > 0 ? timerGroup.length : 0) : null; // get Index for current function timer
			var ID = Math.floor((Math.random() * 9999) + 1000); // random ID for debug
			var startIteration = function(iteration, delay, count, timerGroup, timerGroupIndex) {
				var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
				if (timerGroup) {timerGroup[timerGroupIndex] = timer;} // add timer to timerGroup
			};
			var clearTimers = function(timerGroup) {
				if (timerGroup) for (var i = 0; i < timerGroup.length; ++i) {clearTimeout(timerGroup[i]); if (i == timerGroup.length-1) {timerGroup = [];}}
			};
			var iteration = function(count) {
				var keepRun = tries ? (count <= tries) : true;
				if (keepRun) {
					var result = funcToTest();
					console.log('iteration: ', count);
					if (result) {clearTimers(timerGroup); return funcToRun();} else startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
				}
			};
			iteration(1); // 1st iteration
		}
	};

	String.prototype.addToURL = function(param, separator, prefix, postfix) {
		prefix = prefix || ''; postfix = postfix || '';
		var url = this.split(separator)[0] || '', params = this.split(separator)[1] || '';
		var result = url + separator + params + prefix + param + postfix;
		return result;
	};

	String.prototype.matchLink = function(link, flags) {
		link = link.replace(/[.\/]/g, "\\$&");
		link = link.replace(/\*/g, ".*");
		var re = new RegExp(link, flags);
		return this.match(re);
	};

	NodeList.prototype.forEach = Array.prototype.forEach; // Source: https://gist.github.com/DavidBruant/1016007
	HTMLCollection.prototype.forEach = Array.prototype.forEach; // Because of https://bugzilla.mozilla.org/show_bug.cgi?id=14869
	// ====================================================================================================================
	if (
		pageURL.matchLink('https?://www.eporner.com/embed/*') // https://www.eporner.com/embed/DQ1fQ5H7Jkz
	) {
		funcToTest = function() {
			return document.querySelector('body video[src]') && document.querySelector('head > meta[itemprop="contentUrl"][content]');
		};
		funcToRun = function() {
			var quality = 0, menuItem;
			var qualityTable = {};
			document.querySelectorAll('.vjs-menu-content > .vjs-menu-item').forEach(function(item) { // https://www.eporner.com/embed/HYmQUXbhRrR
				var button = item.querySelector('.vjs-menu-item-text');
				var text = button ? button.innerText : '';
				var q = Number(text.match(/\d+/));
				if (q > quality) {quality = q; menuItem = item;}
			});
			if (menuItem) menuItem.click();
			console.log('quality: '+quality);
			var contentURL;
			var video = document.querySelector('body video');
			var src = video.src;
			if (src.match("blob:")) {
				var content = document.querySelector('head > meta[itemprop="contentUrl"]').content;
				video.src = content;
				waitForCondition(
					function(){return video.src != content;},
					function(){
						contentURL = video.src;
						window.location.href = refineVideo(contentURL);
					}, delay, tries, timerGroup
				);
			} else {
				contentURL = video.src;
				console.log('contentURL: ', contentURL);
				window.location.href = refineVideo(contentURL);
			}
		};
		waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
	}

	else if (
		pageURL.matchLink('https?://openload.co/embed/*') // https://openload.co/embed/GwWaJKr7q-g/
	) {
		funcToTest = function() {
			var url = document.querySelector('#streamurl');
			var ready = url && url.innerText && !url.innerText.match("HERE IS THE LINK");
			return ready;
		};
		funcToRun = function() {
			var contentURL = location.protocol + '//' + location.host + '/stream/' + document.querySelector('#streamurl').innerText + '?mime=true';
			// var posterURL = document.querySelector('#olvideo_html5_api').poster;
			console.log('contentURL: ', contentURL);
			window.location.href = refineVideo(contentURL);
		};
		waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
	}

	else if (
		pageURL.matchLink('https?://yourporn.sexy/*')
	) {
		if (pageURL.match('#onlyVideo')) { // https://yourporn.sexy/post/59772cebee27b.html#onlyVideo
			funcToTest = function() {
				return document.querySelector('body video[src]');
			};
			funcToRun = function() {
				var contentURL = document.querySelector('body video[src]').src;
				console.log('contentURL: ', contentURL);
				window.location.href = refineVideo(contentURL);
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);

		}
	}

	else if (
		pageURL.matchLink('https?://www.porntrex.com/video/*/*')
	) {
		if (pageURL.match('#onlyVideo')) { // https://www.porntrex.com/video/162636/kiera-winters-sex-queen-and-her-prince#onlyVideo
			funcToTest = function() {
				return typeof flashvars !== "undefined" && flashvars.video_url;
			};
			funcToRun = function() {
				var contentURL = (
					flashvars.video_alt_url3 ? flashvars.video_alt_url3 :
					flashvars.video_alt_url2 ? flashvars.video_alt_url2 :
					flashvars.video_alt_url ? flashvars.video_alt_url :
					flashvars.video_url
				);
				var posterURL = flashvars.preview_url;
				console.log('contentURL: ', contentURL);
				window.location.href = refineVideo(contentURL);
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		}
	}

	else if (
		pageURL.matchLink('https?://drive.google.com/file/d/*/preview[?]*(start=1|autoplay=1)') // https://drive.google.com/file/d/0B8vZ-fFzt8h8Y2VWbVdGQ2dFdzA/preview?start=1&autoplay=1
	) {
		funcToTest = function() {
			return document.querySelector('.drive-viewer-video-preview-img[src]');
		};
		funcToRun = function() {
			var playButton = document.querySelector('div.drive-viewer-video-preview > img');
			if (playButton) playButton.click();
		};
		waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);

	}

	else if (
		pageURL.matchLink('https?://vidoza.net/embed-*') // https://vidoza.net/embed-gzp9id6hi29d.html
	) {
		var handleElements = function(event) {
			var contentURL;
			document.scripts.forEach(function(script) {
				var text = script.text;
				if (text.match(/{file:.*"(.*.mp4)",label:"\d+p"}/i)) {
					var video_url = text.match(/{file:.*"(.*.mp4)",label:"\d+p"}/i);
					contentURL = video_url ? video_url[1] : null;
					console.log('contentURL: ', contentURL);
					window.location.href = refineVideo(contentURL);
				}
			});
		};
		document.addEventListener('DOMContentLoaded', handleElements, false);
	}

	else if (
		pageURL.split("?")[0].split("#")[0].endsWith("mp4") // https://b02.xfreehd.com/media/videos/hd/11960.mp4
	) {
		var contentURL = pageURL;
		console.log('contentURL: ', contentURL);
		window.location.href = refineVideo(contentURL);
	}

	else if (typeof flashvars !== "undefined" && flashvars.video_url) { // http://www.camwhores.tv/embed/127910?utm_source=prontv&utm_campaign=prontv&utm_medium=prontv
		funcToTest = function() {
			return flashvars.video_alt_url || flashvars.video_url;
		};
		funcToRun = function() {
			var contentURL = (flashvars.video_alt_url || flashvars.video_url).match(/(https?:.*)/)[1];
			var posterURL = flashvars.preview_url;
			console.log('contentURL: ', contentURL);
			window.location.href = refineVideo(contentURL);
		};
		waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
	} else { // https://www.bitporno.com/embed/sXou0BTtX
		funcToTest = function() {
			return document.querySelectorAll("body video > source[src], body video[src]")[0];
		};
		funcToRun = function() {
			document.querySelectorAll("body video > source[src], body video[src]").forEach(function(e){
				var contentURL = e.src;
				console.log('contentURL: ', contentURL);
				window.location.href = refineVideo(contentURL);
			});
		};
		waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
	}

})();