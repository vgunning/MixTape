// everything that deals mostly with the player dialog is in here

//Gabriel Modification. START



$(document).ready(function() {
    //Gabriel Modifications. START
    var music_clip_window = document.getElementById('music-clip-window');
    var progress_bar = document.getElementById('progress_bar_id');
    var track = document.getElementById('track_id');
    var progress_thumb = document.getElementById('progress_thumb_id');
    var bookmark_btn = document.getElementById('btnBookmark');
	var input_start_time = document.getElementById('inputStartTime');
	var input_end_time = document.getElementById('inputEndTime');

	input_start_time.addEventListener("focus", clearHelpText);
	input_end_time.addEventListener("focus", clearHelpText);
    bookmark_btn.addEventListener('click', addNewBookmark);

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

    	//currentClip = new Clip.prototype.init_name('Current Clip');

    	if(seconds < 10){
    		$(".time_length").html(""+minutes+":0"+seconds);
    	}else{
    		$(".time_length").html(""+minutes+":"+seconds);
    	}

    	$(".time_passed").html("0:00");

    });
	//Gabriel Modifications. END

});

//Gabriel Modification. START

//Author: Gabrielj. Adds bookmarks to bookmark list
function addNewBookmark(e){
	var start_time = $(inputStartTime).val();
	var end_time = $(inputEndTime).val();
	var array_start_time = start_time.split(":");
	var array_end_time = end_time.split(":");
	console.log(array_end_time[0]);
	console.log(array_end_time[1]);
	if(array_start_time.length != 2 || array_end_time.length != 2 
		|| isNaN(parseInt(array_start_time[0])) || isNaN(parseInt(array_start_time[1])) || isNaN(parseInt(array_end_time[0])) || isNaN(parseInt(array_end_time[1])) ){
		$(inputStartTime).val("Format 'mm:ss'");
	$(inputEndTime).val("Format 'mm:ss'");
} else {
		start_time = parseInt(array_start_time[0])*60*1000 + parseInt(array_start_time[1])*1000; //In milliseconds
		end_time = parseInt(array_end_time[0])*60*1000 + parseInt(array_end_time[1])*1000; //In milliseconds
		//console.log(start_time);
		//console.log(end_time);
		if(start_time > 0 && start_time < clip_time_length_ms){
			if(end_time > start_time && end_time < clip_time_length_ms){
				//var new_bookmark = new Bookmark.init_name_time('Bookmark'+currentClip.bookmarks.length+1, start_time, end_time);
				var new_bookmark = new Bookmark.prototype.init_name_times('NewBookmark', start_time, end_time);
				currentClip.addBookmark(new_bookmark);
				updateMenus();
				console.log("Done adding");
			}
		}
	}
}

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
	if(dragging_thumb){
		dragging_thumb = false;
		var clip = document.getElementById('current-clip');
		clip.currentTime = Math.floor(clip_time_played_ms/1000);
		if (playing_clip == true){	
			clip.play();
		}
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
/*
//CLick event for bookmark menu
{
	clip_time_played_ms = currentBookmark.startTime;
	updateTimePassed();
	document.getElementById('current-clip').currentTime = Math.floor(clip_time_played_ms/1000);
}
*/

//Clears the help text from invalid bookmark time input
function clearHelpText(e){
	var target = e.target;
	var value = $(target).val();
	if(value == "Format 'mm:ss'"){
		$(target).val('');
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
		console.log('in toggle play play', clip.currentTime);
		clip.play();
		console.log('Started Playing');
	}

}

function trackTimer() {
	if(clip_time_played_ms >= clip_time_length_ms){
		togglePlay();
		clearInterval(interval_function);
		resetProgressElements();
		console.log('clip time played',clip_time_played_ms, 'trackTimer()')
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


	var clip = document.getElementById('current-clip');
	clip.currentTime = Math.floor(clip_time_played_ms/1000);
	if (playing_clip == true){
		clip.play();
	}
	
}

//Gabriel Modification. END


function setCurrentClipPlayer(){

	document.getElementById('current-clip').src = currentClip.src;
	resetProgressElements();

	if (playing_clip == true){
		// then the pause icon is showing, make it play icon
		$('#btnPlay_icon').toggleClass('glyphicon-play');
		$('#btnPlay_icon').toggleClass('glyphicon-pause');
	}
	
	playing_clip = false;
	clearInterval(interval_function);
	if (clip) {
		clip.pause();
	}
	var clip = document.getElementById('current-clip');

}
