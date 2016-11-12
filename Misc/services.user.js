// ==UserScript==
// @name         services
// @icon         https://www.google.com/s2/favicons?domain=pornhub.com
// @version      1.0.8
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @require      https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.AddEmbedCodeFrame.Lib.user.js
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/services.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        http://porndoe.com/video/*
// @exclude      http://porndoe.com/video/embed/*
// @match        http://www.porntrex.com/video/*/*
// @match        http://sexix.net/video*
// @match        http://i.sexix.net/video*
// @match        http://sexix.net/*
// @match        http://sexiz.net/*
// @match        http://hdpoz.com/HD*
// @match        http://i.hdpoz.com/HD*
// @match        http://hdpoz.com/*
// @match        http://spankbang.com/*/video/*
// @match        http://www.babesandstars.com/*/*/*/
// @match        http://www.xvideos.com/video*
// @match        http://www.pornhub.com/*
// @exclude      https://www.pornhub.com/embed/*
// @match        http://www.eporner.com/hd-porn/*/*/
// @match        http://www.tube8.com/*/*/*/*
// @match        http://juicygif.com/public/Gif/*.html/*
// @match        http://www.sex.com/picture/*/
// @match        http://www.pichunter.com/gallery/*/*
// @match        http://www.imagefap.com/pictures/6115310/*view=2
// @match        http://www.hdporncollections.com/*/
// @match        http://konachan.com/post*
// @match        http://pron.tv/l/*/*
// @match        http://www.xmoviesforyou.com/*/*/*.html
// @match        https://danbooru.donmai.us/posts*
// @match        https://biqle.ru/watch/*
// @match        https://biqle.ru/*
// @match        https://www.bitporno.sx/?v=*
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
  var iframeElement, parentDocument;
  var menuElements, hdOptions, hdButtonData, hdButton, checkPressed;
  var setParentDocument, setAutoHD;
  setParentDocument = function(iframeSelector) {
    iframeElement = document.querySelector(iframeSelector);
    parentDocument = iframeElement ? (iframeElement.contentDocument || iframeElement.contentWindow.document) : document;
  };
  var initFunction = function(){mainFunction();};
  var delay = 1000,
      tries = 15;
  var mainFunctionTG = [];

  var addHDtext = function(selector) {
    selector = selector || 'a';
    var linksArray = document.querySelectorAll(selector);
    for (var i = 0; i < linksArray.length; ++i) {
      var link = linksArray[i], thumb = link.parentNode, title = link.title;
      var quality = title ? title.match('(1080)p') || title.match('(720)p') : null;
      if (quality) {
        quality = quality[1];
        var text = document.createElement('div');
        if (quality == '1080') text.style.background = 'rgba(255, 0, 0, 0.15)';
        else if (quality == '720') text.style.background = 'rgba(0, 45, 255, 0.25)';
        text.style.zIndex = '10000';
        text.style.position = 'inherit';
        text.style.width = 'auto';
        text.style.height = '20px';
        text.style.float = 'right';
        text.style.color = 'rgba(0, 253, 255, 0)';
        text.style.padding = '0px 2px';
        text.style.border = '1px solid rgba(255,255,255,0.2)';
        text.innerText = quality+'p';
        thumb.appendChild(text);
        // thumb.appendChild(document.createTextNode("HD"));
      }
    }
  };
  addHDtext = function(selector, color) {
    selector = selector || 'a';
    var linksArray = document.querySelectorAll(selector);
    for (var i = 0; i < linksArray.length; ++i) {
      var link = linksArray[i], thumb = link.parentNode, title = link.title || link.innerText;
      var quality = title ? title.match('(1080)p?') || title.match('(720)p?') : null;
      if (quality) {
        quality = quality[1];
        var text = document.createElement('div');
        if (quality == '1080') text.style.background = 'rgba(255, 0, 0, 0.15)';
        else if (quality == '720') text.style.background = 'rgba(0, 45, 255, 0.25)';
        text.style.zIndex = 2147483647; // '10000';
        text.style.position = 'absolute'; // 'inherit'
        text.style.width = 'auto';
        text.style.height = '20px';
        text.style.float = 'right';
        if (color) text.style.color = color; // 'rgba(0, 253, 255, 0)';
        text.style.padding = '0px 2px';
        text.style.border = '1px solid rgba(255,255,255,0.2)';
        text.innerText = quality+'p';
        // thumb.appendChild(text);
        thumb.insertBefore(text, thumb.firstChild);
        // thumb.appendChild(document.createTextNode("HD"));
        text.style.right = '0';
      }
    }
  };
  // ====================================================================================================================

  if (
    pageURL.matchLink('http://porndoe.com/video/*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('link[itemprop="embedURL"]').href.replace(/(.*?)\?.*/,'$1');
      contentURL = document.querySelector('video.jw-video').src.replace(/(.*?)\?.*/,'$1');
      posterURL = document.querySelector('link[itemprop="thumbnailUrl"]').getAttribute('content'); //document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('div.video');
      appendPosition = 'after';
      qualityButtons = [document.querySelector('.jw-icon-hd')];
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('video.jw-video', 'src', initFunction, delay, tries, false);
    // waitForElement('link[itemprop="thumbnailUrl"]', 'content', initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://www.porntrex.com/video/*/*')
  ) {
    mainFunction = function() {
      contentURL = pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'http://www.porntrex.com/mobile_hd_src.php?id=$1');
      posters = [
        document.querySelector('meta[property="og:image"]').content,
        pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'http://www.porntrex.com/media/videos/tmb/$1/1.jpg'),
        pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'http://www.porntrex.com/media/videos/tmb1/$1/1.jpg'),
        pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'http://www.porntrex.com/media/videos/tmb/$1/thumb.jpg'),
        pageURL.replace(/.*porntrex.com\/video\/(.*?)\/.*/i, 'http://www.porntrex.com/media/videos/tmb1/$1/thumb.jpg'),
      ];
      appendToFrame = document.querySelector('.video-container');
      appendPosition = 'after';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('meta[property="og:image"]', 'content', initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://sexix.net/*') || pageURL.matchLink('http://i.sexix.net/*') ||
    pageURL.matchLink('http://hdpoz.com/*') || pageURL.matchLink('http://i.hdpoz.com/*')
  ) {
    addGlobalStyle('.clip > img {position: relative; width: 140px; z-index: 10000;}');

    addPageControlKeys('a.previouspostslink', 'a.nextpostslink');
    addOpenInNewTabProperty('.clip-link, .entry-title > a');
    addHDtext('.clip-link', 'rgba(0, 253, 255, 0)');

    var iframeE = document.querySelector('.videoContainer > iframe');
    var iframeS = iframeE ? iframeE.src : null;
    if (iframeE && iframeS) iframeE.src = iframeS.replace(/http:\/\/.*sexix.net\/v\.php/i, 'http://'+pageHost+'/v.php');

    setAutoHD = function() {
      menuElements = parentDocument.querySelectorAll('#player_controlbar_hd > .jwoption');
      hdOptions = ['1080p', '720p'];
      hdButtonData = getHDButton(menuElements, hdOptions);
      hdButton = hdButtonData ? hdButtonData[0] : null;
      checkPressed = function(){
        var ok = hdButton.classList.contains('active');
        if (ok) {msgbox('Auto HD', 'HD option: '+hdButton.innerHTML, 3000, 250, 120);}
        return ok;
      };
      pressHDButton(hdButton, checkPressed, 500, 30);
    };

    mainFunctionTG = [];
    mainFunction = function() {
      contentURL = parentDocument.querySelector('video').src;
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video');
      appendPosition = 'after';
      qualityButtons = [parentDocument.querySelector('.jwhd')];
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
      mainFunctionTG = null;
    };

    if (
      pageURL.matchLink('sexix.net/video') ||
      pageURL.matchLink('hdpoz.com/HD')
    ) {
      initFunction = function(){setParentDocument('.videoContainer > iframe'); setAutoHD(); mainFunction();};
      waitForElement('#player_controlbar_hd > .active', false, initFunction, delay, tries, false, mainFunctionTG);
      waitForElement('#player_controlbar_hd > .active', false, initFunction, delay, tries, '.videoContainer > iframe', mainFunctionTG);
    }
  }

  else if (
    pageURL.matchLink('http://sexiz.net/*')
  ) {
    addGlobalStyle('.clip > img {position: relative; width: 140px; z-index: 10000;}');

    addPageControlKeys('a.previouspostslink', 'a.nextpostslink');
    addOpenInNewTabProperty('.clip-link, .entry-title > a');
    addHDtext('.clip-link', 'rgba(0, 253, 255, 0)');

    mainFunctionTG = [];
    mainFunction = function() {
      contentURL = document.querySelectorAttribute('video, video > source', 'src');
      posterURL = ''; //document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video');
      appendPosition = 'after';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
      mainFunctionTG = null;
    };

    if (
      pageURL.matchLink('sexiz.net/*/')
    ) {
      waitForElement('video, video > source', 'src', initFunction, delay, tries, false, mainFunctionTG);
    }
  }

  else if (
    pageURL.matchLink('http://spankbang.com/*/video/*')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('#video_player_html5_api').src;
      posterURL = document.querySelector('#video > div.left > section.timeline > figure > img:nth-child(6)').src;
      appendToFrame = document.querySelector('.toolbar');
      appendPosition = 'after';
      embedCodeFrame_Margin = '0.2% 0px';
      qualityButtons = asArray(document.querySelectorAll('#video > div.left > nav > ul.right_set > li.q_super'));
      qualityButtons = qualityButtons.concat(asArray(document.querySelectorAll('.vjs-resolution-button > div > ul > li.vjs-menu-item')));
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('meta[property="og:image"]', 'content', initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://www.babesandstars.com/*/*/*/')
  ) {
    embedCodeTextRefresh = false;
    mainFunction = function() {
      var gallery, images = [];
      gallery = document.querySelector('.my_gallery');
      images = gallery.querySelectorAll('figure > a > img');
      forEach(images, function(index, self) {
        contentURL = self.parentNode.href;
        posterURL = self.src;
        contentTitle = ''; //pageTitle.replace(/^.{1} /i, '').Capitalize();
        if (embedCodeText) {embedCodeText = embedCodeText + '\n' + '<div class="thumbnail"';} else {embedCodeText = '<div class="thumbnail"';}
        if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
        if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
        embedCodeText += ' content="'+contentURL+'"';
        if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
        embedCodeText += '></div>';
      });
      appendToFrame = gallery;
      appendPosition = 'after';
      textAreaAutoHeight = true;
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('.my_gallery', false, initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://www.xvideos.com/video*')
  ) {
    var forceHLS = true;
    setAutoHD = function() {
      menuElements = document.querySelectorAll('.parameter_element_txt');
      hdOptions = ['1080p', '720p'];
      hdButtonData = getHDButton(menuElements, hdOptions);
      hdButton = hdButtonData ? hdButtonData[0] : null;
      // checkPressed = function(){return hdButton.parentNode.classList.contains('active');};
      checkPressed = function(){
        var ok = hdButton.parentNode.classList.contains('parameterelmt_forced');
        if (ok) {msgbox('Auto HD', 'HD option: '+hdButton.innerHTML, 3000, 250, 120);}
        return ok;
      };
      pressHDButton(hdButton, checkPressed, 500, 30);
    };
    mainFunction = function() {
      forEach(document.scripts, function(index, self) {
        var text = self.text;
        if (hdButton || forceHLS) contentURL = text.match('html5player.setVideoHLS') ? text.match(/html5player\.setVideoHLS\('(.*?)'\)/i)[1] : contentURL; // HD
        else contentURL = text.match('html5player.setVideoUrlHigh') ? text.match(/html5player\.setVideoUrlHigh\('(.*?)'\)/i)[1] : contentURL; // HQ
      });
      contentURL = contentURL || document.querySelector('#tabEmbed > input').value.replace(/.*src="(.*?)".*/i, '$1');
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video-player-bg');
      appendPosition = 'after';
      embedCodeFrame_BackgroundColor = document.body.getComputedProperty('background-color');
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    initFunction = function(){setAutoHD(); mainFunction();};
    waitForElement('.parameterelmt_forced', false, initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://www.pornhub.com/*')
  ) {
    addOpenInNewTabProperty('.phimage a');
    addPageControlKeys('.page_previous.alpha > a', '.page_next.omega > a');
    if (pageURL.matchLink('http://www.pornhub.com/view_video.php[?]viewkey=*')) {
      mainFunction = function() {
        contentURL = document.querySelector('meta[name="twitter:player"]').content;
        posterURL = document.querySelector('meta[name="twitter:image"]').content;
        appendToFrame = document.querySelector('.video-actions-container');
        appendPosition = 'before';
        addEmbedCodeFrame(mainFunction);
        addKeyComboCtrlC(true);
      };
      waitForElement('meta[name="twitter:player"]', 'content', initFunction, delay, tries, false);
    }
  }

  else if (
    pageURL.matchLink('http://www.eporner.com/hd-porn/*/*/')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('#EPvideo_html5_api').src;
      contentURL = document.querySelector('#embright > .textare1 > textarea').value.match(/.*src="(.*?)".*/i)[1];
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#cutscenes');
      appendPosition = 'before';
      qualityButtons = [document.querySelector('.vjs-control-bar > .vjs-icon-hd > .vjs-menu > .vjs-menu-content')];
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    initFunction = function(){mainFunction(); useVolumeCookie('#EPvideo_html5_api', null);};
    waitForElement('#EPvideo_html5_api', 'src', initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://www.tube8.com/*/*/*/*')
  ) {
    mainFunction = function() {
      var data = flashvars; // tube8.com global
      contentURL = data.quality_1080p || data.quality_720p || data.quality_480p || data.quality_360p || data.quality_180p; // direct
      contentURL = page_params.embedCode ? page_params.embedCode.match(/.*src="(.*?)".*/i)[1] : contentURL; // embed
      posterURL = data.image_url;
      appendToFrame = document.querySelector('.underplayer_wrap');
      appendPosition = 'before';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForCondition(function(){return flashvars;}, initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://juicygif.com/public/Gif/*.html/*')
  ) {
    mainFunction = function() {
      pageURL = pageURL.replace(/(.*html).*/i, '$1');
      contentURL = document.querySelector('img[itemprop="contentUrl"]').src;
      posterURL = contentURL;
      // posterURL = document.querySelector('div[itemprop="thumbnailUrl"]').innerText.replace('normal_', 'thumb_').trim();
      appendToFrame = document.querySelector('div.img');
      appendPosition = 'after';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('img[itemprop="contentUrl"]', 'src', initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://www.sex.com/picture/*/')
  ) {
    mainFunction = function() {
      contentURL = document.querySelector('.image_frame img').src;
      contentURL = contentURL.replace(/(.*?)\?.*/, '$1');
      posterURL = document.querySelector('meta[itemprop="thumbnail"]').content;
      appendToFrame = document.querySelector('.image_frame');
      appendPosition = 'after';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
      mainFunctionTG = null;
    };
    waitForElement('.image_frame img', 'src', mainFunction, delay, tries, false, false);
  }

  else if (
    pageURL.matchLink('http://www.pichunter.com/gallery/*/*')
  ) {
    embedCodeTextRefresh = false;
    mainFunction = function() {
      var gallery, images = [];
      gallery = document.querySelector('#gallery > .flex-images');
      images = gallery.querySelectorAll('img');
      pageURL = pageURL.replace(/(.*?)#.*/, '$1');
      forEach(images, function(index, self) {
        contentURL = self.parentNode.href;
        posterURL = self.src.replace('_o.jpg', '_i.jpg');
        contentTitle = ''; //pageTitle.replace(/^.{1} /i, '').Capitalize();
        if (embedCodeText) {embedCodeText = embedCodeText + '\n' + '<div class="thumbnail"';} else {embedCodeText = '<div class="thumbnail"';}
        if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
        if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
        embedCodeText += ' content="'+contentURL+'"';
        if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
        embedCodeText += '></div>';
      });
      appendToFrame = gallery;
      appendPosition = 'after';
      textAreaAutoHeight = true;
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('#gallery', false, initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://www.imagefap.com/pictures/6115310/*view=2')
  ) {
    embedCodeTextRefresh = false;
    mainFunction = function() {
      var imagesArray = [];
      var thumbsArray = [];

      var userID = document.querySelector('#menubar > table > tbody > tr:nth-child(2) > td:nth-child(1) > a').href;
      userID = userID.replace(/.*user=(.*)/i, '$1');

      var galleryID = document.querySelector('#galleryid_input').value;

      var imageNames = document.querySelectorAll('td > font > i');
      forEach(imageNames, function(index, self) {
        var image = self.innerText;
        imagesArray.push(image);
      });

      var imageIDs = document.querySelectorAll('#gallery > form > table > tbody > tr > td');
      forEach(imageIDs, function(index, self) {
        var imageID = self.id;
        var image = imagesArray[index];
        var imageURL = 'http://x.imagefapusercontent.com/u/' + userID + '/' + galleryID + '/' + imageID + '/' + image;
        imagesArray[index] = imageURL;
      });

      var thumbs = gallery.querySelectorAll('#gallery > form > table > tbody > tr > td > table > tbody > tr > td > a > img');
      forEach(thumbs, function(index, self) {
        var thumbURL = self.src;
        // thumbURL = thumbURL.replace(/.*\/thumb\/(.*)/i, ' http://x.fap.to/images/mini/$1');
        thumbURL = thumbURL.replace(/.*\/thumb\/(.*)/i, ' http://x.fap.to/thumb/$1');
        thumbsArray.push(thumbURL);
      });

      pageURL = pageURL.replace(/(.*?)\?.*/, '$1');

      forEach(thumbsArray, function(index, self) {
        contentURL = imagesArray[index];
        posterURL = self;
        contentTitle = ''; //pageTitle.replace(/^.{1} /i, '').Capitalize();
        if (embedCodeText) {embedCodeText = embedCodeText + '\n' + '<div class="thumbnail"';} else {embedCodeText = '<div class="thumbnail"';}
        if (contentURL !== pageURL) embedCodeText += ' title="'+contentTitle+'"';
        if (posterURL && posterURL !== contentURL) embedCodeText += ' image="'+posterURL+'"';
        embedCodeText += ' content="'+contentURL+'"';
        if (contentURL !== pageURL) embedCodeText +=' url="'+pageURL+'"';
        embedCodeText += '></div>';
      });

      appendToFrame = document.querySelector('#gallery');
      appendPosition = 'after';
      textAreaAutoHeight = true;
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('#gallery', false, initFunction, delay, tries, false);
  }

  else if (
    pageURL.matchLink('http://www.hdporncollections.com/*/')
  ) {
    mainFunction = function() {
      document.querySelector('.jwdisplayIcon').click();
      contentURL = document.querySelector('.jwvideo > video').src;
      posterURL = document.querySelector('meta[property="og:image"]').content;
      appendToFrame = document.querySelector('#video');
      appendPosition = 'after';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('.jwvideo > video', 'src', initFunction, delay, null, false);
  }

  else if (
    pageURL.matchLink('http://konachan.com/post?*')
  ) {
    addPageControlKeys('a.previous_page', 'a.next_page');
    addOpenInNewTabProperty('a.thumb');
    if (pageURL.matchLink('http://konachan.com/post/show*')) {
      mainFunction = function() {
        addGlobalStyle('#image {max-width: 100%; max-height: 100%; width: auto; height: auto;}');
        var preview_url;
        forEach(document.querySelectorAll('#post-view > script'), function(index, self) {
          var text = self.text;
          preview_url = text.match('"preview_url":"(.*?)"')[1].replace(/\\\//g, '/');
        });
        contentURL = document.querySelector('#image').src;
        posterURL = preview_url;
        appendToFrame = document.querySelector('#image');
        appendPosition = 'after';
        addEmbedCodeFrame(mainFunction);
        addKeyComboCtrlC(true);
      };
      waitForElement('#image', 'src', initFunction, delay, null, false);
    }
  }

  else if (
    pageURL.matchLink('http://pron.tv/l/*/*')
  ) {
    // addGlobalStyle('#actualPlayer {padding-bottom: 20px;}');
    mainFunction = function() {
      contentURL = document.querySelectorAll('#actualPlayer iframe')[0].src;
      if (contentURL.matchLink('https://docs.google.com/file/d/*/preview?*')) contentURL = contentURL + '&hd=1';
      // if (contentURL.matchLink('http://cdn.rhcdn.net/*.html')) contentURL = contentURL.replace(/.*cdn.rhcdn.net\/(.*?).html/i, 'http://redirector.rhcdn.net/media/videos/hd/$1.mp4');
      // if (contentURL.matchLink('http://cdn.rhcdn.net/*.html')) contentURL = contentURL.replace(/.*cdn.rhcdn.net\/(.*?).html/i, 'https://cdn.redtraffic.xyz/hls/$1.mp4/index.m3u8');
      posterURL = document.querySelector('.blockx img.imgshadow').src;
      appendToFrame = document.querySelector('.blockx');
      appendPosition = 'before';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('#actualPlayer iframe', 'src', initFunction, delay, null, false);
  }

  else if (
    pageURL.matchLink('http://www.xmoviesforyou.com/*/*/*.html')
  ) {
    mainFunction = function() {
      textAreaAutoHeight = true;
      contentURL = document.querySelector('iframe[src^="https://openload.co/"]').src;
      posterURL = document.querySelector('img.size-full').src;
      appendToFrame = document.querySelector('iframe[src^="https://openload.co/"]');
      appendPosition = 'after';
      addEmbedCodeFrame(mainFunction);
      addKeyComboCtrlC(true);
    };
    waitForElement('iframe[src^="https://openload.co/"]', 'src', initFunction, delay, null, false);
  }

  else if (
    pageURL.matchLink('https://danbooru.donmai.us/posts')
  ) {
    addPageControlKeys('a[rel="prev"]', 'a[rel="next"]');
    addOpenInNewTabProperty('article > a');
    if (pageURL.matchLink('https://danbooru.donmai.us/posts/*')) {
      mainFunction = function() {
        contentURL = document.querySelector('#image-container').getAttribute('data-large-file-url');
        contentURL = contentURL ? ('http://' + pageHost + contentURL) : contentURL;
        posterURL = document.querySelector('#image-container').getAttribute('data-preview-file-url');
        posterURL = posterURL ? ('http://' + pageHost + posterURL) : posterURL;
        appendToFrame = document.querySelector('#image-container');
        appendPosition = 'after';
        addEmbedCodeFrame(mainFunction);
        addKeyComboCtrlC(true);
      };
      waitForElement('#image-container', 'data-preview-file-url', initFunction, delay, null, false);
    }
  }

  else if (
    pageURL.matchLink('https://biqle.ru/*')
  ) {
    addHDtext('.video-title', 'rgba(255, 255, 255, 1)');
    if (
      pageURL.matchLink('https://biqle.ru/watch/*')
    ) {
      mainFunction = function() {
        contentURL = document.querySelector('iframe').src + '/RD';
        posterURL = document.querySelector('link[itemprop="thumbnailUrl"]').href;
        appendToFrame = document.querySelector('.heading');
        appendPosition = 'before';
        addEmbedCodeFrame(mainFunction);
        addKeyComboCtrlC(true);
      };
      waitForElement('iframe', 'src', initFunction, delay, null, false);
    }
  }

  else if (
    pageURL.matchLink('https://www.bitporno.sx/*')
  ) {
    if (
      pageURL.matchLink('https://www.bitporno.sx/?*v=*')
    ) {
      mainFunction = function() {
        contentURL = document.querySelector('#embed_code').value.match(/.*src="(.*?)".*/i)[1];
        posterURL = document.querySelector('meta[property="og:image"]').content;
        appendToFrame = document.querySelector('#like-up');
        appendPosition = 'before';
        addEmbedCodeFrame(mainFunction);
        addKeyComboCtrlC(true);
      };
      waitForElement('#embed_code', false, initFunction, delay, null, false);
    }
  }
})();
