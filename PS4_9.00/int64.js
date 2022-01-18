function int64(low, hi) {
  this.low = low >>> 0;
  this.hi = hi >>> 0;

  this.add32 = function (val) {
    var new_lo = ((this.low >>> 0) + val) & 0xFFFFFFFF >>> 0,
      new_hi = this.hi >>> 0;

    if (new_lo < this.low) new_hi++;
    return new int64(new_lo, new_hi);
  };

  this.sub32 = function (val) {
    var new_lo = ((this.low >>> 0) - val) & 0xFFFFFFFF >>> 0,
      new_hi = this.hi >>> 0;

    if (new_lo > this.low & 0xFFFFFFFF) new_hi--;
    return new int64(new_lo, new_hi);
  };

  this.sub32inplace = function (val) {
    var new_lo = ((this.low >>> 0) - val) & 0xFFFFFFFF >>> 0,
      new_hi = this.hi >>> 0;

    if (new_lo > this.low & 0xFFFFFFFF) new_hi--;
    this.hi = new_hi;
    this.low = new_lo;
  };
}
