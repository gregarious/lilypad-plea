/**
 * Controller to handle display of a behavior chart (scatterplot).
 */
angular.module('plea').controller('BehaviorCtrl', function($scope, mainViewState, behaviorIncidentDataStore, behaviorTypeDataStore) {
    /**
     * $scope initialization
     */

    $scope.student = mainViewState.selectedStudent;

    // expose the bare incident collections from the data store
    $scope.incidentCollection = behaviorIncidentDataStore.getAllForStudent($scope.student);

    $scope.activeTypes = [];
    // after fetch, go in and filter out non-active types (note that the filter
    // operation yields a basic array, not a collection)
    var typeCollection = behaviorTypeDataStore.getAllForStudent($scope.student, function() {
        $scope.activeTypes = typeCollection.where({'active': true});
    });
});
