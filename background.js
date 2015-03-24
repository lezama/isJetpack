var sitesByTab = {};

chrome.tabs.onUpdated.addListener( showPageActionIfJetpackSite );

function showPageActionIfJetpackSite( tabId, changeInfo, tab ) {
	var url, xhr;
	if ( changeInfo.status !== 'loading' ) {
		return;
	}

	// Remove Protocol
	url = tab.url.replace( /^.*?:\/\//, '' );

	// unTrailingSlashIt
	url = url.replace( /\/$/, '' );

	// replace / with ::
	url = url.replace( /::/g, '/' );

	xhr = new XMLHttpRequest();
	xhr.open( 'GET', 'https://public-api.wordpress.com/rest/v1.1/sites/' + url );
	xhr.onreadystatechange = function() {
		var site;
		if ( xhr.readyState == 4 && xhr.status !== 404 ) {
			site = JSON.parse( xhr.responseText );
			if ( site.jetpack ) {
				showPageAction( tabId, site );
			}
		}
	}
	xhr.send();
}

function showPageAction( tabId, site ) {
	sitesByTab[ tabId ] = site;
	chrome.pageAction.setPopup( {
		tabId: tabId,
		popup: 'popup.html'
	} );
	chrome.pageAction.show( tabId );
}

chrome.runtime.onMessage.addListener( function( request, sender, sendResponse ) {
	if ( request.greeting === "GetSite" ) {
		chrome.tabs.getSelected( null, function( tab ) {
			sendResponse( {
				site: sitesByTab[ tab.id ]
			} );
		} );
		return true;
	}
} );

chrome.runtime.onMessage.addListener( function( message ) {
	if ( message && message.type == 'copy' ) {
		var input = document.createElement( 'textarea' );
		document.body.appendChild( input );
		input.value = message.text;
		input.focus();
		input.select();
		document.execCommand( 'Copy' );
		input.remove();
	}
} );
