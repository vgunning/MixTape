

	
	var SEMAPHORE = 0; 	
	var bookmarkId;
	
	function addBookmarkEditorFunctionality(bookmark){
		
		bookmark.click(function(e) {
		    
		    e.stopPropagation();
		    var caller = $(e.currentTarget.offsetParent.offsetParent);
		    var itemBackEnd = getBackEndItem(caller[0]);
		    
		    // console.log(bookmarkId);
		    // console.log(itemBackEnd);
		    // console.log(bookmarkId);
		    if (!(itemBackEnd.isBeingEdited) && SEMAPHORE==0){
	    		popBookmarkEditor(caller, itemBackEnd);
	    		SEMAPHORE = 1;
	    		deactivate(caller[0]);
				makeActive(caller[0]);
				bookmarkId = itemBackEnd.id;
				// console.log(bookmarkId);
				itemBackEnd.changeIsBeingEdited();	    		
				// caller[0].setAttribute("data-clicked","true");
		    	
		    }else {
		    	if (bookmarkId==itemBackEnd.id){
		    		$('#noteContainer').remove(); 
		    		itemBackEnd.changeIsBeingEdited();
		    		// caller[0].removeAttribute("data-clicked");
		    		SEMAPHORE = 0;
		    	}
		    	
		    }
		    

			$( "#note" )
	        	.resizable({
	      			maxWidth: 250,
	      			maxHeight: 500,
	      			minHeight: 315,
	      			minWidth: 200
	    		})
	        	.draggable();

	        //When the bookmark name is double clicked, it becomes at text field that has the name of the bookmark selected
		    $('#bookmarkName').dblclick(function() {
			    $('#bookmarkName').css('display', 'none');
			    $('#bookmarkName_entry')
			        .val($('#bookmarkName').text())
			        .css('display', '')
			        .select()
			        .focus();
			});

		    //When the bookmark input field looses focus, it changes the name of the bookmark (if the name is not empty)
			$('#bookmarkName_entry').blur(function() {
			    $('#bookmarkName_entry').css('display', 'none');
		        if (checkEmpty("bookmarkName_entry")){
			    	$('#bookmarkName').text($('#bookmarkName_entry').val());
			    }
			        $('#bookmarkName').css('display', '');
			});

			//When enter is pressed on the bookmark name input, it changes the name of the bookmark (if the name is not empty)
			$("#bookmarkName_entry").keypress(function(event) {
		    //13 is the key code for the enter key.
		    if (event.which == 13) {
		        event.preventDefault();
		        $('#bookmarkName_entry').css('display', 'none');
		        if (checkEmpty("bookmarkName_entry")){
			    	$('#bookmarkName').text($('#bookmarkName_entry').val());
			    }
			        $('#bookmarkName').css('display', '');
			    $( "#btnDone" ).focus();
		                                                                      
		    }
		    });

		    //When the done button is clicked, the name in the caller button is changed and the editor widget is closed
		    $( "#btnDone" ).click(function(){
				if (checkEmpty("bookmarkName_entry")){
					caller[0].firstChild.innerHTML = ($('#bookmarkName_entry').val());
					itemBackEnd.updateName($('#bookmarkName_entry').val());
				}
				itemBackEnd.addText($("#text").val());
				$('#noteContainer').remove();
				itemBackEnd.changeIsBeingEdited();
				bookmarkId = itemBackEnd.id;
				SEMAPHORE = 0;
				updateMenus();
				//caller.prop('disabled', false);
		    });

		    //The editor widget is closed without changing anything in the bookmark.
		    $( "#btnCancel" ).click(function(){
				$('#noteContainer').remove();
				itemBackEnd.changeIsBeingEdited();
				SEMAPHORE = 0;
				//caller.prop('disabled', false);

		    });

	    //caller.prop('disabled', true);	    

	});
	}

 	

/**
  * Returns true if the value of element_string is not empty.
  * @param {Node} element_string an input html element that contains the text we want to check
  * Code taken from http://stackoverflow.com/questions/3502354/how-to-check-if-a-textbox-is-empty-using-javascript and modified afterwards.*
  */
function checkEmpty(element_string) { 
	var myString = document.getElementById(element_string).value; 
    if(!myString.match(/\S/)) {
        return false;
    } else {
        return true;
    }
}

