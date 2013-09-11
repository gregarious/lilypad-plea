angular.module('plea').controller('ChartCtrl', function($scope, mainViewState) {
    $scope.chart = mainViewState.selectedChart;
});
