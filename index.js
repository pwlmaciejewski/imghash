'use strict';

const imageType = require('image-type');
const fs = require('fs');
const jpeg = require('jpeg-js');
const PNG = require('png-js');
const blockhash = require('blockhash');

function hash(filepath, bits, format) {
  format = format || 'hex';
  if (format !== 'hex' && format !== 'binary') throw new Error('Unsupported format');

  bits = bits || 8;
  if (bits % 4 !== 0) throw new Error('Invalid bitlength');

  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(filepath)) {
      return resolve(filepath);
    }

    fs.readFile(filepath, (err, content) => {
      if (err) return reject(err);
      resolve(content);
    });
  })
  .then((fdata) => {
    const ftype = imageType(fdata);

    if (ftype.mime === 'image/jpeg') {
      return jpeg.decode(fdata);
    }

    if (ftype.mime === 'image/png') {
      return new Promise((resolve, reject) => {
        let png = new PNG(fdata);
        png.decode((pixels) => {
          resolve({
            width: png.width,
            height: png.height,
            data: pixels
          });
        });
      });
    }

    throw new Error('Unsupported image type');
  })
  .then((data) => hashRaw(data, bits))
  .then((hexHash) => {
    if (format === 'hex') return hexHash;
    if (format === 'binary') return hexToBinary(hexHash);
  });
}

function hashRaw(data, bits) {
  return blockhash.blockhashData(data, bits, 2);
}

function hexToBinary(s) {
  const lookup = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'a': '1010',
    'b': '1011',
    'c': '1100',
    'd': '1101',
    'e': '1110',
    'f': '1111',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111'
  };
  let ret = '';
  for (let i = 0; i < s.length; i++) {
    ret += lookup[s[i]];
  }
  return ret;
}

function binaryToHex(s) {
  const lookup = {
    '0000': '0',
    '0001': '1',
    '0010': '2',
    '0011': '3',
    '0100': '4',
    '0101': '5',
    '0110': '6',
    '0111': '7',
    '1000': '8',
    '1001': '9',
    '1010': 'a',
    '1011': 'b',
    '1100': 'c',
    '1101': 'd',
    '1110': 'e',
    '1111': 'f'
  };
  let ret = '';
  for (let i = 0; i < s.length; i += 4) {
    let chunk = s.slice(i, i + 4);
    ret += lookup[chunk];
  }
  return ret;
}

module.exports = {
  hash,
  hashRaw,
  hexToBinary,
  binaryToHex
};
