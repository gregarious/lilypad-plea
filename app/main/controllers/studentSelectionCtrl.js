/**
 * Controller for student selection sidebar.
 *
 * Note the two ways to access the collection from a store:
 *
 * 1. The return value. This will be a Backbone Collection object that will
 *    populate itself once the server sync is done. Angular magic will
 *    automatically watch this object for changes and auto-update the
 *    templates to reflect these changes.
 * 2. In a callback function. This will be called once the server sync is
 *    sucessful. You need to use this route if you have code that depends on
 *    the collection being populated.
 */
angular.module('pleaMain').controller('StudentSelectionCtrl', function($scope, studentDataStore, mainViewState) {
    $scope.studentCollection = studentDataStore.getAll(function() {
        // set this once the collection is fetched from the server
        $scope.studentCount = $scope.studentCollection.length;
    });

    // this alone will fix the scope variable to 0: see the notes above
    $scope.studentCount = $scope.studentCollection.length;

    $scope.mainViewState = mainViewState;

    $scope.selectStudent = function(student) {
        mainViewState.setSelectedStudent(student);
        // also reset the selected chart
        mainViewState.setSelectedChart(null);
    };
});
