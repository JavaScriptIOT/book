var buffer = process.binding('buffer');
var smalloc = process.binding('smalloc');
var util = require('util');
var alloc = smalloc.alloc;
var truncate = smalloc.truncate;
var sliceOnto = smalloc.sliceOnto;
var kMaxLength = smalloc.kMaxLength;
var internal = {};
exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
Buffer.poolSize = 8 * 1024;
var poolSize, poolOffset, allocPool;
function createPool() {
  poolSize = Buffer.poolSize;
  allocPool = alloc({}, poolSize);
  poolOffset = 0;
}
createPool();

function Buffer(subject, encoding) {
  if (!util.isBuffer(this)) return new Buffer(subject, encoding);
  if (util.isNumber(subject)) {
    this.length = +subject;
  }
  else if (util.isString(subject)) {
    if (!util.isString(encoding) || encoding.length === 0) encoding = 'utf8';
    // Handle Arrays, Buffers, Uint8Arrays or JSON. 
  } else if (util.isObject(subject)) {
    if (subject.type === 'Buffer' && util.isArray(subject.data)) subject = subject.data;
    this.length = +subject.length;
  } else {
    throw new TypeError('must start with number, buffer, array or string');
  }
  if (this.length > kMaxLength) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength.toString(16) + ' bytes');
  }
  if (this.length < 0) this.length = 0;
  else this.length >>>= 0;
  // Coerce to uint32. 
  this.parent = undefined;
  if (this.length <= (Buffer.poolSize >>> 1) && this.length > 0) {
    if (this.length > poolSize - poolOffset) createPool();
    this.parent = sliceOnto(allocPool, this, poolOffset, poolOffset + this.length);
    poolOffset += this.length; // Ensure aligned slices 
    if (poolOffset & 0x7) {
      poolOffset |= 0x7; poolOffset++;
    }
  } else {
    alloc(this, this.length);
  }
  if (util.isNumber(subject)) { return; }
  if (util.isString(subject)) {
    // In the case of base64 it's possible that the size of the buffer 
    // allocated was slightly too large. In this case we need to rewrite 
    // the length to the actual length written. 
    var len = this.write(subject, encoding);
    // Buffer was truncated after decode, realloc internal ExternalArray 
    if (len !== this.length) {
      var prevLen = this.length;
      this.length = len;
      // Only need to readjust the poolOffset if the allocation is a slice. 
      if (this.parent != undefined) poolOffset -= (prevLen - len);
    }
  } else if (util.isBuffer(subject)) {
    subject.copy(this, 0, 0, this.length);
  } else if (util.isNumber(subject.length) || util.isArray(subject)) {
    // Really crappy way to handle Uint8Arrays, but V8 doesn't give a simple 
    // way to access the data from the C++ API. 
    for (var i = 0; i < this.length; i++) this[i] = subject[i];
  }
}