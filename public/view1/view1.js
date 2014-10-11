'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', 
            ['$scope', '$interval', '$timeout', 
             'Eniac', 'Wiring',
             'TestAccToAccNegNumTransfer',
             'TestAddTwoConstantsOnce',
             'TestSubtractConstantsWithMasterProgrammer',
             function($scope, $interval, $timeout, 
                      Eniac, Wiring,
                      TestAccToAccNegNumTransfer, 
                      TestAddTwoConstantsOnce, 
                      TestSubtractConstantsWithMasterProgrammer) {

  function connect_all_ports() {
    var q = "//div[contains(@data-dest-id, '-') and contains(@class, 'control-connector')]";
    var result = document.evaluate(q, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (result) {
      for (var i=0, len=result.snapshotLength; i < len; i++) {
        var elem1 = result.snapshotItem(i);
        var destId = elem1.dataset.destId;
        if (destId) {
          var elem2 = document.getElementById(destId);
          if (elem2) {
            Wiring.draw_control_connection(elem1, elem2);
          }
        }
      }
    }

    var q = "//div[contains(@data-dest-id, '-') and contains(@class, 'horiz-connector')]";
    var result = document.evaluate(q, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (result) {
      for (var i=0, len=result.snapshotLength; i < len; i++) {
        var elem1 = result.snapshotItem(i);
        var destId = elem1.dataset.destId;
        if (destId) {
          var elem2 = document.getElementById(destId);
          if (elem2) {
            Wiring.draw_horiz_data_connection(elem1, elem2);
          }
        }
      }
    }

    var q = "//div[contains(@data-dest-id, '-') and contains(@class, 'vert-connector')]";
    var result = document.evaluate(q, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (result) {
      for (var i=0, len=result.snapshotLength; i < len; i++) {
        var elem1 = result.snapshotItem(i);
        var destId = elem1.dataset.destId;
        if (destId) {
          var elem2 = document.getElementById(destId);
          if (elem2) {
            Wiring.draw_vert_data_connection(elem1, elem2);
          }
        }
      }
    }
  }

  $scope.controls_are_expanded = true;

  $scope.test_programs = [
    {
      id: 0,
      name: "(X - Y) * 3, with Master Programmer",
      program: TestSubtractConstantsWithMasterProgrammer,
      description: "This program uses the Master Programmer to orchestrate the other "+
                   "units. First it tells the constant transmitter to send X to Accumulator "+
                   "1. Then it tells the constant transmitter to send Y to Accuulator 2. It "+
                   "then tells the Accumulators to subtract the numbers and triple the "+
                   "difference. You should see the result in Accumulator 2 after 13 'Addition "+
                   "Times.'"
    },
    {
      id: 1,
      name: "Add Two Constants",
      program: TestAddTwoConstantsOnce,
      description: "This program uses the constant transmitter and both accumulators to "+
                   "simply add two numbers that are initially stored in the constant "+
                   "transmitter. Rather than relying on the Master Programmer, each "+
                   "operation is responsible for initiating the next operation in the chain "+
                   "of operations."
    },
    {
      id: 2,
      name: "Transfer a Negative Number",
      program: TestAccToAccNegNumTransfer,
      description: "This is a simple program to test the sending of a negative number "+
                   "across the digit tray (data bus)."
    },
  ];
  $scope.test_program = $scope.test_programs[0].id;
  $scope.test_program_description = $scope.test_programs[0].description;

  $scope.load_program = function () {
    Wiring.destroy_connections();
    $scope.eniac = new Eniac.build({});
    $scope.test_programs[$scope.test_program].program.setup($scope.eniac);
    $scope.test_program_description = $scope.test_programs[$scope.test_program].description;
    $timeout(connect_all_ports, 2000);
  };

  $scope.eniac = new Eniac.build({});
  $scope.test_programs[$scope.test_program].program.setup($scope.eniac);
  $timeout(connect_all_ports, 2000);

  // function handleTestSuccess(msg) { alert(msg); }
  // function handleTestFailure(msg) { alert(msg); }
  // TestProgram.run($scope.eniac, handleTestSuccess, handleTestFailure);
}]);
