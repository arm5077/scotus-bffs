app = angular.module("scotusApp", ["dndLists"]);

app.controller("scotusController", ["$scope", "$sce", "$http", function($scope, $sce, $http){
	
	document.onselectstart = function(){ return false; }
	
	$scope.Math = Math;
	$scope.hovered = "";
	$scope.years = ['2010','2011','2012','2013','2014']
	$scope.disable = (getParameterByName("disable") == 'true') ? true : false;
	
	console.log($scope.disable);
	
	$scope.justices = {
		"AScalia": {
			name: "AScalia",
			lean: "conservative",
			formatted_name: "Scalia"
		},
		"CThomas": {
			name: "CThomas",
			lean: "conservative",
			formatted_name: "Thomas"
		},
		"JGRoberts": {
			name: "JGRoberts",
			lean: "conservative",
			formatted_name: "Roberts"
		},
		"SAAlito": {
			name: "SAAlito",
			lean: "conservative",
			formatted_name: "Alito"
		},
		"AMKennedy": {
			name: "AMKennedy",
			lean: "independent",
			formatted_name: "Kennedy"
		},
		"EKagan": {
			name: "EKagen",
			lean: "liberal",
			formatted_name: "Kagan"
		},
		"RBGinsburg": {
			name: "RBGinsburg",
			lean: "liberal",
			formatted_name: "Ginsburg"
		},
		"SGBreyer": {
			name: "SGBreyer",
			lean: "liberal",
			formatted_name: "Breyer"
		},
		"SSotomayor": {
			name: "SSotomayor",
			lean: "liberal",
			formatted_name: "Sotomayor"
		}
	};
	

	
	$http.get("data.json").success(function(data){
		$scope.data = data;
		$scope.majority = [
			{
				name: "AScalia",
				lean: "conservative",
				formatted_name: "Scalia"
			},
			{
				name: "CThomas",
				lean: "conservative",
				formatted_name: "Thomas"
			},
			{
				name: "JGRoberts",
				lean: "conservative",
				formatted_name: "Roberts"
				
			},
			{
				name: "SAAlito",
				lean: "conservative",
				formatted_name: "Alito"
			},			
			{
				name: "AMKennedy",
				lean: "independent",
				formatted_name: "Kennedy"
			},
			{
				name: "EKagan",
				lean: "liberal",
				formatted_name: "Kagan"
			},
			{
				name: "RBGinsburg",
				lean: "liberal",
				formatted_name: "Ginsburg"
			},
			{
				name: "SGBreyer",
				lean: "liberal",
				formatted_name: "Breyer"
			},
			{
				name: "SSotomayor",
				lean: "liberal",
				formatted_name: "Sotomayor"
			}
		];
		
		$scope.dissent = [];
		$scope.recuse = [];
		
		// Check URL for presets
		for( name in $scope.justices ){
			if( getParameterByName(name) ){
				console.log($scope.majority.map(function(d){ return d.name }).indexOf(name));
				$scope.majority.splice( $scope.majority.map(function(d){ return d.name }).indexOf(name),1)
				$scope[getParameterByName(name)].push($scope.justices[name]);
			}
		}
		
		$scope.select($scope.majority, $scope.dissent, $scope.recuse);
		
	});
	
	// Function to narrow down cases based on justice positions
	$scope.select = function(majority, dissent, recuse){
		positions = {};
		
		majority.forEach(function(majority){ positions[majority.name] = 'majority' });
		dissent.forEach(function(dissent){ positions[dissent.name] = 'dissent' });
		recuse.forEach(function(recuse){ positions[recuse.name] = 'recuse' });
		
		// Cycle through each case
		$scope.data.forEach(function(datum){
			var qualifies = true;

			// Cycle through justices
			for(justice in positions){
				// commented out datum.justices[justice] != "" &&
				if( datum.justices[justice] != positions[justice] ){
					qualifies = false;
				}
			}
			
			// If you've survived all this with qualifies still true, we'll select you
			datum.selected = (qualifies) ? true : false;
		});
		
		$scope.data.sort(
			firstBy(function(a,b){
				return new Date(a.date) - new Date(b.date);
			})
		);
		
		$scope.backup = {majority: $scope.majority.slice(0), dissent: $scope.dissent.slice(0), recuse: $scope.recuse.slice(0)}
		
		return $scope.data;
	}
	
	$scope.wasSelected = function(datum){
		return datum.selected == true
	}
	
	$scope.setHover = function(court_case){
		$scope.hovered = court_case.name;
		
		if($scope.disable != true){
			$scope.majority.length = 0;
			$scope.dissent.length = 0;
			$scope.recuse.length = 0;
				
			for(name in court_case.justices){
				$scope[court_case.justices[name]].push({
					name: name,
					lean: $scope.justices[name].lean,
					formatted_name: $scope.justices[name].formatted_name,
				});
			}
			$scope.sortPortraits();
		}		
	}
	
	$scope.clearHover = function(){
		$scope.hovered = "";
		
		if($scope.disable != true){
			$scope.majority.length = 0;
			$scope.dissent.length = 0;
			$scope.recuse.length = 0;

			$scope.majority = $scope.backup.majority.slice(0);
			$scope.dissent = $scope.backup.dissent.slice(0);
			$scope.recuse = $scope.backup.recuse.slice(0);	
		}
		
	}
	
	$scope.sortPortraits = function(){
		["majority", "dissent", "rescuse"].forEach(function(type){
			$scope.majority.sort(
				firstBy('lean')
				.thenBy('name')
			);
		})
		
	}
	
}]);

app.directive("stickWithWidth", function() {
	return {
		link: function(scope, element, attr) {
			scope.$watch("data", function(){
				if(scope.data != ""){
					element[0].style.width = element[0].offsetWidth + "px";
				}
				
			});
			
		}
	};	

})

app.directive("portrait", function(){
	return {
		restrict: 'E',
		templateUrl: 'justice_portrait.html'
		
	}
	
});


// Thanks to http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript for this
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
firstBy=function(){function n(n,t){if("function"!=typeof n){var r=n;n=function(n,t){return n[r]<t[r]?-1:n[r]>t[r]?1:0}}return-1===t?function(t,r){return-n(t,r)}:n}function t(t,u){return t=n(t,u),t.thenBy=r,t}function r(r,u){var f=this;return r=n(r,u),t(function(n,t){return f(n,t)||r(n,t)})}return t}();