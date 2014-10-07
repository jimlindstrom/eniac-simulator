'use strict';

angular.module('myApp')

.factory('DecadeRingCounter', function() {
  function DecadeRingCounter(val, nextCtr) {
    this.clockIdx = 9;
    this.val = val;
    this.nextCtr = nextCtr;
    this.transmitting = false;
  }

  DecadeRingCounter.prototype.clear = function () {
    this.clockIdx = 9;
    this.val = 0;
    this.transmitting = false;
  };

  DecadeRingCounter.prototype.step = function (syncPulses, inBit, doTrans) {
    var outputs = { "a": 0, "s": 0 };

    if (syncPulses["10p"]==1) {
      this.clockIdx = (this.clockIdx + 1) % 10;
      this.transmitting = true;
    }
    if (syncPulses["1'p"]==1) {
      this.transmitting = false;
    }

    if (syncPulses["9p"]==1) {
      if (doTrans == 0) { // rx mode
        if (inBit == 1) {
          this.val += 1;
          if (this.val > 9) {
            this.val = 0;
            if (this.nextCtr != null) {
              this.nextCtr.carry();
            }
          }
        }
      }
      else { // tx mode
        // FIXME: do nothing
      }
    }

    if (this.transmitting) {
      if (this.val > this.clockIdx) { outputs["a"] = 1; outputs["s"] = 0; }
      else                          { outputs["a"] = 0; outputs["s"] = 1; }
    }

    return outputs;
  };

  DecadeRingCounter.prototype.carry = function () {
    this.val += 1;
    if (this.val > 9) {
      this.val = 0;
      if (this.nextCtr != null) {
        this.nextCtr.carry();
      }
    }
  };

  DecadeRingCounter.build = function (data) {
    return new DecadeRingCounter(data.val, data.nextCtr);
  };

  return DecadeRingCounter;
});
