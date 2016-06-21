// DIRS
var input_dir = 'clinical_trials_march_2016/';
var output_dir = 'json/';

// PACKAGES
var fs = require('fs')
var rd = require('readdir');
var jf = require('jsonfile');
var xml2js = require('xml2js');

var mongojs = require('mongojs')
var db = mongojs('localhost:27017/clinical', ['study'])
db.study.drop();

//var files = rd.readSync(input_dir, ['**.xml']);
var parser = new xml2js.Parser();

var walk    = require('walk');
var files   = [];

// Walker options
var walker  = walk.walk('./clinical_trials_march_2016', { followLinks: false });
var count = 0;
walker.on('file', function(root, stat, next) {
	// Add this file to the list of files
	console.log(count++ , stat.name);
	writeFile(stat.name);
	next()
});

walker.on('end', function() {
	console.log('end');
});


/*for(i = 0; i < files.length; i++) {
	//var j_file = output_dir + files[i].substring(0, files[i].length - 4) + '.json';
	console.log(i)
	writeFile(i);
}*/

function writeFile(file, next) {
	fs.readFile(input_dir + file, function(err, data) {
		parser.parseString(data, function(err, result) {
		/*	jf.writeFile(j_file, result, function(err) {
				if(err) console.error(err);
				console.log((i + 1) + '.' + j_file);	
			});*/

			result.clinical_study.rank = result.clinical_study["$"].rank;
			delete result.clinical_study["$"];
			db.study.insert(result.clinical_study)
		});
	});
}







