
var playlistMenu; // these are the menu containers
var clipMenu;
var bookmarkMenu;

var currentPlaylist = 0; // these are the current item/object
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

	// get any params
	if ($.getUrlVar('')) {
	}
});


function setCurrentBookmark(bookmarkIndex){
	if (bookmarkIndex >=  0){
		currentBookmark = currentClip.bookmarks[bookmarkIndex];
	}
	else{
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
		if (currentClip.bookmarks.length > 0){
			setCurrentBookmark(0);
		}
		else{
			setCurrentBookmark(-1);
		}
	}
	else{
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
	}
	else{
		currentPlaylist = null;
	}
	currentPlaylistIndex = playlistIndex;
	return currentPlaylist;
}

	// good places to look
	// http://www.jque.re/plugins/version3/bootstrap.switch/
	// http://www.bootstraptoggle.com/
	// http://www.bootply.com/92189 (Manage/Listen)
	// http://www.jonathanbriehl.com/2014/01/17/vertical-menu-for-bootstrap-3/ (Vertical Menu)
	// http://earmbrust.github.io/bootstrap-window/ (windows for menu/editing?)
	// http://startbootstrap.com/template-overviews/simple-sidebar/ (hidden menus)
	// http://www.prepbootstrap.com/bootstrap-template/collapsepanels (collapsible?)


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

	// change it to active if the active current clip or playlist
	if (item == currentPlaylist){
		$('#' + itemContainer.id).addClass('active');
	}
	if (item == currentClip){
		$('#' + itemContainer.id).addClass('active');
	}
	if (item == currentBookmark){
		$('#' + itemContainer.id).addClass('active');
	}
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
	// update the currentIndex
	updateMenus();
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


function updateMenus(){
	$('.list-group-item').remove();
	console.log('update menus');

	// iterate through all the playlists and add the clips
	for(var p = 0; p < playlists.length; p++){
		addItemToMenu(playlistMenu, playlists[p]);
	}
	// add all the active clips
	for(var c = 0; c < currentPlaylist.clips.length; c++){
		addItemToMenu(clipMenu, currentPlaylist.clips[c]);
	}
	//add all the active bookmarks
	for(var b = 0; b < currentClip.bookmarks.length; b++){
		addItemToMenu(bookmarkMenu, currentClip.bookmarks[b]);
	}

	// make things sortable
	$('.list-group').sortable();
	$('.list-group').disableSelection();
	$('.list-group').on('sortupdate', reorderBackend);

}

function reorderBackend(event, ui){
	// figure out which clip has changed position
	var item = ui.item[0];
	var holder;
	// figure out which part of the backend needs to be updated
	if(item.classList.contains('playlist')){
		// the things on the playlist menu
		for(var i = 0; i < playlists.length; i++){
			if (item.id == playlists[i].id){
				// temporarily remove from the old backend list
				holder = playlists.splice(i,1);
				break;
			}
		}
		// insert into the backend where it is now
		var currentOrder = document.getElementById('playlists').getElementsByClassName('playlist');
		for(var i = 0; i < currentOrder.length; i++){
			if(item.id == currentOrder[i].id){
				playlists.splice(i, 0, holder[0]);
				break;
			}
		}

	}
	else if(item.classList.contains('clip')){
		// the things on the clip menu
		for(var i = 0; i < playlists[currentPlaylistIndex].clips.length; i++){
			if (item.id == playlists[currentPlaylistIndex].clips[i].id){
				// temporarily remove from the old backend list
				holder = playlists[currentPlaylistIndex].clips.splice(i,1);
				break;
			}
		}
		// insert into the backend where it is now
		var currentOrder = document.getElementById('clips').getElementsByClassName('clip');
		for(var i = 0; i < currentOrder.length; i++){
			if(item.id == currentOrder[i].id){
				playlists[currentPlaylistIndex].clips.splice(i, 0, holder[0]);
				break;
			}
		}
	}
	else if(item.classList.contains('bookmark')){
		// the things on the bookmark menu
		for(var i = 0; i < playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks.length; i++){
			if (item.id == playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks[i].id){
				// temporarily remove from the old backend list
				holder = playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks.splice(i,1);
				break;
			}
		}
		// insert into the backend where it is now
		var currentOrder = document.getElementById('bookmarks').getElementsByClassName('bookmark');
		for(var i = 0; i < currentOrder.length; i++){
			if(item.id == currentOrder[i].id){
				playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks.splice(i, 0, holder[0])
				break;
			}
		}
	}
	else{
		console.log('warning');
	}
}