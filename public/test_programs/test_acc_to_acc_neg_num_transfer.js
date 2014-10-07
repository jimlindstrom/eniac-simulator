'use strict';

angular.module('myApp')

.factory('TestAccToAccNegNumTransfer', ['$interval', function($interval) {
  function TestAccToAccNegNumTransfer() {
  }

  /*
   * Overall plan:
   * 1. Load -1384 into an accumulator
   * 2. Transfer it into a second accumulator
   */

  TestAccToAccNegNumTransfer.setup = function (eniac) {
    /**************************************************************************
     * SET CONSTANTS
     **************************************************************************/

    // Set CX0.bot_right = -2812
    eniac.constant_xmitters[0].pm_arrs[0][1].opt = "M";
    eniac.constant_xmitters[0].number_dial_arrs[0][5].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[0][6].opt = 8;
    eniac.constant_xmitters[0].number_dial_arrs[0][7].opt = 6;
    eniac.constant_xmitters[0].number_dial_arrs[0][8].opt = 1;
    eniac.constant_xmitters[0].number_dial_arrs[0][9].opt = 6;
   
    /**************************************************************************
     * WIRE UP CONTROL FLOW
     **************************************************************************/

    // Set IU to INIT CX0-0.0
    // Set IU to INIT A0.R0
    eniac.initiatingUnit.connectInitPulse(eniac.controlBuses[0]);
    eniac.constant_xmitters[0].connectCtrlIn(0, 0,                  eniac.controlBuses[0]);
    eniac.accumulators[0].connectCtrlIn(0,                          eniac.controlBuses[0]);

    // Set A0.R0 to kick A0.R1 upon completion via c1
    // Set A0.R0 to kick A1.R0 upon completion via c1
    eniac.accumulators[0].connectCtrlOut(0,                         eniac.controlBuses[1]);
    eniac.accumulators[0].connectCtrlIn(1,                          eniac.controlBuses[1]);
    eniac.accumulators[1].connectCtrlIn(0,                          eniac.controlBuses[1]);

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

    // Set CX0-0.0 to TX(Top,Right Half)
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][0].top_opt = "R"; // right half
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][0].bot_opt = "A"; // top number

    // Set A0-R0 to RX(α)
    eniac.accumulators[0].repeatProgControls[0].operation = 'α'; // A0 += α
    eniac.accumulators[0].repeatProgControls[0].repeat = 1;      // Do it once

    // Set A0-R1 to TX(A)
    eniac.accumulators[0].repeatProgControls[1].operation = 'A'; // A0 -> A
    eniac.accumulators[0].repeatProgControls[1].repeat = 1;      // Do it once

    // Set A1-R0 to RX(α)
    eniac.accumulators[1].repeatProgControls[0].operation = 'α'; // A1 += α
    eniac.accumulators[1].repeatProgControls[0].repeat = 1;      // Do it once

  };

  TestAccToAccNegNumTransfer.run = function (eniac, successHandler, failureHandler) {
    eniac.clear();
    eniac.init_pulse();
    eniac.start();

    var max_secs = 10;
    var max_cycles = 3;

    var num_secs = 0;
    var promise = $interval(function () {
      num_secs += 1;

      if (eniac.cyclingUnit.cycle >= max_cycles) {
        if (eniac.accumulators[1].curValStr() == "-1384") {
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

  return TestAccToAccNegNumTransfer;
}]);
