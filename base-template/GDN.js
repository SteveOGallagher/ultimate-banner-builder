// Initialise variables
var clickTag = "";

// Begin animation after a time delay to allow for loading
function politeInit() {
  setTimeout(function() { 
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

  bgExit.addEventListener('click', function() {
    if (clickTag == "") {
      clickTag = dynamicContent['exit']['Url'];
    }
    bgExit.setAttribute('href', clickTag);
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
      Url : "https://s0.2mdn.net/ads/richmedia/studio/pv2/43436498/dirty/bg-chloe-160x600.jpg"
    },
    image_url_1 : {
      Url : "https://s0.2mdn.net/ads/richmedia/studio/pv2/43412835/dirty/a-trip-160x600.png"
    },
    image_url_2 : {
      Url : "https://s0.2mdn.net/ads/richmedia/studio/pv2/43342233/dirty/prizes-160x600.png"
    },
    image_url_3 : {
      Url : "https://s0.2mdn.net/ads/richmedia/studio/pv2/43326971/dirty/find-out-more-160x600.png"
    },
    exit : {
      Url : "http://www.google.com/"
    }

  }];
  // devDynamicContent.GDN[0].main_image.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/43436498/dirty/bg-chloe-160x600.jpg";
  // devDynamicContent.GDN[0].image_url_1.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/43412835/dirty/a-trip-160x600.png";
  // devDynamicContent.GDN[0].image_url_2.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/43342233/dirty/prizes-160x600.png";
  // devDynamicContent.GDN[0].image_url_3.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/43326971/dirty/find-out-more-160x600.png";
  // devDynamicContent.GDN[0].exit.Url = "http://www.google.com/";
  /* END OF GOOGLE DYNAMIC CODE SNIPPET */

  // Replace the below object variable with the one pasted above.
  return devDynamicContent.GDN[0];
}