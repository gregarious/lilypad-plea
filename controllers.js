function BaseController($scope, moment, baseViewState) {
    $scope.user_fullname = "Jack Donaghy";
    $scope.date = moment().format('MMMM Do');
    $scope.baseViewState = baseViewState;

    $scope.showBehaviorChart = function() {
    	baseViewState.currentView = 'behaviorChart';
    };
}

function SidebarController($scope, studentService, baseViewState) {
    $scope.students = studentService.allStudents();

    $scope.selectStudent = function(student) {
        baseViewState.currentStudent = student;
        baseViewState.currentView = 'chartMenu';
    };
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