angular.module('plea').service('chartService', function(Backbone, studentService) {
    var Topic = Backbone.Model.extend({urlRoot: '/plea/topics/'});
    var Subtopic = Backbone.Model.extend({urlRoot: '/plea/subtopics/'});
    var InputChannel = Backbone.Model.extend({urlRoot: '/plea/input_channels/'});
    var OutputChannel = Backbone.Model.extend({urlRoot: '/plea/output_channels/'});

	var Chart = Backbone.Model.extend({
        /*
            Attibutes:
                id : Integer
                createdAt : Date
                lastOpenedAt : Date
                topic: Topic
                subtopic: Subtopic
                inputChannel: InputChannel
                outputChannel: OutputChannel
                label : String
                student : Student

				dayMetricsUrl: String
				phaseLinesUrl: String
         */
        urlRoot: '/plea/charts/',

        parse: function(response, options) {
            response = Backbone.Model.prototype.parse.apply(this, arguments);

            response.createdAt = moment(response.createdAt).toDate();
            response.lastOpenedAt = moment(response.lastOpenedAt).toDate();

            // TODO: revisit
            response.topic = new Topic(response.topic);
            response.subtopic = new Subtopic(response.subtopic);
            response.inputChannel = new InputChannel(response.inputChannel);
            response.outputChannel = new OutputChannel(response.outputChannel);

			response.student = new studentService.Student(response.student);
            return response;
        }
	});

    var StudentChartCollection = Backbone.Collection.extend({
        model: Chart,

        initialize: function(models, options) {
            this._student = options.student;
        },

        url: function() {
            return this._student.get('chartsUrl');
        }
    });

    // StudentChartCollection store
    studentChartsStore = {};

    var chartsForStudent = function(student, refresh) {
        refresh = _.isUndefined(refresh) ? true : refresh;

        if (!studentChartsStore[student.id]) {
            studentChartsStore[student.id] = new StudentChartCollection([], {
                student: student
            });
            refresh = true;
        }
        if (refresh) {
            studentChartsStore[student.id].fetch();
            // TODO: need to add hooks here to fetch the related models
        }

        return studentChartsStore[student.id];
    };

    var DayMetric = Backbone.Model.extend({
        /*
            Attibutes:
                id : Integer
                date : String (ISO formatted)
                value : Integer
                type: Integer (0: floor, 1: corrects, 2: errors, 3: trials)
                chart: Chart
         */
        urlRoot: '/plea/daymetrics/',

        parse: function(response, options) {
            response = Backbone.Model.prototype.parse.apply(this, arguments);
            response.chart = new Chart(response.chart);
            return response;
        }
    });

    var ChartDayMetricCollection = Backbone.Collection.extend({
        model: DayMetric,
        initialize: function(models, options) {
            this._chart = options.chart;
        },

        url: function() {
            return this._chart.get('dayMetricsUrl');
        },

        createNewDayMetric: function(dateString, typeCode, value, options) {
            return this.create({
                chart: this._chart,
                date: dateString,
                type: typeCode,
                value: value
            }, options);
        }

    })

    var PhaseLine = Backbone.Model.extend({
        /*
            Attibutes:
                id : Integer
                date : String (ISO formatted)
                title : String
                chart: Chart
         */
        urlRoot: '/plea/phaselines/',

        parse: function(response, options) {
            response = Backbone.Model.prototype.parse.apply(this, arguments);
            response.chart = new Chart(response.chart);
            return response;
        }
    });

    var ChartPhaseLineCollection = Backbone.Collection.extend({
        model: PhaseLine,
        initialize: function(models, options) {
            this._chart = options.chart;
        },

        url: function() {
            return this._chart.get('phaseLinesUrl');
        },

        createNewPhaseLine: function(dateString, title, options) {
            return this.create({
                chart: this._chart,
                date: dateString,
                title: title
            }, options);
        }
    });

    chartDayMetricsStore = {};
    chartPhaseLinesStore = {};

    var dayMetricsForChart = function(chart, refresh) {
        refresh = _.isUndefined(refresh) ? true : refresh;

        if (!chartDayMetricsStore[chart.id]) {
            chartDayMetricsStore[chart.id] = new ChartDayMetricCollection([], {
                chart: chart
            });
            refresh = true;
        }
        if (refresh) {
            chartDayMetricsStore[chart.id].fetch();
        }

        return chartDayMetricsStore[chart.id];
    };

    var phaseLinesForChart = function(chart, refresh) {
        refresh = _.isUndefined(refresh) ? true : refresh;

        if (!chartPhaseLinesStore[chart.id]) {
            chartPhaseLinesStore[chart.id] = new ChartPhaseLineCollection([], {
                chart: chart
            });
            refresh = true;
        }
        if (refresh) {
            chartPhaseLinesStore[chart.id].fetch();
        }

        return chartPhaseLinesStore[chart.id];
    };


    this.chartsForStudent = chartsForStudent;
    this.dayMetricsForChart = dayMetricsForChart;
    this.phaseLinesForChart = phaseLinesForChart;
});