// ==UserScript==
// @name         complete.misc
// @icon         https://www.google.com/s2/favicons?domain=openload.co
// @version      0.0.01
// @description  Pure JavaScript version.
// @author       Ægir
// @namespace    complete.misc

/// @grant       none
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue

// @run-at       document-end

/// @noframes

// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/complete.misc.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc

/// @require      https://code.jquery.com/jquery-3.2.1.min.js

// @match		 *://www.eporner.com/hd-porn/*/*/
// @match		 *://www.eporner.com/embed/*

// @match        *://openload.co/embed/*
// @match        *://oload.tv/embed/*
// @match        *://oload.info/embed/*

// @match        *://yourporn.sexy/post/*.html*

// @match        *://www.camwhores.tv/embed/*

// @match        *://www.bitporno.com/embed/*

// @match		 *://www.porntrex.com/video/*/*

// @match		 *://drive.google.com/file/d/*/preview?*

// @match		 *://vidoza.net/embed-*

// @match		 *://xfreehd.com/video/*/*
// @match		 *://*.xfreehd.com/media/*.mp4

// @match		 *://yespornplease.com/view/*
// @match		 *://e.yespornplease.com/e/*
// @match		 *://vshare.io/v/*

// @match		 *://*.googlevideo.com/videoplayback?id=*
// @match		 *://*.googleusercontent.com/*=*?c=WEB&cver=html5

// @match		 *://www.pornhub.com/embed/*
// @match		 *://www.pornhub.com/view_video.php?viewkey=*

// @match		 *://www.tube8.com/embed/*
// @match		 *://www.tube8.com/*/*/*/

// @match		 *://*/*.mp4

// @match		 *://www.imagefap.com/pictures/*/*?*view=2

// @match		 *://pron.tv/*

// @match		 *://fuckingsession.com/*/

// @match		 *://www.porntube.com/videos/*
// @match		 *://www.porntube.com/embed/*

// @match		 *://www.miscopy.com/?attachment_id=*

// @match		 *://javhihi.com/movie/*

// @match		 *://www.x-art.com/galleries/*
// @match		 *://www.pornpics.com/*
// @match		 *://www.sex.com/picture/*/
// @match		 *://www.sex.com/pin/*/
// @match        *://danbooru.donmai.us/posts*
// @match        *://luscious.net/c/hentai/pictures/*
// @match        *://vipergirls.to/threads/*/page*

// @match		 *://*/*.jpg
// ==/UserScript==

