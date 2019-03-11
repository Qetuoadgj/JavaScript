// ==UserScript==
// @name         nexusmods.com
// @icon         https://www.google.com/s2/favicons?domain=nexusmods.com
// @version      1.0.1
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/nexusmods.com.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-start
// @noframes
// @match        *://www.nexusmods.com/?id=*
// @match        *://www.nexusmods.com/*/mods/*
// @match        *://oblivion.nexusmods.com/mods/*
// @match        *://skyrim.nexusmods.com/mods/*
// @match        *://*.nexusmods.com/mods/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // Page Redirection
    setTimeout(function(){
        var pageHost = location.hostname,
            pageURL = location.href,
            pageTitle = document.title,
            shortURL = (location.protocol + '//' + location.host + location.pathname).trim()
        ;
        var base = location.protocol + '//www.nexusmods.com',
            game = 'oblivion',
            mod = null
        ;
        if (pageURL.match(/https?:\/\/.*\.nexusmods\.com\/mods\//i)) {
            mod = location.href.match(/mods\/(\d+)/i);
            game = location.href.match(/:\/\/(.*?)\.nexusmods.com/i)[1];
        }
        else {
            mod = location.href.match(/id=(\d+)/i);
        }
        if (mod) {
            var mod_id = mod[1];
            var new_url = base + '/' + game + '/mods/' + mod_id;
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