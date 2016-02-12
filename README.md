# imghash
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

## API

##### `.hash(filepath[, bits][, format])`

Returns: ES6 `Promise`, resolved returns hash string in specified format and length (eg. `f884c4d8d1193c07`)

Parameters:

* `filepath` - path to the image (supported formats are `png` and `jpeg`)
* `bits` (optional) - hash length [default: `8`]
* `format` (optional) - output format [default: `hex`]

===

##### `.hashRaw(data, bits)`

Returns: hex hash

Parameters:

* `data` - image data descriptor in form `{ width: [width], height: [height], data: [decoded image pixels] }`
* `bits` - hash length

===

##### `.hexToBinary(s)`

Returns: hex string, eg. `f884c4d8d1193c07`.

Parameters:

* `s` - binary hash string eg. `1000100010000010`

===


##### `.binaryToHex(s)`

Returns: hex string, eg. `1000100010000010`.

Parameters:

* `s` - hex hash string eg. `f884c4d8d1193c07`
