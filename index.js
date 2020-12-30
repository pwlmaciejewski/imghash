const fs = require("fs").promises;
const blockhash = require("blockhash-core");
const { imageFromBuffer, getImageData } = require("@canvas/image");
const imageType = require("image-type");
const jpeg = require("jpeg-js");

async function hash(filepath, bits = 8, format = "hex") {
  if (format !== "hex" && format !== "binary")
    throw new Error("Unsupported format");

  if (bits % 4 !== 0) throw new Error("Invalid bitlength");

  const content = Buffer.isBuffer(filepath)
    ? filepath
    : await fs.readFile(filepath);

  let data;
  try {
    data = await getImageData(await imageFromBuffer(content));
  } catch (err) {
    const { mime } = imageType(content);
    if (mime === "image/jpeg") {
      data = jpeg.decode(content, { maxMemoryUsageInMB: 1024 });
    } else {
      throw err;
    }
  }
  const dataHash = hashRaw(data, bits);
  return format === "hex" ? dataHash : hexToBinary(dataHash);
}

function hashRaw(data, bits) {
  return blockhash.bmvbhash(data, bits);
}

function hexToBinary(str) {
  let ret = "";
  for (const v of str) {
    ret += parseInt(v, 16).toString(2).padStart(4, 0);
  }
  return ret;
}

function binaryToHex(str) {
  let ret = "";
  for (let i = 0; i < str.length; i += 4) {
    ret += parseInt(str.slice(i, i + 4), 2).toString(16);
  }
  return ret;
}

module.exports = {
  hash,
  hashRaw,
  hexToBinary,
  binaryToHex,
};
