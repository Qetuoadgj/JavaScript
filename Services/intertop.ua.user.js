// ==UserScript==
// @name         intertop.ua
// @icon         https://www.google.com/s2/favicons?domain=intertop.ua
// @version      1.0.00
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/intertop.ua.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @noframes
// @match        *://intertop.ua/ua/catalog/*/*/
//// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // ================================================================================
    const G_userLang = navigator.language || navigator.userLanguage;
    const G_userLangShort = G_userLang.substr(0, 2);
    document.documentElement.lang = G_userLangShort; // disable "Google Translate Page" prompt
    // ================================================================================
    const G_debugMode = 0;
    // ================================================================================
    const G_pageHost = location.hostname,
          G_pageURL = location.href,
          G_pageTitle = document.title,
          G_shortURL = (location.protocol + '//' + location.host + location.pathname).trim(),
          G_pageDomain = /*window.*/ location.host.replace(/.*\.(.*\..*)/, '$1')
    ;
    // ================================================================================
    function log(showAlert, ...args) {
        const string = args.join(' ').replace(/\n[\t ]/g, '\n');
        console.log(string);
        if (showAlert) alert(string);
    };
    // ================================================================================
    var G_funcToTest, G_funcOnSuccess, G_funcOnFail, G_funcResult, G_delay = 100, G_tries = 50, G_timerGroup = [];
    // --------------------------------------------------------------------------------
    function clearTimers(timerGroup = []) {for (const timer of timerGroup) {clearTimeout(timer);}};
    // --------------------------------------------------------------------------------
    function waitForCondition(funcToTest = false, funcOnSuccess = false, funcOnFail = false, delay = 50, tries = 5, timerGroup = []) {
        const funcText = funcToTest.toString().replace(/\n+[ ]{4}/g, '').replace(/[{][ ]{4,}/g, '{').replace(/[ ]{4,}[}]/g, '}');
        // --------------------------------------------------------------------------------
        if ((funcToTest && (typeof funcToTest).toLowerCase() == 'function' && funcOnSuccess && (typeof funcOnSuccess).toLowerCase() == 'function')) {
            const timerGroupIndex = timerGroup.length;
            // --------------------------------------------------------------------------------
            function startIteration(iteration, delay, count, timerGroup, timerGroupIndex) {
                const timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
                if (timerGroup) timerGroup[timerGroupIndex] = timer; // add timer to timerGroup
            };
            // --------------------------------------------------------------------------------
            // function clearTimers(timerGroup) {for (const timer of timerGroup) {clearTimeout(timer);}};
            // --------------------------------------------------------------------------------
            function iteration(count) {
                if (tries && (count < tries)) {
                    G_funcResult = funcToTest();
                    if (G_funcResult) {
                        const state = 'SUCCESS'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                        clearTimers(timerGroup);
                        funcOnSuccess();
                        return;
                    }
                    else {
                        const state = 'keepRun'; log(0, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                        startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
                    };
                }
                else {
                    const state = 'FAIL'; log(G_debugMode, location.href, '\niteration', count, ':', state, '(', G_funcResult, ')', '\n' + funcText);
                    if (funcOnFail && (typeof funcOnFail).toLowerCase() == 'function') {
                        funcOnFail();
                    };
                    // console.trace();
                };
            };
            // --------------------------------------------------------------------------------
            iteration(1); // launch 1st iteration
        };
        // --------------------------------------------------------------------------------
    };
    function waitForElement(elementSelector, attribute = null, funcOnSuccess = false, funcOnFail = false, delay = 50, tries = 5, timerGroup = []) {
        // --------------------------------------------------------------------------------
        function funcToTest() {
            console.log('elementSelector:', elementSelector, '\nattribute:', attribute);
            const elementsArray = document.querySelectorAll(elementSelector);
            let result;
            for (const element of elementsArray) {
                const value = element ? element[attribute] : null;
                result = attribute ? value : element;
                if (result && result !== '') {
                    G_funcResult = element;
                    break;
                };
            };
            if (!result) {
                // console.trace();
            };
            return result;
        };
        // --------------------------------------------------------------------------------
        waitForCondition(funcToTest, funcOnSuccess, funcOnFail, delay, tries, timerGroup);
    };
    // ================================================================================
    G_funcToTest = function(){return 1;};
    G_funcOnFail = function(){alert('G_funcOnFail');};
    G_funcOnSuccess = function(){alert(G_funcResult);};
    // ================================================================================
    const selector_reserve = '#report-availability';
    const selector_reserve_size = '#report-availability-size';
    const selector_add_to_cart = '#basket_add_preview';
    const selector_image = '.slick-track a > img[src]'
    // ================================================================================
    G_funcOnSuccess = function(){
        alert(G_funcResult);
    };
    G_funcOnFail = function(){
        alert('G_funcOnFail');
        location.reload();
    };
    // ================================================================================
    var G_doAutoF5 = GM_getValue(location.pathname, false) || false;
    setTimeout(function() {
        const str_autof5 = 'ru-RU uk-UA be-BY kk-KZ'.includes(G_userLang) ? 'Авто-F5' : 'Auto F5';
        const str_turn_on = 'ru-RU uk-UA be-BY kk-KZ'.includes(G_userLang) ? 'Включить' : 'Turn On';
        const str_turn_off = 'ru-RU uk-UA be-BY kk-KZ'.includes(G_userLang) ? 'Отключить' : 'Turn Off';
        // --------------------------------------------------------------------------------
        const str_menu_turn_on = `${str_turn_on} ${str_autof5} `;
        const str_menu_turn_off = ` ${str_turn_off} ${str_autof5}`;
        // --------------------------------------------------------------------------------
        let cmdOff, cmdOn, turnOn, turnOff;
        turnOn = function() {
            G_doAutoF5 = true;
            GM_setValue(location.pathname, G_doAutoF5);
            GM_unregisterMenuCommand(cmdOn);
            cmdOff = GM_registerMenuCommand(str_menu_turn_off, function(){turnOff();}, '');
            waitForElement(selector_add_to_cart, null, G_funcOnSuccess, G_funcOnFail, G_delay, G_tries, G_timerGroup);
        };
        turnOff = function() {
            G_doAutoF5 = false;
            GM_deleteValue(location.pathname);
            GM_unregisterMenuCommand(cmdOff);
            cmdOn = GM_registerMenuCommand(str_menu_turn_on, function(){turnOn();}, '');
            clearTimers(G_timerGroup);
        };
        if (G_doAutoF5 == true) {
            cmdOff = GM_registerMenuCommand(str_menu_turn_off, function(){turnOff();}, '');
        }
        else {
            cmdOn = GM_registerMenuCommand(str_menu_turn_on, function(){turnOn();}, '');
        };
    }, 1000);
    // ================================================================================
    if (G_doAutoF5) waitForElement(selector_add_to_cart, null, G_funcOnSuccess, G_funcOnFail, G_delay, G_tries, G_timerGroup);
    // ================================================================================
})();