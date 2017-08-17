// ==UserScript==
// @name        Pinterest without registration
// @namespace   http://andrealazzarotto.com/
// @version     2.1.2
// @description Allows to browse Pinterest without login/registration, removing the offending modal popup
// @include     http://*.pinterest.com/*
// @include     https://*.pinterest.com/*
// @include     https://*.pinterest.*/*
// @copyright   2014+, Andrea Lazzarotto
// @require     http://code.jquery.com/jquery-latest.min.js
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant       GM_addStyle
// ==/UserScript==

// Very humble query string extractor
function searchParameter() {
    if (location.href.indexOf('q=') > -1) {
        var result = location.href.split('q=')[1].split('&')[0];
        return decodeURIComponent(result.replace(/\+/g, ' '));
    }
    return;
}

// Header shown on single pin pages if Pinterest hides the real one
var fake_header = '<div class="Header Module full newHeaderBar">\n<div style="top:0;background-color:#fff;border-bottom:1px solid #ccc;width:100%;min-width:770px;position:fixed;z-index:999">\n<div style="height:64px;display:flex;align-items:center;margin:0 32px">\n<div style="order:1;-webkit-order:1;-ms-flex-order:1">\n<div style="display:inline-flex">\n<div class="UnauthHeader__rightContentContainer" style="position:relative;width:264px"></div>\n</div>\n</div>\n<div style="display:flex;flex:1;align-items:center">\n<a href="/"><img style="cursor:pointer;display:block;float:left;height:28px" src="https://s-media-cache-ak0.pinimg.com/600x/4a/b1/ea/4ab1eade8de69aafb3865b2d36c1cc8c.jpg"></a>\n<div style="color:#434343;font-size:18px;font-weight:bold;margin-left:14px">Pinterest</div>\n</div>\n</div>\n</div>\n</div>';

$(document).ready(function () {
	if(!!$("div.UnauthHomeReactPage").length)
		location.href = "https://www.pinterest.com/categories";

	GM_addStyle(".UnauthBanner, body > .Modal, .ModalManager > .Modal { display: none !important; } " +
		".noScroll { overflow: auto !important; } " +
		"div[style*='cubic-bezier'], div[style*='fixed']>div[style*='opacity: 0.5'], .FullPageModal__scroller { display: none !important; } " +
		"div.gridContainer > div, .Grid { height: auto !important; }");
    GM_addStyle(".Header { width: 100%; }");
	GM_addStyle("#desktopWrapper { position: inherit !important}" +
        '.DenzelReactBridge > div > div[style*="opacity: 1"] {display: none !important;}');

	$("body").removeClass("noTouch").css('height', 'auto');
	$('div[data-reactid][style*=fixed]').css('position', 'relative');
	$("#desktopWrapper + * + div").remove();

    // Add simple search form
    var searchForm = $("<form name='search' action='/search/pins/'>" +
                       "<input type='text' name='q' />" +
                       "<button type='submit'>" +
                       "<img style='width: 24px; margin-top: -4px' src='https://i.imgur.com/N7XY1gz.png'>" +
                       "</button></form>");
    searchForm.css('margin-right', '4em').find('input, button').css({
        'height': '40px',
        'line-height': '36px',
        'padding': '0 1em',
        'border': '1px solid #ddd',
        'background': 'white',
        'border-radius': '4px',
        'box-sizing': 'border-box',
        'font-size': '14px'
    });
    searchForm.find('input').val(searchParameter()).css('width', 'calc(100vw - 640px)');
    searchForm.find('button').css({
        'margin-left': '1em',
        'background-color': '#ebebeb',
        'border': 0
    });
    if ($('.Header, div[data-test-unauthheader]').length < 1)
        $('.appContent').css('padding-top','64px').before(fake_header);
    $(".UnauthHeader__rightContentContainer").before(searchForm);

	if (location.href.indexOf(".com/pin/") > 0) {
		// enlarge the pin to prevent confusion
		var bigURL = $("meta[name='og:image']").attr("content").replace("x315/", "x/");
		var first = $($(".gridCentered[data-test-pingrid] > div div[class][style]").get(0));

		first.prependTo(first.parent().parent().parent()).attr("class", "").css({
			'margin': '3em auto',
			'text-align': 'center'
		});
		first.find('div').css('text-align', 'left');
		first.find('> div').css('width', 'auto');
		var image = first.find(".GrowthUnauthPinImage img");
		image.attr("src", bigURL).attr("srcset", '').css('height', 'auto').parent().attr("href", $("meta[name='og:see_also']").attr("content"));
        first.click(function(e) {
            e.stopPropagation();
        });
	}
});