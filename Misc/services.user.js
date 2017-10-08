// ==UserScript==
// @name         services
// @icon         https://www.google.com/s2/favicons?domain=pornhub.com
// @version      1.3.7
// @description  Pure JavaScript version.
// @author       Ægir
// @namespace    Misc_Scripts
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/services.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        http://porndoe.com/video/*
// @match        https://porndoe.com/video/*
// @exclude      http://porndoe.com/video/embed/*
// @match        https://www.porntrex.com/video/*/*
// @match        http://sexix.net/video*
// @match        http://i.sexix.net/video*
// @match        http://sexix.net/*
// @match        http://sexiz.net/*
// @match        http://hdpoz.com/HD*
// @match        http://i.hdpoz.com/HD*
// @match        http://hdpoz.com/*
// @match        http://spankbang.com/*/video/*
// @match        http://www.babesandstars.com/*/*/*/
// @match        http://www.xvideos.com/video*
// @match        http://www.pornhub.com/*
// @match        https://www.pornhub.com/*
// @exclude      https://www.pornhub.com/embed/*
// @match        https://www.eporner.com/*
// @exclude      https://www.eporner.com/embed/*
// @match        https://www.tube8.com/*/*/*/*
// @match        http://juicygif.com/public/Gif/*.html/*
// @match        http://www.sex.com/picture/*/
// @match        http://www.pichunter.com/gallery/*/*
// @match        http://www.imagefap.com/pictures/*/*view=2
// @match        http://www.hdporncollections.com/*/
// @match        http://konachan.com/post*
// @match        http://pron.tv/*
// @match        http://www.xmoviesforyou.com/*/*/*.html
// @match        https://danbooru.donmai.us/posts*

/// @match        https://biqle.ru/watch/*
/// @match        https://biqle.ru/*

// @match        https://www.bitporno.sx/?v=*
// @match        https://www.bitporno.com/?v=*

// @match        https://vipergirls.to/threads/*/page*

// @match        http://www.porn.com/videos/*
// @exclude      http://www.porn.com/videos/embed/*

// @match        http://hd.xtapes.to/*

// @match        http://www.nudeflix.com/dvd/*/*

// @match        https://xhamster.com/*

// @match        http://18onlygirls.ru/*

// @match        http://yespornplease.com/*
// @match        https://yespornplease.com/*

// @match        http://xxvideoss.org/*
// @match        http://porntube4k.net/*

// @match        http://www.gameofporn.net/video/*
// @match        https://www.playvids.com/v/*

// @match        http://streamxxx.tv/*
// @match        http://www.schoolgirlfuck.net/*

// @match        https://yourporn.sexy/post/*

// @match        https://allerotika.net/clip/*

// @match        https://www.porndig.com/videos/*/*

// @match        http://pantporn.com/*

// @match        http://www.camshooker.com/videos/*

// @match        https://xfreehd.com/video/*/*

// @match        http://fuckingsession.com/*
// ==/UserScript==

