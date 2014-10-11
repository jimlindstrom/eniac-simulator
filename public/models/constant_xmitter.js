'use strict';

angular.module('myApp')

.factory('ConstantXmitterCtrlPair', [function() {
  function ConstantXmitterCtrlPair(top_opt, bot_opts, bot_opt) {
    this.active = false;
    this.transmitting = false;
    this.clockIdx = 9;
    this.top_opts = ["L", "LR", "R"];
    this.top_opt = top_opt || "L";
    this.bot_opts = bot_opts || ["A", "B"];
    this.bot_opt = bot_opt || "A";
    this.inPort  = { bus:null, busName:null, portNum:null, portId:null };
    this.outPort = { bus:null, busName:null, portNum:null, portId:null };
  }

  ConstantXmitterCtrlPair.prototype.clear = function () {
    this.active = false;
    this.transmitting = false;
    this.clockIdx = 9;
  };

  ConstantXmitterCtrlPair.prototype.sync = function (syncLines, digits, outPort) {
    if (this.active) {
      this.transmit(syncLines, digits, outPort);
    }
    if (this.inPort.bus) {
      var bits = this.inPort.bus.read(syncLines["syncTime"]-1);
      if (bits[0] == 1) {
        this.active = true;
      }
    }
  }

  ConstantXmitterCtrlPair.prototype.transmit = function (syncLines, digits, outPort) {
    var bits = [], i;

    if (syncLines["10p"]==1) {
      this.clockIdx = (this.clockIdx + 1) % 10;
      this.transmitting = true;
    }
    if (syncLines["1'p"]==1) {
      this.transmitting = false;
    }
    if(syncLines["cpp"] == 1) { // time to deactivate?
      this.active = false;
      if (this.outPort.bus != null) {
        this.outPort.bus.write(syncLines["syncTime"], [1]);
      }
    }

    if (this.transmitting) {
      for (i = 0; i <= 10; i++) {
        if (digits[i] > this.clockIdx) { 
          bits.push(1);
        }
        else {
          bits.push(0);
        }
      }
      //if (syncLines["10p"]==1) { console.log("cx 10p: "+syncLines["10p"]+" 9p: "+syncLines["9p"]+ ", clock: " + this.clockIdx + ", write: " + JSON.stringify(bits)); }
    }

    outPort.bus.write(syncLines["syncTime"], bits);
  }

  ConstantXmitterCtrlPair.build = function (data) {
    return new ConstantXmitterCtrlPair(data.top_opt, data.bot_opts, data.bot_opt);
  };

  return ConstantXmitterCtrlPair;
}])

