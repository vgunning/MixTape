// everything that is dealing with or updating the new playlist dialog is going in here...

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