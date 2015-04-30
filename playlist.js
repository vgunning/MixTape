// everything that is dealing with or updating the new playlist dialog is going in here...

// add to the menu a new item
// Needs to be modified!!
function addItemToDialog(computer, item, matching, func){
	var itemContainer = document.createElement('li');
	var itemText = document.createElement('span');

	itemText.innerHTML = item;
	itemContainer.setAttribute('class', "list-group-item btn btn-default");
	itemContainer.setAttribute('onClick', func);
	itemContainer.setAttribute('id', item.split(' ').join('_') + matching);
	itemContainer.appendChild(itemText);

	computer.appendChild(itemContainer);
}

// toggle it active and also add to the other side of the menu
function selectMusic(button){
	console.log(button);
	$(button).toggleClass('active');  
	button.setAttribute('onClick', 'removeMatching(this)');

	var otherMenu = document.getElementById('added-container');
	addItemToDialog(otherMenu, button.firstChild.innerHTML, '-matching', 'removeMusic(this)');
}

function removeMatching(button){
	document.getElementById(button.id + '-matching').remove();
	$(button).toggleClass('active');
	document.getElementById(button.id).setAttribute('onClick', 'selectMusic(this)');
}

function removeMusic(button){
	button.remove();
	// find partner and toggle the active and give back the function
	var otherid = button.id.split('-');
	otherid.pop();
	otherid = otherid.join('-');
	var otheritem = document.getElementById(otherid);
	otheritem.setAttribute('onClick', 'selectMusic(this)');
	$('#' + otherid).toggleClass('active');
}

// pull up the playlist dialog
function newPlaylist(){
	$('#newPlaylistWindow').modal('show'); // call rachel's playlist dialog
	fillDummyDialog();
}

function savePlaylists(){
	$('#newPlaylistWindow').modal('hide'); // close the dialog box
	// TODO: add items from the playlist dialog or create a dumby for now :)
	var clipsToAdd = document.getElementById('np-clipSource').getElementsByClassName('active btn'); // id has the clip name?
	var playlistName = document.getElementById('recipient-name').value;
	if (playlistName == ''){
		playlistName = 'Playlist ' + (playlists.length + 1).toString();
	}
	document.getElementById('recipient-name').value = '';
	var playlist = new Playlist().init_name(playlistName);
	for (var i = 0; i < clipsToAdd.length; i++){
		var clip = new Clip().init_name_playlist(clipsToAdd[i].textContent, playlist);
		playlist.addClip(clip);
	}
	// add a new playlist for now
	// checking should be implemented
	playlists.push(playlist);
	setCurrentPlaylist(playlists.length - 1);
	setCurrentClip(0);
	updateMenus();
	makeActive(document.getElementById(playlists[playlists.length - 1].id));
	makeActive(document.getElementById(playlists[playlists.length - 1].clips[0].id));
}


// on closing without saving
function clearPlaylistModal(){
	$('#added-container .list-group-item').remove();
	$('#newPlaylistWindow').find('form')[0].reset();
}

