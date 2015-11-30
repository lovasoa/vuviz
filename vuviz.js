angular.module('vuvizApp', [])
  .controller('VuvizController', function() {
    var control = this;
    control.nomApplication = "Prefib";
    control.indices = [
		//Etat Unis
      {nom:'DOW JONES', continent:'État-Unis', sectoriel:false, selected: false},
      {nom:'NASDAQ', continent:'État-Unis', sectoriel:false, selected:false},
      {nom:'S&P500', continent:'État-Unis', sectoriel:false, selected:false},
	  //europe
      {nom:'DAX', continent:'Europe', sectoriel:false, selected:false},
      {nom:'FOOTSIE', continent:'Europe', sectoriel:false, selected:false},
      {nom:'CAC40', continent:'Europe', sectoriel:false, selected:false},
      {nom:'IBEX', continent:'Europe', sectoriel:false, selected:false},
      {nom:'MIB', continent:'Europe', sectoriel:false, selected:false},
      {nom:'IBEX', continent:'Europe', sectoriel:false, selected:false},
	  //ASIE
      {nom:'NIKKEI250', continent:'Asie', sectoriel:false, selected:false},
      {nom:'SSE', continent:'Asie', sectoriel:false, selected:false},
      {nom:'HS', continent:'Asie', sectoriel:false, selected:false}];

    control.aff_sectoriel = false;
    control.aff_continent = "Europe";

    control.continents = function() {
      // Retourne la liste des continents
      return Object.keys(control.indices.reduce(function(continents, indice){
        continents[indice.continent] = true;
        return continents;
      }, {}));
    };

    control.aff_indices = function aff_indices() {
      // Retourne la liste de tous les indices qui correspindent aux critères de recherche
      return control.indices.filter(function(i){
        return i.continent === control.aff_continent && i.sectoriel === control.aff_sectoriel;
      });
    };

    control.indices_selec = function() {
      // Retourne la liste des indices cochés
      return control.indices.filter(function (i) {
        return i.selected;
      });
    }
});