app = angular.module("scotusApp", []);

app.controller("scotusController", ["$scope", "$sce", "$http", function($scope, $sce, $http){

	$http.get("data.json").success(function(data){
		$scope.data = data;
		$scope.majority = [
			{
				name: "JGRoberts"
			},
			{
				name: "AScalia"
			},
			{
				name: "AMKennedy"
			},
			{
				name: "CThomas"
			},
			{
				name: "RBGinsburg"
			},
			{
				name: "SGBreyer"
			},
			{
				name: "SAAlito"
			},
			{
				name: "SSotomayor"
			},
			{
				name: "EKagan"
			}
		];
		
		$scope.dissent = [
		
		];
		
		$scope.select($scope.majority, $scope.dissent);
		
		console.log($scope.data);
		
	});
	
	// Function to narrow down cases based on justice positions
	$scope.select = function(majority, dissent){
		
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
	}
	
}]);

/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
firstBy=function(){function n(n,t){if("function"!=typeof n){var r=n;n=function(n,t){return n[r]<t[r]?-1:n[r]>t[r]?1:0}}return-1===t?function(t,r){return-n(t,r)}:n}function t(t,u){return t=n(t,u),t.thenBy=r,t}function r(r,u){var f=this;return r=n(r,u),t(function(n,t){return f(n,t)||r(n,t)})}return t}();