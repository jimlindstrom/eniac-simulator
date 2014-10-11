'use strict';

angular.module('myApp')

.factory('CyclingUnit', function() {
  function CyclingUnit() {
    this.cycle = 0;
    this.subCycle = 0;
    this.subscribers = [ ];
    this.name = 'Cycling Unit';
    this.panelId = this.name.replace(/[^A-Za-z0-9]/g, "_");
    this.line_names = ["cpp", "10p", "9p", "1p", "2p", "2'p", "4p", "1'p", "ccg", "rp"];
    this.lines = [
      // 0
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 1
      { "cpp":0, "10p":0, "9p":1, "1p":1, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 2
      { "cpp":0, "10p":0, "9p":1, "1p":0, "2p":1, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 3
      { "cpp":0, "10p":0, "9p":1, "1p":0, "2p":1, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 4
      { "cpp":0, "10p":0, "9p":1, "1p":0, "2p":0, "2'p":1, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 5
      { "cpp":0, "10p":0, "9p":1, "1p":0, "2p":0, "2'p":1, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 6
      { "cpp":0, "10p":0, "9p":1, "1p":0, "2p":0, "2'p":0, "4p":1, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 7
      { "cpp":0, "10p":0, "9p":1, "1p":0, "2p":0, "2'p":0, "4p":1, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 8
      { "cpp":0, "10p":0, "9p":1, "1p":0, "2p":0, "2'p":0, "4p":1, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 9
      { "cpp":0, "10p":0, "9p":1, "1p":0, "2p":0, "2'p":0, "4p":1, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":1, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 10
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":1, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 11
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      // 12
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      // 13
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":1 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      // 14
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      // 15
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      // 16
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      // 17
      { "cpp":1, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":1, "rp":0 },
      // 18
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 19
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":1 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      { "cpp":0, "10p":0, "9p":0, "1p":0, "2p":0, "2'p":0, "4p":0, "1'p":0, "ccg":0, "rp":0 },
      // 20 (0)
    ];
    this.curLine = this.lines[this.subCycle];
    this.curLine["syncTime"] = (this.cycle * this.lines.length) + this.subCycle;
    angular.forEach(this.lines, function(curLine, key) {
      curLine["additionDuration"] = 20 * 3;
    });
  }

  CyclingUnit.prototype.clear = function () {
    this.reset();
  };

  CyclingUnit.prototype.reset = function () {
    this.cycle = 0;
    this.subCycle = 0;
    this.curLine = this.lines[this.subCycle];
    this.curLine["syncTime"] = (this.cycle * this.lines.length) + this.subCycle;
  };

  CyclingUnit.prototype.increment = function () {
    this.subCycle = this.subCycle + 1;
    if (this.subCycle >= this.lines.length) {
      this.subCycle = 0;
      this.cycle = this.cycle + 1;
    }
    this.curLine = this.lines[this.subCycle];
    this.curLine["syncTime"] = (this.cycle * this.lines.length) + this.subCycle;
  };

  CyclingUnit.prototype.addSubscriber = function (sub) {
    this.subscribers.push(sub);
  };

  CyclingUnit.prototype.publish = function () {
    var that = this;
    //console.log(JSON.stringify(that.curLine));
    angular.forEach(this.subscribers, function(sub, idx) {
      sub.sync(that.curLine);
    });
  };

  CyclingUnit.build = function (data) {
    return new CyclingUnit();
  };

  return CyclingUnit;
});
