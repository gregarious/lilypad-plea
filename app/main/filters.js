angular.module('plea').filter('formatDatetime', function(moment) {
	return function(date) {
		return moment(date).format('lll');
	};
});
