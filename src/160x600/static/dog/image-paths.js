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
      Url : "img/green.jpg"
    },
    image_url_3 : {
      Url : "img/orange.jpg"
    },
    exit : {
      Url : "http://www.google.com"
    }
  }];
  return devDynamicContent.GDN[0];
}

// TODO: Refactor the above to retain structure but add simplicity.