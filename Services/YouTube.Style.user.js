// ==UserScript==
// @name         YouTube.Style
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Style.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js
// @match        https://www.youtube.com/*
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	var G_ScriptName = 'YouTube.Style';

	function CSS(name, rule, replace) {
		var css = name ? $('style[name="' + name + '"]')[0] : null, exists = css ? true : false;
		if (!exists || (exists && replace)) css = $('<style></style>')[0];
		if (!exists) $('html > head').append(css);
		if (name) $(css).attr('name', name);
		$(css).html($(css).html()+rule);
		console.log('CSS: ', css);
		return css;
	}

	var Fix_ClipConverter_Style = function() {
		$('#clipconverter button').each(function( index ) {
			if (!$(this).find('span')[0]) $(this).html('<span class="yt-uix-button-content"><strong>'+$(this).html()+'</strong></span>');
			$(this).attr('class', 'yt-uix-button yt-uix-button-opacity yt-uix-tooltip');
		});
	}();

	var Fix_MagicOptions_Style = function() {
		var style_name = G_ScriptName+'.Fix_MagicOptions_Style';
		CSS(style_name, ('\n\t'+'#watch7-content > div {position: relative; z-index: 0;}'+'\n'), true);
	}();
})();