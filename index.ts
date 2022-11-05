import fs from "fs/promises";
import blockhash from "blockhash-core";
import { imageFromBuffer, getImageData } from "@canvas/image";
import imageType from "image-type";
import jpeg from "jpeg-js";

const JPEG_MAX_MEMORY_USAGE_MB = 1024;

export async function hash(
  filepath: string | Buffer,
  bits = 8,
  format = "hex"
): Promise<string> {
  if (format !== "hex" && format !== "binary") {
    throw new Error(`Unsupported format: ${format}`);
  }

  if (bits % 4 !== 0) {
    throw new Error(`Invalid bit-length: ${bits}`);
  }

  const fileData = Buffer.isBuffer(filepath)
    ? filepath
    : await fs.readFile(filepath); // error handling?

  const imageData = await imageFromBuffer(fileData)
    .then((image) => getImageData(image))
    .catch((error) => {
      if (!imageType(fileData) || imageType(fileData)?.mime !== "image/jpeg")
        throw error;
      return jpeg.decode(fileData, {
        maxMemoryUsageInMB: JPEG_MAX_MEMORY_USAGE_MB,
      });
    });

  if (imageData === undefined) {
    throw new Error(
      "Could not get image data after buffer to image conversion. ImageData is undefined"
    );
  }

  const hexHash = hashRaw(imageData, bits);

  return format === "binary" ? hexToBinary(hexHash) : hexHash;
}

export function hashRaw(data: blockhash.ImageData, bits: number) {
  return blockhash.bmvbhash(data, bits);
}

export function hexToBinary(s: string) {
  return s
    .split("")
    .map((hexDigit) => parseInt(hexDigit, 16).toString(2).padStart(4, "0"))
    .join("");
}

export function binaryToHex(s: string) {
  let ret = "";
  for (let i = 0; i < s.length; i += 4) {
    const chunk = s.slice(i, i + 4);
    ret += parseInt(chunk, 2).toString(16);
  }
  return ret;
}
