#!/usr/bin/env node

var init = require("./index.js").initMonitor,
	path    = require("path"),
	program = require('commander'),
	color   = require('colorful'),
	fs      = require("fs");


program
	.option('-n, --name [name]', 'config name')
	.option('-i, --init',        'init config file');

program.on('--help', function(){
	console.log('for more : https://github.com/ottomao/anysync');
});

program.parse(process.argv);


//config file
var userHome   = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
	configFile = path.join(userHome,".anysync/","config.json");

//init config.json
if(program.init){

	if(!fs.existsSync(path.join(userHome,".anysync"))){
		fs.mkdirSync( path.join(userHome,".anysync") );
	}

	if(!fs.existsSync(configFile)){
		fs.writeFileSync(configFile,'{\n"configList":[]\n}');
	}

	console.log("config file created!");
	console.log("path: " + configFile);

	process.exit(0);


}else if(program.name){

	//check config file
	if(!fs.existsSync(configFile)){
		console.log(color.red("cannot find config file.") );
		process.exit(0);

	}else{
		var config = require(configFile);

		//init service
		var targetName = program.name,
			success    = false,
			configList = config.configList;

		for(var key in configList){
			var item = configList[key];
			if(item.name == targetName){
				init(item.localDir, item.remoteDir, item.server);
				success = true;
				break;
			}
		}

		if(!success){
			console.log( color.red("no config mathed") );
			console.log('for more : https://github.com/ottomao/anysync');
			process.exit(0);
		}
	}


}else{
	program.help();
	process.exit(0);

}


