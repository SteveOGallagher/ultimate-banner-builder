window.onload = initialize();

// Set adContent's properties to equal the content needed to create the banner
var adContent = getDynamicContent();

// Set default values to check later when animation can begin
var isVisible = false;
var isImagesLoaded = false;
var isAnimated = false;

function setupLibrary() {
  (function(factory) {

    if (typeof module !== 'undefined' && module.exports) {
      module.exports = factory(window, document);
    } else {
      window.hDOM = factory(window, document);
    }

  })(function(w, d) {

    'use strict';

    var _defaults = {
        configurable: false,
        enumerable: false,
        writable: false
      },
      _support = {
        classList: 'classList' in d.documentElement,
        addEventListener: w.addEventListener,
        attachEvent: w.attachEvent
      },
      _utils = {
        extend: function() {
          var args = [].slice.call(arguments),
            ret = args[0];
          for (var i = 1, len = args.length; i < len; i++) {
            var obj = args[i];
            for (var prop in obj) {
              if (obj.hasOwnProperty(prop)) ret[prop] = obj[prop];
            }
          }
          return ret;
        },
        each: function(obj, fn, context) {
          for (var p in obj) {
            if (!('hasOwnProperty' in obj) || obj.hasOwnProperty(p)) fn.apply(context || obj[p], [obj[p], p]);
          }
        },
        format: function(str, obj) {
          return str.toString().replace(/\|([^|]+)\|/g, function(match, group) {
            return obj[group];
          });
        }
      };

    if (!Object.defineProperty || !(function() {
        try {
          Object.defineProperty({}, 'x', {});
          return true;
        } catch (e) {
          return false;
        }
      })()) {
      var orig = Object.defineProperty;
      Object.defineProperty = function(o, prop, desc) {
        if (orig) {
          try {
            return orig(o, prop, desc);
          } catch (e) {}
        }

        if (Object.prototype.__defineSetter__ && ('set' in desc)) {
          Object.prototype.__defineSetter__.call(o, prop, desc.set);
        }

        if (Object.prototype.__defineGetter__ && ('get' in desc)) {
          Object.prototype.__defineGetter__.call(o, prop, desc.get);
        }

        if ('value' in desc) {
          o[prop] = desc.value;
        }

      };
    }

    var ElementCollection = function(arr) {
      _utils.extend(this, arr);
      this.length = arr.length;
      return this;
    };

    Object.defineProperty(ElementCollection.prototype, 'each', _utils.extend(_defaults, {
      value: function(fn) {
        for (var i = 0, len = this.length; i < len; i++) {
          fn.apply(this[i], [this[i], i]);
        }
        return this;
      }
    }));

    Object.defineProperty(ElementCollection.prototype, 'get', _utils.extend(_defaults, {
      value: function(index) {
        if (index !== -1 && !this.hasOwnProperty(index)) {
          throw 'Supplied index out of bounds';
        } else {
          var i = index === -1 ? this.length - 1 : index;
          return new ElementCollection([this[i]]);
        }
      }
    }));

    Object.defineProperty(ElementCollection.prototype, 'find', _utils.extend(_defaults, {
      value: function(sel) {
        var arr = [];
        var last = /:last\-child/.test(sel);
        if (last) {
          sel = sel.split(':last-child').join('');
        }
        this.each(function() {
          var _self = this;
          var tmp = [];
          var query;
          if (!last) {
            query = _self.querySelectorAll(sel);
          } else {
            var s = _self.querySelector(sel).parentNode;
            query = [s.children[s.children.length - 1]];
          }
          _utils.each(query, function(val, prop) {
            tmp[prop] = val;
          });
          arr = arr.concat(tmp);
        });
        return new ElementCollection(arr);
      }
    }));


    Object.defineProperty(ElementCollection.prototype, 'addClass', _utils.extend(_defaults, {
      value: (function() {
        if (_support.classList) {
          return function(cls) {
            if (!cls) return this;
            _utils.each(cls.split(' '), function(value, i) {
              this.each(function() {
                if (this.classList.contains(value)) return;
                this.classList.add(value);
              });
            }, this);
            return this;
          };
        } else {
          return function(cls) {
            if (!cls) return this;
            _utils.each(cls.split(' '), function(value, i) {
              var regex = new RegExp('(\\s|^)' + value + '(\\s|$)');
              this.each(function() {
                if (this.className.match(regex)) return;
                this.className += ' ' + value;
                this.className = this.className.replace(/(^\s*)|(\s*$)/g, '');
              });
            }, this);
            return this;
          };
        }
      })()
    }));

    Object.defineProperty(ElementCollection.prototype, 'removeClass', _utils.extend(_defaults, {
      value: (function() {
        if (_support.classList) {
          return function(cls) {
            if (!cls) return this;
            _utils.each(cls.split(' '), function(value, i) {
              this.each(function() {
                if (!this.classList.contains(value)) return;
                this.classList.remove(value);
              });
            }, this);
            return this;
          };
        } else {
          return function(cls) {
            if (!cls) return this;
            _utils.each(cls.split(' '), function(value, i) {
              var regex = new RegExp('(\\s|^)' + value + '(\\s|$)');
              this.each(function() {
                this.className = this.className.replace(regex, ' ').replace(/(^\s*)|(\s*$)/g, '');
              });
            }, this);
            return this;
          };
        }
      })()
    }));

    Object.defineProperty(ElementCollection.prototype, 'hasClass', _utils.extend(_defaults, {
      value: (function() {
        if (_support.classList) {
          return function(cls) {
            if (cls.constructor.name === 'RegExp') return cls.test(this[0].className);
            return this[0].classList.contains(cls);
          };
        } else {
          return function(cls) {
            if (cls.constructor.name === 'RegExp') return cls.test(this[0].className);
            return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(this[0].className);
          };
        }
      })()
    }));

    Object.defineProperty(ElementCollection.prototype, 'toggleClass', _utils.extend(_defaults, {
      value: function(cls) {
        var fn = this.hasClass(cls) ? 'removeClass' : 'addClass';
        return this[fn](cls);
      }
    }));


    var hDOM = function(sel) {
      if (typeof sel === 'string') {
        var arr = [];
        _utils.each(d.querySelectorAll(sel), function(val, prop) {
          arr[prop] = val;
        });
        return new ElementCollection(arr);
      } else if ('nodeType' in sel || sel === w) {
        return new ElementCollection([sel]);
      } else if (typeof sel === 'function') {
        hDOM.ready(sel);
      }
    };

    hDOM.format = _utils.format;

    return hDOM;

  });
}

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
  var count = 1;

  var cycle = function() {
    var parent = hDOM('.slide__container');
    var move = parent.find('.remove').removeClass('remove');
    parent.find('.active').removeClass('active').addClass('remove');
    parent.find('.off').get(0).removeClass('off').addClass('active');
    move.addClass('off');

    if (count === 2) {
      return;
    } else {
      setTimeout(cycle, 4000);
    }
    count += 1;
  }
  setTimeout(cycle, 5000);
}