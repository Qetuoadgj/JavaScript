// ==UserScript==
// @name         addEmbedCodeFrame
// @version      1.1.2
// @description  Pure JavaScript version.
// @author       Ægir
// @match        none
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/addEmbedCodeFrame.user.js
// ==/UserScript==

// DEFAULT GLOBAL FUNCTIONS
// ====================================================================================================================
function getElementComputedStyle(elementObject, propertyName) {return window.getComputedStyle(elementObject, null).getPropertyValue(propertyName);}
function auto_grow(element) {element.style.height = "5px"; element.style.height = element.scrollHeight - 5 + "px";}
String.prototype.Capitalize = function() {
  function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
  return this.split(' ').map(capFirst).join(' ');
};
function waitForElement(elementSelector, attributeName, funcToRun, cycleDelay, maxTries) {
  if (funcToRun && (typeof funcToRun).toLowerCase() == "function") {
    cycleDelay = cycleDelay || 10; maxTries = maxTries || 100; var cycleCount = 0, keepRun = true; var element, value;
    setTimeout(function waitForElementCycle() {
      if (maxTries) {keepRun = (cycleCount < maxTries);}
      if (keepRun) {
        element = document.querySelector(elementSelector);
        if (attributeName) {
          if (element) {value = element.getAttribute(attributeName);}
          if (value && value !== '') {return funcToRun();} else {setTimeout(waitForElementCycle, cycleDelay);}
        } else {
          if (element) {return funcToRun();} else {setTimeout(waitForElementCycle, cycleDelay);}
        }
        cycleCount += 1;
      }
    }, cycleDelay);
  }
}
function waitForCondition(condition, funcToRun, cycleDelay, maxTries) {
  if (funcToRun && (typeof funcToRun).toLowerCase() == "function") {
    cycleDelay = cycleDelay || 10; maxTries = maxTries || 100; var cycleCount = 0, keepRun = true; var element, value;
    setTimeout(function waitForConditionCycle() {
      if (maxTries) {keepRun = (cycleCount < maxTries);}
      if (keepRun) {
        if (condition()) {return funcToRun();} else {setTimeout(waitForConditionCycle, cycleDelay);}
        cycleCount += 1;
      }
    }, cycleDelay);
  }
}
function appendFrame(targetFrame, appendPosition, appendToFrame) {
  if (appendPosition == 'after') {
    appendToFrame.parentNode.insertBefore(targetFrame, appendToFrame.nextSibling);
  } else if (appendPosition == 'before') {
    appendToFrame.parentNode.insertBefore(targetFrame, appendToFrame);
  } else if (appendPosition == 'append') {
    appendToFrame.appendChild(targetFrame);
  }
}
function addGlobalStyle(css, cssClass) {
  var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
  var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
  if (cssClass) style.setAttribute('class', cssClass);
  head.appendChild(style);
}
function addClass(element, cssClass) {
  var re = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
  if (re.test(element.className)) return;
  element.className = (element.className + " " + cssClass).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
}
function removeClass(element, cssClass) {
  var re = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
  element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
}
function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}
function asArray(list) {return Array.prototype.slice.call(list);}
function isVisible(element) {return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;}
function commentElement(element) {var code = element.outerHTML; element.outerHTML = ('<!-- '+code+' -->');}
function nthParent(element, num) {
  if (!element) return false;
  var i; for (i = 0; i < num; ++i) {element = element.parentNode;}
  return element;
}
// ====================================================================================================================

// DEFAULT GLOBAL VARIABLES
// ====================================================================================================================
var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
var mainFunction = function(){alert('mainFunction() was not redefined!');};
var createLink = true, createPoster = true, contentURL, posterURL, appendToFrame, appendPosition;
var embedCodeFrame_Margin, embedCodeLink_Margin, embedCodeFrame_BackgroundColor;
var contentTitle;
var embedCodeText;
var posters = [];
// ====================================================================================================================

