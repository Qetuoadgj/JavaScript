// ==UserScript==
// @name         warscrap.io
// @icon         https://www.google.com/s2/favicons?domain=warscrap.io
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/warscrap.io.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @run-at       document-end
// @noframes
// @match        *://warscrap.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //     var defaultRadius = 1.5;
    var showCanvasBorders = 0;

    var lineWidth = 2;
    var lineOpacity = 0.25;
    var lineColor1 = 'lightgray'; //'lightgray';
    var lineColor2 = lineColor1; //'lightgray';
    var dotColor = 'aqua';
    var dotRadiusPX = 1.5;
    var dotOpacity = 0.2;

    var smallLineSize = 15;
    var scaleValue = 50;
    var opacity = 1.0;

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
    canvas.width = window.innerWidth-1; // defaultRadius;
    canvas.height = window.innerHeight-1; //defaultRadius;
    if (showCanvasBorders) {
        canvas.style.border = '10px';
        canvas.style.borderColor = 'red';
        canvas.style.borderStyle = 'solid';
        canvas.style.borderWidth = 'thin';
    }
    canvas.style.opacity = opacity;
    canvas.style.pointerEvents = 'none'; // click through

    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = (canvas.height /2) - lineWidth/2;

    context.globalAlpha = dotOpacity;
    context.beginPath();
    radius = dotRadiusPX - lineWidth/2;
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = dotColor;
    context.fill();
    context.lineWidth = lineWidth;
    context.strokeStyle = dotColor;
    context.stroke();
    context.globalAlpha = 1.0;

    // center
    var x = canvas.width / 2;
    var y = canvas.height / 2;

    // remove aliasing
    x = Math.floor(x) + 0.5;
    y = Math.floor(y) + 0.5;

    context.strokeWidth = lineWidth;
    context.strokeWidth = lineWidth;

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

    var horBarLen = 0;
    /*
    for (var i = 0; i < 5; i++) {
        addVerticalBars(scaleValue*(i+1), smallLineSize);
        horBarLen += scaleValue;
    }
    addHorizontalBars(scaleValue/2, horBarLen);
    */

    context.globalAlpha = lineOpacity;
    context.beginPath();
    context.strokeStyle = lineColor1 || 'white';
    context.lineWidth = lineWidth;
    addVerticalBars(scaleValue*1, smallLineSize);
    context.stroke();
    context.globalAlpha = 1.0;

    context.globalAlpha = lineOpacity;
    context.beginPath();
    context.strokeStyle = lineColor2 || 'white';
    context.lineWidth = lineWidth;
    addVerticalBars(scaleValue*0.5, smallLineSize*0.25);
    context.stroke();
    context.globalAlpha = 1.0;

})();
