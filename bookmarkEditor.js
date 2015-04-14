
$(document).ready(function() {
	
	$('#btnBookmarkEdit').click(function() {


	    //$('#bookmarkName_entry').val($('#bookmarkName').text())		    
	    var caller = $(this)
	    popBookmarkEditor(caller);


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
				caller.text( $('#bookmarkName_entry').val());
			}
			$('#note').remove();
			caller.prop('disabled', false);
	    });

	    //The editor widget is closed without changing anything in the bookmark.
	    $( "#btnCancel" ).click(function(){
			$('#note').remove();
			caller.prop('disabled', false);
	    });

	    caller.prop('disabled', true);

	});
 	

});

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
	var bookmarkEditor = document.createElement("div");
	var bookmarkNameContainer = document.createElement("h3");
	var bookmarkNameLabel = document.createElement("label");
	var bookmarkNameEditor = document.createElement("input");
	var noteContainer = document.createElement("div");
	var note = document.createElement("textarea");
	var cancelButton = document.createElement("button");
	var doneButton = document.createElement("button");  	

	
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
	document.body.appendChild(bookmarkEditor);
	
}