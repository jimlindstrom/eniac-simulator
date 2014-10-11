'use strict';

angular.module('myApp')

.factory('Accumulator', 
         ['DecadeRingCounter', 'TensComplement', 'AccNonrepeatingControl', 'AccRepeatingControl',
          function(DecadeRingCounter, TensComplement, AccNonrepeatingControl, AccRepeatingControl) {
  function Accumulator(name) {
    this.operationOpts = [ 'α', 'β', 'γ', 'δ', 'ε', 'O', 'A', 'AS', 'S' ];
    this.sigFigureOpts = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '10' ];
    this.repeatOpts = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

    this.name = name;
    this.panelId = this.name.replace(/[^A-Za-z0-9]/g, "_");
    this.digitalInputs = [ 
      { name: 'α', bus: null, busName: null }, 
      { name: 'β', bus: null, busName: null }, 
      { name: 'γ', bus: null, busName: null }, 
      { name: 'δ', bus: null, busName: null }, 
      { name: 'ε', bus: null, busName: null } 
    ];
    this.digitalOutputs = [ 
      { name: 'A', bus: null, busName: null }, 
      { name: 'S', bus: null, busName: null } 
    ];
    this.nonRepeatProgControls = [ 
      AccNonrepeatingControl.build({ idx: 1, operation: 'O', active: false }), 
      AccNonrepeatingControl.build({ idx: 2, operation: 'O', active: false }), 
      AccNonrepeatingControl.build({ idx: 3, operation: 'O', active: false }), 
      AccNonrepeatingControl.build({ idx: 4, operation: 'O', active: false }),
    ];
    this.repeatProgControls = [ 
      AccRepeatingControl.build({ idx: 5, operation: 'O', repeat: 1, remain: 1, active: false }), 
      AccRepeatingControl.build({ idx: 6, operation: 'O', repeat: 1, remain: 1, active: false }), 
      AccRepeatingControl.build({ idx: 7, operation: 'O', repeat: 1, remain: 1, active: false }), 
      AccRepeatingControl.build({ idx: 8, operation: 'O', repeat: 1, remain: 1, active: false }), 
      AccRepeatingControl.build({ idx: 9, operation: 'O', repeat: 1, remain: 1, active: false }), 
      AccRepeatingControl.build({ idx:10, operation: 'O', repeat: 1, remain: 1, active: false }), 
      AccRepeatingControl.build({ idx:11, operation: 'O', repeat: 1, remain: 1, active: false }), 
      AccRepeatingControl.build({ idx:12, operation: 'O', repeat: 1, remain: 1, active: false })
    ];
    this.sigFiguresCtrl = { sigFigs: 10 }; // FIXME: not implemented...
    this.counters = [ ];
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: null})); // plus (0) vs. minus (9) indicator
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[0]})); // digit 10
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[1]})); // digit  9
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[2]})); // digit  8
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[3]})); // digit  7
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[4]})); // digit  6
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[5]})); // digit  5
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[6]})); // digit  4 (...)
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[7]})); // digit  3 (100s)
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[8]})); // digit  2 (10s)
    this.counters.push(DecadeRingCounter.build({val: 0, nextCtr: this.counters[9]})); // digit  1 (1s)
  }

  Accumulator.prototype.clear = function () {
    angular.forEach(this.nonRepeatProgControls, function (ctrl, idx) {
      ctrl.clear();
    });
    angular.forEach(this.repeatProgControls, function (ctrl, idx) {
      ctrl.clear();
    });
    angular.forEach(this.counters, function (counter, idx) {
      counter.clear();
    });
  };

  Accumulator.prototype.connectDataIn = function (inName, bus) {
    var that=this;
    angular.forEach(this.digitalInputs, function (digitalIn, idx) {
      if (digitalIn.name == inName) {
        digitalIn.bus = bus;
        digitalIn.busName = bus.name;
        digitalIn.portId  = that.panelId + "-" + bus.name;
      }
    });
  };

  Accumulator.prototype.connectDataOut = function (outName, bus) {
    var that=this;
    angular.forEach(this.digitalOutputs, function (digitalOut, idx) {
      if (digitalOut.name == outName) {
        digitalOut.bus = bus;
        digitalOut.busName = bus.name;
        digitalOut.portId  = that.panelId + "-" + bus.name;
      }
    });
  };

  // FIXME: bug. This doesn't let us use the nonrepeating ones...
  Accumulator.prototype.connectCtrlIn = function (idx, bus, portNum) {
    if (idx < 5) {
      this.repeatProgControls[idx].inPort.bus     = bus;
      this.repeatProgControls[idx].inPort.busName = bus.name;
      this.repeatProgControls[idx].inPort.portNum = portNum;
      this.repeatProgControls[idx].inPort.portId  = this.panelId + "-" + bus.name + "-" + portNum;
    }
    else { 
      this.repeatProgControls[idx].inPort.bus     = bus;
      this.repeatProgControls[idx].inPort.busName = bus.name;
      this.repeatProgControls[idx].inPort.portNum = portNum;
      this.repeatProgControls[idx].inPort.portId  = this.panelId + "-" + bus.name + "-" + portNum;
    }
  };

  // FIXME: bug. This doesn't let us use the nonrepeating ones...
  Accumulator.prototype.connectCtrlOut = function (idx, bus, portNum) {
    if (idx < 5) {
      this.repeatProgControls[idx].outPort.bus     = bus;
      this.repeatProgControls[idx].outPort.busName = bus.name;
      this.repeatProgControls[idx].outPort.portNum = portNum;
      this.repeatProgControls[idx].outPort.portId  = this.panelId + "-" + bus.name + "-" + portNum;
    }
    else { 
      this.repeatProgControls[idx].outPort.bus     = bus;
      this.repeatProgControls[idx].outPort.busName = bus.name;
      this.repeatProgControls[idx].outPort.portNum = portNum;
      this.repeatProgControls[idx].outPort.portId  = this.panelId + "-" + bus.name + "-" + portNum;
    }
  };

  Accumulator.prototype.curValStr = function () {
    var idx = 0, arr = [ ];
    for (idx = 0; idx <= 10; idx++) {
      arr.push(this.counters[idx].val);
    }
    return TensComplement.digitArrayToStr(arr);
  };

  Accumulator.prototype.setVal = function (val) {
    var idx = 0, arr = TensComplement.valToDigitArray(val);
    for(idx = 0; idx <= 10; idx++ ) {
      this.counters[idx].val = arr[idx];
    }
  };

  Accumulator.prototype.sync = function (syncLines) {
    var that = this;
    angular.forEach(this.nonRepeatProgControls, function (ctrl, idx) {
      ctrl.sync(syncLines, that.counters, that.digitalInputs, that.digitalOutputs);
    });
    angular.forEach(this.repeatProgControls, function (ctrl, idx) {
      ctrl.sync(syncLines, that.counters, that.digitalInputs, that.digitalOutputs);
    });
  }

  Accumulator.build = function (data) {
    return new Accumulator(data.name);
  };

  return Accumulator;
}]);
