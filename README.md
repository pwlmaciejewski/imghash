# imghash [![Build Status](https://secure.travis-ci.org/pwlmaciejewski/imghash.png?branch=master)](http://travis-ci.org/pwlmaciejewski/imghash) [![npm version](https://badge.fury.io/js/imghash.png)](https://badge.fury.io/js/imghash)
Promise-based image perceptual hash calculation for node.

## Installation

```
npm install imghash
```

## Basic usage

```javascript
const imghash = require('imghash');

imghash
  .hash('path/to/file')
  .then((hash) => {
    console.log(hash); // 'f884c4d8d1193c07'
  });

// Custom hex length and result in binary
imghash
  .hash('path/to/file', 4, 'binary')
  .then((hash) => {
    console.log(hash); // '1000100010000010'
  });
```

## Finding similar images

To measure similarity between images you can use [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) or [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance). 

The following example uses the latter one:

```javascript
const imghash = require('imghash');
const leven = require('leven');

const hash1 = imghash.hash('./img1');
const hash2 = imghash.hash('./img2');

Promise
  .all([hash1, hash2])
  .then((results) => {
    const dist = leven(results[0], results[1]);
    console.log(`Distance between images is: ${dist}`);
    if (dist <= 12) {
      console.log('Images are similar');
    } else {
      console.log('Images are NOT similar');
    }
  });
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
