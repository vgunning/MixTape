
var playlistMenu; // these are the menu containers
var clipMenu;
var bookmarkMenu;

var currentPlaylist; // these are the current item/object
var currentClip;
var currentBookmark;

var currentPlaylistIndex;
var currentBookmarkIndex;
var currentClipIndex;
var playlists = []; // this will hold all the created playlists

$(document).ready(function() {
	playlistMenu = document.getElementById('playlists');
	clipMenu = document.getElementById('clips');
	bookmarkMenu = document.getElementById('bookmarks');

	// set the mode to manage at the page load
	document.getElementById('manageBtn').click();

    // get any params
    if ($.getUrlVar('')) {
    }
});

function setCurrentBookmark(bookmarkIndex){
	if (bookmarkIndex >=  0){
		currentBookmark = currentClip.bookmarks[bookmarkIndex];
	}else{
		currentBookmark = null;
	}
	currentBookmarkIndex = bookmarkIndex;
	return currentBookmark;
}

function setCurrentClip(clipIndex){
	currentClipIndex = clipIndex;
	if (clipIndex >= 0){
		currentClip = currentPlaylist.clips[clipIndex];
		// also set the source to the correct file
		document.getElementById('current-clip').src = 'music/' + currentClip.name + '.mp3';
		if (currentClip.bookmarks.length > 0){
			setCurrentBookmark(0);
		}else{
			setCurrentBookmark(-1);
		}
	}else{
		currentClip = null;
	}	
	
	return currentClip;
}

// this might change for usability, like take a playlistname instead?
function setCurrentPlaylist(playlistIndex){
	if (playlistIndex >= 0){
		currentPlaylist = playlists[playlistIndex];	
		if (currentPlaylist.clips.length > 0){
			setCurrentClip(0);
		}else{
			setCurrentClip(-1);
		}	
	}else{
		currentPlaylist = null;
	}
	currentPlaylistIndex = playlistIndex;
	
	return currentPlaylist;
}


//Author: Gabrielj. Adds bookmarks to bookmark list
function addBookmark(e){
	var start_time = $(inputStartTime).val();
	var end_time = $(inputEndTime).val();
	var array_start_time = start_time.split(":");
	var array_end_time = end_time.split(":");
	console.log(array_end_time[0]);
	console.log(array_end_time[1]);
	if(array_start_time.length != 2 || array_end_time.length != 2 
		|| isNaN(parseInt(array_start_time[0])) || isNaN(parseInt(array_start_time[1]))
		|| isNaN(parseInt(array_end_time[0])) || isNaN(parseInt(array_end_time[1])) )
	{
		$(inputStartTime).val("Format 'minutes:seconds'");
		$(inputEndTime).val("Format 'minutes:seconds'");
	}
	else {
		start_time = parseInt(array_start_time[0])*60*1000 + parseInt(array_start_time[1])*1000; //In milliseconds
		end_time = parseInt(array_end_time[0])*60*1000 + parseInt(array_start_time[1])*1000; //In milliseconds
		if(start_time > 0 && start_time < clip_time_length_ms){
			if(end_time > start_time && end_time < clip_time_length_ms){
				//var new_bookmark = new Bookmark.init_name_time('Bookmark'+currentClip.bookmarks.length+1, start_time, end_time);
				var new_bookmark = new Bookmark.prototype.init_name_times('NewBookmark', start_time, end_time);
				currentClip.addBookmark(new_bookmark);
				updateMenus();
			}
		}
	}
}



// good places to look
// http://www.jque.re/plugins/version3/bootstrap.switch/
// http://www.bootstraptoggle.com/
// http://www.bootply.com/92189 (Manage/Listen)
// http://www.jonathanbriehl.com/2014/01/17/vertical-menu-for-bootstrap-3/ (Vertical Menu)
// http://earmbrust.github.io/bootstrap-window/ (windows for menu/editing?)
// http://startbootstrap.com/template-overviews/simple-sidebar/ (hidden menus)
// http://www.prepbootstrap.com/bootstrap-template/collapsepanels (collapsible?)

// change to the listening mode
function listenMode(){
	console.log('listen');
	// get all the glyphicon-remove
	$('.glyphicon-trash').addClass('glyphicon-play');
	$('.glyphicon-trash').removeClass('glyphicon-trash');
	$('.trash').addClass('play');
	$('.trash').addClass('success');
	$('.trash').removeClass('danger');
	$('.trash').removeClass('trash');

	// toggle the buttons, make active and primary
	$('#manageBtn').removeClass('btn-primary');
	$('#manageBtn').removeClass('active');
	$('#manageBtn').addClass('btn-default');
	$('#listenBtn').addClass('btn-primary');
	$('#listenBtn').addClass('active');
	$('#listenBtn').removeClass('btn-default');

	document.getElementById('bookmark_background_id').style.visibility = "hidden";
	document.getElementById('btnPlay').style.visibility = "visible";
}

// change to the create mode
function manageMode(){
	console.log('manage');
	// get all the glyphicon-remove
	$('.glyphicon-play').addClass('glyphicon-trash');
	$('.glyphicon-play').removeClass('glyphicon-play');
	$('.editor-button').removeClass('glyphicon-trash');
	$('.editor-button').addClass('glyphicon-play');
	$('.play').addClass('trash');
	$('.play').addClass('danger');
	$('.play').removeClass('success');
	$('.play').removeClass('play');

	// toggle the buttons, make active and primary
	$('#listenBtn').removeClass('btn-primary');
	$('#listenBtn').removeClass('active');
	$('#listenBtn').addClass('btn-default');
	$('#manageBtn').addClass('btn-primary');
	$('#manageBtn').addClass('active');
	$('#manageBtn').removeClass('btn-default');

	document.getElementById('bookmark_background_id').style.visibility = "visible";
	document.getElementById('btnPlay').style.visibility = "hidden";
}

