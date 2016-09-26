// ==UserScript==
// @name         JS.Functions.Lib
// @version      1.0.5
// @description  Pure JavaScript version.
// @author       Ægir
// @match        http://tampermonkey.net/*
// @exclude      http://*
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Libs
// ==/UserScript==


// GLOBAL FUNCTIONS
// ====================================================================================================================
function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}
function asArray(list) {return Array.prototype.slice.call(list);}
function commentElement(element) {var code = element.outerHTML; element.outerHTML = ('<!-- '+code+' -->');}

function addGlobalStyle(css, cssClass) {
  var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
  var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
  if (cssClass) style.setAttribute('class', cssClass);
  head.appendChild(style);
}

function waitForElement(elementSelector, attrName, funcToRun, delay, tries, iframeSelector, timerGroup) {
  if (funcToRun && (typeof funcToRun).toLowerCase() == "function") {
    delay = delay || 1000; //tries = tries || 5; // defaults
    var timerGroupIndex = timerGroup ? (timerGroup.length > 0 ? timerGroup.length : 0) : null; // get Index for current function timer
    var ID = Math.floor((Math.random() * 9999) + 1000); // random ID for debug
    var startIteration = function(iteration, delay, count, timerGroup, timerGroupIndex) {
      var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
      if (timerGroup) {timerGroup[timerGroupIndex] = timer;} // add timer to timerGroup
    };
    var clearTimers = function(timerGroup) {
      if (timerGroup) for (var i = 0; i < timerGroup.length; ++i) {clearTimeout(timerGroup[i]);}
    };
    var iteration = function(count) {
      var keepRun = tries ? (count < tries) : true;
      if (keepRun) {
        // alert('count: '+(count+1)+'\ntries: '+tries);
        var iframeElement = iframeSelector ? document.querySelector(iframeSelector) : null,
            parentDocument = iframeElement ? (iframeElement.contentDocument || iframeElement.contentWindow.document) : null,
            targetElementsArray = parentDocument ? parentDocument.querySelectorAll(elementSelector) : document.querySelectorAll(elementSelector),
            targetElement, attrValue, result
        ;
        for (var i = 0; i < targetElementsArray.length; ++i) {
          targetElement = targetElementsArray[i];
          attrValue = targetElement ? targetElement.getAttribute(attrName) : null;
          result = attrName ? attrValue : targetElement;
          if (result) break;
        }
        // alert(attrName ? (iframeSelector ? ('iframeElement: '+iframeElement+'\nparentDocument: '+parentDocument) : '' + '\ntargetElement: '+targetElement+'\nattrValue: '+attrValue) : 'iframeElement: '+iframeElement+'\nparentDocument: '+parentDocument+'\ntargetElement: '+targetElement);
        if (result) {
          clearTimers(timerGroup);
          return funcToRun();
        } else startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
        // console.log('ID: '+ID+', try: '+(count+1));
      }
    };
    iteration(0); // 1st iteration
  }
}

function waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup) {
  if ((funcToTest && (typeof funcToTest).toLowerCase() == "function") && (funcToRun && (typeof funcToRun).toLowerCase() == "function")) {
    delay = delay || 1000; //tries = tries || 5; // defaults
    var timerGroupIndex = timerGroup ? (timerGroup.length > 0 ? timerGroup.length : 0) : null; // get Index for current function timer
    var ID = Math.floor((Math.random() * 9999) + 1000); // random ID for debug
    var startIteration = function(iteration, delay, count, timerGroup, timerGroupIndex) {
      var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
      if (timerGroup) {timerGroup[timerGroupIndex] = timer;} // add timer to timerGroup
    };
    var clearTimers = function(timerGroup) {
      if (timerGroup) for (var i = 0; i < timerGroup.length; ++i) {clearTimeout(timerGroup[i]);}
    };
    var iteration = function(count) {
      var keepRun = tries ? (count < tries) : true;
      if (keepRun) {
        // alert('count: '+(count+1)+'\ntries: '+tries);
        var result = funcToTest();
        if (result) {clearTimers(timerGroup); return funcToRun();} else startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
        // console.log('ID: '+ID+', try: '+(count+1));
      }
    };
    iteration(0); // 1st iteration
  }
}

String.prototype.capitalize = function() {
  function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
  return this.split(' ').map(capFirst).join(' ');
};

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != 'undefined' ? args[number]: match;
  });
};

