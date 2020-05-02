(function() {
    'use strict';
    // Your code here...
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
    //
    let myData = Object.getOwnPropertyNames(window);
    let text = JSON.stringify(myData);
    downloadString(text, 'text/plain', 'myData_' + timeStamp() +'.txt');
})();