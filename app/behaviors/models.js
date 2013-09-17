/**
 * BehaviorIncident model definition
 */
angular.module('plea').factory('BehaviorIncident', function(Backbone, moment, BehaviorType) {
    return Backbone.Model.extend({
        urlRoot: '/plea/behaviorincidents/',

        // transform `occurredAt` timestamp into Date object and deserialize
        // `type` object into full BehaviorType
        parse: function(response) {
            response = Backbone.Model.prototype.parse.apply(this, arguments);

            if (response.occurredAt) {
                response.occurredAt = moment(response.occurredAt).toDate();
            }
            if (response.type) {
                response.type = new BehaviorType(response.type);
            }
            return response;
        },

        // transform `occurredAt` Date into timestamp string and flatten
        // `type` BehaviorType model into just a stub
        toJSON: function() {
            // camelize the data keys first
            var data = Backbone.Model.prototype.toJSON.apply(this, arguments);
            if (data['occurred_at']) {
                data['occurred_at'] = moment(data['occurred_at']).format();
            }
            if (data['type']) {
                data['type'] = {
                    id: data['type'].id
                };
            }

            return data;
        }
    });
});

/**
 * BehaviorType model definition
 */
angular.module('plea').factory('BehaviorType', function(Backbone) {
    return Backbone.Model.extend({
        urlRoot: '/plea/behaviortypes/'
    });
});


/**
 * Data store for BehaviorIncident objects.
 *
 * Provided accessors:
 * - getAllForStudent: Returns all BehaviorIncidents for a given student
 */
angular.module('plea').factory('behaviorIncidentDataStore', function(BehaviorIncident) {
    var studentBehaviorIncidentCollectionFactory = function(student) {
        return new (Backbone.Collection.extend({
            url: student.get('behaviorIncidentsUrl'),
            model: BehaviorIncident,

            // sort by date, decreasing order
            comparator: function(incident) {
                if (incident.has('occurredAt')) {
                    return -incident.get('occurredAt');
                }
                else {
                    return Infinity;
                }
            }
        }))();
    };

    return {
        /**
         * Returns a Collection of all BehaviorIncidents related to the given Student
         * model. Makes asynchronous call to fetch data; use the callback
         * argument for any code that is dependent on the results of this
         * call.
         *
         * @param  {Student}  student
         * @param  {Function} syncCallback      Callback function to run after collection's
         *                                      successful sync to the server. Callback
         *                                      takes one argument: the collection.
         * @return {Collection}
         */
        getAllForStudent: function(student, syncCallback) {
            var collection = studentBehaviorIncidentCollectionFactory(student);
            var promise = collection.fetch();

            if (syncCallback) {
                promise.success(function() {
                    syncCallback(collection);
                });
            }

            return collection;
        }

    };
});

/**
 * Data store for BehaviorType objects.
 *
 * Provided accessors:
 * - getAllForStudent: Returns all BehaviorTypes for a given student
 */
angular.module('plea').factory('behaviorTypeDataStore', function(BehaviorType) {
    var studentBehaviorTypeCollectionFactory = function(student) {
        return new (Backbone.Collection.extend({
            url: student.get('behaviorTypesUrl'),
            model: BehaviorType
        }))();
    };

    return {
        /**
         * Returns a Collection of all BehaviorTypes related to the given Student
         * model. Makes asynchronous call to fetch data; use the callback
         * argument for any code that is dependent on the results of this
         * call.
         *
         * @param  {Student}  student
         * @param  {Function} syncCallback      Callback function to run after collection's
         *                                      successful sync to the server. Callback
         *                                      takes one argument: the collection.
         * @return {Collection}
         */
        getAllForStudent: function(student, syncCallback) {
            var collection = studentBehaviorTypeCollectionFactory(student);
            var promise = collection.fetch();

            if (syncCallback) {
                promise.success(function() {
                    syncCallback(collection);
                });
            }

            return collection;
        }

    };
});