// DEFAULT LOCAL FUNCTIONS
// ====================================================================================================================
function addEmbedCodeFrame(parentDocument) {
  parentDocument = parentDocument || document;

  var oldEmbedCodeFrame = document.getElementById("oldEmbedCodeFrame");
  if (oldEmbedCodeFrame) oldEmbedCodeFrame.remove();

  // contentURL = document.querySelector('meta[itemprop="embedUrl"]').content;
  // posterURL = document.querySelector('span[itemprop="thumbnail"] > link').href;
  // appendToFrame = document.querySelector('div.player');
  // appendPosition = 'after';

  // embedCodeFrame_Margin = '0px 0px 10px 0px';
  // embedCodeLink_Margin = '5px 0px';
  // embedCodeFrame_BackgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');

  contentTitle = contentTitle || pageTitle.replace(/^.{1} /i, '').Capitalize();

  if (!embedCodeText) {
    embedCodeText = '<div class="thumbnail"';
    if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
    if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
    embedCodeText += ' content="'+contentURL+'"';
    if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
    embedCodeText += '></div>';
  }

  var embedCodeFrame = parentDocument.createElement('div');
  embedCodeFrame.setAttribute('id', 'oldEmbedCodeFrame');
  embedCodeFrame.style.display = "block";
  embedCodeFrame.style['word-wrap'] = "break-word";
  if (embedCodeFrame_Margin) embedCodeFrame.style.margin = embedCodeFrame_Margin;
  if (embedCodeFrame_BackgroundColor) embedCodeFrame.style.backgroundColor = embedCodeFrame_BackgroundColor;
  appendFrame(embedCodeFrame, appendPosition, appendToFrame);

  var textFrame = parentDocument.createElement('textarea');
  textFrame.style.display = 'block';
  textFrame.style.border = 'none';
  textFrame.style['background-color'] = 'transparent';
  textFrame.style.width = '100%';
  textFrame.style.rows = '2';
  textFrame.style.overflow = 'hidden';
  textFrame.style['font-size'] = '12px';
  textFrame.style.color = 'grey';
  textFrame.setAttribute('readonly', 'readonly');
  textFrame.setAttribute('onclick', 'this.focus(); this.select();');
  textFrame.value = embedCodeText;
  embedCodeFrame.appendChild(textFrame); // auto_grow(textFrame);

  if (createLink) {
    var embedCodeLink = parentDocument.createElement('a');
    if (embedCodeLink_Margin) {embedCodeLink.style.margin = embedCodeLink_Margin;}
    embedCodeLink.style['font-size'] = '12px';
    embedCodeLink.style.color = '#086081';
    embedCodeLink.style.width = 'auto';
    embedCodeLink.setAttribute('target', '_blank'); // Open in new tab
    embedCodeLink.setAttribute('href', contentURL);
    embedCodeLink.text = contentURL;
    embedCodeFrame.appendChild(embedCodeLink);
  }
  if (createPoster)  {
    var embedCodePoster = parentDocument.createElement('img');
    embedCodePoster.style.display = 'block';
    embedCodePoster.style['max-height'] = '120px';
    embedCodePoster.setAttribute('src', posterURL);
    embedCodeFrame.appendChild(embedCodePoster);
    embedCodePoster.addEventListener("click", mainFunction, false);
    var index; for (index = 0; index < posters.length; ++index) {
      if (embedCodePoster.naturalHeight === 0 || embedCodePoster.naturalWidth === 0) {
        embedCodePoster.setAttribute('src', options[index]);
      }
    }
  }
}
function changeQualityButton(elementSelector, parentDocument) {
  parentDocument = parentDocument || document;
  var qualityButton = parentDocument.querySelector(elementSelector);
  qualityButton.addEventListener("click", mainFunction, false);
}
function addKeyComboCtrlC(preventDefault) {
  var oldEmbedCodeFrame = document.getElementById("oldEmbedCodeFrame");
  var textFrame = oldEmbedCodeFrame.querySelector('textarea');
  var onKeyDown = function(e) {
    e = e || window.event;
    var cKey = 67;
    var ctrlDown = e.ctrlKey||e.metaKey; // Mac support

    // var targetType = e.target.tagName.toLowerCase();
    if (oldEmbedCodeFrame && ctrlDown && e.keyCode == cKey) {
      textFrame.select(); document.execCommand('copy');
      if (preventDefault) e.preventDefault();
    }
  };
  document.addEventListener("keydown", function(e){onKeyDown(e);}, false);
}
// ====================================================================================================================
