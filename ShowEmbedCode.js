  function WaitForAttribute(elementSelector, attributeName, execFunction, delay, tries) {
    delay = delay || 10; tries = tries || 100; var cycle = 0; var keepRun = true;
    var value;
    setTimeout(function WaitForAttributeCycle() {
      if (tries) {keepRun = (cycle < tries);}
      if (keepRun) {
        // alert('cycle = ' + cycle);
        if ( document.querySelector(elementSelector) ){value = document.querySelector(elementSelector).getAttribute(attributeName);}
        if ( value && value !== '' ) {
          return execFunction();
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

  function ShowEmbedCode_MainFunction(targetFrame, thumbnail, content, embedFramePadding, embedLinkPadding, embedFrameBackgroundColor) {
    var pageHost = location.hostname, pageURL = location.href, pageTitle = document.title;
    var createImage = true, createLink = true;

    if (targetFrame) {
      var title = pageTitle.replace(/^.{1} /i, '').Capitalize();
      var oldEmbedFrame = document.getElementById("ShowEmbedCode_Frame"); if (oldEmbedFrame) {oldEmbedFrame.remove();}
      var embedCode = '<img class="thumbnail" title="'+title+'" image="'+thumbnail+'" content="'+content+'" url="'+pageURL+'">';

      var embedFrame = document.createElement('div');
      embedFrame.setAttribute('id', 'ShowEmbedCode_Frame');
      embedFrame.style.display = "block";
      if (embedFramePadding) {embedFrame.style.padding = embedFramePadding;}
      embedFrame.style['word-wrap'] = "break-word";
      if (embedFrameBackgroundColor) {embedFrame.style.backgroundColor = embedFrameBackgroundColor;}
      targetFrame.parentNode.insertBefore(embedFrame, targetFrame.nextSibling);

      var textFrame = document.createElement('textarea');
      textFrame.style.display = 'block';
      textFrame.style.border = 'none';
      textFrame.style.rows = '2';
      textFrame.style.overflow = 'hidden';
      textFrame.style['background-color'] = 'transparent';
      textFrame.style.width = '100%';
      textFrame.style['font-size'] = '12px';
      textFrame.style.color = 'grey';
      textFrame.setAttribute('readonly', 'readonly');
      textFrame.setAttribute('onclick', 'this.focus(); this.select();');
      textFrame.value = embedCode;
      embedFrame.appendChild(textFrame);

      if (createLink) {
        var embedLink = document.createElement('a');
        embedLink.style.display = 'table';
        if (embedLinkPadding) {embedLink.style.padding = '5px 0px';}
        embedLink.style['font-size'] = '12px';
        embedLink.style.color = '#086081';
        embedLink.style.width = 'auto';
        embedLink.setAttribute('target', '_blank'); // Open in new tab
        embedLink.setAttribute('href', content);
        embedLink.text = content;
        embedFrame.appendChild(embedLink);
      }

      if (createImage)  {
        var embedImage = document.createElement('img');
        embedImage.style.display = 'block';
        embedImage.style['max-height'] = '120px';
        embedImage.setAttribute('src', thumbnail);
        embedFrame.appendChild(embedImage);
        embedImage.addEventListener("click", ShowEmbedCode_MainFunction(targetFrame, thumbnail, content, embedFramePadding, embedLinkPadding, embedFrameBackgroundColor), false);
      }
    }
  }
  
