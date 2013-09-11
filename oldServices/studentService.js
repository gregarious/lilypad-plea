angular.module('plea').service('studentService', function(Backbone){
    var Student = Backbone.Model.extend({
        /* 
            Attributes:
                id : Integer
                url : String
                firstName : String 
                lastName : String
                dateOfBirth : String (ISO format)

                chartsUrl : String
                behaviorTypesUrl : String
                behaviorIncidentsUrl : String
        */

        urlRoot: '/pace/students/',

        toJSON: function() {
            // camelize the data keys first
            var data = Backbone.Model.prototype.toJSON.apply(this, arguments);

            // don't want to send isPresent or relation urls in requests
            delete data['charts_url'];
            delete data['behavior_types_url'];
            delete data['behavior_incidents_url'];

            return data;
        }
    });

    var StudentCollection = Backbone.Collection.extend({
        model: Student,
        url: '/plea/students'
    });

    var allStudents = function() {
        s = new StudentCollection();
        s.fetch();
        return s;
    };

    /** Public interface of service **/

    this.allStudents = allStudents;
    this.Student = Student;
});
