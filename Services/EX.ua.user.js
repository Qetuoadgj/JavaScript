// ==UserScript==
// @name         EX.ua
// @icon         https://www.google.com/s2/favicons?domain=ex.ua
// @version      1.0.4
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/EX.ua.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        http://www.ex.ua/*
// @match        http://*.www.ex.ua/show/*
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
  var mainFunction;
  var delay = 1000,
      tries = 15;
  // ====================================================================================================================

  if (
    pageURL.matchLink('http://*.www.ex.ua/show/*')
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

  else if (
    pageURL.matchLink('http://www.ex.ua/*')
  ) {
    var G_titleMethod, G_groupTitleText; // variables
    var G_fileListFrame, G_namingRulesSelectMenu, G_groupTitleChangeInput, G_fileListOutputTextFrame; // elements
    var G_namingRules;
    var G_pageTitle;

    var CreateFileList = function(optimized, download) {
      var title = pageTitle.replace(/^.{1} /i, '').capitalize();

      var createFrame = function() {
        if (G_fileListFrame) G_fileListFrame.remove();

        var appendToFrame = document.querySelector('#body_element');
        var appendPosition = 'append';

        var fileListFrame = document.createElement('div');
        fileListFrame.style.display = "block";
        fileListFrame.style['word-wrap'] = "break-word";
        // fileListFrame.style.width = document.querySelector('div.l-content-wrap').offsetWidth - 20 + 'px';
        fileListFrame.append(appendToFrame, appendPosition);

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
        var toNone = /\b(360p|480p|720p|1080p|BDRip|DVDRip|Rus|Eng|Ukr|720|Web-DL)\b|^-/gi;
        var toSpace = /\s+|\.|\+|\_|^-|[\.\+][\.\+]|[\.\-][\.\-]/gi;

        G_titleMethod = G_namingRulesSelectMenu.value;

        //
        var tmpArray = [];
        var player_info_array = player_info;
        forEach(player_info_array, function(index, self) {
          // var position = self.pos;
          var title = self.title;
          title = title.replace(/(.*)\..*$/g, "$1");
          tmpArray.push(title);
        });

        var player_list_array = JSON.parse('['+player_list+']');
        var serieCount = 0;
        forEach(player_list_array, function(index, self) {
          var videoSrc = self.url;
          console.log('videoSrc = '+videoSrc);
          var videoTitle = tmpArray[index];
          console.log('videoTitle = '+videoTitle);
          var videoCategory =  document.querySelector('#body_element > a > h2').innerText;
          console.log('videoCategory = '+videoCategory);
          var groupTitle = pageTitle.replace(' - '+videoCategory+' @ EX.UA', '').replace(toNone, '').replace(toSpace, ' ').replace(/\s+/, ' ').trim();
          G_pageTitle = groupTitle;
          console.log('groupTitle = '+groupTitle);

          var fileID = videoSrc.replace( /.*?\/show\/(.*?)\/.*/i, '$1'); // http://www.ex.ua/show/79891775/2ee54dd5a98002dda2e91b49441d210b.mp4 --> 79891775
          // console.log('fileID = '+fileID);
          var playButtonSelector = 'a.fox-play-btn[href="/get/'+fileID+'"]';
          // console.log('playButtonSelector = '+playButtonSelector);
          var playButton = document.querySelector(playButtonSelector);
          // console.log('playButton = '+playButton);
          var fileSection = playButton.nthParentNode(3);
          // console.log('fileSection = '+fileSection.innerHTML);
          var downloadButton = fileSection.querySelector('a');
          // console.log('downloadButton = '+downloadButton.innerHTML);
          var videoFileName = downloadButton.title;
          console.log('videoFileName = '+videoFileName);
          var videoFileExt = videoFileName.replace(/.*\.(.+)$/ig, '$1');
          console.log('videoFileExt = '+videoFileExt);

          if (G_titleMethod == G_namingRules[0] || G_titleMethod == G_namingRules[1]) {
            if (optimized) {
              videoSrc = videoSrc+'?'+videoTitle+'.mp4';
            } else {
              videoSrc = videoSrc.replace(/.*?\/show\/(.*?)\/.*/i, 'http://www.ex.ua/get/$1'+'?'+videoFileName);
            }
          } else if (G_titleMethod == G_namingRules[2]) {
            serieCount += 1;
            videoTitle = 'Серия '+serieCount;
            if (optimized) {
              videoSrc = videoSrc+'?'+videoTitle+'.mp4';
            } else {
              videoSrc = videoSrc.replace(/.*?\/show\/(.*?)\/.*/i, 'http://www.ex.ua/get/$1'+'?'+videoTitle+'.'+videoFileExt);
            }
          }

          if (player_list_array.length < 2) {
            videoTitle = groupTitle;
            groupTitle = null;
          }

          embedCode = embedCode + ('#EXTINF: -1 group-title="'+(G_groupTitleChangeInput.value || groupTitle || '')+'",'+videoTitle+'\n'+videoSrc) + '\n';
          downloadList = downloadList + encodeURI(videoSrc) + '\n';
        });
        //

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
    waitForCondition(function(){return typeof player_info != 'undefined';}, CreateFileList(true, false), delay, tries, false);

    var stopAutoplay = function() {
      document.querySelector('#fox_player_html5_api').src = '';
      document.querySelector('.vjs-close').click();
    };
    waitForElement('.vjs-close', null, stopAutoplay, delay, tries, null);
  }
})();
