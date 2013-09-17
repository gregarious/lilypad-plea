/**
 * Controller to handle display of a selected chart. Basically just a skeleton
 * stub for now.
 */
angular.module('plea').controller('ChartCtrl', function($scope, mainViewState) {
    $scope.chart = mainViewState.selectedChart;

    $scope.dayMetricCollection = $scope.chart.getDayMetrics();
    $scope.phaseLineCollection = $scope.chart.getPhaseLines();

	// Note that this controller will be re-invoked every time a chart is
	// selected because its under an ng-if clause. That's why we can get
	// away with setting $scope.chart once and not watching for mainViewState
	// to trigger a 'change:selectedChart' event. This is not true in general
	// (for example, in `chartSelectionCtrl` we need to explicitly watch for
	// a change).
	//
	// TODO: There's two (more) proper ways to implement this:
	//
	// 1. If re-initialization on every chart load is desirable, consider
	// using a true directive. This is a major refactor that's not necessary
	// at the moment
	// 2. More feasibly: Just take the philosophy that all controllers are
	// initialized on app load with no bound data, and state triggers are
	// always necessary for setting up the state
});
