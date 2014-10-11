'use strict';

angular.module('myApp')

.factory('MasterProgrammer', 
         ['TensComplement', 'MasterProgrammerDecade', 'MasterProgrammerStepper',
          function(TensComplement, MasterProgrammerDecade, MasterProgrammerStepper) {
  function MasterProgrammer(name) {
    this.name = name || 'Master Programmer 1';
    this.panelId = this.name.replace(/[^A-Za-z0-9]/g, "_");

    this.decade_associators = [
      { opts: ['A', 'B'], opt: 'A' },
      { opts: ['B', 'C'], opt: 'B' },
      { opts: ['C', 'D'], opt: 'C' },
      { opts: ['D', 'E'], opt: 'D' },
      { opts: ['F', 'G'], opt: 'F' },
      { opts: ['G', 'H'], opt: 'G' },
      { opts: ['H', 'J'], opt: 'H' },
      { opts: ['J', 'K'], opt: 'J' }
    ];
    this.decade_associators_by_decade_col = [
      this.decade_associators[0],
      null,
      this.decade_associators[1],
      null, null, null,
      this.decade_associators[2],
      null,
      this.decade_associators[3],
      null,

      this.decade_associators[4],
      null,
      this.decade_associators[5],
      null, null, null,
      this.decade_associators[6],
      null,
      this.decade_associators[7],
      null,
    ];

    this.decades = [                             // Array index      ENIAC index
      MasterProgrammerDecade.build({name: ''}),  //  0               20
      MasterProgrammerDecade.build({name: 'B'}), //  1               19
      MasterProgrammerDecade.build({name: ''}),  //  2               18
      MasterProgrammerDecade.build({name: 'C'}), //  3               17
      MasterProgrammerDecade.build({name: 'C'}), //  4               16
      MasterProgrammerDecade.build({name: 'C'}), //  5               15
      MasterProgrammerDecade.build({name: ''}),  //  6               14
      MasterProgrammerDecade.build({name: 'D'}), //  7               13
      MasterProgrammerDecade.build({name: ''}),  //  8               12
      MasterProgrammerDecade.build({name: 'E'}), //  9               11

      MasterProgrammerDecade.build({name: ''}),  // 10               10
      MasterProgrammerDecade.build({name: 'G'}), // 11                9
      MasterProgrammerDecade.build({name: ''}),  // 12                8
      MasterProgrammerDecade.build({name: 'H'}), // 13                7
      MasterProgrammerDecade.build({name: 'H'}), // 14                6
      MasterProgrammerDecade.build({name: 'H'}), // 15                5
      MasterProgrammerDecade.build({name: ''}),  // 16                4
      MasterProgrammerDecade.build({name: 'J'}), // 17                3
      MasterProgrammerDecade.build({name: ''}),  // 18                2
      MasterProgrammerDecade.build({name: 'K'}), // 19                1
    ];

    this.steppers = {
      'A': MasterProgrammerStepper.build({
        name: 'A',
        decades: [ ],
        opt_decade_lo: this.decades[0],
        opt_decade_lo_associator: this.decade_associators[0],
      }),

      'B': MasterProgrammerStepper.build({
        name: 'B',
        opt_decade_hi: this.decades[0],
        opt_decade_hi_associator: this.decade_associators[0],
        decades: [
          this.decades[1],
        ],
        opt_decade_lo: this.decades[2],
        opt_decade_lo_associator: this.decade_associators[1],
      }),

      'C': MasterProgrammerStepper.build({
        name: 'C',
        opt_decade_hi: this.decades[2],
        opt_decade_hi_associator: this.decade_associators[1],
        decades: [
          this.decades[3],
          this.decades[4],
          this.decades[5],
        ],
        opt_decade_lo: this.decades[6],
        opt_decade_lo_associator: this.decade_associators[2],
      }),

      'D': MasterProgrammerStepper.build({
        name: 'D',
        opt_decade_hi: this.decades[6],
        opt_decade_hi_associator: this.decade_associators[2],
        decades: [
          this.decades[6],
        ],
        opt_decade_lo: this.decades[8],
        opt_decade_lo_associator: this.decade_associators[3],
      }),

      'E': MasterProgrammerStepper.build({
        name: 'E',
        opt_decade_hi: this.decades[8],
        opt_decade_hi_associator: this.decade_associators[3],
        decades: [
          this.decades[9],
        ],
      }),

      'F': MasterProgrammerStepper.build({
        name: 'F',
        decades: [ ],
        opt_decade_lo: this.decades[10],
        opt_decade_lo_associator: this.decade_associators[4],
      }),

      'G': MasterProgrammerStepper.build({
        name: 'G',
        opt_decade_hi: this.decades[10],
        opt_decade_hi_associator: this.decade_associators[4],
        decades: [
          this.decades[11],
        ],
        opt_decade_lo: this.decades[12],
        opt_decade_lo_associator: this.decade_associators[5],
      }),

      'H': MasterProgrammerStepper.build({
        name: 'H',
        opt_decade_hi: this.decades[12],
        opt_decade_hi_associator: this.decade_associators[5],
        decades: [
          this.decades[13],
          this.decades[14],
          this.decades[15],
        ],
        opt_decade_lo: this.decades[16],
        opt_decade_lo_associator: this.decade_associators[6],
      }),

      'J': MasterProgrammerStepper.build({
        name: 'J',
        opt_decade_hi: this.decades[16],
        opt_decade_hi_associator: this.decade_associators[6],
        decades: [
          this.decades[16],
        ],
        opt_decade_lo: this.decades[18],
        opt_decade_lo_associator: this.decade_associators[7],
      }),

      'K': MasterProgrammerStepper.build({
        name: 'K',
        opt_decade_hi: this.decades[18],
        opt_decade_hi_associator: this.decade_associators[7],
        decades: [
          this.decades[19],
        ],
      }),
    };
    this.stepper_array = [
      this.steppers['A'],
      this.steppers['B'],
      this.steppers['C'],
      this.steppers['D'],
      this.steppers['E'],
      this.steppers['F'],
      this.steppers['G'],
      this.steppers['H'],
      this.steppers['J'],
      this.steppers['K'],
    ];
  }

  MasterProgrammer.prototype.clear = function () {
    angular.forEach(this.decades, function(decade, idx) {
      decade.clear();
    });
    angular.forEach(this.stepper_array, function(stepper, idx) {
      stepper.clear();
    });
  };

  MasterProgrammer.prototype.connectStepperProgramPulseInput = function (stepper_key, bus, portNum) {
    this.steppers[stepper_key].program_pulse_input.bus     = bus;
    this.steppers[stepper_key].program_pulse_input.busName = bus.name;
    this.steppers[stepper_key].program_pulse_input.portNum = portNum;
  };
  MasterProgrammer.prototype.stepperProgramPulseInputPortId = function(stepper_key) {
    var p = this.steppers[stepper_key].program_pulse_input;
    return this.panelId + "_1-" + p.busName + "-" + p.portNum;
  };

  MasterProgrammer.prototype.connectStepperDirectInput = function (stepper_key, bus, portNum) {
    this.steppers[stepper_key].direct_input.bus     = bus;
    this.steppers[stepper_key].direct_input.busName = bus.name;
    this.steppers[stepper_key].direct_input.portNum = portNum;
  };
  MasterProgrammer.prototype.stepperDirectInputPortId = function(stepper_key) {
    var p = this.steppers[stepper_key].direct_input;
    return this.panelId + "_1-" + p.busName + "-" + p.portNum;
  };

  MasterProgrammer.prototype.connectStepperClearDirectInput = function (stepper_key, bus, portNum) {
    this.steppers[stepper_key].clear_direct_input.bus     = bus;
    this.steppers[stepper_key].clear_direct_input.busName = bus.name;
    this.steppers[stepper_key].clear_direct_input.portNum = portNum;
  };
  MasterProgrammer.prototype.stepperClearDirectInputPortId = function(stepper_key) {
    var p = this.steppers[stepper_key].clear_direct_input;
    return this.panelId + "_1-" + p.busName + "-" + p.portNum;
  };

  MasterProgrammer.prototype.connectStepperProgramPulseOutput = function (stepper_key, out_idx, bus, portNum) {
    this.steppers[stepper_key].program_pulse_outputs[out_idx].bus     = bus;
    this.steppers[stepper_key].program_pulse_outputs[out_idx].busName = bus.name;
    this.steppers[stepper_key].program_pulse_outputs[out_idx].portNum = portNum;
  };
  MasterProgrammer.prototype.stepperProgramPulseOutputPortId = function(stepper_key, out_idx) {
    var p = this.steppers[stepper_key].program_pulse_outputs[out_idx];
    return this.panelId + "_1-" + p.busName + "-" + p.portNum;
  };

  MasterProgrammer.prototype.connectDecadeDirectInput = function (decade_idx, bus, portNum) {
    this.decades[decade_idx].direct_input.bus     = bus;
    this.decades[decade_idx].direct_input.busName = bus.name;
    this.decades[decade_idx].direct_input.portNum = portNum;
  };
  MasterProgrammer.prototype.decadeDirectInputPortId = function(decade_idx) {
    var p = this.decades[decade_idx].direct_input;
    return this.panelId + "_1-" + p.busName + "-" + p.portNum;
  };

  MasterProgrammer.prototype.sync = function (syncLines) {
    var that = this;
    angular.forEach(this.stepper_array, function(stepper, idx) {
      stepper.sync(syncLines);
    });
  }

  MasterProgrammer.build = function (data) {
    return new MasterProgrammer(data.name);
  };

  return MasterProgrammer;
}]);
