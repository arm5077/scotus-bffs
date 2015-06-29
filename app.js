app = angular.module("scotusApp", ["dndLists"]);

app.controller("scotusController", ["$scope", "$sce", "$http", function($scope, $sce, $http){
	
	document.onselectstart = function(){ return false; }
	
	$scope.Math = Math;
	$scope.hovered = "";
	
	
	$http.get("data.json").success(function(data){
		$scope.data = data;
		$scope.majority = [
			{
				name: "JGRoberts",
				lean: "conservative",
				formatted_name: "John G. Roberts"
				
			},
			{
				name: "AScalia",
				lean: "conservative",
				formatted_name: "Antonin Scalia"
			},
			{
				name: "AMKennedy",
				lean: "conservative",
				formatted_name: "Anthony M. Kennedy"
			},
			{
				name: "CThomas",
				lean: "conservative",
				formatted_name: "Clarence Thomas"
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
				name: "SAAlito",
				lean: "conservative",
				formatted_name: "Samuel A. Alito, Jr."
			},
			{
				name: "SSotomayor",
				lean: "liberal",
				formatted_name: "Sonia Sotomayor"
			},
			{
				name: "EKagan",
				lean: "liberal",
				formatted_name: "Elena Kagan"
			}
		];
		
		$scope.dissent = [
		
		];
		
		/*
		$scope.$watch('majority',function(){
			$scope.$apply(function(){
				$scope.select($scope.majority, $scope.dissent);
				console.log("Yo");
			});
		});
		*/
		$scope.select($scope.majority, $scope.dissent);
		
	});
	
	// Function to narrow down cases based on justice positions
	$scope.select = function(majority, dissent){
		console.log("doing it");
		positions = {};
		
		majority.forEach(function(majority){ positions[majority.name] = 'majority' });
		dissent.forEach(function(dissent){ positions[dissent.name] = 'dissent' });
		
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
				return b.selected - a.selected;
			})
		);
		
		return $scope.data;
	}
	
	$scope.wasSelected = function(datum){
		return datum.selected == true
	}
	
	$scope.setHover = function(court_case){
		$scope.hovered = court_case.name;
	}
	
	$scope.clearHover = function(){
		$scope.hovered = "";
	}
	
}]);

app.directive("stickWithWidth", function() {
	return {
		link: function(scope, element, attr) {
			scope.$watch("data", function(){
				console.log(data);
				if(scope.data != ""){
					console.log(element[0].offsetWidth);
					element[0].style.width = element[0].offsetWidth + "px";
				}
				
			});
			
		}
	};	

})

/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
firstBy=function(){function n(n,t){if("function"!=typeof n){var r=n;n=function(n,t){return n[r]<t[r]?-1:n[r]>t[r]?1:0}}return-1===t?function(t,r){return-n(t,r)}:n}function t(t,u){return t=n(t,u),t.thenBy=r,t}function r(r,u){var f=this;return r=n(r,u),t(function(n,t){return f(n,t)||r(n,t)})}return t}();