.factory('ConstantXmitter', 
         ['ConstantXmitterCtrlPair', 'TensComplement',
          function(ConstantXmitterCtrlPair, TensComplement) {
  function ConstantXmitter(name) {
    this.name = name;
    this.panelId = this.name.replace(/[^A-Za-z0-9]/g, "_");
    this.xmitter_ctrl_pair_arrays = [
      [
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["A", "B"], bot_opt: "A"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["A", "B"], bot_opt: "A"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["C", "D"], bot_opt: "C"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["C", "D"], bot_opt: "C"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["E", "F"], bot_opt: "E"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["E", "F"], bot_opt: "E"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["G", "H"], bot_opt: "G"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["G", "H"], bot_opt: "G"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["J", "K"], bot_opt: "J"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["J", "K"], bot_opt: "J"})
      ],
      [
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["A", "B"], bot_opt: "A"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["A", "B"], bot_opt: "A"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["C", "D"], bot_opt: "C"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["C", "D"], bot_opt: "C"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["E", "F"], bot_opt: "E"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["E", "F"], bot_opt: "E"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["G", "H"], bot_opt: "G"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["G", "H"], bot_opt: "G"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["J", "K"], bot_opt: "J"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["J", "K"], bot_opt: "J"})
      ],
      [
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["A", "B"], bot_opt: "A"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["A", "B"], bot_opt: "A"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["C", "D"], bot_opt: "C"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["C", "D"], bot_opt: "C"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["E", "F"], bot_opt: "E"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["E", "F"], bot_opt: "E"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["G", "H"], bot_opt: "G"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["G", "H"], bot_opt: "G"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["J", "K"], bot_opt: "J"}),
        ConstantXmitterCtrlPair.build({top_opt: "L", bot_opts: ["J", "K"], bot_opt: "J"})
      ],
    ];
    this.pm_arrs = [
      [
        { label: "JL", opts: ["P", "M"], opt: "P" },
        { label: "JR", opts: ["P", "M"], opt: "P" },
      ],
      [
        { label: "KL", opts: ["P", "M"], opt: "P" },
        { label: "KR", opts: ["P", "M"], opt: "P" },
      ],
    ];
    this.number_dial_arrs = [
      [
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
      ],
      [
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
        { opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
      ],
    ];

    this.outPort = { bus: null, busName: null };
  }

  ConstantXmitter.prototype.clear = function () {
    var that = this;
    angular.forEach(this.xmitter_ctrl_pair_arrays, function(ctrl_pair_array, idx1) {
      angular.forEach(ctrl_pair_array, function (ctrl_pair, idxs2) {
        ctrl_pair.clear();
      });
    });
  };

  ConstantXmitter.prototype.connectCtrlIn = function (row, col, bus, portNum) {
    this.xmitter_ctrl_pair_arrays[row][col].inPort.bus     = bus;
    this.xmitter_ctrl_pair_arrays[row][col].inPort.busName = bus.name;
    this.xmitter_ctrl_pair_arrays[row][col].inPort.portNum = portNum;
    this.xmitter_ctrl_pair_arrays[row][col].inPort.portId  = this.panelId + "-" + bus.name + "-" + portNum;
  };

  ConstantXmitter.prototype.connectCtrlOut = function (row, col, bus, portNum) {
    this.xmitter_ctrl_pair_arrays[row][col].outPort.bus     = bus;
    this.xmitter_ctrl_pair_arrays[row][col].outPort.busName = bus.name;
    this.xmitter_ctrl_pair_arrays[row][col].outPort.portNum = portNum;
    this.xmitter_ctrl_pair_arrays[row][col].outPort.portId  = this.panelId + "-" + bus.name + "-" + portNum;
  };

  ConstantXmitter.prototype.connectDataOut = function (bus) {
    this.outPort.bus     = bus;
    this.outPort.busName = bus.name;
  };

  ConstantXmitter.prototype.getDigits = function (rowIdx, part) {
    var digits = [], i;

    if (part == 'L') {
      digits.push((this.pm_arrs[rowIdx][0].opt == "P") ? 0 : 9);
      for (i = 0; i < 5; i++) { digits.push((this.pm_arrs[rowIdx][1].opt == "P") ? 0 : 9); }
      for (i = 0; i < 5; i++) { digits.push(this.number_dial_arrs[rowIdx][i].opt); }
    }
    else if (part == 'LR') {
      digits.push((this.pm_arrs[rowIdx][0].opt == "P") ? 0 : 9);
      for (i = 0; i < 10; i++) { digits.push(this.number_dial_arrs[rowIdx][i].opt); }
    }
    else if (part == 'R') {
      digits.push((this.pm_arrs[rowIdx][1].opt == "P") ? 0 : 9);
      for (i = 0; i < 5; i++)  { digits.push((this.pm_arrs[rowIdx][1].opt == "P") ? 0 : 9); }
      for (i = 5; i < 10; i++) { digits.push(this.number_dial_arrs[rowIdx][i].opt); }
    }

    return digits;
  };

  ConstantXmitter.prototype.getValue = function (rowIdx, part) {
    return TensComplement.digitArrayToNum(this.getDigits(rowIdx, part));
  };

  ConstantXmitter.prototype.sync = function (syncLines) {
    var that = this;
    angular.forEach(this.xmitter_ctrl_pair_arrays, function(ctrl_pair_array, idx1) {
      angular.forEach(ctrl_pair_array, function (ctrl_pair, idxs2) {
        var rowIdx = 0;
        var rowOpt = ctrl_pair.bot_opt;
        if ((rowOpt=='B') || (rowOpt=='D') || (rowOpt=='F') || (rowOpt=='H') || (rowOpt=='K')) {
          rowIdx = 1;
        }
        var part = ctrl_pair.top_opt;
        ctrl_pair.sync(syncLines, that.getDigits(rowIdx, part), that.outPort);
      });
    });
  }

  ConstantXmitter.build = function (data) {
    return new ConstantXmitter(data.name);
  };

  return ConstantXmitter;
}]);