String.prototype.matchLink = function(link, flags) {
  link = link.replace(/[.\/]/g, "\\$&");
  link = link.replace(/\*/g, ".*");
  var re = new RegExp(link, flags);
  return this.match(re);
};

Element.prototype.isVisible = function() {return this.offsetWidth > 0 || this.offsetHeight > 0 || this.getClientRects().length > 0;};

Element.prototype.autoHeight = function(fixedHeight) {
  this.style.height = 0;
  var h = (this.scrollHeight > this.clientHeight) ? (this.scrollHeight) + "px" : "60px";
  this.style.height = h;
  if (fixedHeight) this.style.maxHeight = h;
};

Element.prototype.addClass = function(cssClass) {
  var re = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
  if (re.test(this.className)) return;
  this.className = (this.className + " " + cssClass).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
};

Element.prototype.removeClass = function(cssClass) {
  var re = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
  this.className = this.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
};

Element.prototype.getComputedProperty = function(propertyName) {return window.getComputedStyle(this, null).getPropertyValue(propertyName);};

Element.prototype.append = function(appendToFrame, appendPosition) {
  if (appendPosition == 'after') appendToFrame.parentNode.insertBefore(this, appendToFrame.nextSibling);
  else if (appendPosition == 'before') appendToFrame.parentNode.insertBefore(this, appendToFrame);
  else if (!appendPosition || appendPosition == 'append') appendToFrame.appendChild(this);
};

Element.prototype.nthParentNode = function(num) {
  var parent = this;
  for (var i = 0; i < num; ++i) {parent = parent.parentNode;}
  return parent;
};

var getCleanVideo = function(videoSrc, posterSrc) {
  var video = document.createElement('video');
  video.setAttribute('src', videoSrc);
  if (posterSrc) video.setAttribute('poster', posterSrc);
  video.setAttribute('controls', '');
  video.setAttribute('webkitallowfullscreen', '');
  video.setAttribute('mozallowfullscreen', '');
  video.setAttribute('allowfullscreen', '');
  document.documentElement.innerHTML = '';
  document.body.appendChild(video);
  addGlobalStyle('video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black;}');
  addGlobalStyle('body {margin: 0; background: black;}');
  return video;
};

function addMouseWheelAudioControl(media, step) {
  step = (step === 0) ? 0 : (step || 1);
  var fontSize = 72;

  var volumeText = document.createElement('div');
  volumeText.style.setProperty('color', 'yellow', 'important');
  volumeText.style['font-size'] = fontSize + 'px';
  volumeText.style.position = 'absolute';
  volumeText.style['z-index'] = 2147483647; // Always on TOP
  volumeText.style.top = '0px';
  volumeText.style.left = (fontSize/4) + 'px';
  media.parentNode.insertBefore(volumeText, media.nextSibling);

  var mouseWheelAudioHandler = function(e) {
    if (step !== 0) {
      // cross-browser wheel delta
      e = window.event || e; // old IE support
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      var vol =  Math.max(0, Math.min(100, media.volume*100 + delta*step));
      vol = Math.floor(vol/step)*step;
      vol = vol/100;
      media.volume = vol;
    }
    var volumeTextFade = function(fadeDelay) {
      fadeDelay = fadeDelay || 2000;
      var fadeDelaySeconds = Math.floor(fadeDelay/1000);
      function textFadeStart(show) {
        var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
        volumeText.style.opacity = show ? 1 : 0;
        volumeText.style.transition = transition;
        volumeText.style['-webkit-transition'] = transition; // Safari
      }
      textFadeStart(true);
      setTimeout(textFadeStart, fadeDelaySeconds*1000);
    };

    volumeTextFade(2000);
    volumeText.textContent = Math.round(media.volume * 100) > 0 ? Math.round(media.volume * 100) : 'Выкл.';

    e.preventDefault();
  };

  if (media.addEventListener) {
    media.addEventListener("mousewheel", mouseWheelAudioHandler, false); // IE9, Chrome, Safari, Opera
    media.addEventListener("DOMMouseScroll", mouseWheelAudioHandler, false); // Firefox
  } else {
    media.attachEvent("onmousewheel", mouseWheelAudioHandler); // IE 6/7/8
  }
}

