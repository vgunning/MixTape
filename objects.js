// playlist object
function Playlist(){
	this.type = 'playlist';
}
function Playlist(name){
	this.type = 'playlist';
	this.name = name;	
}

// clip object
function Clip(){
	this.type = 'clip';
}
function Clip(name){
	this.type = 'clip';
	this.name = name;
}
function Clip(name, playlist){
	this.type = 'clip';
	this.name = name;
	this.playlist = playlist;
}

// bookmark object