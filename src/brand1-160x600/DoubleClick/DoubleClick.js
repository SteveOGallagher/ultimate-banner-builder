"use strict";
var Enabler;

// Check DoubleClick initializer
function initialize() {
  if (Enabler.isInitialized()) {
    enablerInitHandler();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, checkPageLoaded);
  }
}

// When Enabler is initialized, check that the page has loaded
function checkPageLoaded() {
  Enabler.isPageLoaded() ? politeInit() :
    Enabler.addEventListener(
      studio.events.StudioEvent.PAGE_LOADED,
      politeInit
    );
}

// Attach exit url to bg-exit element
function exitHandler() {
  var dynamicContent = getDynamicContent();
  document.getElementById('bg-exit').addEventListener('click', function() {
    Enabler.exit("clickTag", dynamicContent.exit.Url);
  });
}

// politeInit will run after the page has loaded. Start animations inside this function.
function politeInit() {
  isVisible = false;
  setImages();
  exitHandler();

  if(Enabler.isVisible()){
    onVisible();
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, onVisible);
  }
}

///
///* ONLY THE BELOW CODE SHOULD NEED EDITING *///
///

function getDynamicContent() {
  /* Paste the Google DoubleClick Generated Code for dynamic content below */
  Enabler.setProfileId(1079746);
  var devDynamicContent = {};
  devDynamicContent.SLOPS_160x600= [{}];
  devDynamicContent.SLOPS_160x600[0]._id = 0;
  devDynamicContent.SLOPS_160x600[0].main_image = {};
  devDynamicContent.SLOPS_160x600[0].main_image.Type = "file";
  devDynamicContent.SLOPS_160x600[0].main_image.Url = "http://www.nisbets.co.uk/asset/en/prodimage/medium/cg928-werzalit-square-table-top-dark-red-600mm.jpg";
  devDynamicContent.SLOPS_160x600[0].image_url_1 = {};
  devDynamicContent.SLOPS_160x600[0].image_url_1.Type = "file";
  devDynamicContent.SLOPS_160x600[0].image_url_1.Url = "http://www.continentalsports.co.uk/documents/images/laminate/E17-52.jpg";
  devDynamicContent.SLOPS_160x600[0].image_url_2 = {};
  devDynamicContent.SLOPS_160x600[0].image_url_2.Type = "file";
  devDynamicContent.SLOPS_160x600[0].image_url_2.Url = "http://test.adv-furniture.co.uk/wordpress/wp-content/uploads/2013/02/Green.jpg";
  devDynamicContent.SLOPS_160x600[0].image_url_3 = {};
  devDynamicContent.SLOPS_160x600[0].image_url_3.Type = "file";
  devDynamicContent.SLOPS_160x600[0].image_url_3.Url = "http://www.ralcolours.co.uk/acatalog/ral1007.jpg";
  devDynamicContent.SLOPS_160x600[0].exit = {};
  devDynamicContent.SLOPS_160x600[0].exit.Url = "http://www.petsathome.com/";
  Enabler.setDevDynamicContent(devDynamicContent);
  /* END OF GOOGLE DYNAMIC CODE SNIPPET */

  // Replace the below object variable with the one pasted above.
  return devDynamicContent.SLOPS_160x600[0];
}