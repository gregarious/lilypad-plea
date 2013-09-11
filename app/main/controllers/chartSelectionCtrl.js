angular.module('pleaMain').controller('ChartSelectionCtrl', function($scope, chartDataStore, mainViewState) {
    var updateChartList = function() {
        $scope.chartCollection = chartDataStore.getAllForStudent(mainViewState.selectedStudent);
    };
    updateChartList();
    mainViewState.on('change:selectedStudent', updateChartList);

    $scope.selectChart = function(chart) {
        mainViewState.setSelectedChart(chart);
    };
});