function msgbox(title, message, time, width, height) {
  width = width || 250;
  height = height || 120;

  var padding = 10;
  var w = width - padding*2,
      h = height - padding*2;

  var centerX = function(e, fix) {
    var transform = e.style.transform;
    transform = transform + (fix ? 'translateY(0.5px) translateX(-50%)' : 'translateX(-50%)');
    e.style.left = 50 + '%';
    e.style['-ms-transform'] = transform;
    e.style['-moz-transform'] = transform;
    e.style['-webkit-transform'] = transform;
    e.style.transform = transform;
  };
  var centerY = function(e, fix) {
    var transform = e.style.transform;
    transform = transform + (fix ? 'translateX(0.5px) translateY(-50%)' : 'translateY(-50%)');
    e.style.top = 50 + '%';
    e.style['-ms-transform'] = transform;
    e.style['-moz-transform'] = transform;
    e.style['-webkit-transform'] = transform;
    e.style.transform = transform;
  };

  /*var fade = function(e, t) {
    t = (t < 2000) ? 2000 : t;

    d.style.transition = '';
    d.style['-webkit-transition'] = ''; // Safari
    d.style.opacity = 1;

    var fadeOut = function() {
      e.style.transition = 'opacity 2s';
      e.style['-webkit-transition'] = 'opacity 2s'; // Safari
      e.style.opacity = 0;
    };

    if (t > 2000) {
      setTimeout(fadeOut, 2000);
      setTimeout(function(){e.remove();}, t);
    } else {
      setTimeout(fadeOut, 500);
      setTimeout(function(){e.remove();}, t);
    }
  };*/

  var fade = function(element, fadeDelay) {
    fadeDelay = fadeDelay || 2000;
    var fadeDelaySeconds = Math.floor(fadeDelay/1000);
    function fadeStart(show) {
      var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
      element.style.opacity = show ? 1 : 0;
      element.style.transition = transition;
      element.style['-webkit-transition'] = transition; // Safari
      if (!show) setTimeout(function(){element.remove();}, fadeDelay);
    }
    fadeStart(true);
    setTimeout(fadeStart, fadeDelaySeconds*1000);
  };

  var d = document.createElement('div');
  d.style.display = 'table';
  d.style.position = 'fixed';
  d.style.right = 10 + 'px';
  d.style.bottom = 10 + 'px';
  d.style.maxWidth = 90 + '%';
  d.style.maxHeight = 90 + '%';
  // d.style.padding = padding + 'px';
  d.style.width = w + 'px';
  d.style.height = 'auto';
  d.style.minHeight = h + 'px';
  d.style.setProperty('background', 'white', 'important');
  d.style.border = '2px solid black';
  d.style.zIndex = 2147483647;
  document.body.appendChild(d);

  // d.style.top = 50 + 'px';
  // centerX(d);

  if (title) {
    var titleElement = document.createElement('p');
    titleElement.style.borderBottom = '1px solid black';
    titleElement.style.margin = 0;
    titleElement.style.padding = (padding/2) + 'px';
    titleElement.style.setProperty('background', '#4CAF50', 'important');
    titleElement.style.setProperty('color', 'white', 'important');
    titleElement.innerText = title;
    d.appendChild(titleElement);
  }

  if (message) {
    var messageElement = document.createElement('p');
    messageElement.style.margin = 0;
    messageElement.style.padding = (padding/2) + 'px';
    messageElement.style.display = 'table-row';
    messageElement.style.textAlign = 'center';
    messageElement.style.verticalAlign = 'middle';
    messageElement.style.setProperty('color', 'black', 'important');
    messageElement.innerText = message;
    d.appendChild(messageElement);
  }

  if (time) fade(d, time);
}

var addOpenInNewTabProperty = function(selector) {
  selector = selector || 'a';
  var linksArray = document.querySelectorAll(selector);
  // alert(selector+'\n'+linksArray.length);
  for (var i = 0; i < linksArray.length; ++i) {
    var link = linksArray[i], href = link.href;
    if (href) link.setAttribute('target', '_blank');
  }
};

var addPageControlKeys = function(prevPageSelector, nextPageSelector) {
  var previous_page_btn = document.querySelectorAll(prevPageSelector)[0];
  var next_page_btn = document.querySelectorAll(nextPageSelector)[0];
  var onKeyUp = function(e) {
    e = e || window.event;
    var lArrowKey = 37, rArrowKey = 39;
    var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
    if (e.keyCode == lArrowKey) previous_page_btn.click();
    else if (e.keyCode == rArrowKey) next_page_btn.click();
  };
  document.addEventListener("keyup", function(e){onKeyUp(e);}, false);
};
