// maintains shared viewstate
app.service('baseViewState', function() {
    this.currentStudent = null;
    this.currentView = null;
    // TODO: doesn't belong here. look into initializing controllers
    this.currentChart = null;
});
