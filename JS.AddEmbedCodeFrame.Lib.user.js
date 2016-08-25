// ==UserScript==
// @name         JS.AddEmbedCodeFrame.Lib
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/JS.AddEmbedCodeFrame.Lib.user.js
// ==/UserScript==

// DEFAULT GLOBAL VARIABLES
// ====================================================================================================================
var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
var createLink = true, createPoster = true, contentURL, posterURL, appendToFrame, appendPosition;
var embedCodeFrame_Margin, embedCodeLink_Margin, embedCodeFrame_BackgroundColor;
var contentTitle;
var embedCodeText;
var posters = [];
var qualityButtons = [];
var textAreaAutoHeight = false, textAreaFixedHeight = false;
var embedCodeTextRefresh = true;

// DEFAULT GLOBAL FUNCTION
// ====================================================================================================================
function addEmbedCodeFrame(callerFunction, parentDocument) {
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

  contentTitle = contentTitle || pageTitle.replace(/^.{1} /i, '').capitalize();

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
  embedCodeFrame.append(appendToFrame, appendPosition);

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
    embedCodePoster.addEventListener("click", callerFunction, false);
    posters = posters || []; // global value
    for (var index = 0; index < posters.length; index++) {
      if (embedCodePoster.naturalHeight === 0 || embedCodePoster.naturalWidth === 0) {
        embedCodePoster.setAttribute('src', posters[index]);
      }
    }
  }

  qualityButtons = qualityButtons || []; // global value
  qualityButtons.forEach(function(item, index, array){
    if (item) item.addEventListener("click", callerFunction, false);
  });
}

/*function changeQualityButton(buttonSelector, callerFunction, parentDocument) {
  if (!buttonSelector) return;
  parentDocument = parentDocument || document;
  var qualityButton = parentDocument.querySelector(buttonSelector);
  qualityButton.addEventListener("click", callerFunction, false);
}*/

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

function getHDButton(menuElements, hdOptions) {
  var isHD = false;
  for (var index = 0; index < menuElements.length; index++) {
    if (!isHD) {
      var menuElement = menuElements[index];
      var elementText = menuElement.innerHTML;
      isHD = (hdOptions.indexOf(elementText) != -1);
      // alert('elementText: '+elementText+'\nisHD: '+isHD);
      if (isHD) return [menuElement, elementText, index];
    }
  }
}

function pressHDButton(btnToClick, checkFunc, delay, tries) {
  if (checkFunc && (typeof checkFunc).toLowerCase() == "function") {
    delay = delay || 1000; tries = tries || 5; // defaults
    var iteration = function(count) {
      var keepRun = tries ? (count < tries) : true;
      if (keepRun) {
        // alert('count: '+(count+1)+'\ntries: '+tries);
        btnToClick.click();
        var result = checkFunc();
        // alert('result: '+result);
        if (result) return; else setTimeout(iteration, delay, ++count);
      }
    };
    var init = setTimeout(iteration, delay, 0);
  }
}
