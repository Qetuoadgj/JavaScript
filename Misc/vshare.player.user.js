// ==UserScript==
// @name         vshare.player
// @icon         https://www.google.com/s2/favicons?domain=vshare.io
// @version      0.0.31
// @description  Pure JavaScript version.
// @author       Ægir
// @namespace    complete.misc
/// @grant       none
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/vshare.player.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        *://vshare.io/v/404/*
/// @match        *://*/v/404/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const G_USE_AS_EXTENSION = typeof GM == 'undefined';
    console.log('G_USE_AS_EXTENSION:', G_USE_AS_EXTENSION);

    // https://vshare.io/v/404/https://s902.vshare.io:440/s,128-1000-22-1-2191707-bkxdtksrwj/186745/351673/185658/ff-8840c3e48fc8f80f67eeacc4b3fc3cdbb94c86b4,5c584cc5,2f23e49_480.mp4
    window.stop();
    // ---------------------------------------------------
    function removeEventListeners(elementSelector) {
        const elementsArray = document.querySelectorAll(elementSelector);
        for (let element of elementsArray) {
            element.outerHTML = element.outerHTML;
        };
    };
    removeEventListeners('head');
    removeEventListeners('body');
    // ---------------------------------------------------
    function removeElement(elementSelector) {
        const elementsArray = document.querySelectorAll(elementSelector);
        for (let element of elementsArray) {
            element.remove();
        };
    };
    removeElement('head'); // document.querySelector('head').remove();
    removeElement('body'); // document.querySelector('body').remove();
    const head = document.createElement('head'); document.documentElement.appendChild(head);
    const body = document.createElement('body'); document.documentElement.appendChild(body);
    // ---------------------------------------------------
    function addGlobalStyle(css, cssClass) {
        const head = document.getElementsByTagName('head')[0]; if (!head) { return; }
        const style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
    };
    function prettyPrint(string) {
        return string.replace(/\{/g, '{\n\t').replace(/;\s+/g, ';\n\t').replace(/\}/g, '\n}').replace(/}([^\s]+)/g, '}\n$1');
    };
    // /*
    addGlobalStyle(
        prettyPrint(
            'body {position: absolute; width: 100%; height: 100%; overflow: hidden; padding: 0px; margin: 0px; top: 0px; left: 0px;}' +
            'video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black; padding: 0px; margin: 0px; top: 0px; left: 0px; background: black;}'
        ),
        'pageStyle'
    )
    // */
    // ---------------------------------------------------
    function failed(e) {
        // video playback failed - show a message saying why
        switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
                console.log('You aborted the video playback.');
                break;
            case e.target.error.MEDIA_ERR_NETWORK:
                console.log('A network error caused the video download to fail part-way.');
                break;
            case e.target.error.MEDIA_ERR_DECODE:
                console.log('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
                break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                console.log('The video could not be loaded, either because the server or network failed or because the format is not supported.');
                break;
            default:
                console.log('An unknown error occurred.');
                break;
        };
    };
    // ---------------------------------------------------
    const html = [
        // `<!DOCTYPE html>`,
        `<html>`,
        `    <head>`,
        `        <meta charset="UTF-8">`,
        `        <meta name="viewport" content="width=device-width, initial-scale=1">`,
        // `        <link rel="stylesheet" href="style.css">`,
        `        <title>HTML5 Custom Video Player</title>`,
        `    </head>`,
        `    <body>`,
        `        <div class="player">`,
        `            <video class="player-video" preload="metadata"></video>`,
        `            <div class="player-controls">`,
        `                <div class="progress-container">`,
        `                    <div class="progress">`,
        `                        <div class="progress-background">`,
        `                            <span class="current-time">00:00</span>`,
        `                            <video class="progress-thumbnail" preload="metadata" muted></video>`,
        `                        </div>`,
        `                        <div class="filled-buffer"></div>`,
        `                        <div class="filled-progress"></div>`,
        `                    </div>`,
        `                </div>`,
        `                <div class="player-panel">`,
        `                    <button class="player-btn toggle-play" title="Toggle Play">`,
        `                        <svg class="" width="16" height="16" viewBox="0 0 16 16">`,
        `                            <title>play</title>`,
        `                            <polygon points="0 0 0 16 16 8"></polygon>`,
        `                        </svg>`,
        `                    </button>`,
        `                    <span class="current-time-display">00:00</span>`,
        `                    <div class="slider audio">`,
        `                        <button class="player-btn speaker"><span></span></button>`,
        `                        <input type="range" name="volume" class="player-slider" min="0" max="1" step="0.05" value="1">`,
        `                    </div>`,
        `                    <div class="slider speed">`,
        `                        <span class="current-speed">×1.00</span>`,
        `                        <input type="range" name="playbackRate" class="player-slider" min="0.25" max="2" step="0.25" value="1">`,
        `                    </div>`,
        `                    <button data-skip="-10" class="player-btn skip">- 10s</button>`,
        `                    <button data-skip="10" class="player-btn skip">+ 10s</button>`,
        `                    <div class="video-options">`,
        `                        <span class="video-size">720p</span>`,
        `                        <div class="video-size-options">`,
        `                            <div class="background">`,
        `                                <!-- <span>360p</span><span>720p</span><span>1080p</span> -->`,
        `                            </div>`,
        `                        </div>`,
        `                    </div>`,
        `                    <button class="player-btn toggle-fullscreen"></button>`,
        `                </div>`,
        `            </div>`,
        `            <div class="icon-load hidden">`,
        `                <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">`,
        `                    <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50" transform="rotate(263.471 50 50)">`,
        `                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>`,
        `                    </path>`,
        `                </svg>`,
        `            </div>`,
        `        </div>`,
        // `        <script src="script.js"></script>`,
        `    </body>`,
        `</html>`,
        ``,
    ].join('\n');
    document.documentElement.innerHTML = html;
    // ---------------------------------------------------
    const css = [
        `body {`,
        `    background: linear-gradient(to right, #1cb5e0, #000046);`,
        `    display: flex;`,
        `    height: 100vh;`,
        `    width: 100vw;`,
        `    margin: 0;`,
        `    padding: 0;`,
        `    overflow: hidden;`,
        `    background: #000;`,
        `}`,
        `.player {`,
        `    display: block;`,
        `    overflow: hidden;`,
        `    max-width: none;`,
        `    width: 100%;`,
        `}`,
        `.player:-webkit-full-screen,`,
        `.player:fullscreen {`,
        `    max-width: none;`,
        `    width: 100%;`,
        `}`,
        `.player-video {`,
        `    position: absolute;`,
        `    top: 0;`,
        `    left: 0;`,
        `    height: 100%;`,
        `    width: 100%;`,
        `}`,
        `.player-controls {`,
        `    position: absolute;`,
        `    display: block;`,
        `    bottom: 0px;`,
        `    left: 0px;`,
        `    width: 100%;`,
        `    height: auto;`,
        `    background: rgba(255, 255, 0, 0.3);`,
        `}`,
        `.progress {`,
        `    position: absolute;`,
        `    display: block;`,
        `    top: 0;`,
        `    left: 0;`,
        `    width: 100%;`,
        `    height: 4px;`,
        `    transform: translateY(-100%);`,
        `    background: rgba(255, 255, 255, 0.1);`,
        `    cursor: pointer;`,
        `}`,
        `.filled-progress,`,
        `.filled-buffer {`,
        `    position: absolute;`,
        `    top: 0;`,
        `    left: 0;`,
        `    height: 100%;`,
        `}`,
        `.filled-progress {`,
        `    width: 40%;`,
        `    background: #ff0000;`,
        `}`,
        `.filled-buffer {`,
        `    width: 50%;`,
        `    background: #ffff00;`,
        `    opacity: 0.2;`,
        `}`,
        `.progress-background {`,
        `    position: absolute;`,
        `    top: 0;`,
        `    left: 0;`,
        `    transform: translateY(-100%);`,
        `    /*background: rgba(0, 0, 255, 0.3);*/`,
        `    width: 40%;`,
        `    height: 18px;`,
        `}`,
        `.progress-background {`,
        `    visibility: hidden;`,
        `    min-width: 10%;`,
        `    max-width: 90%;`,
        `}`,
        `.progress:hover .progress-background,`,
        `.progress-container:hover .progress-background {`,
        `    visibility: visible;`,
        `}`,
        `.progress-background,`,
        `.progress-background *,`,
        `.filled-progress,`,
        `.filled-buffer,`,
        `.video-size,`,
        `.current-time-display {`,
        `    pointer-events: none;`,
        `}`,
        `.current-time {`,
        `    position: absolute;`,
        `    bottom: 0;`,
        `    right: 0;`,
        `    width: auto;`,
        `    height: auto;`,
        `    transform: translateX(50%);`,
        `    /*background: cyan;*/`,
        `    background: rgba(0, 0, 0, 1);`,
        `    padding: 2px;`,
        `    margin: 2px 0;`,
        `    border-radius: 1px;`,
        `}`,
        `.progress-thumbnail {`,
        `    position: absolute;`,
        `    bottom: 100%;`,
        `    right: 0;`,
        `    width: 150px;`,
        `    height: 90px;`,
        `    transform: translateX(50%) translateY(-5px);`,
        `    /*background: rgba(0, 128, 255, 0.3);*/`,
        `    background: rgba(0, 0, 0, 1);`,
        `}`,
        `.player-panel {`,
        `    display: flex;`,
        `    align-items: center;`,
        `    /*background: yellowgreen*/`,
        `    /*background: rgba(0, 0, 0, 1);*/`,
        `}`,
        `.player-btn,`,
        `.slider,`,
        `.current-speed {`,
        `    width: auto;`,
        `    height: 30px;`,
        `    min-width: 30px;`,
        `    text-align: center;`,
        `    margin: 5px;`,
        `    background: none;`,
        `    border: 0;`,
        `    display: flex;`,
        `    align-items: center;`,
        `    cursor: pointer;`,
        `    border-radius: 1px;`,
        `}`,
        `.player-btn:hover,`,
        `.player-btn:focus {`,
        `    border-color: #ffec41;`,
        `    /*background: rgba(255, 255, 255, 0.2);*/`,
        `}`,
        `.player-btn svg {`,
        `    fill: #ffffff;`,
        `    margin: auto;`,
        `}`,
        `.player * {`,
        `    font-family: "Arial", Arial, Sans-serif;`,
        `    font-size: 14px;`,
        `    color: #ffffff;`,
        `}`,
        `input[type="range"] {`,
        `    display: block;`,
        `    -webkit-appearance: none;`,
        `    background: transparent;`,
        `}`,
        `input[type="range"]:focus {`,
        `    outline: none;`,
        `}`,
        `input[type="range"]::-webkit-slider-runnable-track {`,
        `    width: 100%;`,
        `    height: 3px;`,
        `    cursor: pointer;`,
        `    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0 0 1px rgba(13, 13, 13, 0);`,
        `    background: rgba(255, 255, 255, 0.5);`,
        `    border-radius: 1px;`,
        `    border: 0.2px solid rgba(1, 1, 1, 0);`,
        `}`,
        `input[type="range"]::-moz-range-track {`,
        `    width: 100%;`,
        `    height: 3px;`,
        `    cursor: pointer;`,
        `    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0 0 1px rgba(13, 13, 13, 0);`,
        `    background: #ffffff;`,
        `    border-radius: 1px;`,
        `    border: 0.2px solid rgba(1, 1, 1, 0);`,
        `}`,
        `input[type="range"]::-webkit-slider-thumb {`,
        `    height: 16px;`,
        `    width: 16px;`,
        `    border-radius: 50px;`,
        `    background: white;`,
        `    cursor: pointer;`,
        `    -webkit-appearance: none;`,
        `    margin-top: -7px;`,
        `    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);`,
        `}`,
        `input[type="range"]::-moz-range-thumb {`,
        `    height: 16px;`,
        `    width: 16px;`,
        `    border-radius: 50px;`,
        `    background: white;`,
        `    cursor: pointer;`,
        `    box-shadow: 0 0 3px rgba(0, 0, 0, 0), 0 0 1px rgba(13, 13, 13, 0);`,
        `}`,
        `input[type="range"]:focus::-webkit-slider-runnable-track {`,
        `    background: rgba(255, 255, 255, 0.8);`,
        `}`,
        `.slider {`,
        `    display: flex;`,
        `    padding-right: 5px;`,
        `    /*background: blueviolet;*/`,
        `}`,
        `/* --------------------------------- */`,
        `.speaker {`,
        `    height: 30px;`,
        `    width: 30px;`,
        `    max-width: 30px;`,
        `    position: relative;`,
        `    overflow: hidden;`,
        `    display: inline-block;`,
        `    /* background: red; */`,
        `    margin: 0px 5px;`,
        `    left: 0px;`,
        `    /* top: 2px; */`,
        `}`,
        `.speaker span {`,
        `    display: block;`,
        `    width: 8px;`,
        `    height: 8px;`,
        `    background: #fff;`,
        `    margin: 11px 0 0 2px;`,
        `    pointer-events: none;`,
        `}`,
        `button.speaker span {`,
        `    margin: 0 -5px;`,
        `}`,
        `.speaker span:after {`,
        `    content: "";`,
        `    position: absolute;`,
        `    width: 0;`,
        `    height: 0;`,
        `    border-style: solid;`,
        `    border-color: transparent #fff transparent transparent;`,
        `    border-width: 10px 14px 10px 15px;`,
        `    left: -13px;`,
        `    top: 5px;`,
        `}`,
        `.speaker span:before {`,
        `    transform: rotate(45deg);`,
        `    border-radius: 0 50px 0 0;`,
        `    content: "";`,
        `    position: absolute;`,
        `    width: 5px;`,
        `    height: 5px;`,
        `    border-style: double;`,
        `    border-color: #fff;`,
        `    border-width: 7px 7px 0 0;`,
        `    left: 18px;`,
        `    top: 9px;`,
        `    transition: all 0.2s ease-out;`,
        `}`,
        `.speaker:hover span:before {`,
        `    transform: scale(0.8) translate(-3px, 0) rotate(42deg);`,
        `}`,
        `.speaker.mute span:before {`,
        `    transform: scale(0.5) translate(-15px, 0) rotate(36deg);`,
        `    opacity: 0;`,
        `}`,
        `/* --------------------------------- */`,
        `.audio input,`,
        `.speed input {`,
        `    display: none;`,
        `}`,
        `.audio:hover input,`,
        `.speed:hover input {`,
        `    display: inline-block;`,
        `    width: 100px;`,
        `}`,
        `.player-controls {`,
        `    align-items: center;`,
        `    display: flex;`,
        `    position: absolute;`,
        `    bottom: 0;`,
        `    width: 100%;`,
        `    transition: all 0.3s;`,
        `    flex-wrap: wrap;`,
        `    background: rgba(0, 0, 0, 0.9);`,
        `    height: 60px;`,
        `}`,
        `.player-controls {`,
        `    -webkit-transform: translateY(100%) translateY(6px);`,
        `    transform: translateY(100%) translateY(6px);`,
        `}`,
        `.player:hover .player-controls {`,
        `    -webkit-transform: translateY(0);`,
        `    transform: translateY(0);`,
        `}`,
        `.player-controls > * {`,
        `    flex: 1;`,
        `}`,
        `.speed {`,
        `    margin-left: auto;`,
        `}`,
        `.filled-progress,`,
        `.filled-buffer {`,
        `    width: 0;`,
        `}`,
        `/*`,
        `    .player-btn svg {`,
        `    fill: #ffffff;`,
        `    }`,
        `    .player-btn:hover svg {`,
        `    fill: #00ffff;`,
        `    }`,
        `    .audio:hover .speaker span {`,
        `    background: #00ffff;`,
        `    }`,
        `    .audio:hover .speaker span:after {`,
        `    border-color: transparent #00ffff transparent transparent;`,
        `    }`,
        `    .audio:hover .speaker span:before {`,
        `    border-color: #00ffff;`,
        `    }`,
        `*/`,
        `.player-panel {`,
        `    padding: 0 15px;`,
        `}`,
        `.video-size,`,
        `.current-time-display {`,
        `    margin: 0 5px;`,
        `}`,
        `input[type="range"] {`,
        `    /* background: red; */`,
        `    height: 100%;`,
        `    cursor: pointer;`,
        `}`,
        `.player-controls {`,
        `    height: auto;`,
        `}`,
        `.toggle-play svg {`,
        `    zoom: 0.9;`,
        `}`,
        `.speaker {`,
        `    zoom: 0.8;`,
        `}`,
        `.toggle-fullscreen {`,
        `    outline: 1px solid #fff;`,
        `    outline-offset: -10px;`,
        `    width: 35px;`,
        `    height: 30px;`,
        `}`,
        `.speaker {`,
        `    zoom: unset;`,
        `}`,
        ``,
        `.speaker > span {`,
        `    zoom: 0.8;`,
        `}`,
        ``,
        `.slider > * {`,
        `    margin: 0px 5px 0px 0px;`,
        `}`,
        `/* ------------------------------------- */`,
        `.speaker span {`,
        `    margin: 0;`,
        `    display: flex;`,
        `    align-items: center;`,
        `    align-content: center;`,
        `}`,
        `.speaker span:after {`,
        `    top: unset;`,
        `    margin: auto;`,
        `}`,
        `.speaker span:before {`,
        `    top: unset;`,
        `}`,
        `/* ------------------------------------- */`,
        `.speaker span:before {`,
        `    top: unset;`,
        `    margin: 0px 3px;`,
        `}`,
        `.speaker span:after {`,
        `    top: unset;`,
        `    margin: 0px 3px;`,
        `}`,
        `button.speaker span {`,
        `    margin: 0px -2px;`,
        `}`,
        `/* ------------------------------------- */`,
        `.player-panel {`,
        `    padding: 0px 0px;`,
        `}`,
        `/* ------------------------------------- */`,
        `.player * {`,
        `    -webkit-user-select: none;`,
        `    -moz-user-select: none;`,
        `    -ms-user-select: none;`,
        `    user-select: none;`,
        `}`,
        `.player-panel * {`,
        `    color: #fff;`,
        `    font-family: "Arial", Arial, Sans-serif;`,
        `    font-size: 14px;`,
        `}`,
        `/* ------------------------------------- */`,
        `.skip {`,
        `    display: inline-grid;`,
        `    padding: 0;`,
        `    width: 40px;`,
        `}`,
        `/* ------------------------------------- */`,
        `.slider > * {`,
        `    margin: 0px 0px 0px 0px;`,
        `}`,
        `.slider {`,
        `    padding-right: 0;`,
        `}`,
        `input[type="range"] {`,
        `    padding: 0px 5px;`,
        `}`,
        `/* ------------------------------------- */`,
        `.speaker.mute span:before {`,
        `    transform: rotate(0deg);`,
        `    content: "×";`,
        `    height: fit-content;`,
        `    border: none;`,
        `    border-color: #fff;`,
        `    display: block;`,
        `    opacity: 1;`,
        `    /* transition: none; */`,
        `}`,
        `/* ------------------------------------- */`,
        `.player-panel {`,
        `    box-shadow: 0px 0px 24px #000;`,
        `}`,
        `.progress {`,
        `    background: rgba(255, 255, 255, 0.2);`,
        `}`,
        `/* ------------------------------------- */`,
        `.progress-background {`,
        `    min-width: 80px;`,
        `    max-width: calc(100% - 80px);`,
        `}`,
        `/* ------------------------------------- */`,
        `.icon-load {`,
        `    display: block;`,
        `    position: absolute;`,
        `    width: fit-content;`,
        `    height: fit-content;`,
        `    margin: 0;`,
        `    padding: 0;`,
        `    top: 50%;`,
        `    left: 50%;`,
        `    transform: translateX(-50%) translateY(-50%);`,
        `}`,
        `.icon-load svg {`,
        `    width: 100px;`,
        `    height: 100px;`,
        `    margin: auto;`,
        `    display: inline-block;`,
        `}`,
        `.icon-load svg path{`,
        `    width: 100px;`,
        `    height: 100px;`,
        `    margin: auto;`,
        `    display: inline-block;`,
        `    opacity: 0.25;`,
        `    fill: #fff;`,
        `}`,
        `.hidden {`,
        `    display: none;`,
        `}`,
        `/* ------------------------------------- */`,
        `.progress-container {`,
        `    position: absolute;`,
        `    display: block;`,
        `    top: 0;`,
        `    left: 0;`,
        `    width: 100%;`,
        `    height: 8px;`,
        `    transform: translateY(-100%);`,
        `    background: rgba(0, 0, 255, 0);`,
        `    cursor: pointer;`,
        `}`,
        `.progress {`,
        `    top: 100%;`,
        `    pointer-events: none;`,
        `}`,
        `.progress {`,
        `    width: calc(100% - 20px);`,
        `    left: 10px;`,
        `}`,
        `/* ------------------------------------- */`,
        `.video-size-options {`,
        `    position: absolute;`,
        `    top: 0px;`,
        `    margin: 0;`,
        `    padding: 0 0 20px 0;`,
        `    /* background: red; */`,
        `    width: auto;`,
        `    transform: translate(0, -100%) translate(0, 12px);`,
        `    display: none;`,
        `}`,
        `.video-options:hover .video-size-options {`,
        `    display: block;`,
        `}`,
        `.video-size-options span {`,
        `    display: block;`,
        `    text-align: right;`,
        `    margin: 2px 5px;`,
        `    /* background: black; */`,
        `    cursor: pointer;`,
        `}`,
        `.video-size-options span:hover {`,
        `    color: gold;`,
        `}`,
        `/* ------------------------------------- */`,
        `.video-size-options .background {`,
        `    background: rgba(0, 0, 0, 0.6);`,
        `    box-shadow: 0px 0px 4px #000;`,
        `    padding: 6px;`,
        `}`,
        `.video-size-options span {`,
        `    padding: 2px 0px;`,
        `}`,
        `/* ------------------------------------- */`,
        ``,
    ].join('\n');
    addGlobalStyle(css, 'playerStyle_1');
    // ---------------------------------------------------
    // Let's Build: With JavaScript - Web-Crunch.com
    // Subscribe on YouTube - https://youtube.com/c/webcrunch
    // Let's Build: HTML5 Video Player
    // Overall Concept Credit: Wes Bos https://wesbos.com
    // ---------------------------------------------------
    const player = document.querySelector('.player');
    const video = player.querySelector('.player-video');
    const progress = player.querySelector('.progress');
    const progressContainer = player.querySelector('.progress-container');
    const progressFilled = player.querySelector('.filled-progress');
    const bufferFilled = player.querySelector('.filled-buffer');
    // ---------------------------------------------------
    const loadingIndicator = player.querySelector('.icon-load');
    // ---------------------------------------------------
    const togglePlayButton = player.querySelector('.toggle-play');
    const toggleMuteBtn = player.querySelector('.speaker');
    const toggleFullScreenButton = player.querySelector('.toggle-fullscreen');
    // ---------------------------------------------------
    const skipButtons = player.querySelectorAll('[data-skip]');
    const playerSliders = player.querySelectorAll('.player-slider');
    // ---------------------------------------------------
    const currentTimeDisplay = document.querySelector('.current-time-display');
    const currentSourceQualityDisplay = document.querySelector('.video-size');
    // ---------------------------------------------------
    const progressBackground = player.querySelector('.progress-background');
    const currentTime = player.querySelector('.current-time');
    const progressThumbnail = player.querySelector('.progress-thumbnail');
    const playbackRateDisplay = player.querySelector('.current-speed');
    // ---------------------------------------------------
    const timeline = progress;
    const timeline_event_catcher = progressContainer; // progress;
    // ---------------------------------------------------
    // let thumbUpdatedTimeLast = 0;
    let mouseDownState = false;
    // ---------------------------------------------------
    // Logic
    // ---------------------------------------------------
    function toHHMMSS(secs = 0) {
        const sec_num = parseInt(secs, 10);
        const hours = Math.floor(sec_num / 3600) % 24;
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;
        return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v, i) => v !== "00" || i > 0).join(":");
    }
    function seconds(time) {
        let duration = time.split(':');
        for (let v of duration) {
            return (
                duration.length == 3 ? Number(duration[0]) * 60 * 60 + Number(duration[1]) * 60 + Number(duration[2]) :
                duration.length == 2 ? Number(duration[0]) * 60 + Number(duration[1]) : Number(duration[0])
            );
        };
    };
    // When the openFullscreen() function is executed, open the video in fullscreen.
    // Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet.
    function requestFullscreen(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
        else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        }
        else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
            elem.webkitRequestFullscreen();
        }
        else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }
    function toggleFullscreen() {
        requestFullscreen(video);
    }
    function timelineCalculatePercent(e) {
        const delta = timeline.offsetLeft - timeline_event_catcher.offsetLeft;
        const clickPosX = Math.max(e.offsetX - delta, 0);
        const percent = Math.min(clickPosX / timeline.offsetWidth * 100, 100);
        // console.log(percent);
        return percent;
    }
    let G_progressThumbnailSrc;
    function updateTimelineThumb(time, minUpdateTime = 2) {
        // if ((Math.abs(time - thumbUpdatedTimeLast)) < minUpdateTime) return;
        time = Math.floor(time)
        progressThumbnail.src = (G_progressThumbnailSrc || video.currentSrc).replace(/#t=\d+\b/ig, '') + `#t=${time},${time+1}`; // "#t=" + time;
        // thumbUpdatedTimeLast = time;
    }
    function playerDisplayTimelineTooltip(e) {
        const percent = timelineCalculatePercent(e);
        const time = percent / 100 * video.duration;
        progressBackground.style.width = `${percent}%`;
        currentTime.innerText = toHHMMSS(time);
        updateTimelineThumb(time);
    }
    function togglePlay() {
        const playState = video.paused ? 'play' : 'pause';
        let promise = video[playState](); // Call play or paused method
        if (promise !== undefined) {promise.then(_ => {}).catch(error => {});};
    }
    function updatePlayButton() {
        if (this.paused) {
            togglePlayButton.innerHTML = `<svg class="" width="16" height="16" viewBox="0 0 16 16"><title>play</title><polygon points="0 0 0 16 16 8"></polygon></svg>`;
        }
        else {
            togglePlayButton.innerHTML = `<svg class="" width="16" height="16" viewBox="0 0 16 16"><title>pause</title><polygon points="0 0 0 16 5 16 5 0"></polygon><polygon points="16 0 16 16 11 16 11 0"></polygon></svg>`;
        }
    }
    function toggleMute(e) {
        e.preventDefault();
        video.muted = !video.muted;
    }
    function updateMuteButton() {
        if(video.muted) {
            toggleMuteBtn.classList.add('mute');
        }
        else {
            toggleMuteBtn.classList.remove('mute');
        }
    }
    function onSkipButtonClkick() {
        video.currentTime += parseFloat(this.dataset.skip);
    }
    function updateSliders() {
        video[this.name] = this.value;
    }
    function updateVideoBufferState() {
        const timeRanges = video.buffered;
        const currentTime = video.currentTime;
        let curTimeRange = 0;
        for (let i = 0; i < timeRanges.length; i++) {
            let end = timeRanges.end(i);
            let start = timeRanges.start(i);
            if (currentTime >= start && currentTime <= end) {
                curTimeRange = end;
                break;
            }
        }
        const percent = (curTimeRange / video.duration) * 100;
        bufferFilled.style.width = `${percent}%`;
    }
    function updateProgressBar() {
        const percent = (video.currentTime / video.duration) * 100;
        progressFilled.style.width = `${percent}%`;
        updateVideoBufferState();
        currentTimeDisplay.innerText = toHHMMSS(video.currentTime) + "/" + toHHMMSS(video.duration);
    }
    // ---------------------------------------------------
    function onVideoLoadedMetaData() {
        currentTimeDisplay.innerText = toHHMMSS(0) + "/" + toHHMMSS(video.duration);
        currentSourceQualityDisplay.innerText = video.videoHeight + 'p';
        updateProgressBar();
    };
    function onVideoVolumeChange() {
        const slider = document.querySelector('input[name="volume"]');
        slider.value = video.volume;
        updateMuteButton();
    }
    function onVideoRateChange() {
        playbackRateDisplay.innerText = '×' + parseFloat(video.playbackRate).toFixed(2);
    }
    function onTimelineClick(e) {
        const percent = timelineCalculatePercent(e);
        video.currentTime = percent / 100 * video.duration;
    }
    function showLoadingIndicator() {
        loadingIndicator.classList.remove('hidden');
    }
    function hideLoadingIndicator() {
        loadingIndicator.classList.add('hidden');
    }
    // ---------------------------------------------------
    // Event listeners
    // ---------------------------------------------------
    video.addEventListener('load', updateSliders);
    video.addEventListener('loadedmetadata', onVideoLoadedMetaData);
    video.addEventListener('timeupdate', updateProgressBar);
    video.addEventListener('volumechange', onVideoVolumeChange);
    video.addEventListener('ratechange', onVideoRateChange);
    //
    video.addEventListener('click', togglePlay);
    video.addEventListener('play', updatePlayButton);
    video.addEventListener('pause', updatePlayButton);
    //
    video.addEventListener('waiting', showLoadingIndicator);
    video.addEventListener('playing', hideLoadingIndicator);
    //
    togglePlayButton.addEventListener('click', togglePlay);
    toggleMuteBtn.addEventListener('click', toggleMute);
    toggleFullScreenButton.addEventListener('click', toggleFullscreen);
    //
    skipButtons.forEach(button => button.addEventListener('click', onSkipButtonClkick));
    //
    playerSliders.forEach(range => range.addEventListener('change', updateSliders));
    playerSliders.forEach(range => range.addEventListener('mousemove', updateSliders));
    //
    timeline_event_catcher.addEventListener('click', onTimelineClick);
    timeline_event_catcher.addEventListener('mousemove', (e) => {mouseDownState && onTimelineClick(e); playerDisplayTimelineTooltip(e)});
    timeline_event_catcher.addEventListener('mousedown', () => {mouseDownState = true});
    timeline_event_catcher.addEventListener('mouseup', () => {mouseDownState = false});
    // ---------------------------------------------------
    //     video.src = "https://hunzaboy.github.io/Ckin-Video-Player/ckin.mp4#t=10";
    // ---------------------------------------------------
    /*
    // ---------------------------------------------------
    const video = document.createElement('video');
    video.addEventListener('error', failed);
    video.setAttribute('id', 'cleaned_video');
    video.setAttribute('preload', 'metadata'); // none
    video.setAttribute('controls', '');
    video.setAttribute('webkitallowfullscreen', '');
    video.setAttribute('mozallowfullscreen', '');
    video.setAttribute('allowfullscreen', '');
    // video.setAttribute('onerror', 'failed(event);');
    // video.setAttribute('src', '');
    document.body.appendChild(video);
    // video.src = 'https://s902.vshare.io:440/s,128-1000-22-1-2191707-bkxdtksrwj/186745/351673/185658/ff-8840c3e48fc8f80f67eeacc4b3fc3cdbb94c86b4,5c584cc5,2f23e49_480.mp4';
    // ---------------------------------------------------
    */
    function initPlayer() {
        // console.clear();

        let paramStart, pageDomain;
        if (G_USE_AS_EXTENSION) {
            paramStart = /^.*?player\.html#/;
        }
        else {
            pageDomain = location.host.replace(/.*\.(.*\..*)/, '$1');
            paramStart = location.protocol + '//' + pageDomain + '/v/404/';
        };

        console.log('location.href: ' + location.href);
        console.log('paramStart: ' + paramStart);

        function shiftKeyIsDown() {return !!window.event.shiftKey;}
        function ctrlKeyIsDown() {return !!(window.event.ctrlKey || window.event.metaKey);}
        function altKeyIsDown() {return !!window.event.altKey;}

        const KEY_BACKSPACE = 8,
              KEY_TAB = 9,
              KEY_ENTER = 13,
              KEY_SHIFT = 16,
              KEY_CTRL = 17,
              KEY_ALT = 18,
              KEY_PAUSE_BREAK = 19,
              KEY_CAPS_LOCK = 20,
              KEY_ESCAPE = 27,
              KEY_PAGE_UP = 33,
              KEY_PAGE_DOWN = 34,
              KEY_END = 35,
              KEY_HOME = 36,
              KEY_LEFT_ARROW = 37,
              KEY_UP_ARROW = 38,
              KEY_RIGHT_ARROW = 39,
              KEY_DOWN_ARROW = 40,
              KEY_INSERT = 45,
              KEY_DELETE = 46,
              KEY_0 = 48,
              KEY_1 = 49,
              KEY_2 = 50,
              KEY_3 = 51,
              KEY_4 = 52,
              KEY_5 = 53,
              KEY_6 = 54,
              KEY_7 = 55,
              KEY_8 = 56,
              KEY_9 = 57,
              KEY_A = 65,
              KEY_B = 66,
              KEY_C = 67,
              KEY_D = 68,
              KEY_E = 69,
              KEY_F = 70,
              KEY_G = 71,
              KEY_H = 72,
              KEY_I = 73,
              KEY_J = 74,
              KEY_K = 75,
              KEY_L = 76,
              KEY_M = 77,
              KEY_N = 78,
              KEY_O = 79,
              KEY_P = 80,
              KEY_Q = 81,
              KEY_R = 82,
              KEY_S = 83,
              KEY_T = 84,
              KEY_U = 85,
              KEY_V = 86,
              KEY_W = 87,
              KEY_X = 88,
              KEY_Y = 89,
              KEY_Z = 90,
              KEY_LEFT_WINDOW_KEY = 91,
              KEY_RIGHT_WINDOW_KEY = 92,
              KEY_SELECT_KEY = 93,
              KEY_NUMPAD_0 = 96,
              KEY_NUMPAD_1 = 97,
              KEY_NUMPAD_2 = 98,
              KEY_NUMPAD_3 = 99,
              KEY_NUMPAD_4 = 100,
              KEY_NUMPAD_5 = 101,
              KEY_NUMPAD_6 = 102,
              KEY_NUMPAD_7 = 103,
              KEY_NUMPAD_8 = 104,
              KEY_NUMPAD_9 = 105,
              KEY_MULTIPLY = 106,
              KEY_ADD = 107,
              KEY_SUBTRACT = 109,
              KEY_DECIMAL_POINT = 110,
              KEY_DIVIDE = 111,
              KEY_F1 = 112,
              KEY_F2 = 113,
              KEY_F3 = 114,
              KEY_F4 = 115,
              KEY_F5 = 116,
              KEY_F6 = 117,
              KEY_F7 = 118,
              KEY_F8 = 119,
              KEY_F9 = 120,
              KEY_F10 = 121,
              KEY_F11 = 122,
              KEY_F12 = 123,
              KEY_NUM_LOCK = 144,
              KEY_SCROLL_LOCK = 145,
              KEY_SEMI_COLON = 186,
              KEY_EQUAL_SIGN = 187,
              KEY_COMMA = 188,
              KEY_DASH = 189,
              KEY_PERIOD = 190,
              KEY_FORWARD_SLASH = 191,
              KEY_GRAVE_ACCENT = 192,
              KEY_OPEN_BRACKET = 219,
              KEY_BACK_SLASH = 220,
              KEY_CLOSE_BRACKET = 221,
              KEY_SINGLE_QUOTE = 222
        ;

        function msgbox(title, message, time, width, height) {
            width = width || 250;
            height = height || 120;

            const padding = 10;
            const w = width - padding*2,
                  h = height - padding*2;

            const centerX = function(e, fix) {
                let transform = e.style.transform;
                transform = transform + (fix ? 'translateY(0.5px) translateX(-50%)' : 'translateX(-50%)');
                e.style.left = 50 + '%';
                e.style['-ms-transform'] = transform;
                e.style['-moz-transform'] = transform;
                e.style['-webkit-transform'] = transform;
                e.style.transform = transform;
            };
            const centerY = function(e, fix) {
                let transform = e.style.transform;
                transform = transform + (fix ? 'translateX(0.5px) translateY(-50%)' : 'translateY(-50%)');
                e.style.top = 50 + '%';
                e.style['-ms-transform'] = transform;
                e.style['-moz-transform'] = transform;
                e.style['-webkit-transform'] = transform;
                e.style.transform = transform;
            };

            const fade = function(element, fadeDelay) {
                fadeDelay = fadeDelay || 2000;
                const fadeDelaySeconds = Math.floor(fadeDelay/1000);
                function fadeStart(show) {
                    const transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                    element.style.opacity = show ? 1 : 0;
                    element.style.transition = transition;
                    element.style['-webkit-transition'] = transition; // Safari
                    if (!show) setTimeout(function(){element.remove();}, fadeDelay);
                }
                fadeStart(true);
                setTimeout(fadeStart, fadeDelaySeconds*1000);
            };

            const d = document.createElement('div');
            d.style.display = 'table';
            d.style.position = 'fixed';
            d.style.right = 10 + 'px';
            d.style.bottom = 10 + 'px';
            d.style.maxWidth = 90 + '%';
            d.style.maxHeight = 90 + '%';
            // d.style.padding = padding + 'px';
            d.style.width = w + 'px';
            d.style.height = 'auto';
            d.style.minHeight = h + 'px';
            d.style.setProperty('background', 'white', 'important');
            d.style.border = '2px solid black';
            d.style.zIndex = 2147483647;
            document.body.appendChild(d);

            // d.style.top = 50 + 'px';
            // centerX(d);

            if (title) {
                const titleElement = document.createElement('p');
                titleElement.style.borderBottom = '1px solid black';
                titleElement.style.margin = 0;
                titleElement.style.padding = (padding/2) + 'px';
                titleElement.style.setProperty('background', '#4CAF50', 'important');
                titleElement.style.setProperty('color', 'white', 'important');
                titleElement.innerText = title;
                d.appendChild(titleElement);
            }

            if (message) {
                const messageElement = document.createElement('p');
                messageElement.style.margin = 0;
                messageElement.style.padding = (padding/2) + 'px';
                messageElement.style.display = 'table-row';
                messageElement.style.textAlign = 'center';
                messageElement.style.verticalAlign = 'middle';
                messageElement.style.setProperty('color', 'black', 'important');
                messageElement.innerText = message;
                d.appendChild(messageElement);
            }

            if (time) fade(d, time);

            return d;
        }

        /*
        const toHHMMSS = function(secs) {
            const sec_num = parseInt(secs, 10);
            const hours = Math.floor(sec_num / 3600) % 24;
            const minutes = Math.floor(sec_num / 60) % 60;
            const seconds = sec_num % 60;
            return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":");
        };
        */

        function addMediaTextIndicator(media, fontSize) {
            fontSize = fontSize || 72;
            const mediaTextIndicator = document.createElement('div');
            mediaTextIndicator.style.setProperty('color', 'yellow', 'important');
            mediaTextIndicator.style['font-size'] = fontSize + 'px';
            mediaTextIndicator.style.position = 'absolute';
            mediaTextIndicator.style['z-index'] = 2147483647; // Always on TOP
            mediaTextIndicator.style.top = '0px';
            mediaTextIndicator.style.left = (fontSize/4) + 'px';
            mediaTextIndicator.style['-webkit-user-select'] = 'none';
            mediaTextIndicator.style['-ms-user-select'] = 'none';
            mediaTextIndicator.style['user-select: none;'] = 'none';
            mediaTextIndicator.style['-webkit-user-select'] = 'none';
            media.parentNode.insertBefore(mediaTextIndicator, media.nextSibling);
            const volumeTextFade = function(fadeDelay) {
                fadeDelay = fadeDelay || 2000;
                const fadeDelaySeconds = Math.floor(fadeDelay/1000);
                function textFadeStart(show) {
                    const transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                    mediaTextIndicator.style.opacity = show ? 1 : 0;
                    mediaTextIndicator.style.transition = transition;
                    mediaTextIndicator.style['-webkit-transition'] = transition; // Safari
                }
                textFadeStart(true);
                setTimeout(textFadeStart, fadeDelaySeconds*1000);
            };
            const setVolumeText = function() {
                volumeTextFade(2000);
                mediaTextIndicator.textContent = Math.round(media.volume * 100) > 0 ? Math.round(media.volume * 100) : 'Выкл.';
            };
            const setTimeText = function() {
                volumeTextFade(2000);
                const duration = media.duration;
                const currentTime = media.currentTime;
                mediaTextIndicator.textContent = (toHHMMSS(currentTime) + "/" + toHHMMSS(duration));
            };
            const addEventHandlers = function() {
                if (media.addEventListener) {
                    media.addEventListener("volumechange", setVolumeText, false); // IE9, Chrome, Safari, Opera
                    media.addEventListener("seeking", setTimeText, false); // IE9, Chrome, Safari, Opera
                }
                else {
                    media.attachEvent("onvolumechange", setVolumeText); // IE 6/7/8
                    media.attachEvent("onseeking", setTimeText); // IE 6/7/8
                }
            };
            setTimeout(addEventHandlers, 10);
            return mediaTextIndicator;
        }

        const mediaKeyboardControls = function(media) {
            const onKeyDown = function(e) {
                e = e || window.event;
                const lArrow = 37, rArrow = 39, kSpace = 32;
                const ctrlDown = e.ctrlKey || e.metaKey; // Mac support
                const mediaState = media.paused ? 0 : 1;
                setTimeout(function() {
                    if (e.keyCode == lArrow) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) - 5; if (mediaState == 1) media.play();
                    }
                    else if (e.keyCode == rArrow) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) + 5; if (mediaState == 1) media.play();
                    }
                    else if (e.keyCode == kSpace) {
                        if (mediaState == 1) media.pause(); else media.play();
                    }
                }, 10);
                e.preventDefault();
            };
            window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
        };

        function mediaMouseControls(media, step) {
            step = (step === 0) ? 0 : (step || 1);
            const mouseWheelAudioHandler = function(e) {
                if (step !== 0) {
                    // cross-browser wheel delta
                    e = window.event || e; // old IE support
                    const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                    const amount = parseInt(delta*step), volume = parseInt(media.volume*100);
                    const value = amount > 0 ? Math.floor((volume+amount)/step)*step : Math.ceil((volume+amount)/step)*step;
                    media.volume = Math.max(0, Math.min(100, value)) / 100;
                }
                e.preventDefault();
            };
            const mouseWheelTimeHandler = function(e) {
                if (step !== 0) {
                    // cross-browser wheel delta
                    e = window.event || e; // old IE support
                    const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                    const amount = parseInt(delta*step);
                    const mediaState = media.paused ? 0 : 1;
                    setTimeout(function() {
                        if (delta < 0) {
                            media.pause(); media.currentTime = parseInt(media.currentTime) - 5; if (mediaState == 1) media.play();
                        }
                        else if (delta > 0) {
                            media.pause(); media.currentTime = parseInt(media.currentTime) + 5; if (mediaState == 1) media.play();
                        }
                    }, 10);
                }
                e.preventDefault();
            };
            const mouseWheelHandler = function(e) {
                if (shiftKeyIsDown()) {
                    mouseWheelAudioHandler(e);
                }
                else {
                    mouseWheelTimeHandler(e);
                }
            };
            if (media.addEventListener) {
                media.addEventListener("mousewheel", mouseWheelHandler, false); // IE9, Chrome, Safari, Opera
                media.addEventListener("DOMMouseScroll", mouseWheelHandler, false); // Firefox
            }
            else {
                media.attachEvent("onmousewheel", mouseWheelAudioHandler); // IE 6/7/8
            }
            const mediaTextIndicator = addMediaTextIndicator(media, 56);
        }

        // Convert search param string into an object or array
        // '?startIndex=1&pageSize=10' -> {startIndex: 1, pageSize: 10}
        function processSearchParams(search, preserveDuplicates) {
            //  option to preserve duplicate keys (e.g. 'sort=name&sort=age')
            preserveDuplicates = preserveDuplicates || false; // disabled by default

            let outputNoDupes = {};
            let outputWithDupes = []; // optional output array to preserve duplicate keys

            //  sanity check
            if(!search) throw new Error('processSearchParams: expecting "search" input parameter');

            //  remove ? separator (?foo=1&bar=2 -> 'foo=1&bar=2')
            search = search.split('?')[1];

            //  split apart keys into an array ('foo=1&bar=2' -> ['foo=1', 'bar=2'])
            search = search.split('&');

            //  separate keys from values (['foo=1', 'bar=2'] -> [{foo:1}, {bar:2}])
            //  also construct simplified outputObj
            outputWithDupes = search.map(function(keyval){
                let out = {};
                keyval = keyval.split('=');
                out[keyval[0]] = keyval[1];
                outputNoDupes[keyval[0]] = keyval[1]; //  might as well do the no-dupe work too while we're in the loop
                return out;
            });

            return (preserveDuplicates) ? outputWithDupes : outputNoDupes;
        }

        // Break apart any path into parts
        // 'http://example.com:12345/blog/foo/bar?startIndex=1&pageSize=10' ->
        //     {
        //     "host": "example.com",
        //     "port": "12345",
        //     "search": {
        //         "startIndex": "1",
        //         "pageSize": "10"
        //     },
        //     "path": "/blog/foo/bar",
        //     "protocol": "http:"
        // }
        function getPathInfo(path) {
            //  create a link in the DOM and set its href
            const link = document.createElement('a');
            link.setAttribute('href', path);
            //  return an easy-to-use object that breaks apart the path
            return {
                host:     link.hostname, // 'example.com'
                port:     link.port, // 12345
                search:   processSearchParams(link.search || '?'), // {startIndex: 1, pageSize: 10}
                path:     link.pathname, // '/blog/foo/bar'
                protocol: link.protocol // 'http:'
            };
        };

        function getDomain(url, subdomain) {
            subdomain = subdomain || false;
            url = url.replace(/(https?:\/\/)?(www.)?/i, '');
            url = url.replace(/(.*?)\/.*/i, '$1');
            if (!subdomain) {
                url = url.split('.');
                url = url.slice(url.length - 2).join('.');
            }
            if (url.indexOf('/') !== -1) {
                return url.split('/')[0];
            }
            return url;
        }

        const mediaShowInfoBox = function(media) {
            const hosts = {
                "oloadcdn.net" : "openload.co",
                "phncdn.com" : "pornhub.com",
                "t8cdn.com" : "tube8.com",
                "playercdn.net" : "bitporno.com",
                "ahcdn.com" : "txxx.com | porndig.com",
                "userscontent.net" : "playvids.com",
                "trafficdeposit.com" : "yourporn.sexy",
                "cdnity.net" : "yourporn.sexy",
            };
            const showMsgBox = function(media) {
                const width = media.videoWidth, height = media.videoHeight;
                // console.log('media: '+media.src+' ['+width+'x'+height+']');
                let host = getPathInfo(media.src).host.replace(/^www\./, ''); // getDomain(media.src);
                host = hosts[host] ? host + '\n['+hosts[host]+']' : host;
                const msg = msgbox('Video', (width+' x '+height)+'\n'+host, 2000, 250, 120);
                msg.style.right = 0 + 'px';
                // msg.style.bottom = 32 + 'px';
                msg.style.top = 0 + 'px';
            };
            const onKeyDown = function(e) {
                e = e || window.event;
                const xKey = 88;
                const ctrlDown = e.ctrlKey || e.metaKey; // Mac support
                if (e.keyCode == xKey) {
                    media.focus();
                    showMsgBox(media);
                };
                if (e.keyCode == KEY_G && ctrlDown) {
                    let result = prompt('', toHHMMSS(video.currentTime || 0));
                    if (result === null) {return;}
                    video.currentTime = seconds(result);
                };
            };
            window.addEventListener('keydown', function(e){onKeyDown(e);}, false);
            media.addEventListener('loadedmetadata', function(e){
                showMsgBox(media);
                if (media.videoWidth) console.log('media: '+media.src+' ['+media.videoWidth+'x'+media.videoHeight+']');
            },false);
        };

        const useLocalVolumeCookie = function(mediaElementSelector, cookieName) {
            cookieName = cookieName || "media";
            let mediaVolume = localStorage.getItem(cookieName+"_volume");
            let mediaMuted = localStorage.getItem(cookieName+"_muted");
            if (mediaMuted == "false") mediaMuted = false; // normalize
            const mediaElementsArray = document.querySelectorAll(mediaElementSelector);
            for (let mediaElement of mediaElementsArray) {
                const saveSettings = function() {
                    localStorage.setItem(cookieName+"_volume", mediaElement.volume || 0);
                    localStorage.setItem(cookieName+"_muted", mediaElement.muted);
                };
                if (mediaVolume) mediaElement.volume = mediaVolume;
                mediaElement.muted = mediaMuted;
                mediaElement.addEventListener("volumechange", saveSettings, false);
                // console.log("mediaElement: ", mediaElement);
                // console.log("localStorage."+cookieName+"_volume: ", localStorage.getItem(cookieName+"_volume"));
                // console.log("localStorage."+cookieName+"_muted: ", localStorage.getItem(cookieName+"_muted"));
            };
        };

        const useGMVolumeCookie = function(mediaElementSelector, cookieName) {
            cookieName = cookieName || "media";
            let mediaVolume = GM_getValue(cookieName+"_volume");
            let mediaMuted = GM_getValue(cookieName+"_muted");
            if (mediaMuted == "false") mediaMuted = false; // normalize
            const mediaElementsArray = document.querySelectorAll(mediaElementSelector);
            for (let mediaElement of mediaElementsArray) {
                let saveSettings = function() {
                    GM_setValue(cookieName+"_volume", mediaElement.volume || 0);
                    GM_setValue(cookieName+"_muted", mediaElement.muted);
                };
                if (mediaVolume) mediaElement.volume = mediaVolume;
                mediaElement.muted = mediaMuted;
                mediaElement.addEventListener("volumechange", saveSettings, false);
                // console.log("mediaElement: ", mediaElement);
                // console.log("GM_getValue("+cookieName+"_volume): ", GM_getValue(cookieName+"_volume"));
                // console.log("GM_getValue("+cookieName+"_muted): ", GM_getValue(cookieName+"_muted"));
            }
        };

        function GetFirstCustomKey(searchArray, customKeysArray) {
            for (let i in searchArray) {
                if (customKeysArray.indexOf(searchArray[i]) > -1) {
                    return i;
                };
            };
            return;
        };

        function getParamsFromURL(searchString) {
            const customKeysArray = ['autoplay', '#t', 'qualityLimit', 'reflect', 'jjs'];
            const parse = function(params, pairs) {
                const pair = pairs[0];
                const parts = pair.split('=');
                // const key = decodeURIComponent(parts[0]).replace(/.*?\?/, '');
                const key = decodeURIComponent(parts[0]).replace(/.*?[?#]/, '');
                const value = decodeURIComponent(parts.slice(1).join('='));
                // Handle multiple parameters of the same name
                if (typeof params[key] === "undefined") params[key] = value;
                else params[key] = [].concat(params[key], value);
                params = pairs.length == 1 ? params : parse(params, pairs.slice(1));
                params.main_url = searchString;
                // params.main_url = params.main_url.replace(/&thumb_src=.*/, '');
                const firstCustomKeyIndex = GetFirstCustomKey(Object.keys(params), customKeysArray);
                // console.log('firstCustomKeyIndex = ' + firstCustomKeyIndex);
                if (firstCustomKeyIndex) {
                    const firstCustomKey = Object.keys(params)[firstCustomKeyIndex];
                    // const startSymbol = (firstCustomKeyIndex == 0) ? '\\[?' : '&';
                    const startSymbol = (firstCustomKeyIndex == 0) ? '[?#]' : '&';
                    const re = new RegExp(startSymbol + firstCustomKey + '.*');
                    params.main_url = searchString.replace(re, '');
                    params.first_key = firstCustomKey;
                };
                return params;
            };
            // Get rid of leading ?
            return searchString.length === 0 ? {} : parse({}, searchString.split('&')); // .substr(1)
        };

        // let url = location.href.split("#")[1].replace(/[?#&]\bREFINE_VIDEO\b/, '');

        // let url = location.href.split(paramStart)[1];
        let url = location.href.replace(paramStart, '');
        if (url && typeof url !== 'undefined') {url = url.replace(/[?#&]\bREFINE_VIDEO\b/, '');}

        function listParams(obj) {for(let i in obj){console.log(i + "=" + obj[i]);}}

        if (url) {
            console.log('url: ', url);
            const video = document.querySelector("body video");
            console.log('video: ', video);
            if (video) {
                // let event = new Event('click');
                // video.dispatchEvent(event);
                //
                const href = location.href.replace(paramStart, ''); // location.href.split(paramStart)[1];
                console.log('href: ', href);
                const params = getParamsFromURL(href); // getParamsFromURL(location.search)
                console.log('params: ', params);
                listParams(params);
                if (params.autoplay && params.autoplay == 'true') {
                    video.setAttribute('autoplay', '');
                };
                // if (params.thumb_src) {G_progressThumbnailSrc = params.thumb_src;};
                let videoSrc = params.main_url;
                if (params.t) videoSrc = videoSrc + '#t=' + params.t;
                if (params.reflect) {
                    video.style.transform = 'rotateY(' + params.reflect + ')';
                    video.style['-webkit-transform'] = 'rotateY(' + params.reflect + ')';
                    video.style['-moz-transform'] = 'rotateY(' + params.reflect + ')';
                };
                let jjs = params.jjs;
                if (jjs) {
                    const videoSizeOptions = player.querySelector('.video-size-options > .background');
                    // videoSrc = videoSrc.replace(jjs, '');
                    let data = JSON.parse(decodeURIComponent(jjs)); // JSON.parse(decodeURI(jjs));
                    let sources = [];
                    let lowestQuality = 9999;
                    for (let item of Object.keys(data)) {
                        if (item) {
                            let qualityMatch = item.match(/^(\d+)$/);
                            if (qualityMatch) {
                                let url = data[item];
                                let quality = parseInt(item);
                                if (lowestQuality > quality) lowestQuality = quality;
                                let source = document.createElement('source');
                                // <source src="//s49.bigcdn.cc/pubs/5eb5ce70d0fa8/360.mp4" title="360p" type="video/mp4">
                                source.setAttribute('src', url);
                                source.setAttribute('title', quality+'p');
                                source.setAttribute('type', 'video/mp4');
                                video.appendChild(source);
                                sources.push(source);
                            };
                        };
                    };
                    if (lowestQuality < 9999) G_progressThumbnailSrc = data[lowestQuality];
                    if (videoSizeOptions) {
                        for (let source of sources) {
                            let btn = document.createElement('span');
                            btn.onclick = function() {
                                if (video.currentSrc !== source.src) {
                                    let time = video.currentTime;
                                    video.src = source.src;
                                    video.currentTime = time;
                                };
                            };
                            videoSizeOptions.appendChild(btn);
                            btn.innerText = source.title ? source.title : '-----' ;
                        };
                    };
                };
                video.setAttribute('autoplay', '');
                video.setAttribute('src', videoSrc);
                console.log('src: ', videoSrc);
                mediaKeyboardControls(video);
                mediaMouseControls(video, 5);
                mediaShowInfoBox(video);
                if (G_USE_AS_EXTENSION) {
                    useLocalVolumeCookie("body video", "video");
                }
                else {
                    useGMVolumeCookie("body video", "video");
                };
                window.addEventListener('message', function(e) {
                    if(e.data.sender === 'QUESTION') {
                        setTimeout(function() {
                            window.top.postMessage({
                                sender: 'ANSWER',
                                // data: {
                                duration: video.duration,
                                currentTime: video.currentTime,
                                videoWidth: video.videoWidth,
                                videoHeight: video.videoHeight,
                                // }
                            }, '*');
                        }, 50);
                    }
                });
            }
        }
    };
    initPlayer();
    // ---------------------------------------------------
    // video.src = 'https://vshare.io/err105.mp4?error=expired&#t=5';
})();
