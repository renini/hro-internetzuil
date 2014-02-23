// Copyright 2014 Rene Arends. All rights reserved.
// Hogeschool Rotterdam
// HR InternetZuil

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('browser.html', {state: "fullscreen"}, function(win) {
  });
});