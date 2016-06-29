function getContent() {
  /* Create your own version of the below object with local references */
  var devDynamicContent = {};
  devDynamicContent.GDN = [{
    main_image : {
      Url : "img/blue.jpg"
    },
    image_url_1 : {
      Url : "img/blue.jpg"
    },
    image_url_2 : {
      Url : "img/green.jpg"
    },
    image_url_3 : {
      Url : "img/160x600-purple.jpg"
    },
    exit : {
      Url : "http://www.cohaesus.co.uk"
    }
  }];
  return devDynamicContent.GDN[0];
}

// TODO: Refactor the above to retain structure but add simplicity.