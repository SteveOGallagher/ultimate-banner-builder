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
  var dynamicContent = getDynamicContent();
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

///
///* ONLY THE BELOW CODE SHOULD NEED EDITING *///
///

function getDynamicContent() {
  /* Create your own version of the below object with local references */
  var devDynamicContent = {};
  devDynamicContent.GDN = [{
    main_image : {
      Url : "img/red.jpg"
    },
    image_url_1 : {
      Url : "img/blue.jpg"
    },
    image_url_2 : {
      Url : "img/greenjpg"
    },
    image_url_3 : {
      Url : "img/orange.jpg"
    },
    exit : {
      Url : "http://www.google.com/"
    }
  }];
  return devDynamicContent.GDN[0];
}