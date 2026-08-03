let BIRTHDAY_PIN = '1815101';
// Birthday target date (YYYY-MM-DDTHH:mm:ss). Set to future date for countdown or past/current date for test.
const BIRTHDAY_TARGET_DATE = '2026-07-28T00:00:00';

let welcomeMessage = {
  title: 'A little surprise...',
  lines: [],
};

const balloons = [
  { color: '#ff6b8a', message: 'You are so much stronger than you think. 💖' },
  { color: '#ffbe3d', message: 'You are absolutely beautiful & gorgeous, inside and out. ✨' },
  { color: '#7fd1b6', message: 'You are so smart, brilliant, and wise. 💡' },
  { color: '#5bb4d6', message: 'You love so deeply and unconditionally. 💕' },
  { color: '#ff8fa3', message: 'You bring so much warmth, laughter, and joy into our lives. ❤️' },
  { color: '#ffd56b', message: 'Your radiant warmth makes us all smile every single day. 😊🌸' },
];

const galleryPhotos = [
  { src: '/templates/birthday-star/images/1.jpeg' },
  { src: '/templates/birthday-star/images/2.jpeg' },
  { src: '/templates/birthday-star/images/3.jpeg' },
  { src: '/templates/birthday-star/images/4.png' },
  { src: '/templates/birthday-star/images/5.jpeg' },
  { src: '/templates/birthday-star/images/6.png' },
];

const daughterWish = null;

const familyWishes = [];

const husbandLetter = {
  title: 'A Birthday Wish for You',
  salutation: 'Dearest Birthday Star,',
  body: 'Happy Birthday! Every single day with you is a gift filled with warmth, laughter, and endless happiness. May your year ahead bring you all the love, success, and joy that you so truly deserve!',
  signoff: 'With lots of love,',
  signature: 'Rahul ❤️',
};

let finalWish = {
  title: 'And from all of us...',
  message:
    'Happy Birthday, our precious star. May your life be filled with as much laughter, wonder, and love as you bring to ours. Today, tomorrow, and always — we celebrate you.',
  signoff: 'With all our love, always',
};

// Dynamic Token Decoding for Customized Wishes
(function() {
  const SECRET = 'birthday-star-2026-csrgo';
  function xorTransform(input) {
    let out = '';
    for (let i = 0; i < input.length; i++) {
      out += String.fromCharCode(input.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
    }
    return out;
  }
  function fromBase64Url(b64url) {
    let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const binary = atob(b64);
    let utf8 = '';
    for (let i = 0; i < binary.length; i++) {
      utf8 += String.fromCharCode(binary.charCodeAt(i));
    }
    return decodeURIComponent(escape(utf8));
  }
  function decodeToken(token) {
    try {
      return JSON.parse(xorTransform(fromBase64Url(token)));
    } catch (e) {
      return null;
    }
  }

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    const payload = decodeToken(token);
    if (payload) {
      if (payload.pin) BIRTHDAY_PIN = payload.pin;
      if (payload.b) {
        welcomeMessage.title = `A special surprise for ${payload.b}...`;
      }
      if (payload.m) {
        finalWish = {
          title: `Happy Birthday ${payload.b || 'Star'}!`,
          message: payload.m,
          signoff: payload.s ? `With all our love, ${payload.s}` : 'With all our love, always'
        };
      }
    }
  }
})();
