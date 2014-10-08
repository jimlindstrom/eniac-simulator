'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', 
            ['$scope', '$interval', 'Eniac', 
             'TestAccToAccNegNumTransfer',
             'TestAddTwoConstantsOnce',
             'TestSubtractConstantsWithMasterProgrammer',
             function($scope, $interval, Eniac, 
                      TestAccToAccNegNumTransfer, 
                      TestAddTwoConstantsOnce, 
                      TestSubtractConstantsWithMasterProgrammer) {

  $scope.controls_are_expanded = true;

  $scope.test_programs = [
    {
      id: 0,
      name: "(X - Y) * 3, with Master Programmer",
      program: TestSubtractConstantsWithMasterProgrammer
    },
    {
      id: 1,
      name: "Add Two Constants",
      program: TestAddTwoConstantsOnce
    },
    {
      id: 2,
      name: "Transfer a Negative Number",
      program: TestAccToAccNegNumTransfer
    },
  ];
  $scope.test_program = $scope.test_programs[0].id;

  $scope.load_program = function () {
    $scope.eniac = new Eniac.build({});
    $scope.test_programs[$scope.test_program].program.setup($scope.eniac);
  };

  $scope.eniac = new Eniac.build({});
  $scope.test_programs[$scope.test_program].program.setup($scope.eniac);

  // function handleTestSuccess(msg) { alert(msg); }
  // function handleTestFailure(msg) { alert(msg); }
  // TestProgram.run($scope.eniac, handleTestSuccess, handleTestFailure);
}]);
