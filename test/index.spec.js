const fs = require("fs");
const leven = require("leven");

const imghash = require("../index");

it.each([
  ["jpeg", "/files/absolut1"],
  ["png", "/files/castle1.png"],
  ["bmp", "/files/castle1.bmp"],
])("should create hash for %s", async (fileType, filePath) => {
  const hash = await imghash.hash(__dirname + filePath);
  expect(hash).toBeDefined();
});

it("should create close hashes for the same image but in a different format", async () => {
  const h1 = await imghash.hash(__dirname + "/files/castle1.png");
  const h2 = await imghash.hash(__dirname + "/files/castle1.bmp");
  const dist = leven(h1, h2);
  expect(dist).toBeLessThan(12);
});

it("should create same hashes the same images", async () => {
  const h1 = await imghash.hash(__dirname + "/files/castle1.png");
  const h2 = await imghash.hash(__dirname + "/files/castle2.png");
  expect(h1).toBe(h2);
});

it("should create different hashes different images", async () => {
  const h1 = await imghash.hash(__dirname + "/files/castle1.png");
  const h2 = await imghash.hash(__dirname + "/files/absolut1");
  const dist = leven(h1, h2);
  expect(dist).toBeGreaterThan(12);
});

it("should create close hashes similar images", async () => {
  const h1 = await imghash.hash(__dirname + "/files/absolut2");
  const h2 = await imghash.hash(__dirname + "/files/absolut1");
  const dist = leven(h1, h2);
  expect(dist).not.toBe(0);
  expect(dist).toBeLessThan(14);
});

it("should support binary output", async () => {
  const h1 = imghash.hash(__dirname + "/files/absolut1", null, "hex");
  const h2 = imghash.hash(__dirname + "/files/absolut1", null, "binary");
  expect(h1).not.toBe(h2);
});

/**
 * pngcheck shows this image to have 4-bit palette color type which png-js doesn't handle well:
 * pngcheck test/files/Arius.png
 * OK: test/files/Arius.png (150x200, 4-bit palette, non-interlaced, 14.7%).
 *
 * see: https://github.com/commonsmachinery/blockhash-js/issues/7
 */
it("should hash palette based pngs correctly", async () => {
  const h1 = await imghash.hash(__dirname + "/files/Arius.png", 16, "hex");
  const h2 = "0ff91ff10ff1008300018fd986d79ddf9e058fc30fc30fc3dfc3c3c30b831783";
  expect(h1).toBe(h2);
});

/**
 * For some jpeg images, cwasm-jpeg-turbo throws longjmp error due to a bug in WebAssembly.
 * Added a workaround to use alternate libraries to read such images.
 *
 * see: https://github.com/LinusU/cwasm-jpeg-turbo/issues/2
 * see: https://github.com/pwlmaciejewski/imghash/issues/21
 */
it("should not throw longjmp error", () => {
  expect(async () => {
    const h1 = await imghash.hash(__dirname + "/files/longjmperror.jpg", 8);
    const h2 = await imghash.hash(__dirname + "/files/longjmperror.jpg", 16);
    expect(h1.length).toBe(16);
    expect(h1.length * 4).toBe(h2.length);
  }).not.toThrow();
});

it("should support validate output format", () => {
  expect(() => {
    imghash.hash(__dirname + "/files/absolut1", null, "foo");
  }).toThrow();
});

it("should support variable bits length", async () => {
  const h1 = await imghash.hash(__dirname + "/files/absolut1", 8);
  const h2 = await imghash.hash(__dirname + "/files/absolut1", 16);
  expect(h1.length * 4).toBe(h2.length);
});

it("should validate bit lengths", function () {
  expect(() => {
    imghash.hash(__dirname + "/files/absolut1", 10);
  }).toThrow();
});

it("should expose hexToBinary", () => {
  expect(imghash.hexToBinary("83C3D381C38985A5")).toBe(
    "1000001111000011110100111000000111000011100010011000010110100101"
  );
});

it("should expose binaryToHex", () => {
  expect(
    imghash.binaryToHex(
      "1000001111000011110100111000000111000011100010011000010110100101"
    )
  ).toBe("83c3d381c38985a5");
});

it("should accept Buffer input", async () => {
  const buffer = fs.readFileSync(__dirname + "/files/absolut1");
  const hash = await imghash.hash(buffer);
  expect(hash).not.toBeNull();
});
