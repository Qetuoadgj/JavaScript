// ==UserScript==
// @name         addEmbedCodeFrame
// @version      0.1
// @description  Pure JavaScript version.
// @author       Ægir
// @match        none
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...


  // GLOBAL FUNCTIONS
  function auto_grow(element) {element.style.height = "5px"; element.style.height = element.scrollHeight - 5 + "px";}

  String.prototype.Capitalize = function() {
    function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
    return this.split(' ').map(capFirst).join(' ');
  };

  function waitForElement(elementSelector, attributeName, funcToRun, cycleDelay, maxTries) {
    if (funcToRun && (typeof funcToRun).toLowerCase() == "function") {
      cycleDelay = cycleDelay || 10; maxTries = maxTries || 100; // default values
      var count = 0; setTimeout(function runCycle() {
        if (count < maxTries) {
          count += 1; var element = document.querySelector(elementSelector);
          if (attributeName) {
            var value = element.getAttribute(attributeName);
            if (value) return funcToRun(); else setTimeout(runCycle, cycleDelay);
          } else {
            if (element) return funcToRun(); else setTimeout(runCycle, cycleDelay);
          }
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

  // GLOBAL VARIABLES
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;

  var createLink, createPoster, contentURL, posterURL, appendToFrame, appendPosition;
  var embedCodeFrame_Margin, embedCodeLink_Margin, embedCodeFrame_BackgroundColor;
  var contentTitle;

  // LOCAL FUNCTIONS
  function addEmbedCodeFrame() {
    var oldEmbedCodeFrame = document.getElementById("oldEmbedCodeFrame");
    if (oldEmbedCodeFrame) oldEmbedCodeFrame.remove();

    var embedCodeFrame_Margin, embedCodeLink_Margin, embedCodeFrame_BackgroundColor;
    /* var createLink = true, createPoster = true;

    var contentURL = document.querySelector('meta[itemprop="embedUrl"]').content;
    var posterURL = document.querySelector('span[itemprop="thumbnail"] > link').href;
    var appendToFrame = document.querySelector('div.player');
    var appendPosition = 'after';

    // embedCodeFrame_Margin = '0px 0px 10px 0px';
    // embedCodeLink_Margin = '5px 0px';
    // embedCodeFrame_BackgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');

    var contentTitle = pageTitle.replace(/^.{1} /i, '').Capitalize(); */

    var embedCodeText = '<div class="thumbnail"';
    if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
    if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
    embedCodeText += ' content="'+contentURL+'"';
    if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
    embedCodeText += '></div>';

    var embedCodeFrame = document.createElement('div');
    embedCodeFrame.setAttribute('id', 'oldEmbedCodeFrame');
    embedCodeFrame.style.display = "block";
    embedCodeFrame.style['word-wrap'] = "break-word";
    if (embedCodeFrame_Margin) embedCodeFrame.style.margin = embedCodeFrame_Margin;
    if (embedCodeFrame_BackgroundColor) embedCodeFrame.style.backgroundColor = embedCodeFrame_BackgroundColor;
    appendFrame(embedCodeFrame, appendPosition, appendToFrame);

    var textFrame = document.createElement('textarea');
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
    embedCodeFrame.appendChild(textFrame); auto_grow(textFrame);

    if (createLink) {
      var embedCodeLink = document.createElement('a');
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
      var embedCodePoster = document.createElement('img');
      embedCodePoster.style.display = 'block';
      embedCodePoster.style['max-height'] = '120px';
      embedCodePoster.setAttribute('src', posterURL);
      embedCodeFrame.appendChild(embedCodePoster);
      embedCodePoster.addEventListener("click", addEmbedCodeFrame, false);
    }
  }

  function changeQualityButton(elementSelector) {
    var qualityButton =  document.querySelector(elementSelector);
    qualityButton.addEventListener("click", addEmbedCodeFrame, false);
  }
})();
