# imghash ![build](https://github.com/pwlmaciejewski/imghash/workflows/Node.js%20CI/badge.svg) ![npm](https://img.shields.io/npm/v/imghash) ![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/pwlmaciejewski/imghash) ![NPM](https://img.shields.io/npm/l/imghash) 
Promise-based image perceptual hash calculation for node.

## Installation

```
npm install imghash
```

:information_source: You can find the command-line interface [here](https://github.com/pwlmaciejewski/imghash-cli).

## Basic usage

```js
const imghash = require("imghash");

const hash1 = await imghash.hash("./path/to/file");
console.log(hash1);  // "f884c4d8d1193c07"

// Custom hex length and result in binary
const hash2 = await imghash.hash("./path/to/file", 4, "binary");
console.log(hash2);  // "1000100010000010"
```

## Finding similar images

To measure similarity between images you can use [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) or [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance). 

The following example uses the latter one:

```js
const imghash = require("imghash");
const leven = require("leven");

const hash1 = await imghash.hash("./img1");
const hash2 = await imghash.hash("./img2");

const distance = leven(hash1, hash2);
console.log(`Distance between images is: ${distance}`);
if (distance <= 12) {
  console.log("Images are similar");
} else {
  console.log("Images are NOT similar");
}
```

## API

##### `.hash(filepath[, bits][, format])`

Returns: ES6 `Promise`, resolved returns hash string in specified format and length (eg. `f884c4d8d1193c07`)

Parameters:

* `filepath` - path to the image (supported formats are `png` and `jpeg`) or `Buffer`
* `bits` (optional) - hash length [default: `8`]
* `format` (optional) - output format [default: `hex`]

---

##### `.hashRaw(data, bits)`

Returns: hex hash

Parameters:

* `data` - image data descriptor in form `{ width: [width], height: [height], data: [decoded image pixels] }`
* `bits` - hash length

---

##### `.hexToBinary(s)`

Returns: hex string, eg. `f884c4d8d1193c07`.

Parameters:

* `s` - binary hash string eg. `1000100010000010`

---

##### `.binaryToHex(s)`

Returns: hex string, eg. `1000100010000010`.

Parameters:

* `s` - hex hash string eg. `f884c4d8d1193c07`

## Further reading

`imghash` takes advantage of block mean value based hashing method:

* [http://stackoverflow.com/questions/14377854/block-mean-value-hashing-method](http://stackoverflow.com/questions/14377854/block-mean-value-hashing-method)
* [http://commonsmachinery.se/2014/09/digital-image-matching-part-1-hashing/](http://commonsmachinery.se/2014/09/digital-image-matching-part-1-hashing/)
