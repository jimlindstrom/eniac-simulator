'use strict';

angular.module('myApp')

.factory('Bus', function() {
  // 11 bits for a data bus (p/m + 10 digits)
  function Bus(name, numBits) {
    this.name = name;
    this.numBits = numBits;
    this.buf = { };
  }

  Bus.prototype.clear = function () {
    this.buf = { };
  };

  Bus.prototype.write = function (syncTime, bitArr) {
    if (this.buf[syncTime] == null) {
      this.buf[syncTime] = bitArr;
    }
    else {
      var i;
      for (i = 0; i < this.numBits; i++) {
        this.buf[syncTime][i] = this.buf[syncTime][i] || bitArr[i];
      }
    }
  };

  Bus.prototype.read = function (syncTime) {
    if (this.buf[syncTime] == null) {
      var i=0, arr = [ ];
      for (i = 0; i < this.numBits; i++) {
        arr.push(0);
      }
      return arr;
    }
    return this.buf[syncTime];
  };

  Bus.build = function (data) {
    return new Bus(data.name, data.numBits);
  };

  return Bus;
});
