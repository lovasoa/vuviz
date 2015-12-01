angular.module('vuvizApp', ["nvd3"])
  .controller('VuvizController', function() {
    var control = this;
    control.nomApplication = "Prévision Financière et Boursière";
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

    control.graph1 = {
      "options" : {
        chart: {
           type: 'lineChart',
           height: 450,
        }
      },
      "donnees" : function() {
        return control.indices_selec().map(function(i) {
            return {
              values : [{x:0,y:i.nom.charCodeAt(0)}, {x:1,y:i.nom.charCodeAt(1)}, {x:2,y:80}],
              key: i.nom,
              color: "#00"+i.nom.charCodeAt(0)+i.nom.charCodeAt(1)
            };
        });
      }
    };

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
