angular.module('plea').service('behaviorIncidentService', function(Backbone, moment, studentService) {
    var BehaviorIncidentType = Backbone.Model.extend({
        /*
            Attibutes:
                id : String
                code : String
                label : String
                active : Boolean
                student : Student or null
         */
        urlRoot: '/plea/behaviortypes/',

        parse: function(response, options) {
            // transform student stub dict into Student model
            response = Backbone.Model.prototype.parse.apply(this, arguments);
            if (response.student) {
                response.student = new studentService.Student(response.student);
            }
            return response;
        }
    });

    // Collection returned by typesForStudent
    var StudentBehaviorTypeCollection = Backbone.Collection.extend({
        model: BehaviorIncidentType,

        initialize: function(models, options) {
            this._student = options.student;
        },

        url: function() {
            return this._student.get('behaviorTypesUrl');
        },

        /**
         * Creates a custom new incident type for a student.
         * @param  {String} label
         * @param  {String} code
         * @return {BehaviorIncidentType}                  
         */
        createIncidentType: function(label, code, options) {
            return this.create({
                label: label,
                code: code,
                student: this._student,
                active: true
            }, options);
        }
    });

    // StudentBehaviorTypeCollection store
    var behaviorTypesStore = {};
    /**
     * Returns a StudentBehaviorTypeCollection with models for the 
     * given student.
     * 
     * @param  {Student} student
     * @param  {String} refresh       should a fetch be performed if 
     *                                collection already exists? 
     *                                default: true
     * 
     * @return {StudentBehaviorTypeCollection}
     */
    var typesForStudent = function(student, refresh) {
        refresh = _.isUndefined(refresh) ? true : refresh;
        if (!behaviorTypesStore[student.id]) {
            behaviorTypesStore[student.id] = new StudentBehaviorTypeCollection([], {
                student: student
            });
            refresh = true;
        }
        if (refresh) {
            behaviorTypesStore[student.id].fetch();
        }
        return behaviorTypesStore[student.id];
    };


    // THURS: START HERE!

    var BehaviorIncident = Backbone.Model.extend({
        /*
            Attributes:
                id : String
                type : BehaviorIncidentType
                occurredAt : Date
                comment : String
                student : Student
         */

        // needed to allow for creating and saving isolated incidents
        urlRoot: '/plea/behaviorincidents/',

        parse: function(response, options) {
            // do basic parsing and case transformation
            response = Backbone.Model.prototype.parse.apply(this, arguments);

            // transform student stub dict into Student model and
            // type dict into (full) BehaviorIncidentType model
            response.student = new studentService.Student(response.student);
            response.type = new BehaviorIncidentType(response.type);

            // parse ISO date string into Date
            response.occurredAt = moment(response.occurredAt).toDate();

            return response;
        }
    });

    // TODO: Be smarter about date range limiting
    var StudentIncidentCollection = Backbone.Collection.extend({
        model: BehaviorIncident,

        initialize: function(models, options) {
            this._student = options.student;
        },

        url: function() {
            return this._student.get('behaviorIncidentsUrl');
        },

        comparator: 'occurredAt',

        /**
         * Wrapper around Collection.create that inserts student into 
         * attributes for new Model. Don't use create directly.
         *  
         * @param  {BehaviorIncidentType} type      
         * @param  {Date} occurredAt 
         * @param  {String} comment   
         * @param  {Object} options             Typical Backbone.create options
         * @return {BehaviorIncident}
         */
        createIncident: function(type, occurredAt, comment, options) {
            // set arugment defaults
            comment = _.isUndefined(comment) ? "" : comment;

            return this.create({
                student: this._student,
                type: type,
                occurredAt: occurredAt,
                comment: comment
            }, options);
        }
    });

    // StudentIncidentCollection store
    var studentIncidentsStore = {};

    /**
     * Returns a StudentIncidentCollection with incidents for the 
     * given student and date.
     * 
     * @param  {Student} student
     * @param  {String} refresh       should a fetch be performed if 
     *                                collection already exists? 
     *                                default: true
     * 
     * @return {StudentIncidentCollection}
     */

    var incidentsForStudent = function(student, refresh) {
        refresh = _.isUndefined(refresh) ? true : refresh;

        if (!studentIncidentsStore[student.id]) {
            studentIncidentsStore[student.id] = new StudentIncidentCollection([], {
                student: student
            });
            refresh = true;
        }
        if (refresh) {
            studentIncidentsStore[student.id].fetch();
        }

        return studentIncidentsStore[student.id];
    };

    this.typesForStudent = typesForStudent;
    this.incidentsForStudent = incidentsForStudent;
});
