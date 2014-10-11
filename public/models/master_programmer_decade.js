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
    this.direct_input = { bus: null, busName: null, portNum: null };
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
}]);
