/**
 * Chart model definition
 */
angular.module('plea').factory('Chart', function(Backbone, dayMetricDataStore, phaseLineDataStore) {
    return Backbone.Model.extend({
        urlRoot: '/plea/charts/',
        getLabel: function() {
            return this.get('subtopic').name +
                    " (" + this.get('inputChannel').name + "/" +
                    this.get('outputChannel').name + ")";
        },

        /**
         * Add a new DayMetric to the chart.
         * @param {Date} date for metric
         * @param {String} type of metric (e.g. 'corrects')
         * @param {Number} value of metric
         */
        addDayMetric: function(date, type, value) {
            console.warn('addDayMetric stub called: %s, %s, %d', date, type, value);
        },

        /**
         * Returns a Collection of DayMetrics instances sorted by date.
         * @param {Function} syncCallback Post-async fetch callback.
         * @return {Collection}
         */
        getDayMetrics: function(syncCallback) {
            return dayMetricDataStore.getAllForChart(this, syncCallback);
        },

        /**
         * Add a phase line.
         * @param {Date} date for PhaseLine
         * @param {String} title for PhaseLine
         */
        addPhaseLine: function(date, title) {
            console.warn('phaseLine stub called: %s, %s', date, title);
        },

        /**
         * Returns a Collection of PhaseLine instances sorted by date.
         * @param {Function} syncCallback  Post-async fetch callback.
         * @return {Collection}
         */
        getPhaseLines: function(syncCallback) {
            return phaseLineDataStore.getAllForChart(this, syncCallback);
        }

    });
});

/**
 * DayMetric model definition
 */
angular.module('plea').factory('DayMetric', function(Backbone, _) {
    var typeCodeToLabelMap = {0: 'floor', 1: 'corrects', 2: 'errors', 3: 'trials'};
    var typeLabelToCodeMap = _.invert(typeCodeToLabelMap);

    return Backbone.Model.extend({
        urlRoot: '/plea/daymetrics/',

        // map the type code from the server to its label
        parse: function(response) {
            response = Backbone.Model.prototype.parse.apply(this, arguments);

            response.type = typeCodeToLabelMap[response.type];
            return response;
        },

        // map the type label to it's code on the server
        toJSON: function() {
            // camelize the data keys first
            var data = Backbone.Model.prototype.toJSON.apply(this, arguments);
            data[type] = typeLabelToCodeMap[data[type]];
            return data;
        }
    });
});

/**
 * PhaseLine definition
 */
angular.module('plea').factory('PhaseLine', function(Backbone) {
    return Backbone.Model.extend({
        urlRoot: '/plea/phaselines/'
    });
});

/**
 * Data store for Chart objects.
 *
 * Provided accessors:
 * - getAllForStudent: Returns all charts for a given student
 */
angular.module('plea').factory('chartDataStore', function(Chart) {
    var studentChartCollectionFactory = function(student) {
        return new (Backbone.Collection.extend({
            url: '/plea/students/' + student.id + '/charts/',
            model: Chart
        }))();
    };

    return {
        /**
         * Returns a Collection of all Charts related to the given student
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
            var collection = studentChartCollectionFactory(student);
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
 * Data store for DayMetric objects.
 *
 * Provided accessors:
 * - getAllForChart: Returns all DayMetrics for a given chart
 */
angular.module('plea').factory('dayMetricDataStore', function(DayMetric) {
    var chartDayMetricCollectionFactory = function(chart) {
        return new (Backbone.Collection.extend({
            url: '/plea/charts/' + chart.id + '/daymetrics/',
            model: DayMetric
        }))();
    };

    return {
        /**
         * Returns a Collection of all DayMetrics related to the given Chart
         * model. Makes asynchronous call to fetch data; use the callback
         * argument for any code that is dependent on the results of this
         * call.
         *
         * @param  {Chart}  chart
         * @param  {Function} syncCallback      Callback function to run after collection's
         *                                      successful sync to the server. Callback
         *                                      takes one argument: the collection.
         * @return {Collection}
         */
        getAllForChart: function(chart, syncCallback) {
            var collection = chartDayMetricCollectionFactory(chart);
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
 * Data store for PhaseLine objects.
 *
 * Provided accessors:
 * - getAllForChart: Returns all PhaseLines for a given chart
 */
angular.module('plea').factory('phaseLineDataStore', function(PhaseLine) {
    var chartPhaseLineCollectionFactory = function(chart) {
        return new (Backbone.Collection.extend({
            url: '/plea/charts/' + chart.id + '/phaselines/',
            model: PhaseLine
        }))();
    };

    return {
        /**
         * Returns a Collection of all PhaseLine related to the given Chart
         * model. Makes asynchronous call to fetch data; use the callback
         * argument for any code that is dependent on the results of this
         * call.
         *
         * @param  {Chart}  chart
         * @param  {Function} syncCallback      Callback function to run after collection's
         *                                      successful sync to the server. Callback
         *                                      takes one argument: the collection.
         * @return {Collection}
         */
        getAllForChart: function(chart, syncCallback) {
            var collection = chartPhaseLineCollectionFactory(chart);
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

