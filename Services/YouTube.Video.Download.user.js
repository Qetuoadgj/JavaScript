// ==UserScript==
// @name         YouTube.Video.Download
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @version      1.0.02
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/YouTube.Video.Download.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @noframes
// @match        *://www.youtube.com/watch*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // --------------------------------------------------
    // https://stackoverflow.com/a/11384018
    function openInNewTab(url, title) {
        var win = window.open(url, '_blank');
        if (title) win.document.title = title;
        win.focus();
    }
    // --------------------------------------------------
    // Code by Jingsong Zhao: https://stackoverflow.com/a/45332232
    function download(url, fileName) {
        console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onprogress = function(event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total)*100;
                // yourShowProgressFunction(percentComplete);
            }
        };
        xhr.onload = function(event) {
            if (this.status == 200) {
                _saveBlob(this.response, fileName);
            }
            else {
                // yourErrorFunction()
            }
        };
        xhr.onerror = function(event){
            // yourErrorFunction()
            openInNewTab(url, fileName);
        };
        xhr.send();
    }
    function _saveBlob(response, fileName) {
        if(navigator.msSaveBlob){
            // OK for IE10+
            navigator.msSaveBlob(response, fileName);
        }
        else{
            _html5Saver(response, fileName);
        }
    }
    function _html5Saver(blob , fileName) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        document.body.removeChild(a);
    }
    // --------------------------------------------------
    //     function getQualityList() {
    //         const t_table = JSON.parse(unsafeWindow.ytplayer.config.args.player_response).streamingData.adaptiveFormats;
    //         let t_matched = {};
    //         for (let t of Object.keys(t_table)) {
    //             let table = t_table[t];
    //             if (table.itag) {
    //                 let itag = table.itag.toString();
    //                 let format = table.mimeType;
    //                 if (format && format.match('video/mp4')) { // if (t_itags[itag]) {
    //                     t_matched[itag] = table;
    //                 };
    //             };
    //         };
    //         for (let t of Object.keys(t_matched)) {
    //             let table = t_matched[t];
    //             let quality = table.height + 'p', fps = table.fps + 'fps ', type = table.mimeType, url = table.url;
    //             let type_2 = type.replace(/;.*/, '');
    //             let ext = type_2.replace(/^.*\//, '')
    //             let cmd = GM_registerMenuCommand(`${quality} ${fps} ${ext}`, function() {
    //                 let fileName = document.title + ' - ' + quality + '.'+ ext;
    //                 download(url, fileName)
    //             }, '');
    //         };
    //     };
    //     getQualityList();
    // --------------------------------------------------
    function getQualityList() {
        const t_player_response = JSON.parse(unsafeWindow.ytplayer.config.args.player_response);
        const t_info = t_player_response.videoDetails;
        const t_table = t_player_response.streamingData.adaptiveFormats;
        let t_matched = {};
        for (let t of Object.keys(t_table)) {
            let table = t_table[t];
            if (table.itag) {
                let itag = table.itag.toString();
                let format = table.mimeType;
                if (format && (format.match('video/mp4') || format.match('audio/'))) {
                    t_matched[itag] = table;
                };
            };
        };
        let sortingArray = [], sortedTable = {}, audioTable = {};
        for (let t of Object.keys(t_matched)) {
            let table = t_matched[t];
            if (table.height) {
                sortedTable[table.height] = sortedTable[table.height] ? sortedTable[table.height] : {};
                sortedTable[table.height][table.fps] = sortedTable[table.height][table.fps] ? sortedTable[table.height][table.fps] : {};
                sortedTable[table.height][table.fps][table.mimeType] = table;
                if (!sortingArray.includes(table.height)) sortingArray.push(table.height);
            }
            else if (table.audioSampleRate) {
                // console.log(table);
                audioTable[table.audioSampleRate] = audioTable[table.audioSampleRate] ? audioTable[table.audioSampleRate] : {};
                audioTable[table.audioSampleRate][table.mimeType] = table;
                // if (!sortingArray.includes(table.height)) sortingArray.push(table.height);
            };
        };
        sortingArray.sort(function(a, b){return a - b;});
        let noVideo = true;
        for (let quality of sortingArray) {
            let quality_table = sortedTable[quality.toString()];
            for (let fps of Object.keys(quality_table)) {
                let fps_table = quality_table[fps];
                for (let mimeType of Object.keys(fps_table)) {
                    let table = fps_table[mimeType];
                    // console.log(quality, fps, mimeType, table);
                    if (table.url) {
                        noVideo = false;
                        let type = mimeType.replace(/;.*/, '');
                        let ext = type.replace(/^.*\//, '');
                        let cmd = GM_registerMenuCommand(`${quality}p ${fps}fps.${ext}`, function() {
                            let title = t_info.author + ' - ' + t_info.title; // document.title;
                            let fileName = `${title} - ${quality}p_${fps}fps.${ext}`;
                            download(table.url, fileName)
                        }, '');
                    };
                };
            };
        };
        for (let quality of Object.keys(audioTable)) {
            let quality_table = audioTable[quality.toString()];
            // console.log(quality, quality_table);
            for (let mimeType of Object.keys(quality_table)) {
                let table = quality_table[mimeType];
                if (table.audioSampleRate && table.url) {
                    // noVideo = false;
                    let mimeType = table.mimeType;
                    let type = mimeType.replace(/;.*/, '');
                    let ext = type.replace(/^.*\//, '');
                    let cmd = GM_registerMenuCommand(`${quality} Hz.${ext}`, function() {
                        let title = t_info.author + ' - ' + t_info.title; // document.title;
                        let fileName = `${title} - ${quality}Hz.${ext}`;
                        download(table.url, fileName)
                    }, '');
                };
            };
        };
        if (noVideo === true) {
            let cmd = GM_registerMenuCommand('Видео защищено от скачивания', function() {return;}, '');
        };
    };
    getQualityList();
})();
