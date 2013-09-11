/**
 * Controller to handle display of a selected chart. Basically just a skeleton
 * stub for now.
 */
angular.module('plea').controller('ChartCtrl', function($scope, mainViewState) {
    $scope.chart = mainViewState.selectedChart;

	// Note that this controller will be re-invoked every time a chart is
	// selected because its under an ng-if clause. That's why we can get
	// away with settings $scope.chart once and not watching for mainViewState
	// to trigger a 'change:selectedChart' event. This is not true in general
	// (for example, in `chartSelectionCtrl` we need to explicitly watch for
	// a change).
	//
	// TODO: the proper way to implement this (and any other controller whose
	// state depends on some externally-mutable injected value) is probably to
	// use a true directive, but this is a major refactor that's not necessary
	// at the moment
});
