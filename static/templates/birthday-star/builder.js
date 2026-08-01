(function () {
  window.WISH_BUILDERS = window.WISH_BUILDERS || {};

  const WHATSAPP_NUMBER = '919392438319';
  const UPI_ID = 'csr850@okaxis';

  const DEFAULT_BALLOONS = [
    "You are so much stronger than you think.",
    "You are absolutely beautiful & gorgeous, inside and out.",
    "You are so smart, brilliant, and wise.",
    "You love so deeply and unconditionally.",
    "You are the most incredible person in our lives.",
    "Your radiant warmth makes us all smile every day."
  ];

  window.WISH_BUILDERS['birthday-star'] = {
    renderForm: function (t) {
      const offerPrice = (t && typeof t.price === 'number') ? t.price : 99;
      const origPrice = (t && typeof t.original_price === 'number') ? t.original_price : 199;
      const discountPct = origPrice > offerPrice ? Math.round(((origPrice - offerPrice) / origPrice) * 100) : 50;

      return `
        <div class="flex flex-col gap-4 text-left">
          <!-- Order Information Banner -->
          <div class="rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 border border-purple-100 dark:border-purple-800/30 p-4">
            <div class="flex items-center justify-between">
              <h4 class="font-display text-lg font-bold text-ink-900 dark:text-white flex items-center gap-1.5">
                <span>⭐</span> Custom Birthday Order
              </h4>
              <div class="flex items-center gap-1.5">
                ${origPrice > offerPrice ? `<span class="text-xs font-bold text-gray-400 line-through">₹${origPrice}</span>` : ''}
                <span class="rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-3 py-1 text-xs font-black text-white shadow-sm flex items-center gap-1">
                  <span>₹${offerPrice}</span>
                  ${origPrice > offerPrice ? `<span class="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">${discountPct}% OFF</span>` : ''}
                </span>
              </div>
            </div>
            <p class="text-xs text-ink-600 dark:text-gray-300 mt-1">
              We will build your personalized website URL with 6 photos and custom wishes within 48h!
            </p>
          </div>

          <form id="birthday-order-form" class="space-y-4">
            <!-- 1. Name of User & Name of Birthday Person -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 block">
                  Your Name (Sender) <span class="text-rose-500">*</span>
                </label>
                <input type="text" id="field-user-name" placeholder="e.g. Rahul" required class="field-input w-full text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 block">
                  Name of Birthday Person <span class="text-rose-500">*</span>
                </label>
                <input type="text" id="field-birthday-person" placeholder="e.g. Alex" required class="field-input w-full text-sm" />
              </div>
            </div>

            <!-- 2. Date & Month of Birth -->
            <div>
              <label class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 block">
                Date & Month of Birth <span class="text-rose-500">*</span>
              </label>
              <input type="text" id="field-birth-date" placeholder="e.g. 28th July" required class="field-input w-full text-sm" />
            </div>

            <!-- 3. 6 Balloon Messages -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-gray-700 dark:text-gray-200">
                  6 Memory Balloon Messages <span class="text-rose-500">*</span>
                </label>
                <button type="button" id="btn-fill-balloon-defaults" class="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline">
                  Reset Defaults
                </button>
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

            <!-- 4. Main Wish Message -->
            <div>
              <label class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1 block">
                Main Birthday Wish Message <span class="text-rose-500">*</span>
              </label>
              <textarea id="field-main-wish" rows="3" placeholder="Happy Birthday! May your life be filled with as much laughter, wonder, and love as you bring to ours..." required class="field-input w-full text-xs resize-none"></textarea>
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

            <button type="submit" class="w-full rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2">
              <svg class="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              Submit Order on WhatsApp
            </button>
          </form>
        </div>
      `;
    },

    bindForm: function (t) {
      const offerPrice = (t && typeof t.price === 'number') ? t.price : 99;

      const btnPreset = document.getElementById('btn-fill-balloon-defaults');
      if (btnPreset) {
        btnPreset.onclick = () => {
          DEFAULT_BALLOONS.forEach((msg, i) => {
            const input = document.getElementById(`field-balloon-${i + 1}`);
            if (input) input.value = msg;
          });
        };
      }

      const form = document.getElementById('birthday-order-form');
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const uName = document.getElementById('field-user-name').value.trim();
          const bPerson = document.getElementById('field-birthday-person').value.trim();
          const bDate = document.getElementById('field-birth-date').value.trim();
          const mainWish = document.getElementById('field-main-wish').value.trim();

          const balloons = [];
          for (let i = 1; i <= 6; i++) {
            const val = document.getElementById(`field-balloon-${i}`)?.value.trim();
            if (val) balloons.push(val);
          }

          const errBox = document.getElementById('wish-form-error');
          if (!uName || !bPerson || !bDate || !mainWish || balloons.length < 6) {
            if (errBox) {
              errBox.textContent = 'Please fill in all fields and ensure all 6 balloon messages are filled.';
              errBox.classList.remove('hidden');
            }
            return;
          }
          if (errBox) errBox.classList.add('hidden');

          // Clean, reliable WhatsApp formatting
          let waMsg = `*NEW BIRTHDAY WISH ORDER*\n`;
          waMsg += `------------------------------------\n`;
          waMsg += `*Birthday Person:* ${bPerson}\n`;
          waMsg += `*Birth Date/Month:* ${bDate}\n`;
          waMsg += `*Ordered By:* ${uName}\n\n`;
          waMsg += `*6 Balloon Messages:*\n`;
          balloons.forEach((b, idx) => {
            waMsg += `${idx + 1}. ${b}\n`;
          });
          waMsg += `\n*Main Wish Message:*\n${mainWish}\n\n`;
          waMsg += `------------------------------------\n`;
          waMsg += `*Amount to Pay:* ₹${offerPrice}\n`;
          waMsg += `*UPI ID:* ${UPI_ID}\n`;
          waMsg += `*UPI Link:* upi://pay?pa=${UPI_ID}&pn=CSRGO%20Wishes&am=${offerPrice}\n\n`;
          waMsg += `*NOTE:* Please send the payment screenshot & 6 photos of birthday person in this chat for custom link creation.`;

          const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
          window.open(waUrl, '_blank');
        };
      }
    }
  };
})();
