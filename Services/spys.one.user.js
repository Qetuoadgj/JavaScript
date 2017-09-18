// ==UserScript==
// @name         spys.one
// @icon         https://www.google.com/s2/favicons?domain=spys.one
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Services/spys.one.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Services
// @match        http://spys.one/*
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	console.clear();

	function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}

	Element.prototype.autoHeight = function(fixedHeight) {
		this.style.height = 0;
		var h = (this.scrollHeight > this.clientHeight) ? (this.scrollHeight) + "px" : "60px";
		this.style.height = h;
		if (fixedHeight) this.style.maxHeight = h;
	};

	var result;
	var ip_list = "";
	var ip_list_selector = (
		"body > table:nth-child(3) > tbody > tr:nth-child(4) > td > table > tbody > tr.spy1x > td > font.spy14,"+
		"body > table:nth-child(3) > tbody > tr:nth-child(4) > td > table > tbody > tr.spy1xx > td > font.spy14"
	);

	document.querySelectorAll(ip_list_selector).forEach(function(item) {
		var text = item.innerText;
		if (text.match(/\d+\.\d+\.\d+\.\d+/)) {
			ip_list = ip_list + text + "\n";
			console.log(text);
			result = true;
		}
	});

	document.body.querySelectorAll("#result_table, #check_url").forEach(function(item) {
		item.remove();
	});

	if (result) {
		var check_url = document.createElement("a");
		document.body.appendChild(check_url);
		check_url.id = "check_url";
		check_url.href = "https://hidemy.name/ru/proxy-checker/";
		check_url.target = "_blank";
		check_url.innerText = check_url.href;

		var text_field = document.createElement("textarea");
		document.body.appendChild(text_field);
		text_field.id = "result_table";
		text_field.style.width = "100%";
		text_field.setAttribute("readonly", "readonly");
		text_field.setAttribute("onclick", "this.focus(); this.select();");
		text_field.value = ip_list;
		text_field.autoHeight();
	}
})();