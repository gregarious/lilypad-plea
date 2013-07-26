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
				PhaseLinesUrl: String
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

    this.chartsForStudent = function(student, refresh) {
        refresh = _.isUndefined(refresh) ? true : refresh;

        if (!studentChartsStore[student.id]) {
            coll = studentChartsStore[student.id] = new StudentChartCollection([], {
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
});