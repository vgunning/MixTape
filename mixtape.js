// pull up the playlist dialog
function newPlaylist(){
	bootbox.alert();
	addItemToMenu()
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
	menu.appendChild(li);
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

// the menus
var playlistMenu;
var clipMenu;
var bookmarkMenu;
$(document).ready(function() {
	playlistMenu = document.getElementById('playlist');
	clipMenu = document.getElementById('clip');
	bookmarkMenu = document.getElementById('bookmark');

    // get any params
    if ($.getUrlVar('')) {
    }

});

