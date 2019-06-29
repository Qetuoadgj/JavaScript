// ==UserScript==
// @name         makeup.com.ua
// @icon         https://www.google.com/s2/favicons?domain=makeup.com.ua
// @namespace    https://makeup.com.ua
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Aegir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/makeup.com.ua.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-start
// @noframes
// @match        *://makeup.com.ua/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function shiftKeyIsDown() {return !!window.event.shiftKey;}
    function ctrlKeyIsDown() {return !!(window.event.ctrlKey || window.event.metaKey);}
    function altKeyIsDown() {return !!window.event.altKey;}

    function addMouseWheelHandler(element) {
        var mouseScroll = (e) => {
            if (!shiftKeyIsDown()) return;
            // cross-browser wheel delta
            e = window.event || e; // old IE support
            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            let inc = document.querySelector('.product__button-increase:hover');
            let dec = document.querySelector('.product__button-decrease:hover');
            let counter = document.querySelector('input[name="count[]"]:hover');
            let main = (
                inc ? inc.parentElement.parentElement :
                dec ? dec.parentElement.parentElement :
                counter ? counter.parentElement.parentElement :
                null
            );
            let hovered = inc || dec || counter;
            if (main && hovered) {
                if (delta > 0) {
                    inc = main.querySelector('.product__button-increase');
                    if (inc) {
                        inc.click();
                    };
                } else if (delta < 0) {
                    dec = main.querySelector('.product__button-decrease');
                    if (dec) {
                        counter = main.querySelector('input[name="count[]"]');
                        if (counter) {
                            if (counter.value <= 1) return;
                        };
                        dec.click();
                    };
                };
            };
        };
        if (element.addEventListener) {
            element.addEventListener("mousewheel", mouseScroll, false); // IE9, Chrome, Safari, Opera
            element.addEventListener("DOMMouseScroll", mouseScroll, false); // Firefox
        } else {
            element.attachEvent("onmousewheel", mouseScroll); // IE 6/7/8
        };
    };
    addMouseWheelHandler(window);
})();