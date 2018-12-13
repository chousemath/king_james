import * as fs from 'fs';
import * as R from 'ramda';

const classes = {
  verseMain: 'class="verseMain"',
  verseMarker: 'class="verseMarker"',
};
const fileName = './king_james.txt';
const encoding = 'utf8';

const wrapDivVerse = (s: string): string => R.pipe(
    R.concat(`<div ${classes.verseMain}>`),
    R.concat(R.__, '/<div>'),
    )(s);
const isChapterX = (chapterNumber: number): (s: string) => boolean => {
  return R.pipe(
      R.split(':'),
      R.findIndex(R.equals(chapterNumber.toString())),
      R.equals(0),
  );
};
const formatVerse = (verse: string): string => {
  const marker: string = R.split(' ', verse)[0];
  const newMarker: string = `<span ${classes.verseMarker}>${marker}</span>`;
  return wrapDivVerse(R.replace(marker, newMarker, verse));
};
const arrayToFile = (fileName: string, data: Array<string>) => {
  try {
    fs.unlinkSync(fileName);
  } catch (err) {
    console.log(err);
  }
  fs.writeFile(
      fileName, R.join('', R.map((s: string) => `${formatVerse(s)}\n`, data)),
      (err) => {
        if (err) throw err;
      });
};

fs.readFile(fileName, encoding, (err, contents) => {
  arrayToFile(
      'b1c1.txt',
      R.pipe(
          R.split('The Second Book of Moses:'),
          (x: Array<string>): string => x[0],
          R.split('\n'),
          R.filter(isChapterX(1)),
          R.map(R.replace('\r', '')),
          )(R.pipe(
          R.split('The First Book of Moses:'),
          (x: Array<string>): string => x[1],
          )(contents)) as Array<string>);
});