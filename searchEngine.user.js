// ==UserScript==
// @name         searchEngine
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/searchEngine.user.js
// @match        file:///*/search.html
// ==/UserScript==

(function() {
  'use strict';

  // THIS FILE GLOBAL VARIABLES
  // ====================================================================================================================
  var fontSize = 16;
  var margin = '5px 0px 0px 0px';

  var searchField = document.createElement('input');
  searchField.id = 'searchField';
  searchField.type = 'input';
  searchField.style['font-size'] = fontSize+'px';
  searchField.style.height = 'auto';
  searchField.style.width = '720px';
  searchField.style.margin = margin;
  document.body.appendChild(searchField);

  var queriesList = [
    'http://sexix.net/?s='+'%s',
    'http://hdpoz.com/?s='+'%s',
    'http://www.porntrex.com/search?search_query='+'%s'+'&search_type=videos',
    'http://porndoe.com/search?keywords='+'%s',
    'http://www.eporner.com/search/'+'%s'+'/',
    'http://www.pornerbros.com/search?q='+'%s',
    'http://wixvi.cc/?s='+'%s',
    'http://www.babesandstars.com/search/?t=models&q='+'%s',
  ];

  var linksList = [];

  queriesList.forEach(function(query, index) {
    var d = document.createElement('div');
    d.style.margin = margin;
    d.style.display = 'table';

    // d.style['border-color'] = 'grey';
    // d.style['border-width'] = '1px';
    // d.style['border-style'] = 'solid';

    d.style.position = 'relative';
    d.style.height = Math.ceil(fontSize*2)+'px';
    document.body.appendChild(d);

    var i = document.createElement('img');
    i.style.position = 'absolute';
    i.style.top = '0';
    i.style.bottom = '0';
    i.style.left = '0';
    i.style.right = '0';
    // i.style.width = '50%';
    i.style.height = '50%';
    i.style.margin = 'auto 0px';
    i.src = 'https://www.google.com/s2/favicons?domain=' + query.replace(/^.*?\/\/(.+?\..+?)\/.*/i, '$1');
    d.appendChild(i);

    var a = document.createElement('a');
    a.style.display = 'table-cell';
    a.style["vertical-align"] = 'middle';
    a.style["padding-left"] = Math.ceil(fontSize*1.25)+'px';//i.offsetWidth + 5;
    a.style['font-size'] = fontSize+'px';
    a.style.color = '#086081';
    a.style.width = 'auto';
    a.setAttribute('target', '_blank'); // Open in new tab
    a.setAttribute('href', query);
    a.text = query;
    d.appendChild(a);

    linksList.push(a);
  });

  var enterKey = 13, escKey = 27;

  var onKeyPress = function(linksList, e) {
    e = e || window.event;

    var ctrlDown = e.ctrlKey || e.metaKey; // Mac support

    var query = searchField.value;

    if (e.keyCode == escKey) { // Escape
    } else if (e.keyCode == enterKey) {
      linksList.forEach(function(link, index) {link.click();});
    } else {
      linksList.forEach(function(link, index) {
        var ref = queriesList[index].replace('%s', query);
        link.text = ref;
        link.href = ref;
      });
    }
  };

  // searchField.onkeydown = function(e){onKeyPress(linksList, e);};
  // searchField.onkeyup = function(e){onKeyPress(linksList, e);};

  var eventList = ['keydown', 'keyup', 'change'];
  var inputList = [searchField];

  inputList.forEach(function(input){
    eventList.forEach(function(event){
      input.addEventListener(event,function(){onKeyPress(linksList, event);},false);
    });
  });
})();
