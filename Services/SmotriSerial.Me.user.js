// ==UserScript==
// @name         SmotriSerial.Me
// @icon         https://www.google.com/s2/favicons?domain=smotriserial.me
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/SmotriSerial.Me.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-end
// @noframes
// @match        *://smotriserial.me/serial/*.html
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var funcToTest, funcToRun, delay = 50, tries = 100, timerGroup = [], funcResult,
        waitForCondition = function (funcToTest, funcToRun, delay, tries, timerGroup) {
            if ((funcToTest && (typeof funcToTest).toLowerCase() == 'function') && (funcToRun && (typeof funcToRun).toLowerCase() == 'function')) {
                // console.log('funcToTest: '+funcToTest.toString());
                delay = delay || 1000; // defaults
                timerGroup = timerGroup || [];
                var timerGroupIndex = timerGroup ? (timerGroup.length > 0 ? timerGroup.length : 0) : null; // get Index for current function timer
                var ID = Math.floor((Math.random() * 9999) + 1000); // random ID for debug
                var startIteration = function (iteration, delay, count, timerGroup, timerGroupIndex) {
                    var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
                    if (timerGroup) { timerGroup[timerGroupIndex] = timer; } // add timer to timerGroup
                };
                var clearTimers = function (timerGroup) {
                    if (timerGroup) for (var i = 0; i < timerGroup.length; ++i) { clearTimeout(timerGroup[i]); if (i == timerGroup.length - 1) { timerGroup = []; } }
                };
                var iteration = function (count) {
                    var keepRun = tries ? (count <= tries) : true;
                    if (keepRun) {
                        var result = funcToTest();
                        console.log('iteration: ', count);
                        if (result) { clearTimers(timerGroup); return funcToRun(); }
                        else startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
                    }
                };
                iteration(1); // 1st iteration
            }
        },
        waitForElement = function (elementSelector, attribute, funcToRun, delay, tries, timerGroup) {
            var funcToTest = function () {
                console.log('elementSelector: ' + elementSelector + ', attribute: ' + attribute);
                var result, elementsArray = document.querySelectorAll(elementSelector);
                for (var i = 0; i < elementsArray.length; ++i) {
                    var element = elementsArray[i];
                    var value = element ? element.getAttribute(attribute) : null;
                    result = attribute ? value : element;
                    if (result && result !== '') {
                        funcResult = element;
                        break;
                    }
                }
                return result;
            };
            waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
        }
    ;
    Element.prototype.nthParentNode = function(num) {
        var parent = this;
        for (var i = 0; i < num; ++i) {parent = parent.parentNode;}
        return parent;
    };
    function addGlobalStyle(css, cssClass) {
        var head = document.getElementsByTagName('head')[0]; if (!head) { return; }
        var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
    }
    function hideLogo(logoSelector, logoParentsCount) {
        var logoImage = document.querySelector(logoSelector);
        if (logoImage) {
            var mainParent = logoImage.nthParentNode(logoParentsCount);
            if (mainParent) mainParent.remove();
        }
    }
    function nightMode(className, on) {
        var css = 'body, div, li, ul, a , h, h3, button { background:black !important; /* color:grey !important; */ };';
        var style = document.querySelector('head > style.'+className);
        if (style) style.remove();
        if (on) addGlobalStyle(css, className);
    }
    var nightModeEnable = 1;
    function initNightMode() {
        // GM_setValue("nightModeEnable", nightModeEnable);
        nightMode('__nightMode', nightModeEnable);
        //
        var check_button = document.createElement('button');
        document.body.appendChild(check_button);
        check_button.id = 'check_button';
        check_button.style.display = 'block';
        check_button.style.position = 'fixed';
        check_button.style.top = '0px'; check_button.style.right = '0px';
        check_button.style.height = 'auto'; check_button.style.width = 'width';
        check_button.style.margin = '7px 7px';
        check_button.style.padding = '10px';
        check_button.style.background = '#19373a';
        check_button.style.borderWidth = '1px';
        check_button.style.borderColor = 'greenyellow';
        check_button.style.borderStyle = 'solid';
        check_button.style.color = 'cyan';
        check_button.style.fontSize = '9px';
        check_button.innerText = 'Ночной режим';
        check_button.addEventListener('click', function(e){
            nightModeEnable = !nightModeEnable;
            // GM_setValue("nightModeEnable", nightModeEnable);
            nightMode('__nightMode', nightModeEnable);
        }, false);
    }
    initNightMode();
    //
    var junk = document.querySelector('.clearfix.share');
    if (junk) junk.remove();
    //
    waitForElement(
        'pjsdiv > img[src="http://smotriserial.me/images/logo.png"]', 'src',
        function() {hideLogo('pjsdiv > img[src="http://smotriserial.me/images/logo.png"]', 2);},
        100, tries, timerGroup
    );
})();
