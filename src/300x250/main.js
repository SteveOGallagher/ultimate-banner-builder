window.onload = initialize();

// Set the content needed to create the banner
var adContent = getContent();

// These variables will later be checked to see if animation can begin.
var isVisible = false;
var isImagesLoaded = false;
var isAnimated = false;

// Set the background images in index.html to those in adContent
function setImages() {
  var images = [];

  for (var image in imageAssignments) {
    document.getElementById(image).style.background = 'url(' + imageAssignments[image] + ')';
    images.push(imageAssignments[image]);
  }
  imgpreload(images, onImagesLoaded); 
}

// Ensure that all images have been downloaded before the animation begins
function imgpreload(imgs, callback) {
  var loaded = 0;
  var images = [];
  imgs = Object.prototype.toString.apply( imgs ) === '[object Array]' ? imgs : [imgs];

  var inc = function() {
    loaded += 1;
    if ( loaded === imgs.length && callback ) {
      callback( images );
    }
  };
  for ( var i = 0; i < imgs.length; i++ ) {
    images[i] = new Image();
    images[i].onabort = inc;
    images[i].onerror = inc;
    images[i].onload = inc;
    images[i].src = imgs[i];
  }
}

// Remobe covering div to reveal ad (called when ready to animate)
function removeCover() {
  document.getElementById('covering-div').className = 'hide';
}

// Called when the ad is visibile in the browser
function onVisible() {
  isVisible = true;
  if (isImagesLoaded && !isAnimated) {
    removeCover();
    animate();
  }
}

// Called when all images have been downloaded
function onImagesLoaded() {
  isImagesLoaded = true;
  if (isVisible && !isAnimated) {
    removeCover();
    animate();
  }
}

///
///* ONLY EDIT THE CODE BELOW THIS LINE *///
///

// 1. Update the imageAssignments object below
//       Keys:    ids corresponding to elements in index.html
//       Values:  properties of adContent from getContent() in doubleclick.js (doubleclick banners) 
//               or image-paths.js (static banners) 

var imageAssignments = {
  'dfs-logo' : adContent.dfs_logo.Url,
  'message' : adContent.message_url.Url,
  'gif1' : adContent.gif_url_1.Url,
  'gif2' : adContent.gif_url_2.Url,
  'gif3' : adContent.gif_url_3.Url,
  'gif4' : adContent.gif_url_4.Url,
  'gif5' : adContent.gif_url_5.Url,
  'gif6' : adContent.gif_url_6.Url,
  'gif7' : adContent.gif_url_7.Url,
  'gif8' : adContent.gif_url_8.Url,
  'gif9' : adContent.gif_url_9.Url,
  'endframe' : adContent.endframe_url.Url,
  'arrow' : adContent.arrow_url.Url
};


// 1. All banner animations should be set in the animate function. Using TweenLite is recommended.
//       TweenLite Documentation: https://www.greensock.com/asdocs/com/greensock/TweenLite.html

function animate() {
  // Show first visibile items
  TweenLite.to(document.getElementById('dfs-logo'), 0.4, { delay: 11, ease: 'easeInOut', opacity: 0 });
  TweenLite.to(document.getElementById('message'), 1, { delay: 10, ease: 'easeInOut', opacity: 0 });
  TweenLite.to(document.getElementById('gif1'), 0.4, { delay: 1.4, ease: 'easeInOut', opacity: 0 });

  // Flip through all gif frames.
  function showFrame (elem, startTime, displayTime) {
    TweenLite.to(document.getElementById(elem), 0.4, { delay: startTime, ease: 'easeInOut', opacity: 1 });
    TweenLite.to(document.getElementById(elem), 0.4, { delay: startTime + displayTime, ease: 'easeInOut', opacity: 0 });
  }

  showFrame('gif2', 1, 1.4);
  showFrame('gif3', 2, 1.4);
  showFrame('gif4', 3, 1.4);
  showFrame('gif5', 4, 1.4);
  showFrame('gif6', 5, 1.4);
  showFrame('gif7', 6, 1.4);
  showFrame('gif8', 7, 1.4);
  showFrame('gif9', 8, 4.4);

  TweenLite.to(document.getElementById('endframe'), 0.8, { delay: 11, ease: 'easeInOut', opacity: 1 });
  TweenLite.to(document.getElementById('arrow'), 0.4, { delay: 11, ease: 'easeInOut', opacity: 1 });

}
