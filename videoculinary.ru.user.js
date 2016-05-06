// ==UserScript==
// @name         videoculinary.ru
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @match        http://www.videoculinary.ru/recipe/*
// @grant        none
// @updateURL    https://github.com/Qetuoadgj/JavaScript/raw/master/videoculinary.ru.user.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function removeElementsBySelector(selector, all){
    var element;
    if (all) {
      var group = document.querySelectorAll(selector), i;
      for (i = 0; i < group.length; ++i) {
        element = group[i]; element.remove();
      }
    } else {
      element = document.querySelector(selector);
      element.remove();
    }
    return false;
  }

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  var deleteElement, currentArray, currentElement, i;

  var doc = document.querySelector('div.content-inner');
  var body = document.body; body.innerHTML = '' ; body.appendChild(doc);

  currentArray = document.querySelectorAll('a');
  for (i = 0; i < currentArray.length; ++i) {
    currentElement = currentArray[i];
    currentElement.outerHTML = currentElement.innerHTML;
  }
  removeElementsBySelector('div.relink');
  removeElementsBySelector('div.share-panel.white-block.clearfix');
  removeElementsBySelector('hr', true);
  removeElementsBySelector('a.fake-checkbox', true);
  removeElementsBySelector('i.fa.fa-check', true);
  removeElementsBySelector('div.row.text-center');
  removeElementsBySelector('div.embed-responsive.embed-responsive-16by9', true);
  removeElementsBySelector('div.share-panel.white-block.clearfix');
  // removeElementsBySelector('img', true);

  currentArray = document.querySelectorAll('div.container.advertising');
  for (i = 0; i < currentArray.length; ++i) {
    currentElement = currentArray[i];
    currentElement.remove();
  }
  removeElementsBySelector('div.col-xs-12.col-sm-6');

  addGlobalStyle('.steps-list li { margin-top: 0px;}');
  addGlobalStyle('.ingredients-list li {margin-bottom: 0px}');
  addGlobalStyle('.h1, h2, h3, h4, h5, h6 {line-height: 1.0; color: black;}');
  addGlobalStyle('p {margin: 0px;}');
  addGlobalStyle('body {color: black; background-color: white;}');
  addGlobalStyle('.post-title {color: black;}');
  addGlobalStyle('a, a:hover, a:focus, a:active, a:visited, a.grey:hover, .section-title i, .blog-title:hover h4, .blog-title:hover h5, .next-prev a:hover .fa, .blog-read a, .blog-read a:hover, .blog-read a:active, .blog-read a:visited, .blog-read a:focus, .blog-read a:visited:hover, .fake-thumb-holder .post-format, .comment-reply-link:hover, .category-list .icon, .widget .category-list li:hover .icon, .my-menu li.active a, .my-menu li:hover a, .recipe-actions li:hover, .recipe-actions li:hover a {color: black;}');

  removeElementsBySelector('i.fa.fa-eyedropper');
  removeElementsBySelector('i.fa.fa-sort-numeric-asc');

  document.querySelector('.row.recipe-details').style['margin-left'] = '0px';
})();
