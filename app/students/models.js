angular.module('plea').factory('Student', function(Backbone) {
    return Backbone.Model.extend({
        urlRoot: '/plea/students/'
    });
});

angular.module('plea').factory('studentDataStore', function(Student) {
    var StudentCollection = Backbone.Collection.extend({
        url: '/plea/students/',
        model: Student
    });

    var cache = {
        promise: null,
        collection: null
    };

    return {
        /**
         * Returns a Collection of all Student models. Makes asynchronous call
         * to fetch data on the first invocation of this method; use the
         * callback argument for any code that is dependent on the results of
         * this call.
         *
         * @param  {Function} syncCallback      Callback function to run after collection's
         *                                      successful initial sync to the server. Callback
         *                                      takes one argument: the collection.
         * @return {Collection}
         */
        getAll: function(syncCallback) {
            var studentCollection = cache.collection;
            if (!studentCollection) {
                cache.collection = studentCollection = new StudentCollection();
                cache.promise = fetchPromise = studentCollection.fetch();
            }

            if (syncCallback) {
                cache.promise.success(function() {
                    syncCallback(studentCollection);
                });
            }

            return studentCollection;
        }

    };
});
