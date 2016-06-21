window.onload = initialize();

// Set adContent's properties to equal the content needed to create the banner
var adContent = getDynamicContent();

// Set default values to check later when animation can begin
var isVisible = false;
var isImagesLoaded = false;
var isAnimated = false;

// Update adContent to bandle the image Url subfields
function template() {
  for (var item in adContent) {

    var obj = adContent;

    if (obj[item].Url) {
      adContent[item] = obj[item].Url;
    }
  };
  document.body.innerHTML = hDOM.format(document.body.innerHTML, adContent);
}

// Set the background images in index.html to those in adContent
function setImages() {
  var images = [];

  hDOM('[data-img]').each(function() {
    var img = this.attributes['data-img'].value;
    this.setAttribute('style', 'background: url("' + img + '")');
    images.push(img);
  });

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
  hDOM('#covering-div').addClass('hide');
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

/* Place all code to create ad animations in here */
function animate() {

};