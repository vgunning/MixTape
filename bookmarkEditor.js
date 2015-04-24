
	
	//Make all button declarations here or before!
	var bookmark = $('#btnBookmarkEdit');
	addBookmarkEditorFunctionality(bookmark);
	var bookmark2 = $('#btnBookmarkEdit2');
	addBookmarkEditorFunctionality(bookmark2);
	///////////////////////////////////////////////
	
	var SEMAPHORE = 0; 	
	var bookmarkId;
	
	function addBookmarkEditorFunctionality(bookmark){
		
		bookmark.click(function(e) {
		    
		    e.stopPropagation();
		    var caller = $(e.currentTarget.offsetParent.offsetParent);
		    
		    // console.log(bookmarkId);

		    if (caller[0].getAttribute("data-clicked") != "true" && SEMAPHORE==0){
	    		console.log(caller);
	    		popBookmarkEditor(caller);
	    		caller[0].setAttribute("data-clicked","true");
	    		SEMAPHORE = 1;
	    		bookmarkId = caller[0];
		    	
		    }else {
		    	if (bookmarkId==caller[0]){
		    		$('#noteContainer').remove(); 
		    		caller[0].removeAttribute("data-clicked");
		    		SEMAPHORE = 0;
		    	}
		    	
		    }
		    

			$( "#note" )
	        	.resizable({
	      			maxWidth: 250,
	      			maxHeight: 500,
	      			minHeight: 275,
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
			$( "#btnDone" ).button({
				icons: {
					primary: "ui-icon-check"

				},
				text: false
		    });

		    $( "#btnCancel" ).button({
				icons: {
					primary: "ui-icon-close"

				},
				text: false
		    });

		    //When the done button is clicked, the name in the caller button is changed and the editor widget is closed
		    $( "#btnDone" ).click(function(){
				if (checkEmpty("bookmarkName_entry")){
					caller[0].firstChild.innerHTML = ($('#bookmarkName_entry').val());
				}
				$('#noteContainer').remove();
				caller[0].removeAttribute("data-clicked");
				SEMAPHORE = 0;
				//caller.prop('disabled', false);
		    });

		    //The editor widget is closed without changing anything in the bookmark.
		    $( "#btnCancel" ).click(function(){
				$('#noteContainer').remove();
				caller[0].removeAttribute("data-clicked");
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

/**
  * Creates a bookmark note widget. For now it adds it to the end of the html. Ideally we can use the information of the position of the caller
  * to make it appear right next to it.
  * @param {$(Node)} caller is a jquery element that contains the button (or the container of the button) that calls the widget. 
  *					Its text must be the name of the bookmark. 
  */
function popBookmarkEditor(caller) {     	
	var bookmarkName = caller.text();
	var rect = caller.offset();

	var bookmarkTop = rect.top - 10;
	var bookmarkLeft = rect.left + caller.outerWidth() + caller.children('.list-group-submenu').outerWidth();

	console.log(caller.children('.list-group-submenu').outerWidth());

	var bookmarkEditorContainer = document.createElement("div");
	var bookmarkEditor = document.createElement("div");
	var bookmarkNameContainer = document.createElement("h3");
	var bookmarkNameLabel = document.createElement("label");
	var bookmarkNameEditor = document.createElement("input");
	var noteContainer = document.createElement("div");
	var note = document.createElement("textarea");
	var cancelButton = document.createElement("button");
	var doneButton = document.createElement("button");  	

	bookmarkEditorContainer.setAttribute("id","noteContainer");
	// bookmarkEditorContainer.setAttribute("class","modal");
	bookmarkEditorContainer.style.position = "absolute";
	$(bookmarkEditorContainer).offset({ top: bookmarkTop, left: bookmarkLeft});
	console.log(bookmarkLeft);
	console.log(bookmarkEditorContainer.style.left);
	
	bookmarkEditor.setAttribute("id","note");
	bookmarkEditor.setAttribute("class","ui-widget-content");
	$(bookmarkEditor).addClass("effect1");


	bookmarkNameContainer.setAttribute("class","ui-widget-header");

	
	bookmarkNameLabel.setAttribute("id","bookmarkName");
	bookmarkNameLabel.innerHTML =  bookmarkName;

	bookmarkNameEditor.setAttribute("id","bookmarkName_entry");
	bookmarkNameEditor.style.display = "none";

	noteContainer.setAttribute("class","center");
	
	note.setAttribute("id","text");

	cancelButton.innerHTML = "Cancel";
	cancelButton.setAttribute("id","btnCancel");


	doneButton.innerHTML = "Done";
	doneButton.setAttribute("id","btnDone");

	noteContainer.appendChild(note);
	bookmarkNameContainer.appendChild(bookmarkNameLabel);
	bookmarkNameContainer.appendChild(bookmarkNameEditor);
	
	bookmarkEditor.appendChild(bookmarkNameContainer);
	bookmarkEditor.appendChild(noteContainer);
	bookmarkEditor.appendChild(cancelButton);
	bookmarkEditor.appendChild(doneButton);
	bookmarkEditorContainer.appendChild(bookmarkEditor)
	document.body.appendChild(bookmarkEditorContainer);
}

	