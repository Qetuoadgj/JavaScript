// ==UserScript==
// @name         youtube.com
// @version      1.0.1
// @description  Pure JavaScript version.
// @author       Ægir
// @match        https://www.youtube.com/watch?*
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/youtube.com.user.js
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function WaitForElement(elementSelector, execFunction, delay, tries) {
    delay = delay || 10; tries = tries || 100; var cycle = 0; var keepRun = true;
    setTimeout(function WaitForElementCycle() {
      if (tries) {keepRun = (cycle < tries);}
      if (keepRun) {
        // alert('cycle = ' + cycle);
        if ( document.querySelector(elementSelector) ) {
          if (execFunction && (typeof execFunction == "function")) {return execFunction();}
        } else {
          setTimeout(WaitForElementCycle, delay);
        }
        cycle += 1;
      }
    }, delay);
  }

  function WaitForAttribute(elementSelector, attributeName, execFunction, delay, tries) {
    delay = delay || 10; tries = tries || 100; var cycle = 0; var keepRun = true; var value;
    setTimeout(function WaitForAttributeCycle() {
      if (tries) {keepRun = (cycle < tries);}
      if (keepRun) {
        // alert('cycle = ' + cycle);
        if ( document.querySelector(elementSelector) ){value = document.querySelector(elementSelector).getAttribute(attributeName);}
        if ( value && value !== '' ) {
          if (execFunction && (typeof execFunction == "function")) {return execFunction();}
        } else {
          setTimeout(WaitForAttributeCycle, delay);
        }
        cycle += 1;
      }
    }, delay);
  }

  String.prototype.Capitalize = function() {
    return this.split(' ').map(capFirst).join(' ');
    function capFirst(str) {
      return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);
    }
  };

  function ShowEmbedCode_MainFunction() {
    var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
    var targetFrame, thumbnail, content, embedFrameMargin, embedLinkMargin, embedFrameBackgroundColor;
    var createImage = true, createLink = true;

    targetFrame = document.querySelector('#watch-description');
    thumbnail = document.querySelector('meta[property="og:image"]').getAttribute('content'); thumbnail = thumbnail.replace(/(.*)\/.*default.jpg$/i, '$1/mqdefault.jpg');
    content = document.querySelector('meta[property="og:video:url"]').getAttribute('content'); content = content.replace(/(.*)[?].*/i, '$1') + '?start=0';
    pageURL = pageURL.replace(/[?].*&?(v=.+?)(&.*)?$/i, '?$1');

    // embedFrameMargin = '0px 9px 0px 9px';
    // embedLinkMargin = '5px 0px';
    // embedFrameBackgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');

    if (targetFrame) {
      var title = pageTitle.replace(/^.{1} /i, '').Capitalize();
      var oldEmbedFrame = document.getElementById("ShowEmbedCode_Frame"); if (oldEmbedFrame) {oldEmbedFrame.remove();}
      var embedCode = '<img class="thumbnail" title="'+title+'" image="'+thumbnail+'" content="'+content+'" url="'+pageURL+'">';

      var embedFrame = document.createElement('div');
      embedFrame.setAttribute('id', 'ShowEmbedCode_Frame');
      embedFrame.style.display = "block"; embedFrame.style['word-wrap'] = "break-word";
      if (embedFrameMargin) {embedFrame.style.margin = embedFrameMargin;}
      if (embedFrameBackgroundColor) {embedFrame.style.backgroundColor = embedFrameBackgroundColor;}
      targetFrame.parentNode.insertBefore(embedFrame, targetFrame);

      var textFrame = document.createElement('textarea');
      textFrame.style.display = 'block'; textFrame.style.border = 'none';
      textFrame.style['background-color'] = 'transparent'; textFrame.style.width = '100%';
      textFrame.style.rows = '2'; textFrame.style.overflow = 'hidden';
      textFrame.style['font-size'] = '12px'; textFrame.style.color = 'grey';
      textFrame.setAttribute('readonly', 'readonly'); textFrame.setAttribute('onclick', 'this.focus(); this.select();');
      textFrame.value = embedCode;
      embedFrame.appendChild(textFrame);

      if (createLink) {
        var embedLink = document.createElement('a');
        // embedLink.style.display = 'table';
        if (embedLinkMargin) {embedLink.style.margin = embedLinkMargin;}
        embedLink.style['font-size'] = '12px'; embedLink.style.color = '#086081'; embedLink.style.width = 'auto';
        embedLink.setAttribute('target', '_blank'); // Open in new tab
        embedLink.setAttribute('href', content);
        embedLink.text = content;
        embedFrame.appendChild(embedLink);
      }

      if (createImage)  {
        var embedImage = document.createElement('img');
        embedImage.style.display = 'block'; embedImage.style['max-height'] = '120px'; embedImage.setAttribute('src', thumbnail);
        embedFrame.appendChild(embedImage);
        embedImage.addEventListener("click", ShowEmbedCode_MainFunction, false);
      }

      // var qualityButton = document.querySelector('div.jw-group.jw-controlbar-right-group.jw-reset'); qualityButton.addEventListener("click", ShowEmbedCode_MainFunction, false);
      // qualityButton = document.querySelector('nav > ul.right_set'); qualityButton.addEventListener("click", ShowEmbedCode_MainFunction, false);
    }
  }

  function ClipConverterFixStyle() {
    // document.querySelector('span#clipconverter > a > button').setAttribute('class', 'yt-uix-button addto-button yt-uix-tooltip');
    var buttons = document.querySelectorAll('span#clipconverter > a > button'), i;
    for (i = 0; i < buttons.length; ++i) {
      var btn = buttons[i];
      var span = btn.querySelector('span'); if (!span) {
        var text = btn.innerHTML;
        btn.innerHTML = '<span class="yt-uix-button-content"><strong>' + text + '</strong></span>';
      }
      btn.setAttribute('class', 'yt-uix-button yt-uix-button-opacity yt-uix-tooltip');
    }
  }

  WaitForAttribute('meta[property="og:video:url"]', 'content', ShowEmbedCode_MainFunction, 1000, 30);
  // WaitForElement('span#clipconverter > a > button', ClipConverterFixStyle, 1000, 30);
  ClipConverterFixStyle();
})();
