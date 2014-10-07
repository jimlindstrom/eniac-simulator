'use strict';

angular.module('myApp')

.factory('InitiatingUnit', function() {
  function InitiatingUnit() {
    this.initPulse = { bus: null, busName: null };
    this.active = false;
    this.initPulseIsScheduled = false;
  }

  InitiatingUnit.prototype.clear = function () {
    this.active = false;
    this.initPulseIsScheduled = false;
  };

  InitiatingUnit.prototype.connectInitPulse = function (bus) {
    this.initPulse.bus     = bus;
    this.initPulse.busName = bus.name;
  };

  InitiatingUnit.prototype.scheduleInitPulse = function () {
    this.initPulseIsScheduled = true;
  };

  InitiatingUnit.prototype.sync = function (syncLines) {
    if (this.initPulseIsScheduled && syncLines["cpp"]==1) {
      this.initPulseIsScheduled = false;
      if (this.initPulse.bus) {
        this.initPulse.bus.write(syncLines["syncTime"], [1]);
      }
    }
  };

  InitiatingUnit.build = function (data) {
    return new InitiatingUnit();
  };

  return InitiatingUnit;
});
