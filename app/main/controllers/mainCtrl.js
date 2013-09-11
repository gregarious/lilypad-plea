/**
 * Main body controller that simply hooks the mainViewState into the template.
 */
angular.module('plea').controller('MainCtrl', function($scope, mainViewState) {
    $scope.mainViewState = mainViewState;
});
