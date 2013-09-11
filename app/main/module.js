// declare the core app `pleaMain` module
angular.module('pleaMain', ['pleaCommon', 'pleaStudents', 'pleaCharts', 'pleaBehaviors']);

/*
Holding controller.js code from before reorganization

function BaseController($scope, moment, baseViewState) {
    $scope.user_fullname = "Jack Donaghy";
    $scope.date = moment().format('MMMM Do');
    $scope.baseViewState = baseViewState;

    $scope.showBehaviorChart = function() {
        baseViewState.currentView = 'behaviorChart';
    };

    $scope.showPerformanceChart = function(chart) {
        baseViewState.currentView = 'performanceChart';
    };
}

function SidebarController($scope, studentService, baseViewState) {
    $scope.students = studentService.allStudents();

    $scope.selectStudent = function(student) {
        baseViewState.currentStudent = student;
        baseViewState.currentView = 'chartMenu';
    };
}

function ChartsMenu($scope, chartService, baseViewState) {
    $scope.student = baseViewState.currentStudent;
    $scope.charts = chartService.chartsForStudent($scope.student, false);
}

function ScatterplotController($scope, baseViewState, behaviorIncidentService) {
	$scope.student = baseViewState.currentStudent;
	$scope.incidents = behaviorIncidentService.incidentsForStudent($scope.student, false);
	$scope.types = behaviorIncidentService.typesForStudent($scope.student, false);

	$scope.createIncident = function(type) {
		$scope.incidents.createIncident(type, new Date());
	};

	$scope.dateFormat = function(date) {
		return moment(date).format('MM/DD/YY HH:mm');
	};
}
*/