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
  var dynamicContent = getContent();
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
/*  Only edit code below this line */
///

function getContent() {

  /* If using Dynamic Content from DoubleClick Studio, replace this code with Generated Dynamic Code.
     Otherwise, edit the devDynamicContent object's properties with the relative paths to images. */

  var devDynamicContent = {};
  devDynamicContent.DoubleClick= [{}];
  devDynamicContent.DoubleClick[0]._id = 0;
  devDynamicContent.DoubleClick[0].dfs_logo = {};
  devDynamicContent.DoubleClick[0].dfs_logo.Url = "img/logo.svg";
  devDynamicContent.DoubleClick[0].message_url = {};
  devDynamicContent.DoubleClick[0].message_url.Url = "img/proud-partners.svg";
  devDynamicContent.DoubleClick[0].gif_url_1 = {};
  devDynamicContent.DoubleClick[0].gif_url_1.Url = "img/1.jpg";
  devDynamicContent.DoubleClick[0].gif_url_2 = {};
  devDynamicContent.DoubleClick[0].gif_url_2.Url = "img/2.jpg";
  devDynamicContent.DoubleClick[0].gif_url_3 = {};
  devDynamicContent.DoubleClick[0].gif_url_3.Url = "img/3.jpg";
  devDynamicContent.DoubleClick[0].gif_url_4 = {};
  devDynamicContent.DoubleClick[0].gif_url_4.Url = "img/4.jpg";
  devDynamicContent.DoubleClick[0].gif_url_5 = {};
  devDynamicContent.DoubleClick[0].gif_url_5.Url = "img/5.jpg";
  devDynamicContent.DoubleClick[0].gif_url_6 = {};
  devDynamicContent.DoubleClick[0].gif_url_6.Url = "img/6.jpg";
  devDynamicContent.DoubleClick[0].gif_url_7 = {};
  devDynamicContent.DoubleClick[0].gif_url_7.Url = "img/7.jpg";
  devDynamicContent.DoubleClick[0].gif_url_8 = {};
  devDynamicContent.DoubleClick[0].gif_url_8.Url = "img/8.jpg";
  devDynamicContent.DoubleClick[0].gif_url_9 = {};
  devDynamicContent.DoubleClick[0].gif_url_9.Url = "img/9.jpg";
  devDynamicContent.DoubleClick[0].endframe_url = {};
  devDynamicContent.DoubleClick[0].endframe_url.Url = "img/endframe.svg";
  devDynamicContent.DoubleClick[0].arrow_url = {};
  devDynamicContent.DoubleClick[0].arrow_url.Url = "img/arrow.svg";
  devDynamicContent.DoubleClick[0].exit = {};
  devDynamicContent.DoubleClick[0].exit.Url = "http://www.dfs.co.uk/content/inspiration-and-help/teamGB/?utm_source=ESI&utm_medium=display&utm_campaign=teamgb";
  Enabler.setDevDynamicContent(devDynamicContent);

  /* End of code to be replaced */

  // If using Dynamic Content from DoubleClick Studio, ensure that the below  variable matches the one in the code directly above.
  return devDynamicContent.DoubleClick[0];
}