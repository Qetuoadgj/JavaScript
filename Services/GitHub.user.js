// ==UserScript==
// @name         GitHub
// @icon         https://www.google.com/s2/favicons?domain=GitHub.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/GitHub.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        https://github.com/*/tree/master/*
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function DeleteFromRepo( RepoLink )
  {
    var link = RepoLink.querySelector( 'td.content a.js-navigation-open'),
        link_href = link ? link.href : null;
    var delete_link = link_href ? link_href.replace( '/blob/master/', '/delete/master/' ) : null;
    if ( delete_link ) {
      window.location.href = delete_link;
    }
  }

  function onKeyDown( e )
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
  }

  window.addEventListener('keydown', function(e){onKeyDown(e);}, false);
})();