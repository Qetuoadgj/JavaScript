// ==UserScript==
// @name         FS.to
// @icon         https://www.google.com/s2/favicons?domain=fs.to
// @version      1.0.3
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/FS.to.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        http://fs.to/video/*
// @match        http://*.filecdn.to/*/*
// ==/UserScript==

(function() {
  'use strict';

  /* JS.AddEmbedCodeFrame.Lib.user.js GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  var createLink = true, createPoster = true, contentURL, posterURL, appendToFrame, appendPosition;
  var embedCodeFrame_Margin, embedCodeLink_Margin, embedCodeFrame_BackgroundColor;
  var contentTitle;
  var embedCodeText;
  var posters = [];
  var qualityButtons = [];
  var textAreaAutoHeight = false, textAreaFixedHeight = false;
  var embedCodeTextRefresh = true;
  */

  // THIS FILE GLOBAL VARIABLES
  // ====================================================================================================================
  var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
  var delay = 1000, tries = 15;
  // ====================================================================================================================

  if (
    pageURL.matchLink('http://fs.to/video/*')
  ) {
    var G_titleMethod, G_groupTitleText; // variables
    var G_fileListFrame, G_namingRulesSelectMenu, G_groupTitleChangeInput, G_fileListOutputTextFrame; // elements
    var G_namingRules;

    var CreateFileList = function(optimized, download) {
      var title = pageTitle.replace(/^.{1} /i, '').capitalize();

      var createFrame = function() {
        if (G_fileListFrame) G_fileListFrame.remove();

        var appendToFrame = document.querySelector('div.b-files-folders');
        var appendPosition = 'after';

        var fileListFrame = document.createElement('div');
        fileListFrame.style.display = "block";
        fileListFrame.style['word-wrap'] = "break-word";
        fileListFrame.style.width = document.querySelector('div.l-content-wrap').offsetWidth - 20 + 'px';
        fileListFrame.appendElement(appendToFrame, appendPosition);

        var playlistButton = document.createElement('button');
        playlistButton.style.width = 'auto';
        playlistButton.style.height = '30px';
        playlistButton.style.padding = '0px 10px';
        playlistButton.style.margin = '0px 0px';
        playlistButton.style.border = '1px solid gray';
        playlistButton.style.backgroundColor = 'white';
        fileListFrame.appendChild(playlistButton);
        if (optimized && !download) {playlistButton.innerHTML = 'Плейлист (.MP4)';} else {playlistButton.innerHTML = 'Плейлист';}
        playlistButton.addEventListener("click", function(){if (optimized) {CreateFileList(false);} else {CreateFileList(true);}}, false);

        var downloadButton = document.createElement('button');
        downloadButton.style.width = 'auto';
        downloadButton.style.height = '30px';
        downloadButton.style.padding = '0px 10px';
        downloadButton.style.margin = '0px 5px';
        downloadButton.style.border = '1px solid gray';
        downloadButton.style.backgroundColor = 'white';
        fileListFrame.appendChild(downloadButton);
        if (optimized && download) {downloadButton.innerHTML = 'Скачать (.MP4)';} else {downloadButton.innerHTML = 'Скачать';}
        downloadButton.addEventListener("click", function(){if (optimized) {CreateFileList(false, true);} else {CreateFileList(true, true);}}, false);

        var namingRulesSelectMenu = document.createElement('select');
        namingRulesSelectMenu.style.width = '200px';
        namingRulesSelectMenu.style.height = '30px';
        namingRulesSelectMenu.style.margin='10px 0px 0px 0px';
        namingRulesSelectMenu.style.padding='5px';
        namingRulesSelectMenu.style.border = '1px solid gray';
        fileListFrame.appendChild(namingRulesSelectMenu);

        var namingRules = ['Способ переименования', 'Из названия файла', 'Серия #'];
        namingRules.forEach(function(currentValue, index, arr) {
          var selectOption = document.createElement('option');
          selectOption.text = currentValue;
          selectOption.value = currentValue;
          namingRulesSelectMenu.appendChild(selectOption);
        }, false);

        namingRulesSelectMenu.value = G_titleMethod || namingRules[0];

        var groupTitleChangeInput = document.createElement('input');
        groupTitleChangeInput.style.width = '280px';
        groupTitleChangeInput.style.height = '18px';
        groupTitleChangeInput.style.margin = '0px 0px 0px 5px'; // '0px 5px 0px';
        groupTitleChangeInput.style.padding = '5px';
        groupTitleChangeInput.style.border = '1px solid gray';
        groupTitleChangeInput.placeholder = 'Изменить название группы';
        if (G_groupTitleText) groupTitleChangeInput.value = G_groupTitleText.trim();
        fileListFrame.appendChild(groupTitleChangeInput);
        groupTitleChangeInput.setAttribute('type', 'search');
        groupTitleChangeInput.style.height = 18+18/3*2+'px';

        var downloadFileButton = document.createElement('button');
        downloadFileButton.style.width = 'auto';
        downloadFileButton.style.height = '30px';
        downloadFileButton.style.padding = '0px 10px';
        downloadFileButton.style.margin = '0px 5px';
        downloadFileButton.style.border = '1px solid gray';
        downloadFileButton.style.backgroundColor = 'white';
        fileListFrame.appendChild(downloadFileButton);
        downloadFileButton.innerHTML = 'Скачать файл';
        downloadFileButton.addEventListener("click", function(){
          var text = G_fileListOutputTextFrame.value;
          var title = (G_groupTitleText || G_pageTitle)+'.m3u';
          if (download) {
            downloadFile(title, text);
          } else {
            downloadFile(title, '#EXTM3U\r\n'+text);
          }
        }, false);

        var outputTextFrame = parent.document.createElement('textarea');
        outputTextFrame.style.display = 'block';
        outputTextFrame.style.border = 'none';
        outputTextFrame.style.rows = '2';
        outputTextFrame.style.overflow = 'hidden';
        outputTextFrame.style['background-color'] = 'transparent';
        outputTextFrame.style.width = '100%';
        outputTextFrame.style['font-size'] = '12px';
        outputTextFrame.style.color = 'grey';
        outputTextFrame.setAttribute('readonly', 'readonly');
        outputTextFrame.setAttribute('onclick', 'this.focus(); this.select();');
        fileListFrame.appendChild(outputTextFrame);

        // assign globals
        G_fileListFrame = fileListFrame;
        G_namingRules = namingRules;
        G_namingRulesSelectMenu = namingRulesSelectMenu;
        G_fileListOutputTextFrame = outputTextFrame;
        G_groupTitleChangeInput = groupTitleChangeInput;
      }(); // createFrame(), immediately invoked

      var generatePlaylist = function() {
        var embedCode = '', downloadList = '';

        G_titleMethod = G_namingRulesSelectMenu.value;

        var fileList = document.querySelectorAll('ul.filelist.m-current > li[style="display: block;"]');

        for (var i = 0; i < fileList.length; ++i) {
          // if (i === 0) embedCode = '#EXTM3U\r\n';
          var currentFile = fileList[i];
          var videoFileName = currentFile.querySelector('a.b-file-new__link-material > span.b-file-new__link-material-filename > span.b-file-new__link-material-filename-text').innerHTML;
          var videoSrc = currentFile.querySelector('a.b-file-new__link-material-download').href; // http://fs.to/get/dl/6jw5v7ukmbavhet3ej06nzjny.0.1139013157.974127405.1461975755/numb3rs.s02e04.360.mp4

          var fixRMB_OpenLinkInNewTab = function() {
            var watchLink = currentFile.querySelector('a.b-file-new__link-material');
            var watchSrc = videoSrc.replace(/.*fs.to\/get\/dl\/(.*)\.\d\.\d+\.\d+\.\d+\/(.+)\.(.+)$/i, 'http://fs.to/get/playvideo/$1.mp4');
            watchSrc = watchSrc + '?' + videoFileName.replace(/(.*)\..+$/i, '$1.mp4'); // http://fs.to/get/playvideo/6jw5v7snhgjr2duwah1x9y5iu.mp4?numb3rs.s02e04.360.mp4
            watchLink.href = watchSrc;
            watchLink.setAttribute('target', '_blank');
          }(); // fixRMB_OpenLinkInNewTab(), immediately invoked

          var prepareLinks = function() {
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
          }(); //prepareLinks(), immediately invoked

          var prepareTitles = function() {
            var serieNumber = currentFile.querySelector('a.b-file-new__link-material > span.b-file-new__link-material-filename > span.b-file-new__link-material-filename-series-num');
            if (serieNumber) {
              title = title.replace(/(.*): .*$/i, '$1');
              title = title.replace(/Сериал (.*)/i, '$1');
              title = title.replace(/ \(.+Сезон.*\)/i, '');
              var videoTitle = serieNumber.innerHTML;
              var seasonNumberDigit = videoFileName.replace(/.*S(\d+)E\d+.*/i, '$1');
              var serieNumberDigit = videoFileName.replace(/.*S\d+E(\d+).*/i, '$1');
              var groupTitle = videoFileName.replace(/.*S(\d+)E\d+.*/i, title +' (Сезон $1)');
              if (G_groupTitleChangeInput.value) groupTitle = G_groupTitleChangeInput.value;
              if (G_titleMethod == G_namingRules[0] || G_titleMethod == G_namingRules[1]) {
                var toSpace = /\s+|\.|\+|\_|^-|[\.\+][\.\+]|[\.\-][\.\-]/gi;
                var toNone = /\b(360p|480p|720p|1080p|BDRip|DVDRip|Rus|Eng|Ukr|720|Web-DL)\b|^-/gi;
                videoTitle = videoFileName.replace(/.*S\d+E\d+(.*)/i, '$1').replace(/(.*)\..*/, '$1').replace(/(.*)\[.*/, '$1');
                videoTitle = serieNumber.innerHTML.replace('Серия ', '') + '. ' + videoTitle.replace(toNone, '').replace(toSpace, ' ');
                videoTitle = videoTitle.replace(/\s+/, ' ').trim();
              } else if (G_titleMethod == G_namingRules[2]) {
                videoTitle = serieNumber.innerHTML;
              }
              if (download) {downloadList = downloadList + videoSrc + '\n';} else {embedCode = embedCode + ('#EXTINF: -1 group-title="'+groupTitle+'",'+videoTitle+'\n'+videoSrc) + '\n';}
            } else {
              var name = document.querySelector('.b-tab-item__title-inner > span[itemprop="name"]').innerHTML.trim();
              var origName = document.querySelector('.b-tab-item__title-inner > div[itemprop="alternativeHeadline"]').innerHTML.trim();
              var date = document.querySelector('#contentInner > div.l-content-center > div.b-tab-item > div:nth-child(1) > div > div.l-center > div.item-info > table > tbody > tr:nth-child(2) > td:nth-child(2) > a > span').innerHTML.trim();
              title = '{0} / {1} ({2})'.format(name, origName, date); // Доктор Ноу / Dr. No (1962)
              if (download) {downloadList = downloadList + videoSrc + '\n';} else {embedCode = embedCode + ('#EXTINF: -1 group-title="'+(G_groupTitleChangeInput.value || '')+'",'+title+'\n'+videoSrc) + '\n';}
            }
          }(); //prepareTitles(), immediately invoked
        }
        var formList = function() {
          if (download) {G_fileListOutputTextFrame.value = downloadList;} else {G_fileListOutputTextFrame.value = embedCode;}
          G_fileListOutputTextFrame.autoHeight(false);
        }(); //formList(), immediately invoked
      };

      var attachEvents = function() {
        G_namingRulesSelectMenu.addEventListener("change", function(){generatePlaylist();}, false);
        G_groupTitleChangeInput.addEventListener("change", function(){
          G_groupTitleChangeInput.value = G_groupTitleChangeInput.value.trim();
          G_groupTitleText = G_groupTitleChangeInput.value;
          generatePlaylist();
        }, false);
      }(); // attachEvents(), immediately invoked

      generatePlaylist();
    };

    waitForElement('#page-item-viewonline', null, CreateFileList, delay, tries, null);

    document.querySelector('body').addEventListener('click', function(event) {
      var targetElement = event.target,
          targetId = targetElement.getAttribute('id'),
          targetClass = targetElement.getAttribute('class'),
          targetTagName = targetElement.tagName.toLowerCase();

      if (targetElement.classList.contains('link-subtype')) {
        setTimeout(function() {CreateFileList(true, false);}, 1000);
      } else if (
        targetElement.classList.contains('link-simple') ||
        targetElement.parentNode.classList.contains('link-simple')
      ) {
        G_fileListOutputTextFrame.value = '';
        G_fileListOutputTextFrame.autoHeight(false);
      }
    });

    var removeAds = function() {
      var ads = document.querySelectorAll('.b-styled__item-central, .b-styled__content-right');
      ads.forEach(function(ad, index, arr) {ad.remove();}, false);
    };
    waitForElement('.b-styled__item-central', null, removeAds, delay, tries, null);
  }

  else if (
    pageURL.matchLink('http://*.filecdn.to/*/*')
  ) {
    var ResizeVideo = function () {
      addGlobalStyle('video {width: 100%; height: 100%; max-height: 100%; max-width: 100%;}');
      // var videoFrame = document.querySelector('video > source[type="video/mp4"]') || document.querySelector('video');
      // var videoCleaned = getCleanVideo(videoFrame.src, null);
      var videoCleaned = document.querySelector('video');
      videoCleaned.play();
      videoCleaned.volume = 0.5;
      addMouseWheelAudioControl(videoCleaned, 5);
    };
    waitForElement('video, video > source[type="video/mp4"]', 'src', ResizeVideo, delay, tries, null);
  }
})();