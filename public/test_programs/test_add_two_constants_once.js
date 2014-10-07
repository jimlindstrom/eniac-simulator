'use strict';

angular.module('myApp')

.factory('TestAddTwoConstantsOnce', ['$interval', function($interval) {
  function TestAddTwoConstantsOnce() {
  }

  /*
   * Overall plan:
   * 1. Load +123 into A0
   * 2. Load -3 into A1
   * 2. Add A1 = A1 + A0 = -3 + 123 = 120
   */

  TestAddTwoConstantsOnce.setup = function (eniac) {
    // Instruction -3
    // t=-3
    // next: -> c5 (Instruction 1)
    eniac.initiatingUnit.connectInitPulse(eniac.controlBuses[4]);
  
    // Instruction -2
    // t=-2
    // post: CX0 top = +123
  
    // Set CX0.top
    eniac.constant_xmitters[0].pm_arrs[1][0].opt = "P";
    eniac.constant_xmitters[0].number_dial_arrs[0][7].opt = 1;
    eniac.constant_xmitters[0].number_dial_arrs[0][8].opt = 2;
    eniac.constant_xmitters[0].number_dial_arrs[0][9].opt = 3;
  
    // Instruction -1
    // t=-1
    // post: CX0 bot = -3
  
    // Set CX0.bot
    eniac.constant_xmitters[0].pm_arrs[1][0].opt = "M";
    eniac.constant_xmitters[0].number_dial_arrs[1][0].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][1].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][2].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][3].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][4].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][5].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][6].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][7].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][8].opt = 9;
    eniac.constant_xmitters[0].number_dial_arrs[1][9].opt = 7;
  
    // Instruction 1
    // t=0 
    // prev: Instruction -3 -> c5 -> CX0[0,0]
    // prev: Instruction -3 -> c5 -> A0[R0]
    // CX0[0,0] TX(top) -> d0 -> A0[R0] RX(α)
    // next: CX0[0,0] program -> c0 -> Instruction 2
    // next: A0[R0] program -> c1 -> Instruction 2
    // post: A0 holds +123
    // consumed: CX0[0,0]
    // consumed: A0[R0]
  
    // prev: god -> CX0[0,0]
    eniac.constant_xmitters[0].connectCtrlIn(0, 0, eniac.controlBuses[4]);
  
    // prev: god -> A0[R0]
    eniac.accumulators[0].connectCtrlIn(0,         eniac.controlBuses[4]);
  
    // CX0[0,0] TX
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][0].top_opt = "LR"; // entire number
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][0].bot_opt = "A";  // top number
  
    // A0[R0] RX(α)
    eniac.accumulators[0].repeatProgControls[0].operation = 'α'; // A0 += α
    eniac.accumulators[0].repeatProgControls[0].repeat = 1;      // Do it once
  
    // Connect CX0 and A0(α) via d0
    eniac.constant_xmitters[0].connectDataOut(eniac.dataBuses[0]); 
    eniac.accumulators[0].connectDataIn('α',  eniac.dataBuses[0]);
  
    // CX0[0,0] -> next
    eniac.constant_xmitters[0].connectCtrlOut(0, 0, eniac.controlBuses[0]);
  
    // A0[R0] -> next
    eniac.accumulators[0].connectCtrlOut(0,         eniac.controlBuses[1]);
  
    // Instruction 2
    // t=1
    // prev: Instruction 1 -> c0 -> CX0[0,1]
    // prev: Instruction 1 -> c1 -> A0[R1]
    // CX0[0,1] TX(bot) -> d0 -> A1[R0] RX(α)
    // next: CX0[0,1] -> c2 -> Instruction 3
    // next: A1[R0] -> c3 -> Instruction 3
    // post: A1 holds -3
    // consumed: CX0[0,0], CX0[0,1]
    // consumed: A0[R0], A1[R0]
  
    // Instruction -> CX0[0,1]
    eniac.constant_xmitters[0].connectCtrlIn(0, 1, eniac.controlBuses[0]);
  
    // Instruction -> A1[R0]
    eniac.accumulators[1].connectCtrlIn(0,         eniac.controlBuses[1]);
  
    // CX0[0,1] TX
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][1].top_opt = "LR";// Send the full number
    eniac.constant_xmitters[0].xmitter_ctrl_pair_arrays[0][1].bot_opt = "B"; // Send the bottom number
  
    // A1[R0] RX(α)
    eniac.accumulators[1].repeatProgControls[0].operation = 'α'; // A1 += α
    eniac.accumulators[1].repeatProgControls[0].repeat = 1;      // Do it onces
  
    // Connect CX0 and A1(α) via d0
    eniac.accumulators[1].connectDataIn('α',  eniac.dataBuses[0]);
  
    // CX0[0,1] -> next
    eniac.constant_xmitters[0].connectCtrlOut(0, 1, eniac.controlBuses[2]);
  
    // A0[R1] -> next
    eniac.accumulators[1].connectCtrlOut(0,         eniac.controlBuses[3]);
  
    // Instruction 3
    // t=2
    // prev: Instruction 2 -> c2 -> A0[R1]
    // prev: Instruction 2 -> c3 -> A1[R1]
    // A0[R1] TX(A) -> d0 -> A1[R1] RX(α)
    // next: --
    // post: A1 holds +123 + -3 = +120
    // consumed: CX0[0,0], CX0[0,1]
    // consumed: A0[R0], A0[R1]; A1[R0], A1[R1]
  
    // prev -> A0[R1]
    eniac.accumulators[0].connectCtrlIn(1, eniac.controlBuses[2]);
  
    // prev -> A1[R1]
    eniac.accumulators[1].connectCtrlIn(1, eniac.controlBuses[3]);
  
    // A0[R1] TX(A)
    eniac.accumulators[0].repeatProgControls[1].operation = 'A'; // Write to 'A'
    eniac.accumulators[0].repeatProgControls[1].repeat = 1;      // Do it onces
  
    // A1[R1] RX(α)
    eniac.accumulators[1].repeatProgControls[1].operation = 'α'; // A1 += 'α'
    eniac.accumulators[1].repeatProgControls[1].repeat = 1;      // Do it onces
  
    // Connect A0(A) and A1(α) via d0
    eniac.accumulators[0].connectDataOut('A', eniac.dataBuses[0]);
    eniac.accumulators[1].connectDataIn('α',  eniac.dataBuses[0]);
  };

  TestAddTwoConstantsOnce.run = function (eniac, successHandler, failureHandler) {
    eniac.clear();
    eniac.init_pulse();
    eniac.start();

    var max_secs = 12;
    var max_cycles = 4;

    var num_secs = 0;
    var promise = $interval(function () {
      num_secs += 1;

      if (eniac.cyclingUnit.cycle >= max_cycles) {
        if (eniac.accumulators[1].curValStr() == "120") {
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

  return TestAddTwoConstantsOnce;
}]);