(function() {
	'use strict';
	// console.clear();
	// if (document.body) {
	// 	document.body.style.background = 'black';
	// 	document.body.style.display = 'none';
	// }
	// DEFAULT GLOBAL VARIABLES
	// ====================================================================================================================
	var TEST_MODE = false;
	var URL_MATCHED;
	function cutURL(url) {return url.replace(/^.*?:\/\//, '').trim();}
	var pageHost = location.hostname,
		pageURL = location.href,
		pageTitle = document.title,
		shortURL = (location.protocol + '//' + location.host + location.pathname).trim(),
		cuttenURL = cutURL(pageURL)
	;
	var refineVideoParam = 'REFINE_VIDEO';
	if (location.href.match('autoplay=true')) {
		GM_setValue('autoplay', true);
		var autoplay = GM_getValue('autoplay', null);
	}
	var duration = location.href.match(/\bt\b=((\d+)(,\d+)?)/);
	if (duration) {
		GM_setValue('t', duration[1]);
		var t = GM_getValue('t', null);
	}
	var refineVideo = function(url) {
		// if (TEST_MODE) return;
		var autoplay = GM_getValue('autoplay', null);
		var t = GM_getValue('t', null);
		console.log('autoplay: ' + autoplay || 'false');
		if (autoplay) {
			url = url.split('?')[1] ? url + '&' + 'autoplay=true' : url + '?' + 'autoplay=true';
			GM_deleteValue('autoplay');
			url = url.replace('#autoplay=true&autoplay=true', '&autoplay=true');
		}
		if (t) {
			console.log('t: ' + t);
			url = url.split('?')[1] ? url + '&' + 't='+t : url + '?' + 't='+t;
			GM_deleteValue('t');
		}
		return 'chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html#' + url;
	};
	var openURL = function(url) {
		GM_deleteValue('contentURL');
		// GM_deleteValue('G_sampleURL');
		// GM_deleteValue('sources');
		if (TEST_MODE) return;
		window.location.href = url;
	};
	// TEST_MODE = true;
	// ====================================================================================================================
	var funcToTest, funcToRun, delay = 50, tries = 100, timerGroup = [], funcResult,
		waitForCondition = function(funcToTest, funcToRun, delay, tries, timerGroup) {
			if ((funcToTest && (typeof funcToTest).toLowerCase() == 'function') && (funcToRun && (typeof funcToRun).toLowerCase() == 'function')) {
				// console.log('funcToTest: '+funcToTest.toString());
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
		},
		waitForElement = function(elementSelector, attribute, funcToRun, delay, tries, timerGroup) {
			var funcToTest = function() {
				console.log('elementSelector: '+elementSelector+', attribute: '+attribute);
				var result, elementsArray = document.querySelectorAll(elementSelector);
				for (var i = 0; i < elementsArray.length; ++i) {
					var element = elementsArray[i];
					var value = element ? element.getAttribute(attribute) : null;
					result = attribute ? value : element;
					if (result && result !== '') {
						funcResult = element;
						break;
					}
				}
				return result;
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		}
	;

	String.prototype.addToURL = function(param, separator, prefix, postfix) {
		prefix = prefix || ''; postfix = postfix || '';
		var url = this.split(separator)[0] || '', params = this.split(separator)[1] || '';
		var result = url + separator + params + prefix + param + postfix;
		return result;
	};

	String.prototype.matchLink = function(link, flags) {
		var original = link;
		link = link.replace(/[.\/]/g, "\\$&");
		link = link.replace(/\*/g, ".*");
		var re = new RegExp(link, flags);
		var result = this.match(re);
		if (result) URL_MATCHED = 'matchLink: ' + original + (flags ? ' ; flags: ' + flags : '');
		return result;
	};

	NodeList.prototype.forEach = Array.prototype.forEach; // Source: https://gist.github.com/DavidBruant/1016007
	HTMLCollection.prototype.forEach = Array.prototype.forEach; // Because of https://bugzilla.mozilla.org/show_bug.cgi?id=14869
	// function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}

	function injectNode(tagName, parentNode, innerHTML) {
		var e = document.createElement(tagName);
		if (typeof parentNode == "string") parentNode = document.querySelector(parentNode);
		parentNode.appendChild(e);
		if (innerHTML) e.innerHTML = innerHTML;
		return e;
	}

	function getWindowVar(varName) {
		var script = injectNode('script',  document.head, 'function getVar(varName){return window[varName];}');
		var result = getVar(varName);
		script.remove();
		return result;
	}

	var getAbsoluteUrl = (function(){var a; return function(url){if(!a) a = document.createElement('a'); a.href = url; return a.href; };})();

	function addGlobalStyle(css, cssClass) {
		var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
		var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
		if (cssClass) style.setAttribute('class', cssClass);
		head.appendChild(style);
	}

	function isVisible(element) {return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;}

	function getVisibleElement(elements) {
		for (var i = 0; i < elements.length; ++i) {
			var element = elements[i];
			console.log(element, 'isVisible: '+isVisible(element));
			if (isVisible(element)) {
				return element;
			}
		}
		return;
	}

	// * Converts an HSL color value to RGB. Conversion formula
	// * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	// * Assumes h, s, and l are contained in the set [0, 1] and
	// * returns r, g, and b in the set [0, 255].
	// *
	// * @param   {number}  h       The hue
	// * @param   {number}  s       The saturation
	// * @param   {number}  l       The lightness
	// * @return  {Array}           The RGB representation
	function hslToRgb(h, s, l){
		var r, g, b;
		if(s === 0){
			r = g = b = l; // achromatic
		}else{
			var hue2rgb = function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			};
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	// * Converts an RGB color value to HSL. Conversion formula
	// * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	// * Assumes r, g, and b are contained in the set [0, 255] and
	// * returns h, s, and l in the set [0, 1].
	// *
	// * @param   {number}  r       The red color value
	// * @param   {number}  g       The green color value
	// * @param   {number}  b       The blue color value
	// * @return  {Array}           The HSL representation
	function rgbToHsl(r, g, b){
		r /= 255; g /= 255; b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
		if(max == min){
			h = s = 0; // achromatic
		}else{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return [h, s, l];
	}

	function pickColourByScale(percent, clip, saturation, start, end, format) {
		format = format || 'hsl';
		var a = (percent <= clip) ? 0 : (((percent - clip) / (100 - clip))),
			b = Math.abs(end - start) * a,
			c = (end > start) ? (start + b) : (start - b);
		var h = c, s = saturation, l = '50%';
		if (format=='hsl') {
			return 'hsl(' + c + ','+ saturation +'%,50%)';
		} else {
			var rgb = hslToRgb(h, s, l);
			return 'rgb('+rgb[1]+', '+rgb[2]+', '+rgb[3]+')';
		}
	}

	function addHDtext(parentElement, qualityText, qualityPercent, textColor, backGroundAlpha, opactity) {
		backGroundAlpha = backGroundAlpha === 0 ? 0 : backGroundAlpha ? backGroundAlpha : 0.4;
		var mainDiv = document.createElement('div');
		mainDiv.style.background = pickColourByScale(qualityPercent, 1, 100, 0, 100);
		mainDiv.style.background = mainDiv.style.background.replace(/rgb\((.*)\)/, 'rgba($1, '+backGroundAlpha+')');
		console.log(mainDiv.style.background);
		mainDiv.style.zIndex = 2147483647; // '10000';
		mainDiv.style.position = 'absolute'; // 'inherit'
		mainDiv.style.width = 'auto';
		mainDiv.style.height = '20px';
		mainDiv.style.float = 'right';
		mainDiv.style.right = '0';
		if (textColor) mainDiv.style.color = textColor; // 'rgba(0, 253, 255, 0)';
		mainDiv.style.padding = '0px 2px';
		mainDiv.style.border = '1px solid rgba(255, 255, 255, 0.2)';
		mainDiv.innerText = qualityText;
		mainDiv.style.opacity = opactity === 0 ? 0 : opactity ? opactity : 0.65;
		parentElement.insertBefore(mainDiv, parentElement.firstChild);
	}
	// ====================================================================================================================
	var G_embedCodeText, G_refreshEmbedCodeText = true, G_contentTitle, G_contentURL, G_posterURL, G_posters, G_sampleURL, G_altText,
		G_embedCodeFrame, G_embedCodeTextArea, G_embedCodeLink, G_sampleVideo, G_stickTo, G_stickPosition, G_qualityButtons,
		G_embedCodeAutoHeight = true, G_embedCodeFixedHeight = false, G_IsVideo = true, G_noVideoSource = false;

	String.prototype.capitalize = function() {
		function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
		return this.split(' ').map(capFirst).join(' ');
	};

	String.prototype.toTitleCase = function(lower) {
		var string = lower ? this.toLowerCase() : this;
		var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
		return string.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
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

	Element.prototype.appendElement = function(targetFrame, appendPosition) {
		if (appendPosition == 'after') targetFrame.parentNode.insertBefore(this, targetFrame.nextSibling);
		else if (appendPosition == 'before') targetFrame.parentNode.insertBefore(this, targetFrame);
		else if (!appendPosition || appendPosition == 'append') targetFrame.appendChild(this);
	};

	Element.prototype.autoHeight = function(fixedHeight) {
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px';
		if (fixedHeight > 0) this.style.maxHeight = this.style.height;
		this.addEventListener('click', this.autoHeight, false);
	};

	function addOpenInNewTabProperty (selector) {
		selector = selector || 'a';
		var linksArray = document.querySelectorAll(selector);
		// alert(selector+'\n'+linksArray.length);
		for (var i = 0; i < linksArray.length; ++i) {
			var link = linksArray[i], href = link.href;
			if (href) link.setAttribute('target', '_blank');
		}
	}

	function addPageControlKeys(prevPageSelector, nextPageSelector) {
		var previous_page_btn = document.querySelectorAll(prevPageSelector)[0];
		var next_page_btn = document.querySelectorAll(nextPageSelector)[0];
		var onKeyUp = function(e) {
			e = e || window.event;
			var lArrowKey = 37, rArrowKey = 39;
			var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
			if (e.keyCode == lArrowKey) previous_page_btn.click();
			else if (e.keyCode == rArrowKey) next_page_btn.click();
		};
		window.addEventListener("keyup", function(e){onKeyUp(e);}, false);
	}

	function addKeyComboCtrlC(targetElement, preventDefault, ignoreSelections) {
		var onKeyDown = function(e) {
			e = e || window.event;
			var cKey = 67;
			var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
			if (targetElement && ctrlDown && e.keyCode == cKey) {
				var selectedText = window.getSelection().toString();
				selectedText = ignoreSelections ? false : (selectedText && selectedText !== '');
				if (!selectedText) {
					targetElement.select();
					document.execCommand('copy');
					if (preventDefault) e.preventDefault();
				}
			}
		};
		window.addEventListener('keydown', function(e){onKeyDown(e);}, false);
	}

	function refineText(inputList) {
		var eventList = ['change', 'input', 'cut', 'copy', 'paste', 'focus', 'blur']; // 'keydown', 'keyup',
		var enterKey = 13, escKey = 27;
		var onEvent = function(input, e) {
			e = e || window.event;
			var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
			var query = input.value;
			if (e.keyCode == escKey) { // Escape
				return;
			}
			// else if (e.type == 'change') {
			if (query.match(/[^a-zA-Z0-9:.]+/)) {
				query = query.replace(/[^a-zA-Z0-9:.]+/g, ' ').replace(/^\s{2,}|\s{2,}$/g, '').toTitleCase(true);
				input.value = query;
			}
			// }
		};
		inputList.forEach(function(input){
			eventList.forEach(function(event){
				input.addEventListener(event,function(e){onEvent(input,e);},false);
			});
		});
	}

	var G_videoWidth, G_videoHeight;
	function getVideoData(video, run) {
		var showData = () => {
			console.log('video: '+video.src+' ['+width+'x'+height+']');
			G_videoWidth = width;
			G_videoHeight = height;
			run();
		};
		var width = video.videoWidth, height = video.videoHeight;
		if (width && height) {
			showData();
		} else {
			video.addEventListener('loadedmetadata', function (e) {
				width = this.videoWidth;
				height = this.videoHeight;
				showData();
			}, false );
		}
	}

	function embedCode(callerFunction) {
		var parentDocument = document;
		var id = 'embedCode';
		var embedCodeFrame = document.getElementById(id);
		if (embedCodeFrame) embedCodeFrame.remove();
		embedCodeFrame = parentDocument.createElement('div');
		embedCodeFrame.setAttribute('id', id);
		embedCodeFrame.style.setProperty('display', 'block', 'important');
		embedCodeFrame.style['word-wrap'] = 'break-word';
		embedCodeFrame.appendElement(G_stickTo, G_stickPosition);
		G_embedCodeFrame = embedCodeFrame;

		var createEmbedCodeText = () => {
			var tmpTitle = G_contentTitle;
			embedCodeTextArea.style.color = 'grey';
			G_contentTitle = G_contentTitle || pageTitle.replace(/^.{1} /i, '').capitalize();
			if (!G_embedCodeText || G_refreshEmbedCodeText) {
				G_embedCodeText = '<div class="thumbnail"';
				if (!G_sampleURL && G_contentURL.matchLink('https?://*.googleusercontent.com/*')) {
					if (G_contentURL.match('=m18?')) {G_videoWidth = 640; G_videoHeight = 360;}
					else if (G_contentURL.match('=m22?')) {G_videoWidth = 1270; G_videoHeight = 720;}
					else if (G_contentURL.match('=m37?')) {G_videoWidth = 1920; G_videoHeight = 1080;}
				}
				// if (G_videoWidth && G_videoHeight) G_contentTitle += ' [' + G_videoWidth + 'x' + G_videoHeight + ']';
				if (G_contentURL !== pageURL) G_embedCodeText += ' title="' + G_contentTitle + '"';
				if (G_posterURL && G_posterURL !== G_contentURL) G_embedCodeText += ' data-image="' + G_posterURL + '"';
				G_embedCodeText += ' data-content="' + G_contentURL + '"';
				if (G_contentURL !== pageURL) G_embedCodeText += ' data-url="' + pageURL + '"';
				if (G_altText) G_embedCodeText +=' alt="'+G_altText+'"';
				if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality="' + G_videoWidth + 'x' + G_videoHeight + '"';
				G_embedCodeText += '></div>';
			}
			embedCodeTextArea.value = G_embedCodeText;
			if (G_embedCodeAutoHeight) {
				embedCodeTextArea.autoHeight(G_embedCodeFixedHeight);
				// textArea.addEventListener("resize", textArea.autoHeight(textAreaFixedHeight));
			}
			if (G_videoWidth && G_videoHeight) embedCodeTextArea.style.color = pickColourByScale((G_videoWidth*G_videoHeight)/(1900*1080)*100, 1, 100, 0, 100); //'green';
			G_contentTitle = tmpTitle;
		};

		var embedCodeTextArea = parentDocument.createElement('textarea');
		embedCodeTextArea.setAttribute('id', embedCodeFrame.id + 'TextArea');
		embedCodeTextArea.style.setProperty('display', 'block', 'important');
		embedCodeTextArea.style.border = 'none';
		embedCodeTextArea.style['background-color'] = 'transparent';
		embedCodeTextArea.style.width = '100%';
		embedCodeTextArea.style['max-width'] = '100%';
		embedCodeTextArea.style.rows = '2';
		embedCodeTextArea.style.overflow = 'hidden';
		embedCodeTextArea.style['font-size'] = '12px';
		embedCodeTextArea.style.color = 'grey';
		embedCodeTextArea.setAttribute('readonly', 'readonly');
		embedCodeTextArea.setAttribute('onclick', 'this.focus(); this.select();');
		// embedCodeTextArea.value = G_embedCodeText;
		embedCodeFrame.appendChild(embedCodeTextArea);
		G_embedCodeTextArea = embedCodeFrame;
		createEmbedCodeText();

		addKeyComboCtrlC(embedCodeTextArea, true, false);

		var embedCodeLink = parentDocument.createElement('a');
		embedCodeLink.style.setProperty('display', 'block', 'important');
		embedCodeLink.style['font-size'] = '12px';
		embedCodeLink.style.color = '#086081';
		embedCodeLink.style.width = 'auto';
		embedCodeLink.setAttribute('target', '_blank'); // Open in new tab
		embedCodeLink.setAttribute('href', G_contentURL);
		embedCodeLink.text = embedCodeLink.href;
		embedCodeFrame.appendChild(embedCodeLink);
		G_embedCodeLink = embedCodeLink;

		var embedCodePoster = parentDocument.createElement('img');
		embedCodePoster.style.setProperty('display', 'inline-block', 'important');
		embedCodePoster.style['vertical-align'] = 'inherit';
		embedCodePoster.style['max-height'] = '120px';
		// embedCodePoster.style['min-width'] = '90px';
		embedCodePoster.style.width = 'auto';
		embedCodePoster.style.height = 'auto';
		embedCodePoster.setAttribute('src', G_posterURL);
		embedCodeFrame.appendChild(embedCodePoster);
		embedCodePoster.addEventListener('click', callerFunction, false);
		var posters = G_posters || []; // global value
		for (var index = 0; index < posters.length; index++) {
			if (embedCodePoster.naturalHeight === 0 || embedCodePoster.naturalWidth === 0) {
				embedCodePoster.setAttribute('src', posters[index]);
			}
		}

		var testVideo = () => {
			var embedCodeVideo = parentDocument.createElement('video');
			embedCodeVideo.style = embedCodePoster.getAttribute('style');
			// embedCodeVideo.style.display = 'none';
			embedCodeVideo.style['border-style'] = 'solid';
			embedCodeVideo.style['border-width'] = '1px';
			embedCodeVideo.setAttribute('preload', 'metadata');
			embedCodeVideo.setAttribute('src', G_sampleURL);
			embedCodeVideo.style.height = embedCodePoster.offsetHeight+'px';
			embedCodeVideo.style.width = embedCodePoster.offsetWidth+'px';
			embedCodeFrame.appendChild(embedCodeVideo);
			// embedCodeVideo.addEventListener('click', callerFunction, false);
			G_sampleVideo = embedCodeVideo;
			G_videoWidth = null;
			G_videoHeight = null;
			embedCodeVideo.addEventListener('loadedmetadata', function (e) {
				G_videoWidth = this.videoWidth;
				G_videoHeight = this.videoHeight;
				G_refreshEmbedCodeText = true;
				if (!G_contentURL) {
					G_contentURL = G_sampleURL;
					G_embedCodeLink.href = G_sampleURL;
					embedCodeLink.text = embedCodeLink.href;
				}
				createEmbedCodeText();
				G_sampleURL = null;
				GM_deleteValue('sources');
				GM_deleteValue('G_sampleURL');
				// embedCodePoster.style.height = document.querySelector('#embedCode > video').offsetHeight+'px';
				document.querySelector('#embedCode > video').remove();
			}, false );
			if (embedCodeVideo.outerHTML) embedCodeVideo.outerHTML = ' ' + embedCodeVideo.outerHTML;
		};
		if (G_IsVideo) waitForCondition(function(){G_sampleURL = G_sampleURL || GM_getValue('G_sampleURL', G_sampleURL); return G_sampleURL;}, testVideo, delay*2, tries/2, null);
		var qualityButtons = G_qualityButtons || []; // global value
		qualityButtons.forEach(function(item, index, array){item.addEventListener('click', callerFunction, false);});
	}
	// ====================================================================================================================
	G_IsVideo = false;
	if (
		pageURL.matchLink('https?://www.imagefap.com/pictures/*/*[?]*view=2')
	) {
		funcToRun = function() {
			var imagesArray = [];
			var thumbsArray = [];

			var userID = document.querySelector('#menubar > table > tbody > tr:nth-child(2) > td:nth-child(1) > a').href;
			userID = userID.replace(/.*user=(.*)/i, '$1');

			var galleryID = document.querySelector('#galleryid_input').value;

			var imageNames = document.querySelectorAll('td > font > i');
			imageNames.forEach(function(self, index, array) {
				var image = self.innerText;
				imagesArray.push(image);
			});

			var imageIDs = document.querySelectorAll('#gallery > form > table > tbody > tr > td');
			imageIDs.forEach(function(self, index, array) {
				var imageID = self.id;
				var image = imagesArray[index];
				var imageURL = 'http://x.imagefapusercontent.com/u/' + userID + '/' + galleryID + '/' + imageID + '/' + image;
				imagesArray[index] = imageURL;
			});

			var thumbs = gallery.querySelectorAll('#gallery > form > table > tbody > tr > td > table > tbody > tr > td > a > img');
			thumbs.forEach(function(self, index, array) {
				var thumbURL = self.src;
				thumbURL = thumbURL.replace(/.*\/thumb\/(.*)/i, ' http://x.fap.to/thumb/$1');
				thumbsArray.push(thumbURL);
				if (imagesArray[index].match('...')) imagesArray[index] = thumbURL.replace('x.fap.to/thumb/', 'x.fap.to/full/');
			});

			pageURL = pageURL.replace(/(.*?)\?.*/, '$1');

			G_refreshEmbedCodeText = false;
			thumbsArray.forEach(function(self, index, array) {
				G_contentURL = imagesArray[index];
				G_posterURL = self;
				G_contentTitle = '';
				if (G_embedCodeText) G_embedCodeText += '\n' + '<div class="thumbnail"'; else G_embedCodeText = '<div class="thumbnail"';
				if (G_contentURL !== pageURL) G_embedCodeText += ' title="' + G_contentTitle + '"';
				if (G_posterURL && G_posterURL !== G_contentURL) G_embedCodeText += ' data-image="' + G_posterURL + '"';
				G_embedCodeText += ' data-content="' + G_contentURL + '"';
				if (G_contentURL !== pageURL) G_embedCodeText +=' data-url="'+pageURL+'"';
				if (G_altText) G_embedCodeText +=' alt="'+G_altText+'"';
				if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality="' + G_videoWidth + 'x' + G_videoHeight + '"';
				G_embedCodeText += '></div>';
			});

			G_stickTo = document.querySelector('#gallery');
			G_stickPosition = 'after';
			embedCode(funcToRun);
		};
		waitForElement('#gallery', null, funcToRun, delay, tries, timerGroup);
		//
		return; // SKIP REST OF THE CODE
	}

	else if (
		pageURL.matchLink('https?://www.pornpics.com')
	) {
		var class_name = 'thumbwook';
		var valid = (item) => {return item.querySelector('a.rel-link > img');};
		//
		var i = 1, append_text = (item) => {
			if ( valid(item) ) {
				var text = item.querySelector('p.image_number_text');
				if (!text) {
					text = document.createElement('p');
					item.appendChild(text);
					text.innerText = '#' + i;
					text.class = 'image_number_text';
					text.style['font-size'] = 'x-large';
					text.style.margin = '0';
				}
				i++;
			}
		};
		//
		var array = document.querySelectorAll('.' + class_name);
		for (let item of array) {append_text(item);}
		//
		document.addEventListener('DOMNodeInserted', function handleNewElements(event){
			var item = event.target;
			var item_class = item.className ? item.className.trim() : '';
			if (item_class == class_name ) {append_text(item);}
		} , false);
		//
		if (
			pageURL.matchLink('https?://www.pornpics.com/galleries/*')
		) {
			document.addEventListener('DOMContentLoaded', function onContentLoaded(event) {
				funcToRun = function() {
					// pageURL = pageURL.replace(/(.*?)\?.*/, '$1');
					G_refreshEmbedCodeText = false;
					document.querySelectorAll('#main li.thumbwook > a').forEach(function(self, index, array) {
						G_contentURL = self.href;
						G_posterURL = self.querySelector('img').src;
						// data-size="683x1024"
						G_videoWidth = self.dataset && self.dataset.size ? self.dataset.size.split('x')[0] : null;
						G_videoHeight= self.dataset && self.dataset.size ? self.dataset.size.split('x')[1] : null;
						// G_contentTitle = '';
						G_contentTitle = document.querySelector('div.info-text1').textContent.replace('Description: ', '') + ' #' + (index+1);
						if (G_embedCodeText) G_embedCodeText += '\n' + '<div class="thumbnail"'; else G_embedCodeText = '<div class="thumbnail"';
						if (G_contentURL !== pageURL) G_embedCodeText += ' title="' + G_contentTitle + '"';
						if (G_posterURL && G_posterURL !== G_contentURL) G_embedCodeText += ' data-image="' + G_posterURL + '"';
						G_embedCodeText += ' data-content="' + G_contentURL + '"';
						if (G_contentURL !== pageURL) G_embedCodeText +=' data-url="'+pageURL+'"';
						if (G_altText) G_embedCodeText +=' alt="'+G_altText+'"';
						if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality="' + G_videoWidth + 'x' + G_videoHeight + '"';
						G_embedCodeText += '></div>';
					});
					G_stickTo = document.querySelector('#main');
					G_stickPosition = 'after';
					embedCode(funcToRun);
				};
				waitForElement('#main', null, funcToRun, delay, tries, timerGroup);
			} , false);
		}
		//
		return; // SKIP REST OF THE CODE
	}

	else if (
		pageURL.matchLink('https?://www.sex.com/*')
	) {
		if (
			pageURL.matchLink('https?://www.sex.com/pin/*/') ||
			pageURL.matchLink('https?://www.sex.com/picture/*/')
		) {
			funcToRun = function() {
				G_contentURL = document.querySelector('.image_frame img').src.replace(/(.*?)\?.*/, '$1');
				G_posterURL = document.querySelector('meta[itemprop="thumbnail"]').content;
				G_stickTo = document.querySelector('.image_frame');
				G_stickPosition = 'after';
				embedCode(funcToRun);
			};
			waitForElement('.image_frame img', 'src', funcToRun, delay, tries, timerGroup);
		}
		//
		return; // SKIP REST OF THE CODE
	}

	else if (
		pageURL.matchLink('https?://danbooru.donmai.us')
	) {
		addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
		addOpenInNewTabProperty('article > a');
		document.querySelectorAll('a.search-tag').forEach(function(link, index) {
			var href = link.href + '+limit%3A50&';
			link.href = href;
		});
		if (
			pageURL.matchLink('https?://danbooru.donmai.us/posts/*')
		) {
			funcToRun = function() {
				G_contentURL = document.querySelector('#image-container').getAttribute('data-large-file-url');
				G_contentURL = G_contentURL ? ('http://' + pageHost + G_contentURL) : G_contentURL;
				G_posterURL = document.querySelector('#image-container').getAttribute('data-preview-file-url');
				G_posterURL = G_posterURL ? ('http://' + pageHost + G_posterURL) : G_posterURL;
				G_stickTo = document.querySelector('#image-container');
				G_stickPosition = 'after';
				embedCode(funcToRun);
			};
			waitForElement('#image-container', 'data-preview-file-url', funcToRun, delay, tries, timerGroup);
		}
		//
		return; // SKIP REST OF THE CODE
	}

	else if (
		pageURL.matchLink('https?://luscious.net')
	) {
		// addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
		// addOpenInNewTabProperty('article > a');
		// document.querySelectorAll('a.search-tag').forEach(function(link, index) {
		//     var href = link.href + '+limit%3A50&';
		//     link.href = href;
		// });
		if (
			pageURL.matchLink('https?://luscious.net/c/hentai/pictures/*')
		) {
			funcToRun = function() {
				G_contentURL = document.querySelector('a.icon-download').getAttribute('href');
				G_posterURL = document.querySelector('div.album_details > a > img').getAttribute('src');
				G_stickTo = document.querySelector('div.picture_option');
				G_stickPosition = 'after';
				embedCode(funcToRun);
			};
			waitForElement('a.icon-download', 'href', funcToRun, delay, tries, timerGroup);
		}
		//
		return; // SKIP REST OF THE CODE
	}

	else if (
		pageURL.matchLink('https?://vipergirls.to/*')
	) {
		addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
		if (
			pageURL.matchLink('https?://vipergirls.to/threads/*/page*')
		) {
			funcToRun = function() {
				var imagesArray = [];
				var thumbsArray = [];

				var thumbs = document.querySelectorAll('.postcontent > a > img');

				thumbs.forEach(function(self, index) {
					var thumbURL = self.src;
					// http://t6.imgchili.com/27208/27208100_dawsonmiller_yellow_.jpg --> http://i6.imgchili.net/27208/27208100_dawsonmiller_yellow_.jpg
					var imageURL = thumbURL.replace(/http:\/\/t(.*?)\.imgchili.com\//i, 'http://i$1.imgchili.net/');
					thumbsArray.push(thumbURL);
					imagesArray.push(imageURL);
				});

				G_refreshEmbedCodeText = false;
				thumbsArray.forEach(function(self, index, array) {
					G_contentURL = imagesArray[index];
					G_posterURL = self;
					G_contentTitle = '';
					if (G_embedCodeText) G_embedCodeText += '\n' + '<div class="thumbnail"'; else G_embedCodeText = '<div class="thumbnail"';
					if (G_contentURL !== pageURL) G_embedCodeText += ' title="' + G_contentTitle + '"';
					if (G_posterURL && G_posterURL !== G_contentURL) G_embedCodeText += ' data-image="' + G_posterURL + '"';
					G_embedCodeText += ' data-content="' + G_contentURL + '"';
					if (G_contentURL !== pageURL) G_embedCodeText +=' data-url="'+pageURL+'"';
					if (G_altText) G_embedCodeText +=' alt="'+G_altText+'"';
					if (G_videoWidth && G_videoHeight) G_embedCodeText += ' data-quality="' + G_videoWidth + 'x' + G_videoHeight + '"';
					G_embedCodeText += '></div>';
				});

				G_stickTo = document.querySelector('.navlinks');
				G_stickPosition = 'before';
				embedCode(funcToRun);
			};
			waitForElement('.navlinks', null, funcToRun, delay, tries, timerGroup);
		}
		//
		return; // SKIP REST OF THE CODE
	}

	else if (
		pageURL.matchLink('*.jpg')
	) {
		funcToRun = function() {
			var val = 0;

			G_contentTitle = document.title;
			G_contentURL = shortURL;
			G_posterURL = shortURL;
			G_stickTo = document.querySelector('body');
			G_stickPosition = 'append';
			embedCode(funcToRun);
		};
		waitForElement('img', 'src', funcToRun, delay, tries, timerGroup);
		//
		return; // SKIP REST OF THE CODE
	}

	// ====================================================================================================================

	else if (
		pageURL.matchLink('https?://www.x-art.com')
	) {
		if (
			pageURL.matchLink('https?://www.x-art.com/galleries/*') // https://www.x-art.com/galleries/Kristin%20and%20Nina%20Unleashed/
		) {
			// <a href="https://www.x-art.com/join/" class="button expand">View Gallery</a>
			for (let link of document.querySelectorAll('a.button.expand')) {
				var text = link.innerText;
				var match = text.match('View Gallery');
				if (match) {
					var gallery_url = 'http://hosted.x-art.com/galleries/' + decodeURI(shortURL.replace(/.*\/galleries\/(.*?)\//i, '$1')).replace(/ /g, '_').toLowerCase() + '/index.php';
					// https://www.x-art.com/galleries/Kristin%20and%20Nina%20Unleashed/
					// http://hosted.x-art.com/galleries/kristin_and_nina_unleashed/index.php?PA=1044800
					link.href = gallery_url;
					break;
				}
			}
		}
		return; // SKIP REST OF THE CODE
	}
	// ====================================================================================================================
	var sources = GM_getValue('sources', {});
	function getVideoSources() {
		GM_deleteValue('contentURL');
		GM_deleteValue('G_sampleURL');
		GM_deleteValue('sources');
		sources = {};
		var getSources = function() {
			var src;
			for (let video of document.querySelectorAll('video > source[src^="http"], video[src^="http"]')) {
				src = video.getAttribute('src', 2);
				if (src && src.match('http')) break;
			}
			var quality = 0;
			document.querySelectorAll('video > source[src^="http"]').forEach(function(source) {
				var res = source.dataset.res;
				if (res) {
					var value = Number(res.match(/\d+/));
					if (value > quality) {quality = value; src = source.getAttribute('src', 2);}
				}
			});
			if (document.querySelector('#streamurl')) src = src || location.protocol + '//' + location.host + '/stream/' + document.querySelector('#streamurl').innerText + '?mime=true';
			sources[cuttenURL] = src;
			GM_setValue('G_sampleURL', src);
			console.log('cuttenURL: ', cuttenURL, '\nvideo.src: ', src);
			GM_setValue('sources', sources);
		};
		waitForElement('video > source[src^="http"], video[src^="http"], #streamurl', null, getSources, delay, tries, null);
	}
	// if (!G_noVideoSource) getVideoSources();
	// ====================================================================================================================
	G_IsVideo = true;
	if (
		pageURL.matchLink('https?://www.eporner.com')
	) {
		if (
			pageURL.matchLink('https?://www.eporner.com/hd-porn/*/*/')
		) {
			funcToRun = function() {
				var val = 0;
				document.querySelectorAll('.vjs-menu-item-text').forEach(function(e) {
					var size = e.innerText.match(/(\d+)p/);
					if (size) val = Math.max(val, size[1]);
				});
				G_contentTitle = document.title;
				G_contentURL = document.querySelector('#embright > .textare1 > textarea').value.match(/.*src="(.*?)".*/i)[1];
				if (val !== 0) {
					var id = document.querySelector('#fid').value;
					var vid = G_contentURL.split('/')[4];
					G_sampleURL = location.protocol + '//' + location.host + '/dload/' + vid + '/' + val + '/' + id + '-' + val + 'p.mp4'; // https://www.eporner.com/dload/DQ1fQ5H7Jkz/480/1101004-480p.mp4
				}
				G_posterURL = document.querySelector('meta[property="og:image"]').content;
				G_stickTo = document.querySelector('#relateddiv');
				G_stickPosition = 'before';
				embedCode(funcToRun);
			};
			waitForElement('#EPvideo_html5_api', 'src', funcToRun, delay, tries, timerGroup);
		}
		else if (
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
							openURL(refineVideo(contentURL));
						}, delay, tries, timerGroup
					);
				} else {
					contentURL = video.src;
					console.log('contentURL: ', contentURL);
					openURL(refineVideo(contentURL));
				}
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		}
	}

	else if (
		pageURL.matchLink('https?://xfreehd.com/*')
	) {
		if (
			pageURL.matchLink('https?://xfreehd.com/video/*/*') // https://xfreehd.com/video/6388/carolina-abril-pool-guy-fun
		) {
			funcToRun = function() {
				G_contentTitle = document.title;
				// var titleShort = document.querySelector('meta[property="og:title"]').content;
				// if (val !== 0) G_contentTitle = G_contentTitle.replace(titleShort, titleShort + '[' + val + 'p] ');
				G_contentURL = document.querySelector('video > source').src;
				G_contentURL = document.querySelector('.nv-hdicon') ? G_contentURL.replace('/iphone/', '/hd/') : G_contentURL;
				G_posterURL = document.querySelector('meta[property="og:image"]').content;
				G_sampleURL = G_contentURL;
				G_stickTo = document.querySelector('#wrapper > div.container > div:nth-child(2) > div.col-md-8 > div:nth-child(1)');
				G_stickPosition = 'after';
				embedCode(funcToRun);
				G_sampleVideo.addEventListener('loadedmetadata', function (e) {
					G_videoWidth = this.videoWidth; G_videoHeight = this.videoHeight;
					// if (G_videoWidth && G_videoHeight) G_contentTitle = G_contentTitle + ' [' + G_videoWidth + 'x' + G_videoHeight + ']';
					embedCode(funcToRun);
					G_videoWidth = null; G_videoHeight = null;
				}, false );
			};
			waitForElement('video > source', 'src', funcToRun, delay, tries, timerGroup);
		}
	}

	else if (
		pageURL.matchLink('https?://openload.co/embed/*') || // https://openload.co/embed/GwWaJKr7q-g/
		pageURL.matchLink('https?://oload.tv/embed/*') || // https://oload.tv/embed/9RPKFjnnBCw/33628.mp4
		pageURL.matchLink('https?://oload.info/embed/*') // https://oload.info/embed/GkrmWmRxsGM/
	) {
		funcToTest = function() {
			var ready, url = document.querySelector('#streamurl');
			if (url && url.innerText.trim() !== '' && !url.innerText.toLowerCase().match("HERE IS THE LINK".toLowerCase())) ready = true;
			return ready;
		};
		funcToRun = function() {
			var contentURL = location.protocol + '//' + location.host + '/stream/' + document.querySelector('#streamurl').innerText + '?mime=true';
			// var posterURL = document.querySelector('#olvideo_html5_api').poster;
			console.log('contentURL: ', contentURL);
			openURL(refineVideo(contentURL));
		};
		waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		// document.addEventListener('DOMContentLoaded', funcToRun, false);
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
				openURL(refineVideo(contentURL));
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		}
		else if (
			pageURL.matchLink('https?://yourporn.sexy/post/*') // https://yourporn.sexy/post/56be2e8359051.html?sk=Carolina%20Abril&so=30
		) {
			funcToRun = function() {
				G_contentTitle = document.title;
				G_contentURL = shortURL + '#onlyVideo';
				G_posterURL = getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
				G_stickTo = document.querySelector('div.comments_area');
				G_stickPosition = 'before';
				embedCode(funcToRun);
				getVideoData(funcResult, function(){embedCode(funcToRun);});
			};
			waitForElement('video > source[src], video[src]', 'src', funcToRun, delay, tries, timerGroup);
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
				openURL(refineVideo(contentURL));
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		} else {
			funcToRun = function() {
				G_contentTitle = document.title;
				G_contentURL = shortURL + '#onlyVideo';
				G_posterURL = getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
				G_stickTo = document.querySelector('div.video-info');
				G_stickPosition = 'before';
				embedCode(funcToRun);
				G_sampleURL = (
					flashvars.video_alt_url3 ? flashvars.video_alt_url3 :
					flashvars.video_alt_url2 ? flashvars.video_alt_url2 :
					flashvars.video_alt_url ? flashvars.video_alt_url :
					flashvars.video_url
				);
			};
			waitForElement('meta[property="og:image"]', 'content', funcToRun, delay, tries, timerGroup);
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

	/*else if (
		pageURL.matchLink('https?://*.googlevideo.com/videoplayback[?]id=*') // https://r15---sn-3c27sn7z.googlevideo.com/videoplayback?id=bb50038a8daac978&itag=18&source=picasa&begin=0&requiressl=yes&mm=30&mn=sn-3c27sn7z&ms=nxu&mv=m&nh=IgpwcjAxLmticDAzKgkxMjcuMC4wLjE&pl=20&sc=yes&ei=j7HqWfLcHMTmdMD0h-gH&mime=video/mp4&lmt=1500365434742379&mt=1508553023&ip=37.25.114.58&ipbits=8&expire=1508560303&sparams=ip,ipbits,expire,id,itag,source,requiressl,mm,mn,ms,mv,nh,pl,sc,ei,mime,lmt&signature=344E8ACF80459A98F266D36CC83E44627C4711FB.AB9D367927C84B4328D8BE17466EA5D30ACD4B3B&key=ck2&c=WEB&cver=html5
	) {
		var contentURL = pageURL;
		console.log('contentURL: ', contentURL);
		openURL(refineVideo(contentURL));
	}*/

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
					openURL(refineVideo(contentURL));
				}
			});
		};
		document.addEventListener('DOMContentLoaded', handleElements, false);
	}

	else if (
		pageURL.matchLink('https?://yespornplease.com/*') // https://yourporn.sexy/post/56be2e8359051.html?sk=Carolina%20Abril&so=30
	) {
		if (
			pageURL.matchLink('https?://yespornplease.com/view/*') //http://yespornplease.com/view/392920164
		){
			funcToRun = function() {
				G_contentTitle = document.title;
				G_contentURL = document.querySelector('#video_embed_code').value.match(/.*src="(.*?)".*/i)[1];
				G_contentURL = G_contentURL.replace(/\/width-\d+\/height-\d+\//i, '/width-882/height-496/');
				G_posterURL = (
					document.querySelector('meta[name="thumbnail"]') ?
					document.querySelector('meta[name="thumbnail"]').content :
					document.querySelector('meta[property="og:image"]').content
				);
				G_stickTo = document.querySelector('.video-tags');
				G_stickPosition = 'before';
				embedCode(funcToRun);
			};
			waitForElement('#video_embed_code', null, funcToRun, delay, tries, timerGroup);
		}
	}
	else if (
		pageURL.matchLink('https?://e.yespornplease.com/e/*') // http://yespornplease.com/e/984079251/width-882/height-496/autoplay-0/
	) {
		document.querySelectorAll('iframe').forEach(function(iframe, index){iframe.src = iframe.src.replace(/^https?:\/\//i, '//');});
		var getIframeContent = setInterval(function() {
			var contentURL = GM_getValue('contentURL', null);
			if (contentURL) {
				// GM_deleteValue('contentURL');
				openURL(refineVideo(contentURL));
			}
		}, 10);
	}

	else if (
		pageURL.matchLink('https?://vshare.io/v/*') // http://vshare.io/v/e16edd7/width-867/height-491/1 || // http://yespornplease.com/e/984079251/width-882/height-496/autoplay-0/
	) {
		funcToTest = function() {
			return document.querySelector('body video > source[src]') || document.querySelector('body video[src]');
		};
		funcToRun = function() {
			var contentURL = document.querySelector('body video[src]').src;
			var quality = 0;
			document.querySelectorAll('body video > source[src]').forEach(function(source) {
				var res = source.res || source.label;
				if (res) {
					var value = Number(res.match(/\d+/));
					if (value > quality) {quality = value; contentURL = source.src;}
				}
			});
			GM_setValue('contentURL', contentURL);
			console.log('quality: ', quality);
			console.log('contentURL: ', contentURL);
			openURL(refineVideo(contentURL));
		};
		waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
	}

	else if (
		pageURL.matchLink('https?://www.pornhub.com/*')
	) {
		var actualSource = () => {
			var contentURL;
			var flashvars;
			for (let script of document.scripts) {
				var text = script.text;
				var match = text.match(/var flashvars_(.*?) = */i);
				if (match) {
					var id = match[1];
					if (id) flashvars = getWindowVar('flashvars_' + id);
					if (flashvars) break;
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
					return(contentURL); // openURL(refineVideo(contentURL));
				}
			}
		};

		if (
			pageURL.match('#onlyVideo') || // https://www.pornhub.com/view_video.php?viewkey=ph5743d8915deb4#onlyVideo
			pageURL.matchLink('https?://www.pornhub.com/embed/*') // https://www.pornhub.com/embed/ph5743d8915deb4
		) {
			funcToRun = function() {
				var contentURL = actualSource();
				if (contentURL) openURL(refineVideo(contentURL));
			};
			document.addEventListener('DOMContentLoaded', funcToRun, false);
		}
		else if (
			pageURL.matchLink('https?://www.pornhub.com/view_video.php[?]viewkey=*') // https://www.pornhub.com/view_video.php?viewkey=899243017
		) {
			funcToRun = function() {
				G_sampleURL = actualSource();
				if (G_sampleURL) GM_deleteValue('G_sampleURL');
				G_contentTitle = document.title;
				G_contentURL = document.querySelector('meta[name="twitter:player"]').content; //pageURL + '#onlyVideo';
				G_posterURL = document.querySelector('meta[name="twitter:image"]').content;
				G_stickTo = document.querySelector('.video-actions-container');
				G_stickPosition = 'before';
				embedCode(funcToRun);
			};
			waitForElement('meta[name="twitter:player"]', 'content', funcToRun, delay, tries, timerGroup);
		}
	}

	else if (
		pageURL.matchLink('https?://www.porntube.com/*')
	) {
		if (
			pageURL.matchLink('https?://www.porntube.com/videos/*') // https://www.porntube.com/videos/lusty-ellen-saint-loves-rear-pocket-lots-rock-hard-cock_1169422
		) {
			funcToRun = function() {
				G_contentTitle = document.title;
				G_contentURL = document.querySelector('meta[itemprop="embedUrl"]').content;
				G_posterURL = document.querySelector('span[itemprop="thumbnail"] > link[itemprop="url"]').href;
				G_stickTo = document.querySelector('div.cpp');
				G_stickPosition = 'before';
				embedCode(funcToRun);
			};
			waitForElement('meta[itemprop="embedUrl"]', null, funcToRun, delay, tries, timerGroup);
		}

		else if (
			pageURL.matchLink('https?://www.porntube.com/embed/*') // https://www.porntube.com/embed/1169422
		) {
			// TEST_MODE = true;
			// getVideoSources();
			funcToTest = function() {
				return document.querySelector('body video > source[src]') || document.querySelector('body video[src]');
			};
			funcToRun = function() {
				var contentURL = document.querySelector('body video[src]').src;
				var quality = 0;
				document.querySelectorAll('body video > source[src]').forEach(function(source) {
					var res = source.dataset.res;
					if (res) {
						var value = Number(res.match(/\d+/));
						if (value > quality) {quality = value; contentURL = source.src;}
					}
				});
				GM_setValue('contentURL', contentURL);
				console.log('quality: ', quality);
				console.log('contentURL: ', contentURL);
				openURL(refineVideo(contentURL));
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		}
	}

	else if (
		pageURL.matchLink('https?://www.tube8.com/*')
	) {
		if (
			pageURL.matchLink('https?://www.tube8.com/embed/*') // https://www.tube8.com/embed/amateur/miriam-and-george/624201/
		) {
			// TEST_MODE = true;
			funcToTest = function() {
				return flashvars.video_alt_url || flashvars.video_url;
			};
			funcToRun = function() {
				var contentURL = (flashvars.video_alt_url || flashvars.video_url).match(/(https?:.*)/)[1];
				var posterURL = flashvars.preview_url;
				var testQualities = () => { // https://www.tube8.com/embed/hardcore/busty-honey-is-down-for-some-anal/36207721/
					var qualitiesTable = [1080, 720, 480, 360, 240], maxQuality = 0;
					for (let quality of qualitiesTable) {maxQuality = quality > maxQuality && flashvars['quality_' + quality + 'p'] ? quality : maxQuality;}
					if (maxQuality > 0) {
						console.log('quality: ' + maxQuality);
						contentURL = flashvars['quality_' + maxQuality + 'p'];
					}
				};
				testQualities();
				console.log('contentURL: ', contentURL);
				openURL(refineVideo(contentURL));
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		}

		else if (
			pageURL.matchLink('https?://www.tube8.com/*/*/*/') // https://www.tube8.com/amateur/miriam-and-george/624201/
		) {
			funcToTest = function() {
				return flashvars.image_url && page_params.embedCode;
			};
			funcToRun = function() {
				G_contentTitle = document.title;
				G_contentURL = page_params.embedCode.match(/.*src="(.*?)".*/i)[1];
				G_posterURL = flashvars.image_url;
				G_stickTo = document.querySelector('div.underplayer_wrap');
				G_stickPosition = 'before';
				embedCode(funcToRun);
			};
			waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
		}
	}

	// ====================================================================================================================
	// ====================================================================================================================

	else if (
		pageURL.matchLink('https?://pron.tv/*')
	) {
		G_noVideoSource = true;
		refineText(document.querySelectorAll('#q'));
		document.querySelectorAll('.search-result-thumbnail, .lazy-load').forEach(function(link, index) {
			var image = link.src ? link : link.querySelector('img');
			var imageSrc = image.src;
			if (!imageSrc || imageSrc.match('/img/blank.gif') || imageSrc === '') {
				var noscript = link.querySelector('noscript');
				if (noscript) {
					imageSrc = noscript.innerText.match(/.*src="(.*?)".*/i)[1];
				} else if (image.dataset.src) {
					imageSrc = image.dataset.src;
				}
				if (imageSrc) image.src = imageSrc;
			}
		});
		/*
		waitForElement('#pronwidgetcol32', null, function(){
			document.querySelectorAll('div > a[href="#"] > img').forEach(thumbs, function(thumb, index) {
				var link = thumb.parentNode;
				if (link) {
					var query = thumb.title || thumb.alt;
					query = 'http://pron.tv/stream/search?q='+query+'&RandomHD=Random%20HD!';
					link.href = query;
					link.setAttribute('target', '_blank');
				}
			});
		}, delay, tries, false);
		*/
		if (
			pageURL.matchLink('https?://pron.tv/l/*/*')
		) {
			G_noVideoSource = false;
			addGlobalStyle('#player-and-details {height: 480px;}');
			funcToRun = function() {
				var iframes =  document.querySelectorAll('#actualPlayer iframe');
				G_contentURL = iframes ? iframes[0].src : 'null';
				if (G_contentURL.matchLink('https://docs.google.com/file/d/*/preview?*')) {
					G_contentURL = G_contentURL + '&hd=1';
				}
				else if (G_contentURL.matchLink('https?://yespornplease.com/view/*')) {
					// http://yespornplease.com/view/741577353?utm=pron
					// http://e.yespornplease.com/e/741577353/width-650/height-400/autoplay-1
					G_contentURL = G_contentURL.replace(/.*\/view\/(.*?)[?].*/i, 'http://e.yespornplease.com/e/$1/width-650/height-400/autoplay-0');
					G_contentURL = G_contentURL.replace(/\/width-\d+\/height-\d+\//i, '/width-882/height-496/');
				}
				else if (G_contentURL.matchLink('https?://www.porntrex.com/video/*')) {
					G_contentURL = G_contentURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'https://www.porntrex.com/embed/$1');
				}
				var poster = document.querySelector('.blockx img.imgshadow');
				G_posterURL = poster ? poster.src : '';
				G_stickTo = document.querySelector('#linkdetails-similars');
				var title = document.querySelector('h1[title]');
				for (const a of document.querySelectorAll("span > b")) {
					if (a.textContent.includes("Source-Title")) {
						G_contentTitle = a.parentNode.nextElementSibling.textContent.replace(/\n/g,'').toTitleCase();
						if (title) title.innerText = G_contentTitle;
					}
				}
				G_stickPosition = 'before';
				embedCode(funcToRun);
				addKeyComboCtrlC(true);
			};
			waitForElement('#actualPlayer iframe', 'src', funcToRun, delay, tries, timerGroup);
			var source = document.querySelector('#player-and-details-2 > div.blockx > div.a > center > b:nth-of-type(2)');
			if (source) {
				var sourceURL = source.innerText;
				source.outerHTML = '<a href="//' +sourceURL + '">' + sourceURL + '</a>';
			}
		}
	}

	else if (
		pageURL.matchLink('https?://fuckingsession.com/*/') // http://fuckingsession.com/hardx-maya-bijou-creampie-first-time/
	) {
		var delayedRun = function(){setTimeout(funcToRun, 250);};
		funcToRun = function() {
			G_contentTitle = document.title;
			G_contentURL = document.querySelector('iframe[src], #mediaplayer_media > video').src;
			//
			var visibleElement = getVisibleElement(document.querySelectorAll('iframe[src], #mediaplayer_media > video'));
			if (visibleElement && !visibleElement.src && document.querySelectorAll('.jwdisplayIcon, #vplayer_display_button')) {
				document.querySelectorAll('.jwdisplayIcon, #vplayer_display_button').forEach(function(item, index, array){return item.click();});
			}
			G_contentURL = visibleElement ? visibleElement.src : G_contentURL;
			//
			if (G_contentURL.matchLink('https?://*.googleusercontent.com/*')) G_sampleURL = G_contentURL;
			else if (sources[cutURL(G_contentURL)]) G_sampleURL = sources[cutURL(G_contentURL)];
			//
			G_posterURL = (document.querySelector('meta[name="thumbnail"]') ? document.querySelector('meta[name="thumbnail"]').content : document.querySelector('meta[property="og:image"]').content);
			G_stickTo = document.querySelector('#extras');
			G_stickPosition = 'before';
			document.querySelectorAll('.GTTabsLinks').forEach(function(item, index, array){if (item) item.addEventListener('click', delayedRun, false);}); // source buttons
			embedCode(funcToRun);
		};
		waitForElement('iframe[src], #mediaplayer_media > video', null, delayedRun, delay, tries, timerGroup);
	}

	// ====================================================================================================================
	// ====================================================================================================================

	else if (
		pageURL.split("?")[0].split("#")[0].endsWith("mp4") // https://b02.xfreehd.com/media/videos/hd/11960.mp4
	) {
		var contentURL = pageURL;
		console.log('contentURL: ', contentURL);
		openURL(refineVideo(contentURL));
	}

	else if (typeof flashvars !== "undefined" && flashvars.video_url) { // http://www.camwhores.tv/embed/127910?utm_source=prontv&utm_campaign=prontv&utm_medium=prontv
		funcToTest = function() {
			return flashvars.video_alt_url || flashvars.video_url;
		};
		funcToRun = function() {
			var contentURL = (flashvars.video_alt_url || flashvars.video_url).match(/(https?:.*)/)[1];
			var posterURL = flashvars.preview_url;
			var testQualities = () => { // https://www.tube8.com/embed/hardcore/busty-honey-is-down-for-some-anal/36207721/
				var qualitiesTable = [1080, 720, 480, 360, 240], maxQuality = 0;
				for (let quality of qualitiesTable) {maxQuality = quality > maxQuality && flashvars['quality_' + quality + 'p'] ? quality : maxQuality;}
				if (maxQuality > 0) {
					console.log('quality: ' + maxQuality);
					contentURL = flashvars['quality_' + maxQuality + 'p'];
				}
			};
			testQualities();
			console.log('contentURL: ', contentURL);
			openURL(refineVideo(contentURL));
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
				openURL(refineVideo(contentURL));
			});
		};
		waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
	}

	// ====================================================================================================================
	if (!G_noVideoSource) getVideoSources();
	// ====================================================================================================================

	URL_MATCHED = URL_MATCHED ? URL_MATCHED : 'URL_MATCHED: false';
	console.log(URL_MATCHED);
})();
