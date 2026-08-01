// Pure Vanilla JS Birthday Experience Application
(function () {
  const app = document.getElementById('app');

  // Application State
  const state = {
    stage: 'welcome', // 'welcome' | 'countdown' | 'balloons' | 'photos' | 'cake' | 'daughter' | 'family' | 'final'
    // Welcome scene state
    welcomeSubStage: 'message', // 'message' | 'candle' | 'pin'
    welcomeLit: false,
    welcomePin: '',
    welcomePinError: false,
    pinErrorMsg: '',
    pinErrorIndex: 0,
    welcomeMatchPos: null,
    welcomeDragging: false,
    // Countdown scene state
    countdownMode: 'timer', // 'timer' | 'final' | 'celebrate'
    countdownVal: 5,
    countdownDiffMs: 0,
    countdownTimer: null,
    // Balloon scene state
    balloonIndex: 0,
    balloonPopped: false,
    balloonMessage: false,
    balloonAllDone: false,
    balloonTimer: null,
    // Photos scene state
    photoIndex: 0,
    // Cake scene state
    cakeCut: false,
    cakeKnifePos: null,
    cakeDragging: false,
    cakeTopReached: false,
    // Daughter wishes scene state
    daughterTypedText: '',
    daughterPhase: 'typing', // 'typing' | 'translating' | 'translated'
    daughterTimer: null,
    // Family wishes scene state
    familyIndex: 0,
    // Final scene state
    finalConfetti: true,
  };

  function setStage(nextStage) {
    // Clean up timers
    if (state.countdownTimer) {
      clearInterval(state.countdownTimer);
      clearTimeout(state.countdownTimer);
      state.countdownTimer = null;
    }
    if (state.balloonTimer) clearTimeout(state.balloonTimer);
    if (state.daughterTimer) {
      clearInterval(state.daughterTimer);
      clearTimeout(state.daughterTimer);
      state.daughterTimer = null;
    }

    state.stage = nextStage;

    // Reset scene specific states when entering
    if (nextStage === 'welcome') {
      state.welcomeSubStage = 'message';
      state.welcomeLit = false;
      state.welcomePin = '';
      state.welcomePinError = false;
      state.welcomeMatchPos = null;
      state.welcomeDragging = false;
    } else if (nextStage === 'countdown') {
      state.countdownVal = 5;
      state.countdownCelebrate = false;
      startCountdown();
    } else if (nextStage === 'balloons') {
      if (state.balloonTimer) clearTimeout(state.balloonTimer);
      state.balloonIndex = 0;
      state.balloonPopped = false;
      state.balloonMessage = false;
      state.balloonAllDone = false;
    } else if (nextStage === 'daughter') {
      initDaughterWishes();
    } else if (nextStage === 'family') {
      state.familyIndex = 0;
    } else if (nextStage === 'final') {
      state.finalConfetti = true;
    }

    render();
  }

  // --- Countdown Logic ---
  function startCountdown() {
    if (state.countdownTimer) {
      clearInterval(state.countdownTimer);
      clearTimeout(state.countdownTimer);
      state.countdownTimer = null;
    }

    const now = new Date().getTime();
    const target = new Date(BIRTHDAY_TARGET_DATE).getTime();
    let diff = isNaN(target) ? 0 : target - now;

    state.countdownDiffMs = diff;

    if (diff > 5000) {
      state.countdownMode = 'timer';
      render();

      function updateTimer() {
        const nowMs = new Date().getTime();
        const remMs = target - nowMs;
        state.countdownDiffMs = remMs;

        if (remMs > 5000) {
          const timerBox = document.getElementById('countdown-timer-box');
          if (timerBox) {
            const pad = (n) => String(n).padStart(2, '0');
            const days = Math.floor(remMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remMs / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((remMs / (1000 * 60)) % 60);
            const seconds = Math.floor((remMs / 1000) % 60);

            const dEl = document.getElementById('timer-days');
            const hEl = document.getElementById('timer-hours');
            const mEl = document.getElementById('timer-mins');
            const sEl = document.getElementById('timer-secs');

            if (dEl) dEl.textContent = pad(days);
            if (hEl) hEl.textContent = pad(hours);
            if (mEl) mEl.textContent = pad(minutes);
            if (sEl) sEl.textContent = pad(seconds);
          } else {
            render();
          }
        } else {
          if (state.countdownTimer) clearInterval(state.countdownTimer);
          runFinalCountdown(Math.max(1, Math.ceil(remMs / 1000)));
        }
      }

      state.countdownTimer = setInterval(updateTimer, 1000);
    } else {
      // Always run dramatic 5..4..3..2..1 countdown
      runFinalCountdown(5);
    }
  }

  function runFinalCountdown(startVal = 5) {
    if (state.countdownTimer) {
      clearInterval(state.countdownTimer);
      clearTimeout(state.countdownTimer);
      state.countdownTimer = null;
    }
    state.countdownMode = 'final';
    state.countdownVal = startVal;
    render();

    function step() {
      state.countdownTimer = setTimeout(() => {
        if (state.countdownVal > 1) {
          state.countdownVal -= 1;
          render();
          step();
        } else {
          state.countdownMode = 'celebrate';
          render();
        }
      }, 1000);
    }
    step();
  }

  // --- Daughter Wishes Logic ---
  function initDaughterWishes() {
    if (state.daughterTimer) {
      clearInterval(state.daughterTimer);
      clearTimeout(state.daughterTimer);
    }

    state.daughterPhase = 'typing';
    state.daughterTypedText = '';
    render();

    const fullGibberish = daughterWish.gibberish;
    let charIdx = 0;

    const typeInterval = setInterval(() => {
      if (charIdx < fullGibberish.length) {
        state.daughterTypedText += fullGibberish[charIdx];
        charIdx++;
        const typedEl = document.getElementById('daughter-typed-text');
        if (typedEl) {
          typedEl.textContent = state.daughterTypedText;
        } else {
          render();
        }
      } else {
        clearInterval(typeInterval);
        state.daughterTimer = setTimeout(() => {
          state.daughterPhase = 'translating';
          render();

          state.daughterTimer = setTimeout(() => {
            state.daughterPhase = 'translated';
            render();
          }, 1400);
        }, 700);
      }
    }, 45);
  }

  // --- HTML Builders ---
  function sceneBgHTML() {
    return '';
  }

  function floatingDecorHTML() {
    return '';
  }

  function confettiHTML(count = 50) {
    const colors = ['#ff6b8a', '#ffbe3d', '#7fd1b6', '#5bb4d6', '#ff8fa3'];
    let html = '<div class="pointer-events-none fixed inset-0 z-30 overflow-hidden">';
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const dur = 2.5 + Math.random() * 2;
      const color = colors[i % colors.length];
      const size = 6 + Math.random() * 8;
      html += `<div class="absolute top-0 animate-confetti-fall" style="left:${left}%; width:${size}px; height:${size * 1.4}px; background:${color}; border-radius:2px; animation-delay:${delay}s; animation-duration:${dur}s;"></div>`;
    }
    html += '</div>';
    return html;
  }

  let lastStage = null;

  // --- Main Render Function ---
  function render() {
    let content = '';

    if (state.stage === 'welcome') {
      content = renderWelcomeScene();
    } else if (state.stage === 'countdown') {
      content = renderCountdownScene();
    } else if (state.stage === 'balloons') {
      content = renderBalloonScene();
    } else if (state.stage === 'photos') {
      content = renderPhotosScene();
    } else if (state.stage === 'cake') {
      content = renderCakeScene();
    } else if (state.stage === 'daughter') {
      content = renderDaughterWishesScene();
    } else if (state.stage === 'family') {
      content = renderFamilyWishesScene();
    } else if (state.stage === 'husband') {
      content = renderHusbandLetterScene();
    } else if (state.stage === 'final') {
      content = renderFinalScene();
    }

    const isNewStage = lastStage !== state.stage;
    lastStage = state.stage;
    const animClass = isNewStage ? 'scene-enter' : '';

    app.innerHTML = `<div class="${animClass} min-h-[100dvh] w-full flex flex-col justify-center items-center">${content}</div>`;

    attachEvents();
  }

  // --- Scene 1: Welcome Scene ---
  function renderWelcomeScene() {
    let inner = '';

    if (state.welcomeSubStage === 'message') {
      inner = `
        <div data-action="welcome-next-stage" class="fixed inset-0 z-20 flex flex-col items-center justify-center text-center px-6 cursor-pointer select-none">
          <div class="mb-6 text-5xl animate-float-slow">🩷</div>
          <h1 class="font-display text-5xl text-rose-600 glow-text animate-fade-up">
            ${welcomeMessage.title}
          </h1>
        </div>
      `;
    } else if (state.welcomeSubStage === 'candle') {
      const matchStyle = state.welcomeMatchPos
        ? `left: ${state.welcomeMatchPos.x}px; top: ${state.welcomeMatchPos.y}px; transform: translate(-50%, -100%) rotate(35deg); transition: none;`
        : `left: 50%; top: 70%; transform: translate(-50%, 0) rotate(35deg); transition: left 0.3s ease, top 0.3s ease;`;

      inner = `
        <div ${state.welcomeLit ? 'data-action="welcome-to-pin"' : ''} class="${state.welcomeLit ? 'fixed inset-0 z-20 cursor-pointer justify-center' : 'w-full px-6'} flex flex-col items-center text-center">
          <p class="font-script text-3xl text-rose-500 animate-fade-up mb-8">
            ${state.welcomeLit ? 'A wish is ready...' : 'Light the candle...'}
          </p>

          <div id="candle-container" class="relative flex flex-col items-center w-full max-w-xs h-80 justify-end pb-8">
            ${renderCakeGraphic(state.welcomeLit, false)}

            ${!state.welcomeLit ? `
              <div id="match-stick" class="absolute z-20 touch-none select-none cursor-grab active:cursor-grabbing" style="${matchStyle}">
                <div class="relative flex flex-col items-center pointer-events-none">
                  <div class="relative h-6 w-4 -mb-1">
                    <div class="absolute inset-0 rounded-full bg-sun-400 animate-flame-flicker blur-[4px] opacity-70"></div>
                    <div class="absolute inset-0 rounded-full animate-flame-flicker" style="background: radial-gradient(ellipse at 50% 80%, #fff3a0 0%, #ffbe3d 50%, #ff6b8a 90%, transparent 100%);"></div>
                  </div>
                  <div class="h-20 w-1.5 rounded-full bg-gradient-to-b from-ink-700/80 to-ink-700/40"></div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    } else if (state.welcomeSubStage === 'pin') {
      const pinLength = BIRTHDAY_PIN.length;
      const pinDots = Array.from({ length: pinLength }).map((_, i) => `
        <div class="h-4 w-4 rounded-full border-2 transition-all ${state.welcomePinError
          ? 'border-rose-500 bg-rose-500/20 animate-wiggle'
          : state.welcomePin.length > i
            ? 'border-rose-500 bg-rose-500'
            : 'border-ink-700/30 bg-transparent'
        }"></div>
      `).join('');

      const keys = [
        { key: '1', display: '1' },
        { key: '5', display: '5' },
        { key: '8', display: '8' },
        {
          key: '🔄',
          display: `<svg class="h-6 w-6 text-ink-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>`
        },
        { key: '0', display: '0' },
        {
          key: '⌫',
          display: `<svg class="h-6 w-6 text-ink-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>`
        },
      ];
      const keypadHTML = keys.map((item) => `
        <button data-action="pin-key" data-key="${item.key}" class="h-16 w-16 rounded-2xl bg-white/80 text-2xl font-semibold text-ink-800 soft-shadow active:scale-95 transition-transform backdrop-blur cursor-pointer flex items-center justify-center">
          ${item.display}
        </button>
      `).join('');

      inner = `
        <div class="flex w-full max-w-xs flex-col items-center text-center px-6">
          <p class="font-script text-3xl text-rose-500 mb-8">Your secret code</p>

          <div class="flex gap-2.5 mb-6 flex-wrap justify-center">${pinDots}</div>

          ${state.welcomePinError ? `
            <div class="bg-rose-500/10 border border-rose-400/40 rounded-2xl px-4 py-2.5 mb-6 animate-fade-up max-w-[240px]">
              <p class="text-rose-600 text-xs font-semibold leading-relaxed">${state.pinErrorMsg || 'Oopsie! Not quite... try again 💕'}</p>
            </div>
          ` : '<div class="h-12 mb-2"></div>'}

          <div class="grid grid-cols-3 gap-3.5 w-full max-w-[240px] justify-items-center">${keypadHTML}</div>
        </div>
      `;
    }

    return sceneBgHTML() + floatingDecorHTML(16) + inner;
  }

  // Cake graphic helper
  function renderCakeGraphic(lit = false, cut = false) {
    const isSmoking = state.cakeDragging || cut;
    const flameOrSmokeHTML = isSmoking ? `
      <div class="relative h-9 w-5 -mb-1 flex items-center justify-center pointer-events-none">
        <div class="absolute -top-3 h-4 w-1.5 rounded-full bg-ink-700/50 blur-[1px] animate-float-slow"></div>
        <div class="absolute -top-6 h-6 w-2.5 rounded-full bg-ink-700/30 blur-[2px] animate-float-slow" style="animation-delay: 0.3s;"></div>
      </div>
    ` : lit ? `
      <div class="relative h-9 w-5 -mb-1">
        <div class="absolute inset-0 rounded-full bg-sun-400 animate-flame-flicker blur-[6px] opacity-70"></div>
        <div class="absolute inset-0 rounded-full animate-flame-flicker" style="background: radial-gradient(ellipse at 50% 80%, #fff3a0 0%, #ffbe3d 40%, #ff6b8a 75%, transparent 100%);"></div>
      </div>
    ` : '<div class="h-3 w-px bg-ink-700/40"></div>';

    if (cut) {
      return `
        <div class="relative flex items-end justify-center gap-3">
          <!-- Main Cake with Cut-out Wedge Notch -->
          <div class="relative flex flex-col items-center select-none">
            <!-- Candle -->
            <div id="candle-wick-target" class="relative z-10 mb-1 flex flex-col items-center">
              <div class="relative h-9 flex items-end justify-center">
                ${flameOrSmokeHTML}
              </div>
              <div class="-mt-0.5 h-2 w-px bg-ink-900"></div>
              <div class="w-7 h-14 rounded-t-md rounded-b-sm soft-shadow" style="background: linear-gradient(90deg, #ffd2b3 0%, #fff3ea 25%, #fffaf6 50%, #fff3ea 75%, #ffd2b3 100%);"></div>
            </div>

            <!-- Main Cake Body with triangular cut notch -->
            <div id="cake-target" class="relative">
              <!-- Top tier cut -->
              <div class="relative h-20 w-40 mx-auto rounded-t-xl rounded-b-md bg-gradient-to-b from-rose-400 to-rose-500 soft-shadow overflow-hidden">
                <div class="absolute top-2 left-0 right-0 h-2 flex justify-center gap-1">
                  ${[...Array(8)].map(() => '<span class="h-2 w-2 rounded-full bg-white/70"></span>').join('')}
                </div>
                <!-- Triangular Wedge Cut-out notch -->
                <div class="absolute top-0 right-2 bottom-0 w-10 bg-rose-300 border-l-2 border-white/80 flex items-center justify-center shadow-inner">
                  <div class="h-full w-full bg-gradient-to-b from-rose-200 via-white to-rose-300 opacity-95"></div>
                </div>
              </div>
              <!-- Bottom tier cut -->
              <div class="relative h-24 w-56 mx-auto rounded-t-md rounded-b-xl bg-gradient-to-b from-rose-500 to-rose-600 soft-shadow -mt-1 overflow-hidden">
                <div class="absolute top-3 left-0 right-0 flex justify-center gap-1">
                  ${[...Array(11)].map(() => '<span class="h-2 w-2 rounded-full bg-white/70"></span>').join('')}
                </div>
                <!-- Triangular Wedge Cut-out notch -->
                <div class="absolute top-0 right-3 bottom-0 w-12 bg-rose-400 border-l-2 border-white/80 shadow-inner">
                  <div class="h-full w-full bg-gradient-to-b from-rose-300 via-white to-rose-500 opacity-95"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cut-out Cake Slice Piece on Mini Plate -->
          <div class="relative flex flex-col items-center animate-pop-in transform translate-y-3">
            <div class="relative w-14 h-24 flex flex-col items-center">
              <!-- Slice frosting top -->
              <div class="w-12 h-10 bg-gradient-to-b from-rose-400 to-rose-500 rounded-t-lg rounded-b-sm soft-shadow relative overflow-hidden border-b border-white">
                <div class="absolute top-1 left-1.5 h-2 w-2 rounded-full bg-white/80"></div>
                <div class="absolute bottom-1 inset-x-0 h-1 bg-white/90"></div>
              </div>
              <!-- Slice cake body layers -->
              <div class="w-14 h-14 bg-gradient-to-b from-rose-500 via-rose-300 to-rose-600 rounded-b-md soft-shadow relative overflow-hidden flex flex-col justify-between py-1 border-t border-rose-200">
                <div class="h-1.5 w-full bg-white/90"></div>
                <div class="h-1.5 w-full bg-white/90"></div>
              </div>
            </div>
            <!-- Mini Plate -->
            <div class="w-16 h-2.5 rounded-full bg-white soft-shadow -mt-1 border border-rose-200"></div>
          </div>
        </div>
      `;
    }

    return `
      <div class="relative flex flex-col items-center">
        <!-- Candle -->
        <div id="candle-wick-target" class="relative z-10 mb-1 flex flex-col items-center">
          <div class="relative h-9 flex items-end justify-center">
            ${flameOrSmokeHTML}
          </div>
          <div class="-mt-0.5 h-2 w-px ${lit ? 'bg-ink-900' : 'bg-ink-700/40'}"></div>
          <div class="w-7 h-14 rounded-t-md rounded-b-sm soft-shadow" style="background: linear-gradient(90deg, #ffd2b3 0%, #fff3ea 25%, #fffaf6 50%, #fff3ea 75%, #ffd2b3 100%);"></div>
          ${(lit && !isSmoking) ? '<div class="absolute -inset-8 -z-10 rounded-full bg-sun-400/20 blur-3xl"></div>' : ''}
        </div>

        <!-- Cake body -->
        <div id="cake-target" class="relative select-none">
          <!-- Top tier -->
          <div class="relative h-20 w-44 mx-auto rounded-t-xl rounded-b-md bg-gradient-to-b from-rose-400 to-rose-500 soft-shadow">
            <div class="absolute top-2 left-0 right-0 h-2 flex justify-center gap-1">
              ${[...Array(10)].map(() => '<span class="h-2 w-2 rounded-full bg-white/70"></span>').join('')}
            </div>
          </div>
          <!-- Bottom tier -->
          <div class="relative h-24 w-64 mx-auto rounded-t-md rounded-b-xl bg-gradient-to-b from-rose-500 to-rose-600 soft-shadow -mt-1">
            <div class="absolute top-3 left-0 right-0 flex justify-center gap-1">
              ${[...Array(14)].map(() => '<span class="h-2 w-2 rounded-full bg-white/70"></span>').join('')}
            </div>
            <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              ${[...Array(8)].map(() => '<span class="h-3 w-3 rounded-full bg-sun-400/90"></span>').join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Scene 2: Countdown Scene ---
  function renderCountdownScene() {
    if (state.countdownMode === 'celebrate') {
      return `
        ${confettiHTML(70)}
        <div data-action="countdown-to-balloons" class="fixed inset-0 z-20 flex flex-col items-center justify-center text-center px-6 cursor-pointer select-none">
          <h2 class="font-display text-6xl text-rose-600 glow-text animate-pop-in">
            Happy Birthday!
          </h2>
        </div>
      `;
    }

    if (state.countdownMode === 'final') {
      return `
        <div class="flex flex-col items-center text-center px-6">
          <div key="${state.countdownVal}" class="font-display text-9xl text-rose-600 glow-text animate-pop-in">
            ${state.countdownVal}
          </div>
        </div>
      `;
    }

    const diff = Math.max(0, state.countdownDiffMs);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const pad = (n) => String(n).padStart(2, '0');

    return `
      <div id="countdown-timer-box" class="flex flex-col items-center text-center px-6 max-w-md w-full">
        <div class="flex gap-2 sm:gap-3 justify-center items-center font-display text-rose-600 glow-text">
          ${days > 0 ? `
            <div class="flex flex-col bg-white/80 backdrop-blur rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 min-w-[64px] sm:min-w-[72px] soft-shadow border border-rose-100/50">
              <span id="timer-days" class="text-3xl sm:text-4xl font-bold font-body text-rose-600">${pad(days)}</span>
              <span class="text-[10px] sm:text-xs font-body text-ink-700/70 tracking-wider uppercase">Days</span>
            </div>
            <span class="text-2xl font-bold text-rose-400 pb-3">:</span>
          ` : ''}
          <div class="flex flex-col bg-white/80 backdrop-blur rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 min-w-[64px] sm:min-w-[72px] soft-shadow border border-rose-100/50">
            <span id="timer-hours" class="text-3xl sm:text-4xl font-bold font-body text-rose-600">${pad(hours)}</span>
            <span class="text-[10px] sm:text-xs font-body text-ink-700/70 tracking-wider uppercase">Hours</span>
          </div>
          <span class="text-2xl font-bold text-rose-400 pb-3">:</span>
          <div class="flex flex-col bg-white/80 backdrop-blur rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 min-w-[64px] sm:min-w-[72px] soft-shadow border border-rose-100/50">
            <span id="timer-mins" class="text-3xl sm:text-4xl font-bold font-body text-rose-600">${pad(minutes)}</span>
            <span class="text-[10px] sm:text-xs font-body text-ink-700/70 tracking-wider uppercase">Mins</span>
          </div>
          <span class="text-2xl font-bold text-rose-400 pb-3">:</span>
          <div class="flex flex-col bg-white/80 backdrop-blur rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 min-w-[64px] sm:min-w-[72px] soft-shadow border border-rose-100/50">
            <span id="timer-secs" class="text-3xl sm:text-4xl font-bold font-body text-rose-600">${pad(seconds)}</span>
            <span class="text-[10px] sm:text-xs font-body text-ink-700/70 tracking-wider uppercase">Secs</span>
          </div>
        </div>
      </div>
    `;
  }

  // --- Scene 3: Balloon Scene ---
  function renderBalloonScene() {
    const current = balloons[state.balloonIndex];
    const isPopped = state.balloonPopped;
    const showMsg = state.balloonMessage;

    return `
      ${sceneBgHTML()}
      ${floatingDecorHTML(16)}
      <div class="flex flex-col items-center text-center px-6 py-12 w-full max-w-md">
        <h2 class="font-display text-4xl text-rose-600 glow-text mb-8 animate-fade-up">
          Pop the balloon!
        </h2>

        <div key="${state.balloonIndex}" class="relative flex flex-col items-center select-none w-full min-h-[300px] justify-center animate-pop-in">
          <button data-action="pop-balloon" class="relative outline-none cursor-pointer group" aria-label="Pop balloon">
            ${!isPopped ? `
              <div class="relative animate-float-mid">
                <div class="h-36 w-28 rounded-[50%] soft-shadow relative overflow-hidden transition-transform group-hover:scale-105" style="background: ${current.color}">
                  <div class="absolute top-3 left-4 h-12 w-6 rounded-full bg-white/40 blur-[3px]"></div>
                  <div class="absolute bottom-1 left-1/2 -translate-x-1/2 h-3 w-4 rounded-b-sm bg-black/15"></div>
                </div>
                <div class="mx-auto h-16 w-0.5 bg-ink-700/30"></div>
              </div>
            ` : `
              <div class="h-36 w-28 flex items-center justify-center">
                <div class="absolute animate-pop-in">
                  ${[...Array(12)].map((_, idx) => `
                    <div class="absolute h-2.5 w-2.5 rounded-full" style="background: ${current.color}; transform: rotate(${idx * 30}deg) translateY(-45px);"></div>
                  `).join('')}
                </div>
              </div>
            `}
          </button>

          ${showMsg ? `
            <div class="mt-4 w-full max-w-xs animate-fade-up rounded-2xl bg-white/95 px-5 py-4 text-center text-base font-medium text-ink-800 soft-shadow backdrop-blur border border-rose-100">
              "${current.message}"
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // --- Scene 4: Photos Scene ---
  function renderPhotosScene() {
    const current = galleryPhotos[state.photoIndex];
    const nextPhoto = galleryPhotos[state.photoIndex + 1];
    const thirdPhoto = galleryPhotos[state.photoIndex + 2];

    const fallbackImg = "https://images.pexels.com/photos/3521979/pexels-photo-3521979.jpeg?auto=compress&cs=tinysrgb&w=600";
    const imgErr = `onerror="if (!this.dataset.retry) { this.dataset.retry = '1'; this.src = this.src.replace(/\\.(jpeg|jpg|png)$/i, '.png'); } else if (this.dataset.retry === '1') { this.dataset.retry = '2'; this.src = this.src.replace(/\\.(jpeg|jpg|png)$/i, '.jpeg'); } else if (this.dataset.retry === '2') { this.dataset.retry = '3'; this.src = this.src.replace(/\\.(jpeg|jpg|png)$/i, '.jpg'); } else { this.onerror=null; this.src='${fallbackImg}'; }"`;

    return `
      ${sceneBgHTML()}
      ${floatingDecorHTML(16)}
      <div class="flex flex-col items-center text-center px-6 py-12 w-full max-w-md">
        <h2 class="font-display text-4xl text-rose-600 glow-text mb-8 animate-fade-up">Look at you!</h2>

        <div class="relative w-full max-w-xs h-[380px] flex justify-center items-center select-none">
          <!-- 3rd card in stack (bottom peek layer) -->
          ${thirdPhoto ? `
            <div class="absolute inset-0 pointer-events-none transform translate-x-2.5 translate-y-4 -rotate-4 scale-[0.92] opacity-50 z-0">
              <div class="relative overflow-hidden rounded-3xl soft-shadow bg-white p-3 text-center border border-rose-100/50">
                <img src="${thirdPhoto.src}" ${imgErr} alt="Photo" class="h-80 w-full rounded-2xl object-cover" />
              </div>
            </div>
          ` : ''}

          <!-- 2nd card in stack (middle peek layer) -->
          ${nextPhoto ? `
            <div class="absolute inset-0 pointer-events-none transform -translate-x-2 translate-y-2.5 rotate-3 scale-[0.96] opacity-85 z-5">
              <div class="relative overflow-hidden rounded-3xl soft-shadow bg-white p-3 text-center border border-rose-100/50">
                <img src="${nextPhoto.src}" ${imgErr} alt="Photo" class="h-80 w-full rounded-2xl object-cover" />
              </div>
            </div>
          ` : ''}

          <!-- Top active card -->
          <div id="swipe-photo-card" class="absolute inset-0 cursor-grab active:cursor-grabbing touch-none z-10">
            <div class="relative overflow-hidden rounded-3xl soft-shadow bg-white p-3 text-center border border-rose-100">
              <img src="${current.src}" ${imgErr} alt="Photo" class="h-80 w-full rounded-2xl object-cover pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Scene 5: Cake Scene ---
  function renderCakeScene() {
    const knifeStyle = state.cakeKnifePos
      ? `left: ${state.cakeKnifePos.x}px; top: ${state.cakeKnifePos.y}px; transform: translate(-50%, -50%) rotate(40deg); transition: none;`
      : `left: 50%; top: 85%; transform: translate(-50%, 0) rotate(40deg); transition: left 0.3s ease, top 0.3s ease;`;

    return `
      ${sceneBgHTML()}
      ${floatingDecorHTML(16)}
      ${state.cakeCut ? confettiHTML(70) : ''}
      <div ${state.cakeCut ? 'data-action="cake-done"' : ''} class="flex flex-col items-center text-center px-6 py-12 w-full ${state.cakeCut ? 'cursor-pointer' : ''}">
        <h2 class="font-display text-4xl text-rose-600 glow-text mb-8 animate-fade-up">
          ${state.cakeCut ? 'Yay! Happy Birthday!' : 'Cut the cake!'}
        </h2>

        <div id="cake-container" class="relative flex flex-col items-center w-full max-w-xs h-80 justify-end pb-4">
          ${renderCakeGraphic(true, state.cakeCut)}

          ${!state.cakeCut ? `
            <div id="knife-stick" class="absolute z-30 touch-none select-none cursor-grab active:cursor-grabbing" style="${knifeStyle}">
              <div class="relative flex items-center pointer-events-none" style="width: 120px">
                <div class="h-5 w-20 rounded-r-md" style="background: linear-gradient(180deg, #f5f5f5 0%, #d4d4d4 50%, #a3a3a3 100%); box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                  <div class="h-full w-full rounded-r-md" style="background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 60%);"></div>
                </div>
                <div class="h-4 w-12 -ml-1 rounded-l-md bg-gradient-to-b from-ink-700 to-ink-800 soft-shadow"></div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // --- Scene 6: Daughter Wishes Scene ---
  function renderDaughterWishesScene() {
    const isDone = state.daughterPhase === 'translated';

    return `
      ${sceneBgHTML()}
      ${floatingDecorHTML(16)}
      <div ${isDone ? 'data-action="next-daughter-wish"' : ''} class="flex flex-col items-center text-center px-6 py-12 w-full max-w-md ${isDone ? 'cursor-pointer' : ''}">
        <h2 class="font-display text-4xl text-rose-600 glow-text mb-8 animate-fade-up">A wish from Minni</h2>

        <div class="relative w-full max-w-sm min-h-[8rem] animate-pop-in">
          ${state.daughterPhase === 'typing' ? `
            <div class="rounded-3xl bg-white/95 px-6 py-8 soft-shadow backdrop-blur border border-rose-200/80">
              <p id="daughter-typed-text" class="font-script text-3xl text-rose-600 leading-relaxed">${state.daughterTypedText}</p>
              <p class="font-body text-xs text-ink-700/60 mt-3 animate-pulse">...babbling something sweet...</p>
            </div>
          ` : state.daughterPhase === 'translating' ? `
            <div class="rounded-3xl bg-white/95 px-6 py-8 soft-shadow backdrop-blur border border-rose-200 flex flex-col items-center justify-center animate-fade-in py-10">
              <div class="flex items-center gap-2 text-rose-500 font-script text-2xl animate-pulse">
                <span>Translating Minni's babble...</span>
                <span class="animate-spin text-xl">✨</span>
              </div>
            </div>
          ` : `
            <div class="rounded-3xl bg-white/95 px-7 py-8 soft-shadow backdrop-blur border border-rose-200/80 animate-pop-in">
              <p class="font-body text-base text-ink-800 leading-relaxed font-medium">"${daughterWish.wish}"</p>
              <p class="font-script text-xl text-rose-500 mt-4">— Minni 💕</p>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // --- Scene 7: Family Wishes Scene ---
  function renderFamilyWishesScene() {
    const wish = familyWishes[state.familyIndex];

    return `
      ${sceneBgHTML()}
      ${floatingDecorHTML(16)}
      <div data-action="next-family-wish" class="flex flex-col items-center text-center px-6 py-12 w-full max-w-md cursor-pointer select-none">
        <h2 class="font-display text-4xl text-rose-600 glow-text mb-8 animate-fade-up">Wishes from your family</h2>

        <div class="w-full max-w-sm animate-pop-in">
          <div class="relative rounded-3xl bg-white/95 px-7 py-8 soft-shadow backdrop-blur border border-rose-200/80 text-left">
            <p class="font-script text-3xl text-rose-600 mb-4">${wish.from}</p>
            <p class="font-body text-base text-ink-800 leading-relaxed font-medium">"${wish.message}"</p>
          </div>
        </div>
      </div>
    `;
  }

  // --- Scene: Husband Love Letter Scene ---
  function renderHusbandLetterScene() {
    return `
      ${sceneBgHTML()}
      ${floatingDecorHTML(16)}
      <div data-action="husband-done" class="flex flex-col items-center text-center px-6 py-12 w-full max-w-md cursor-pointer select-none">
        <h2 class="font-display text-4xl text-rose-600 glow-text mb-6 animate-fade-up">${husbandLetter.title}</h2>

        <div class="w-full max-w-sm animate-pop-in">
          <div class="relative rounded-3xl bg-white/95 px-7 py-8 soft-shadow backdrop-blur border border-rose-200/80 text-left">
            <div class="absolute -top-4 right-6 text-3xl animate-bounce">💌</div>

            <p class="font-script text-3xl text-rose-600 mb-4">${husbandLetter.salutation}</p>
            <p class="font-body text-base text-ink-800 leading-relaxed mb-6 font-medium">${husbandLetter.body}</p>

            <div class="text-right border-t border-rose-100 pt-4">
              <p class="font-script text-xl text-ink-700/80">${husbandLetter.signoff}</p>
              <p class="font-script text-2xl text-rose-600 font-bold mt-1">${husbandLetter.signature}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Scene 8: Final Scene ---
  function renderFinalScene() {
    return `
      ${sceneBgHTML()}
      ${floatingDecorHTML(16)}
      ${state.finalConfetti ? confettiHTML(50) : ''}
      <div class="flex flex-col items-center text-center px-6 py-12 w-full max-w-md">
        <div class="relative mb-8 flex justify-center items-center animate-pop-in">
          <!-- Sparkle glow rings -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="h-28 w-28 rounded-full bg-rose-400/20 blur-xl animate-pulse"></div>
            <div class="h-20 w-20 rounded-full bg-sun-400/20 blur-lg animate-pulse" style="animation-delay: 0.5s;"></div>
          </div>
          
          <!-- Animated celebration badge -->
          <div class="relative flex items-center justify-center gap-3">
            <span class="text-4xl animate-bounce" style="animation-delay: 0.1s;">🥳</span>
            <span class="text-5xl animate-wiggle">🎉</span>
            <span class="text-4xl animate-bounce" style="animation-delay: 0.3s;">🎁</span>
          </div>
        </div>

        <h2 class="font-display text-5xl text-rose-600 glow-text animate-fade-up">${finalWish.title}</h2>
        <p class="font-body text-lg text-ink-800 leading-relaxed mt-6 max-w-sm animate-fade-up" style="animation-delay: 0.3s">${finalWish.message}</p>
        <p class="font-display text-2xl text-ink-700/60 mt-12 animate-fade-in" style="animation-delay: 1s">
          Happy Birthday 🎂
        </p>
      </div>
    `;
  }

  function renderCandleGraphic(lit = true, size = 'sm') {
    const dims = {
      sm: { w: 'w-6', h: 'h-16', flame: 'h-7 w-5' },
      md: { w: 'w-8', h: 'h-24', flame: 'h-10 w-6' },
      lg: { w: 'w-10', h: 'h-32', flame: 'h-12 w-7' },
    }[size];

    return `
      <div class="relative flex flex-col items-center">
        <div class="relative h-10 flex items-end justify-center">
          ${lit ? `
            <div class="relative ${dims.flame} -mb-1">
              <div class="absolute inset-0 rounded-full bg-sun-400 animate-flame-flicker blur-[6px] opacity-70"></div>
              <div class="absolute inset-0 rounded-full animate-flame-flicker" style="background: radial-gradient(ellipse at 50% 80%, #fff3a0 0%, #ffbe3d 40%, #ff6b8a 75%, transparent 100%);"></div>
            </div>
          ` : '<div class="h-3 w-px bg-ink-700/40"></div>'}
        </div>
        <div class="-mt-0.5 h-2 w-px ${lit ? 'bg-ink-900' : 'bg-ink-700/40'}"></div>
        <div class="${dims.w} ${dims.h} rounded-t-md rounded-b-sm soft-shadow" style="background: linear-gradient(90deg, #ffd2b3 0%, #fff3ea 25%, #fffaf6 50%, #fff3ea 75%, #ffd2b3 100%);"></div>
        ${lit ? '<div class="absolute -inset-10 -z-10 rounded-full bg-sun-400/20 blur-3xl"></div>' : ''}
      </div>
    `;
  }

  // --- DOM Event Handling & Drag Interactions ---
  function attachEvents() {
    // Click delegation for buttons and interactive controls
    document.querySelectorAll('[data-action]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const action = el.getAttribute('data-action');
        if (action === 'welcome-next-stage') {
          state.welcomeSubStage = 'pin';
          render();
        } else if (action === 'welcome-to-pin') {
          setStage('countdown');
          render();
        } else if (action === 'countdown-to-balloons') {
          setStage('balloons');
        } else if (action === 'pin-key') {
          const key = el.getAttribute('data-key');
          const pinErrorMessages = [
            'Oopsie! Not quite right, silly goose! 💕',
            'Nice try sweetie! Give it another shot 🐥',
            'Almost there darling! Try one more time 💖',
            'Hmm, not quite! You can do it 🌟',
          ];

          if (key === '🔄') {
            state.welcomePin = '';
            state.welcomePinError = false;
            state.pinErrorMsg = '';
            render();
          } else if (key === '⌫') {
            state.welcomePin = state.welcomePin.slice(0, -1);
            state.welcomePinError = false;
            render();
          } else if (state.welcomePin.length < BIRTHDAY_PIN.length) {
            state.welcomePin += key;
            state.welcomePinError = false;
            render();
            if (state.welcomePin.length === BIRTHDAY_PIN.length) {
              if (state.welcomePin === BIRTHDAY_PIN) {
                setTimeout(() => {
                  state.welcomeSubStage = 'candle';
                  render();
                }, 350);
              } else {
                setTimeout(() => {
                  state.welcomePinError = true;
                  state.pinErrorMsg = pinErrorMessages[state.pinErrorIndex % pinErrorMessages.length];
                  state.pinErrorIndex = (state.pinErrorIndex + 1) % pinErrorMessages.length;
                  state.welcomePin = '';
                  render();
                }, 250);
              }
            }
          }
        } else if (action === 'pop-balloon') {
          if (!state.balloonPopped) {
            state.balloonPopped = true;
            state.balloonMessage = true;
            render();

            if (state.balloonTimer) clearTimeout(state.balloonTimer);
            state.balloonTimer = setTimeout(() => {
              if (state.balloonIndex < balloons.length - 1) {
                state.balloonIndex += 1;
                state.balloonPopped = false;
                state.balloonMessage = false;
                render();
              } else {
                setStage('photos');
              }
            }, 2800);
          }
        } else if (action === 'balloons-done') {
          setStage('photos');
        } else if (action === 'next-photo') {
          if (state.photoIndex < galleryPhotos.length - 1) {
            state.photoIndex += 1;
            render();
          } else {
            setStage('cake');
          }
        } else if (action === 'cake-done') {
          setStage('daughter');
        } else if (action === 'next-daughter-wish') {
          setStage('family');
        } else if (action === 'next-family-wish') {
          if (state.familyIndex < familyWishes.length - 1) {
            state.familyIndex += 1;
            render();
          } else {
            setStage('husband');
          }
        } else if (action === 'husband-done') {
          setStage('final');
        } else if (action === 'toggle-confetti') {
          state.finalConfetti = !state.finalConfetti;
          render();
        } else if (action === 'replay-magic') {
          setStage('welcome');
        }
      });
    });

    // Pointer events for swipable photo card deck in Photos Scene
    const photoCard = document.getElementById('swipe-photo-card');
    if (photoCard) {
      let startX = 0;
      let startY = 0;
      let isDragging = false;

      photoCard.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        photoCard.setPointerCapture(e.pointerId);
        photoCard.style.transition = 'none';
      });

      photoCard.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const rotate = deltaX * 0.07;
        photoCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
      });

      const handleRelease = (e) => {
        if (!isDragging) return;
        isDragging = false;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const dist = Math.hypot(deltaX, deltaY);

        if (dist > 75) {
          // Swiped away! Fly off in direction of swipe
          const flyX = deltaX * 4;
          const flyY = deltaY * 4;
          const flyRotate = deltaX * 0.15;
          photoCard.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
          photoCard.style.transform = `translate(${flyX}px, ${flyY}px) rotate(${flyRotate}deg)`;
          photoCard.style.opacity = '0';

          setTimeout(() => {
            if (state.photoIndex < galleryPhotos.length - 1) {
              state.photoIndex += 1;
              render();
            } else {
              setStage('cake');
            }
          }, 280);
        } else {
          // Snap back to center
          photoCard.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          photoCard.style.transform = 'translate(0px, 0px) rotate(0deg)';
        }
      };

      photoCard.addEventListener('pointerup', handleRelease);
      photoCard.addEventListener('pointercancel', handleRelease);
    }

    // Pointer events for match stick in Welcome Scene
    const matchStick = document.getElementById('match-stick');
    const candleContainer = document.getElementById('candle-container');
    const candleWickTarget = document.getElementById('candle-wick-target');

    if (matchStick && candleContainer && candleWickTarget && !state.welcomeLit) {
      matchStick.addEventListener('pointerdown', (e) => {
        state.welcomeDragging = true;
        matchStick.setPointerCapture(e.pointerId);
        updateMatchPos(e);
      });

      matchStick.addEventListener('pointermove', (e) => {
        if (!state.welcomeDragging) return;
        updateMatchPos(e);

        // Hit test candle tip
        const cRect = candleContainer.getBoundingClientRect();
        const wRect = candleWickTarget.getBoundingClientRect();
        const tipPos = {
          x: wRect.left + wRect.width / 2 - cRect.left,
          y: wRect.top - cRect.top,
        };

        if (state.welcomeMatchPos) {
          // Flame tip is ~80px above match handle bottom
          const matchFlameX = state.welcomeMatchPos.x;
          const matchFlameY = state.welcomeMatchPos.y - 80;
          const dist = Math.hypot(tipPos.x - matchFlameX, tipPos.y - matchFlameY);
          if (dist < 32) {
            state.welcomeLit = true;
            state.welcomeDragging = false;
            state.welcomeMatchPos = null;
            render();
          }
        }
      });

      matchStick.addEventListener('pointerup', () => {
        state.welcomeDragging = false;
        if (!state.welcomeLit) {
          state.welcomeMatchPos = null;
          render();
        }
      });

      function updateMatchPos(e) {
        const cRect = candleContainer.getBoundingClientRect();
        state.welcomeMatchPos = {
          x: e.clientX - cRect.left,
          y: e.clientY - cRect.top,
        };
        matchStick.style.left = `${state.welcomeMatchPos.x}px`;
        matchStick.style.top = `${state.welcomeMatchPos.y}px`;
        matchStick.style.transform = 'translate(-50%, -100%) rotate(35deg)';
        matchStick.style.transition = 'none';
      }
    }

    // Pointer events for knife stick in Cake Scene
    const knifeStick = document.getElementById('knife-stick');
    const cakeContainer = document.getElementById('cake-container');
    const cakeTarget = document.getElementById('cake-target');

    if (knifeStick && cakeContainer && cakeTarget && !state.cakeCut) {
      knifeStick.addEventListener('pointerdown', (e) => {
        state.cakeDragging = true;
        state.cakeTopReached = false;
        knifeStick.setPointerCapture(e.pointerId);
        updateKnifePos(e);
        render();
      });

      knifeStick.addEventListener('pointermove', (e) => {
        if (!state.cakeDragging) return;
        updateKnifePos(e);

        const containerRect = cakeContainer.getBoundingClientRect();
        const cakeRect = cakeTarget.getBoundingClientRect();
        const center = {
          x: cakeRect.left + cakeRect.width / 2 - containerRect.left,
          y: cakeRect.top + cakeRect.height / 2 - containerRect.top,
        };

        if (state.cakeKnifePos) {
          // Check if knife was dragged UP past cake top
          if (state.cakeKnifePos.y < center.y - 30) {
            state.cakeTopReached = true;
          }

          // If knife was dragged UP first and then DOWN onto the cake
          const dist = Math.hypot(center.x - state.cakeKnifePos.x, center.y - state.cakeKnifePos.y);
          if (state.cakeTopReached && dist < 80) {
            state.cakeCut = true;
            state.cakeDragging = false;
            state.cakeKnifePos = null;
            render();
          }
        }
      });

      knifeStick.addEventListener('pointerup', () => {
        state.cakeDragging = false;
        if (!state.cakeCut) {
          state.cakeKnifePos = null;
          render();
        }
      });

      function updateKnifePos(e) {
        const containerRect = cakeContainer.getBoundingClientRect();
        state.cakeKnifePos = {
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top,
        };
        knifeStick.style.left = `${state.cakeKnifePos.x}px`;
        knifeStick.style.top = `${state.cakeKnifePos.y}px`;
        knifeStick.style.transform = 'translate(-50%, -50%) rotate(40deg)';
        knifeStick.style.transition = 'none';
      }
    }
  }

  // Initialize application
  render();
})();
