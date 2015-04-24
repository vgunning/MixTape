/////////////////////////////////////// I think this is the proper way
// playlist javascript doesn't have constructor overloading
function Playlist(){
	this.type = 'playlist';
}
Playlist.prototype = {
	// all the prototypes functions
	addClip: function(newClip){
		//Should we check for the existence of the clip in the clip list?. What would clip equality be in that case?
		// How does javascript take care of this? I will just check for the name for now. -X
		var canAdd = true;
		for (clip in this.clips){
			if (clip.name == newClip.name){
				canAdd = false;
			}
		} 
		if (canAdd) this.clips.push(newClip);
	},

	removeClip: function(toRemoveClip){
		var index = this.clips.indexOf(toRemoveClip);
		if (index>-1){
    		this.clips.splice(index, 1);
		}
	}
}
// constructor with just the name
Playlist.prototype.init_name = function(name){
	this.name = name;
	this.id = name.split('-').join('').split(' ').join('');
	this.nospace = name.split('-').join('').split(' ').join('');
	this.clips = [];
	return this;
}

// clip object
function Clip(){
	this.type = 'clip';
}

Clip.prototype = {
	// declare all the functions that clip should support to inherit
	addBookmark: function(newBookmark){
		//Should we check for the existence of the clip in the clip list?. What would clip equality be in that case?
		// How does javascript take care of this? I will just check for the name for now. -X
		var canAdd = true;
		for (bookmark in this.bookmarks){
			if (bookmark.name == newBookmark.name){
				canAdd = false;
			}
		} 
		if (cannAdd) this.bookmarks.push(newBookmark);
	},

	removeBookmark: function(toRemoveBookmark){
		var index = this.clips.indexOf(toRemoveBookmark);
		if (index>-1){
    		this.bookmarks.splice(index, 1);
		}
	}
};

Clip.prototype.init_name = function(name){
	this.name = name;
	this.bookmarks = [];
	return this;
}

Clip.prototype.init_name_playlist = function(name, playlist){
	this.name = name;
	this.playlist = playlist; //This is the parent/container playlist.
	//This can possibly be the id that will be given to the corresponding html tag: P<playlist name>C<clip name>B<bookmark name>
	this.id = this.playlist.id + '-' + name.split('-').join('').split(' ').join('');
	this.nospace = name.split('-').join('').split(' ').join('');
	this.bookmarks = [];
	return this;
}

function Bookmark(){
	this.type = 'bookmark';
	this.text = '';
}
Bookmark.prototype = {
	addText: function(newText){
		this.text = newText;
	},

	removeText: function(){
		this.text = "";
	}
}

Bookmark.prototype.init_name = function(name){
	this.name = name;
	return this;
}

Bookmark.prototype.init_name_times = function(name, startTime, endTime){
	this.name = name;
	this.nospace = name.split('-').join('').split(' ').join('');
	this.startTime = startTime;
	this.endTime = endTime;
	return this;
}
Bookmark.prototype.init_name_clip = function(name, clip){
	this.name = name;
	this.nospace = name.split('-').join('').split(' ').join('');
	this.clip = clip;
	//This can possibly be the id that will be given to the corresponding html tag: P<playlist name>C<clip name>B<bookmark name>
	this.id = this.clip.id + '-' + name.split('-').join('').split(' ').join('');
	return this;
}

Bookmark.prototype.init_name_clip_playlist = function(name, clip, playlist){
	this.name = name;
	this.nospace = name.split('-').join('').split(' ').join('');
	this.clip = clip;
	this.playlist = playlist;
	this.id = this.playlist.id + '-' + this.clip.id + '-' + name.split('-').join('').split(' ').join('');
	return this;
}