function getBackEndItem(item){
	if(item.classList.contains('playlist')){
		// the things on the playlist menu
		for(var i = 0; i < playlists.length; i++){
			if (item.id == playlists[i].id){
				console.log("Playlist found");
				return playlists[i]
			}
		}
	}
	else if(item.classList.contains('clip')){
		// the things on the clip menu
		for(var i = 0; i < playlists[currentPlaylistIndex].clips.length; i++){
			if (item.id == playlists[currentPlaylistIndex].clips[i].id){
				console.log("Clip found");
				return playlists[currentPlaylistIndex].clips[i]
				
			}
		}
	}
	else if(item.classList.contains('bookmark')){
		// the things on the bookmark menu
		for(var i = 0; i < playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks.length; i++){
			if (item.id == playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks[i].id){
				console.log("Bookmark found");
				return playlists[currentPlaylistIndex].clips[currentClipIndex].bookmarks[i]
				
			}
		}
	}
	else{
		console.log('warning');
	}
	
}

/**
  * Creates a bookmark note widget. For now it adds it to the end of the html. Ideally we can use the information of the position of the caller
  * to make it appear right next to it.
  * @param {$(Node)} caller is a jquery element that contains the button (or the container of the button) that calls the widget. 
  *					Its text must be the name of the bookmark. 
  */
function popBookmarkEditor(caller, itemBackEnd) {     	
	var bookmarkName = itemBackEnd.name;
	var rect = caller.offset();

	var bookmarkTop = rect.top - 10;
	var bookmarkLeft = rect.left + caller.outerWidth() + caller.children('.list-group-submenu').outerWidth();

	// console.log(caller.children('.list-group-submenu').outerWidth());

	var bookmarkEditorContainer = document.createElement("div");
	var bookmarkEditor = document.createElement("div");
	var bookmarkNameContainerParent = document.createElement("ul");
	var bookmarkNameContainer = document.createElement("li");
	var bookmarkNameLabel = document.createElement("a");
	var bookmarkNameEditor = document.createElement("input");
	var noteContainer = document.createElement("div");
	var note = document.createElement("textarea");
	var cancelButton = document.createElement("button");
	var doneButton = document.createElement("button");  	

	bookmarkEditorContainer.setAttribute("id","noteContainer");
	bookmarkEditorContainer.style.position = "absolute";
	$(bookmarkEditorContainer).offset({ top: bookmarkTop, left: bookmarkLeft});
	// console.log(bookmarkLeft);
	// console.log(bookmarkEditorContainer.style.left);
	
	bookmarkEditor.setAttribute("id","note");
	$(bookmarkEditor).addClass("effect1");

	bookmarkNameContainerParent.setAttribute("class","nav nav-pills nav-stacked")
	
	bookmarkNameContainer.setAttribute("id","bookmarkNameContainer")
	bookmarkNameContainer.setAttribute("class","active indigo")
	
	bookmarkNameLabel.setAttribute("id","bookmarkName");
	bookmarkNameLabel.innerHTML =  bookmarkName;

	bookmarkNameEditor.setAttribute("id","bookmarkName_entry");
	bookmarkNameEditor.style.display = "none";

	noteContainer.setAttribute("class","center");
	
	note.setAttribute("id","text");
	note.setAttribute('onClick', 'this.select()');
	$(note).val(itemBackEnd.text);

	cancelButton.innerHTML = "Cancel";
	cancelButton.setAttribute("id","btnCancel");
	cancelButton.setAttribute("class","btn");


	doneButton.innerHTML = "Done";
	doneButton.setAttribute("id","btnDone");
	doneButton.setAttribute("class","btn");

	noteContainer.appendChild(note);
	bookmarkNameContainer.appendChild(bookmarkNameLabel);
	bookmarkNameContainer.appendChild(bookmarkNameEditor);
	bookmarkNameContainerParent.appendChild(bookmarkNameContainer);
	
	bookmarkEditor.appendChild(bookmarkNameContainerParent);
	bookmarkEditor.appendChild(noteContainer);
	bookmarkEditor.appendChild(cancelButton);
	bookmarkEditor.appendChild(doneButton);
	bookmarkEditorContainer.appendChild(bookmarkEditor)
	document.body.appendChild(bookmarkEditorContainer);
}

	