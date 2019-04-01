// ==UserScript==
// @name         cdnapponline
// @icon         https://www.google.com/s2/favicons?domain=hdrezka.ag
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/cdnapponline.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-end
// @match        http://*/*
// @match        https://*/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // ================================================================================
    var G_pageHost = location.hostname,
        G_pageURL = location.href,
        G_pageTitle = document.title,
        G_shortURL = (location.protocol + '//' + location.host + location.pathname).trim(),
        G_pageDomain = /*window.*/ location.host.replace(/.*\.(.*\..*)/, '$1')
    ;
    // ================================================================================
    var G_debugMode = 0; function log(showAlert, ...args) {
        // console.log(args);
        var string = args.join(' ').replace(/\n[\t ]/g, '\n');
        console.log(string);
        if (showAlert) alert(string);
    }
    // ================================================================================
    var G_funcToTest, G_funcToRun, G_funcResult, G_delay = 100, G_tries = 50*10*2, G_timerGroup = [];
    function waitForCondition(funcToTest = false, funcToRun = false, delay = 50, tries = 5, timerGroup = []) {
        // --------------------------------------------------------------------------------
        if ((funcToTest && (typeof funcToTest).toLowerCase() == 'function' && funcToRun && (typeof funcToRun).toLowerCase() == 'function')) {
            var timerGroupIndex = timerGroup.length;
            // --------------------------------------------------------------------------------
            function startIteration(iteration, delay, count, timerGroup, timerGroupIndex) {
                var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
                if (timerGroup) timerGroup[timerGroupIndex] = timer; // add timer to timerGroup
            };
            // --------------------------------------------------------------------------------
            function clearTimers(timerGroup) {for (var timer of timerGroup) {clearTimeout(timer);}};
            // --------------------------------------------------------------------------------
            function iteration(count) {
                var state;
                if (tries && (count < tries)) {
                    /*var*/ G_funcResult = funcToTest();
                    if (G_funcResult) {
                        state = 'SUCCESS'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
                        clearTimers(timerGroup);
                        funcToRun();
                        return;
                    }
                    else {
                        state = 'keepRun'; log(0, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
                        startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
                    }
                }
                else {
                    state = 'FAIL'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')');
                    // console.trace();
                }
            };
            // --------------------------------------------------------------------------------
            iteration(1); // launch 1st iteration
        }
        // --------------------------------------------------------------------------------
    };
    function waitForElement(elementSelector, attribute, funcToRun, delay, tries, timerGroup) {
        // --------------------------------------------------------------------------------
        var funcToTest = function () {
            console.log('elementSelector:', elementSelector, '\nattribute:', attribute);
            var result, elementsArray = document.querySelectorAll(elementSelector);
            for (var element of elementsArray) {
                var value = element ? element.getAttribute(attribute) : null;
                result = attribute ? value : element;
                if (result && result !== '') {
                    G_funcResult = element;
                    break;
                }
            }
            if (!result) {
                // console.trace();
            }
            return result;
        };
        // --------------------------------------------------------------------------------
        waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup);
    };
    // ================================================================================
    G_funcToTest = function(){return 1;};
    G_funcToRun = function(){alert(G_funcResult);};
    // waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
    // waitForElement('video > source[src^="http"], video[src^="http"], video', 'src', G_funcToRun, G_delay, G_tries, G_timerGroup);
    // ================================================================================
    var G_matchedLink; String.prototype.matchLink = function (link, flags) {
        var result = this.match(new RegExp(link.replace(/[.\/]/g, "\\$&").replace(/\*/g, ".*"), flags));
        if (result) G_matchedLink = 'matchLink: ' + link + (flags ? ' ; flags: ' + flags : '');
        return result;
    };
    // ================================================================================
    // if (window.top == window.self) return; //don't run on top window
    // ================================================================================
    // alert(G_pageURL); console.log(G_pageURL);
    if (
        G_pageURL.matchLink('http://mastarti.com/*/iframe[?]*') // http://mastarti.com/serial/1edae78634e50101b795f7be17f5f706/iframe?episode=1&nocontrols=1&pid_b2cb5260=6c6cba9e&ref=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWZfaG9zdCI6ImhkcmV6a2EuYWciLCJyZXFfaG9zdCI6InMxLmNkbmFwcG9ubGluZS5jb20iLCJleHAiOjE1NTQyMTUwNjUsInRva2VuIjoiMWVkYWU3ODYzNGU1MDEwMWI3OTVmN2JlMTdmNWY3MDYifQ.5nyal-V47bRyKh50cc6oGXBS8OsEimdJply2wCdrBZs&season=1
    ) {
        G_funcToTest = function () {
            if (unsafeWindow.player && unsafeWindow.player !== "undefined") {
                if (unsafeWindow.player.settings) {
                    if (unsafeWindow.player.settings.manifests) {
                        if (unsafeWindow.player.settings.manifests.mp4) {
                            return unsafeWindow.player.settings.manifests.mp4;
                        }
                        else if (unsafeWindow.player.settings.manifests.hls) {
                            return unsafeWindow.player.settings.manifests.hls;
                        };
                    };
                };
            };
        };
        G_funcToRun = function(){
            // /*alert(G_funcResult);*/ location.href = G_funcResult
            // alert(G_funcResult);
            window.stop();
            location.href = 'chrome-extension://emnphkkblegpebimobpbekeedfgemhof/player.html#' + G_funcResult;
        };
        // waitForElement('video > source[src^="http"], video[src^="http"], video', null, G_funcToRun, G_delay, G_tries, G_timerGroup);
        waitForCondition(G_funcToTest, G_funcToRun, G_delay, G_tries, G_timerGroup);
    }
})();
