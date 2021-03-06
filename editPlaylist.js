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
	var playlistName = document.getElementById('edit-playlist-name').value;
	if(playlistName != currentPlaylist.name){
		if (playlistName == ''){
			playlistName = 'Playlist ' + (playlists.length + 1).toString();
		}
		// check to see if that playlist name already exists
		if (isPlaylistUsed(playlistName)){
			playlistName = playlistName + '-1';
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
			var temp = clips[i].id.split('-');
			if(playlistContainsClipName(temp.slice(0,temp.length -1).join('-')) > -1){
				// get the clip of that name and add
				newClips.push(currentPlaylist.clips[playlistContainsClipName(temp.slice(0,temp.length -1).join('-'))]);
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