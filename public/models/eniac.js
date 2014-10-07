'use strict';

angular.module('myApp')

.factory('Eniac', 
            ['InitiatingUnit', 'CyclingUnit', 'MasterProgrammer', 'Accumulator', 'ConstantXmitter', 'Bus', '$interval',
             function(InitiatingUnit, CyclingUnit, MasterProgrammer, Accumulator, ConstantXmitter, Bus, $interval) {
  function Eniac(name) {
    this.dataBuses = [
      Bus.build({name: "d0", numBits: 11}),
      Bus.build({name: "d1", numBits: 11}),
      Bus.build({name: "d2", numBits: 11}),
      Bus.build({name: "d3", numBits: 11}),
      Bus.build({name: "d4", numBits: 11}),
      Bus.build({name: "d5", numBits: 11}),
      Bus.build({name: "d6", numBits: 11}),
      Bus.build({name: "d7", numBits: 11}),
    ];
  
    this.controlBuses = [
      Bus.build({name: "c0", numBits:  1}),
      Bus.build({name: "c1", numBits:  1}),
      Bus.build({name: "c2", numBits:  1}),
      Bus.build({name: "c3", numBits:  1}),
      Bus.build({name: "c4", numBits:  1}),
      Bus.build({name: "c5", numBits:  1}),
      Bus.build({name: "c6", numBits:  1}),
      Bus.build({name: "c7", numBits:  1}),
    ];
   
    this.constant_xmitters = [
      ConstantXmitter.build({name: "ConstantXmitter 1"})
    ];

    this.accumulators = [
      Accumulator.build({name: "Accumulator 1"}),
      Accumulator.build({name: "Accumulator 2"})
    ];
  
    this.initiatingUnit = InitiatingUnit.build({});
    this.cyclingUnit = CyclingUnit.build({});
    this.masterProgrammer = MasterProgrammer.build({});

    var that = this;
    angular.forEach(this.accumulators, function(acc, idx) {
      that.cyclingUnit.addSubscriber(acc);
    });
    angular.forEach(this.constant_xmitters, function(cx, idx) {
      that.cyclingUnit.addSubscriber(cx);
    });
    that.cyclingUnit.addSubscriber(this.masterProgrammer);
    that.cyclingUnit.addSubscriber(this.initiatingUnit);
  }

  Eniac.prototype.step = function () {
    this.cyclingUnit.increment();
    this.cyclingUnit.publish();
  };

  Eniac.prototype.start= function () {
    this.stop();
    var that = this;
    this.playPromise = $interval(function () {
      that.initiatingUnit.active = true;
      that.cyclingUnit.increment();
      that.cyclingUnit.publish();
    }, 1);
  };

  Eniac.prototype.stop = function () {
    this.initiatingUnit.active = false;
    $interval.cancel(this.playPromise);
  };

  Eniac.prototype.clear = function () {
    this.stop();
    this.initiatingUnit.clear();
    this.cyclingUnit.clear();
    this.masterProgrammer.clear();
    angular.forEach(this.accumulators, function(acc, idx) {
      acc.clear();
    });
    angular.forEach(this.constant_xmitters, function(cx, idx) {
      cx.clear();
    });
    angular.forEach(this.controlBuses, function(bus, idx) {
      bus.clear();
    });
    angular.forEach(this.dataBuses, function(bus, idx) {
      bus.clear();
    });
  };

  Eniac.prototype.init_pulse = function () {
    this.initiatingUnit.scheduleInitPulse();
  };

  Eniac.build = function (data) {
    return new Eniac();
  };

  return Eniac;
}]);
