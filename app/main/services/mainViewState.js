/**
 * Global service to track UI state
 */
angular.module('pleaMain').factory('mainViewState', function(_, Backbone) {
	var viewState = {
		selectedStudent: null,
		setSelectedStudent: function(student) {
			this.selectedStudent = student;
			this.trigger('change:selectedStudent', student);
		},

		selectedChart: null,
		setSelectedChart: function(chart) {
			this.selectedChart = chart;
			this.trigger('change:selectedChart', chart);
		}
	};

	// add Backbone event-triggering capabilities before returning
	return _.extend(viewState, Backbone.Events);

});