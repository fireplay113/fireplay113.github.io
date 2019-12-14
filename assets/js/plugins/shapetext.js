/*
	ShapeText
	Description:
-------------------------------------------------- */

var $elm, $container, contWidth, contHeight, linesCount, lineHeight, mem = {}, origString;

var shapeText = function(string, element, container, shape) {

	origString = string;
	$elm = $elm || $(element);
	$container = $container || $(container);
	contWidth = contWidth || $container.width();
	// toastr.info(contWidth);
	contHeight = contHeight || $container.height();
	lineHeight = lineHeight || parseInt($elm.css("line-height"));
	linesCount = contHeight / (+lineHeight);

	// toastr.info(string, "Исходная строка");
	if($container.attr("style") && $container.attr("style").indexOf("font-size") > -1) {
		var styleAttr = $container.attr("style").replace(/font-size[^;]*;/, "");
		// toastr.info(styleAttr, "Style Attr removed");
		$container.attr("style", styleAttr);
	}
	$elm.html(format(string));

};

var format = function(string) {
	var res = "", i, lineIndex = 0, substr, spaceIdx;

	/**
	 * функция вызывается если строка не влезла
	 * в контейнер, находит пробел, вставляет вместо него перенос
	 * сохраняет в переменную res строку с переносом
	 * а в переменную string остаток
	 * @param  {string} substr [substring with max width]
	 * @return {none}
	 */
	var breakString = function(substr) {

		if ( substr.indexOf("-") > 0 ) {
			spaceIdx = substr.lastIndexOf("-");
			res = res + substr.slice(0, spaceIdx + 1) + "<br/>";
			string = string.slice(spaceIdx + 1);
		} else if ( substr.indexOf(" ") > 0 ) {
			spaceIdx = substr.lastIndexOf(" ");
			res = res + substr.slice(0, spaceIdx) + "<br/>";
			string = string.slice(spaceIdx + 1);
		} else {
			spaceIdx = Math.floor(substr.length/2);
			if ( spaceIdx < 3 ) {
				var fontSize = parseInt($container.css("font-size"));
				$container.css("font-size", fontSize - 2);
				string = origString;
				res = "";
				lineIndex = -1;
			} else {
				res = res + substr.slice(0, spaceIdx+1) + "-<br/>";
				string = string.slice(spaceIdx+1);
			}
		}
		lineIndex++;
	};

	while (string.length > 0) {
		for ( i = 0; i < string.length; i++ ) {
			substr = string.slice(0, i);
			if( !isFit(substr, lineIndex) ) {
				breakString(substr);
				break;
			}else{
				if(i === string.length - 1) {
					if(!isFit(string, lineIndex)) {
						breakString(substr);
						break;
					}else{
						res = res + string;
						string = "";
						break;
					}
				}
			}
		}
	}
	return postFormat(res, lineIndex);
};

var getTextWidth = function(string) {
	var tempEl = $("<span/>", {
		style: "display: none",
		html: string
	}).appendTo($container);
	var w = tempEl.width();
	tempEl.remove();
	return w;
};

/**
 * testing if string fits desired with
 * @param  {string}  string tested string
 * @param  {number}  n      line number
 * @return {Boolean}
 */
var isFit = function(string, n) {
	return (getTextWidth(string) <= (contWidth - n * 18));
};

var postFormat = function(string, lines) {
	if(getTextWidth(string) > (contWidth*0.75) && lines === 0 && string.indexOf(" ") > 0) {
		string = string.replace(/(\s)([^\s]+$)/, "<br/>$2");
	}
	// toastr.info(string.replace(/<br\/>/g, "&lt;br\/&gt;"), "Финальная строка");
	return string;
};