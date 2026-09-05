(function () {
  window.WISH_BUILDERS = window.WISH_BUILDERS || {};

  const WHATSAPP_NUMBER = '919392438319';
  const UPI_ID = 'csr850@okaxis';

  const DEFAULT_BALLOONS = [
    "You are so much stronger than you think. \u{1F31F}",
    "You are absolutely beautiful & gorgeous, inside and out. \u{1F496}",
    "You are so smart, brilliant, and wise. \u{1F4A1}",
    "You love so deeply and unconditionally. \u{1F495}",
    "You are the most incredible person in our lives. \u2728",
    "Your radiant warmth makes us all smile every day. \u{1F338}"
  ];

  const FUNNY_BALLOONS = [
    "Still looking 21 from a distance! \u{1F602}",
    "Another year closer to becoming a crazy cat owner! \u{1F431}",
    "Here for the free cake and party vibes! \u{1F382}",
    "Thanks for being the only person crazier than me! \u{1F92A}",
    "Aging like fine wine... or really expensive cheese! \u{1F9C0}",
    "Don't count the candles, count the memories! \u{1F389}"
  ];

  const MAIN_WISH_PRESETS = [
    {
      label: "\u{1F338} Heartfelt",
      text: "Happy Birthday! Today is all about celebrating you and the amazing energy you bring into our lives. May your special day bring as much joy, warmth, and laughter as you bring to everyone around you. Wishing you health, success, and endless happiness!"
    },
    {
      label: "\u{1F496} Best Friend",
      text: "Happy Birthday to my partner-in-crime! From late-night talks to crazy adventures, I am so grateful for your friendship. Here\u2019s to another year of making unforgettable memories together and shining bright!"
    },
    {
      label: "\u2764\uFE0F Romantic / Love",
      text: "Happy Birthday to my favorite person! You make every single day brighter, sweeter, and more meaningful. Wishing you all the love, happiness, and magic in the world today. I love you!"
    },
    {
      label: "\u{1F389} Funny & Playful",
      text: "Happy Birthday! You\u2019re not getting older, you\u2019re just leveling up! May your day be filled with delicious cake, awesome gifts, and zero adulting responsibilities!"
    }
  ];

  let state = {};

  window.WISH_BUILDERS['birthday-star'] = {
    renderForm: function (t) {
      const offerPrice = (t && typeof t.price === 'number') ? t.price : 99;
      const origPrice = (t && typeof t.original_price === 'number') ? t.original_price : 199;
      const discountPct = origPrice > offerPrice ? Math.round(((origPrice - offerPrice) / origPrice) * 100) : 50;

      return `
        <div class="flex flex-col gap-4 text-left">
          <!-- Order Information Banner -->
          <div class="rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 border border-purple-100 dark:border-purple-800/30 p-3.5 sm:p-4">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <h4 class="font-display text-base sm:text-lg font-bold text-ink-900 dark:text-white flex items-center gap-1.5">
                <span>⭐</span> Custom Birthday Order
              </h4>
              <div class="flex items-center gap-1.5 shrink-0">
                ${origPrice > offerPrice ? `<span class="text-xs font-bold text-gray-400 line-through">₹${origPrice}</span>` : ''}
                <span class="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-2.5 py-1 text-xs font-black text-white shadow-sm flex items-center gap-1">
                  <span>₹${offerPrice}</span>
                  ${origPrice > offerPrice ? `<span class="rounded-full bg-white/20 px-1 py-0.2 text-[9px] sm:text-[10px]">${discountPct}% OFF</span>` : ''}
                </span>
              </div>
            </div>
            <div class="mt-2 pt-2 border-t border-purple-100/80 dark:border-purple-800/30">
              <p class="text-[11px] sm:text-xs text-ink-600 dark:text-gray-300">
                We will build your personalized website URL with 6 photos and custom wishes within 48h!
              </p>
            </div>
          </div>

          <form id="birthday-order-form" class="space-y-4">
            <!-- 1. Sender Name -->
            <div>
              <label class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 block">
                Your Name (Sender) <span class="text-rose-500">*</span>
              </label>
              <input type="text" id="field-user-name" placeholder="e.g. Rahul" required class="field-input w-full text-sm" />
            </div>

            <!-- 2. Birthday Person Name -->
            <div>
              <label class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 block">
                Birthday Person Name <span class="text-rose-500">*</span>
              </label>
              <input type="text" id="field-birthday-person" placeholder="e.g. Kiran" required class="field-input w-full text-sm" />
            </div>

            <!-- 3. Date & Month of Birth & Secret PIN -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 block">
                  Date of Birth <span class="text-rose-500">*</span>
                </label>
                <input type="date" id="field-birth-date" required class="field-input w-full text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 block">
                  Secret 7-Digit PIN Code <span class="text-rose-500">*</span>
                </label>
                <input type="text" id="field-secret-pin" placeholder="e.g. 1234567" maxlength="7" pattern="[0-9]{7}" inputmode="numeric" required class="field-input w-full text-sm" />
              </div>
            </div>

            <!-- 4. 6 Memory Balloon Messages -->
            <div>
              <div class="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label class="text-xs font-bold text-gray-700 dark:text-gray-200">
                  6 Memory Balloon Messages <span class="text-rose-500">*</span>
                </label>
                <div class="flex gap-2">
                  <button type="button" id="btn-balloon-funny" class="text-[11px] font-bold text-rose-500 hover:underline">
                    Use Funny
                  </button>
                  <button type="button" id="btn-fill-balloon-defaults" class="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline">
                    Reset Sweet
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                ${DEFAULT_BALLOONS.map((msg, i) => `
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-extrabold text-purple-600 dark:text-purple-400 w-5 shrink-0">#${i + 1}</span>
                    <input type="text" id="field-balloon-${i + 1}" value="${msg}" required class="field-input flex-1 text-xs" />
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 5. Main Wish Message -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-gray-700 dark:text-gray-200">
                  Main Birthday Wish Message <span class="text-rose-500">*</span>
                </label>
              </div>
              
              <!-- Quick Preset Chips -->
              <div class="flex gap-1.5 mb-2 overflow-x-auto pb-1 scrollbar-none">
                ${MAIN_WISH_PRESETS.map((p, idx) => `
                  <button type="button" class="preset-wish-btn shrink-0 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 px-2.5 py-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 transition hover:bg-purple-100 active:scale-95" data-index="${idx}">
                    ${p.label}
                  </button>
                `).join('')}
              </div>

              <textarea id="field-main-wish" rows="3" placeholder="Happy Birthday! May your life be filled with as much laughter, wonder, and love as you bring to ours..." required class="field-input w-full text-xs resize-none">${MAIN_WISH_PRESETS[0].text}</textarea>
            </div>

            <!-- Payment & WhatsApp Instructions -->
            <div class="rounded-2xl border border-amber-200/80 bg-amber-50/70 dark:bg-amber-950/30 dark:border-amber-800/40 p-3.5 space-y-2 text-xs">
              <div class="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                <span class="flex items-center gap-1.5">
                  <svg class="h-4 w-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>
                  UPI Payment & 6 Photos Submission
                </span>
                <span class="font-mono text-purple-700 dark:text-purple-300 font-extrabold">₹${offerPrice}</span>
              </div>
              <p class="text-amber-800 dark:text-amber-300 leading-relaxed">
                Send <strong>₹${offerPrice}</strong> to UPI ID <strong class="font-mono text-purple-700 dark:text-purple-300">${UPI_ID}</strong>. Attach your payment screenshot and <strong>6 photos</strong> on WhatsApp along with this order.
              </p>
            </div>

            <div id="wish-form-error" class="hidden rounded-xl bg-red-50 dark:bg-red-900/30 p-3 text-xs font-medium text-red-600 dark:text-red-300"></div>
          </form>
        </div>
      `;
    },

    bindForm: function (t) {
      const offerPrice = (t && typeof t.price === 'number') ? t.price : 99;

      // Preset balloon buttons
      const btnPresetSweet = document.getElementById('btn-fill-balloon-defaults');
      if (btnPresetSweet) {
        btnPresetSweet.onclick = () => {
          DEFAULT_BALLOONS.forEach((msg, i) => {
            const input = document.getElementById(`field-balloon-${i + 1}`);
            if (input) input.value = msg;
          });
        };
      }

      const btnPresetFunny = document.getElementById('btn-balloon-funny');
      if (btnPresetFunny) {
        btnPresetFunny.onclick = () => {
          FUNNY_BALLOONS.forEach((msg, i) => {
            const input = document.getElementById(`field-balloon-${i + 1}`);
            if (input) input.value = msg;
          });
        };
      }

      // Preset main wish chips
      document.querySelectorAll('.preset-wish-btn').forEach((btn) => {
        btn.onclick = () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          if (MAIN_WISH_PRESETS[idx]) {
            const textarea = document.getElementById('field-main-wish');
            if (textarea) textarea.value = MAIN_WISH_PRESETS[idx].text;
          }
        };
      });

      const form = document.getElementById('birthday-order-form');
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const uName = document.getElementById('field-user-name').value.trim();
          const bPerson = document.getElementById('field-birthday-person').value.trim();
          const bDate = document.getElementById('field-birth-date').value.trim();
          const secretPin = document.getElementById('field-secret-pin').value.trim();
          const mainWish = document.getElementById('field-main-wish').value.trim();

          const balloons = [];
          for (let i = 1; i <= 6; i++) {
            const val = document.getElementById(`field-balloon-${i}`)?.value.trim();
            if (val) balloons.push(val);
          }

          const errBox = document.getElementById('wish-form-error');
          if (!uName || !bPerson || !bDate || !mainWish || balloons.length < 6) {
            if (errBox) {
              errBox.textContent = 'Please fill in all required fields and ensure all 6 balloon messages are completed.';
              errBox.classList.remove('hidden');
            }
            return;
          }
          if (!secretPin || !/^\d{7}$/.test(secretPin)) {
            if (errBox) {
              errBox.textContent = 'Secret PIN must be exactly a 7-digit numeric code.';
              errBox.classList.remove('hidden');
            }
            return;
          }
          if (errBox) errBox.classList.add('hidden');

          let waMsg = `*NEW BIRTHDAY STAR WISH ORDER*\n`;
          waMsg += `------------------------------------\n`;
          waMsg += `*Birthday Person:* ${bPerson}\n`;
          waMsg += `*Date of Birth:* ${bDate}\n`;
          waMsg += `*Ordered By:* ${uName}\n`;
          waMsg += `*Secret PIN:* ${secretPin}\n`;
          waMsg += `\n*6 Balloon Messages:*\n`;
          balloons.forEach((b, idx) => {
            waMsg += `${idx + 1}. ${b}\n`;
          });
          waMsg += `\n*Main Wish Message:*\n${mainWish}\n\n`;
          waMsg += `------------------------------------\n`;
          waMsg += `*Amount to Pay:* ₹${offerPrice}\n`;
          waMsg += `*UPI ID:* ${UPI_ID}\n`;
          waMsg += `*UPI Link:* upi://pay?pa=${UPI_ID}&pn=CSRGO%20Wishes&am=${offerPrice}\n\n`;
          waMsg += `*NOTE:* Please send the payment screenshot & 6 photos of the birthday person in this chat for custom website creation.`;

          const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
          window.open(waUrl, '_blank');
        };
      }
    }
  };
})();
