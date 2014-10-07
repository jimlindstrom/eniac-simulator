'use strict';

angular.module('myApp')

.factory('TensComplement', function() {
  function TensComplement() { }

  // returns array of P/M followed by highest-order digit down to ones digit
  TensComplement.valToDigitArray = function (val)  {
    var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var idx = 0;

    if (val < 0) {
      arr[0] = 9;
      val = Math.abs(val);
      val = 9999999999 - val + 1;
    }

    for (idx=10; idx>=1; idx--) {
      arr[idx] = (val % 10);
      val = Math.floor(val / 10);
    }

    return arr;
  };

  // returns the decimal version of the digit array
  TensComplement.digitArrayToNum = function (arr)  {
    var idx, num = 0;

    for (idx = 1; idx <= 10; idx++ ) {
      num += arr[idx] * Math.pow(10, 10-idx);
    }

    if (arr[0] == 0) {
    }
    else {
      num = 9999999999 - num + 1;
      num = -1 * num;
    }
    return num;
  };

  // returns the decimal version of the digit array
  TensComplement.digitArrayToStr = function (arr)  {
    return String(this.digitArrayToNum(arr));
  };

  return TensComplement;
});
