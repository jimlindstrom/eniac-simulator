'use strict';

angular.module('myApp')

.factory('MasterProgrammerDecade', 
         [
          function() {
  function MasterProgrammerDecade(name) {
    this.stages = [
      { name: name, opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
      { name: name, opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
      { name: name, opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
      { name: name, opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
      { name: name, opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
      { name: name, opts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], opt: 0 },
    ];
    this.value = 0;
    this.direct_input = { bus: null, busName: null };
  }

  MasterProgrammerDecade.prototype.clear = function () {
    this.value = 0;
  };

  MasterProgrammerDecade.prototype.send_pulse = function () {
    this.value += 1;
    if (this.value >= 10) {
      this.value = 0;
      return true; // carry
    }
    return false; // no carry
  };

  MasterProgrammerDecade.build = function (data) {
    return new MasterProgrammerDecade(data.name);
  };

  return MasterProgrammerDecade;
}])

.factory('MasterProgrammerStepper', 
         [
          function() {
  function MasterProgrammerStepper(data) {
    this.name                     = data.name;
    this.opt_decade_hi            = data.opt_decade_hi;
    this.opt_decade_hi_associator = data.opt_decade_hi_associator;
    this.decades                  = data.decades || [ ];
    this.opt_decade_lo            = data.opt_decade_lo;
    this.opt_decade_lo_associator = data.opt_decade_lo_associator;
    this.clear_switch = { opts: [1, 2, 3, 4, 5, 6], opt: 1 };
    this.program_pulse_input = { bus: null, busName: null };
    this.direct_input = { bus: null, busName: null };
    this.clear_direct_input = { bus: null, busName: null };
    this.program_pulse_outputs = [
      { bus: null, busName: null },
      { bus: null, busName: null },
      { bus: null, busName: null },
      { bus: null, busName: null },
      { bus: null, busName: null },
      { bus: null, busName: null },
    ];
    this.stage = 0;
    this.emit_at = -1; // can be set to future syncTime's
    this.step_at = -1; // can be set to future syncTime's
  }

  MasterProgrammerStepper.prototype.clear = function () {
    this.stage = 0;
    this.emit_at = -1;
    this.step_at = -1;
  };

  MasterProgrammerStepper.prototype.decade_group = function () {
    var cur_decades = [ ];

    if ((this.opt_decade_hi_associator) && (this.opt_decade_hi_associator.opt == this.name)) {
      cur_decades.push(this.opt_decade_hi);
    }

    cur_decades = cur_decades.concat(this.decades);

    if ((this.opt_decade_lo_associator) && (this.opt_decade_lo_associator.opt == this.name)) {
      cur_decades.push(this.opt_decade_lo);
    }

    return cur_decades;
  };

  MasterProgrammerStepper.prototype.send_pulse_to_decade_group = function () {
    var decades = this.decade_group();
    var i;
    var send_again = true;
    for (i=decades.length-1; i>=0; i--) {
      if (send_again) {
        var did_carry = decades[i].send_pulse();
        send_again = did_carry;
      } 
    }
    if (send_again) {
      console.log("WARNING: overflow in MasterProgrammerStepper.send_pulse_to_decade_group()");
    }
  };

  MasterProgrammerStepper.prototype.rx_direct_inputs_to_decade_group = function () {
    var decades = this.decade_group();
    var i;
    var prev_did_carry = false;
    for (i=decades.length-1; i>=0; i--) {
      var cur_did_carry = false;
      if (prev_did_carry) {
        cur_did_carry = decades[i].send_pulse();
      } 
      if (decades[i].direct_input.bus) {
        var bits = decades[i].direct_input.bus.read(syncLines["syncTime"]-1);
        if (bits[0] == 1) {
          cur_did_carry = decades[i].send_pulse() || cur_did_carry;
        }
      }
      prev_did_carry = cur_did_carry;
    }
    if (prev_did_carry) {
      console.log("WARNING: overflow in MasterProgrammerStepper.rx_direct_inputs_to_decade_group()");
    }
  };

  MasterProgrammerStepper.prototype.decade_group_max_val = function () {
    var num = 0;
    var decades = this.decade_group();
    var i;

    for (i=0; i<decades.length; i++) {
      num = (num*10) + decades[i].stages[this.stage].opt;
    }
  
    return num;
  };

  MasterProgrammerStepper.prototype.decade_group_cur_val = function () {
    var num = 0;
    var decades = this.decade_group();
    var i;

    for (i=0; i<decades.length; i++) {
      num = (num*10) + decades[i].value;
    }
  
    return num;
  };

  MasterProgrammerStepper.prototype.decade_group_clear_val = function () {
    var decades = this.decade_group();
    var i;

    for (i=0; i<decades.length; i++) {
      decades[i].clear();
    }
  };

  MasterProgrammerStepper.prototype.decade_group_overflow = function () {
    var isGreaterOrEqual = this.decade_group_cur_val() >= this.decade_group_max_val();
    if (isGreaterOrEqual) {
      console.log("decade group cur val ("+this.decade_group_cur_val()+") >= decade group max val ("+this.decade_group_max_val()+")");
    };
    return isGreaterOrEqual;
  };

  MasterProgrammerStepper.prototype.sync = function (syncLines) {
    // if we're programmed to emit now, do so
    if (syncLines["syncTime"] == this.emit_at) {
      this.emit_at = -1;
      console.log("MP-"+this.name+": emitting on program pulse output "+this.stage);
      if (this.program_pulse_outputs[this.stage].bus) {
        this.program_pulse_outputs[this.stage].bus.write(syncLines["syncTime"], [1]);
      }
      this.send_pulse_to_decade_group();

      // check for decade overflow
      if (this.decade_group_overflow()) {
        if (this.step_at < 0) {
          console.log("MP-"+this.name+": decade has overflowed. scheduling step.");
          this.step_at = syncLines["syncTime"] + syncLines["additionDuration"];
        }
      }
    }

    // if we're programmed to step now, do so
    if (syncLines["syncTime"] == this.step_at) {
      this.step_at = -1;
      console.log("MP-"+this.name+": stepping from "+this.stage+" to "+(this.stage+1));
      this.decade_group_clear_val();
      this.stage += 1;
      if (this.stage >= this.clear_switch.opt) {
        console.log("MP-"+this.name+": stage ("+this.stage+") exceeds clear switch setting ("+this.clear_switch.opt+"). Resetting");
        this.stage = 0;
      }
    }

    // if program pulse input, emit in one addition cycle
    if (this.program_pulse_input.bus) {
      var bits = this.program_pulse_input.bus.read(syncLines["syncTime"]-1);
      if (bits[0] == 1) {
        if (this.emit_at < 0) {
          console.log("MP-"+this.name+": received program pulse input. scheduling emit.");
          this.emit_at = syncLines["syncTime"] + syncLines["additionDuration"];
        }
      }
    }

    // if direct input, emit in one addition cycle
    if (this.direct_input.bus) {
      var bits = this.direct_input.bus.read(syncLines["syncTime"]-1);
      if (bits[0] == 1) {
        if (this.emit_at < 0) {
          console.log("MP-"+this.name+": received direct input. scheduling emit.");
          this.emit_at = syncLines["syncTime"] + syncLines["additionDuration"];
        }
      }
    }

    // read the decade direct inputs
    this.rx_direct_inputs_to_decade_group();

    // check if we're being cleared
    if (this.clear_direct_input.bus) {
      var bits = this.clear_direct_input.bus.read(syncLines["syncTime"]-1);
      if (bits[0] == 1) {
        console.log("MP-"+this.name+": received clear direct input. setting to stage 0.");
        this.stage = 0;
      }
    }
  };

  MasterProgrammerStepper.build = function (data) {
    return new MasterProgrammerStepper(data);
  };

  return MasterProgrammerStepper;
}])

.factory('MasterProgrammer', 
         ['TensComplement', 'MasterProgrammerDecade', 'MasterProgrammerStepper',
          function(TensComplement, MasterProgrammerDecade, MasterProgrammerStepper) {
  function MasterProgrammer(name) {
    this.name = name;

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

  MasterProgrammer.prototype.connectStepperProgramPulseInput = function (stepper_key, bus) {
    this.steppers[stepper_key].program_pulse_input.bus     = bus;
    this.steppers[stepper_key].program_pulse_input.busName = bus.name;
  };

  MasterProgrammer.prototype.connectStepperDirectInput = function (stepper_key, bus) {
    this.steppers[stepper_key].direct_input.bus     = bus;
    this.steppers[stepper_key].direct_input.busName = bus.name;
  };

  MasterProgrammer.prototype.connectStepperClearDirectInput = function (stepper_key, bus) {
    this.steppers[stepper_key].clear_direct_input.bus     = bus;
    this.steppers[stepper_key].clear_direct_input.busName = bus.name;
  };

  MasterProgrammer.prototype.connectStepperProgramPulseOutput = function (stepper_key, out_idx, bus) {
    this.steppers[stepper_key].program_pulse_outputs[out_idx].bus     = bus;
    this.steppers[stepper_key].program_pulse_outputs[out_idx].busName = bus.name;
  };

  MasterProgrammer.prototype.connectDecadeDirectInput = function (decade_idx, bus) {
    this.decades[decade_idx].direct_input.bus     = bus;
    this.decades[decade_idx].direct_input.busName = bus.name;
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
