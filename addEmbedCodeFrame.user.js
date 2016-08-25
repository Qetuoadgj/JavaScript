// ==UserScript==
// @name         addEmbedCodeFrame
// @version      1.2.4
// @description  Pure JavaScript version.
// @author       Ægir
// @match        none
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/addEmbedCodeFrame.user.js
// ==/UserScript==

// DEFAULT GLOBAL FUNCTIONS
// ====================================================================================================================
function getElementComputedStyle(elementObject, propertyName) {return window.getComputedStyle(elementObject, null).getPropertyValue(propertyName);}
String.prototype.Capitalize = function() {
  function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
  return this.split(' ').map(capFirst).join(' ');
};
function waitForElement(elementSelector, attributeName, funcToRun, cycleDelay, maxTries, parentDocument) {
  if (funcToRun && (typeof funcToRun).toLowerCase() == "function") {
    parentDocument = parentDocument || document;
    cycleDelay = cycleDelay || 10; maxTries = maxTries || 100; var cycleCount = 0, keepRun = true; var element, value;
    setTimeout(function waitForElementCycle() {
      if (maxTries) {keepRun = (cycleCount < maxTries);}
      if (keepRun) {
        element = parentDocument.querySelector(elementSelector);
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
function getAttributeInIframe(iframe, innerElementSelector, attribute) {
  if (iframe) {
    var innerDoc, innerElement, result;
    innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (innerDoc) innerElement = innerDoc.querySelector(innerElementSelector);
    if (innerElement) result = innerElement.getAttribute(attribute);
    return result;
  }
}
String.prototype.regExp = function() {
  // return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  var string = this.replace(/[.\/]/g, "\\$&");
  string = string.replace(/\*/g, ".*");
  return string;
};
String.prototype.matchLink = function(link, flags) {
  flags = flags || '';
  link = link.replace(/[.\/]/g, "\\$&");
  link = link.replace(/\*/g, ".*");
  var re = new RegExp(link, flags);
  return this.match(re);
};
String.prototype.replaceAll = function(find, replace) {
  var str = this;
  while (str.indexOf(find) > -1) {
    str = str.replace(find, replace);
  }
  return str;
};
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number]: match;
  });
};
Element.prototype.autoHeight = function(fixedHeight) {
  var h = this.scrollHeight + 'px';
  this.style.height = h;
  if (fixedHeight) this.style.maxHeight = h;
};
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
var textAreaAutoHeight = false, textAreaFixedHeight = false;
var embedCodeTextRefresh = true;
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

  if (!embedCodeText || embedCodeTextRefresh) {
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

  var textArea = parentDocument.createElement('textarea');
  textArea.setAttribute('id', (embedCodeFrame.getAttribute('id') || '') + '_TextArea');
  textArea.style.display = 'block';
  textArea.style.border = 'none';
  textArea.style['background-color'] = 'transparent';
  textArea.style.width = '100%';
  textArea.style['max-width'] = '100%';
  textArea.style.rows = '2';
  textArea.style.overflow = 'hidden';
  textArea.style['font-size'] = '12px';
  textArea.style.color = 'grey';
  textArea.setAttribute('readonly', 'readonly');
  textArea.setAttribute('onclick', 'this.focus(); this.select();');
  textArea.value = embedCodeText;
  embedCodeFrame.appendChild(textArea);
  if (textAreaAutoHeight) {
    textArea.autoHeight(textAreaFixedHeight);
    // textArea.addEventListener("resize", textArea.autoHeight(textAreaFixedHeight));
  }

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
    posters = posters || []; // global value
    var index; for (index = 0; index < posters.length; ++index) {
      if (embedCodePoster.naturalHeight === 0 || embedCodePoster.naturalWidth === 0) {
        embedCodePoster.setAttribute('src', posters[index]);
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
  var textArea = oldEmbedCodeFrame.querySelector('textarea');
  var onKeyDown = function(e) {
    e = e || window.event;
    var cKey = 67;
    var ctrlDown = e.ctrlKey||e.metaKey; // Mac support

    // var targetType = e.target.tagName.toLowerCase();
    if (oldEmbedCodeFrame && ctrlDown && e.keyCode == cKey) {
      textArea.select(); document.execCommand('copy');
      if (preventDefault) e.preventDefault();
    }
  };
  document.addEventListener("keydown", function(e){onKeyDown(e);}, false);
}
// ====================================================================================================================
