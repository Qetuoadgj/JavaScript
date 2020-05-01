// ==UserScript==
// @name         YouTube.Polymer.Disable.Plus
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.05
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Polymer.Disable.Plus.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-start
// @noframes
// @match        *://www.youtube.com/*
// @exclude      *://www.youtube.com/embed/*
// ==/UserScript==

// source: https://forum.vivaldi.net/topic/28065/%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-%D0%B1%D1%80%D0%B0%D1%83%D0%B7%D0%B5%D1%80%D0%B0-%D0%BF%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D1%8B-%D1%81-youtube/9
(function () {
    var getDesignCookie = function (cookie) {
        //Find existing preferences
        var prefs = cookie.split("; ").filter(function (v) {
            return v.indexOf("PREF=") === 0;
        })[0];
        //No preferences, return new ones with design setting
        if (!prefs) {
            console.log("prefs not set in cookie");
            document.cookie = "PREF=f6=8;domain=.youtube.com;path=/";
            window.setTimeout(location.reload.bind(location,true),100);
            return "PREF=f6=8";
        }
        //Process all settings
        var entries = prefs.substr(5).split('&');
        var set = false;
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].indexOf("f6=") === 0) {
                set = true;
                //Set the old design flag
                var value = +entries[i].substr(3);
                if ((value & 8) === 0) {
                    console.log("Activating old design and reloading...");
                    entries[i] = "f6=" + (value | 8);
                    window.setTimeout(location.reload.bind(location,true),100);
                }
                else{
                    console.log("Old design already active. Doing nothing");
                }
            }
        }
        //Design flag setting doesn't exists. Adding it instead
        if (!set) {
            console.log("Activating old design and reloading...");
            entries.push("f6=8");
            window.setTimeout(location.reload.bind(location,true),100);
        }
        //Build cookie
        return "PREF=" + entries.join('&');
    };
    //Update cookie
    document.cookie = getDesignCookie(document.cookie) + ";domain=.youtube.com;path=/";
    //
    function addGlobalStyle(css, cssClass) {
        var head = document.getElementsByTagName('head')[0];
        if (!head) return;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
        return style;
    };
    addGlobalStyle('#old-browser-alert {background: black; opacity: 0.25; display: none;}', 'pdp_style_01');
//     function documentOnReady() {
//         const alertMsg = document.querySelector('.yt-alert-message > a[href^="/new"]');
//         if (alertMsg) {
//             window.setTimeout(function() {
//                 document.querySelector('.alerts-wrapper').scrollIntoView();
//             }, 5000/2);
//         };
//     };
//     document.addEventListener('DOMContentLoaded', documentOnReady);
})();
