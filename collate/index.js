var fs = require("fs");
var parse = require('csv-parse');

fs.readFile("data.csv", {encoding: "utf-8"}, function(err, data){
	if(err) throw err;
	
	parse(data, { columns: true }, function(err, data){
		var output = [];
		var cases = {};
		
		// 
		data.forEach(function(datum){
			if( !cases[datum.caseId] )
				cases[datum.caseId] = {
					justices: {}, 
					majVotes: datum.majVotes, 
					minVotes: datum.minVotes, 
					date: datum.dateDecision, 
					cite: datum.sctCite,
					docket: datum.docket, 
					name: datum.caseName
				};

			
			switch(datum.majority){
				case "1":
					majority_or_dissent = "dissent";
				break;
				
				case "2":
					majority_or_dissent = "majority";
				break;
				
				default: 
					majority_or_dissent = "";
				break;
			};
			
			cases[datum.caseId].justices[datum.justiceName] = majority_or_dissent;
		});
		
		textExport = "";

		for( this_case in cases ){
			if( cases[this_case].minVotes != cases[this_case].majVotes ){
				output.push( cases[this_case] );
				textExport += "\"" + cases[this_case].name + "\"," + cases[this_case].justices.JGRoberts + "," + cases[this_case].justices.AScalia + "," + cases[this_case].justices.AMKennedy + "," + cases[this_case].justices.CThomas + "," + cases[this_case].justices.RBGinsburg + "," + cases[this_case].justices.SGBreyer + "," + cases[this_case].justices.SAAlito + "," + cases[this_case].justices.SSotomayor + "," + cases[this_case].justices.EKagan + "\n";
			}
				
		}
	
	
		fs.writeFile("../data.json", JSON.stringify(output), function(err){
			if( err ) throw err;
		});
		
		fs.writeFile("textExport.csv", textExport, function(err){
			if( err ) throw err;
		})

		
	});



});



