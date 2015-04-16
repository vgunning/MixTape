var musicfiles = ['Clocking-I', 'Clocking-II', 'Foundry-TXST', 'MackeySopSaxCto-1-Prelude', 'MackeySopSaxCto-2-Felt', 'MackeySopSaxCto-3-Metal', 'MackeySopSaxCto-4-Wood', 'MackeySopSaxCto-5-Finale','NightOnFire', 'ShelteringSky-TXST', 'UNCGHymn'];
var fileEnding = '.mp3';
var folder = 'music';
var dialogMenu;

function createDummyItems(){
	// generate the playlists (Doing Playlist 1 & Playlist 2)
	var playlists = [];
	var playlist1 = new Playlist().init_name('Playlist 1');
	var playlist2 = new Playlist().init_name('Playlist 2');
	playlists.push(playlist1);
	playlists.push(playlist2);

	// add clips to the playlists
	for(var p = 0; p < 2; p++){
		// add 3 clips for now
		var playlist = playlists[p];
		for(var i = 0; i < 3; i++){
			var clip = new Clip().init_name_playlist('Clip ' + i.toString(), playlist);
			playlist.addClip(clip);
			console.log(clip.name);
		}
	}
	return playlists;
}

function fillDummyDialog(){
	dialogMenu = document.getElementById('computer-container');
	// delete any old children
	while(dialogMenu.firstChild){
		dialogMenu.removeChild(dialogMenu.firstChild);
	}
	var ul = document.createElement('ul');
	ul.setAttribute('class', 'list-group');
	dialogMenu.appendChild(ul);
	for(var i = 0; i < musicfiles.length; i++){
		// add each of the files
		addItemToDialog(dialogMenu, musicfiles[i], '', 'selectMusic(this)');
	}
}