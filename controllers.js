function BaseController($scope, moment, baseViewState) {
    $scope.user_fullname = "Jack Donaghy";
    $scope.date = moment().format('MMMM Do');
    $scope.baseViewState = baseViewState;

    $scope.showBehaviorChart = function() {
        baseViewState.currentView = 'behaviorChart';
    };

    $scope.showPerformanceChart = function(chart) {
        baseViewState.currentView = 'performanceChart';
        baseViewState.currentChart = chart;
    };

    $scope.dateFormat = function(date) {
        return moment(date).format('MM/DD/YY HH:mm');
    };

    $scope.dateAgoFormat = function(date, formatString) {
        return moment(date).fromNow();
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
}


function CellerationChartController($scope, baseViewState, chartService, moment) {
    $scope.student = baseViewState.currentStudent;
    $scope.chart = baseViewState.currentChart;
    
    $scope.dayMetrics = chartService.dayMetricsForChart($scope.chart);
    $scope.phaseLines = chartService.phaseLinesForChart($scope.chart);

    $scope.todayMetricCreated = false;
    $scope.newMetric = function() {
        $scope.dayMetrics.createNewDayMetric(moment().format('YYYY-MM-DD'), 0, $scope.formFloor);
        $scope.dayMetrics.createNewDayMetric(moment().format('YYYY-MM-DD'), 1, $scope.formSuccesses);
        $scope.dayMetrics.createNewDayMetric(moment().format('YYYY-MM-DD'), 2, $scope.formErrors);
        $scope.dayMetrics.createNewDayMetric(moment().format('YYYY-MM-DD'), 3, $scope.formTrials);
        $scope.todayMetricCreated = true;
    }

    $scope.todayPhaseLineCreated = false;
    $scope.newPhaseLine = function() {
        $scope.phaseLines.createNewPhaseLine(moment().format('YYYY-MM-DD'), $scope.formTitle);
        $scope.todayPhaseLineCreated = true;
    }
    
}