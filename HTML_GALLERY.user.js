// ==UserScript==
// @name         HTML GALLERY TEST (AJAX)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        file:///*/2.0.3.html
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...

  //GLOBAL FUNCTIONS
  function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}
  function isVisible(element) {return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;}
  function commentElement(element) {var code = element.outerHTML; element.outerHTML = ('<!-- '+code+' -->');}
  function copyToClipboard(element) {
    var code = element.outerHTML;
    var clipboard = document.createElement('textarea');
    clipboard.style.position = 'fixed'; clipboard.style.top = '50%'; clipboard.style.left = '50%'; clipboard.style.transform = 'translate(-50%, -50%)'; clipboard.style['z-index'] = 10;
    clipboard.style.width = '90%'; clipboard.style.height = '90%';
    document.body.appendChild(clipboard);
    clipboard.value = code; clipboard.select(); document.execCommand('copy');
    setTimeout(function(){clipboard.remove();}, 100);
  }

  function fixScale(element) {
    var W = element.offsetWidth, H = element.offsetHeight;
    if (W > (window.width * 0.9)) {element.style.width = '90%'; element.style.height = 'auto';}
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    // GLOBAL VARIABLES
    var spoilerButtonsArray = document.querySelectorAll('#galleries > .spoilertop');
    var spoilersArray = document.querySelectorAll('#previews > .spoilerbox');
    var thumbnailsArray = document.querySelectorAll('#previews > .spoilerbox > .thumbnail');
    var outputs = document.getElementById('content');
    var iframeOutput = outputs.querySelector('#content_iframe'), objectOutput = outputs.querySelector('#content_object'), imgOutput = outputs.querySelector('#content_img');
    var outputsArray = []; outputsArray.push(iframeOutput, objectOutput, imgOutput);
    var galleryList = [];
    var activeSpoiler, activeThumbnail, activeOutput;
    var backgroundsArray = document.querySelectorAll('.background');

    // DOCUMENT FUNCTIONS
    function buttonClicked(button, buttonsArray, unclick) {
      if (unclick) {forEach(buttonsArray, function(index, self) {self.style.removeProperty('opacity');});} else {
        forEach(buttonsArray, function(index, self) {self.style.opacity = '0.125';}); button.style.removeProperty('opacity');
      }
    }

    function resetContentOutputs() {
      iframeOutput.src = ''; objectOutput.data = ''; imgOutput.src = '';
      forEach(outputsArray, function(index, self) {self.style.removeProperty('display');});
      activeOutput = false; activeThumbnail = false;
    }

    function appendFlashVars(source) {
      if (source.indexOf('https://www.youtube.com/embed/') == '0') {
        var flashvars = [
          'autoplay=1',       // Enable Autoplay
          'hd=1',             // Watch in HD
          'iv_load_policy=3'  // Disable Annotations
        ];
        var existingVars = '';
        if (source.match(/[?].*/i)) {
          existingVars += source.replace(/.*[?](.*)/i, '$1'); source = source.replace(/(.*)[?].*/i, '$1');
          flashvars.push(existingVars);
        }
        source += '?';
        var i = 0; flashvars.forEach(function(flashvar) {
          if (i < flashvars.length - 1) {flashvars[i] += '&';}
          source += flashvars[i]; i += 1;
        });
      }
      return source;
    }

    function hideContent() {
      if (activeOutput) {
        resetContentOutputs();
        buttonClicked(false, thumbnailsArray, true);
      } else if (activeSpoiler) {
        activeSpoiler.style.removeProperty('display');
        buttonClicked(false, spoilerButtonsArray, true);
      }
    }

    function showContent(thisThumbnail, thumbnailsArray) {
      var output = thisThumbnail.getAttribute('output');
      var content = thisThumbnail.getAttribute('content'); content = appendFlashVars(content);
      if (!output && content.match(/\.(jpg|gif|png|bmp|tga|webp)$/i)) {output = 'img';} else {output = 'iframe';}
      buttonClicked(thisThumbnail, thumbnailsArray);
      var outputFrame = outputs.querySelector(output);
      var outputAttr = 'src'; if (output == 'object') outputAttr = 'data';
      var currentContent = outputFrame.getAttribute(outputAttr);
      var active = (currentContent == content);
      if (active) {buttonClicked(thisThumbnail, thumbnailsArray, true); resetContentOutputs();} else {
        resetContentOutputs();
        outputFrame.style.display = 'block'; outputFrame.setAttribute(outputAttr, content);
        activeThumbnail = thisThumbnail; activeOutput = outputFrame;
        if (activeOutput.tagName == 'img') fixScale(activeOutput);
      }
    }

    function createGalleryList(gallery) {
      var galleryList = [];
      var thumbnails = gallery.querySelectorAll('.thumbnail');
      forEach(thumbnails, function(index, self) {var content = self.getAttribute('content'); content = appendFlashVars(content); galleryList.push(content);});
      return galleryList;
    }

    function changeContent(galleryList, delta) {
      // var activeSpoiler; forEach(spoilersArray, function(index, self) {if (isVisible(self)) {activeSpoiler = self;}});
      // var activeOutput; forEach(outputsArray, function(index, self) {if (isVisible(self)) {activeOutput = self;}});
      if (activeOutput) {
        var activeContent = activeOutput.data || activeOutput.src;
        var galleryContent = galleryList[galleryList.indexOf(activeContent) + (delta || 1)] || galleryList[delta ? galleryList.length - 1 : 0];
        var activeThumbnailsArray = activeSpoiler.querySelectorAll('.thumbnail'); forEach(activeThumbnailsArray, function(index, self) {
          var content = self.getAttribute('content'); content = appendFlashVars(content);
          if (content == galleryContent && self !== activeThumbnail) {self.click();}
        });
      }
    }

    function showSpoiler(thisButton, spoiler) {
      var active = isVisible(spoiler);
      buttonClicked(thisButton, spoilerButtonsArray);
      forEach(spoilersArray, function(index, self) {self.style.removeProperty('display');});
      if (active) {buttonClicked(thisButton, spoilerButtonsArray, true); activeSpoiler = false;} else {
        spoiler.style.display = 'block';
        var activeThumbnails = spoiler.querySelectorAll('.thumbnail'); forEach(thumbnailsArray, function(index, self) {
          if (!self.src) {var image = self.getAttribute('image'); self.src = image; self.removeAttribute('image');}
        });
        galleryList = createGalleryList(spoiler);
        activeSpoiler = spoiler;
      }
    }

    document.onkeydown = function(e) {
      e = e || window.event;
      var ctrlKey = 17, vKey = 86, cKey = 67, delKey = 46, lArrowKey = 37, rArrowKey = 39, escKey = 27;
      var ctrlDown = e.ctrlKey||e.metaKey; // Mac support

      if (e.keyCode == escKey) { // Escape
        hideContent();
      } else if (e.keyCode == lArrowKey) {
        changeContent(galleryList,-1); // Left Arrow
      } else if (e.keyCode == rArrowKey) {
        changeContent(galleryList); // Right Arrow
      } else if (activeThumbnail && e.keyCode == delKey) { // Delete
        commentElement(activeThumbnail); changeContent(galleryList);
      } else if (activeSpoiler && ctrlDown && e.keyCode == cKey) { // Control + C
        copyToClipboard(activeSpoiler);
      }
    };

    forEach(spoilerButtonsArray, function(index, self) {
      var spoiler_id = self.getAttribute('spoiler'); var spoiler = document.getElementById(spoiler_id);
      if (spoiler) {self.addEventListener("click", function(){showSpoiler(self, spoiler);}, false);}
    });
    forEach(thumbnailsArray, function(index, self) {
      // if (!self.src) {var image = self.getAttribute('image'); self.src = image; self.removeAttribute('image');}
      self.addEventListener("click", function(){showContent(self, thumbnailsArray);}, false);
    });
    forEach(backgroundsArray, function(index, self) {
      self.addEventListener("click", function(){
        if (activeOutput) {resetContentOutputs(); buttonClicked(false, thumbnailsArray, true);}}, false);
    });
    imgOutput.addEventListener("click", hideContent, false);
  });
})();
