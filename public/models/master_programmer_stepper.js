'use strict';

angular.module('myApp')

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
    this.program_pulse_input = { bus: null, busName: null, portNum: null };
    this.direct_input = { bus: null, busName: null, portNum: null };
    this.clear_direct_input = { bus: null, busName: null, portNum: null };
    this.program_pulse_outputs = [
      { bus: null, busName: null, portNum: null },
      { bus: null, busName: null, portNum: null },
      { bus: null, busName: null, portNum: null },
      { bus: null, busName: null, portNum: null },
      { bus: null, busName: null, portNum: null },
      { bus: null, busName: null, portNum: null },
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
}]);
