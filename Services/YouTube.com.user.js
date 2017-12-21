// ==UserScript==
// @name         YouTube.com
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.3
// @description  Pure JavaScript version.
// @author       Ægir
// @run-at       document-end
// @noframes
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        https://www.youtube.com/watch?*
// ==/UserScript==

(function() {
	'use strict';

	var ClipConverterFixStyle = function() {
		var buttons = document.querySelectorAll('span#clipconverter > a > button');
		for (var index = 0; index < buttons.length; index++) {
			var button = buttons[index];
			var span = button.querySelector('span');
			if (!span) {
				var text = button.innerHTML;
				button.innerHTML = '<span class="yt-uix-button-content"><strong>' + text + '</strong></span>';
			}
			button.setAttribute('class', 'yt-uix-button yt-uix-button-opacity yt-uix-tooltip');
		}
	};
	var MagicOptionsFixStyle = function() {
		var panel = document.querySelector('div[title="Magic Options"]').nthParentNode(2);
		if (panel) panel.style.position = 'inherit';
	};
	// waitForElement('div[title="Magic Options"]', null, MagicOptionsFixStyle, delay, tries, null);
	document.addEventListener('DOMNodeInserted', function handleNewElements(event) {
		if (event.target.id && event.target.id == 'clipconverter') {
			ClipConverterFixStyle();
		}
	} , false);
})();
