angular.module('vuvizApp', [])
  .controller('VuvizController', function() {
    var control = this;
    control.nomApplication = "VuViz";
    control.indices = [
      {nom:'DOW JONES', sectoriel:false, selected: false},
      {nom:'CAC40', sectoriel:false, selected:false}];
});
