(function(){"use strict";const u=window.SITE_CONFIG||{brandName:"CSRGO Wishes",brandDomain:"wishes.csrgo.com",whatsappNumber:"919999999999",currency:"₹",supabaseUrl:"",supabaseAnonKey:""};let c=[],n="All",r="",o=null,f="details",s=0,y=null;const t=document.getElementById("templates-grid"),g=document.getElementById("featured-row"),p=document.getElementById("featured-section"),_=document.getElementById("template-count"),x=document.getElementById("active-category-title"),d=document.getElementById("search-input"),l=document.getElementById("search-clear-btn"),h=document.getElementById("template-modal"),j=document.getElementById("modal-content-container"),m=document.getElementById("filter-sheet");document.addEventListener("DOMContentLoaded",()=>{A(),S(),F(),D()});async function D(){C();let t=null,e=window.FALLBACK_TEMPLATES;if(typeof e=="string")try{e=JSON.parse(e)}catch{e=null}if(Array.isArray(e)&&e.length>0)t=e;else try{const e=await fetch("/data/templates.json");e.ok&&(t=await e.json())}catch(e){console.error("Error loading templates JSON:",e)}t&&Array.isArray(t)?(c=t,a()):T("Failed to load templates.")}function M(){const e=r.trim().toLowerCase();return c.filter(t=>{const s=n==="All"||t.category===n;if(!s)return!1;if(!e)return!0;const o=[t.name,t.category,t.tagline||"",t.description||"",...t.tags||[]].join(" ").toLowerCase();return o.includes(e)})}function L(){return c.filter(e=>e.is_featured)}function a(){const t=L(),e=M();p&&g&&(t.length>0&&!r.trim()&&n==="All"?(p.style.display="block",z(t)):p.style.display="none"),x&&(x.textContent=n==="All"?"All Templates":n),_&&(_.textContent=`${e.length} design${e.length===1?"":"s"}`),e.length===0?k():E(e)}function z(t){g.innerHTML=t.map(t=>`
      <button
        type="button"
        data-id="${t.id}"
        class="template-select-btn group relative w-64 shrink-0 overflow-hidden rounded-3xl border border-ink-200 bg-white text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover sm:w-72"
      >
        <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
          ${t.image_url?`
            <img
              src="${e(t.image_url)}"
              alt="${e(t.name)}"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          `:""}
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent"></div>
          <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg> Featured
          </span>
          <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <p class="text-[11px] font-medium text-white/80">${e(t.category)}</p>
              <h3 class="font-display text-lg font-semibold text-white">
                ${e(t.name)}
              </h3>
            </div>
            <div class="shrink-0 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink-900 shadow-sm backdrop-blur">
              <span class="line-through text-ink-400 text-[11px] font-normal">₹99</span>
              <span class="text-emerald-600 font-extrabold">₹0</span>
              <span class="rounded bg-emerald-500 px-1 py-0.5 text-[9px] font-extrabold text-white uppercase">100% OFF</span>
            </div>
          </div>
        </div>
      </button>
    `).join(""),v(g)}function E(n){if(!t)return;t.className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",t.innerHTML=n.map((t,n)=>{const s=Math.min(n*60,400),o=(t.tags||[]).slice(0,3);return`
        <button
          type="button"
          data-id="${t.id}"
          style="animation-delay: ${s}ms;"
          class="template-select-btn group animate-fade-up flex flex-col overflow-hidden rounded-3xl border border-ink-200 bg-white text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-cardHover"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
            ${t.image_url?`
              <img
                src="${e(t.image_url)}"
                alt="${e(t.name)}"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            `:`<div class="h-full w-full skeleton-shimmer"></div>`}
            <div class="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent"></div>
            ${t.is_featured?`
              <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-500/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
                Featured
              </span>
            `:""}
            <span class="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink-700 shadow-sm backdrop-blur">
              ${e(t.category)}
            </span>
            <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <h3 class="font-display text-lg font-semibold leading-tight text-white drop-shadow">
                ${e(t.name)}
              </h3>
              <div class="shrink-0 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink-900 shadow-sm backdrop-blur">
                <span class="line-through text-ink-400 text-[11px] font-normal">₹99</span>
                <span class="text-emerald-600 font-extrabold">₹0</span>
                <span class="rounded bg-emerald-500 px-1 py-0.5 text-[9px] font-extrabold text-white uppercase">100% OFF</span>
              </div>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-3 p-4">
            ${t.tagline?`
              <p class="text-sm leading-relaxed text-ink-600 line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                ${e(t.tagline)}
              </p>
            `:""}
            <div class="mt-auto flex items-center justify-between">
              <div class="flex flex-wrap gap-1.5">
                ${o.map(t=>`
                  <span class="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600">
                    ${e(t)}
                  </span>
                `).join("")}
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition group-hover:scale-105">
                Create / Order
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </button>
      `}).join(""),v(t)}function C(){if(!t)return;t.className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",t.innerHTML=Array.from({length:8}).map(()=>`
      <div class="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
        <div class="aspect-[4/3] skeleton-shimmer"></div>
        <div class="space-y-3 p-4">
          <div class="h-4 w-2/3 rounded skeleton-shimmer"></div>
          <div class="h-3 w-full rounded skeleton-shimmer"></div>
          <div class="h-3 w-1/2 rounded skeleton-shimmer"></div>
        </div>
      </div>
    `).join("")}function k(){if(!t)return;const o=n==="All"?"":` for ${n}`;t.className="",t.innerHTML=`
      <div class="mt-8 flex flex-col items-center justify-center rounded-3xl border border-purple-100 dark:border-gray-800 bg-gradient-to-br from-white via-purple-50/40 to-blue-50/30 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 py-16 px-6 text-center shadow-lg shadow-purple-500/5">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-md shadow-purple-500/25 mb-4 animate-bounce-soft">
          <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-100/80 dark:bg-purple-900/40 px-3.5 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-2">
          Coming Soon
        </span>
        <h3 class="font-display text-2xl font-bold text-gray-900 dark:text-white">
          New Templates Coming Soon${e(o)}!
        </h3>
        <p class="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          We are handcrafting stunning new interactive templates for this category. Stay tuned or check out our featured Friendship Day template!
        </p>
        <button
          type="button"
          id="reset-filters-btn"
          class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition hover:shadow-lg hover:scale-[1.02] active:scale-95"
        >
          View Friendship Template
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;const s=document.getElementById("reset-filters-btn");s&&s.addEventListener("click",()=>{r="",n="All",d&&(d.value=""),b(),a()})}function T(n){if(!t)return;t.className="",t.innerHTML=`
      <div class="mt-10 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <h3 class="font-display text-lg font-semibold text-red-700">
          Something went wrong
        </h3>
        <p class="mt-1 text-sm text-red-600">${e(n)}</p>
      </div>
    `}function v(e){const t=e.querySelectorAll(".template-select-btn");t.forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-id"),t=c.find(e=>e.id===n);t&&O(t)})})}function A(){if(!d)return;d.addEventListener("input",e=>{const t=e.target.value;l&&(l.style.display=t?"block":"none"),clearTimeout(y),y=setTimeout(()=>{r=t,a()},200)}),l&&l.addEventListener("click",()=>{d.value="",r="",l.style.display="none",a()})}function S(){const e=document.getElementById("category-bar");if(!e)return;e.addEventListener("click",e=>{const t=e.target.closest(".cat-btn");if(!t)return;n=t.getAttribute("data-category"),b(),a()})}function b(){const e=document.querySelectorAll(".cat-btn");e.forEach(e=>{const t=e.getAttribute("data-category");t===n?e.className="cat-btn shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all bg-ink-900 text-white shadow-card":e.className="cat-btn shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all border border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900"})}function v(e){if(!e)return;const t=e.querySelectorAll(".template-select-btn");t.forEach(e=>{e.addEventListener("click",t=>{const s=e.getAttribute("data-id"),n=c.find(e=>e.id===s);n&&(n.demo_url?window.location.href=n.demo_url:O(n))})})}function F(){const e=document.querySelectorAll(".open-filter-btn");e.forEach(e=>{e.addEventListener("click",()=>{m&&(m.style.display="flex")})});const t=document.querySelectorAll(".close-filter-btn");t.forEach(e=>{e.addEventListener("click",()=>{m&&(m.style.display="none")})})}function O(e){o=e,f="details",s=0,document.body.style.overflow="hidden",i(),h&&(h.style.display="flex")}function w(){o=null,document.body.style.overflow="",h&&(h.style.display="none")}window.addEventListener("keydown",e=>{e.key==="Escape"&&o&&w()});function i(){if(!o||!j)return;const t=o,n=[t.image_url,...t.gallery||[]].filter(Boolean);j.innerHTML=`
      <div class="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-slide-up sm:rounded-3xl sm:animate-scale-in">
        <!-- Gallery Header -->
        <div class="relative aspect-[16/10] shrink-0 overflow-hidden bg-ink-100 sm:aspect-[16/8]">
          ${n[s]?`
            <img src="${e(n[s])}" alt="${e(t.name)}" class="h-full w-full object-cover" />
          `:""}
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/20"></div>

          <button
            type="button"
            id="modal-close-btn"
            class="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-ink-700 shadow-md backdrop-blur transition hover:bg-white hover:text-ink-900"
            aria-label="Close"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>

          ${t.is_featured?`
            <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg> Featured
            </span>
          `:""}

          ${n.length>1?`
            <button
              type="button"
              id="gallery-prev-btn"
              class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-ink-700 shadow backdrop-blur transition hover:bg-white"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              type="button"
              id="gallery-next-btn"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-ink-700 shadow backdrop-blur transition hover:bg-white"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              ${n.map((e,t)=>`
                <span class="h-1.5 rounded-full transition-all ${t===s?"w-5 bg-white":"w-1.5 bg-white/50"}"></span>
              `).join("")}
            </div>
          `:""}

          <div class="absolute bottom-3 left-4 right-4">
            <span class="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-700">
              ${e(t.category)}
            </span>
            <h2 class="mt-2 font-display text-2xl font-semibold text-white drop-shadow sm:text-3xl">
              ${e(t.name)}
            </h2>
          </div>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          ${N(t)}
        </div>

        <!-- Sticky Footer CTA -->
        <div class="shrink-0 border-t border-ink-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs text-ink-500 font-medium">Price</p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="text-sm line-through text-ink-400 font-medium">₹99</span>
                <span class="font-display text-2xl font-bold text-emerald-600">₹0</span>
                <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-700">100% OFF</span>
              </div>
            </div>
            <a
              href="${t.demo_url||"/friendship-day/"}"
              class="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3.5 text-center text-base font-semibold text-white shadow-card transition hover:opacity-95 active:scale-[0.98] sm:flex-none sm:px-10"
            >
              Create / Order
            </a>
          </div>
        </div>
      </div>
    `,R(t,n)}function N(t){const n=t.features||[];return`
      <div class="flex flex-col gap-6">
        ${t.tagline?`<p class="text-base font-medium leading-relaxed text-ink-700">${e(t.tagline)}</p>`:""}
        ${t.description?`<p class="text-[15px] leading-relaxed text-ink-600">${e(t.description)}</p>`:""}

        ${n.length>0?`
          <div>
            <h4 class="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
              What's included
            </h4>
            <ul class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              ${n.map(t=>`
                <li class="flex items-start gap-2 rounded-xl bg-ink-50 px-3 py-2.5 text-sm text-ink-700">
                  <svg class="mt-0.5 h-4 w-4 shrink-0 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
                  ${e(t)}
                </li>
              `).join("")}
            </ul>
          </div>
        `:""}

        ${t.demo_url?`
          <div class="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-center">
            <a href="${e(t.demo_url)}" target="_blank" class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] active:scale-95">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              Try Live Interactive Demo
            </a>
          </div>
        `:""}

        <div class="grid grid-cols-3 gap-3">
          <div class="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 bg-white px-2 py-3 text-center">
            <span class="text-gold-500"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
            <span class="text-[11px] font-medium leading-tight text-ink-600">48-hour build</span>
          </div>
          <div class="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 bg-white px-2 py-3 text-center">
            <span class="text-gold-500"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
            <span class="text-[11px] font-medium leading-tight text-ink-600">Permanent URL</span>
          </div>
          <div class="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 bg-white px-2 py-3 text-center">
            <span class="text-gold-500"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
            <span class="text-[11px] font-medium leading-tight text-ink-600">Secure order</span>
          </div>
        </div>
      </div>
    `}function H(t){const n=Number(t.price).toLocaleString("en-IN");return`
      <div class="flex flex-col gap-5">
        <div class="rounded-2xl bg-ink-50 px-4 py-3">
          <p class="text-xs text-ink-500">Ordering</p>
          <p class="font-semibold text-ink-900">
            ${e(t.name)} · ${u.currency}${n}
          </p>
        </div>

        <form id="order-form" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="flex flex-col gap-1.5">
            <span class="flex items-center gap-1.5 text-sm font-medium text-ink-700">
              Recipient / Occasion name <span class="text-gold-500">*</span>
            </span>
            <input type="text" id="field-recipient" placeholder="e.g. Aarav's 5th Birthday" class="field-input" />
            <span id="err-recipient" class="text-xs font-medium text-red-500 hidden"></span>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="flex items-center gap-1.5 text-sm font-medium text-ink-700">Occasion date</span>
            <input type="date" id="field-date" class="field-input" />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="flex items-center gap-1.5 text-sm font-medium text-ink-700">
              Your name <span class="text-gold-500">*</span>
            </span>
            <input type="text" id="field-yourname" placeholder="Your full name" class="field-input" />
            <span id="err-yourname" class="text-xs font-medium text-red-500 hidden"></span>
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="flex items-center gap-1.5 text-sm font-medium text-ink-700">
              Phone number <span class="text-gold-500">*</span>
            </span>
            <input type="tel" id="field-phone" placeholder="e.g. +91 98765 43210" class="field-input" />
            <span id="err-phone" class="text-xs font-medium text-red-500 hidden"></span>
          </label>

          <label class="flex flex-col gap-1.5 sm:col-span-2">
            <span class="flex items-center gap-1.5 text-sm font-medium text-ink-700">Email (optional)</span>
            <input type="email" id="field-email" placeholder="you@example.com" class="field-input" />
            <span id="err-email" class="text-xs font-medium text-red-500 hidden"></span>
          </label>

          <label class="flex flex-col gap-1.5 sm:col-span-2">
            <span class="flex items-center gap-1.5 text-sm font-medium text-ink-700">Notes (optional)</span>
            <textarea id="field-notes" rows="3" placeholder="Any photos, colors, songs, or special requests…" class="field-input resize-none"></textarea>
          </label>
        </form>
      </div>
    `}function R(e,t){const n=document.getElementById("modal-close-btn");n&&n.addEventListener("click",w);const o=document.getElementById("gallery-prev-btn");o&&o.addEventListener("click",()=>{s=(s-1+t.length)%t.length,i()});const a=document.getElementById("gallery-next-btn");a&&a.addEventListener("click",()=>{s=(s+1)%t.length,i()});const r=document.getElementById("modal-order-step-btn");r&&r.addEventListener("click",()=>{f="order",i()});const c=document.getElementById("modal-back-step-btn");c&&c.addEventListener("click",()=>{f="details",i()});const l=document.getElementById("modal-submit-whatsapp-btn");l&&l.addEventListener("click",()=>{P(e)})}function P(e){const c=document.getElementById("field-recipient"),h=document.getElementById("field-date"),d=document.getElementById("field-yourname"),g=document.getElementById("field-phone"),l=document.getElementById("field-email"),f=document.getElementById("field-notes"),t=document.getElementById("err-recipient"),i=document.getElementById("err-yourname"),o=document.getElementById("err-phone"),s=document.getElementById("err-email");let n=!0;t&&t.classList.add("hidden"),i&&i.classList.add("hidden"),o&&o.classList.add("hidden"),s&&s.classList.add("hidden");const m=c?c.value.trim():"",v=h?h.value:"",p=d?d.value.trim():"",r=g?g.value.trim():"",a=l?l.value.trim():"",b=f?f.value.trim():"";if(m||(t&&(t.textContent="Please enter the recipient name",t.classList.remove("hidden")),n=!1),p||(i&&(i.textContent="Please enter your name",i.classList.remove("hidden")),n=!1),(!r||r.replace(/\D/g,"").length<8)&&(o&&(o.textContent="Please enter a valid phone number",o.classList.remove("hidden")),n=!1),a&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)&&(s&&(s.textContent="Please enter a valid email",s.classList.remove("hidden")),n=!1),!n)return;const j=Number(e.price).toLocaleString("en-IN"),y=[`*New Order — ${u.brandDomain}*`,``,`*Template:* ${e.name}`,`*Category:* ${e.category}`,`*Price:* ${u.currency}${j}`,``,`*Recipient / Occasion Name:* ${m}`,`*Occasion Date:* ${v||"Not specified"}`,`*Your Name:* ${p}`,`*Phone:* ${r}`,`*Email:* ${a||"Not provided"}`,``,`*Notes:*`,b||"None"],_=encodeURIComponent(y.join(`
`)),w=`https://wa.me/${u.whatsappNumber}?text=${_}`;window.open(w,"_blank","noopener,noreferrer")}function e(e){return typeof e!="string"?"":e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}})()