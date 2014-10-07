'use strict';

angular.module('myApp')

.factory('TestSubtractConstantsWithMasterProgrammer', ['$interval', function($interval) {
  function TestSubtractConstantsWithMasterProgrammer() {
  }

  /*
   * Overall plan:
   * 1. Load +1428 into one accumulator
   * 2. Add -2812 to it: (+1428) + (-2812) = -1384
   * 4. Move the result to a second accumulator once:     0 + -1384 = -1384
   * 5. Move the result to a second accumulator once: -1384 + -1384 = -2768
   * 6. Move the result to a second accumulator once: -2768 + -1384 = -4152
   */

  TestSubtractConstantsWithMasterProgrammer.setup = function (eniac) {
    /**************************************************************************
     * SET CONSTANTS
     **************************************************************************/

    // Set CX0.top_right = +1428
    eniac.constant_xmitters[0].pm_arrs[1][1].opt = "P";
    eniac.constant_xmitters[0].number_dial_arrs[0][6].opt = 1;
    eniac.constant_xmitters[0].number_dial_arrs[0][7].opt = 4;
    eniac.constant_xmitters[0].number_dial_arrs[0][8].opt = 2;
    eniac.constant_xmitters[0].number_dial_arrs[0][9].opt = 8;

    // Set CX0.bot_right = -2812
    eniac.constant_xmitters[0].pm_arrs[1][1].opt = "M";
    eniac.constant_xmitters[0].number_dial_arrs[1][5].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][6].opt = 7;
    eniac.constant_xmitters[0].number_dial_arrs[1][7].opt = 1;
    eniac.constant_xmitters[0].number_dial_arrs[1][8].opt = 8;
    eniac.constant_xmitters[0].number_dial_arrs[1][9].opt = 8;
   
    /**************************************************************************
     * WIRE UP CONTROL FLOW
     **************************************************************************/

    // Set IU to INIT MP(A)
    eniac.initiatingUnit.connectInitPulse(eniac.controlBuses[0]);
    eniac.masterProgrammer.connectStepperProgramPulseInput('A', eniac.controlBuses[0]);

    // Set MP-A0 to program CX0-0.0 to TX top right (1x) via c1
    // Set MP-A0 to program A0.R0 to RX (1x) via c1
    // Set A.R0 to kick MP-A upon completion via c0
    // Set MP-A0 to step upon kick from A.R0 via c0
    eniac.masterProgrammer.connectStepperProgramPulseOutput('A', 0, eniac.controlBuses[1]);
    eniac.constant_xmitters[0].connectCtrlIn(0, 0,                  eniac.controlBuses[1]);
    eniac.accumulators[0].connectCtrlIn(0,                          eniac.controlBuses[1]);
    eniac.accumulators[0].connectCtrlOut(0,                         eniac.controlBuses[0]);

    // Set MP-A1 to program CX0-0.1 to TX bot right (1x) via c3
    // Set MP-A1 to program A0.R1 to RX (1x) via c3
    // Set A0.R1 to kick MP-A upon completion via c0
    // Set MP-A1 to step upon kick from A0.R1 via c0
    eniac.masterProgrammer.connectStepperProgramPulseOutput('A', 1, eniac.controlBuses[3]);
    eniac.constant_xmitters[0].connectCtrlIn(0, 1,                  eniac.controlBuses[3]);
    eniac.accumulators[0].connectCtrlIn(1,                          eniac.controlBuses[3]);
    eniac.accumulators[0].connectCtrlOut(1,                         eniac.controlBuses[0]);

    // Set MP-A2 to program A0.R2 to TX via c5
    // Set MP-A2 to program A1.R0 to RX via c5
    // Set A1.R0 to kick MP-A upon completion via c0
    // Set MP-A1 to step upon 3rd kick from A0.R1 via c0
    eniac.masterProgrammer.connectStepperProgramPulseOutput('A', 2, eniac.controlBuses[5]);
    eniac.accumulators[0].connectCtrlIn(2,                          eniac.controlBuses[5]);
    eniac.accumulators[1].connectCtrlIn(0,                          eniac.controlBuses[5]);
    eniac.accumulators[1].connectCtrlOut(0,                         eniac.controlBuses[0]);
    eniac.masterProgrammer.decades[0].stages[2].opt = 3;
    
    /**************************************************************************
     * WIRE UP DATA FLOW
     **************************************************************************/

    // Wire CX0 into D0
    eniac.constant_xmitters[0].connectDataOut(eniac.dataBuses[0]);

    // Wire D0 into A0.α 
    eniac.accumulators[0].connectDataIn('α',  eniac.dataBuses[0]);

    // Wire A0.A into D1
    eniac.accumulators[0].connectDataOut('A', eniac.dataBuses[1]);

    // Wire D1 into A1.α
    eniac.accumulators[1].connectDataIn('α',  eniac.dataBuses[1]);
  
    /**************************************************************************
     * MINI-PROGRAMS
     **************************************************************************/

    // Set MP-A to run 4 stages (stage 4 is halt)
    eniac.masterProgrammer.steppers['A'].clear_switch.opt = 4;

    // Set CX0-0.0 to TX(Top,Right Half) [Works: A0 gets 1428 by end of Cycle 3]
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][0].top_opt = "R"; // right half
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][0].bot_opt = "A"; // top number

    // Set CX0-0.1 to TX(Top,Right Half) [Works: A0 gets -1384 by end of Cycle 4]
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][1].top_opt = "R"; // right half
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][1].bot_opt = "B"; // top number

    // Set A0-R0 to RX(α) [Works: A0 gets 1428 by end of Cycle 3]
    eniac.accumulators[0].repeatProgControls[0].operation = 'α'; // A0 += α
    eniac.accumulators[0].repeatProgControls[0].repeat = 1;      // Do it once

    // Set A0-R1 to RX(α) [Works: A0 gets -1384 by end of Cycle 4]
    eniac.accumulators[0].repeatProgControls[1].operation = 'α'; // A0 += α
    eniac.accumulators[0].repeatProgControls[1].repeat = 1;      // Do it once

    // Set A0-R2 to TX(A) [Works 3x. A2 ends up with -4152 by end of Cycle 11]
    eniac.accumulators[0].repeatProgControls[2].operation = 'A'; // TX -> A
    eniac.accumulators[0].repeatProgControls[2].repeat = 1;      // Do it once

    // Set A1-R0 to RX(α) [Works 3x. A2 ends up with -4152 by end of Cycle 11]
    eniac.accumulators[1].repeatProgControls[0].operation = 'α'; // A0 += α
    eniac.accumulators[1].repeatProgControls[0].repeat = 1;      // Do it once
  };

  TestSubtractConstantsWithMasterProgrammer.run = function (eniac, successHandler, failureHandler) {
    eniac.clear();
    eniac.init_pulse();
    eniac.start();

    var max_secs = 30;
    var max_cycles = 11;

    var num_secs = 0;
    var promise = $interval(function () {
      num_secs += 1;

      if (eniac.cyclingUnit.cycle >= max_cycles) {
        if (eniac.accumulators[1].curValStr() == "-4152") {
          $interval.cancel(promise);
          eniac.stop();
          successHandler("succeeded after " + eniac.cyclingUnit.cycle + " cycles");
        }
        else {
          $interval.cancel(promise);
          eniac.stop();
          failureHandler("failed with A1 value: " + eniac.accumulators[1].curValStr());
        }
      }

      if (num_secs >= max_secs) {
        $interval.cancel(promise);
        eniac.stop();
        failureHandler("failed by hanging");
      }
    }, 1000);
  };

  return TestSubtractConstantsWithMasterProgrammer;
}]);
