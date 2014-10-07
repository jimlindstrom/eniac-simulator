'use strict';

angular.module('myApp')

.factory('AccNonrepeatingControl', [function() {
  function AccNonrepeatingControl(idx, operation, active) {
    this.idx = idx;
    this.operation = operation;
    this.active = active;
    this.inPort  = { bus: null, busName: null };
  }

  AccNonrepeatingControl.prototype.clear = function () {
    this.active = false;
  };

  AccNonrepeatingControl.prototype.sync = function (syncLines, counters, digitalInputs, digitalOutputs) {
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
      }
    }
  }

  AccNonrepeatingControl.prototype.decrement = function (syncLines) {
    if(syncLines["cpp"] == 1) { // time to deactivate?
      this.active = false;
    }
  }

  AccNonrepeatingControl.prototype.isReceiveOp = function () {
    return (this.operation == 'α') || (this.operation == 'β') || (this.operation == 'γ') || (this.operation == 'δ') || (this.operation == 'ε');
  }

  AccNonrepeatingControl.prototype.isTransmitOp = function () {
    return ((this.operation == 'A') || (this.operation =='AS') || (this.operation == 'S'));
  }

  AccNonrepeatingControl.prototype.getInputBus = function (digitalInputs) {
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

  AccNonrepeatingControl.prototype.receive = function (syncLines, counters, bus) {
    var digitPulse, doTrans=0;
    var bitsIn = bus.read(syncLines["syncTime"]-1); // read the output from t-1

    angular.forEach(counters, function (counter, idx) {
      digitPulse = bitsIn[idx];
      counter.step(syncLines, digitPulse, doTrans);
    });
  }

  AccNonrepeatingControl.prototype.transmit = function (syncLines, counters, digitalOutputs) {
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
          dout.bus.write(syncLine["syncTime"], sOut);
        }
      });
    }

  }

  AccNonrepeatingControl.build = function (data) {
    return new AccNonrepeatingControl(data.idx, data.operation, data.active);
  };

  return AccNonrepeatingControl;
}]);
