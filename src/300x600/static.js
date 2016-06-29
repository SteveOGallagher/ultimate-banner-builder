// Initialise variables
var clickTag = "";

// Begin animation after a time delay to allow for loading
function politeInit() {
  setTimeout(function() { 
    exitHandler();
    setImages();
  }, 500);
  setTimeout(function() { 
    removeCover();
    animate();
  }, 1000);
}

// Attach exit url to bg-exit element
function exitHandler() {
  var dynamicContent = getContent();
  var bgExit = document.getElementById('bg-exit');
  var parent = bgExit.parentNode;
  var anchor = document.createElement('a');
  parent.replaceChild(anchor, bgExit);
  anchor.appendChild(bgExit);

  bgExit.addEventListener('click', function() {
    if (clickTag === "") {
      clickTag = dynamicContent.exit.Url;
    }
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('href', clickTag);
  });
}

// Wait for the DOM to load before initialising banner load
function initialize() {
  if (document.addEventListener) {// For all major browsers, except IE 8 and earlier
    document.addEventListener("DOMContentLoaded", politeInit);
  } else {
    politeInit();
  }
}
