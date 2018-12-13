"use strict";
exports.__esModule = true;
var fs = require("fs");
var R = require("ramda");
var classes = {
    verseMain: 'class="verseMain"',
    verseMarker: 'class="verseMarker"'
};
var fileName = './king_james.txt';
var encoding = 'utf8';
var wrapDivVerse = function (s) { return R.pipe(R.concat("<div " + classes.verseMain + ">"), R.concat(R.__, '/<div>'))(s); };
var isChapterX = function (chapterNumber) {
    return R.pipe(R.split(':'), R.findIndex(R.equals(chapterNumber.toString())), R.equals(0));
};
var formatVerse = function (verse) {
    var marker = R.split(' ', verse)[0];
    var newMarker = "<span " + classes.verseMarker + ">" + marker + "</span>";
    return wrapDivVerse(R.replace(marker, newMarker, verse));
};
var arrayToFile = function (fileName, data) {
    try {
        fs.unlinkSync(fileName);
    }
    catch (err) {
        console.log(err);
    }
    fs.writeFile(fileName, R.join('', R.map(function (s) { return formatVerse(s) + "\n"; }, data)), function (err) {
        if (err)
            throw err;
    });
};
fs.readFile(fileName, encoding, function (err, contents) {
    arrayToFile('b1c1.txt', R.pipe(R.split('The Second Book of Moses:'), function (x) { return x[0]; }, R.split('\n'), R.filter(isChapterX(1)), R.map(R.replace('\r', '')))(R.pipe(R.split('The First Book of Moses:'), function (x) { return x[1]; })(contents)));
});
