angular.module('vuvizApp', [])
  .controller('VuvizController', function() {
    var control = this;
    control.nomApplication = "Prephib";
    control.indices = [
		//Etat Unis
      {nom:'DOW JONES', continent:'Etat-Unis', sectoriel:false, selected: false},
      {nom:'NASDAQ', continent:'Etat-Unis', sectoriel:false, selected:false}];
      {nom:'S&P500', continent:'Etat-Unis', sectoriel:false, selected:false}];
	  //europe
      {nom:'DAX', continent:'Europe', sectoriel:false, selected:false}];
      {nom:'FOOTSIE', continent:'Europe', sectoriel:false, selected:false}];
      {nom:'CAC40', continent:'Europe', sectoriel:false, selected:false}];
      {nom:'IBEX', continent:'Europe', sectoriel:false, selected:false}];
      {nom:'MIB', continent:'Europe', sectoriel:false, selected:false}];
      {nom:'IBEX', continent:'Europe', sectoriel:false, selected:false}];
	  //ASIE
      {nom:'NIKKEI250', continent:'Asie', sectoriel:false, selected:false}];
      {nom:'SSE', continent:'Asie', sectoriel:false, selected:false}];
      {nom:'HS', continent:'Asie', sectoriel:false, selected:false}];
});
