// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

//wow
(function() {
  var MutationObserver, Util, WeakMap, getComputedStyle, getComputedStyleRX,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Util = (function() {
    function Util() {}

    Util.prototype.extend = function(custom, defaults) {
      var key, value;
      for (key in defaults) {
        value = defaults[key];
        if (custom[key] == null) {
          custom[key] = value;
        }
      }
      return custom;
    };

    Util.prototype.isMobile = function(agent) {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    };

    Util.prototype.createEvent = function(event, bubble, cancel, detail) {
      var customEvent;
      if (bubble == null) {
        bubble = false;
      }
      if (cancel == null) {
        cancel = false;
      }
      if (detail == null) {
        detail = null;
      }
      if (document.createEvent != null) {
        customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent(event, bubble, cancel, detail);
      } else if (document.createEventObject != null) {
        customEvent = document.createEventObject();
        customEvent.eventType = event;
      } else {
        customEvent.eventName = event;
      }
      return customEvent;
    };

    Util.prototype.emitEvent = function(elem, event) {
      if (elem.dispatchEvent != null) {
        return elem.dispatchEvent(event);
      } else if (event in (elem != null)) {
        return elem[event]();
      } else if (("on" + event) in (elem != null)) {
        return elem["on" + event]();
      }
    };

    Util.prototype.addEvent = function(elem, event, fn) {
      if (elem.addEventListener != null) {
        return elem.addEventListener(event, fn, false);
      } else if (elem.attachEvent != null) {
        return elem.attachEvent("on" + event, fn);
      } else {
        return elem[event] = fn;
      }
    };

    Util.prototype.removeEvent = function(elem, event, fn) {
      if (elem.removeEventListener != null) {
        return elem.removeEventListener(event, fn, false);
      } else if (elem.detachEvent != null) {
        return elem.detachEvent("on" + event, fn);
      } else {
        return delete elem[event];
      }
    };

    Util.prototype.innerHeight = function() {
      if ('innerHeight' in window) {
        return window.innerHeight;
      } else {
        return document.documentElement.clientHeight;
      }
    };

    return Util;

  })();

  WeakMap = this.WeakMap || this.MozWeakMap || (WeakMap = (function() {
    function WeakMap() {
      this.keys = [];
      this.values = [];
    }

    WeakMap.prototype.get = function(key) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          return this.values[i];
        }
      }
    };

    WeakMap.prototype.set = function(key, value) {
      var i, item, j, len, ref;
      ref = this.keys;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        if (item === key) {
          this.values[i] = value;
          return;
        }
      }
      this.keys.push(key);
      return this.values.push(value);
    };

    return WeakMap;

  })());

  MutationObserver = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (MutationObserver = (function() {
    function MutationObserver() {
      if (typeof console !== "undefined" && console !== null) {
        console.warn('MutationObserver is not supported by your browser.');
      }
      if (typeof console !== "undefined" && console !== null) {
        console.warn('WOW.js cannot detect dom mutations, please call .sync() after loading new content.');
      }
    }

    MutationObserver.notSupported = true;

    MutationObserver.prototype.observe = function() {};

    return MutationObserver;

  })());

  getComputedStyle = this.getComputedStyle || function(el, pseudo) {
    this.getPropertyValue = function(prop) {
      var ref;
      if (prop === 'float') {
        prop = 'styleFloat';
      }
      if (getComputedStyleRX.test(prop)) {
        prop.replace(getComputedStyleRX, function(_, _char) {
          return _char.toUpperCase();
        });
      }
      return ((ref = el.currentStyle) != null ? ref[prop] : void 0) || null;
    };
    return this;
  };

  getComputedStyleRX = /(\-([a-z]){1})/g;

  this.WOW = (function() {
    WOW.prototype.defaults = {
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true,
      callback: null
    };

    function WOW(options) {
      if (options == null) {
        options = {};
      }
      this.scrollCallback = bind(this.scrollCallback, this);
      this.scrollHandler = bind(this.scrollHandler, this);
      this.resetAnimation = bind(this.resetAnimation, this);
      this.start = bind(this.start, this);
      this.scrolled = true;
      this.config = this.util().extend(options, this.defaults);
      this.animationNameCache = new WeakMap();
      this.wowEvent = this.util().createEvent(this.config.boxClass);
    }

    WOW.prototype.init = function() {
      var ref;
      this.element = window.document.documentElement;
      if ((ref = document.readyState) === "interactive" || ref === "complete") {
        this.start();
      } else {
        this.util().addEvent(document, 'DOMContentLoaded', this.start);
      }
      return this.finished = [];
    };

    WOW.prototype.start = function() {
      var box, j, len, ref;
      this.stopped = false;
      this.boxes = (function() {
        var j, len, ref, results;
        ref = this.element.querySelectorAll("." + this.config.boxClass);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      this.all = (function() {
        var j, len, ref, results;
        ref = this.boxes;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          box = ref[j];
          results.push(box);
        }
        return results;
      }).call(this);
      if (this.boxes.length) {
        if (this.disabled()) {
          this.resetStyle();
        } else {
          ref = this.boxes;
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            this.applyStyle(box, true);
          }
        }
      }
      if (!this.disabled()) {
        this.util().addEvent(window, 'scroll', this.scrollHandler);
        this.util().addEvent(window, 'resize', this.scrollHandler);
        this.interval = setInterval(this.scrollCallback, 50);
      }
      if (this.config.live) {
        return new MutationObserver((function(_this) {
          return function(records) {
            var k, len1, node, record, results;
            results = [];
            for (k = 0, len1 = records.length; k < len1; k++) {
              record = records[k];
              results.push((function() {
                var l, len2, ref1, results1;
                ref1 = record.addedNodes || [];
                results1 = [];
                for (l = 0, len2 = ref1.length; l < len2; l++) {
                  node = ref1[l];
                  results1.push(this.doSync(node));
                }
                return results1;
              }).call(_this));
            }
            return results;
          };
        })(this)).observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    };

    WOW.prototype.stop = function() {
      this.stopped = true;
      this.util().removeEvent(window, 'scroll', this.scrollHandler);
      this.util().removeEvent(window, 'resize', this.scrollHandler);
      if (this.interval != null) {
        return clearInterval(this.interval);
      }
    };

    WOW.prototype.sync = function(element) {
      if (MutationObserver.notSupported) {
        return this.doSync(this.element);
      }
    };

    WOW.prototype.doSync = function(element) {
      var box, j, len, ref, results;
      if (element == null) {
        element = this.element;
      }
      if (element.nodeType !== 1) {
        return;
      }
      element = element.parentNode || element;
      ref = element.querySelectorAll("." + this.config.boxClass);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        if (indexOf.call(this.all, box) < 0) {
          this.boxes.push(box);
          this.all.push(box);
          if (this.stopped || this.disabled()) {
            this.resetStyle();
          } else {
            this.applyStyle(box, true);
          }
          results.push(this.scrolled = true);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    WOW.prototype.show = function(box) {
      this.applyStyle(box);
      box.className = box.className + " " + this.config.animateClass;
      if (this.config.callback != null) {
        this.config.callback(box);
      }
      this.util().emitEvent(box, this.wowEvent);
      this.util().addEvent(box, 'animationend', this.resetAnimation);
      this.util().addEvent(box, 'oanimationend', this.resetAnimation);
      this.util().addEvent(box, 'webkitAnimationEnd', this.resetAnimation);
      this.util().addEvent(box, 'MSAnimationEnd', this.resetAnimation);
      return box;
    };

    WOW.prototype.applyStyle = function(box, hidden) {
      var delay, duration, iteration;
      duration = box.getAttribute('data-wow-duration');
      delay = box.getAttribute('data-wow-delay');
      iteration = box.getAttribute('data-wow-iteration');
      return this.animate((function(_this) {
        return function() {
          return _this.customStyle(box, hidden, duration, delay, iteration);
        };
      })(this));
    };

    WOW.prototype.animate = (function() {
      if ('requestAnimationFrame' in window) {
        return function(callback) {
          return window.requestAnimationFrame(callback);
        };
      } else {
        return function(callback) {
          return callback();
        };
      }
    })();

    WOW.prototype.resetStyle = function() {
      var box, j, len, ref, results;
      ref = this.boxes;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        box = ref[j];
        results.push(box.style.visibility = 'visible');
      }
      return results;
    };

    WOW.prototype.resetAnimation = function(event) {
      var target;
      if (event.type.toLowerCase().indexOf('animationend') >= 0) {
        target = event.target || event.srcElement;
        return target.className = target.className.replace(this.config.animateClass, '').trim();
      }
    };

    WOW.prototype.customStyle = function(box, hidden, duration, delay, iteration) {
      if (hidden) {
        this.cacheAnimationName(box);
      }
      box.style.visibility = hidden ? 'hidden' : 'visible';
      if (duration) {
        this.vendorSet(box.style, {
          animationDuration: duration
        });
      }
      if (delay) {
        this.vendorSet(box.style, {
          animationDelay: delay
        });
      }
      if (iteration) {
        this.vendorSet(box.style, {
          animationIterationCount: iteration
        });
      }
      this.vendorSet(box.style, {
        animationName: hidden ? 'none' : this.cachedAnimationName(box)
      });
      return box;
    };

    WOW.prototype.vendors = ["moz", "webkit"];

    WOW.prototype.vendorSet = function(elem, properties) {
      var name, results, value, vendor;
      results = [];
      for (name in properties) {
        value = properties[name];
        elem["" + name] = value;
        results.push((function() {
          var j, len, ref, results1;
          ref = this.vendors;
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            vendor = ref[j];
            results1.push(elem["" + vendor + (name.charAt(0).toUpperCase()) + (name.substr(1))] = value);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    WOW.prototype.vendorCSS = function(elem, property) {
      var j, len, ref, result, style, vendor;
      style = getComputedStyle(elem);
      result = style.getPropertyCSSValue(property);
      ref = this.vendors;
      for (j = 0, len = ref.length; j < len; j++) {
        vendor = ref[j];
        result = result || style.getPropertyCSSValue("-" + vendor + "-" + property);
      }
      return result;
    };

    WOW.prototype.animationName = function(box) {
      var animationName;
      try {
        animationName = this.vendorCSS(box, 'animation-name').cssText;
      } catch (_error) {
        animationName = getComputedStyle(box).getPropertyValue('animation-name');
      }
      if (animationName === 'none') {
        return '';
      } else {
        return animationName;
      }
    };

    WOW.prototype.cacheAnimationName = function(box) {
      return this.animationNameCache.set(box, this.animationName(box));
    };

    WOW.prototype.cachedAnimationName = function(box) {
      return this.animationNameCache.get(box);
    };

    WOW.prototype.scrollHandler = function() {
      return this.scrolled = true;
    };

    WOW.prototype.scrollCallback = function() {
      var box;
      if (this.scrolled) {
        this.scrolled = false;
        this.boxes = (function() {
          var j, len, ref, results;
          ref = this.boxes;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            box = ref[j];
            if (!(box)) {
              continue;
            }
            if (this.isVisible(box)) {
              this.show(box);
              continue;
            }
            results.push(box);
          }
          return results;
        }).call(this);
        if (!(this.boxes.length || this.config.live)) {
          return this.stop();
        }
      }
    };

    WOW.prototype.offsetTop = function(element) {
      var top;
      while (element.offsetTop === void 0) {
        element = element.parentNode;
      }
      top = element.offsetTop;
      while (element = element.offsetParent) {
        top += element.offsetTop;
      }
      return top;
    };

    WOW.prototype.isVisible = function(box) {
      var bottom, offset, top, viewBottom, viewTop;
      offset = box.getAttribute('data-wow-offset') || this.config.offset;
      viewTop = window.pageYOffset;
      viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset;
      top = this.offsetTop(box);
      bottom = top + box.clientHeight;
      return top <= viewBottom && bottom >= viewTop;
    };

    WOW.prototype.util = function() {
      return this._util != null ? this._util : this._util = new Util();
    };

    WOW.prototype.disabled = function() {
      return !this.config.mobile && this.util().isMobile(navigator.userAgent);
    };

    return WOW;

  })();

}).call(this);


//smoothstate

/*!
 * smoothState.js is jQuery plugin that progressively enhances
 * page loads to behave more like a single-page application.
 *
 * @author  Miguel Ángel Pérez   reachme@miguel-perez.com
 * @see     http://smoothstate.com
 *
 */
!function(t){"use strict";"object"==typeof module&&"object"==typeof module.exports?t(require("jquery"),window,document):t(jQuery,window,document)}(function(t,e,n,o){"use strict";if(!e.history.pushState)return t.fn.smoothState=function(){return this},void(t.fn.smoothState.options={});if(!t.fn.smoothState){var r=t("html, body"),a=e.console,i={debug:!1,anchors:"a",hrefRegex:"",forms:"form",allowFormCaching:!1,repeatDelay:500,blacklist:".no-smoothState",prefetch:!1,prefetchOn:"mouseover touchstart",prefetchBlacklist:".no-prefetch",locationHeader:"X-SmoothState-Location",cacheLength:0,loadingClass:"is-loading",scroll:!0,alterRequest:function(t){return t},alterChangeState:function(t,e,n){return t},onBefore:function(t,e){},onStart:{duration:0,render:function(t){}},onProgress:{duration:0,render:function(t){}},onReady:{duration:0,render:function(t,e){t.html(e)}},onAfter:function(t,e){}},s={isExternal:function(t){var n=t.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);return"string"==typeof n[1]&&n[1].length>0&&n[1].toLowerCase()!==e.location.protocol?!0:"string"==typeof n[2]&&n[2].length>0&&n[2].replace(new RegExp(":("+{"http:":80,"https:":443}[e.location.protocol]+")?$"),"")!==e.location.host},stripHash:function(t){return t.replace(/#.*/,"")},isHash:function(t,n){n=n||e.location.href;var o=t.indexOf("#")>-1,r=s.stripHash(t)===s.stripHash(n);return o&&r},translate:function(e){var n={dataType:"html",type:"GET"};return e="string"==typeof e?t.extend({},n,{url:e}):t.extend({},n,e)},shouldLoadAnchor:function(t,e,n){var r=t.prop("href");return!(s.isExternal(r)||s.isHash(r)||t.is(e)||t.prop("target")||typeof n!==o&&""!==n&&-1===t.prop("href").search(n))},clearIfOverCapacity:function(t,e){return Object.keys||(Object.keys=function(t){var e,n=[];for(e in t)Object.prototype.hasOwnProperty.call(t,e)&&n.push(e);return n}),Object.keys(t).length>e&&(t={}),t},storePageIn:function(e,n,o,r,a,i){var s=t("<html></html>").append(t(o));return"undefined"==typeof a&&(a={}),"undefined"==typeof i&&(i=n),e[n]={status:"loaded",title:s.find("title").first().text(),html:s.find("#"+r),doc:o,state:a,destUrl:i},e},triggerAllAnimationEndEvent:function(e,n){n=" "+n||"";var o=0,r="animationstart webkitAnimationStart oanimationstart MSAnimationStart",a="animationend webkitAnimationEnd oanimationend MSAnimationEnd",i="allanimationend",l=function(n){t(n.delegateTarget).is(e)&&(n.stopPropagation(),o++)},u=function(n){t(n.delegateTarget).is(e)&&(n.stopPropagation(),o--,0===o&&e.trigger(i))};e.on(r,l),e.on(a,u),e.on("allanimationend"+n,function(){o=0,s.redraw(e)})},redraw:function(t){t.height()}},l=function(n){if(null!==n.state){var o=e.location.href,r=t("#"+n.state.id),a=r.data("smoothState"),i=a.href!==o&&!s.isHash(o,a.href),l=n.state!==a.cache[a.href].state;(i||l)&&(l&&a.clear(a.href),a.load(o,!1))}},u=function(i,l){var u=t(i),c=u.prop("id"),f=null,d=!1,h={},p={},g=e.location.href,m=function(t){t=t||!1,t&&h.hasOwnProperty(t)?delete h[t]:h={},u.data("smoothState").cache=h},y=function(e,n){n=n||t.noop;var o=s.translate(e);if(h=s.clearIfOverCapacity(h,l.cacheLength),!h.hasOwnProperty(o.url)||"undefined"!=typeof o.data){h[o.url]={status:"fetching"};var r=t.ajax(o);r.done(function(t){s.storePageIn(h,o.url,t,c),u.data("smoothState").cache=h}),r.fail(function(){h[o.url].status="error"}),l.locationHeader&&r.always(function(t,e,n){var r=t.statusCode?t:n,a=r.getResponseHeader(l.locationHeader);a&&(h[o.url].destUrl=a)}),n&&r.always(n)}},v=function(){if(f){var e=t(f,u);if(e.length){var n=e.offset().top;r.scrollTop(n)}f=null}},S=function(o){var i="#"+c,s=h[o]?t(h[o].html.html()):null;s.length?(n.title=h[o].title,u.data("smoothState").href=o,l.loadingClass&&r.removeClass(l.loadingClass),l.onReady.render(u,s),u.one("ss.onReadyEnd",function(){d=!1,l.onAfter(u,s),l.scroll&&v(),O(u)}),e.setTimeout(function(){u.trigger("ss.onReadyEnd")},l.onReady.duration)):!s&&l.debug&&a?a.warn("No element with an id of "+i+" in response from "+o+" in "+h):e.location=o},w=function(t,n,o){var i=s.translate(t);"undefined"==typeof n&&(n=!0),"undefined"==typeof o&&(o=!0);var f=!1,d=!1,g={loaded:function(){var t=f?"ss.onProgressEnd":"ss.onStartEnd";if(d&&f?d&&S(i.url):u.one(t,function(){S(i.url),o||m(i.url)}),n){var r=h[i.url].destUrl;p=l.alterChangeState({id:c},h[i.url].title,r),h[i.url].state=p,e.history.pushState(p,h[i.url].title,r)}d&&!o&&m(i.url)},fetching:function(){f||(f=!0,u.one("ss.onStartEnd",function(){l.loadingClass&&r.addClass(l.loadingClass),l.onProgress.render(u),e.setTimeout(function(){u.trigger("ss.onProgressEnd"),d=!0},l.onProgress.duration)})),e.setTimeout(function(){h.hasOwnProperty(i.url)&&g[h[i.url].status]()},10)},error:function(){l.debug&&a?a.log("There was an error loading: "+i.url):e.location=i.url}};h.hasOwnProperty(i.url)||y(i),l.onStart.render(u),e.setTimeout(function(){l.scroll&&r.scrollTop(0),u.trigger("ss.onStartEnd")},l.onStart.duration),g[h[i.url].status]()},E=function(e){var n,o=t(e.currentTarget);s.shouldLoadAnchor(o,l.blacklist,l.hrefRegex)&&!d&&(e.stopPropagation(),n=s.translate(o.prop("href")),n=l.alterRequest(n),y(n))},b=function(e){var n=t(e.currentTarget);if(!e.metaKey&&!e.ctrlKey&&s.shouldLoadAnchor(n,l.blacklist,l.hrefRegex)&&(e.stopPropagation(),e.preventDefault(),!T())){A();var o=s.translate(n.prop("href"));d=!0,f=n.prop("hash"),o=l.alterRequest(o),l.onBefore(n,u),w(o)}},C=function(e){var n=t(e.currentTarget);if(!n.is(l.blacklist)&&(e.preventDefault(),e.stopPropagation(),!T())){A();var r={url:n.prop("action"),data:n.serialize(),type:n.prop("method")};d=!0,r=l.alterRequest(r),"get"===r.type.toLowerCase()&&(r.url=r.url+"?"+r.data),l.onBefore(n,u),w(r,o,l.allowFormCaching)}},P=0,T=function(){var t=null===l.repeatDelay,e=parseInt(Date.now())>P;return!(t||e)},A=function(){P=parseInt(Date.now())+parseInt(l.repeatDelay)},O=function(t){l.anchors&&l.prefetch&&t.find(l.anchors).not(l.prefetchBlacklist).on(l.prefetchOn,null,E)},R=function(t){l.anchors&&(t.on("click",l.anchors,b),O(t)),l.forms&&t.on("submit",l.forms,C)},x=function(){var t=u.prop("class");u.removeClass(t),s.redraw(u),u.addClass(t)};return l=t.extend({},t.fn.smoothState.options,l),null===e.history.state?(p=l.alterChangeState({id:c},n.title,g),e.history.replaceState(p,n.title,g)):p={},s.storePageIn(h,g,n.documentElement.outerHTML,c,p),s.triggerAllAnimationEndEvent(u,"ss.onStartEnd ss.onProgressEnd ss.onEndEnd"),R(u),{href:g,cache:h,clear:m,load:w,fetch:y,restartCSSAnimations:x}},c=function(e){return this.each(function(){var n=this.tagName.toLowerCase();this.id&&"body"!==n&&"html"!==n&&!t.data(this,"smoothState")?t.data(this,"smoothState",new u(this,e)):!this.id&&a?a.warn("Every smoothState container needs an id but the following one does not have one:",this):"body"!==n&&"html"!==n||!a||a.warn("The smoothstate container cannot be the "+this.tagName+" tag")})};e.onpopstate=l,t.smoothStateUtility=s,t.fn.smoothState=c,t.fn.smoothState.options=i}});