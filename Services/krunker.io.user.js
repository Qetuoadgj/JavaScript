// ==UserScript==
// @name         krunker.io
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @version      1.0.3
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/krunker.io.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-end
// @noframes
// @match        *://krunker.io/*
// @match        file:///*/JavaScript/Services/reticle.test.page.txt.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    localStorage.classindex = localStorage.classindex || "2";
    localStorage.consent = localStorage.consent || "1";
    localStorage.krk_record = localStorage.krk_record || "false";
    localStorage.kro_setngss_aimSensitivity = localStorage.kro_setngss_aimSensitivity || "1.6";
    localStorage.kro_setngss_ambientShading = localStorage.kro_setngss_ambientShading || "false";
    localStorage.kro_setngss_canLoadMods = localStorage.kro_setngss_canLoadMods || "false";
    localStorage.kro_setngss_crosshairColor = localStorage.kro_setngss_crosshairColor || "#00ff00";
    localStorage.kro_setngss_crosshairShadow = "#ff0000";
    localStorage.kro_setngss_fov = localStorage.kro_setngss_fov || "95";
    localStorage.kro_setngss_fpsFOV = localStorage.kro_setngss_fpsFOV || "95";
    localStorage.kro_setngss_muzzleFlash = localStorage.kro_setngss_muzzleFlash || "false";
    localStorage.kro_setngss_particles = localStorage.kro_setngss_particles || "false";
    localStorage.kro_setngss_resolution = localStorage.kro_setngss_resolution || "1";
    localStorage.kro_setngss_sensitivity = localStorage.kro_setngss_sensitivity || "1.6";
    localStorage.kro_setngss_sound = localStorage.kro_setngss_sound || "0.3";
    localStorage.kro_setngss_weaponBob = localStorage.kro_setngss_weaponBob || "0";
    localStorage.krunker_streamMode = localStorage.krunker_streamMode || "false";
    localStorage.sprayindex = localStorage.sprayindex || "12";
    //
    localStorage.color = localStorage.color || localStorage.kro_setngss_crosshairShadow || "#ff0000";
    // document.addEventListener('DOMContentLoaded', function(){
    var parentElement = 0; parentElement = document.querySelector('.icon[role=presentation]');
    parentElement = document.querySelector('#gameContainer > canvas');
    var scale_radius = 1.0 * 0.5; //0.6;
    var scale_thickness = 1.1;
    //
    var showCanvas = true;
    //
    var showCanvasBorders = 0;
    var lineWidth = 1.0;
    var globalOpacity = 1;
    var lineColor = "orange";
    var scaleValue = 24;
    var showCicleMark = 0; // 1
    var cicleMarkGap = 0.4;
    var cicleMark = [0.50 + cicleMarkGap / 2, 2.50 - cicleMarkGap / 2];
    var dotRadiusPX = 6; //1.25*1.25;
    var dotColor = lineColor;
    var dotOpacity = 1;
    var dotFill = 0; // 1
    var shade = 1;
    //
    showCicleMark = 1;
    cicleMarkGap = 0.4;
    scaleValue = 24;
    lineWidth = 1.2;
    lineColor = "Orange";
    dotColor = "Orange";
    dotRadiusPX = 1.0;
    dotFill = 1;
    //
    showCicleMark = 1;
    cicleMarkGap = 0.4;
    scaleValue = 24 * scale_radius;
    lineWidth = 1.5 * scale_thickness;
    lineColor = "Orange";
    dotColor = "Orange";
    dotRadiusPX = 1.0 + lineWidth / 2 * 1 * 3;
    dotFill = 0;
    globalOpacity = 1 ; //* 0.75;
    shade = 1; // * 0;
    //
    var mode = 0;
    showCicleMark = 1;
    //
    lineColor = localStorage.kro_setngss_crosshairColor;
    dotColor = localStorage.kro_setngss_crosshairColor;
    //
    cicleMark = [0.50 + cicleMarkGap / 2, 2.50 - cicleMarkGap / 2];
    // Your code here...
    var canvas_id = "canvas_1";
    var canvas = document.getElementById(canvas_id);
    if (canvas) { canvas.remove(); canvas = null; }
    if (!canvas) {
        canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.id = canvas_id;
    }
    canvas.style.display = 'inline-block';
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '2147483648';
    canvas.style.boxSizing = 'border-box';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    // canvas.style.width = '250px';
    // canvas.style.height = '250px';
    canvas.width = Math.min(window.innerWidth, window.innerHeight) - 1; // defaultRadius;
    canvas.height = canvas.width; //window.innerHeight-1; //defaultRadius;
    if (showCanvasBorders) {
        canvas.style.border = '10px';
        canvas.style.borderColor = 'red';
        canvas.style.borderStyle = 'solid';
        canvas.style.borderWidth = 'thin';
    }
    canvas.style.opacity = globalOpacity;
    canvas.style.pointerEvents = 'none'; // click through
    //
    function drawArc(context, x, y, radius, angleStart, angleEnd, lineColor, lineWidth, fill, fillColor, opacity) {
        context.globalAlpha = opacity;
        context.beginPath();
        context.arc(x, y, radius, angleStart, angleEnd, false);
        context.fillStyle = fillColor;
        if (fill) context.fill();
        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        context.lineCap = "round";
        context.stroke();
        context.globalAlpha = 1.0;
    }
    //
    function drawChevron(context, x, y, radius, angleStart, angleEnd, lineColor, lineWidth, fill, fillColor, opacity) {
        context.globalAlpha = opacity;
        context.beginPath();
        context.moveTo(x-radius/(2*Math.sqrt(2)), y+radius/2);
        context.lineTo(x, y);
        context.moveTo(x+radius/(2*Math.sqrt(2)), y+radius/2);
        context.lineTo(x, y);
        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        context.lineCap = "round";
        context.stroke();
        context.globalAlpha = 1.0;
    }
    //
    function drawCanvas(canvas, parentElement) {
        // Get context
        var context = canvas.getContext('2d');
        // center
        var x = canvas.width / 2;
        var y = canvas.height / 2;
        // remove aliasing
        x = Math.floor(x) + 0.5;
        y = Math.floor(y) + 0.5;
        //
        context.strokeWidth = lineWidth;
        //
        var radius = dotRadiusPX/2 ;//lineWidth / 2 ; //dotRadiusPX - lineWidth / 2;
        // if (shade) drawArc(context, x, y, radius, (0.50 + 0 / 2) * Math.PI, (2.50 - 0 / 2) * Math.PI, "Red", lineWidth * 1, 0, "Red", dotOpacity * 0.5);
        // drawArc(context, x, y, radius, (0.50 + 0 / 2) * Math.PI, (2.50 - 0 / 2) * Math.PI, dotColor, lineWidth, 0, dotColor, dotOpacity);
        if (shade) drawArc(context, x, y, radius, (0.50 + 0 / 2) * Math.PI, (2.50 - 0 / 2) * Math.PI, localStorage.color, lineWidth * 2.0, 0, "Red", dotOpacity * 0.5);
        drawArc(context, x, y, radius, (0.50 + 0 / 2) * Math.PI, (2.50 - 0 / 2) * Math.PI, /*"White"*/ lineColor, lineWidth, 0, lineColor, dotOpacity);
        if (mode == 1) {
            var offsetY = 4;
            radius = scaleValue * 0.50 * 2; // * 2; // - o.lineWidth/2; // 10 * 1.5; //o.dotRadiusPX - o.lineWidth/2;
            if (shade) drawChevron(context, x, y+offsetY, radius, (0.50 + 0 / 2) * Math.PI, (2.50 - 0 / 2) * Math.PI, "Red", lineWidth * 2.0, 0, "Red", dotOpacity * 0.5);
            drawChevron(context, x, y+offsetY, radius, (0.50 + 0 / 2) * Math.PI, (2.50 - 0 / 2) * Math.PI, lineColor, lineWidth, 0, lineColor, dotOpacity);
            showCicleMark = 0;
        }
        if (showCicleMark) {
            radius = scaleValue * 0.50 * 2; // - o.lineWidth/2; // 10 * 1.5; //o.dotRadiusPX - o.lineWidth/2;
            if (shade) drawArc(context, x, y, radius, cicleMark[0] * Math.PI, cicleMark[1] * Math.PI, localStorage.color, lineWidth * 2.5, 0, "Red", dotOpacity * 0.5);
            drawArc(context, x, y, radius, cicleMark[0] * Math.PI, cicleMark[1] * Math.PI, lineColor, lineWidth, 0, lineColor, dotOpacity);
        }
        if (parentElement) {
            var rect = parentElement.getBoundingClientRect();
            var rect_center_x = rect.left + rect.width/2, rect_center_y = rect.top + rect.height/2;
            canvas.style.left = rect_center_x + "px";
            canvas.style.top = rect_center_y + "px";
            console.log(rect_center_x+', '+rect_center_y);
            // canvas.style.zoom = 1;
        }
    }
    function clearCanvas(canvas) {
        // Get context
        var context = canvas.getContext('2d');
        //
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    //
    var KEY_BACKSPACE = 8,
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
        KEY_SINGLE_QUOTE = 222;
    //
    function onKeyDown(e, code) {
        e = e || window.event;
        var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
        var shiftDown = !!window.event.shiftKey;
        var targetType = e.target.tagName.toLowerCase();
        if (code) e.keyCode = code;
        if (!(targetType == 'input' || targetType == 'textarea')) {
            if (e.keyCode == KEY_ADD) {
                // console.log("showCanvas: " + showCanvas);
                if (showCanvas == false) {
                    clearCanvas(canvas);
                } else {
                    clearCanvas(canvas);
                    drawCanvas(canvas, parentElement);
                }
                showCanvas = !showCanvas;
                e.preventDefault();
            }
        }
    }
    if (!window.statusReady || typeof window.statusReady == "undefined") {
        window.addEventListener('keydown', function(e) {
            onKeyDown(e);
        }, false);
        window.statusReady = true;
    }
    //
    if (showCanvas) {drawCanvas(canvas, parentElement); showCanvas = !showCanvas;}
    // });
})();