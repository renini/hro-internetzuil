// Copyright 2014 Rene Arends. All rights reserved.
// Hogeschool Rotterdam
// HR InternetZuil

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('browser.html', {state: "fullscreen"}, function(win) {
    // The following key events handler will prevent the default behavior for
    // the ESC key, thus will prevent the ESC key to leave fullscreen.
    win.contentWindow.document.addEventListener('keydown', function(e) {
	  if (e.keyCode == 27) // 'ESC'
      e.preventDefault();
    });
    win.contentWindow.document.addEventListener('keyup', function(e) {
	  if (e.keyCode == 27) // 'ESC'
      e.preventDefault();
    });
	
  });
});