window.onresize = doLayout;
var isLoading = false;

onload = function() {
  var webview = document.querySelector('webview');
  doLayout();

  document.querySelector('#back').onclick = function() {
    webview.back();
  };

  document.querySelector('#forward').onclick = function() {
    webview.forward();
  };

  document.querySelector('#home').onclick = function() {
    navigateTo('http://internetzuil.hro.nl/');
  };

  document.querySelector('#reload').onclick = function() {
    if (isLoading) {
      webview.stop();
    } else {
      webview.reload();
    }
  };
  document.querySelector('#reload').addEventListener(
    'webkitAnimationIteration',
    function() {
      if (!isLoading) {
        document.body.classList.remove('loading');
      }
    });

  document.querySelector('#terminate').onclick = function() {
    webview.terminate();
  };

  document.querySelector('#location-form').onsubmit = function(e) {
    e.preventDefault();
    navigateTo(document.querySelector('#location').value);
  };

  webview.addEventListener('exit', handleExit);
  webview.addEventListener('loadstart', handleLoadStart);
  webview.addEventListener('loadstop', handleLoadStop);
  webview.addEventListener('loadabort', handleLoadAbort);
  webview.addEventListener('loadredirect', handleLoadRedirect);
  webview.addEventListener('loadcommit', handleLoadCommit);
  
  /* first try to capture new window */
  webview.addEventListener('newwindow', handleNewWindow);
  /*
  webview.addEventListener('newwindow', function(e) {
    var newWebview = document.querySelector('webview');
    //var newWebview = document.createElement('webview');
    //document.body.appendChild(newWebview);
    e.window.attach(newWebview);
  });
  */
  
  /* hide controls if cannot go back so we are on the "homepage" :) */
  /*
  if (!webview.canGoBack()) {
    document.getElementById('controls').style.display = 'none';
  }
  */
};

function handleNewWindow(event) {
  var width = event.initialWidth || 640;
  var height = event.initialHeight || 480;
  event.preventDefault();
  chrome.app.window.create('newwindow.html', {
    top: 0,
    left: 0,
    width: width,
    height: height,
  }, function(newwindow) {
    newwindow.contentWindow.onload = function(e) { 
      var newwebview = newwindow.contentWindow.document.querySelector("webview");
      event.window.attach(newwebview);
    }   
  }); 
}

function navigateTo(url) {
  resetExitedState();
  document.querySelector('webview').src = url;
}

function doLayout() {
  var webview = document.querySelector('webview');
  var controls = document.querySelector('#controls');
  var controlsHeight = controls.offsetHeight;
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var webviewWidth = windowWidth;
  var webviewHeight = windowHeight - controlsHeight;

  webview.style.width = webviewWidth + 'px';
  webview.style.height = webviewHeight + 'px';

  var sadWebview = document.querySelector('#sad-webview');
  sadWebview.style.width = webviewWidth + 'px';
  sadWebview.style.height = webviewHeight * 2/3 + 'px';
  sadWebview.style.paddingTop = webviewHeight/3 + 'px';
}

function handleExit(event) {
  console.log(event.type);
  document.body.classList.add('exited');
  if (event.type == 'abnormal') {
    document.body.classList.add('crashed');
  } else if (event.type == 'killed') {
    document.body.classList.add('killed');
  }
}

function resetExitedState() {
  document.body.classList.remove('exited');
  document.body.classList.remove('crashed');
  document.body.classList.remove('killed');
}

function handleLoadCommit(event) {
  resetExitedState();
  if (!event.isTopLevel) {
    return;
  }

  document.querySelector('#location').value = event.url;

  var webview = document.querySelector('webview');
  document.querySelector('#back').disabled = !webview.canGoBack();
  document.querySelector('#forward').disabled = !webview.canGoForward();
  
  /* hide controls if cannot go back so we are on the "homepage" :) */
  if (!webview.canGoBack()) {
    document.getElementById('controls').setAttribute('class', 'hide');
  } else {
    /*document.getElementById('controls').removeAttribute('class', 'hide');*/
    document.getElementById('controls').setAttribute('class', 'show');
  }
  
}

function handleLoadStart(event) {
  document.body.classList.add('loading');
  isLoading = true;

  resetExitedState();
  if (!event.isTopLevel) {
    return;
  }

  document.querySelector('#location').value = event.url;
}

function handleLoadStop(event) {
  // We don't remove the loading class immediately, instead we let the animation
  // finish, so that the spinner doesn't jerkily reset back to the 0 position.
  isLoading = false;
}

function handleLoadAbort(event) {
  console.log('LoadAbort');
  console.log('  url: ' + event.url);
  console.log('  isTopLevel: ' + event.isTopLevel);
  console.log('  type: ' + event.type);
}

function handleLoadRedirect(event) {
  resetExitedState();
  if (!event.isTopLevel) {
    return;
  }

  document.querySelector('#location').value = event.newUrl;
}
