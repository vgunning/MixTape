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
	var clipsToAdd = document.getElementById('added-container').getElementsByClassName('btn'); // id has the clip name?
	var playlistName = document.getElementById('recipient-name').value;
	if (playlistName == ''){
		playlistName = 'Playlist ' + (playlists.length + 1).toString();
	}
	// check to see if that playlist name already exists
	if (isPlaylistUsed(playlistName)){
		playlistName = playlistName + ' (1)';
	}
	document.getElementById('recipient-name').value = '';
	var playlist = new Playlist().init_name(playlistName);
	for (var i = 0; i < clipsToAdd.length; i++){
		var clip = new Clip().init_name_playlist(clipsToAdd[i].textContent, playlist);
		clip.addSrc('music/' + clip.name + '.mp3');
		playlist.addClip(clip);
	}
	// add a new playlist for now
	// checking should be implemented
	playlists.push(playlist);
	setCurrentPlaylist(playlists.length - 1);
	if (clipsToAdd.length > 0){
		setCurrentClip(0);
	}
	updateMenus();
	makeActive(document.getElementById(playlists[playlists.length - 1].id));
	if (clipsToAdd.length > 0){
		makeActive(document.getElementById(playlists[playlists.length - 1].clips[0].id));
	}
}


// on closing without saving
function clearPlaylistModal(){
	$('#added-container .list-group-item').remove();
	$('#newPlaylistWindow').find('form')[0].reset();
}

////////////////////////////////////////////////////////////////////////
/// editing playlist dialog functions
///////////////////////////////////////////////////////////////////////
function editPlaylist(){
	if(currentPlaylist){
		$('#editPlaylistWindow').modal('show');
		fillDummyEditDialog();
		// put in the current playlist name		
		document.getElementById('edit-playlist-name').value = currentPlaylist.name;
		// add the clips from the current playlist
		if(currentPlaylist.clips){
			for(var i = 0; i < currentPlaylist.clips.length; i++){
				// select the matching clips
				if(sourceClipsContainsName(currentPlaylist.clips[i].name)){
					selectEditMusic(currentPlaylist.clips[i].name);
				}
				else{
					// doesn't have a corresponding clip add to the menu
					var otherMenu = document.getElementById('ep-added-container');
					addItemToDialog(otherMenu, currentPlaylist.clips[i].name, '', 'remove(this)');
				}
			}
		}
	}
}

function sourceClipsContainsName(stringName){
	var isSource = false;
	for(var i = 0; i < musicfiles.length; i++){
		if(musicfiles[i] == stringName){
			isSource = true;
			break;
		}
	}
	return isSource;
}

// toggle it active and also add to the other side of the menu
function selectEditMusic(buttonName){
	if(buttonName.id){
		buttonName = buttonName.id;
	}
	$('#' + buttonName).addClass('active');  
	var button = document.getElementById(buttonName);
	button.setAttribute('onClick', 'removeEditMatching(this)');

	var otherMenu = document.getElementById('ep-added-container');
	addItemToDialog(otherMenu, button.firstChild.innerHTML, '-matching', 'removeMusic(this)');
}

function removeEditMatching(button){
	document.getElementById(button.id + '-matching').remove();
	$(button).toggleClass('active');
	document.getElementById(button.id).setAttribute('onClick', 'selectEditMusic(this)');
}

function saveEdit(){
	// hide the modal
	$('#editPlaylistWindow').modal('hide'); // close the dialog box

	// change the playlist name if different
	if(playlistName != currentPlaylist.name){
		var playlistName = document.getElementById('edit-playlist-name').value;
		if (playlistName == ''){
			playlistName = 'Playlist ' + (playlists.length + 1).toString();
		}
		// check to see if that playlist name already exists
		if (isPlaylistUsed(playlistName)){
			playlistName = playlistName + ' (1)';
		}
		currentPlaylist.updateName(playlistName); 
	}
	document.getElementById('recipient-name').value = '';

	// get the new clip order
	var newClips = [];
	var clips = document.getElementById('ep-added-container').getElementsByClassName('btn');
	if(clips.length > 0){
		for (var i = 0; i < clips.length; i++){
			// check to see if the clip already exists in the playlist (assume it's the same if it is)
			if(playlistContainsClipName(clips[i].id) > -1){
				// get the clip of that name and add
				newClips.push(currentPlaylist[playlistContainsClipName(clips[i].id)]);
			}
			else{
				var clip = new Clip().init_name(clips[i].textContent);
				clip.addSrc('music/' + clip.name + '.mp3');
				newClips.push(clip);
			}

		}
		currentPlaylist.removeAllClips();
		for(var i = 0; i < newClips.length; i++){
			currentPlaylist.addClip(newClips[i]);
		}
		setCurrentClip(0);
		makeActive(document.getElementById(currentClip.id));
	}
	updateMenus();
}

function playlistContainsClipName(clipname){
	var containsClip = -1;
	if(currentPlaylist.clips){
		for(var i = 0; i < currentPlaylist.clips.length; i++){
			if(currentPlaylist.clips[i].name == clipname){
				containsClip = i;
				break;
			}
		}
	}
	return containsClip;
}

function closeEditModal(){
	var container = document.getElementById('ep-computer-container');
	while(container.firstChild){
		container.firstChild.remove();
	}
	container = document.getElementById('ep-added-container');
	while(container.firstChild){
		container.firstChild.remove();
	}
}