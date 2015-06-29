app = angular.module("scotusApp", ["dndLists"]);

app.controller("scotusController", ["$scope", "$sce", "$http", function($scope, $sce, $http){
	
	document.onselectstart = function(){ return false; }
	
	$scope.Math = Math;
	$scope.hovered = "";
	$scope.years = ['2010','2011','2012','2013','2014']
	$scope.draggable = (getParameterByName("disable") == true) ? false : true;
	
	$scope.justices = {
		"AScalia": {
			lean: "conservative",
			formatted_name: "Antonin Scalia"
		},
		"CThomas": {
			lean: "conservative",
			formatted_name: "Clarence Thomas"
		},
		"JGRoberts": {
			lean: "conservative",
			formatted_name: "John G. Roberts"
		},
		"SAAlito": {
			lean: "conservative",
			formatted_name: "Samuel A. Alito, Jr."
		},
		"AMKennedy": {
			lean: "independent",
			formatted_name: "Anthony M. Kennedy"
		},
		"EKagan": {
			lean: "liberal",
			formatted_name: "Elena Kagan"
		},
		"RBGinsburg": {
			lean: "liberal",
			formatted_name: "Ruth Bader Ginsburg"
		},
		"SGBreyer": {
			lean: "liberal",
			formatted_name: "Stephen G. Breyer"
		},
		"SSotomayor": {
			lean: "liberal",
			formatted_name: "Sonia Sotomayor"
		}
	};
	

	
	$http.get("data.json").success(function(data){
		$scope.data = data;
		$scope.majority = [
			{
				name: "AScalia",
				lean: "conservative",
				formatted_name: "Antonin Scalia"
			},
			{
				name: "CThomas",
				lean: "conservative",
				formatted_name: "Clarence Thomas"
			},
			{
				name: "JGRoberts",
				lean: "conservative",
				formatted_name: "John G. Roberts"
				
			},
			{
				name: "SAAlito",
				lean: "conservative",
				formatted_name: "Samuel A. Alito, Jr."
			},			
			{
				name: "AMKennedy",
				lean: "independent",
				formatted_name: "Anthony M. Kennedy"
			},
			{
				name: "EKagan",
				lean: "liberal",
				formatted_name: "Elena Kagan"
			},
			{
				name: "RBGinsburg",
				lean: "liberal",
				formatted_name: "Ruth Bader Ginsburg"
			},
			{
				name: "SGBreyer",
				lean: "liberal",
				formatted_name: "Stephen G. Breyer"
			},
			{
				name: "SSotomayor",
				lean: "liberal",
				formatted_name: "Sonia Sotomayor"
			}
		];
		
		$scope.dissent = [];
		$scope.recuse = [];
		
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
	
	$scope.clearHover = function(){
		$scope.hovered = "";
		
			$scope.majority.length = 0;
			$scope.dissent.length = 0;
			$scope.recuse.length = 0;
		
		$scope.majority = $scope.backup.majority.slice(0);
		$scope.dissent = $scope.backup.dissent.slice(0);
		$scope.recuse = $scope.backup.recuse.slice(0);
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