// ==UserScript==
// @name         Krunker.SaveSettings
// @namespace    http://tampermonkey.net/
// @version      0.0.03
// @description  try to take over the world!
// @author       You
// @match        https://krunker.io/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const maxIndex = 4;
    //
    var userLang = navigator.language || navigator.userLanguage;
    var str_save_settings = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Сохранить настройки' : 'Load settings';
    var str_load_settings = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Загрузить настройки' : 'Save settings';
    var str_create_backup = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Сохранить настройки в файл' : 'Restore settings from file';
    var str_restore_backup = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Загрузить настройки из файла' : 'Save settings as file';
    var str_auto_reload_page_on = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Включить авто-F5' : 'Turn on auto-F5';
    var str_auto_reload_page_off = 'ru-RU uk-UA be-BY kk-KZ'.includes(userLang) ? 'Отключить авто-F5' : 'Turn off auto-F5';
    //
    function getPresetIndex() {
        let data = GM_getValue('data') || {};
        let index = data.presetIndex;
        if (typeof index === 'undefined' || index === null) index = -1;
        return index;
    };
    var restoreSkipList = [
        'krunker_token',
        'krunker_last',
        'krunker_id',
        'krk_customPre',
    ];
    function keyExclude(key, pattern) {
        if (key && key.match(pattern) && !restoreSkipList.includes(key)) restoreSkipList.push(key);
    };
    const MenuCommand_Save = GM_registerMenuCommand(str_save_settings, function() {
        let data = GM_getValue('data') || {};
        let index = getPresetIndex() + 1;
        index = index > maxIndex ? 0 : Math.max(index, 0);
        data.presetIndex = index;
        data[index] = {}; //localStorage;
        for (let key of Object.keys(localStorage)) {
            keyExclude(key, 'pubcid');
            keyExclude(key, 'google');
            keyExclude(key, 'paypal');
            keyExclude(key, /^\d+$/);
            if (key && restoreSkipList.includes(key)) {
                console.log('skipped:', key);
                continue;
            };
            data[index][key] = localStorage[key];
        };
        GM_setValue('data', data);
        alert(index + '. OK');
    }, "");
    /* globals setSetting selectAttachment selectClass selectSpray selectReticle selectSecondary aspectSelect */
    const MenuCommand_Restore = GM_registerMenuCommand(str_load_settings, function() {
        localStorage.clear();
        let data = GM_getValue('data') || {};
        let index = getPresetIndex();
        alert(index + '. OK');
        for (let key of Object.keys(data[index])) {
            keyExclude(key, 'pubcid');
            keyExclude(key, 'google');
            keyExclude(key, 'paypal');
            keyExclude(key, /^\d+$/);
            if (key && restoreSkipList.includes(key)) {
                console.log('skipped:', key);
                continue;
            };
            localStorage[key] = data[index][key];
            let match = key.match(/^kro_setngss_(.*)/);
            if (match) setSetting(match[1], data[index][key]);
        };
        if (typeof data[index].krunker_username !== 'undefined') localStorage.krunker_username = data[index].krunker_username;
        if (typeof data[index].attachIndex !== 'undefined') selectAttachment(data[index].attachIndex);
        if (typeof data[index].reticleIndex !== 'undefined') selectReticle(data[index].reticleIndex)
        if (typeof data[index].classindex !== 'undefined') selectClass(data[index].classindex);
        if (typeof data[index].classindex !== 'undefined') selectClass(data[index].classindex);
        if (typeof data[index].sprayindex !== 'undefined') selectSpray(data[index].sprayindex);
        if (typeof data[index].secondaryInd !== 'undefined') selectSecondary(data[index].secondaryInd);
        if (typeof data[index].pingRegion4 !== 'undefined') setSetting('defaultRegion', data[index].pingRegion4);
        if (typeof data[index].kro_setngss_aspectRatio !== 'undefined') aspectSelect('aspectRatio', data[index].kro_setngss_aspectRatio);
        // location.href = '/'; // 'https://krunker.io/';
    }, "");
    //
    function downloadString(text, fileType, fileName) {
        var blob = new Blob([text], { type: fileType });
        var a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
    }
    function timeStamp() {
        let today = new Date;
        let date = today.toLocaleDateString('en-US', {year:'numeric', month:'2-digit', day:'2-digit'}).split('/');
        let time = today.toLocaleTimeString('en-US', {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'}).split(':');
        return (date[2] + '' + date[0] + '' + date[1] + '' + time[0] + '' + time[1] + '' + time[2]);
    };
    var cmdCreateBackup = GM_registerMenuCommand(str_create_backup, function() {
        let myData = GM_getValue('data') || {};
        let text = JSON.stringify(myData);
        downloadString(text, 'text/plain', 'krunker_localStorage_' + timeStamp() +'.txt');
    }, '');
    var cmdRestoreBackup = GM_registerMenuCommand(str_restore_backup, function() {
        let id = 'myFileSelectorID', name = 'myFileSelector';
        let i = document.querySelector('input#' + id + '[name=' + name + ']');
        if (!i) {
            i = document.createElement('input');
            i.id = id;
            i.name = name;
            i.type = 'file';
            i.style.display = 'none';
            document.body.appendChild(i);
            i.onchange = function(e) {
                let file = e.target.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.readAsText(file, 'UTF-8');
                    reader.onload = function (evt) {
                        let text = evt.target.result;
                        document.body.removeChild(e.target);
                        let myData = GM_getValue('data') || {};
                        console.log(text);
                        let data = JSON.parse(text);
                        if (typeof data === 'object') {
                            Object.assign(myData, myData, data);
                            // console.log(myData);
                            GM_setValue('data', myData);
                        };
                        alert('OK');
                    };
                    reader.onerror = function (evt) {
                        alert('error reading file');
                        document.body.removeChild(e.target);
                    };
                };
            };
        };
        i.click();
    }, '');
    var cmdOff, cmdOn, turnOn, turnOff;
    if (GM_getValue('enabled', null) === null) { // assign default value
        GM_setValue('enabled', false);
    };
    turnOn = function() {
        GM_setValue('enabled', true);
        GM_unregisterMenuCommand(cmdOn);
        cmdOff = GM_registerMenuCommand(str_auto_reload_page_off, function(){turnOff();}, '');
        location.href = '/'; // 'https://krunker.io/';
    };
    turnOff = function() {
        GM_setValue('enabled', false);
        GM_unregisterMenuCommand(cmdOff);
        cmdOn = GM_registerMenuCommand(str_auto_reload_page_on, function(){turnOn();}, '');
    };
    if (GM_getValue('enabled') == true) {
        cmdOff = GM_registerMenuCommand(str_auto_reload_page_off, function(){turnOff();}, '');
    }
    else {
        cmdOn = GM_registerMenuCommand(str_auto_reload_page_on, function(){turnOn();}, '');
    };
    if (GM_getValue('enabled') == true) {
        function handleNewElements(event) {
            let element = event.target;
            console.log(element);
            if (
                element.tagName == 'SPAN' &&
                (
                    element.innerText == 'DISCONNECTED' ||
                    element.innerText == 'Game is full.' ||
                    element.innerText == 'Servers are at Max Capacity'
                )
            ) {
                location.href = '/';
            };
            try {
                if (element.classList.contains('streamItem')) {
                    document.removeEventListener('DOMNodeInserted', handleNewElements, false);
                };
            } catch(e) {};
        };
        document.addEventListener('DOMNodeInserted', handleNewElements, false);
    };
})();