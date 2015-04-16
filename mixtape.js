
var playlistMenu; // these are the menu containers
var clipMenu;
var bookmarkMenu;
var currentPlaylist;
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

    $('.list-group-item').on('mouseover', function(event) {
		event.preventDefault();
		$(this).closest('li').addClass('open');
	});
    $('.list-group-item').on('mouseout', function(event) {
    	event.preventDefault();
		$(this).closest('li').removeClass('open');
	});


    //Gabriel Modifications. START
    var music_clip_window = document.getElementById('music-clip-window');
    var progress_bar = document.getElementById('progress_bar_id');
    var track = document.getElementById('track_id');
    var progress_thumb = document.getElementById('progress_thumb_id');

    progress_thumb.addEventListener('mousedown', startDragging);
    document.addEventListener('mouseup', endDragging);
    track.addEventListener('click', clickTrack);
    progress_bar.addEventListener('click', clickTrack);


    var btnPlay = document.getElementById('btnPlay');
    btnPlay.addEventListener('click', togglePlay);



    var clip = document.getElementById('current-clip');
    clip.loop = false;
    clip.addEventListener('loadedmetadata', function() {
	    clip_time_length_ms = document.getElementById('current-clip').duration*1000;
	    console.log(clip_time_length_ms);
	    var minutes = Math.floor(clip_time_length_ms/(1000*60));
	    var seconds = Math.floor(clip_time_length_ms/1000)%60;
	    
	    if(seconds < 10){
	    	$(".time_length").html(""+minutes+":0"+seconds);
	    }else{
	    	$(".time_length").html(""+minutes+":"+seconds);
	    }

	    $(".time_passed").html("0:00");

    });
    //Gabriel Modifications. END


});

// pull up the playlist dialog
function newPlaylist(){
	$('.modal').modal('show'); // call rachel's playlist dialog
	fillDummyDialog();
}

function savePlaylists(){
	$('.modal').modal('hide'); // close the dialog box
	// TODO: add items from the playlist dialog or create a dumby for now :)
	playlists = createDummyItems();
	updateMenus();
}

// this might change for usability, like take a playlistname instead?
function setCurrentPlaylist(playlistIndex){
	currentPlaylist = playlists[playlistIndex];
	currentPlaylistIndex = playlistIndex;
	return currentPlaylist;
}
function setCurrentClip(clipIndex){
	currentClip = currentPlaylist.clips[clipIndex];
	currentClipIndex = clipIndex;
	return currentClip;
}
function setCurrentBookmark(bookmarkIndex){
	currentBookmark = currentClip.bookmarks[bookmarkIndex];
	currentBookmarkIndex = bookmarkIndex;
	return currentBookmark;
}

