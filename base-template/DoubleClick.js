"use strict";

function getDynamicContent() {

  /* Paste the Google DoubleClick Generated Code for dynamic content below */
  Enabler.setProfileId(1079746);
  var devDynamicContent = {};
  devDynamicContent.SLOPS_160x600= [{}];
  devDynamicContent.SLOPS_160x600[0]._id = 0;
  devDynamicContent.SLOPS_160x600[0].main_image = {};
  devDynamicContent.SLOPS_160x600[0].main_image.Type = "file";
  devDynamicContent.SLOPS_160x600[0].main_image.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/43436498/dirty/bg-chloe-160x600.jpg";
  devDynamicContent.SLOPS_160x600[0].image_url_1 = {};
  devDynamicContent.SLOPS_160x600[0].image_url_1.Type = "file";
  devDynamicContent.SLOPS_160x600[0].image_url_1.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/43412835/dirty/a-trip-160x600.png";
  devDynamicContent.SLOPS_160x600[0].image_url_2 = {};
  devDynamicContent.SLOPS_160x600[0].image_url_2.Type = "file";
  devDynamicContent.SLOPS_160x600[0].image_url_2.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/43342233/dirty/prizes-160x600.png";
  devDynamicContent.SLOPS_160x600[0].image_url_3 = {};
  devDynamicContent.SLOPS_160x600[0].image_url_3.Type = "file";
  devDynamicContent.SLOPS_160x600[0].image_url_3.Url = "https://s0.2mdn.net/ads/richmedia/studio/pv2/43326971/dirty/find-out-more-160x600.png";
  devDynamicContent.SLOPS_160x600[0].image_alt_1 = "Win a trip to New York!";
  devDynamicContent.SLOPS_160x600[0].image_alt_2 = "plus other fantastic prizes!";
  devDynamicContent.SLOPS_160x600[0].image_alt_3 = "Find out more";
  devDynamicContent.SLOPS_160x600[0].terms_copy_1 = "Entry closes 31.7.16. T&C apply";
  devDynamicContent.SLOPS_160x600[0].terms_copy_2 = "The Secret Life of Pets&copy; 2016 Universal Studios. All Rights Reserved.";
  devDynamicContent.SLOPS_160x600[0].exit = {};
  devDynamicContent.SLOPS_160x600[0].exit.Url = "http://www.petsathome.com/";
  Enabler.setDevDynamicContent(devDynamicContent);
  /* END OF GOOGLE DYNAMIC CODE */

  // Replace the below object variable with one matching the above.
  return dynamicContent.SLOPS_160x600[0];
}

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
    )
}

// Attach exit url to bg-exit element
function exitHandler() {
  var dynamicContent = getDynamicContent();
  document.getElementById('bg-exit').addEventListener('click', function() {
    Enabler.exit("clickTag", dynamicContent['exit']);
  });
}