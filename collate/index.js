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
				cases[datum.caseId] = {justices: {}, majVotes: datum.majVotes, minVotes: datum.minVotes, date: datum.dateDecision, cite: datum.sctCite, name: datum.caseName};

			
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
		
		for( this_case in cases ){
			if( cases[this_case].minVotes != cases[this_case].majVotes )
				output.push( cases[this_case] );
		}
		
		fs.writeFile("../data.json", JSON.stringify(output), function(err){
			if( err ) throw err;
		})
	});



});



