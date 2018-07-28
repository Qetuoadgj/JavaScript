// ==UserScript==
// @name         spys.one
// @icon         https://www.google.com/s2/favicons?domain=spys.one
// @version      1.0.6
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
/// @grant        none
// @run-at       document-end
/// @noframes
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/spys.one.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        http://spys.one/*
// @match        https://hidemy.name/ru/proxy-checker/
// @match        https://hidemyna.me/ru/proxy-checker/
// @namespace    http://spys.one/
// ==/UserScript==

(function() {
    "use strict";

    // Your code here...
    console.clear();

    var version= navigator.appVersion;
    var agent= navigator.userAgent;
    var language = window.navigator.language;

    var browserName = navigator.appName;
    var fullVersion = ''+parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion,10);

    var MenuCommand = (language = 'ru-RU') ? 'Протестировать прокси-лист' : 'Check Proxy-List';

    GM_setValue("init_proxy_check", 0);

    /*
    alert(version);
    alert(agent);
    alert(language);
    alert(browserName);
    alert(fullVersion);
    */

    var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
    var shortURL = location.protocol + "//" + location.host + location.pathname;

    function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}

    // Create the event
    // var e_change = new CustomEvent("change");

    Element.prototype.autoHeight = function(fixedHeight) {
        this.style.height = 0;
        var h = (this.scrollHeight > this.clientHeight) ? (this.scrollHeight) + "px" : "60px";
        this.style.height = h;
        if (fixedHeight) this.style.maxHeight = h;
    };

    function pageIsInIframe() {return window.location !== window.parent.location;}

    function check_proxies() {
        if (
            pageURL.match("https://hidemy.name/") ||
            pageURL.match("https://hidemyna.me/")
        ) {
            var check_button = document.getElementById("chkb1");
            if (check_button) {
                check_button.click();
                var editor = document.getElementById("f_in");
                if (editor) {
                    var GM_proxy_list = GM_getValue("proxy_list", null);
                    editor.value = GM_proxy_list;
                    editor.focus();
                    editor.scrollIntoView();
                }
                setTimeout(function scroll_to_table(){
                    // var table = document.getElementById("list");
                    // if (table) {
                    // 	table.focus();
                    // 	table.scrollIntoView();
                    // }
                    var progress = document.querySelector(".testing-btn");
                    if (progress) progress.scrollIntoView();
                }, 2000);
            }
        }
        else if ( pageURL.match("http://spys.one/") ) {
            var proxy_checker = document.getElementById("proxy_checker");
            if (proxy_checker) {
                proxy_checker.focus();
                proxy_checker.scrollIntoView();
            }
        }
    }

    // if (shortURL !== location.protocol + "//" + location.host + "/") window.location = location.protocol + "//" + location.host;

    if (
        pageURL.match("https://hidemy.name/") ||
        pageURL.match("https://hidemyna.me/")
    ) {
        if (pageIsInIframe()) {
            var GM_proxy_list = GM_getValue("proxy_list", null);
            var editor = document.getElementById("f_in");
            if (editor) {
                editor.value = GM_proxy_list;
                // editor.focus();
                // editor.scrollIntoView();
                var get_iframe_height = setInterval(function(){
                    var height = document.getElementById("global-wrapper").scrollHeight + "px";
                    GM_setValue("proxy_list_height", height);
                    if (GM_getValue("proxy_list_height") != height) console.log("height: ", height);
                }, 1000);
            }
            GM_registerMenuCommand(MenuCommand, function(){check_proxies();}, "c");
            GM_addValueChangeListener("init_proxy_check", function(name, old_value, new_value, remote) {
                if (new_value == 1) {
                    GM_setValue("init_proxy_check", 0);
                    check_proxies();
                }
            })
        }
        var not_working_cb = document.getElementById("cb_f");
        if (not_working_cb) not_working_cb.removeAttribute("checked");
        // GM_deleteValue("proxy_list");

        setTimeout(function remove_banner(){var banner = document.querySelector("jdiv.globalClass_ET");if (banner) banner.remove();}, 2000);

        var page_background = document.querySelector("div.wrap-container");
        if (page_background) page_background.style.background = "floralwhite";

        var green_line = document.querySelector("div.green-line.proxy-line");
        if (green_line) green_line.remove(); // green_line.style.display = "none";

        var details_ports = document.querySelector("div.details-ports");
        if (details_ports) details_ports.remove(); // details_ports.style.display = "none";

        var footer = document.querySelector("footer");
        if (footer) footer.remove(); // footer.style.display = "none";

        var picture = document.querySelector(".proxy-table__image");
        if (picture) picture.remove(); // picture.style.display = "none";
    }

    else if ( pageURL.match("http://spys.one/") ) {
        var anon_select = document.getElementById("anmm");
        if (anon_select) anon_select.options[2].selected = true; // ANM & HIA

        var port_select = document.querySelector("input[name='port']");
        if (port_select) port_select.value = "8080"; // 8080

        // var quantity_select = document.getElementById("xpp");
        // if (quantity_select) quantity_select.options[2].selected = true; // 100

        // var anon_select = document.getElementById("xf1");
        // if (anon_select) anon_select.options[1].selected = true; // ANM & HIA

        // var port_select = document.getElementById("xf4");
        // if (port_select) port_select.options[2].selected = true; // 8080

        // var main_form = document.querySelector("form[action='/aproxy/']");
        // if (main_form) main_form.submit();

        var result;
        var ip_list = "";
        var ip_list_selector = (
            "body > table > tbody > tr > td > table > tbody > tr.spy1x > td > font.spy14,"+
            "body > table > tbody > tr > td > table > tbody > tr.spy1xx > td > font.spy14"
        );

        document.querySelectorAll(ip_list_selector).forEach(function(item) {
            var text = item.innerText;
            if (text.match(/\d+\.\d+\.\d+\.\d+/)) {
                ip_list = ip_list + text + "\n";
                // console.log(text);
                result = true;
            }
        });

        document.body.querySelectorAll("#result_table, #check_url").forEach(function(item) {
            item.remove();
        });

        if (result) {
            var check_url = document.createElement("a");
            document.body.appendChild(check_url);
            check_url.id = "check_url";
            check_url.href = "https://hidemyna.me/ru/proxy-checker/"; //"https://hidemy.name/ru/proxy-checker/";
            check_url.target = "_blank";
            check_url.innerText = check_url.href;

            // var text_field = document.createElement("textarea");
            // document.body.appendChild(text_field);
            // text_field.id = "result_table";
            // text_field.style.width = "100%";
            // text_field.setAttribute("readonly", "readonly");
            // text_field.setAttribute("onclick", "this.focus(); this.select();");
            // text_field.value = ip_list;
            // text_field.autoHeight();

            // check_url.setAttribute("onclick", "document.getElementById('result_table').select(); document.execCommand('copy');");

            GM_setValue("proxy_list", ip_list);

            var proxy_checker = document.createElement("iframe");
            document.body.appendChild(proxy_checker);
            proxy_checker.id = "proxy_checker";
            proxy_checker.src = check_url.href ; //"https://hidemy.name/ru/proxy-checker/";
            proxy_checker.style.width = "100%";
            proxy_checker.style.height = "0px";
            proxy_checker.style.overflow = "hidden";
            proxy_checker.value = ip_list;

            proxy_checker.focus();

            var set_iframe_height = setInterval(function(){
                var GM_proxy_list_height = GM_getValue("proxy_list_height", 0);
                proxy_checker.style.height = GM_proxy_list_height;
            }, 1000/10);
            // clearInterval(check_height);

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
            /*
            element.style {
                height: ;
                width: auto;
                position: fixed;
                top: 7px;
                right: 7px;
                display: block;
                background: #19373a;
                border-width: 1px;
                border-color: greenyellow;
                border-style: solid;
                color: cyan;
                font-size: 9px;
                margin: 0 auto;
                padding: 10px;
            }
            */
            check_button.innerText = MenuCommand;
            check_button.addEventListener('click', function(e){GM_setValue("init_proxy_check", 1);}, false);
        }
    }
})();