function updateCurrentMenus(selection){
	var selectionIndex = selection.index();
	if (selection.hasClass('bookmark')){
		setCurrentBookmark(selectionIndex);
	}else if (selection.hasClass('clip')){
		setCurrentClip(selectionIndex);
		if (currentClip.bookmarks.length > 0){
			setCurrentBookmark(0);
		}else{
			currentBookmark = null;
			currentBookmarIndex = -1;
		}
	}else if (selection.hasClass('playlist')){
		setCurrentPlaylist(selectionIndex);
		if (currentPlaylist.clips.length > 0){
			setCurrentClip(0);
			if (currentClip.bookmarks.lenght > 0){
				setCurrentBookmark(0);
			}else{
				currentBookmark = null;
				currentBookmarIndex = -1;
			}
		}else{
			currentClip = null;
			currentClipIndex = -1;
			currentBookmark = null;
			currentBookmarIndex = -1;
		}		
		
	}else{
		console.log("This is an error. UpdateCurrentMenus should never get here");
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
}

// change to the create mode
function manageMode(){
	console.log('manage');
	// get all the glyphicon-remove
	$('.glyphicon-play').addClass('glyphicon-trash');
	$('.glyphicon-play').removeClass('glyphicon-play');
	$('.play').addClass('trash');
	$('.play').addClass('danger');
	$('.play').removeClass('success');
	$('.play').removeClass('play');
}

// add to the menu a new item
// Needs to be modified!!
function addItemToMenu(menu, item){
	var menuul = menu.children[0].children[1];
	console.log("Adding menus");

	var itemContainer = document.createElement('li');
	var itemText = document.createElement('span');
	var itemSubmenu = document.createElement('ul');
	var itemRemove = document.createElement('li');
	var itemEdit = document.createElement('li');
	var itemRemoveIcon = document.createElement('span');
	var itemEditIcon = document.createElement('span');

	itemText.innerHTML = item.name;
	itemContainer.setAttribute('class', "list-group-item " + item.type);
	itemSubmenu.setAttribute('class', "list-group-submenu");
	itemRemove.setAttribute('class', "list-group-submenu-item trash danger");
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


	itemSubmenu.appendChild(itemRemove);
	itemSubmenu.appendChild(itemEdit);

	itemContainer.appendChild(itemText);
	itemContainer.appendChild(itemSubmenu);

	var tag = menu.id + '-' + item.name;
	itemContainer.setAttribute('id', tag);
	$(itemContainer).on('mouseover', function(event){
		event.preventDefault();
		$(this).closest('li').addClass('open');
	});
	$(itemContainer).on('mouseout', function(event) {
    	event.preventDefault();
		$(this).closest('li').removeClass('open');
	});

	$(itemContainer).on('click', function(e) {
		updateCurrentMenus($(this));
		console.log('clicked on item');
	});

	menuul.appendChild(itemContainer);
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

// toggles the active state of the button passed
// works on the manage/create mode
function toggleMode(button){
	// http://www.bootply.com/92189 (Manage/Listen)
    $(button).find('.btn').toggleClass('active');  
    
    if ($(button).find('.btn-primary').size()>0) {
    	$(button).find('.btn').toggleClass('btn-primary');
    }
    if ($(button).find('.btn-danger').size()>0) {
    	$(button).find('.btn').toggleClass('btn-danger');
    }
    if ($(button).find('.btn-success').size()>0) {
    	$(button).find('.btn').toggleClass('btn-success');
    }
    if ($(button).find('.btn-info').size()>0) {
    	$(button).find('.btn').toggleClass('btn-info');
    }
    
    $(button).find('.btn').toggleClass('btn-default');	
}

// repopulate the menus with the current items
function updateMenus(){
	$('.list-group-item').remove();
	// iterate through all the playlists and add the clips
	var currentPlaylist = setCurrentPlaylist(0); // assuming for now there is a playlist
	for(var p = 0; p < playlists.length; p++){
		addItemToMenu(playlistMenu, playlists[p]);
	}
	// add all the active clips
	for(var c = 0; c < currentPlaylist.clips.length; c++){
		addItemToMenu(clipMenu, currentPlaylist.clips[c]);
	}
}


//Gabriel Modification. START

var dragging_thumb = false;
document.onmousemove = dragProgressElements;

//Sets the variable 'dragging_thumb' to true
function startDragging(e){
	/*
        var parent_pos = $('#content').position();
        var cursor_x = e.clientX-parent_pos.left;
        var cursor_y = e.clientY-parent_pos.top;
        var square_length = 400/board.boardSize;
        var col = Math.floor(cursor_x/square_length);
        var row = Math.floor(cursor_y/square_length);
        //console.log("Col: " + col);
        //console.log("Row: " + row);
        checker_dragged = board.getCheckerAt(row, col);

        img_dragged = document.getElementById(e.target.id);
        //Above the arrows
        img_dragged.style.zIndex = "35";
      */
      	if(playing_clip){
      		togglePlay();
      	}
        dragging_thumb = true;
        console.log("Start dragging");
    }

//Sets the variable 'dragging_thumb' to false
function endDragging(e){
		if(dragging_thumb){
	        dragging_thumb = false;
	        var clip = document.getElementById('current-clip');
			clip.currentTime = Math.floor(clip_time_played_ms/1000);
	        console.log("End dragging");
	    }
    }

//This is for when dragging after having pressed down on the track thumb.
function dragProgressElements(e){
	if(dragging_thumb){
		//console.log("I'm dragging");
		//var parent_pos = $('#music-clip-window').position();
		var parent_pos = $('#music-clip-column').position();
		var new_pos = ''+(e.clientX-parent_pos.left-17);
		//console.log('new_pos: ' + new_pos);
		//console.log('offsetWidth: ' + document.getElementById('track_background_id').offsetWidth);
		var max_width = document.getElementById('track_background_id').offsetWidth;
		if(new_pos < 0){
			document.getElementById('progress_thumb_id').style.left = 0+'px';
			document.getElementById('progress_bar_id').style.width = 0+'px';
		} else if(new_pos > document.getElementById('track_background_id').offsetWidth){
			document.getElementById('progress_thumb_id').style.left = document.getElementById('track_background_id').offsetWidth+'px';
			document.getElementById('progress_bar_id').style.width = document.getElementById('track_background_id').offsetWidth+'px';
		} else {
			document.getElementById('progress_thumb_id').style.left = new_pos+'px';
			document.getElementById('progress_bar_id').style.width = new_pos+'px';
		}
		var current_width = document.getElementById('progress_bar_id').offsetWidth;
		var progress_percent = current_width/max_width;
        clip_time_played_ms = (clip_time_length_ms*progress_percent);
        clip_time_played_ms = Math.floor(clip_time_played_ms/1000)*1000;

        updateTimePassed();
               
	}
}

//Update time_passed
function updateTimePassed(){
    var minutes = Math.floor(clip_time_played_ms/(60*1000));
    var seconds = Math.floor(clip_time_played_ms/1000)%60;
    if(seconds < 10){
    	$(".time_passed").html(""+minutes+":0"+seconds);
    }else{
    	$(".time_passed").html(""+minutes+":"+seconds);
    }
}

function resetProgressElements(){
	document.getElementById('progress_thumb_id').style.left = 0+'px';
	document.getElementById('progress_bar_id').style.width = 0+'px';
	clip_time_played_ms = 0;

	updateTimePassed();
}

function adjustProgressElements(){
	var progress_percent = clip_time_played_ms/clip_time_length_ms;
	//console.log('Percent played: ' + progress_percent);
	document.getElementById('progress_thumb_id').style.left = (document.getElementById('track_background_id').offsetWidth*progress_percent)+'px';
	document.getElementById('progress_bar_id').style.width = (document.getElementById('track_background_id').offsetWidth*progress_percent)+'px';

	updateTimePassed();

}

var playing_clip = false;
var interval_function;
var clip_time_length_ms = 180000;
var clip_time_played_ms = 0; //Time of the currently selected clip, in milliseconds.

//Toggles between playing the selected clip.
function togglePlay(e){
	//var btnPlay_icon = document.getElementById('btnPlay_icon');
	$('#btnPlay_icon').toggleClass('glyphicon-play');
	$('#btnPlay_icon').toggleClass('glyphicon-pause');
	if(playing_clip){
		playing_clip = false;
		clearInterval(interval_function);
		var clip = document.getElementById('current-clip');
		clip.pause();
		console.log('Stopped Playing');
	} else {
		playing_clip = true;
		interval_function = setInterval(function () {trackTimer()}, 250);
		var clip = document.getElementById('current-clip');
		clip.play();
		console.log('Started Playing');
	}

}

function trackTimer() {
	if(clip_time_played_ms >= clip_time_length_ms){
		togglePlay();
		clearInterval(interval_function);
		resetProgressElements();
	} else{
		clip_time_played_ms += 250;
		adjustProgressElements();
	}
	//console.log('Time played in ms: ' + clip_time_played_ms);
}

function clickTrack(e){
	var parent_pos = $('#music-clip-column').position();
	var new_pos = ''+(e.clientX-parent_pos.left-17);
	//console.log('new_pos: ' + new_pos);
	//console.log('offsetWidth: ' + document.getElementById('track_background_id').offsetWidth);
	var max_width = document.getElementById('track_background_id').offsetWidth;
	if(new_pos < 0){
		document.getElementById('progress_thumb_id').style.left = 0+'px';
		document.getElementById('progress_bar_id').style.width = 0+'px';
	} else if(new_pos > document.getElementById('track_background_id').offsetWidth){
		document.getElementById('progress_thumb_id').style.left = document.getElementById('track_background_id').offsetWidth+'px';
		document.getElementById('progress_bar_id').style.width = document.getElementById('track_background_id').offsetWidth+'px';
	} else {
		document.getElementById('progress_thumb_id').style.left = new_pos+'px';
		document.getElementById('progress_bar_id').style.width = new_pos+'px';
	}
	var current_width = document.getElementById('progress_bar_id').offsetWidth;
	var progress_percent = current_width/max_width;
    clip_time_played_ms = (clip_time_length_ms*progress_percent);
    clip_time_played_ms = Math.floor(clip_time_played_ms/1000)*1000;

    updateTimePassed();

    //Must come after updateTimePassed();
    var clip = document.getElementById('current-clip');
	clip.currentTime = Math.floor(clip_time_played_ms/1000);
}

//Gabriel Modification. END
