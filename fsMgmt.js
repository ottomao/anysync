var fs   = require("fs"),
	path   = require("path"),
	util   = require("util"),
	events = require("events");
	

function fsMgmt(cwd){
	var self    = this,
		dirList = [cwd];

	traverseFileSystem(cwd,dirList);
	addWatch(dirList,function(info){
		self.emit("fileChange",info);
	});
		
}


function traverseFileSystem(currentPath,result) {
	var result = result || [];
    
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
        var currentFile = currentPath + '/' + files[i];
        var stats = fs.statSync(currentFile);
        if (stats.isDirectory()) {
        	traverseFileSystem(currentFile,result);
			result.push(currentFile);
		}
    }

    return result;
};


function addWatch(dirArr,cb){
	for(var index in dirArr){

		(function(watchDir){
			try{
				fs.watch(watchDir,function(event,filename){
					var absFile = path.join(watchDir,filename);
					var info = {
						absPath :absFile,
						dir     :watchDir,
						filename:filename
					};

					cb && cb.call(null,info);
				});
				
			}catch(e){
				console.log("err in watching");
				console.log(e);
			}

		})(dirArr[index]);
	}
}

util.inherits(fsMgmt, events.EventEmitter);

module.exports = fsMgmt;


