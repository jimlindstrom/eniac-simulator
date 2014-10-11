'use strict';

angular.module('myApp')

.factory('InitiatingUnit', function() {
  function InitiatingUnit() {
    this.initPulse = { bus: null, busName: null, portNum: null };
    this.active = false;
    this.initPulseIsScheduled = false;
    this.name = 'Initiating Unit';
    this.panelId = this.name.replace(/[^A-Za-z0-9]/g, "_");
  }

  InitiatingUnit.prototype.clear = function () {
    this.active = false;
    this.initPulseIsScheduled = false;
  };

  InitiatingUnit.prototype.connectInitPulse = function (bus, portNum) {
    this.initPulse.bus     = bus;
    this.initPulse.busName = bus.name;
    this.initPulse.portNum = portNum;
  };

  InitiatingUnit.prototype.initPulsePortId = function() {
    return this.panelId + "-" + this.initPulse.busName + "-" + this.initPulse.portNum;
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
