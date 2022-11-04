"use strict";

const fs = require("fs");
const blockhash = require("blockhash-core");
const { imageFromBuffer, getImageData } = require("@canvas/image");
const imageType = require("image-type");
const jpeg = require("jpeg-js");

const JPEG_MAX_MEMORY_USAGE_MB = 1024;

async function hash(filepath, bits, format) {
  format = format || "hex";
  if (format !== "hex" && format !== "binary") {
    throw new Error(`Unsupported format: ${format}`);
  }

  bits = bits || 8;
  if (bits % 4 !== 0) {
    throw new Error(`Invalid bit-length: ${bits}`);
  }

  const fileData = await new Promise((resolve, reject) => {
    if (Buffer.isBuffer(filepath)) {
      return resolve(filepath);
    }

    fs.readFile(filepath, (err, content) => {
      if (err) return reject(err);
      resolve(content);
    });
  });

  let imageData;
  try {
    const image = await imageFromBuffer(fileData);
    imageData = getImageData(image);
  } catch (error) {
    if (imageType(fileData).mime === "image/jpeg") {
      imageData = jpeg.decode(fileData, {
        maxMemoryUsageInMB: JPEG_MAX_MEMORY_USAGE_MB,
      });
    } else {
      throw error;
    }
  }

  const hexHash = hashRaw(imageData, bits);
  if (format === "binary") {
    return hexToBinary(hexHash);
  }
  return hexHash;
}

function hashRaw(data, bits) {
  return blockhash.bmvbhash(data, bits);
}

function hexToBinary(s) {
  return s
    .split("")
    .map((hexDigit) => parseInt(hexDigit, 16).toString(2).padStart(4, "0"))
    .join("");
}

function binaryToHex(s) {
  let ret = "";
  for (let i = 0; i < s.length; i += 4) {
    let chunk = s.slice(i, i + 4);
    ret += parseInt(chunk, 2).toString(16);
  }
  return ret;
}

module.exports = {
  hash,
  hashRaw,
  hexToBinary,
  binaryToHex,
};
