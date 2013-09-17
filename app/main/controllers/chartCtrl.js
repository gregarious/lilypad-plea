/**
 * Controller to handle display of a selected chart. Basically just a skeleton
 * stub for now.
 */
angular.module('plea').controller('ChartCtrl', function($scope, mainViewState, _) {
    $scope.chart = mainViewState.selectedChart;

    // upon fetching data, this array will be filled with bare Javascript
    // objects of the form: {date: '2013-09-03', floor: 40, correct: 40, etc.}
    $scope.dailyRecords = [];

    // Fetch the Collection of DayMetric objects and group values for the same
    // date into objects.

    var dayMetricCollection = $scope.chart.getDayMetrics(function() {
        // find the range of dates these metrics span
		var datesInRange = _.uniq(dayMetricCollection.pluck('date'), true);
        // package all metric values for each respective date into the same object
		_.each(datesInRange, function(date) {
			var pkg = packageMetricValues(dayMetricCollection.where({'date': date}));
			$scope.dailyRecords.push(pkg);
		});
    });

    // No need to do any extra processing to the phase lines, just expose
    // the bare collection.
    $scope.phaseLineCollection = $scope.chart.getPhaseLines();

	var typeLabelMap = {0: 'floor', 1: 'corrects', 2: 'errors', 3: 'trials'};
	/**
	 * Packages a group of DayMetrics that share a date together, key-indexed
	 * by their respective metric types.
	 *
	 * Note that the function assumes all input metrics have the same date and
	 * that their `type` attribute is in the range 0-3.
	 *
	 * @param  {DayMetric} metrics  Array of DayMetric objects
	 * @return {Object}             Package of metric values
	 */
	function packageMetricValues(metrics) {
		if (metrics.length < 1) {
			return [];
		}

		// assume first metric date is shared by all
		var pkg = { date: metrics[0].get('date') };

		_.each(metrics, function(dayMetric) {
			var label = typeLabelMap[dayMetric.get('type')];
			if (label) {
				pkg[label] = dayMetric.get('value');
			}
		});
		return pkg;
	}
});
