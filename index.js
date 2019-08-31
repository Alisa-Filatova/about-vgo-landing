(function() {

  var IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var BODY = IS_SAFARI ? document.body : document.documentElement;

  var STOP = 0;
  var INCREMENT = 16;
  var SHIFT_CORRECTION = 50;
  var BORDER = 0;
  var IS_WIDE_SCREEN = false;

  var resizeTimeout;

  var bg = document.getElementById('header-background');
  var droid = document.getElementById('droid');
  var birds = document.getElementById('birds');
  var monster = document.getElementById('monster');
  var robot = document.getElementById('robot');

  var heroes = document.getElementById('heroes');
  var hero = document.getElementById('hero');
  var stop = document.getElementById('stop');

  var advantages = document.querySelectorAll('.advantage');

  function getInitPositions() {
    STOP = stop.getBoundingClientRect().bottom - (hero.getBoundingClientRect().bottom - SHIFT_CORRECTION);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  function scrollTo(to, duration) {
    var start = BODY.scrollTop;
    var currentTime = 0;

    var animateScroll = function () {
      currentTime += INCREMENT;
      BODY.scrollTop = easeInOutQuad(currentTime, start, to - start, duration);
      if (currentTime < duration) setTimeout(animateScroll, INCREMENT);
    };

    animateScroll();
  }

  function onScroll() {
    advantages.forEach(function (advantage) {
      var top = advantage.getBoundingClientRect().top;
      if (top < BORDER) {
        advantage.classList.add('show');
      }
    })
  }

  function transform (target, x, y, transform = '')  {
    if (!target) return;
    target.style.transform = `translate3d(${x}px, ${y}px, 0) ${transform}`;
  }

  function animateHeader (x, y) {
    transform(bg, x / 4, y / 4, 'scale(1.1)');
    transform(birds, x / 2, y / 2);
    transform(droid, x / 2, y / 2);
    transform(monster, x / 1.2, y / 1.2);
    transform(robot, x, y);
  }

  function onDeviceOrientation(e) {
    if (IS_WIDE_SCREEN) return;

    var landscape = window.orientation === 90 || window.orientation === -90;
    var x = Math.floor(40 * (landscape ? e.beta : e.gamma) / 100);
    var y = Math.floor(40 * (landscape ? e.gamma : e.beta) / 100);

    animateHeader(Math.floor(40 * x / 100), Math.floor(40 * y / 100));
  }

  function calcMouseShift(pos, size, limit) {
    const half = size / 2;
    return (pos - half) * (limit * 100 / half) / 100;
  }

  function onMouseMove(event) {
    const x = calcMouseShift(event.pageX, window.innerWidth, 40);
    const y = calcMouseShift(event.pageY, window.innerHeight, 40);
    animateHeader(x, y);
  }

  function onDocumentClick(e) {
    if (e.isTrusted !== true) return;
    if (e.target.classList.contains('arrow-down-btn')) scrollTo(window.innerHeight, 1600);
  }

  function init() {
    IS_WIDE_SCREEN = window.innerWidth >= 1024;
    BORDER = window.innerHeight - (window.innerHeight / 3);
    if (IS_WIDE_SCREEN) getInitPositions();
    if (BODY.scrollTop > 0) onScroll();
  }

  function onResize() {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(function() {
      init();
    }, 300);
  }

  setTimeout(function() { init() }, 16);

  window.addEventListener('resize', onResize);
  window.addEventListener('deviceorientation', onDeviceOrientation);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('scroll', onScroll);
  document.addEventListener('click', onDocumentClick);

})();
