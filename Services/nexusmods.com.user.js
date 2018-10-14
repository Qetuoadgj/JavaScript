// ==UserScript==
// @name         nexusmods.com
// @icon         https://www.google.com/s2/favicons?domain=nexusmods.com
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/nexusmods.com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-start
// @noframes
// @match        *://www.nexusmods.com/?id=*
// @match        *://www.nexusmods.com/*/mods/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // Page Redirection
    setTimeout(function(){
        var pageHost = location.hostname,
            pageURL = location.href,
            pageTitle = document.title,
            shortURL = (location.protocol + '//' + location.host + location.pathname).trim();
        var mod = location.href.match(/id=(\d+)/i);
        if (mod) {
            var mod_id = mod[1];
            var new_url = location.protocol + '//www.nexusmods.com/oblivion/mods/' + mod_id;
            location.href = new_url;
            return
        }

    }, 100);

    // Links Fix
    setTimeout(function(){
        var links = document.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var matches = link.href.match(/^https?:\/\/(.*?)\.nexusmods\.com\/downloads\/file.php\?id=(\d+)/i);
            if (matches) {
                var link_game = matches[1];
                var link_mod_id = matches[2];
                var new_href = location.protocol + '//www.nexusmods.com/'+link_game+'/mods/'+link_mod_id+'/';
                link.setAttribute('href', new_href);
                console.log('fixed: ' + link.href);
            }
        }
    }, 1000);

})();