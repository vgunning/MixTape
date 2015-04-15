// pull up the playlist dialog
function newPlaylist(){
	bootbox.alert('Create A Playlist Dialog Goes Here?');
	var clip = new Clip('First Clip');
	addItemToMenu(playlistMenu, clip);
}

// good places to look
// http://www.jque.re/plugins/version3/bootstrap.switch/
// http://www.bootstraptoggle.com/
// http://www.bootply.com/92189 (Manage/Listen)
// http://www.jonathanbriehl.com/2014/01/17/vertical-menu-for-bootstrap-3/ (Vertical Menu)
// http://earmbrust.github.io/bootstrap-window/ (windows for menu/editing?)

// change to the listening mode
function listenMode(){
	console.log('listen');
}

// change to the create mode
function manageMode(){
	console.log('manage');
}

// add to the menu a new item
function addItemToMenu(menu, item){
	var menuul = menu.children[0];
	var li = document.createElement('li');
	var a = document.createElement('a');
	li.setAttribute('role', 'presentation');
	a.setAttribute('role', 'menuitem');
	a.setAttribute('tabindex', '-1');
	// a.setAttribute('onClick', item.func);
	var tag = menu.id + '-' + item.name;
	a.setAttribute('id', tag);
	a.innerHTML = item.name;
	li.appendChild(a);
	menuul.appendChild(li);
}

// http://www.bootply.com/92189 (Manage/Listen)
function toggleMode(button){
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
        dragging_thumb = true;
        console.log("Start dragging");
    }

//Sets the variable 'dragging_thumb' to false
function endDragging(e){
        dragging_thumb = false;
        console.log("End dragging");
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
        
	}
}

var playing_clip = false;

//Toggles between playing the selected clip.
function togglePlay(e){
	//var btnPlay_icon = document.getElementById('btnPlay_icon');
	$('#btnPlay_icon').toggleClass('glyphicon-play');
	$('#btnPlay_icon').toggleClass('glyphicon-pause');
	if(playing_clip){
		playing_clip = false;
		console.log('Stopped Playing');
	} else {
		playing_clip = true;
		console.log('Started Playing');
	}

}

//Gabriel Modification. END

// the menus
// var playlistMenu;
// var clipMenu;
// var bookmarkMenu;
// $(document).ready(function() {
// 	playlistMenu = document.getElementById('playlist');
// 	clipMenu = document.getElementById('clip');
// 	bookmarkMenu = document.getElementById('bookmark');

//     // get any params
//     if ($.getUrlVar('')) {
//     }


//     //Gabriel Modifications. START
//     var music_clip_window = document.getElementById('music-clip-window');
//     var progress_bar = document.getElementById('progress_bar_id');
//     var progress_thumb = document.getElementById('progress_thumb_id');

//     progress_thumb.addEventListener('mousedown', startDragging);
//     document.addEventListener('mouseup', endDragging);

//     var btnPlay = document.getElementById('btnPlay');
//     btnPlay.addEventListener('click', togglePlay);
//     //Gabriel Modifications. END


// });
   $(function () {
		    $('.list-group-item').on('mouseover', function(event) {
		event.preventDefault();
		$(this).closest('li').addClass('open');
	});
      $('.list-group-item').on('mouseout', function(event) {
    	event.preventDefault();
		$(this).closest('li').removeClass('open');
	});
	});




