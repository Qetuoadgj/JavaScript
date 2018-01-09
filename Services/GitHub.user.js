// ==UserScript==
// @name         GitHub
// @icon         https://www.google.com/s2/favicons?domain=GitHub.com
// @version      1.0.1
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/GitHub.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        *://github.com/*/tree/master/*
// @match        *://github.com/*/delete/master/*
// @match        *://github.com/*/*

// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	// ====================================================================================================================
	var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
	String.prototype.matchLink = function(link, flags) {
		link = link.replace(/[.\/]/g, "\\$&");
		link = link.replace(/\*/g, ".*");
		var re = new RegExp(link, flags);
		return this.match(re);
	};
	// ====================================================================================================================
	var autoSubmit = 1;
	// autoSubmit = 0;
	if (
		pageURL.matchLink('github.com/*/delete/master/*')
	) {
		var Go_To_Submit_Button = function() {

			var Submit_Button = document.getElementById("submit-file");
			if ( Submit_Button ) {
				var Align_With_Top = true;
				if (autoSubmit) {
					console.log('autoSubmit: '+autoSubmit);
					Submit_Button.click();
				}
				else {
					Submit_Button.scrollIntoView( Align_With_Top );
				}
			}
		};
		setTimeout(function(){Go_To_Submit_Button();}, 50); //1500/2/3
	}
	// ====================================================================================================================
	else if (
		pageURL.matchLink('github.com/*/tree/master/*') ||
		pageURL.matchLink('github.com/*/*')
	) {
		var DeleteFromRepo = function( RepoLink )
		{
			var link = RepoLink.querySelector( 'td.content a.js-navigation-open'),
				link_href = link ? link.href : null;
			var delete_link = link_href ? link_href.replace( '/blob/master/', '/delete/master/' ) : null;
			if ( delete_link ) {
				window.location.href = delete_link;
			}
		};
		var onKeyDown = function( e )
		{
			e = e || window.event;
			var targetType = e.target.tagName.toLowerCase();
			var x = event.clientX, y = event.clientY, elementMouseIsOver = document.elementFromPoint( x, y );
			var cKey = 67, delKey = 46, lArrowKey = 37, rArrowKey = 39, escKey = 27, sKey = 83,
				zKey = 90, fKey = 70, qKey = 81, gKey = 71, kKey = 75, eKey = 69,
				lBracket = 219, rBracket = 221;
			var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
			if ( targetType !== 'input' || targetType !== 'textarea' ) {
				var RepoLink = document.querySelector( 'tr.js-navigation-item.navigation-focus' );
				if (RepoLink && e.keyCode == delKey) { // Delete
					DeleteFromRepo( RepoLink );
				}
				e.preventDefault();
			}
		};

		window.addEventListener('keydown', function(e){onKeyDown(e);}, false);
	}
	// ====================================================================================================================
})();