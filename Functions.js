// ==UserScript==
// @name         Functions
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Functions.js
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
    delay = delay || 1000; tries = tries || 5; // defaults
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
            targetElement = parentDocument ? parentDocument.querySelector(elementSelector) : document.querySelector(elementSelector),
            attrValue = targetElement ? targetElement.getAttribute(attrName) : null,
            result = attrName ? attrValue : targetElement;
        // alert(attrName ? (iframeSelector ? ('iframeElement: '+iframeElement+'\nparentDocument: '+parentDocument) : '' + '\ntargetElement: '+targetElement+'\nattrValue: '+attrValue) : 'iframeElement: '+iframeElement+'\nparentDocument: '+parentDocument+'\ntargetElement: '+targetElement);
        if (result) {clearTimers(timerGroup); return funcToRun();} else startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
        // console.log('ID: '+ID+', try: '+(count+1));
      }
    };
    iteration(0); // 1st iteration
  }
}

function waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup) {
  if ((funcToTest && (typeof funcToTest).toLowerCase() == "function") && (funcToRun && (typeof funcToRun).toLowerCase() == "function")) {
    delay = delay || 1000; tries = tries || 5; // defaults
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
  var h = this.scrollHeight + 'px';
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
  var parent;
  for (var i = 0; i < num; ++i) {
    parent = parent || this;
    parent = parent.parentNode;
  }
  return parent;
};