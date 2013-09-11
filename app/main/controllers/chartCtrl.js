angular.module('pleaMain').controller('ChartCtrl', function($scope, mainViewState) {
    $scope.chart = mainViewState.selectedChart;
});
