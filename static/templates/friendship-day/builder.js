(function() {
  window.WISH_BUILDERS = window.WISH_BUILDERS || {};

  const SECRET = 'friendship-day-2026-csrgo';

  function xorTransform(input) {
    let out = '';
    for (let i = 0; i < input.length; i++) {
      out += String.fromCharCode(input.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
    }
    return out;
  }

  function toBase64Url(str) {
    const utf8 = unescape(encodeURIComponent(str));
    let binary = '';
    for (let i = 0; i < utf8.length; i++) {
      binary += String.fromCharCode(utf8.charCodeAt(i));
    }
    const b64 = btoa(binary);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function encodeToken(payload) {
    return toBase64Url(xorTransform(JSON.stringify(payload)));
  }

  function slugifyName(name) {
    return (name || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'friend';
  }

  function toTitleCase(str) {
    if (typeof str !== 'string') return '';
    return str
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : '')
      .join(' ');
  }

  const PRESETS = [
    "Thank you for being the one person who never gave up on me. Happy Friendship Day!",
    "We’re definitely the kind of friends who’d help hide a body. No questions asked. Happy Friendship Day!",
    "Some friendships are written in the stars. Ours is one of them. Forever yours!",
    "You’re not just a friend, you’re the family I chose. Happy Friendship Day!",
    "You believed in me even when I forgot how to believe in myself. Grateful for you!",
    "You’re my favorite notification. Don’t tell the others!"
  ];

  window.WISH_BUILDERS['friendship-day'] = {
    renderForm: function(t) {
      return `
        <div class="flex flex-col gap-4 text-left">
          <div class="rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border border-purple-100 dark:border-purple-800/30 p-4">
            <h4 class="font-display text-lg font-bold text-ink-900 dark:text-white flex items-center gap-1.5">
              <span>✨</span> Create Your Friendship Wish
            </h4>
            <p class="text-xs text-ink-600 dark:text-gray-300 mt-0.5">
              Fill in your names & message to generate an interactive surprise link.
            </p>
          </div>

          <form id="friendship-wish-form" class="space-y-4">
            <!-- Your Name & Your Gender -->
            <div>
              <label class="text-xs sm:text-sm font-semibold text-ink-700 dark:text-gray-200 mb-1.5 block">
                Your Name & Gender <span class="text-purple-600">*</span>
              </label>
              <div class="flex flex-col xs:flex-row sm:flex-row gap-2">
                <input type="text" id="field-user-name" placeholder="e.g. Aarav" required class="field-input flex-1 text-sm" />
                <div class="flex shrink-0 rounded-xl border border-ink-200 dark:border-gray-700 bg-ink-50 dark:bg-gray-800 p-1 self-start sm:self-auto">
                  <button type="button" id="btn-ug-m" class="gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition bg-purple-600 text-white shadow-sm" data-gender="m">Male</button>
                  <button type="button" id="btn-ug-f" class="gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition text-ink-600 dark:text-gray-300 hover:bg-ink-100 dark:hover:bg-gray-700" data-gender="f">Female</button>
                </div>
              </div>
            </div>

            <!-- Friend's Name & Friend's Gender -->
            <div>
              <label class="text-xs sm:text-sm font-semibold text-ink-700 dark:text-gray-200 mb-1.5 block">
                Friend's Name & Gender <span class="text-purple-600">*</span>
              </label>
              <div class="flex flex-col xs:flex-row sm:flex-row gap-2">
                <input type="text" id="field-friend-name" placeholder="e.g. Maya" required class="field-input flex-1 text-sm" />
                <div class="flex shrink-0 rounded-xl border border-ink-200 dark:border-gray-700 bg-ink-50 dark:bg-gray-800 p-1 self-start sm:self-auto">
                  <button type="button" id="btn-fg-m" class="gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition text-ink-600 dark:text-gray-300 hover:bg-ink-100 dark:hover:bg-gray-700" data-gender="m">Male</button>
                  <button type="button" id="btn-fg-f" class="gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition bg-purple-600 text-white shadow-sm" data-gender="f">Female</button>
                </div>
              </div>
            </div>

            <!-- Custom Message -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-sm font-semibold text-ink-700 dark:text-gray-200">
                  Customised Message <span class="text-purple-600">*</span>
                </label>
                <button type="button" id="btn-pick-preset" class="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                  <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1 1.275-1.275L12 3z"/></svg>
                  Pick Idea
                </button>
              </div>
              <textarea id="field-custom-message" rows="3" maxlength="280" placeholder="Write something special for your bestie..." required class="field-input resize-none"></textarea>
              <div class="flex justify-between items-center mt-1 text-xs text-ink-400">
                <span>Revealed in interactive mini-games</span>
                <span id="char-count-indicator">0/280</span>
              </div>
            </div>

            <div id="wish-form-error" class="hidden rounded-xl bg-red-50 dark:bg-red-900/30 p-3 text-xs font-medium text-red-600 dark:text-red-300"></div>
          </form>

          <!-- Result Card (Initially Hidden) -->
          <div id="wish-result-card" class="hidden rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 space-y-3">
            <div class="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              <svg class="h-5 w-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              Your wish link is ready!
            </div>
            <p class="text-xs text-emerald-800 dark:text-emerald-200">
              Share this link with your friend. When opened, they'll play interactive mini-games to unlock your message!
            </p>
            <div id="generated-wish-url" class="rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-gray-900 p-2.5 text-xs font-mono text-emerald-800 dark:text-emerald-200 break-all select-all"></div>
            <div class="flex flex-wrap gap-2">
              <button type="button" id="btn-copy-wish-link" class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white dark:bg-gray-800 dark:border-gray-700 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition hover:bg-emerald-50">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Link
              </button>
              <button type="button" id="btn-open-wish-link" class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700">
                Open Wish
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    bindForm: function(t) {
      let state = { userGender: 'm', friendGender: 'f', presetIndex: 0 };

      const btnUgM = document.getElementById('btn-ug-m');
      const btnUgF = document.getElementById('btn-ug-f');
      const btnFgM = document.getElementById('btn-fg-m');
      const btnFgF = document.getElementById('btn-fg-f');

      if (btnUgM && btnUgF) {
        btnUgM.onclick = () => {
          state.userGender = 'm';
          btnUgM.className = 'gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition bg-purple-600 text-white shadow-sm';
          btnUgF.className = 'gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition text-ink-600 dark:text-gray-300 hover:bg-ink-100 dark:hover:bg-gray-700';
        };
        btnUgF.onclick = () => {
          state.userGender = 'f';
          btnUgF.className = 'gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition bg-purple-600 text-white shadow-sm';
          btnUgM.className = 'gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition text-ink-600 dark:text-gray-300 hover:bg-ink-100 dark:hover:bg-gray-700';
        };
      }

      if (btnFgM && btnFgF) {
        btnFgM.onclick = () => {
          state.friendGender = 'm';
          btnFgM.className = 'gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition bg-purple-600 text-white shadow-sm';
          btnFgF.className = 'gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition text-ink-600 dark:text-gray-300 hover:bg-ink-100 dark:hover:bg-gray-700';
        };
        btnFgF.onclick = () => {
          state.friendGender = 'f';
          btnFgF.className = 'gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition bg-purple-600 text-white shadow-sm';
          btnFgM.className = 'gender-btn rounded-lg px-3 py-1.5 text-xs font-semibold transition text-ink-600 dark:text-gray-300 hover:bg-ink-100 dark:hover:bg-gray-700';
        };
      }

      const btnPick = document.getElementById('btn-pick-preset');

      const msgArea = document.getElementById('field-custom-message');
      const charCounter = document.getElementById('char-count-indicator');
      const fwForm = document.getElementById('friendship-wish-form');

      if (msgArea && charCounter) {
        msgArea.oninput = () => {
          charCounter.textContent = `${msgArea.value.length}/280`;
        };
      }

      if (btnPick && msgArea) {
        btnPick.onclick = () => {
          msgArea.value = PRESETS[state.presetIndex % PRESETS.length];
          state.presetIndex++;
          if (charCounter) charCounter.textContent = `${msgArea.value.length}/280`;
        };
      }

      if (fwForm) {
        fwForm.onsubmit = (e) => {
          e.preventDefault();
          const uName = toTitleCase(document.getElementById('field-user-name').value);
          const fName = toTitleCase(document.getElementById('field-friend-name').value);
          const msg = document.getElementById('field-custom-message').value.trim();
          const errBox = document.getElementById('wish-form-error');

          if (!uName || !fName || !msg) {
            if (errBox) {
              errBox.textContent = 'Please fill in Your Name, Friend’s Name, and Custom Message.';
              errBox.classList.remove('hidden');
            }
            return;
          }
          if (errBox) errBox.classList.add('hidden');

          const payload = { u: uName, ug: state.userGender, f: fName, fg: state.friendGender, m: msg, t: Date.now() };
          const token = encodeToken(payload);
          const generatedUrl = `${window.location.origin}/templates/friendship-day/?token=${token}`;

          const resCard = document.getElementById('wish-result-card');
          const urlBox = document.getElementById('generated-wish-url');
          if (resCard && urlBox) {
            urlBox.textContent = generatedUrl;
            resCard.classList.remove('hidden');
            resCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const copyBtn = document.getElementById('btn-copy-wish-link');
            if (copyBtn) {
              copyBtn.onclick = async () => {
                try {
                  await navigator.clipboard.writeText(generatedUrl);
                  copyBtn.innerHTML = `<svg class="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg> Copied!`;
                  setTimeout(() => {
                    copyBtn.innerHTML = `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Link`;
                  }, 2500);
                } catch (err) {}
              };
            }

            const openBtn = document.getElementById('btn-open-wish-link');
            if (openBtn) {
              openBtn.onclick = () => {
                window.open(generatedUrl, '_blank');
              };
            }
          }
        };
      }
    }
  };
})();
