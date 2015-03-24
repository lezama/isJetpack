var siteIdButton = document.getElementById( 'siteId' );

chrome.runtime.sendMessage( {
	greeting: "GetSite"
}, function( response ) {
	var site = response.site;
	siteIdButton.innerHTML = site.ID;
} );

siteIdButton.onclick = function() {
	chrome.runtime.sendMessage( {
		type: 'copy',
		text: siteIdButton.innerHTML
	} );
};