(function() {
	'use strict';

	/* JS.AddEmbedCodeFrame.Lib.user.js GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  var createLink = true, createPoster = true, contentURL, posterURL, appendToFrame, appendPosition;
  var embedCodeFrame_Margin, embedCodeLink_Margin, embedCodeFrame_BackgroundColor;
  var contentTitle;
  var embedCodeText;
  var posters = [];
  var qualityButtons = [];
  var textAreaAutoHeight = false, textAreaFixedHeight = false;
  var embedCodeTextRefresh = true;
  */
	var shortURL = location.protocol + '//' + location.host + location.pathname;

	// THIS FILE GLOBAL VARIABLES
	// ====================================================================================================================
	var mainFunction;
	var iframeElement, parentDocument;
	var menuElements, hdOptions, hdButtonData, hdButton, checkPressed;
	var setParentDocument, setAutoHD;
	setParentDocument = function(iframeSelector) {
		iframeElement = document.querySelector(iframeSelector);
		parentDocument = iframeElement ? (iframeElement.contentDocument || iframeElement.contentWindow.document) : document.documentElement;
	};
	var initFunction = function(){mainFunction();};
	var delay = 1000,
		tries = 15;
	var mainFunctionTG = [];

	var addHDtext = function(selector) {
		selector = selector || 'a';
		var linksArray = document.querySelectorAll(selector);
		for (var i = 0; i < linksArray.length; ++i) {
			var link = linksArray[i], thumb = link.parentNode, title = link.title;
			var quality = title ? title.match('(1080)p') || title.match('(720)p') : null;
			if (quality) {
				quality = quality[1];
				var text = document.createElement('div');
				if (quality == '1080') text.style.background = 'rgba(255, 0, 0, 0.15)';
				else if (quality == '720') text.style.background = 'rgba(0, 45, 255, 0.25)';
				text.style.zIndex = '10000';
				text.style.position = 'inherit';
				text.style.width = 'auto';
				text.style.height = '20px';
				text.style.float = 'right';
				text.style.color = 'rgba(0, 253, 255, 0)';
				text.style.padding = '0px 2px';
				text.style.border = '1px solid rgba(255,255,255,0.2)';
				text.innerText = quality+'p';
				thumb.appendChild(text);
				// thumb.appendChild(document.createTextNode("HD"));
			}
		}
	};
	addHDtext = function(selector, color) {
		selector = selector || 'a';
		var linksArray = document.querySelectorAll(selector);
		for (var i = 0; i < linksArray.length; ++i) {
			var link = linksArray[i], thumb = link.parentNode, title = link.title || link.innerText;
			var quality = title ? title.match('(1080)p?') || title.match('(720)p?') : null;
			if (quality) {
				quality = quality[1];
				var text = document.createElement('div');
				if (quality == '1080') text.style.background = 'rgba(255, 0, 0, 0.15)';
				else if (quality == '720') text.style.background = 'rgba(0, 45, 255, 0.25)';
				text.style.zIndex = 2147483647; // '10000';
				text.style.position = 'absolute'; // 'inherit'
				text.style.width = 'auto';
				text.style.height = '20px';
				text.style.float = 'right';
				if (color) text.style.color = color; // 'rgba(0, 253, 255, 0)';
				text.style.padding = '0px 2px';
				text.style.border = '1px solid rgba(255,255,255,0.2)';
				text.innerText = quality+'p';
				// thumb.appendChild(text);
				thumb.insertBefore(text, thumb.firstChild);
				// thumb.appendChild(document.createTextNode("HD"));
				text.style.right = '0';
			}
		}
	};

	var fixSearch = function(searchFields) {
		// console.log('searchFields = '+searchFields);
		var eventList = ['keydown', 'keyup', 'change'];
		var inputList = searchFields; // [searchField];
		inputList.forEach(function(input){
			// console.log('input = '+input);
			eventList.forEach(function(event){
				input.addEventListener(event,function(e){
					e = e || window.event;
					if (e.type == 'change') {
						var query = input.value;
						query = query.replace(/[-_\.\+]+/g, ' ').replace(/^\s+|\s+$/g, '');
						input.value = query.toTitleCase(true);
						// console.log('input.value = '+input.value);
					}
				},false);
			});
		});
	};

	var videoSourceSelector = 'video > source[type="video/mp4"], video, iframe';
	var MONTH = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

	function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}

	var getAbsoluteUrl = (function(){var a; return function(url){if(!a) a = document.createElement('a'); a.href = url; return a.href; };})();

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
	// ====================================================================================================================

	// if (
	// 	pageURL.matchLink('https?://porndoe.com/video/*')
	// ) {
	// 	mainFunction = function() {
	// 		contentURL = document.querySelector('link[itemprop="embedURL"]').href.replace(/(.*?)\?.*/,'$1');
	// 		contentURL = document.querySelector('video.jw-video').src.replace(/(.*?)\?.*/,'$1');
	// 		posterURL = document.querySelector('link[itemprop="thumbnailUrl"]').getAttribute('content'); //document.querySelector('meta[property="og:image"]').content;
	// 		appendToFrame = document.querySelector('div.video');
	// 		appendPosition = 'after';
	// 		qualityButtons = [document.querySelector('.jw-icon-hd')];
	// 		addEmbedCodeFrame(mainFunction);
	// 		addKeyComboCtrlC(true);
	// 	};
	// 	waitForElement('video.jw-video', 'src', initFunction, delay, tries, false);
	// 	// waitForElement('link[itemprop="thumbnailUrl"]', 'content', initFunction, delay, tries, false);
	// }

	if (
		pageURL.matchLink('https?://porndoe.com/*')
	) {
		if (
			pageURL.matchLink('https?://porndoe.com/video/*')
		) {
			mainFunction = function() {
				contentURL = document.querySelector('#ink').value.trim(); //.match(/.*src="(.*?)".*/i)[1];
				// contentURL = document.querySelector('video').src; //.match(/.*src="(.*?)".*/i)[1];
				posterURL = (
					document.querySelector('a[href="'+pageURL+'"] > img') ?
					document.querySelector('a[href="'+pageURL+'"] > img').src :

					document.querySelector('meta[name="thumbnail"]') ?
					document.querySelector('meta[name="thumbnail"]').content :

					document.querySelector('meta[property="og:image"]') ?
					document.querySelector('meta[property="og:image"]').content :

					document.querySelector('meta[name="og:image"]').content ?
					document.querySelector('meta[name="og:image"]').content :
					null
				);
				appendToFrame = document.querySelector('.videoplayer-section');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('video', 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://www.porntrex.com/*')
	) {
		if (
			pageURL.matchLink('https?://www.porntrex.com/video/*/*') // https://www.porntrex.com/video/162636/kiera-winters-sex-queen-and-her-prince
		) {
			if (!pageURL.match('#onlyVideo')) { // https://www.porntrex.com/video/162636/kiera-winters-sex-queen-and-her-prince#onlyVideo
				mainFunction = function() {
					posterURL = document.querySelector('meta[property="og:image"]').content;
					// pageURL = getAbsoluteUrl(document.querySelector('meta[property="og:url"]').getAttribute('content', 2));
					// contentURL = pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'https://www.porntrex.com/embed/$1');
					contentURL = shortURL+'#onlyVideo'; // document.querySelector(videoSourceSelector).src;
					appendToFrame = document.querySelector('.info-holder');
					appendPosition = 'before';
					addEmbedCodeFrame(mainFunction);
					addKeyComboCtrlC(true);
				};
				waitForElement('meta[property="og:image"]', 'content', initFunction, delay, null, false);
			}
		}
	}

	else if (
		pageURL.matchLink('https?://sexix.net/*') || pageURL.matchLink('https?://i.sexix.net/*') ||
		pageURL.matchLink('https?://hdpoz.com/*') || pageURL.matchLink('https?://i.hdpoz.com/*')
	) {
		addGlobalStyle('.clip > img {position: relative; width: 140px; z-index: 10000;}');

		addPageControlKeys('a.previouspostslink', 'a.nextpostslink');
		addOpenInNewTabProperty('.clip-link, .entry-title > a');
		addHDtext('.clip-link', 'rgba(0, 253, 255, 0)');

		var iframeE = document.querySelector('.videoContainer > iframe');
		var iframeS = iframeE ? iframeE.src : null;
		if (iframeE && iframeS) iframeE.src = iframeS.replace(/http:\/\/.*sexix.net\/v\.php/i, 'http://'+pageHost+'/v.php');

		setAutoHD = function() {
			menuElements = parentDocument.querySelectorAll('#player_controlbar_hd > .jwoption');
			hdOptions = ['1080p', '720p'];
			hdButtonData = getHDButton(menuElements, hdOptions);
			hdButton = hdButtonData ? hdButtonData[0] : null;
			if (hdButton) {
				checkPressed = function(){
					var ok = hdButton.classList.contains('active');
					if (ok) {msgbox('Auto HD', 'HD option: '+hdButton.innerHTML+'\n'+pageHost, 3000, 250, 120);}
					return ok;
				};
				pressHDButton(hdButton, checkPressed, 500, 30);
			}
		};

		mainFunctionTG = [];
		mainFunction = function() {
			contentURL = parentDocument.querySelector('video').src;
			posterURL = document.querySelector('meta[property="og:image"]').content;
			appendToFrame = document.querySelector('#video');
			appendPosition = 'after';
			qualityButtons = [parentDocument.querySelector('.jwhd')];
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
			mainFunctionTG = null;

			var video = parentDocument.querySelector('video');
			video.addEventListener( "loadedmetadata", function (e) {
				var width = this.videoWidth, height = this.videoHeight;
				console.log('video: '+video.src+' ['+width+'x'+height+']');
				msgbox('Video', 'Size: '+(width+' x '+height)+'\n'+pageHost, 3000, 250, 120);
			}, false );
		};

		if (
			pageURL.matchLink('sexix.net/video') ||
			pageURL.matchLink('hdpoz.com/HD')
		) {
			initFunction = function(){setParentDocument('.videoContainer > iframe'); setAutoHD(); mainFunction();};
			waitForElement('#player_controlbar_hd > .active, #player_controlbar_hd', false, initFunction, delay, tries, false, mainFunctionTG);
			waitForElement('#player_controlbar_hd > .active, #player_controlbar_hd', false, initFunction, delay, tries, '.videoContainer > iframe', mainFunctionTG);
		}
		var searchFields = document.querySelectorAll('input.search-text');
		fixSearch(searchFields);
	}

	else if (
		pageURL.matchLink('http://sexiz.net/*')
	) {
		addGlobalStyle('.clip > img {position: relative; width: 140px; z-index: 10000;}');

		addPageControlKeys('a.previouspostslink', 'a.nextpostslink');
		addOpenInNewTabProperty('.clip-link, .entry-title > a');
		addHDtext('.clip-link', 'rgba(0, 253, 255, 0)');

		mainFunctionTG = [];
		mainFunction = function() {
			contentURL = document.querySelectorAttribute('video, video > source', 'src');
			posterURL = ''; //document.querySelector('meta[property="og:image"]').content;
			appendToFrame = document.querySelector('#video');
			appendPosition = 'after';
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
			mainFunctionTG = null;
		};

		if (
			pageURL.matchLink('sexiz.net/*/')
		) {
			waitForElement('video, video > source', 'src', initFunction, delay, tries, false, mainFunctionTG);
		}
	}

	else if (
		pageURL.matchLink('http://spankbang.com/*/video/*')
	) {
		mainFunction = function() {
			contentURL = document.querySelector('#video_player_html5_api').src;
			posterURL = document.querySelector('#video > div.left > section.timeline > figure > img:nth-child(6)').src;
			appendToFrame = document.querySelector('.toolbar');
			appendPosition = 'after';
			embedCodeFrame_Margin = '0.2% 0px';
			qualityButtons = asArray(document.querySelectorAll('#video > div.left > nav > ul.right_set > li.q_super'));
			qualityButtons = qualityButtons.concat(asArray(document.querySelectorAll('.vjs-resolution-button > div > ul > li.vjs-menu-item')));
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		waitForElement('meta[property="og:image"]', 'content', initFunction, delay, tries, false);
	}

	else if (
		pageURL.matchLink('http://www.babesandstars.com/*/*/*/')
	) {
		embedCodeTextRefresh = false;
		mainFunction = function() {
			var gallery, images = [];
			gallery = document.querySelector('.my_gallery');
			images = gallery.querySelectorAll('figure > a > img');
			forEach(images, function(index, self) {
				contentURL = self.parentNode.href;
				posterURL = self.src;
				contentTitle = ''; //pageTitle.replace(/^.{1} /i, '').Capitalize();
				if (embedCodeText) {embedCodeText = embedCodeText + '\n' + '<div class="thumbnail"';} else {embedCodeText = '<div class="thumbnail"';}
				if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
				if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
				embedCodeText += ' content="'+contentURL+'"';
				if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
				embedCodeText += '></div>';
			});
			appendToFrame = gallery;
			appendPosition = 'after';
			textAreaAutoHeight = true;
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		waitForElement('.my_gallery', false, initFunction, delay, tries, false);
	}

	else if (
		pageURL.matchLink('http://www.xvideos.com/video*')
	) {
		var forceHLS = true;
		setAutoHD = function() {
			menuElements = document.querySelectorAll('.parameter_element_txt');
			hdOptions = ['1080p', '720p'];
			hdButtonData = getHDButton(menuElements, hdOptions);
			hdButton = hdButtonData ? hdButtonData[0] : null;
			// checkPressed = function(){return hdButton.parentNode.classList.contains('active');};
			checkPressed = function(){
				var ok = hdButton.parentNode.classList.contains('parameterelmt_forced');
				if (ok) {msgbox('Auto HD', 'HD option: '+hdButton.innerHTML+'\n'+pageHost, 3000, 250, 120);}
				return ok;
			};
			pressHDButton(hdButton, checkPressed, 500, 30);
		};
		mainFunction = function() {
			forEach(document.scripts, function(index, self) {
				var text = self.text;
				if (hdButton || forceHLS) contentURL = text.match('html5player.setVideoHLS') ? text.match(/html5player\.setVideoHLS\('(.*?)'\)/i)[1] : contentURL; // HD
				else contentURL = text.match('html5player.setVideoUrlHigh') ? text.match(/html5player\.setVideoUrlHigh\('(.*?)'\)/i)[1] : contentURL; // HQ
			});
			contentURL = contentURL || document.querySelector('#tabEmbed > input').value.replace(/.*src="(.*?)".*/i, '$1');
			posterURL = document.querySelector('meta[property="og:image"]').content;
			appendToFrame = document.querySelector('#video-player-bg');
			appendPosition = 'after';
			embedCodeFrame_BackgroundColor = document.body.getComputedProperty('background-color');
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		initFunction = function(){setAutoHD(); mainFunction();};
		waitForElement('.parameterelmt_forced', false, initFunction, delay, tries, false);
	}

	else if (
		pageURL.matchLink('http[s]?://www.pornhub.com/*')
	) {
		// addOpenInNewTabProperty('.phimage a');
		addPageControlKeys('.page_previous.alpha > a', '.page_next.omega > a');
		if (pageURL.matchLink('http[s]?://www.pornhub.com/view_video.php[?]viewkey=*')) {
			mainFunction = function() {
				contentURL = document.querySelector('meta[name="twitter:player"]').content;
				var link = document.querySelector('link[rel="canonical"]');
				pageURL = link ? link.href : pageURL;
				// if (typeof player_quality_1080p !== 'undefined') contentURL += '/HD_1080p';
				// else if (typeof player_quality_720p !== 'undefined') contentURL += '/HD_720p';
				posterURL = document.querySelector('meta[name="twitter:image"]').content;
				appendToFrame = document.querySelector('.video-actions-container');
				appendPosition = 'before';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('meta[name="twitter:player"]', 'content', initFunction, delay, tries, false);
		}
	}

	else if (
		pageURL.matchLink('http[s]?://www.eporner.com/*')
	) {
		addPageControlKeys('.numlist2 > a[title="Previous page"]', '.numlist2 > a[title="Next page"]');
		if (
			pageURL.matchLink('http[s]?://www.eporner.com/hd-porn/*/*/')
		) {
			mainFunction = function() {
				var val = 0;
				document.querySelectorAll('.vjs-menu-item-text').forEach(function(e) {
					var size = e.innerText.match(/(\d+)p/);
					if (size) val = Math.max(val, size[1]);
				});
				contentTitle = document.title;
				var titleShort = document.querySelector('meta[property="og:title"]').content;
				if (val !== 0) contentTitle = contentTitle.replace(titleShort, titleShort + ' [' + val + 'p]');
				contentURL = document.querySelector('#EPvideo_html5_api').src;
				contentURL = document.querySelector('#embright > .textare1 > textarea').value.match(/.*src="(.*?)".*/i)[1];
				posterURL = document.querySelector('meta[property="og:image"]').content;
				appendToFrame = document.querySelector('#relateddiv');
				appendPosition = 'before';
				qualityButtons = [document.querySelector('.vjs-control-bar > .vjs-icon-hd > .vjs-menu > .vjs-menu-content')];
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			initFunction = function(){mainFunction(); useVolumeCookie('#EPvideo_html5_api', null);};
			waitForElement('#EPvideo_html5_api', 'src', initFunction, delay, tries, false);
		}
	}

	else if (
		pageURL.matchLink('http[s]?://www.tube8.com/*/*/*/*')
	) {
		mainFunction = function() {
			var data = flashvars; // tube8.com global
			contentURL = data.quality_1080p || data.quality_720p || data.quality_480p || data.quality_360p || data.quality_180p; // direct
			contentURL = page_params.embedCode ? page_params.embedCode.match(/.*src="(.*?)".*/i)[1] : contentURL; // embed
			posterURL = data.image_url;
			appendToFrame = document.querySelector('.underplayer_wrap');
			appendPosition = 'before';
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		waitForCondition(function(){return flashvars;}, initFunction, delay, tries, false);
	}

	else if (
		pageURL.matchLink('http://juicygif.com/public/Gif/*.html/*')
	) {
		mainFunction = function() {
			pageURL = pageURL.replace(/(.*html).*/i, '$1');
			contentURL = document.querySelector('img[itemprop="contentUrl"]').src;
			posterURL = contentURL;
			// posterURL = document.querySelector('div[itemprop="thumbnailUrl"]').innerText.replace('normal_', 'thumb_').trim();
			appendToFrame = document.querySelector('div.img');
			appendPosition = 'after';
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		waitForElement('img[itemprop="contentUrl"]', 'src', initFunction, delay, tries, false);
	}

	else if (
		pageURL.matchLink('http://www.sex.com/picture/*/')
	) {
		mainFunction = function() {
			contentURL = document.querySelector('.image_frame img').src;
			contentURL = contentURL.replace(/(.*?)\?.*/, '$1');
			posterURL = document.querySelector('meta[itemprop="thumbnail"]').content;
			appendToFrame = document.querySelector('.image_frame');
			appendPosition = 'after';
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
			mainFunctionTG = null;
		};
		waitForElement('.image_frame img', 'src', mainFunction, delay, tries, false, false);
	}

	else if (
		pageURL.matchLink('http://www.pichunter.com/gallery/*/*')
	) {
		embedCodeTextRefresh = false;
		mainFunction = function() {
			var gallery, images = [];
			gallery = document.querySelector('#gallery > .flex-images');
			images = gallery.querySelectorAll('img');
			pageURL = pageURL.replace(/(.*?)#.*/, '$1');
			forEach(images, function(index, self) {
				contentURL = self.parentNode.href;
				posterURL = self.src.replace('_o.jpg', '_i.jpg');
				contentTitle = ''; //pageTitle.replace(/^.{1} /i, '').Capitalize();
				if (embedCodeText) {embedCodeText = embedCodeText + '\n' + '<div class="thumbnail"';} else {embedCodeText = '<div class="thumbnail"';}
				if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
				if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
				embedCodeText += ' content="'+contentURL+'"';
				if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
				embedCodeText += '></div>';
			});
			appendToFrame = gallery;
			appendPosition = 'after';
			textAreaAutoHeight = true;
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		waitForElement('#gallery', false, initFunction, delay, tries, false);
	}

	else if (
		pageURL.matchLink('http://www.imagefap.com/pictures/*/*view=2') // http://www.imagefap.com/pictures/6115310/?gid=6115310&view=2
	) {
		embedCodeTextRefresh = false;
		mainFunction = function() {
			var imagesArray = [];
			var thumbsArray = [];

			var userID = document.querySelector('#menubar > table > tbody > tr:nth-child(2) > td:nth-child(1) > a').href;
			userID = userID.replace(/.*user=(.*)/i, '$1');

			var galleryID = document.querySelector('#galleryid_input').value;

			var imageNames = document.querySelectorAll('td > font > i');
			forEach(imageNames, function(index, self) {
				var image = self.innerText;
				imagesArray.push(image);
			});

			var imageIDs = document.querySelectorAll('#gallery > form > table > tbody > tr > td');
			forEach(imageIDs, function(index, self) {
				var imageID = self.id;
				var image = imagesArray[index];
				var imageURL = 'http://x.imagefapusercontent.com/u/' + userID + '/' + galleryID + '/' + imageID + '/' + image;
				imagesArray[index] = imageURL;
			});

			var thumbs = gallery.querySelectorAll('#gallery > form > table > tbody > tr > td > table > tbody > tr > td > a > img');
			forEach(thumbs, function(index, self) {
				var thumbURL = self.src;
				// thumbURL = thumbURL.replace(/.*\/thumb\/(.*)/i, ' http://x.fap.to/images/mini/$1');
				thumbURL = thumbURL.replace(/.*\/thumb\/(.*)/i, ' http://x.fap.to/thumb/$1');
				thumbsArray.push(thumbURL);
			});

			pageURL = pageURL.replace(/(.*?)\?.*/, '$1');

			forEach(thumbsArray, function(index, self) {
				contentURL = imagesArray[index];
				posterURL = self;
				contentTitle = ''; //pageTitle.replace(/^.{1} /i, '').Capitalize();
				if (embedCodeText) {embedCodeText = embedCodeText + '\n' + '<div class="thumbnail"';} else {embedCodeText = '<div class="thumbnail"';}
				if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
				if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
				embedCodeText += ' content="'+contentURL+'"';
				if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
				embedCodeText += '></div>';
			});

			appendToFrame = document.querySelector('#gallery');
			appendPosition = 'after';
			textAreaAutoHeight = true;
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		waitForElement('#gallery', false, initFunction, delay, tries, false);
	}

	else if (
		pageURL.matchLink('http://www.hdporncollections.com/*/')
	) {
		mainFunction = function() {
			document.querySelector('.jwdisplayIcon').click();
			contentURL = document.querySelector('.jwvideo > video').src;
			posterURL = document.querySelector('meta[property="og:image"]').content;
			appendToFrame = document.querySelector('#video');
			appendPosition = 'after';
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		waitForElement('.jwvideo > video', 'src', initFunction, delay, null, false);
	}

	else if (
		pageURL.matchLink('http://konachan.com/post?*')
	) {
		addPageControlKeys('a.previous_page', 'a.next_page');
		addOpenInNewTabProperty('a.thumb');
		if (pageURL.matchLink('http://konachan.com/post/show*')) {
			mainFunction = function() {
				addGlobalStyle('#image {max-width: 100%; max-height: 100%; width: auto; height: auto;}');
				var preview_url;
				forEach(document.querySelectorAll('#post-view > script'), function(index, self) {
					var text = self.text;
					preview_url = text.match('"preview_url":"(.*?)"')[1].replace(/\\\//g, '/');
				});
				contentURL = document.querySelector('#image').src;
				posterURL = preview_url;
				appendToFrame = document.querySelector('#image');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('#image', 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('http://pron.tv/*')
	) {
		var links = document.querySelectorAll('.search-result-thumbnail, .lazy-load');
		forEach(links, function(index, self) {
			var link = self;
			var image = self.src ? self : link.querySelector('img');
			var imageSrc = image.src;
			if (!imageSrc || imageSrc.match('/img/blank.gif') || imageSrc === '') {
				var noscript = link.querySelector('noscript');
				if (noscript) {
					imageSrc = noscript.innerText.match(/.*src="(.*?)".*/i)[1];
				} else if (image.dataset.src) {
					imageSrc = image.dataset.src;
				}
				if (imageSrc) image.src = imageSrc;
				// console.log(imageSrc);
			}
		});
		waitForElement('#pronwidgetcol32', false, function(){
			var thumbs = document.querySelectorAll('div > a[href="#"] > img');
			forEach(thumbs, function(index, self) {
				var link = self.parentNode;
				if (link) {
					var query=self.title || self.alt;
					query = 'http://pron.tv/stream/search?q='+query+'&RandomHD=Random%20HD!';
					link.href=query;
					link.setAttribute('target', '_blank');
				}
			});
		}, delay, null, false);
		var favoriteHoster = getCookie('favoriteHoster');
		favoriteHoster = false;
		if (!favoriteHoster || favoriteHoster === "") {
			var favoriteHosters = [], favoriteHosterDefaults = '';
			var prefix = '{"hosterel":"star', postfix = '"}', hosters = [
				'drive.google.com',
				'docs.google.com',
				'openload.co',
				'openload.io',
				'bitporno.com',
				'eporner.com',
				// 'sexix.net',
				'vidoza.net',
				'txxx.com',
			];
			forEach(hosters, function(index, self) {
				favoriteHosters[index] = prefix+self+postfix;
			});
			forEach(favoriteHosters, function(index, self) {
				favoriteHosterDefaults += self;
			});
			favoriteHosterDefaults = '['+favoriteHosterDefaults+']';
			favoriteHosterDefaults = favoriteHosterDefaults.replace(/"}{"/g,'"},{"');
			console.log(favoriteHosterDefaults);
			setCookie('favoriteHoster', favoriteHosterDefaults, 1);
		}
		if (
			pageURL.matchLink('http://pron.tv/l/*/*')
		) {
			addGlobalStyle('#player-and-details {height: 480px;}');
			mainFunction = function() {
				var iframes =  document.querySelectorAll('#actualPlayer iframe');
				contentURL = iframes ? iframes[0].src : null;
				if (contentURL.matchLink('https://docs.google.com/file/d/*/preview?*')) {
					contentURL = contentURL + '&hd=1';
				}
				else if (contentURL.matchLink('https?://yespornplease.com/view/*')) {
					// http://yespornplease.com/view/741577353?utm=pron
					// http://e.yespornplease.com/e/741577353/width-650/height-400/autoplay-1
					contentURL = contentURL.replace(/.*\/view\/(.*?)[?].*/i, 'http://e.yespornplease.com/e/$1/width-650/height-400/autoplay-0');
					contentURL = contentURL.replace(/\/width-\d+\/height-\d+\//i, '/width-882/height-496/');
				}
				else if (contentURL.matchLink('https?://www.porntrex.com/video/*')) {
					contentURL = contentURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'https://www.porntrex.com/embed/$1');
				}

				var poster = document.querySelector('.blockx img.imgshadow');
				posterURL = poster ? poster.src : '';
				appendToFrame = document.querySelector('#linkdetails-similars');

				for (const a of document.querySelectorAll("span > b")) {
					if (a.textContent.includes("Source-Title")) {
						contentTitle = a.parentNode.nextElementSibling.textContent.replace(/\n/g,'').toTitleCase();
					}
				}
				// var GM_LocalStorage = localStorage.getItem('GM_LocalStorage');
				// console.log('GM_LocalStorage: ' + GM_LocalStorage);
				// if (GM_LocalStorage) {
				// 	contentTitle = contentTitle + ' ['GM_LocalStorage']';
				// 	alert(contentTitle);
				// 	// localStorage.removeItem('GM_LocalStorage');
				// }

				appendPosition = 'before';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('#actualPlayer iframe', 'src', initFunction, delay, null, false);
			var source = document.querySelector('#player-and-details-2 > div.blockx > div.a > center > b:nth-of-type(2)');
			if (source) {
				var sourceURL = source.innerText;
				source.outerHTML = '<a href="//' +sourceURL + '">' + sourceURL + '</a>';
			}
		}
	}

	else if (
		pageURL.matchLink('http://www.xmoviesforyou.com/*/*/*.html')
	) {
		mainFunction = function() {
			textAreaAutoHeight = true;
			contentURL = document.querySelector('iframe[src^="https://openload.co/"]').src;
			posterURL = document.querySelector('img.size-full').src;
			appendToFrame = document.querySelector('iframe[src^="https://openload.co/"]');
			appendPosition = 'after';
			addEmbedCodeFrame(mainFunction);
			addKeyComboCtrlC(true);
		};
		waitForElement('iframe[src^="https://openload.co/"]', 'src', initFunction, delay, null, false);
	}

	else if (
		pageURL.matchLink('https://danbooru.donmai.us/posts')
	) {
		addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
		addOpenInNewTabProperty('article > a');
		forEach(document.querySelectorAll('a.search-tag'), function(index, self) {
			var href = self.href + '+limit%3A50&';
			self.href = href;
		});
		if (pageURL.matchLink('https://danbooru.donmai.us/posts/*')) {
			mainFunction = function() {
				contentURL = document.querySelector('#image-container').getAttribute('data-large-file-url');
				contentURL = contentURL ? ('http://' + pageHost + contentURL) : contentURL;
				posterURL = document.querySelector('#image-container').getAttribute('data-preview-file-url');
				posterURL = posterURL ? ('http://' + pageHost + posterURL) : posterURL;
				appendToFrame = document.querySelector('#image-container');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('#image-container', 'data-preview-file-url', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https://biqle.ru/*')
	) {
		addHDtext('.video-title', 'rgba(255, 255, 255, 1)');
		if (
			pageURL.matchLink('https://biqle.ru/watch/*')
		) {
			mainFunction = function() {
				contentURL = document.querySelector('iframe').src + '/RD';
				posterURL = document.querySelector('link[itemprop="thumbnailUrl"]').href;
				appendToFrame = document.querySelector('.heading');
				appendPosition = 'before';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('iframe', 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https://www.bitporno.sx/*') ||
		pageURL.matchLink('https://www.bitporno.com/*')
	) {
		if (
			pageURL.matchLink('https://www.bitporno.sx/?*v=*') ||
			pageURL.matchLink('https://www.bitporno.com/?*v=*') // https://www.bitporno.com/?v=kI44xwQ9
		) {
			mainFunction = function() {
				contentURL = document.querySelector('#embed_code').value.match(/.*src="(.*?)".*/i)[1];
				posterURL = document.querySelector('meta[property="og:image"]').content;
				appendToFrame = document.querySelector('div.small_content');
				appendPosition = 'before';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('#embed_code', false, initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https://vipergirls.to/*')
	) {
		addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
		console.log(pageURL.matchLink('https://vipergirls.to/threads/*/page*'));
		if (
			pageURL.matchLink('https://vipergirls.to/threads/*/page*')
		) {
			embedCodeTextRefresh = false;
			mainFunction = function() {
				var imagesArray = [];
				var thumbsArray = [];

				var thumbs = document.querySelectorAll('.postcontent > a > img');
				// console.log(thumbs);

				forEach(thumbs, function(index, self) {
					var thumbURL = self.src;
					// console.log(thumbURL);
					// http://t6.imgchili.com/27208/27208100_dawsonmiller_yellow_.jpg --> http://i6.imgchili.net/27208/27208100_dawsonmiller_yellow_.jpg
					var imageURL = thumbURL.replace(/http:\/\/t(.*?)\.imgchili.com\//i, 'http://i$1.imgchili.net/');
					// console.log(imageURL);
					thumbsArray.push(thumbURL);
					imagesArray.push(imageURL);
				});

				pageURL = pageURL.replace(/(.*?)\?.*/, '$1');

				forEach(thumbsArray, function(index, self) {
					contentURL = imagesArray[index];
					posterURL = self;
					contentTitle = ''; //pageTitle.replace(/^.{1} /i, '').Capitalize();
					if (embedCodeText) {embedCodeText = embedCodeText + '\n' + '<div class="thumbnail"';} else {embedCodeText = '<div class="thumbnail"';}
					if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
					if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
					embedCodeText += ' content="'+contentURL+'"';
					if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
					embedCodeText += '></div>';
				});

				appendToFrame = document.querySelector('.navlinks');
				appendPosition = 'before';
				textAreaAutoHeight = true;
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('.navlinks', false, initFunction, delay, tries, false);
		}
	}

	else if (
		pageURL.matchLink('http://www.porn.com/*')
	) {
		if (
			pageURL.matchLink('http://www.porn.com/videos/*') // http://www.porn.com/videos/horny-cock-sluts-aggressively-pull-off-plumber-s-clothes-29282
		) {
			mainFunction = function() {
				// contentURL = document.querySelector('textarea[name="share"]').value.match(/.*src="(.*?)".*/i)[1];
				// var a = document.querySelector('.dlRow > a'); console.log(a.href);
				// contentURL = contentURL + '?' + a.href;
				contentURL = pageURL.replace(/(.*?)[?].*/, '$1') + '?' + 'EMBED';
				posterURL = document.querySelector('input[value*="img src="]').value.match(/.*img src="(.*?)".*/i)[1];
				appendToFrame = document.querySelector('#player');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('textarea[name="share"]', false, initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('http://hd.xtapes.to/*')
	) {
		document.oncontextmenu=null;
		document.ondragstart=null;
		document.body.onselectstart=null;
		document.body.onmousedown=null;
	}

	else if (
		pageURL.matchLink('http://www.nudeflix.com/*')
	) {
		if (
			pageURL.matchLink('http://www.nudeflix.com/dvd/*/*') // http://www.nudeflix.com/dvd/big-tit-cream-pie-filling/christina-jolie-brunette-beauty-will-definitely-make-this-st
		) {
			mainFunction = function() {
				contentURL = document.querySelectorAttribute(videoSourceSelector, 'src');
				posterURL = document.querySelector('.video-player-poster').style.backgroundImage.match(/"(.*?)"/i)[1];
				appendToFrame = document.querySelector('#video-player-mount');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement(videoSourceSelector, 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https://xhamster.com/*')
	) {
		if (
			pageURL.matchLink('https://xhamster.com/movies/*/*.html') // https://xhamster.com/movies/7029177/blonde_teen_great_blowjob.html
		) {
			mainFunction = function() {
				contentURL = document.querySelector('link[itemprop="embedUrl"]').href;
				posterURL = document.querySelector('link[itemprop="thumbnailUrl"]').href;
				appendToFrame = document.querySelector('#playerSwf');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('link[itemprop="embedUrl"]', false, initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('http[s]?://18onlygirls.ru/*')
	) {
		var linksArray = document.querySelectorAll('.short-story > a');
		forEach(linksArray, function(index, self) {
			var link = self;
			var image = link.querySelector('img');
			var imageSrc = image.src;
			if (!imageSrc || imageSrc.match('/images/spacer.gif') || imageSrc === '') {
				var background = image.style.background;
				imageSrc = background ? background.match(/.*url\("(.*?)\)".*/i)[1] : imageSrc;
				if (imageSrc) image.src = imageSrc;
				// console.log(imageSrc);
			}
		});
	}

	else if (
		pageURL.matchLink('https?://yespornplease.com/*')
	) {
		if (
			pageURL.matchLink('https?://yespornplease.com/view/*') // http://yespornplease.com/view/741577353
		) {
			mainFunction = function() {
				contentURL = document.querySelector('#video_embed_code').value.match(/.*src="(.*?)".*/i)[1];
				contentURL = contentURL.replace(/\/width-\d+\/height-\d+\//i, '/width-882/height-496/');
				posterURL = (
					document.querySelector('meta[name="thumbnail"]') ?
					document.querySelector('meta[name="thumbnail"]').content :
					document.querySelector('meta[property="og:image"]').content
				);
				/* contentTitle = (document.querySelector('.pull-left > h4') ?
								document.querySelector('.pull-left > h4').innerText.trim() :
								contentTitle.replace(' Watch Online For Free - YesPornPlease', ''));
				*/
				appendToFrame = document.querySelector('.video-tags');
				appendPosition = 'before';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('#video_embed_code', false, initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('http://xxvideoss.org/*')
	) {
		if (
			pageURL.matchLink('http://xxvideoss.org/*/') // http://xxvideoss.org/sambuca-masturbating-beauty/
		) {
			mainFunction = function() {
				contentURL = document.querySelector('iframe').src;
				posterURL = (
					document.querySelector('meta[name="thumbnail"]') ?
					document.querySelector('meta[name="thumbnail"]').content :
					document.querySelector('meta[property="og:image"]').content
				);
				appendToFrame = document.querySelector('ul.tab-content');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('iframe', 'src', initFunction, delay, null, false);
			if (typeof jQuery == 'undefined') {
				var styleFix = (
					'<script src="http://xxvideoss.org/wp-includes/js/wp-emoji-release.min.js?ver=4.8" type="text/javascript" defer=""></script>'+
					'<link rel="stylesheet" id="bootstrap_tab-css" href="http://xxvideoss.org/wp-content/plugins/easy-responsive-tabs/assets/css/bootstrap_tab.min.css?ver=4.8" type="text/css" media="all">'+
					'<link rel="stylesheet" id="bootstrap_dropdown-css" href="http://xxvideoss.org/wp-content/plugins/easy-responsive-tabs/assets/css/bootstrap_dropdown.min.css?ver=4.8" type="text/css" media="all">'+
					'<link rel="stylesheet" id="ert_tab_icon_css-css" href="http://xxvideoss.org/wp-content/plugins/easy-responsive-tabs/assets/css/res_tab_icon.css?ver=4.8" type="text/css" media="all">'+
					'<link rel="stylesheet" id="wp-pagenavi-css" href="http://xxvideoss.org/wp-content/plugins/wp-pagenavi/pagenavi-css.css?ver=2.70" type="text/css" media="all">'+
					'<link rel="stylesheet" id="dp-fonts-css" href="http://fonts.googleapis.com/css?family=Arimo%3A400%2C700%7CDroid+Serif%3A400%2C700%7COpen+Sans%3A600%2C700&amp;ver=4.8" type="text/css" media="all">'+
					'<link rel="stylesheet" id="dp-style-css" href="http://xxvideoss.org/wp-content/themes/detube/style.css?ver=1.4.3" type="text/css" media="all">'+
					'<link rel="stylesheet" id="dp-responsive-css" href="http://xxvideoss.org/wp-content/themes/detube/responsive.css?ver=1.4.3" type="text/css" media="all">'+
					'<script type="text/javascript" src="http://xxvideoss.org/wp-includes/js/jquery/jquery.js?ver=1.12.4"></script>'+
					'<script type="text/javascript" src="http://xxvideoss.org/wp-includes/js/jquery/jquery-migrate.min.js?ver=1.4.1"></script>'+
					'<script type="text/javascript" src="http://xxvideoss.org/wp-content/themes/detube/js/modernizr.min.js?ver=2.6.2"></script>'+
					'<script type="text/javascript" src="http://xxvideoss.org/wp-content/themes/detube/js/jquery.plugins.min.js?ver=1.4.6"></script>'+
					'<link rel="https://api.w.org/" href="http://xxvideoss.org/wp-json/">'
				);
				document.head.innerHTML = document.head.innerHTML + styleFix;
				console.log('styleFix applied for: ' + pageURL);
			}
		}
	}

	else if (
		pageURL.matchLink('http://porntube4k.net/*')
	) {
		if (
			pageURL.matchLink('http://porntube4k.net/*/*/')
		) {
			mainFunction = function() {
				contentURL = document.querySelector('iframe').src;
				posterURL = (
					document.querySelector('meta[name="thumbnail"]') ?
					document.querySelector('meta[name="thumbnail"]').content :

					document.querySelector('meta[property="og:image"]') ?
					document.querySelector('meta[property="og:image"]').content :

					document.querySelector('meta[name="og:image"]').content ?
					document.querySelector('meta[name="og:image"]').content :
					null
				);
				appendToFrame = document.querySelector('div.video_player');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('iframe', 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://www.gameofporn.net/*')
	) {
		if (
			pageURL.matchLink('https?://www.gameofporn.net/video/*')
		) {
			mainFunction = function() {
				contentURL = document.querySelector('iframe').src;
				posterURL = (
					document.querySelector('a[href="'+pageURL+'"] > img') ?
					document.querySelector('a[href="'+pageURL+'"] > img').src :

					document.querySelector('meta[name="thumbnail"]') ?
					document.querySelector('meta[name="thumbnail"]').content :

					document.querySelector('meta[property="og:image"]') ?
					document.querySelector('meta[property="og:image"]').content :

					document.querySelector('meta[name="og:image"]').content ?
					document.querySelector('meta[name="og:image"]').content :
					null
				);
				appendToFrame = document.querySelector('#playbox');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('iframe', 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://www.playvids.com/')
	) {
		if (
			pageURL.matchLink('https?://www.playvids.com/v/*')
		) {
			mainFunction = function() {
				contentURL = document.querySelector('div[itemprop="video"] > link[itemprop="embedURL"]').getAttribute('content');
				var maxQualityButton = document.querySelector('#mediaPlayerQualityList > .item[data-index]');
				if (maxQualityButton) {
					contentURL = contentURL + '?quality=' + maxQualityButton.dataset.quality;
					maxQualityButton.click();
				}
				posterURL = document.querySelector('div[itemprop="video"] > link[itemprop="thumbnailUrl"]').getAttribute('content');
				pageURL = document.querySelector('div[itemprop="video"] > link[itemprop="url"]').getAttribute('href');
				appendToFrame = document.querySelector('div[itemprop="video"]');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('#mediaPlayerQualityList > .item[data-index]', null, initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://streamxxx.tv/*')
	) {
		if (
			pageURL.matchLink('https?://streamxxx.tv/*') // http://streamxxx.tv/porn-fidelity-katrina-jade-animal-instincts-2017hd/
		) {
			mainFunction = function() {
				contentURL = document.querySelector('.webwarez .responsive-tabs__panel--active > iframe').getAttribute('src');
				posterURL = document.querySelector('div.novideo > p:nth-child(1) > strong > a > img').getAttribute('src');
				pageURL = document.querySelector('link[rel="canonical"]').getAttribute('href');
				appendToFrame = document.querySelector('div.webwarezvideo > div > div');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
				qualityButtons = document.querySelector('.webwarez .responsive-tabs__list__item[id^=tablist1-]');
			};
			waitForElement('.webwarez .responsive-tabs__panel--active > iframe', 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://www.schoolgirlfuck.net/*')
	) {
		if (
			pageURL.matchLink('https?://www.schoolgirlfuck.net/*/') // http://www.schoolgirlfuck.net/fakeagent-e575-lovita-fate/
		) {
			mainFunction = function() {
				// var dateString = document.querySelector('div.single-views span').innerText; // "September 4, 2017"
				// var dateArray = dateString.match(/(\w+?) (\d+), (\d+)/);
				// var dateYear = dateArray[3], dateMonth = dateArray[1], dateDay = dateArray[2];
				// var MONTH = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
				// var monthNum;
				// forEach(MONTH, function(index, name) {
				// 	if (dateMonth.toLowerCase() == name.toLowerCase()) {
				// 		monthNum = index+1 < 10 ? '0'+(index+1) : index+1;
				// 		return;
				// 	}
				// });
				// var title = document.querySelector('.singletitle').innerText.trim().replace(/\s+/g, '-');
				//
				var xmlFile = document.querySelector('link[rel="alternate"]').href; //'http://www.schoolgirlfuck.net/wp-json/oembed/1.0/embed?url=http%3A%2F%2Fwww.schoolgirlfuck.net%2Fpassion-hd-ava-taylor-upskirt-opportunity%2F&format=xml';
				var links = document.querySelectorAll('link[rel="alternate"]');
				forEach(links, function(index, link) {
					if (link.href.match('format=xml')) {
						xmlFile = link.href;
						console.log('xmlFile: '+xmlFile);
						return;
					}
				});
				var request = new XMLHttpRequest(); request.open("GET", xmlFile, false); request.send(); var xml = request.responseXML;
				var thumbnail_url = xml.querySelector("thumbnail_url").innerHTML;
				//
				contentURL = document.querySelector('iframe').getAttribute('src');
				posterURL = thumbnail_url; // 'http://www.schoolgirlfuck.net/wp-content/uploads/'+dateYear+'/'+monthNum+'/'+title+'-210x147.jpg';
				// http://www.schoolgirlfuck.net/wp-content/uploads/2017/9/FakeAgent-E575-Lovita-Fate-210x147.jpg
				// http://www.schoolgirlfuck.net/wp-content/uploads/2017/09/FakeAgent-E575-Lovita-Fate-210x147.jpg
				pageURL = document.querySelector('link[rel="canonical"]').getAttribute('href');
				appendToFrame = document.querySelector('div.VideoInformation');
				appendPosition = 'before';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('iframe', 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://yourporn.sexy/*')
	) {
		if (
			pageURL.matchLink('https://yourporn.sexy/post/*.html') // https://yourporn.sexy/post/59ad08cc83ab7.html
		) {
			if (!pageURL.match('#onlyVideo')) { // https://yourporn.sexy/post/59772cebee27b.html#onlyVideo
				mainFunction = function() {
					posterURL = getAbsoluteUrl(document.querySelector('meta[property="og:image"]').getAttribute('content', 2));
					pageURL = getAbsoluteUrl(document.querySelector('meta[property="og:url"]').getAttribute('content', 2));
					contentURL = shortURL+'#onlyVideo'; // document.querySelector(videoSourceSelector).src;
					appendToFrame = document.querySelector('div.comments_area');
					appendPosition = 'before';
					addEmbedCodeFrame(mainFunction);
					addKeyComboCtrlC(true);
				};
				waitForElement(videoSourceSelector, 'src', initFunction, delay, null, false);
			}
		}
	}

	else if (
		pageURL.matchLink('https?://allerotika.net/*')
	) {
		if (
			pageURL.matchLink('https?://allerotika.net/clip/*') // https://allerotika.net/clip/2010912.html
		) {
			mainFunction = function() {
				contentURL = document.querySelector(videoSourceSelector).src;
				posterURL = getAbsoluteUrl(document.querySelector(videoSourceSelector).poster);
				// pageURL = getAbsoluteUrl(document.querySelector('meta[property="og:url"]').getAttribute('content', 2));
				appendToFrame = document.querySelector('div.published');
				appendPosition = 'before';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement(videoSourceSelector, 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://www.porndig.com/*')
	) {
		if (
			pageURL.matchLink('https?://www.porndig.com/videos/*/*') // https://www.porndig.com/videos/75829/melanie-rios-gigi-rivera-oil-overload-teens.html
		) {
			mainFunction = function() {
				var val = 0;
				document.querySelectorAll('.post_download_link > span.pull-left').forEach(function(item) {
					var size = item.innerText.match(/(\d+)/);
					if (size) val = Math.max(val, size[1]);
				});
				contentTitle = document.title;
				if (val !== 0) contentTitle = contentTitle.replace(contentTitle, contentTitle + ' [' + val + 'p] - ' + pageHost.replace('www.', '')).toTitleCase(true);
				contentURL = document.querySelector('.video_embed > textarea').value.match(/.*src="(.*?)".*/i)[1];
				forEach(document.scripts, function(index, script) {
					var match = script.text.match(/post_thumbnail="(.*?)"/i);
					if (match) posterURL = match[1];
				});
				appendToFrame = document.querySelector('.video_wrapper');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement('.video_embed > textarea', false, initFunction, delay, null, false);
		}
	}


	else if (
		pageURL.matchLink('https?://pantporn.com/*')
	) {
		if (
			pageURL.matchLink('https?://pantporn.com/*') // http://pantporn.com/banging-down-a-therapist-katrina-jade/
		) {
			videoSourceSelector = 'iframe[src*="vidoza.net"], iframe[src*="openload.co"]';
			mainFunction = function() {
				contentURL = document.querySelector(videoSourceSelector).src;
				posterURL = document.querySelector('meta[property="og:image"]').content;
				appendToFrame = document.querySelector(videoSourceSelector);
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement(videoSourceSelector, 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://www.camshooker.com/*')
	) {
		if (
			pageURL.matchLink('https?://www.camshooker.com/videos/*') // http://www.camshooker.com/videos/7440/vicats-slut-like-masturbating-in-webcam/
		) {
			videoSourceSelector = 'iframe[src*="vidoza.net"], iframe[src*="openload.co"]';
			mainFunction = function() {
				contentURL = document.querySelector(videoSourceSelector).src;
				posterURL = document.querySelector('meta[property="og:image"]').content;
				appendToFrame = document.querySelector('.player');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement(videoSourceSelector, 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://xfreehd.com/*')
	) {
		if (
			pageURL.matchLink('https?://xfreehd.com/video/*/*') // https://xfreehd.com/video/11960/anka-minetchica-virgin-defloration
		) {
			videoSourceSelector = 'video > source';
			mainFunction = function() {
				contentURL = document.querySelector(videoSourceSelector).src;
				contentURL = document.querySelector('.nv-hdicon') ? contentURL.replace('/iphone/', '/hd/') : contentURL;
				posterURL = document.querySelector('meta[property="og:image"]').content;
				appendToFrame = document.querySelector('#wrapper > div.container > div:nth-child(2) > div.col-md-8 > div:nth-child(1)');
				appendPosition = 'after';
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement(videoSourceSelector, 'src', initFunction, delay, null, false);
		}
	}

	else if (
		pageURL.matchLink('https?://fuckingsession.com/*')
	) {
		if (
			pageURL.matchLink('https?://fuckingsession.com/*/') // http://fuckingsession.com/team-skeet-karissa-kane-tightly-packed-jizz-showers/
		) {
			videoSourceSelector = 'iframe[src], #mediaplayer_media > video';
			mainFunction = function() {
				contentURL = document.querySelector(videoSourceSelector).src;
				var elements = document.querySelectorAll('iframe[src], #mediaplayer_media > video');
				var visibleElement = getVisibleElement(elements);
				if (visibleElement && !visibleElement.src && document.querySelectorAll('.jwdisplayIcon, #vplayer_display_button')) {
					document.querySelectorAll('.jwdisplayIcon, #vplayer_display_button').forEach(function(item, index, array){
						return item.click();
					});
				}
				contentURL = visibleElement ? visibleElement.src : contentURL;
				posterURL = document.querySelector('meta[property="og:image"]').content;
				appendToFrame = document.querySelector('#extras');
				appendPosition = 'before';
				var sourceButtons = document.querySelectorAll('.GTTabsLinks');
				sourceButtons.forEach(function(item, index, array){
					if (item) item.addEventListener("click", mainFunction, false);
				});
				addEmbedCodeFrame(mainFunction);
				addKeyComboCtrlC(true);
			};
			waitForElement(videoSourceSelector, false, initFunction, delay, null, false);
		}
	}

})();
