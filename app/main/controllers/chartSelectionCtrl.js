/**
 * Controller to display a list of charts for a given student.
 */
angular.module('plea').controller('ChartSelectionCtrl', function($scope, chartDataStore, mainViewState) {
    var updateChartList = function() {
        $scope.chartCollection = chartDataStore.getAllForStudent(mainViewState.selectedStudent);
    };
    updateChartList();
    mainViewState.on('change:selectedStudent', updateChartList);

    $scope.selectChart = function(chart) {
        mainViewState.setSelectedChart(chart);
        mainViewState.isScatterplotSelected = false;
    };

    $scope.selectScatterplot = function() {
    	mainViewState.isScatterplotSelected = true;
    }
});
