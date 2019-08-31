const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const BODY = IS_SAFARI ? document.body : document.documentElement;

const INCREMENT = 16;
let BORDER = 0;
let IS_WIDE_SCREEN = false;
let resizeTimeout;

const bg = document.getElementById('header-background');
const droid = document.getElementById('droid');
const birds = document.getElementById('birds');
const monster = document.getElementById('monster');
const robot = document.getElementById('robot');
const advantages = document.querySelectorAll('.advantage');

const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

const scrollTo = (to, duration) => {
  const start = BODY.scrollTop;
  let currentTime = 0;

  const animateScroll = () => {
    currentTime += INCREMENT;
    BODY.scrollTop = easeInOutQuad(currentTime, start, to - start, duration);
    if (currentTime < duration) setTimeout(animateScroll, INCREMENT);
  };

  animateScroll();
};

const onScroll = () => {
  advantages.forEach(function (advantage) {
    const top = advantage.getBoundingClientRect().top;
    if (top < BORDER) {
      advantage.classList.add('show');
    }
  })
};

const transform = (target, x, y, transform = '') => {
  if (!target) return;
  target.style.transform = `translate3d(${x}px, ${y}px, 0) ${transform}`;
};

const animateHeader = (x, y) => {
  transform(bg, x / 4, y / 4, 'scale(1.1)');
  transform(birds, x / 2, y / 2);
  transform(droid, x / 2, y / 2);
  transform(monster, x / 1.2, y / 1.2);
  transform(robot, x, y);
};

const onDeviceOrientation = (e) => {
  if (IS_WIDE_SCREEN) return;

  const landscape = window.orientation === 90 || window.orientation === -90;
  const x = Math.floor(40 * (landscape ? e.beta : e.gamma) / 100);
  const y = Math.floor(40 * (landscape ? e.gamma : e.beta) / 100);

  animateHeader(Math.floor(40 * x / 100), Math.floor(40 * y / 100));
};

const calcMouseShift = (pos, size, limit) => {
  const half = size / 2;
  return (pos - half) * (limit * 100 / half) / 100;
};

const onMouseMove = (event) => {
  const x = calcMouseShift(event.pageX, window.innerWidth, 40);
  const y = calcMouseShift(event.pageY, window.innerHeight, 40);
  animateHeader(x, y);
};

const onDocumentClick = (event) => {
  if (event.isTrusted !== true) return;
  if (event.target.classList.contains('arrow-down-btn')) {
    scrollTo(window.innerHeight, 1600);
  }
};

const init = () => {
  IS_WIDE_SCREEN = window.innerWidth >= 1024;
  BORDER = window.innerHeight - (window.innerHeight / 3);
  if (BODY.scrollTop > 0) onScroll();
};

const onResize = () => {
  window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(function() {
    init();
  }, 300);
};

setTimeout(function() { init() }, 16);

window.addEventListener('resize', onResize);
window.addEventListener('deviceorientation', onDeviceOrientation);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('scroll', onScroll);
document.addEventListener('click', onDocumentClick);