function updateMenusCurrentSelection(menu, index){
	var whichMenu = menu.getAttribute('id');

	var selectionIndex = index;
	if (whichMenu == 'bookmarks'){
		setCurrentBookmark(selectionIndex);
	}else if (whichMenu = 'clips'){
		setCurrentClip(selectionIndex);

	}else if (whichMenu == 'playlists'){
		setCurrentPlaylist(selectionIndex);	
		
	}else{
		console.log("This is an error. UpdateCurrentMenus should never get here");
	}
}

// add to the menu a new item
// Needs to be modified!!
function addItemToMenu(menu, item){
	var menuul = menu.children[0].children[1];
	console.log("Adding menus");

	var itemContainer = document.createElement('li');
	var itemText = document.createElement('div');
	var itemSubmenu = document.createElement('ul');
	var itemRemove = document.createElement('a');
	var itemEdit = document.createElement('a');
	var itemRemoveIcon = document.createElement('span');
	var itemEditIcon = document.createElement('span');

	itemText.innerHTML = item.name;
	itemContainer.setAttribute('class', "list-group-item" + " " + item.type);
	itemSubmenu.setAttribute('class', "list-group-submenu");
	itemRemove.setAttribute('class', "list-group-submenu-item trash danger");
	itemEdit.setAttribute('href','#noteContainer');
	itemEdit.setAttribute('data-backdrop','false');
	itemEdit.setAttribute('data-toggle','modal');
	itemEdit.setAttribute('class', "list-group-submenu-item edit primary");
	itemRemoveIcon.setAttribute('class', "glyphicon glyphicon-trash");
	itemEditIcon.setAttribute('class', "glyphicon glyphicon-pencil");
	
	$(itemRemove).click(function(e) {
			// var name = ($(this).text()).trim();
		e.stopPropagation();
		var selection = $(e.currentTarget.offsetParent.offsetParent)
		console.log(selection.index())
		removeItemFromMenu(menu,selection);
		console.log('In cancel');
		
	});
	itemRemove.appendChild(itemRemoveIcon);
	
	itemEdit.appendChild(itemEditIcon);
	addBookmarkEditorFunctionality($(itemEdit));

	itemSubmenu.appendChild(itemEdit);
	itemSubmenu.appendChild(itemRemove);
	
	itemContainer.appendChild(itemText);
	itemContainer.appendChild(itemSubmenu);

	var tag = menu.id + '-' + item.nospace;
	itemContainer.setAttribute('id', tag);
	item.id = tag;
	$(itemContainer).on('click', function(e) {
		deactivate(this);
		makeActive(this);
		console.log('clicked on item');
		console.log(this);
	});

	menuul.appendChild(itemContainer);
}

function makeActive(item){
	// add the active class
	$('#' + item.id).addClass('active');
	// figure out the active class to update
	if(item.classList.contains('playlist')){
		// the things on the playlist menu
		for(var i = 0; i < playlists.length; i++){
			if (item.id == playlists[i].id){
				setCurrentPlaylist(i);
			}
		}
	}
	else if(item.classList.contains('clip')){
		// the things on the clip menu
		for(var i = 0; i < playlists[currentPlaylistIndex].clips.length; i++){
			if (item.id == playlists[currentPlaylistIndex].clips[i].id){
				// set the matching index
				setCurrentClip(i);
			}
		}
	}
	else if(item.classList.contains('bookmark')){
		// the things on the bookmark menu
		for(var i = 0; i < playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks.length; i++){
			if (item.id == playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks[i].id){
				// set the matching index
				setCurrentBookmark(i);
			}
		}
	}
	else{
		console.log('warning');
	}
		
	// update the active index

}

function deactivate(item){
	// figure out which items need to be deactivated
	var type;
	if(item.classList.contains('playlist')){
		type = 'playlist';
	}
	else if(item.classList.contains('clip')){
		type = 'clip';
	}
	else if(item.classList.contains('bookmark')){
		type = 'bookmark';
	}
	else{
		console.log('warning');
	}
	// get the items of that class and make them all not active
	$('.' + type).removeClass('active');
}

function removeItemFromMenu(menu,item){
	var menuul = menu.children[0].children[1];
	var removalIndex = item.index();
	console.log(item);
	// if (removalIndex>=0){
	// 	updateCurrentMenus($(menuul.childNodes[removalIndex-1]));
	// }else{

	// }
	console.log(menuul.childNodes[removalIndex]);
	menuul.removeChild(item[0]);

}

// repopulate the menus with the current items
function updateMenus(){
	$('.list-group-item').remove();
	// iterate through all the playlists and add the clips
	var currentPlaylist = setCurrentPlaylist(currentPlaylistIndex); // assuming for now there is a playlist
	for(var p = 0; p < playlists.length; p++){
		addItemToMenu(playlistMenu, playlists[p]);
	}
	// add all the active clips
	for(var c = 0; c < currentPlaylist.clips.length; c++){
		addItemToMenu(clipMenu, currentPlaylist.clips[c]);
	}
}
