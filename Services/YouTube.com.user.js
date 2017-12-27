// ==UserScript==
// @name         YouTube.com
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.5
// @description  Pure JavaScript version.
// @author       Ægir
// @run-at       document-start
// @noframes
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        https://www.youtube.com/watch?*
// ==/UserScript==

(function() {
	'use strict';

	var bug_fixed = 0;

	Element.prototype.nthParentNode = function(num) {
		var parent = this;
		for (var i = 0; i < num; ++i) {parent = parent.parentNode;}
		return parent;
	};

	var ClipConverterFixStyle = function() {
		var main = document.querySelector('span#clipconverter');
		if (main) {
			var buttons = document.querySelectorAll('span#clipconverter > a > button');
			for (var index = 0; index < buttons.length; index++) {
				var button = buttons[index];
				var span = button.querySelector('span');
				if (!span) {
					var text = button.innerHTML;
					button.innerHTML = '<span class="yt-uix-button-content"><strong>' + text + '</strong></span>';
				}
				button.setAttribute('class', 'yt-uix-button yt-uix-button-opacity yt-uix-tooltip');
				if (main.className != 'bug-fixed') {
					main.classList.add('bug-fixed');
					bug_fixed = 1;
				}
			}
			// alert('bug_fixed: ' + bug_fixed);
		}
	};

	var MagicOptionsFixStyle = function() {
		var main = document.querySelector('div[title="Magic Options"]');
		if (main) {
			var panel = main.nthParentNode(2);
			if (panel) {
				panel.style.position = 'inherit';
				panel.classList.add('bug-fixed');
			}
		}
	};

	// setTimeout(ClipConverterFixStyle, 1);
	// setTimeout(MagicOptionsFixStyle, 1);

	document.addEventListener('DOMNodeInserted', function handleNewElements(event) {
		if (bug_fixed === 0) {
			var element = event.target;
			// if (element.id == 'clipconverter' && element.className != 'bug-fixed') {
			if (element.className != 'bug-fixed') {
				ClipConverterFixStyle();
			}
			if (element.title == 'Magic Options' && element.className != 'bug-fixed') {
				MagicOptionsFixStyle();
			}
		}
	}, false);
})();
