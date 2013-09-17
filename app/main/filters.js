angular.module('plea').
	/**
	 * Simple date filterer that defers to Moment.js formatter
	 */
	filter('formatDate', function(moment) {
		return function(date, fmt) {
			if (date) {
				return moment(date).format(fmt);
			}
			return '';
		};
	});
