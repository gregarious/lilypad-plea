angular.module('plea').factory('Chart', function(Backbone) {
	return Backbone.Model.extend({
		urlRoot: '/plea/charts/',
		getLabel: function() {
			return this.get('subtopic').name +
					" (" + this.get('inputChannel').name + "/" +
					this.get('outputChannel').name + ")";
		}
	});
});

angular.module('plea').factory('chartDataStore', function(Chart) {
	var studentChartCollectionFactory = function(student) {
		return new (Backbone.Collection.extend({
			url: student.get('chartsUrl'),
			model: Chart
		}))();
	};

	// will be a map of student ids to {promise: <obj>, collection: <obj>} objects
	var cache = {};

	return {
		/**
		 * Returns a Collection of all Charts related to the given student
		 * model. Makes asynchronous call to fetch data on the first
		 * invocation of this method; use the callback argument for any
		 * code that is dependent on the results of this call.
		 *
		 * @param  {Student}  student
		 * @param  {Function} syncCallback		Callback function to run after collection's
		 *                                      successful initial sync to the server. Callback
		 *                                      takes one argument: the collection.
		 * @return {Collection}
		 */
		getAllForStudent: function(student, syncCallback) {
			var studentCache = cache[student.id];
			if (!studentCache) {
				studentCache = cache[student.id] = {};
				studentCache.collection = studentChartCollectionFactory(student);
				studentCache.promise = studentCache.collection.fetch();
			}

			if (syncCallback) {
				studentCache.promise.success(function() {
					syncCallback(studentCache.collection);
				});
			}

			return studentCache.collection;
		}

	};
});
