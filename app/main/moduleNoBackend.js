/**
 * moduleDev.js
 *
 * Alternate 'plea' module initializer that mocks out various http GET calls.
 */

(function() {
  var app = angular.module('plea', ['underscore', 'backbone', 'moment', 'ngMockE2E']);

  var students = [
      {
          "url": "http://127.0.0.1:8000/plea/students/1/",
          "id": 1,
          "first_name": "Lisa",
          "last_name": "Simpson",
          "date_of_birth": "2006-09-19",
          "charts_url": "http://127.0.0.1:8000/plea/students/1/charts/",
          "behavior_types_url": "http://127.0.0.1:8000/plea/students/1/behaviortypes/",
          "behavior_incidents_url": "http://127.0.0.1:8000/plea/students/1/behaviorincidents/"
      },
      {
          "url": "http://127.0.0.1:8000/plea/students/2/",
          "id": 2,
          "first_name": "Milhouse",
          "last_name": "Van Houten",
          "date_of_birth": "2006-03-26",
          "charts_url": "http://127.0.0.1:8000/plea/students/2/charts/",
          "behavior_types_url": "http://127.0.0.1:8000/plea/students/2/behaviortypes/",
          "behavior_incidents_url": "http://127.0.0.1:8000/plea/students/2/behaviorincidents/"
      },
      {
          "url": "http://127.0.0.1:8000/plea/students/3/",
          "id": 3,
          "first_name": "Nelson",
          "last_name": "Muntz",
          "date_of_birth": "2007-02-19",
          "charts_url": "http://127.0.0.1:8000/plea/students/3/charts/",
          "behavior_types_url": "http://127.0.0.1:8000/plea/students/3/behaviortypes/",
          "behavior_incidents_url": "http://127.0.0.1:8000/plea/students/3/behaviorincidents/"
      }
  ];

  var charts = [
      [{"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/", "created_at": "2013-09-11T19:38:27.659Z", "last_opened_at": "2013-09-05T13:36:44Z", "topic": {"id": 2, "url": "http://127.0.0.1:8000/plea/topics/2/", "name": "Language", "menu_order": 1}, "subtopic": {"id": 4, "url": "http://127.0.0.1:8000/plea/subtopics/4/", "name": "1-5 Syllable Words", "menu_order": 3}, "input_channel": {"id": 3, "url": "http://127.0.0.1:8000/plea/input_channels/3/", "name": "Free", "menu_order": 2}, "output_channel": {"id": 2, "url": "http://127.0.0.1:8000/plea/output_channels/2/", "name": "Point", "menu_order": 1}, "label": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}, "day_metrics_url": "http://127.0.0.1:8000/plea/charts/2/daymetrics/", "phase_lines_url": "http://127.0.0.1:8000/plea/charts/2/phaselines/"}, {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/", "created_at": "2013-09-11T19:36:52.985Z", "last_opened_at": "2013-09-04T13:36:44Z", "topic": {"id": 1, "url": "http://127.0.0.1:8000/plea/topics/1/", "name": "Imitation", "menu_order": 0}, "subtopic": {"id": 7, "url": "http://127.0.0.1:8000/plea/subtopics/7/", "name": "Facial Expressions", "menu_order": 0}, "input_channel": {"id": 1, "url": "http://127.0.0.1:8000/plea/input_channels/1/", "name": "See", "menu_order": 0}, "output_channel": {"id": 3, "url": "http://127.0.0.1:8000/plea/output_channels/3/", "name": "Mark", "menu_order": 2}, "label": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}, "day_metrics_url": "http://127.0.0.1:8000/plea/charts/1/daymetrics/", "phase_lines_url": "http://127.0.0.1:8000/plea/charts/1/phaselines/"}],
      [],
      []
  ];

  var scatterplots = [
      [{"id": 1, "url": "http://127.0.0.1:8000/plea/behaviorincidents/1/", "type": {"id": 1, "url": "http://127.0.0.1:8000/plea/behaviortypes/1/", "label": "General Aggression", "code": "A", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-03T15:34:45Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 2, "url": "http://127.0.0.1:8000/plea/behaviorincidents/2/", "type": {"id": 1, "url": "http://127.0.0.1:8000/plea/behaviortypes/1/", "label": "General Aggression", "code": "A", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-03T15:23:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 3, "url": "http://127.0.0.1:8000/plea/behaviorincidents/3/", "type": {"id": 1, "url": "http://127.0.0.1:8000/plea/behaviortypes/1/", "label": "General Aggression", "code": "A", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-03T15:41:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 4, "url": "http://127.0.0.1:8000/plea/behaviorincidents/4/", "type": {"id": 1, "url": "http://127.0.0.1:8000/plea/behaviortypes/1/", "label": "General Aggression", "code": "A", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-03T17:02:00Z", "comment": "punched Milhouse", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 5, "url": "http://127.0.0.1:8000/plea/behaviorincidents/5/", "type": {"id": 1, "url": "http://127.0.0.1:8000/plea/behaviortypes/1/", "label": "General Aggression", "code": "A", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-04T14:24:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 6, "url": "http://127.0.0.1:8000/plea/behaviorincidents/6/", "type": {"id": 1, "url": "http://127.0.0.1:8000/plea/behaviortypes/1/", "label": "General Aggression", "code": "A", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-05T12:44:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 7, "url": "http://127.0.0.1:8000/plea/behaviorincidents/7/", "type": {"id": 2, "url": "http://127.0.0.1:8000/plea/behaviortypes/2/", "label": "Language", "code": "L", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-04T16:56:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 8, "url": "http://127.0.0.1:8000/plea/behaviorincidents/8/", "type": {"id": 2, "url": "http://127.0.0.1:8000/plea/behaviortypes/2/", "label": "Language", "code": "L", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-05T12:56:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 9, "url": "http://127.0.0.1:8000/plea/behaviorincidents/9/", "type": {"id": 3, "url": "http://127.0.0.1:8000/plea/behaviortypes/3/", "label": "Spitting", "code": "S", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-04T13:32:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 10, "url": "http://127.0.0.1:8000/plea/behaviorincidents/10/", "type": {"id": 3, "url": "http://127.0.0.1:8000/plea/behaviortypes/3/", "label": "Spitting", "code": "S", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-04T13:37:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 11, "url": "http://127.0.0.1:8000/plea/behaviorincidents/11/", "type": {"id": 3, "url": "http://127.0.0.1:8000/plea/behaviortypes/3/", "label": "Spitting", "code": "S", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, "occurred_at": "2013-09-04T14:02:00Z", "comment": "", "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}],
      [],
      []
  ];

  var behaviortypes = [
      [{"id": 3, "url": "http://127.0.0.1:8000/plea/behaviortypes/3/", "label": "Spitting", "code": "S", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 2, "url": "http://127.0.0.1:8000/plea/behaviortypes/2/", "label": "Language", "code": "L", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}, {"id": 1, "url": "http://127.0.0.1:8000/plea/behaviortypes/1/", "label": "General Aggression", "code": "A", "active": true, "student": {"id": 1, "url": "http://127.0.0.1:8000/plea/students/1/"}}],
      [],
      []
  ];

  var daymetrics = [
      [{"id": 14, "url": "http://127.0.0.1:8000/plea/daymetrics/14/", "date": "2013-09-03", "value": 3, "type": 0, "chart": {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/"}}, {"id": 15, "url": "http://127.0.0.1:8000/plea/daymetrics/15/", "date": "2013-09-03", "value": 20, "type": 1, "chart": {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/"}}, {"id": 16, "url": "http://127.0.0.1:8000/plea/daymetrics/16/", "date": "2013-09-03", "value": 0, "type": 2, "chart": {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/"}}, {"id": 17, "url": "http://127.0.0.1:8000/plea/daymetrics/17/", "date": "2013-09-03", "value": 2, "type": 3, "chart": {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/"}}, {"id": 19, "url": "http://127.0.0.1:8000/plea/daymetrics/19/", "date": "2013-09-04", "value": 1, "type": 3, "chart": {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/"}}, {"id": 20, "url": "http://127.0.0.1:8000/plea/daymetrics/20/", "date": "2013-09-04", "value": 3, "type": 0, "chart": {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/"}}, {"id": 21, "url": "http://127.0.0.1:8000/plea/daymetrics/21/", "date": "2013-09-04", "value": 25, "type": 1, "chart": {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/"}}, {"id": 22, "url": "http://127.0.0.1:8000/plea/daymetrics/22/", "date": "2013-09-04", "value": 2, "type": 2, "chart": {"id": 1, "url": "http://127.0.0.1:8000/plea/charts/1/"}}],
      [{"id": 2, "url": "http://127.0.0.1:8000/plea/daymetrics/2/", "date": "2013-09-03", "value": 5, "type": 0, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 3, "url": "http://127.0.0.1:8000/plea/daymetrics/3/", "date": "2013-09-03", "value": 45, "type": 1, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 4, "url": "http://127.0.0.1:8000/plea/daymetrics/4/", "date": "2013-09-03", "value": 5, "type": 2, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 5, "url": "http://127.0.0.1:8000/plea/daymetrics/5/", "date": "2013-09-03", "value": 1, "type": 3, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 6, "url": "http://127.0.0.1:8000/plea/daymetrics/6/", "date": "2013-09-04", "value": 5, "type": 0, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 7, "url": "http://127.0.0.1:8000/plea/daymetrics/7/", "date": "2013-09-04", "value": 50, "type": 1, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 8, "url": "http://127.0.0.1:8000/plea/daymetrics/8/", "date": "2013-09-04", "value": 0, "type": 2, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 9, "url": "http://127.0.0.1:8000/plea/daymetrics/9/", "date": "2013-09-04", "value": 1, "type": 3, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 10, "url": "http://127.0.0.1:8000/plea/daymetrics/10/", "date": "2013-09-05", "value": 3, "type": 0, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 11, "url": "http://127.0.0.1:8000/plea/daymetrics/11/", "date": "2013-09-05", "value": 50, "type": 1, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 12, "url": "http://127.0.0.1:8000/plea/daymetrics/12/", "date": "2013-09-05", "value": 2, "type": 2, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}, {"id": 13, "url": "http://127.0.0.1:8000/plea/daymetrics/13/", "date": "2013-09-05", "value": 1, "type": 3, "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}],
  ];

  var phaselines = [
      [],
      [{"id": 1, "title": "drop floor", "date": "2013-09-05", "chart": {"id": 2, "url": "http://127.0.0.1:8000/plea/charts/2/"}}]
  ];

  app.run(function($httpBackend) {
    $httpBackend.whenGET('/plea/students/').respond(students);

    $httpBackend.whenGET('/plea/students/1/charts/').respond(charts[0]);
    $httpBackend.whenGET('/plea/students/2/charts/').respond(charts[1]);
    $httpBackend.whenGET('/plea/students/3/charts/').respond(charts[2]);

    $httpBackend.whenGET('/plea/students/1/behaviorincidents/').respond(scatterplots[0]);
    $httpBackend.whenGET('/plea/students/2/behaviorincidents/').respond(scatterplots[1]);
    $httpBackend.whenGET('/plea/students/3/behaviorincidents/').respond(scatterplots[2]);

    $httpBackend.whenGET('/plea/students/1/behaviortypes/').respond(behaviortypes[0]);
    $httpBackend.whenGET('/plea/students/2/behaviortypes/').respond(behaviortypes[1]);
    $httpBackend.whenGET('/plea/students/3/behaviortypes/').respond(behaviortypes[2]);

    $httpBackend.whenGET('/plea/charts/1/daymetrics/').respond(daymetrics[0]);
    $httpBackend.whenGET('/plea/charts/2/daymetrics/').respond(daymetrics[1]);

    $httpBackend.whenGET('/plea/charts/1/phaselines/').respond(phaselines[0]);
    $httpBackend.whenGET('/plea/charts/2/phaselines/').respond(phaselines[1]);
  });

})();