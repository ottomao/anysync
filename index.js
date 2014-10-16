var fsMgmt = require("./fsMgmt"),
	fs     = require("fs"),
	path   = require("path"),
	color  = require('colorful'),
	exec   = require("child_process").exec;


function initMonitor(baseLocal,baseRemote,remoteServ){
	console.log(color.green("local  : ") + baseLocal);
	console.log(color.green("remote : ") + baseRemote);
	console.log(color.green("server : ") + remoteServ);
	console.log("");

	if(!checkPath(baseLocal,baseRemote)){
		console.log("paths do not match. \nexiting....");
		process.exit();
	}else{
		var fsListener = new fsMgmt(baseLocal);
		fsListener.on("fileChange",function(info){
			var localPath    = info.absPath,
				relativePath = path.relative(baseLocal,localPath),
				remotePath   = path.join(baseRemote,relativePath);

			upload(localPath,remotePath,remoteServ);

		});
	}
}


function checkPath(pathA,pathB){
	var pathAList = pathA.split(path.sep),
		pathBList = pathB.split(path.sep);

	try{
		var pathAEnding = pathAList[pathAList.length - 1],
			pathBEnding = pathBList[pathBList.length - 1];

		return pathAEnding == pathBEnding;
	}catch(e){
		console.log("err when checking path");
		console.log(e);
		return false;
	}
}


function upload(local,remote,serv){
	if(!local || !remote || !(typeof local == "string") || !(typeof remote == "string") ){
		throw (new Error("invalid param for upload"));
	}

	var cmd = "rsync __localPath __serv:__remotePath".replace(/__localPath/,local).replace(/__serv/,serv).replace(/__remotePath/,remote);

	exec(cmd,function(err,stdout,stderr){
		if(err){
			console.log(color.red("Syncing failed :"));
			console.log(local);
			console.log(err);
		}else{
			console.log(color.green("Syncing succeed :"));
			console.log(local);
		}
		console.log(new Date());
		console.log(" ");

	});


}

module.exports.initMonitor = initMonitor;