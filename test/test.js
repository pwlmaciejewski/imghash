const assert = require('chai').assert;
const imghash = require('../index');
const fs = require('fs');
const hdist = require('hamming-distance');

it('should create hash for jpeg', function() {
  return imghash
    .hash(__dirname + '/files/absolut1')
    .then((hash) => {
      assert.ok(hash);
    });
});

it('should create hash for png', function() {
  return imghash
    .hash(__dirname + '/files/castle1.png')
    .then((hash) => {
      assert.ok(hash);
    });
});

it('should create same hashes the same images', function() {
  const h1 = imghash.hash(__dirname + '/files/castle1.png');
  const h2 = imghash.hash(__dirname + '/files/castle2.png');
  return Promise
    .all([h1, h2])
    .then((res) => {
      assert.equal(res[0], res[1]);
    });
});

it('should create different hashes different images', function() {
  const h1 = imghash.hash(__dirname + '/files/castle1.png');
  const h2 = imghash.hash(__dirname + '/files/absolut1');
  return Promise
    .all([h1, h2])
    .then((res) => {
      var dist = hdist(res[0], res[1]);
      assert.isAbove(dist, 20);
    });
});

it('should create close hashes similar images', function() {
  const h1 = imghash.hash(__dirname + '/files/absolut2');
  const h2 = imghash.hash(__dirname + '/files/absolut1');
  return Promise
    .all([h1, h2])
    .then((res) => {
      var dist = hdist(res[0], res[1]);
      assert.isBelow(dist, 20);
    });
});

it('should support binary output', function() {
  const h1 = imghash.hash(__dirname + '/files/absolut1', null, 'hex');
  const h2 = imghash.hash(__dirname + '/files/absolut1', null, 'binary');
  return Promise
    .all([h1, h2])
    .then((res) => {
      assert.notEqual(res[0], res[1]);
    });
});

it('should support validate output format', function() {
  assert.throws(() => {
    imghash.hash(__dirname + '/files/absolut1', null, 'foo');
  });
});

it('should support variable bits length', function() {
  const h1 = imghash.hash(__dirname + '/files/absolut1', 8);
  const h2 = imghash.hash(__dirname + '/files/absolut1', 16);
  return Promise
    .all([h1, h2])
    .then((res) => {
      assert.equal(res[0].length * 4, res[1].length);
    });
});

it('should validate bit lengths', function() {
  assert.throws(() => {
    imghash.hash(__dirname + '/files/absolut1', 10);
  });
});

it('should expose hexToBinary', function() {
  assert.equal(imghash.hexToBinary('83C3D381C38985A5'), '1000001111000011110100111000000111000011100010011000010110100101');
});

it('should expose binaryToHex', function() {
  assert.equal(imghash.binaryToHex('1000001111000011110100111000000111000011100010011000010110100101'), '83c3d381c38985a5');
});

it('should accept Buffer input', function() {
  const buffer = fs.readFileSync(__dirname + '/files/absolut1');
  const hash = imghash.hash(buffer);
  return hash.then(res => {
    assert.isNotNull(res);
  });
});
