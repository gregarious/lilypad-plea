function BaseController($scope, moment, baseViewState) {
    $scope.user_fullname = "Jack Donaghy";
    $scope.date = moment().format('MMMM Do');
    $scope.baseViewState = baseViewState;
}

function SidebarController($scope, studentService, baseViewState) {
    $scope.students = studentService.allStudents();

    $scope.selectStudent = function(student) {
        baseViewState.currentStudent = student;
        baseViewState.currentView = 'chartMenu';
    };
}