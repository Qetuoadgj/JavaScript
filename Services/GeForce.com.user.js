// ==UserScript==
// @name         GeForce.com
// @icon         https://www.google.com/s2/favicons?domain=geforce.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/GeForce.com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-start
// @noframes
// @match        https://www.geforce.com/drivers
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // COOKIE FUNCTIONS
    // ====================================================================================================================
    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function eraseCookie(name) {
        document.cookie = name+'=; Max-Age=-99999999;';
    }
    // ====================================================================================================================

    function copyToClipboard(text) { window.prompt("Copy to clipboard: Ctrl+C, Enter", text); }

    // ====================================================================================================================

    var name = '__NV_DD3Manual', params, expire = '1';
    var geforce_gt440_win7_x32_rus_whql = '{"d0":"1","d1":"71","d2":"541","d4":"18","d5":"2092","driverType":"whql"}'; // GeForce, 440GT, Win7, x32, Sertified
    var geforce_610m_win10_x64_rus_whql = '{"d0":"1","d1":"84","d2":"620","d4":"57","d5":"2092","driverType":"whql"}'; // GeForce, 610M, Win10, x64, Sertified

    // params = geforce_610m_win10_x64_rus_whql;
    params = geforce_gt440_win7_x32_rus_whql;

    setCookie(name, params, expire);

    GM_registerMenuCommand("Log Current Cookie", function() {
        var val = getCookie(name);
        console.log(name+' = '+val);
        // alert(name+' = 'val);
        copyToClipboard(val);
    }, "");
})();
