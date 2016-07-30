// ==UserScript==
// @name         fs.to
// @version      1.1.5
// @description  Pure JavaScript version.
// @author       Ægir
// @match        http://fs.to/video/*
// @match        http://*.filecdn.to/*/*
// @grant        none
// @updateURL    https://github.com/Qetuoadgj/JavaScript/raw/master/fs.to.user.js
// @icon         https://www.google.com/s2/favicons?domain=fs.to
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function waitForElement(elementSelector, attributeName, funcToRun, cycleDelay, maxTries) {
    if (funcToRun && (typeof funcToRun).toLowerCase() == "function") {
      cycleDelay = cycleDelay || 10; maxTries = maxTries || 100; var cycleCount = 0, keepRun = true; var element, value;
      setTimeout(function waitForElementCycle() {
        if (maxTries) {keepRun = (cycleCount < maxTries);}
        if (keepRun) {
          element = document.querySelector(elementSelector);
          if (attributeName) {
            if (element) {value = element.getAttribute(attributeName);}
            if (value && value !== '') {return funcToRun();} else {setTimeout(waitForElementCycle, cycleDelay);}
          } else {
            if (element) {return funcToRun();} else {setTimeout(waitForElementCycle, cycleDelay);}
          }
          cycleCount += 1;
        }
      }, cycleDelay);
    }
  }

  String.prototype.Capitalize = function() {
    return this.split(' ').map(capFirst).join(' ');
    function capFirst(str) {
      return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);
    }
  };

  String.prototype.replaceAll = function (find, replace) {
    var str = this;
    while( str.indexOf(find) > -1) {
      str = str.replace(find, replace);
    }
    return str;
  };

  function textFrameAutoHeight(element) {
    var lineHeight = element.style['font-size'].replace('px', '');
    var frameHeight = element.scrollHeight;
    var numberOfLines = Math.floor(frameHeight/lineHeight);
    element.style.height = lineHeight * (numberOfLines+0.5) + 'px';
    element.style.rows = numberOfLines;
    if (!element.value || element.value === '') element.style.height = '0px';
  }

  function addGlobalStyle(css, cssClass) {
    var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
    var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
    if (cssClass) style.setAttribute('class', cssClass);
    head.appendChild(style);
  }

  function ShowEmbedCode() {
    var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
    var targetFrame, videoSrc, embedFrameMargin, embedLinkMargin, embedFrameBackgroundColor;
    var createImage = true, createLink = true;

    targetFrame = parent.document.querySelector('.l-footer-inner-inner');
    videoSrc = document.querySelector('video#player.b-aplayer__html5-desktop.m-hidden').src; // http://n34.filecdn.to/ff/NzA5MWJlMDkzNWVlMjMyOWZlOGRjNDNiOGNiMTE0MTB8ZnN0b3w2MjI0MjQ2MzR8MTAwMDB8MnwwfDl8MzR8OWJjM2IxMWVhZmZmNDIyYjQ2MDRjZjExNjQwYTVhZjV8MHwxODpzLjI5Omh8MHwxMzg0NDI0NzMwfDE0NjA3MjU1NDkuNDAxNg,,/playvideo_6jw5v7snhgjr2duwah1x9y5iu.0.1765758616.2185543202.1460722207.mp4
    videoSrc = videoSrc.replace(/.*playvideo_(.*?)\.\d\.\d+.\d+.\d+\.(.+)$/i, 'http://fs.to/get/playvideo/$1.$2'); // http://fs.to/get/playvideo/6jw5v7snhgjr2duwah1x9y5iu.mp4

    // targetFrame.style.margin = '0px';
    embedFrameMargin = '10px 0px';
    // embedLinkMargin = '1px 0px';
    // embedFrameBackgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');

    if (videoSrc) {
      var iframe = parent.document.body.querySelector('div.l-body-inner.m-theme-video > div > div.l-content-wrap > div > div.b-player-popup > div.b-player-popup__content > div.b-iframe-player-wrap > div > iframe');
      if (iframe) {
        parent.document.body.querySelector('div.l-content-wrap').onwheel = function(){return false;}; // Отключение прокрутки для работы ResizeVideo()
        iframe.innerHTML = ''; iframe.src = ''; iframe.src = videoSrc; // Вставка видео вместо содержимого iframe
      }

      pageTitle = parent.document.title;
      var title = pageTitle.replace(/^.{1} /i, '').Capitalize(); title = title.replace(/(.*): Смотреть Онлайн.*/i, '$1'); title = title.replace(/(.*): .*$/i, '$1'); title = title.replace(/Сериал (.*)/i, '$1'); title = title.replace(/ \(.+Сезон.*\)/i, '');

      var oldEmbedFrame = document.getElementById("ShowEmbedCode_Frame") || parent.document.getElementById("ShowEmbedCode_Frame"); if (oldEmbedFrame) {oldEmbedFrame.remove();}
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
    // window.open(videoSrc, '_self');
  }

  function MouseWheelAudioControl(media, step) {
    step = step || 1;

    var volumeText = document.createElement('div');
    volumeText.style.color = 'yellow'; volumeText.style['font-size'] = '72px';
    volumeText.style.position = 'absolute'; volumeText.style['z-index'] = 2147483647; // Always on TOP
    // volumeText.style.top = '0px'; volumeText.style.left = '0px';
    volumeText.style.top = '0px'; volumeText.style.left = '18px';
    media.parentNode.insertBefore(volumeText, media.nextSibling);

    var MouseWheelAudioHandler = function(e) {
      // cross-browser wheel delta
      e = window.event || e; // old IE support
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      var vol =  Math.max(0, Math.min(100, media.volume*100 + delta*step)); vol = Math.floor(vol/step)*step; vol = vol/100;
      media.volume = vol;
      volumeText.textContent = (function(){if(Math.round(vol*100) > 0){return Math.round(vol*100);}else{return 'Выкл.';}})();

      function volumeTextFade(){
        volumeText.style.opacity = 0;
        volumeText.style.transition = 'opacity 2s';
        volumeText.style['-webkit-transition'] = 'opacity 2s'; // Safari
      }
      volumeText.style.transition = '';
      volumeText.style['-webkit-transition'] = ''; // Safari
      volumeText.style.opacity = 1; setTimeout(volumeTextFade, 2000);

      e.preventDefault();
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
    var videoFrame = document.querySelector('body > video'); //videoFrame.style.width = '100%';
    // var html = document.querySelector('html'); html.innerHTML = '';
    // var body = document.querySelector('body'); body.appendChild(videoFrame);
    // addGlobalStyle('video {position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);}');
    // addGlobalStyle('video {position: fixed; width: 100%; height: 100%; max-height: 100%; max-width: 100%;}');
    addGlobalStyle('video {width: 100%; height: 100%; max-height: 100%; max-width: 100%;}');
    MouseWheelAudioControl(videoFrame, 5);
    videoFrame.play();
    videoFrame.volume = 0.5;
  }

  function RemoveADS() {
    var targetFrame;
    targetFrame = document.querySelector('div.l-body-branding'); if (targetFrame) {targetFrame.remove();}
    targetFrame = document.querySelector('div.b-scroll-to'); if (targetFrame){targetFrame.previousSibling.previousSibling.previousSibling.previousSibling.remove();}
    targetFrame = document.querySelector('div.b-section-banner-wrap'); if (targetFrame){targetFrame.parentNode.remove();} // http://fs.to/video/films/
  }

  var titleMethod; // global
  function CreateFileList(optimized, download) {
    var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
    var targetFrame, embedFrameMargin, embedLinkMargin, embedFrameBackgroundColor;

    targetFrame = document.querySelector('div.b-files-folders');
    if (targetFrame) {
      var title = pageTitle.replace(/^.{1} /i, '').Capitalize();

      var oldEmbedFrame = document.getElementById("ShowEmbedCode_Frame"); if (oldEmbedFrame) {oldEmbedFrame.remove();}

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
      playlistButton.style.border = '1px solid gray';
      playlistButton.style.backgroundColor = 'white';

      var downloadButton = document.createElement('button');
      downloadButton.style.width = 'auto'; downloadButton.style.height = '30px'; downloadButton.style.padding = '0px 10px'; downloadButton.style.margin = '0px 5px';
      if (optimized && download) {downloadButton.innerHTML = 'Скачать (.MP4)';} else {downloadButton.innerHTML = 'Скачать';}
      downloadButton.addEventListener("click", function(){if (optimized) {CreateFileList(false, true);} else {CreateFileList(true, true);}}, false);
      embedFrame.appendChild(downloadButton);
      downloadButton.style.border = '1px solid gray';
      downloadButton.style.backgroundColor = 'white';

      var promptFramePlayers = document.createElement('select');
      promptFramePlayers.style.width = '200px';
      promptFramePlayers.style.height = '30px';
      // promptFramePlayers.style.float = 'left';
      promptFramePlayers.style.margin='10px 0px 0px 0px';
      promptFramePlayers.style.padding='5px';
      promptFramePlayers.style.border = '1px solid gray';
      embedFrame.appendChild(promptFramePlayers);

      var options = ['Способ переименования', 'Из названия файла', 'Серия #'];
      var num; for (num = 0; num < options.length; ++num) {
        var selectOption = document.createElement('option');
        selectOption.text = options[num];
        selectOption.value = options[num];
        promptFramePlayers.appendChild(selectOption);
      }

      promptFramePlayers.value = titleMethod || options[0];

      var textFrame = parent.document.createElement('textarea');
      textFrame.setAttribute('id', 'embedCodeTextFrame');
      textFrame.style.display = 'block'; textFrame.style.border = 'none';
      textFrame.style.rows = '2'; textFrame.style.overflow = 'hidden';
      textFrame.style['background-color'] = 'transparent'; textFrame.style.width = '100%';
      textFrame.style['font-size'] = '12px'; textFrame.style.color = 'grey';
      textFrame.setAttribute('readonly', 'readonly'); textFrame.setAttribute('onclick', 'this.focus(); this.select();');
      embedFrame.appendChild(textFrame);

      var generatePlaylist = function() {
        titleMethod = promptFramePlayers.value;

        var fileList = document.querySelectorAll('ul.filelist.m-current > li[style="display: block;"]'), i; var embedCode = '', downloadList = '';
        for (i = 0; i < fileList.length; ++i) {
          if (i < 1) embedCode = '#EXTM3U\n';
          var currentFile = fileList[i];

          var videoFileName = currentFile.querySelector('a.b-file-new__link-material > span.b-file-new__link-material-filename > span.b-file-new__link-material-filename-text').innerHTML;
          var videoSrc = currentFile.querySelector('a.b-file-new__link-material-download').href; // http://fs.to/get/dl/6jw5v7ukmbavhet3ej06nzjny.0.1139013157.974127405.1461975755/numb3rs.s02e04.360.mp4

          var makeLinksDirect = function() {
            var watchLink = currentFile.querySelector('a.b-file-new__link-material');
            var watchSrc = videoSrc.replace(/.*fs.to\/get\/dl\/(.*)\.\d\.\d+\.\d+\.\d+\/(.+)\.(.+)$/i, 'http://fs.to/get/playvideo/$1.mp4');
            watchSrc = watchSrc + '?' + videoFileName.replace(/(.*)\..+$/i, '$1.mp4'); // http://fs.to/get/playvideo/6jw5v7snhgjr2duwah1x9y5iu.mp4?numb3rs.s02e04.360.mp4
            watchLink.href = watchSrc;
            watchLink.setAttribute('target', '_blank');
          };
          makeLinksDirect();

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
            var seasonNumberDigit = videoFileName.replace(/.*S(\d+)E\d+.*/i, '$1');
            var serieNumberDigit = videoFileName.replace(/.*S\d+E(\d+).*/i, '$1');
            var groupTitle = videoFileName.replace(/.*S(\d+)E\d+.*/i, title +' (Сезон $1)');
            if (titleMethod == options[0] || titleMethod == options[1]) {
              videoTitle = videoFileName.replace(/.*S\d+E\d+(.*)/i, '$1');
              videoTitle = videoTitle.replace(/(.*)\..*/, '$1');
              videoTitle = videoTitle.replace(/(.*)\[.*/, '$1');
              videoTitle = videoTitle.replaceAll('.-.', ' ');
              videoTitle = videoTitle.replaceAll('.+.', ' ');
              videoTitle = videoTitle.replaceAll('+-+', ' ');
              videoTitle = videoTitle.replaceAll('+', ' ');
              videoTitle = videoTitle.replaceAll('.', ' ');
              videoTitle = videoTitle.replaceAll('_', ' ');
              videoTitle = videoTitle.replace(/\b(360p|480p|720p|1080p|BDRip|DVDRip|Rus|Eng|Ukr|720|Web-DL)\b/ig, '');
              videoTitle = videoTitle.replace(/^\s+/, '');
              videoTitle = videoTitle.replace(/^-/, '');
              videoTitle = videoTitle.replace(/\s+$/, '');
              videoTitle = videoTitle.replace(/\s+/g, ' ');
              videoTitle = videoTitle.replace(/^\s+/, '');
              videoTitle = serieNumber.innerHTML.replace('Серия ', '') + '. ' + videoTitle;
            } else if (titleMethod == options[2]) {
              videoTitle = serieNumber.innerHTML;
            }
            if (download) {downloadList = downloadList + videoSrc + '\n';} else {embedCode = embedCode + ('#EXTINF: -1 group-title="'+groupTitle+'",'+videoTitle+'\n'+videoSrc) + '\n';}
          } else {
            title = title.replace(/(.*): .*$/i, '$1');
            if (download) {downloadList = downloadList + videoSrc + '\n';} else {embedCode = embedCode + ('#EXTINF: -1 group-title="",'+title+'\n'+videoSrc) + '\n';}
          }
        }

        if (download) {textFrame.value = downloadList;} else {textFrame.value = embedCode;}
        textFrameAutoHeight(textFrame);
      };
      generatePlaylist();
      promptFramePlayers.addEventListener("change", function(){generatePlaylist();}, false);
    }
  }

  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  if ( pageURL.match(/fs.to\/video\/.+\/view_iframe\/.*/i) ) {
    waitForElement('video#player.b-aplayer__html5-desktop.m-hidden', 'src', ShowEmbedCode, 1000, 30);

  } else if ( pageURL.match(/.*?filecdn.to/i) ) {
    waitForElement('body > video', false, ResizeVideo, 250, 30);

  } else if ( pageURL.match(/fs.to\/video\/.*/i) ) {
    waitForElement('div.b-scroll-to', false, RemoveADS, 1000, 30);
    waitForElement('div.b-section-banner-wrap', false, RemoveADS, 1000, 30);
    waitForElement('#page-item-viewonline', false, CreateFileList, 1000, 30);

    document.querySelector('body').addEventListener('click', function(event) {
      var targetElement = event.target, targetId = targetElement.getAttribute('id'), targetClass = targetElement.getAttribute('class'), targetTagName = targetElement.tagName.toLowerCase();
      if (targetElement.classList.contains('link-subtype')) {
        setTimeout(function() {CreateFileList(true, false);}, 250);
      } else if (targetElement.classList.contains('link-simple') || targetElement.parentNode.classList.contains('link-simple')) {
        var textFrame = document.getElementById('embedCodeTextFrame');
        if (textFrame) {textFrame.value = ''; textFrameAutoHeight(textFrame);}
      }
    });
  }
})();
