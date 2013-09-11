/**
 * Controller for student selection sidebar.
 */

angular.module('plea').controller('StudentSelectionCtrl', function($scope, studentDataStore, mainViewState) {
    $scope.studentCollection = studentDataStore.getAll(function(collection) {
        // set this once the collection is fetched from the server
        $scope.studentCount = collection.length;
    });

    /**
     * Note the two ways used above to access the collection from a store:
     *
     * 1. The return value. This will be a Backbone Collection object that will
     *    populate itself once the server sync is done. Angular magic will
     *    automatically watch this object for changes and auto-update the
     *    templates to reflect these changes.
     * 2. In a callback function. This will be called once the server sync is
     *    sucessful. You need to use this route if you have code that depends on
     *    the collection being populated.
     *
     * Note that in the callback in example above, collection === $scope.studentCollection.
     * Typically, I'll omit the callback argument and just use the reference
     * from $scope so there's less variable names floating around. I just used
     * it for the sake of example here.
     */

    // this alone will fix the scope variable to 0: see the notes above
    $scope.studentCount = $scope.studentCollection.length;

    $scope.mainViewState = mainViewState;

    $scope.selectStudent = function(student) {
        mainViewState.setSelectedStudent(student);
        // also reset the selected chart
        mainViewState.setSelectedChart(null);
    };
});
