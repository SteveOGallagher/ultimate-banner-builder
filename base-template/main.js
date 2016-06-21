
var my Object = getDynamicContent();

function onPageLoaded() {    
    var content = getDynamicContent();    
    var name = content.gmc.display_ads_title;
    var description = content.gmc.offer_description;
    
    if (content.theme.is_preprocess) {
      var title = name;
    
      title = title.trim(); // remove white space at start and end
      title = title.replace(/\s{2,}/g, ' '); // remove double white space

      var seperated = title.split(' - '); // create array of title and description strings

      name = seperated[0];
      description = seperated[1];         
    }

    var image = content.gmc.image_link.Url;
    var price = Math.ceil(content.gmc.price.split(' ')[0]).toString();
    
    document.getElementById('background').style.backgroundImage = 'url(\'' + content.theme.background_img.Url + '\')';
    document.getElementById('image').style.cssText = content.theme.image_style;
    document.getElementById('image').style.backgroundImage = 'url(\'' + image + '\')';
    document.getElementById('product').style.cssText = content.theme.product_style1;
    document.getElementById('product-inner').style.cssText = content.theme.product_style2;
    document.getElementById('name').style.cssText = content.theme.name_style;
    document.getElementById('name').innerHTML = name;
    document.getElementById('description').style.cssText = content.theme.description_style;
    document.getElementById('description').innerHTML = description;    
    document.getElementById('price').style.cssText = content.theme.price_style;
    document.getElementById('price').innerHTML = '&pound;' + price;
    document.getElementById('action').style.cssText = content.theme.action_style;
    document.getElementById('action').innerHTML = content.theme.action_text;
    
    document.getElementById('exit').addEventListener('click', function() {
      Enabler.exitOverride('Shop Now', content.gmc.adwords_redirect.Url);  
    });
}