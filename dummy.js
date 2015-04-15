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