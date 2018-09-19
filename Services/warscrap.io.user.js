// ==UserScript==
// @name         warscrap.io
// @icon         https://www.google.com/s2/favicons?domain=warscrap.io
// @version      1.0.2
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/warscrap.io.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-end
// @noframes
// @match        *://warscrap.io
// @match        *://cache.armorgames.com/files/games/warscrap-18371/index.html*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var isOdd = function(x) { return x & 1; };
    var isEven = function(x) { return !( x & 1 ); };

    var showCanvasBorders = 0;
    var globalOpacity = 1.0;
    var o = new Object();
    var colorTable = ['lightgray', 'LawnGreen', 'red'];
    o.colorIndex = 1;
    //
    o.scaleValue = 24;
    o.scaleValueDefault = o.scaleValue;
    o.lineHeight1 = 12/4;
    o.lineHeight2 = 12/4;
    //
    o.lineWidth = 2;
    o.lineOpacity = 1.0; //0.25;
    o.lineOpacityDefault = o.lineOpacity;
    //
    o.dotRadiusPX = 1.25;
    o.dotOpacity = o.lineOpacity; // 0.5; //0.2;
    o.dotOpacityDefault = o.dotOpacity;
    //
    o.opacityStep = 0.2; //0.25;
    o.scaleStep = o.scaleValue / 2; //0.25;
    //
    o.lineColor1 = colorTable[o.colorIndex]; // colorTable[o.colorIndex]; //'red'; //'lightgray';
    o.lineColor2 = colorTable[0];
    o.dotColor = colorTable[1]; // o.lineColor1; //'aqua';
    //
    o.showCicleMark = false;
    o.showVerticalScale = false;
    //
    // Your code here...
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.id = "canvas_1";
    canvas.style.display = 'inline-block';
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '2147483648';
    canvas.style.boxSizing = 'border-box';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    // canvas.style.width = '250px';
    // canvas.style.height = '250px';
    canvas.width = Math.min(window.innerWidth, window.innerHeight)-1; // defaultRadius;
    canvas.height = canvas.width; //window.innerHeight-1; //defaultRadius;
    if (showCanvasBorders) {
        canvas.style.border = '10px';
        canvas.style.borderColor = 'red';
        canvas.style.borderStyle = 'solid';
        canvas.style.borderWidth = 'thin';
    }
    canvas.style.opacity = globalOpacity;
    canvas.style.pointerEvents = 'none'; // click through

    var context = canvas.getContext('2d');

    // center
    var x = canvas.width / 2;
    var y = canvas.height / 2;

    // remove aliasing
    x = Math.floor(x) + 0.5;
    y = Math.floor(y) + 0.5;

    context.strokeWidth = o.lineWidth;

    function addVerticalBars(distFromCenter, barSize) {
        context.moveTo(x - distFromCenter, y - barSize);
        context.lineTo(x - distFromCenter, y + barSize);
        context.moveTo(x + distFromCenter, y - barSize);
        context.lineTo(x + distFromCenter, y + barSize);
    }

    function addHorizontalBars(distFromCenter, barLen) {
        context.moveTo(x - distFromCenter, y);
        context.lineTo(x - (distFromCenter + barLen), y);
        context.moveTo(x + distFromCenter, y);
        context.lineTo(x + (distFromCenter + barLen), y);
    }

    function addVerticalAdjust(adj, barLen) {
        context.moveTo(x - barLen/2, y + adj);
        context.lineTo(x + barLen/2, y + adj);
    }

    function drawCanvas(canvas) {
        var horBarLen = 0;
        /*
        for (var i = 0; i < 5; i++) {
            addVerticalBars(scaleValue*(i+1), o.lineHeight1);
            horBarLen += scaleValue;
        }
        addHorizontalBars(scaleValue/2, horBarLen);
        */

        /*
        context.globalAlpha = o.lineOpacity;
        context.beginPath();
        context.strokeStyle = o.lineColor1 || 'white';
        context.lineWidth = o.lineWidth;
        addVerticalBars(o.scaleValue*1, o.lineHeight1);
        context.stroke();
        context.globalAlpha = 1.0;
        */

        /*
        context.globalAlpha = o.lineOpacity;
        context.beginPath();
        context.strokeStyle = o.lineColor2 || 'white';
        context.lineWidth = o.lineWidth;
        addVerticalBars(o.scaleValue*0.5, o.lineHeight2);
        context.stroke();
        context.globalAlpha = 1.0;
        */

        /*
        context.globalAlpha = o.lineOpacity;
        context.beginPath();
        context.strokeStyle = o.lineColor2 || 'white';
        context.lineWidth = o.lineWidth;
        addVerticalBars(o.scaleValue*0.5*3, o.lineHeight2);
        context.stroke();
        context.globalAlpha = 1.0;
        */

        /*
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = (canvas.height /2) - o.lineWidth/2;
        */

        var radius = o.dotRadiusPX - o.lineWidth/2;
        context.globalAlpha = o.dotOpacity;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = o.dotColor;
        context.fill();
        context.lineWidth = o.lineWidth;
        context.strokeStyle = o.dotColor;
        context.stroke();
        context.globalAlpha = 1.0;

        ///*
        if (o.showCicleMark) {
            radius = o.scaleValue * 0.75; // - o.lineWidth/2; // 10 * 1.5; //o.dotRadiusPX - o.lineWidth/2;
            context.globalAlpha = o.dotOpacity;
            context.beginPath();
            context.arc(x, y, radius, 0.75 * Math.PI, 2.25 * Math.PI, false);
            // context.fillStyle = o.dotColor;
            // context.fill();
            context.lineCap="round";
            context.lineWidth = o.lineWidth;
            context.strokeStyle = o.dotColor;
            context.stroke();
            context.globalAlpha = 1.0;
        }
        //*/

        var i;
        for (i = 0; i < 3; i++) {
            context.globalAlpha = o.dotOpacity;
            context.beginPath();
            context.lineCap="square";
            context.lineWidth = o.lineWidth;
            context.strokeStyle = isEven(i+1) ? o.lineColor1 : o.lineColor2;
            var lineHeight = isEven(i+1) ? o.lineHeight1 : 0.5;
            addVerticalBars(o.scaleValue*(i+1)*0.5, lineHeight);
            context.stroke();
            context.globalAlpha = 1.0;
        }

        // /*
        if (o.showVerticalScale) {
            for (i = 0; i < 20; i++) {
                context.globalAlpha = o.dotOpacity;
                context.beginPath();
                var lineWidth = isEven(i+1) ? o.lineHeight1*2 : 0.5; // o.scaleValueDefault/((i+1)*3)
                addVerticalAdjust(o.scaleValueDefault*(i+0)*2, lineWidth);
                context.lineCap="square";
                context.lineWidth = o.lineWidth;
                context.strokeStyle = isEven(i+1) ? o.lineColor1 : o.lineColor2;
                context.stroke();
                context.globalAlpha = 1.0;
            }
        }
        // */
    }
    drawCanvas(canvas);

    function addMouseWheelHandler(element, onB, onF, preventDefaultB, preventDefaultF) {
        var mouseScroll = (e) => {
            // cross-browser wheel delta
            e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            if (delta > 0) {
                onF();
                if (preventDefaultF) e.preventDefault();
            }
            else if (delta < 0) {
                onB();
                if (preventDefaultB) e.preventDefault();
            }
        };
        if (element.addEventListener) {
            element.addEventListener("mousewheel", mouseScroll, false); // IE9, Chrome, Safari, Opera
            element.addEventListener("DOMMouseScroll", mouseScroll, false); // Firefox
        } else {
            element.attachEvent("onmousewheel", mouseScroll); // IE 6/7/8
        }
    }

    function ChangeValue(varName, q, def, min, max)
    {
        o[varName] += q;
        o[varName] = Math.max(Math.min(o[varName], max), min);
        console.clear();
        console.log('o['+varName+'] = ' + o[varName]);
    }
    function RedrawCanvas(canvas)
    {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCanvas(canvas);
    }

    function shiftKeyIsDown() {return !!window.event.shiftKey;}
    function ctrlKeyIsDown() {return !!(window.event.ctrlKey || window.event.metaKey);}
    function altKeyIsDown() {return !!window.event.altKey;}

    function ChangeScaleValue(dir)
    {
        if (dir < 0) dir = -1; else dir = 1;
        ChangeValue('scaleValue', dir * o.scaleStep, o.scaleValueDefault, o.scaleValueDefault, o.scaleValueDefault*8)
        RedrawCanvas(canvas)
    }
    function ChangeScaleOpacity(dir)
    {
        if (dir < 0) dir = -1; else dir = 1;
        if ((dir < 0) && (o.lineOpacity <= o.opacityStep || o.lineOpacity == 0)) {
            o.lineOpacity = 0;
            o.dotOpacity = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        else {
            ChangeValue('lineOpacity', dir * o.opacityStep, o.lineOpacityDefault, o.opacityStep, 1.0)
            ChangeValue('dotOpacity', dir * o.opacityStep, o.dotOpacityDefault, o.opacityStep, 1.0)
            RedrawCanvas(canvas)
        }
    }

    function cycleColors()
    {
        o.colorIndex++
        o.colorIndex = o.colorIndex >= colorTable.length ? 0 : o.colorIndex;
        var color = colorTable[o.colorIndex];
        o.lineColor1 = color;
        // o.lineColor2 = color;
        // o.dotColor = color;
        RedrawCanvas(canvas);
    }

    /*
    addMouseWheelHandler(window, function(e) {
        var dir = -1;
        if (shiftKeyIsDown()) {
            ChangeScaleValue(dir)
            e.preventDefault();
        }
        else if (altKeyIsDown()) {
            ChangeScaleOpacity(dir)
            e.preventDefault();
        }
    }, function(e) {
        var dir = 1;
        if (shiftKeyIsDown()) {
            ChangeScaleValue(dir)
            e.preventDefault();
        }
        else if (altKeyIsDown()) {
            ChangeScaleOpacity(dir)
            e.preventDefault();
        }
    }, true, true);
    */

    var KEY_BACKSPACE = 8, KEY_TAB = 9, KEY_ENTER = 13, KEY_SHIFT = 16, KEY_CTRL = 17, KEY_ALT = 18, KEY_PAUSE_BREAK = 19, KEY_CAPS_LOCK = 20, KEY_ESCAPE = 27, KEY_PAGE_UP = 33, KEY_PAGE_DOWN = 34, KEY_END = 35, KEY_HOME = 36, KEY_LEFT_ARROW = 37, KEY_UP_ARROW = 38, KEY_RIGHT_ARROW = 39, KEY_DOWN_ARROW = 40, KEY_INSERT = 45, KEY_DELETE = 46, KEY_0 = 48, KEY_1 = 49, KEY_2 = 50, KEY_3 = 51, KEY_4 = 52, KEY_5 = 53, KEY_6 = 54, KEY_7 = 55, KEY_8 = 56, KEY_9 = 57, KEY_A = 65, KEY_B = 66, KEY_C = 67, KEY_D = 68, KEY_E = 69, KEY_F = 70, KEY_G = 71, KEY_H = 72, KEY_I = 73, KEY_J = 74, KEY_K = 75, KEY_L = 76, KEY_M = 77, KEY_N = 78, KEY_O = 79, KEY_P = 80, KEY_Q = 81, KEY_R = 82, KEY_S = 83, KEY_T = 84, KEY_U = 85, KEY_V = 86, KEY_W = 87, KEY_X = 88, KEY_Y = 89, KEY_Z = 90, KEY_LEFT_WINDOW_KEY = 91, KEY_RIGHT_WINDOW_KEY = 92, KEY_SELECT_KEY = 93, KEY_NUMPAD_0 = 96, KEY_NUMPAD_1 = 97, KEY_NUMPAD_2 = 98, KEY_NUMPAD_3 = 99, KEY_NUMPAD_4 = 100, KEY_NUMPAD_5 = 101, KEY_NUMPAD_6 = 102, KEY_NUMPAD_7 = 103, KEY_NUMPAD_8 = 104, KEY_NUMPAD_9 = 105, KEY_MULTIPLY = 106, KEY_ADD = 107, KEY_SUBTRACT = 109, KEY_DECIMAL_POINT = 110, KEY_DIVIDE = 111, KEY_F1 = 112, KEY_F2 = 113, KEY_F3 = 114, KEY_F4 = 115, KEY_F5 = 116, KEY_F6 = 117, KEY_F7 = 118, KEY_F8 = 119, KEY_F9 = 120, KEY_F10 = 121, KEY_F11 = 122, KEY_F12 = 123, KEY_NUM_LOCK = 144, KEY_SCROLL_LOCK = 145, KEY_SEMI_COLON = 186, KEY_EQUAL_SIGN = 187, KEY_COMMA = 188, KEY_DASH = 189, KEY_PERIOD = 190, KEY_FORWARD_SLASH = 191, KEY_GRAVE_ACCENT = 192, KEY_OPEN_BRACKET = 219, KEY_BACK_SLASH = 220, KEY_CLOSE_BRACKET = 221, KEY_SINGLE_QUOTE = 222;
    var showCanvas = true;
    function onKeyDown(e, code) {
        e = e || window.event;
        var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
        var shiftDown = !!window.event.shiftKey;
        var targetType = e.target.tagName.toLowerCase();
        if (code) e.keyCode = code;
        if (!(targetType == 'input' || targetType == 'textarea')) {

            if (e.keyCode == KEY_OPEN_BRACKET) {
                if (showCanvas == false) {context.clearRect(0, 0, canvas.width, canvas.height);} else {drawCanvas(canvas);}
                showCanvas = !showCanvas;
                // e.preventDefault();
            }

            var dir;
            if (e.keyCode == KEY_ADD) {
                dir = 0+1;
                // if (shiftKeyIsDown()) {ChangeScaleValue(dir)} else {
                ChangeScaleOpacity(dir);
                // }
                e.preventDefault();
            }
            else if (e.keyCode == KEY_SUBTRACT) {
                dir = 0-1;
                // if (shiftKeyIsDown()) {ChangeScaleValue(dir)} else {
                ChangeScaleOpacity(dir);
                // }
                e.preventDefault();
            }

            else if ((e.keyCode == KEY_Q) && shiftKeyIsDown()) {
                dir = 0-1;
                ChangeScaleValue(dir);
                e.preventDefault();
            }
            else if ((e.keyCode == KEY_E) && shiftKeyIsDown()) {
                dir = 0+1;
                ChangeScaleValue(dir);
                e.preventDefault();
            }

            else if (e.keyCode == KEY_MULTIPLY) {
                cycleColors()
                e.preventDefault();
            }

            else if (e.keyCode == KEY_CLOSE_BRACKET) {
                /*
                // Clear the canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                // Move registration point to the center of the canvas
                context.translate(canvas.width/2, canvas.width/2);
                // Rotate 90 degree
                context.rotate(90*Math.PI/180);
                // Move registration point back to the top left corner of canvas
                context.translate(-canvas.width/2, -canvas.width/2);
                drawCanvas(canvas);
                */
                //
                o.showVerticalScale = ! o.showVerticalScale;
                RedrawCanvas(canvas);
            }
            // e.preventDefault();
        }
    }

    window.addEventListener('keydown', function(e){onKeyDown(e);}, false);

})();
