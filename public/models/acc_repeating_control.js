'use strict';

angular.module('myApp')

.factory('AccRepeatingControl', [function() {
  function AccRepeatingControl(idx, operation, repeat, active) {
    this.idx = idx;
    this.operation = operation;
    this.repeat = repeat;
    this.remain = this.repeat;
    this.active = active;
    this.inPort  = { bus: null, busName: null };
    this.outPort = { bus: null, busName: null };
  }

  AccRepeatingControl.prototype.clear = function () {
    this.active = false;
    this.remain = this.repeat;
  };

  AccRepeatingControl.prototype.sync = function (syncLines, counters, digitalInputs, digitalOutputs) {
    if (this.active) {
      if (this.isReceiveOp()) {
        var bus = this.getInputBus(digitalInputs);
        this.receive(syncLines, counters, bus);
      }
      if (this.isTransmitOp()) {
        this.transmit(syncLines, counters, digitalOutputs);
      }
      this.decrement(syncLines);
    }

    if (this.inPort.bus) {
      var bits = this.inPort.bus.read(syncLines["syncTime"]-1);
      if (bits[0] == 1) {
        this.active = true;
        this.remain = this.repeat;
      }
    }
  }

  AccRepeatingControl.prototype.decrement = function (syncLines) {
    // FIXME: bug: not sure how this interacts with the clear/correct switch?
    if(syncLines["cpp"] == 1) { // time to deactivate?
      if (this.remain > 0) {
        this.remain = this.remain - 1;
      }
      if (this.remain < 1) {
        this.active = false;

        if (this.outPort.bus != null) {
          this.outPort.bus.write(syncLines["syncTime"], [1]);
        }
      }
    }
  }

  AccRepeatingControl.prototype.isReceiveOp = function () {
    return (this.operation == 'α') || (this.operation == 'β') || (this.operation == 'γ') || (this.operation == 'δ') || (this.operation == 'ε');
  }

  AccRepeatingControl.prototype.isTransmitOp = function () {
    return ((this.operation == 'A') || (this.operation =='AS') || (this.operation == 'S'));
  }

  AccRepeatingControl.prototype.getInputBus = function (digitalInputs) {
    var bus = null, that=this;
    angular.forEach(digitalInputs, function (din, idx) {
      if ((din.name == that.operation) && (din.bus != null)) {
        bus = din.bus;
      }
    });
    if (bus == null) {
      console.log("Warning: couldn't find digitalInput for operation " + this.operation);
    }
    return bus;
  }

  AccRepeatingControl.prototype.receive = function (syncLines, counters, bus) {
    var digitPulse, doTrans=0;
    var bitsIn = bus.read(syncLines["syncTime"]-1); // read the output from t-1
    //console.log("a  10p: "+syncLines["10p"]+" 9p: "+syncLines["9p"]+ ", clock: ?,  read: " + JSON.stringify(bitsIn));

    angular.forEach(counters, function (counter, idx) {
      digitPulse = bitsIn[idx];
      counter.step(syncLines, digitPulse, doTrans);
    });
  }

  AccRepeatingControl.prototype.transmit = function (syncLines, counters, digitalOutputs) {
    var digitPulse=0, doTrans=1, out, aOut = [ ], sOut = [ ];

    angular.forEach(counters, function (ctr, idx) {
      out = ctr.step(syncLines, digitPulse, doTrans);
      aOut.push(out["a"]);
      sOut.push(out["s"]);
    });
    if ((this.operation == 'A') || (this.operation =='AS')) {
      angular.forEach(digitalOutputs, function (dout, idx) {
        if (dout.name == 'A') {
          dout.bus.write(syncLines["syncTime"], aOut);
        }
      });
    }
    if ((this.operation == 'S') || (this.operation =='AS')) {
      angular.forEach(digitalOutputs, function (dout, idx) {
        if (dout.name == 'S') {
          dout.bus.write(syncLines["syncTime"], sOut);
        }
      });
    }

  }

  AccRepeatingControl.build = function (data) {
    return new AccRepeatingControl(data.idx, data.operation, data.repeat, data.active);
  };

  return AccRepeatingControl;
}]);
