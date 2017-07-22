var mobileTrigger = document.getElementById('mobileTrigger');
var mobileAside = document.getElementById('mobileAside');
var mainNav = document.getElementById('main-nav');
if (mobileTrigger) {
  mobileTrigger.onclick = function(e) {
    if (mobileAside) {
      if (mobileAside.className && mobileAside.className.indexOf('mobile-show') === -1) {
        mobileAside.className += ' mobile-show';
      } else {
        mobileAside.className = 'toc';
      }
    }
  };
}


var pathname = location.pathname.replace(/\/$/, '');

if (mobileAside) {
  var links = mobileAside.getElementsByTagName('a');
  for (var i = 0, len = links.length; i < len; i++) {
    var href = links[i].getAttribute('href');
    if (href && new RegExp(pathname + "$").test(href)) {
      links[i].setAttribute('class', 'menu-active');
    }
  }
}

if (mainNav) {
  var mainNavLinks = mainNav.getElementsByTagName('a');
  for (var i = 0, len = mainNavLinks.length; i < len; i++) {
    var href = mainNavLinks[i].getAttribute('href');
    if (href === pathname && href === '/easywebpack' || (href && href !== '/easywebpack'&& new RegExp(href).test(pathname))) {
      mainNavLinks[i].setAttribute('class', 'mani-menu-active');
    }
  }
}
