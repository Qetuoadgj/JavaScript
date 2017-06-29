// ==UserScript==
// @name         JS.Simple.Translit.Lib
// @icon         https://www.google.com/s2/favicons?domain=ajaxs.ru
// @version      1.0.0
// @description  Pure JavaScript version.
// @author       Ægir
// @grant        none
// @noframes
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/JS.Simple.Translit.Lib
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        none
// @exclude      *
// ==/UserScript==

// Source: http://ajaxs.ru/lesson/javascript/137-transliteracija_stroki_na_javascript.html

function translit(text) {
	// Символ, на который будут заменяться все спецсимволы
	var space = '-';
	// Переводим значение в нижний регистр
	text = text.toLowerCase();

	// Массив для транслитерации
	var transl = {
		'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
		'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
		'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
		'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': space, 'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya',
		' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
		'#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
		'(': space, ')': space,'-': space, '\=': space, '+': space, '[': space,
		']': space, '\\': space, '|': space, '/': space,'.': space, ',': space,
		'{': space, '}': space, '\'': space, '"': space, ';': space, ':': space,
		'?': space, '<': space, '>': space, '№':space
	};

	var result = '';
	var curent_sim = '';

	for(i=0; i < text.length; i++) {
		// Если символ найден в массиве то меняем его
		if(transl[text[i]] !== undefined) {
			if(curent_sim != transl[text[i]] || curent_sim != space){
				result += transl[text[i]];
				curent_sim = transl[text[i]];
			}
		}
		// Если нет, то оставляем так как есть
		else {
			result += text[i];
			curent_sim = text[i];
		}
	}

	// Выводим результат
	return result;
}
