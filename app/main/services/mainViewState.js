/**
 * Global service to track UI state.
 *
 * Currently stores two state objects:
 * - currentStudent
 * - currentChart
 *
 * An event will be triggered on the `mainViewState` object when either of
 * the two state objects change.
 */
angular.module('plea').factory('mainViewState', function(_, Backbone) {
	var viewState = {
		// the currently selected student. don't assign this directly in
		// controller code: use setter method so event is triggered
		selectedStudent: null,
		setSelectedStudent: function(student) {
			this.selectedStudent = student;
			this.trigger('change:selectedStudent', student);
		},

		// the currently selected chart. don't assign this directly in
		// controller code: use setter method so event is triggered
		selectedChart: null,
		setSelectedChart: function(chart) {
			this.selectedChart = chart;
			this.trigger('change:selectedChart', chart);
		}
	};

	// add Backbone event-triggering capabilities before returning
	return _.extend(viewState, Backbone.Events);
});