// ==UserScript==
// @name         YouTube.Style
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Style.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        https://www.youtube.com/*
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	function addGlobalStyle(css, cssClass) {
		var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
		var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
		if (cssClass) style.setAttribute('class', cssClass);
		head.appendChild(style);
	}
	var Fix_Guide_Style = function() {
		var styleName = 'YouTube_Style';
		var width = 300;
		addGlobalStyle(
			'.guide-channels-list a.guide-item {width: '+(width-30)+'px;}'+
			'#guide-container > div {width: '+(width-20)+'px;}'+
			'#appbar-guide-menu {width: '+(width)+'px;}'+
			'#guide {z-index: 2147483647 !important; position: absolute;}'+
			'.guide-item .display-name {width:'+(width-100)+'px !important;}'+
			'.guide-count-value {color: white;}',
			styleName
		);
	}();
	var Fix_ClipConverter_Style = function() {
		var buttons = document.querySelectorAll('#clipconverter button');
		for (var index = 0; index < buttons.length; index++) {
			var button = buttons[index];
			var span = button.querySelector('span');
			if (!span) {
				var text = button.innerHTML;
				button.innerHTML = '<span class="yt-uix-button-content"><strong>' + text + '</strong></span>';
			}
			button.setAttribute('class', 'yt-uix-button yt-uix-button-opacity yt-uix-tooltip');
		}
	}();
})();