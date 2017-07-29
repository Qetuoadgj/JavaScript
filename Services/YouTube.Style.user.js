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
	var G_styleName = 'YouTube_Style';
	var Fix_Guide_Style = function() {
		var width = 194 + 20;                                                   // 194
		addGlobalStyle(
			'.guide-channels-list a.guide-item {width: '+(width-10)+'px;}'+     // 184
			'#guide-container > div {width: '+(width)+'px;}'+                   // 194
			'#appbar-guide-menu {width: '+(230+width-194)+'px;}'+               // 230
			'#guide .display-name.no-count {width: '+(140+width-194-30)+'px;}', // 140 (-30)
			G_styleName
		);
		addGlobalStyle('.guide-count-value {color: white;}', G_styleName);
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
	var Fix_MagicOptions_Style = function() {addGlobalStyle('#watch7-content div {position: inherit;}',G_styleName);}();
})();