'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', 
//            ['$scope', '$interval', 'Eniac', 'TestAccToAccNegNumTransfer',
//            ['$scope', '$interval', 'Eniac', 'TestAddTwoConstantsOnce',
            ['$scope', '$interval', 'Eniac', 'TestSubtractConstantsWithMasterProgrammer',
             function($scope, $interval, Eniac, TestProgram) {

  function handleTestSuccess(msg) {
    alert(msg);
  }

  function handleTestFailure(msg) {
    alert(msg);
  }

  $scope.eniac = new Eniac.build({});

  TestProgram.setup($scope.eniac);
//  TestProgram.run($scope.eniac, handleTestSuccess, handleTestFailure);
}]);
