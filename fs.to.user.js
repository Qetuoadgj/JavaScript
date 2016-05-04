// ==UserScript==
// @name         fs.to
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       You
// @match        http://fs.to/video/*
// @match        http://*.filecdn.to/*/*
// @grant        none
// @updateURL    https://drive.google.com/uc?export=download&id=0BwWINEArcS4yOVVKSjVQRTZNdm8
// @downloadURL  https://drive.google.com/uc?export=download&id=0BwWINEArcS4yOVVKSjVQRTZNdm8
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function WaitForElement(elementSelector, execFunction, delay, tries) {
    delay = delay || 10; tries = tries || 100; var cycle = 0; var keepRun = true;
    setTimeout(function WaitForElementCycle() {
      if (tries) {keepRun = (cycle < tries);}
      if (keepRun) {
        // alert('cycle = ' + cycle);
        if ( document.querySelector(elementSelector) ) {
          if (execFunction && (typeof execFunction == "function")) {return execFunction();}
        } else {
          setTimeout(WaitForElementCycle, delay);
        }
        cycle += 1;
      }
    }, delay);
  }

  function WaitForAttribute(elementSelector, attributeName, execFunction, delay, tries) {
    delay = delay || 10; tries = tries || 100; var cycle = 0; var keepRun = true;
    var value;
    setTimeout(function WaitForAttributeCycle() {
      if (tries) {keepRun = (cycle < tries);}
      if (keepRun) {
        // alert('cycle = ' + cycle);
        if ( document.querySelector(elementSelector) ){value = document.querySelector(elementSelector).getAttribute(attributeName);}
        if ( value && value !== '' ) {
          if (execFunction && (typeof execFunction == "function")) {return execFunction();}
        } else {
          setTimeout(WaitForAttributeCycle, delay);
        }
        cycle += 1;
      }
    }, delay);
  }

  String.prototype.Capitalize = function() {
    return this.split(' ').map(capFirst).join(' ');
    function capFirst(str) {
      return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);
    }
  };

  function textFrameAutoHeight(element) {
    var lineHeight = element.style['font-size'].replace('px', '');
    var frameHeight = element.scrollHeight;
    var numberOfLines = Math.floor(frameHeight/lineHeight);
    element.style.height = lineHeight * (numberOfLines+0.5) + 'px';
    element.style.rows = numberOfLines;
  }

  function ShowEmbedCode() {
    var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
    var targetFrame, videoSrc, embedFrameMargin, embedLinkMargin, embedFrameBackgroundColor;
    var createImage = true, createLink = true;

    targetFrame = parent.document.querySelector('.l-footer-inner-inner');
    videoSrc = document.querySelector('video#player.b-aplayer__html5-desktop.m-hidden').src; // http://n34.filecdn.to/ff/NzA5MWJlMDkzNWVlMjMyOWZlOGRjNDNiOGNiMTE0MTB8ZnN0b3w2MjI0MjQ2MzR8MTAwMDB8MnwwfDl8MzR8OWJjM2IxMWVhZmZmNDIyYjQ2MDRjZjExNjQwYTVhZjV8MHwxODpzLjI5Omh8MHwxMzg0NDI0NzMwfDE0NjA3MjU1NDkuNDAxNg,,/playvideo_6jw5v7snhgjr2duwah1x9y5iu.0.1765758616.2185543202.1460722207.mp4
    videoSrc = videoSrc.replace(/.*playvideo_(.*)\.\d\.\d+.\d+.\d+\.(.+)$/i, 'http://fs.to/get/playvideo/$1.$2'); // http://fs.to/get/playvideo/6jw5v7snhgjr2duwah1x9y5iu.mp4

    // targetFrame.style.margin = '0px';
    embedFrameMargin = '10px 0px';
    // embedLinkMargin = '1px 0px';
    // embedFrameBackgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');

    if (videoSrc) {
      pageTitle = parent.document.title;
      var title = pageTitle.replace(/^.{1} /i, '').Capitalize(); title = title.replace(/(.*): Смотреть Онлайн.*/i, '$1'); title = title.replace(/(.*): .*$/i, '$1'); title = title.replace(/Сериал (.*)/i, '$1'); title = title.replace(/ \(.+Сезон.*\)/i, '');

      var oldEmbedFrame = document.getElementById("ShowEmbedCode_Frame"); if (oldEmbedFrame) {oldEmbedFrame.remove();}
      var embedCode = ('#EXTINF: -1 group-title="",'+title+'\n'+videoSrc);

      var embedFrame = document.createElement('div');
      embedFrame.setAttribute('id', 'ShowEmbedCode_Frame');
      embedFrame.style.display = "block"; embedFrame.style['word-wrap'] = "break-word";
      if (embedFrameMargin) {embedFrame.style.margin = embedFrameMargin;}
      if (embedFrameBackgroundColor) {embedFrame.style.backgroundColor = embedFrameBackgroundColor;}
      targetFrame.appendChild(embedFrame);

      var textFrame = parent.document.createElement('textarea');
      textFrame.style.display = 'block'; textFrame.style.border = 'none';
      textFrame.style.rows = '2'; textFrame.style.overflow = 'hidden';
      textFrame.style['background-color'] = 'transparent'; textFrame.style.width = '100%';
      textFrame.style['font-size'] = '12px'; textFrame.style.color = 'grey';
      textFrame.setAttribute('readonly', 'readonly'); textFrame.setAttribute('onclick', 'this.focus(); this.select();');
      textFrame.value = embedCode;
      embedFrame.appendChild(textFrame); textFrameAutoHeight(textFrame);

      if (createLink) {
        var linkHeader;

        linkHeader = parent.document.createElement('div'); linkHeader.style['font-size'] = '12px'; linkHeader.style.color = '#086081';
        linkHeader.textContent = 'Смотреть: ';
        embedFrame.appendChild(linkHeader);

        var embedLink = parent.document.createElement('a');
        if (embedLinkMargin) {embedLink.style.margin = embedLinkMargin;}
        embedLink.style['font-size'] = '12px'; embedLink.style.color = '#086081';
        embedLink.setAttribute('href', videoSrc); embedLink.setAttribute('target', '_blank'); // Open in new tab
        embedLink.text = videoSrc;
        linkHeader.appendChild(embedLink);

        linkHeader = parent.document.createElement('div'); linkHeader.style['font-size'] = '12px'; linkHeader.style.color = '#086081';
        linkHeader.textContent = 'Скачать: ';
        embedFrame.appendChild(linkHeader);

        var videoLink = videoSrc.replace('/playvideo/', '/dl/');
        var downloaLink = parent.document.createElement('a');
        if (embedLinkMargin) {downloaLink.style.margin = embedLinkMargin;}
        downloaLink.style['font-size'] = '12px'; downloaLink.style.color = '#086081';
        downloaLink.setAttribute('href', videoLink); downloaLink.setAttribute('target', '_blank'); // Open in new tab
        downloaLink.text = videoLink;
        linkHeader.appendChild(downloaLink);
      }
    }

    window.open(videoSrc, '_self');
  }

  function MouseWheelAudioControl(media, step) {
    step = step || 1;
    var MouseWheelAudioHandler = function(e) {
      // cross-browser wheel delta
      e = window.event || e; // old IE support
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      var vol =  Math.max(0, Math.min(100, media.volume*100 + delta*step)); vol = Math.floor(vol/step)*step; vol = vol/100;
      media.volume = vol;
      return false;
    };
    if (media.addEventListener) {
      media.addEventListener("mousewheel", MouseWheelAudioHandler, false); // IE9, Chrome, Safari, Opera
      media.addEventListener("DOMMouseScroll", MouseWheelAudioHandler, false); // Firefox
    } else {
      media.attachEvent("onmousewheel", MouseWheelAudioHandler); // IE 6/7/8
    }
  }

  function ResizeVideo() {
    var videoFrame = document.querySelector('body > video'); videoFrame.style.width = '100%';
    var html = document.querySelector('html'); html.innerHTML = '';
    var body = document.querySelector('body'); body.appendChild(videoFrame);
    videoFrame.play();
    MouseWheelAudioControl(videoFrame, 5);
  }

  function RemoveADS() {
    var targetFrame;
    targetFrame = document.querySelector('div.l-body-branding'); if (targetFrame) {targetFrame.remove();}
    targetFrame = document.querySelector('div.b-scroll-to'); if (targetFrame){targetFrame.previousSibling.previousSibling.previousSibling.previousSibling.remove();}
    targetFrame = document.querySelector('div.b-section-banner-wrap'); if (targetFrame){targetFrame.parentNode.remove();} // http://fs.to/video/films/
  }

  function CreateFileList(optimized, download) {
    var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
    var targetFrame, embedFrameMargin, embedLinkMargin, embedFrameBackgroundColor;

    targetFrame = document.querySelector('div.b-files-folders');
    if (targetFrame) {
      var title = pageTitle.replace(/^.{1} /i, '').Capitalize();

      var oldEmbedFrame = document.getElementById("ShowEmbedCode_Frame"); if (oldEmbedFrame) {oldEmbedFrame.remove();}

      var fileList = document.querySelectorAll('ul.filelist.m-current > li[style="display: block;"]'), i; var embedCode = '', downloadList = '';
      for (i = 0; i < fileList.length; ++i) {
        var currentFile = fileList[i];

        var videoFileName = currentFile.querySelector('a.b-file-new__link-material > span.b-file-new__link-material-filename > span.b-file-new__link-material-filename-text').innerHTML;
        var videoSrc = currentFile.querySelector('a.b-file-new__link-material-download').href; // http://fs.to/get/dl/6jw5v7ukmbavhet3ej06nzjny.0.1139013157.974127405.1461975755/numb3rs.s02e04.360.mp4
        if (optimized) {
          if (download) {
            videoSrc = videoSrc.replace(/.*fs.to\/get\/dl\/(.*)\.\d\.\d+\.\d+\.\d+\/(.+)\.(.+)$/i, 'http://fs.to/get/dl/$1.mp4');
            videoSrc = videoSrc + '/' + videoFileName.replace(/(.*)\..+$/i, '$1.mp4'); // http://fs.to/get/dl/6jw5v7snhgjr2duwah1x9y5iu.mp4/numb3rs.s02e04.360.mp4
            videoSrc = encodeURI(videoSrc);
          } else {
            videoSrc = videoSrc.replace(/.*fs.to\/get\/dl\/(.*)\.\d\.\d+\.\d+\.\d+\/(.+)\.(.+)$/i, 'http://fs.to/get/playvideo/$1.mp4');
            videoSrc = videoSrc + '?' + videoFileName.replace(/(.*)\..+$/i, '$1.mp4'); // http://fs.to/get/playvideo/6jw5v7snhgjr2duwah1x9y5iu.mp4?numb3rs.s02e04.360.mp4
          }
        } else {
          videoSrc = videoSrc.replace(/.*fs.to\/get\/dl\/(.*)\.\d\.\d+\.\d+\.\d+\/(.+)\.(.+)$/i, 'http://fs.to/get/dl/$1/$2.$3'); // http://fs.to/get/dl/6jw5v7snhgjr2duwah1x9y5iu/numb3rs.s02e04.360.mp4
        }

        var serieNumber = currentFile.querySelector('a.b-file-new__link-material > span.b-file-new__link-material-filename > span.b-file-new__link-material-filename-series-num');
        if (serieNumber) {
          var videoTitle = serieNumber.innerHTML;
          title = title.replace(/(.*): .*$/i, '$1'); title = title.replace(/Сериал (.*)/i, '$1'); title = title.replace(/ \(.+Сезон.*\)/i, '');
          var groupTitle = videoFileName.replace(/.*S(\d+)E\d+.*/i, title +' (Сезон $1)');
          if (download) {downloadList = downloadList + videoSrc + '\n';} else {embedCode = embedCode + ('#EXTINF: -1 group-title="'+groupTitle+'",'+videoTitle+'\n'+videoSrc) + '\n';}
        } else {
          title = title.replace(/(.*): .*$/i, '$1');
          if (download) {downloadList = downloadList + videoSrc + '\n';} else {embedCode = embedCode + ('#EXTINF: -1 group-title="",'+title+'\n'+videoSrc) + '\n';}
        }
      }

      var embedFrame = document.createElement('div');
      embedFrame.setAttribute('id', 'ShowEmbedCode_Frame');
      embedFrame.style.display = "block"; embedFrame.style['word-wrap'] = "break-word";
      embedFrame.style.width = document.querySelector('div.l-content-wrap').offsetWidth - 20 + 'px';
      if (embedFrameMargin) {embedFrame.style.margin = embedFrameMargin;}
      if (embedFrameBackgroundColor) {embedFrame.style.backgroundColor = embedFrameBackgroundColor;}
      targetFrame.parentNode.insertBefore(embedFrame, targetFrame.nextSibling);

      var playlistButton = document.createElement('button');
      playlistButton.style.width = 'auto'; playlistButton.style.height = '30px'; playlistButton.style.padding = '0px 10px'; playlistButton.style.margin = '0px 0px';
      if (optimized && !download) {playlistButton.innerHTML = 'Плейлист (.MP4)';} else {playlistButton.innerHTML = 'Плейлист';}
      playlistButton.addEventListener("click", function(){if (optimized) {CreateFileList(false);} else {CreateFileList(true);}}, false);
      embedFrame.appendChild(playlistButton);

      var downloadButton = document.createElement('button');
      downloadButton.style.width = 'auto'; downloadButton.style.height = '30px'; downloadButton.style.padding = '0px 10px'; downloadButton.style.margin = '0px 5px';
      if (optimized && download) {downloadButton.innerHTML = 'Скачать (.MP4)';} else {downloadButton.innerHTML = 'Скачать';}
      downloadButton.addEventListener("click", function(){if (optimized) {CreateFileList(false, true);} else {CreateFileList(true, true);}}, false);
      embedFrame.appendChild(downloadButton);

      var textFrame = parent.document.createElement('textarea');
      textFrame.style.display = 'block'; textFrame.style.border = 'none';
      textFrame.style.rows = '2'; textFrame.style.overflow = 'hidden';
      textFrame.style['background-color'] = 'transparent'; textFrame.style.width = '100%';
      textFrame.style['font-size'] = '12px'; textFrame.style.color = 'grey';
      textFrame.setAttribute('readonly', 'readonly'); textFrame.setAttribute('onclick', 'this.focus(); this.select();');
      if (download) {textFrame.value = downloadList;} else {textFrame.value = embedCode;}
      embedFrame.appendChild(textFrame); textFrameAutoHeight(textFrame);
    }
  }

  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  if ( pageURL.match(/fs.to\/video\/.+\/view_iframe\/.*/i) ) {
    WaitForAttribute('video#player.b-aplayer__html5-desktop.m-hidden', 'src', ShowEmbedCode, 1000, 30);

  } else if ( pageURL.match(/.*?filecdn.to/i) ) {
    WaitForElement('body > video', ResizeVideo, 1000, 30);

  } else if ( pageURL.match(/fs.to\/video\/.*/i) ) {
    WaitForElement('div.b-scroll-to', RemoveADS, 1000, 30);
    WaitForElement('div.b-section-banner-wrap', RemoveADS, 1000, 30);
    WaitForElement('#page-item-viewonline', CreateFileList(false), 1000, 30);
  }
})();