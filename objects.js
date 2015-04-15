// playlist object
function Playlist(){
	this.type = 'playlist';
}
function Playlist(name){
	this.type = 'playlist';
	this.name = name;
	//This can possibly be the id that will be given to the corresponding html tag: P<playlist name>C<clip name>B<bookmark name>
	this.id = 'P'+name;	
	this.clips = [];

	this.addClip = function(newClip){
		//Should we check for the existence of the clip in the clip list?. What would clip equality be in that case?
		// How does javascript take care of this? I will just check for the name for now. -X
		var canAdd = true;
		for (clip in this.clips){
			if (clip.name == newClip.name){
				canAdd = false;
			}
		} 
		if (cannAdd) this.clips.push(newClip);
	}

	this.removeClip = function(toRemoveClip){
		var index = this.clips.indexOf(toRemoveClip);
		if (index>-1){
    		this.clips.splice(index, 1);
		}

	}

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
	this.playlist = playlist; //This is the parent/container playlist.
	//This can possibly be the id that will be given to the corresponding html tag: P<playlist name>C<clip name>B<bookmark name>
	this.id = this.playlist.id + 'C' + name;
	this.bookmarks = [];

	this.addBookmark = function(newBookmark){
		//Should we check for the existence of the clip in the clip list?. What would clip equality be in that case?
		// How does javascript take care of this? I will just check for the name for now. -X
		var canAdd = true;
		for (bookmark in this.bookmarks){
			if (bookmark.name == newBookmark.name){
				canAdd = false;
			}
		} 
		if (cannAdd) this.bookmarks.push(newBookmark);
	}

	this.removeBookmark = function(toRemoveBookmark){
		var index = this.clips.indexOf(toRemoveBookmark);
		if (index>-1){
    		this.bookmarks.splice(index, 1);
		}

	}

}

// bookmark object

//Do we really need this??
// function Bookmark(){
// 	this.type = 'bookmark';
// }
// function Bookmark(name){
// 	this.type = 'bookmark';
// 	this.name = name;
// }


function Bookmark(name, clip){
	this.type = 'bookmark';
	this.name = name;
	this.clip = clip;
	//This can possibly be the id that will be given to the corresponding html tag: P<playlist name>C<clip name>B<bookmark name>
	this.id = this.clip.id + 'B' + name;
	this.text = "";

	this.addText = function(newText){
		this.text = newText;
	}

	this.removeText = function(){
		this.text = "";
	}


}