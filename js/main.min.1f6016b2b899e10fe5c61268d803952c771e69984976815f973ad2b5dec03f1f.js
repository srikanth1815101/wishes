(function(){"use strict";const r=window.SITE_CONFIG||{brandName:"CSRGO Wishes",brandDomain:"wishes.csrgo.com",whatsappNumber:"919392438319",currency:"₹",supabaseUrl:"",supabaseAnonKey:""};let o=[],s="All",h="",i=null,a="details",t=0,w=null;const n=document.getElementById("templates-grid"),M=document.getElementById("featured-row"),ee=document.getElementById("featured-section"),p=document.getElementById("template-count"),D=document.getElementById("active-category-title"),c=document.getElementById("search-input"),l=document.getElementById("search-clear-btn"),g=document.getElementById("template-modal"),y=document.getElementById("modal-content-container"),u=document.getElementById("filter-sheet");function _(){I(),P(),W(),U()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_();function F(e){const t=(e.demand_type||e.demand||"").toLowerCase();return t==="all_year"||t==="year_round"||t==="evergreen"||t==="throughout_the_year"?1:2}function C(e){const t=e.date||e.entry_date||e.created_at;if(!t)return 0;const n=new Date(t).getTime();return isNaN(n)?0:n}function H(e){return Array.isArray(e)?[...e].sort((e,t)=>{const n=F(e),s=F(t);if(n!==s)return n-s;const o=C(e),i=C(t);return i-o}):[]}async function U(){$();let t=null,e=window.FALLBACK_TEMPLATES;if(typeof e=="string")try{e=JSON.parse(e)}catch{e=null}if(Array.isArray(e)&&e.length>0)t=e;else try{const e=await fetch("/data/templates.json");e.ok&&(t=await e.json())}catch(e){console.error("Error loading templates JSON:",e)}t&&Array.isArray(t)?(o=H(t),d(),R()):B("Failed to load templates.")}function Q(){const t=document.getElementById("category-bar"),n=document.getElementById("filter-categories-container"),i=new Set;o.forEach(e=>{e.category&&e.is_active!==!1&&i.add(e.category)});const a=Array.from(i);if(t){const n=["All",...a].map(t=>{const n=t===s,o="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md shadow-purple-500/25",i="border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium";return`
          <button
            type="button"
            data-category="${e(t)}"
            class="cat-btn shrink-0 rounded-full px-4 py-2 text-sm transition-all ${n?o:i}"
          >
            ${e(t)}
          </button>
        `}).join("");t.innerHTML=n}if(n){const t=["All",...a].map(t=>{const n=t===s,o="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold",i="border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium";return`
          <button
            type="button"
            data-category="${e(t)}"
            class="cat-btn close-filter-btn rounded-full px-4 py-2 text-sm transition ${n?o:i}"
          >
            ${e(t)}
          </button>
        `}).join("");n.innerHTML=t}}function G(){const e=h.trim().toLowerCase();return o.filter(t=>{const n=s==="All"||t.category===s;if(!n)return!1;if(!e)return!0;const o=[t.name,t.category,t.tagline||"",t.description||"",...t.tags||[]].join(" ").toLowerCase();return o.includes(e)})}function Z(){return o.filter(e=>e.is_featured)}function d(){const t=!document.getElementById("search-input")&&!document.getElementById("category-bar");if(t){const e=o.slice(0,6);p&&(p.textContent=`${e.length} template${e.length===1?"":"s"}`),A(e);return}Q();const e=G();D&&(D.textContent=s==="All"?"All Templates":`${s} Wish Templates`),p&&(p.textContent=`${e.length} template${e.length===1?"":"s"}`),e.length===0?V():A(e)}function J(t){M.innerHTML=t.map(t=>`
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
          <div class="absolute bottom-3 left-3 right-3">
            <p class="text-[11px] font-medium text-white/80">${e(t.category)}</p>
            <h3 class="font-display text-lg font-semibold text-white">
              ${e(t.name)}
            </h3>
          </div>
        </div>
      </button>
    `).join(""),T(M)}function A(t){if(!n)return;n.className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",n.innerHTML=t.map((t,n)=>{const s=Math.min(n*60,400);return`
        <button
          type="button"
          data-id="${t.id}"
          style="animation-delay: ${s}ms;"
          class="template-select-btn group relative animate-fade-up w-full aspect-[4/3] overflow-hidden rounded-3xl border border-white/20 text-left shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cardHover focus:outline-none"
        >
          ${t.image_url?`
            <img
              src="${e(t.image_url)}"
              alt="${e(t.name)}"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          `:`<div class="h-full w-full skeleton-shimmer"></div>`}
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

          <!-- Featured Badge (Top Left) -->
          ${t.is_featured!==!1?`
            <span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#c98a3a] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
              <svg class="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1 1.275-1.275L12 3z"/></svg>
              FEATURED
            </span>
          `:""}

          <!-- Text Information Overlay (Bottom Left) -->
          <div class="absolute bottom-5 left-5 right-5 text-left">
            <p class="text-xs font-semibold text-white/80 tracking-wide mb-1">
              ${e(t.category)}
            </p>
            <h3 class="font-display text-xl font-bold leading-snug text-white drop-shadow-md sm:text-2xl">
              ${e(t.name)}
            </h3>
          </div>
        </button>
      `}).join(""),T(n)}function $(){if(!n)return;n.className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",n.innerHTML=Array.from({length:8}).map(()=>`
      <div class="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
        <div class="aspect-[4/3] skeleton-shimmer"></div>
        <div class="space-y-3 p-4">
          <div class="h-4 w-2/3 rounded skeleton-shimmer"></div>
          <div class="h-3 w-full rounded skeleton-shimmer"></div>
          <div class="h-3 w-1/2 rounded skeleton-shimmer"></div>
        </div>
      </div>
    `).join("")}function V(){if(!n)return;const o=s==="All"?"":` for ${s}`;n.className="",n.innerHTML=`
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
    `;const t=document.getElementById("reset-filters-btn");t&&t.addEventListener("click",()=>{h="",s="All",c&&(c.value=""),E(),d()})}function B(t){if(!n)return;n.className="",n.innerHTML=`
      <div class="mt-10 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <h3 class="font-display text-lg font-semibold text-red-700">
          Something went wrong
        </h3>
        <p class="mt-1 text-sm text-red-600">${e(t)}</p>
      </div>
    `}function T(e){const t=e.querySelectorAll(".template-select-btn");t.forEach(e=>{e.addEventListener("click",()=>{const n=e.getAttribute("data-id"),t=o.find(e=>e.id===n);t&&v(t)})})}function I(){if(!c)return;c.addEventListener("input",e=>{const t=e.target.value;l&&(l.style.display=t?"block":"none"),clearTimeout(w),w=setTimeout(()=>{h=t,d()},200)}),l&&l.addEventListener("click",()=>{c.value="",h="",l.style.display="none",d()})}function P(){const e=document.getElementById("category-bar");if(!e)return;e.addEventListener("click",e=>{const t=e.target.closest(".cat-btn");if(!t)return;s=t.getAttribute("data-category"),E(),d()})}function E(){const e=document.querySelectorAll(".cat-btn"),t="cat-btn shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25",n="cat-btn shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";e.forEach(e=>{const o=e.getAttribute("data-category");e.className=o===s?t:n})}function W(){const e=document.querySelectorAll(".open-filter-btn");e.forEach(e=>{e.addEventListener("click",()=>{u&&(u.style.display="flex")})});const t=document.querySelectorAll(".close-filter-btn");t.forEach(e=>{e.addEventListener("click",()=>{u&&(u.style.display="none")})})}function R(){const t=new URLSearchParams(window.location.search),n=new URLSearchParams(window.location.hash.replace(/^#/,"")),e=t.get("order")||t.get("template")||n.get("order")||n.get("template");if(e){const t=o.find(t=>t.id===e||t.slug&&t.slug.includes(e));t&&v(t,!1)}}function v(e,n=!0){if(i=e,a="details",t=0,document.body.style.overflow="hidden",n&&e&&e.id){const t=new URL(window.location.href);t.searchParams.set("order",e.id),window.history.pushState({modalOpen:!0,templateId:e.id},"",t.toString())}S(),g&&(g.style.display="flex")}let f=null;function z(){f&&(clearInterval(f),f=null)}function j(e){z(),e&&e.length>1&&(f=setInterval(()=>{t=(t+1)%e.length,b(e)},3e3))}function m(e=!0){if(z(),i=null,document.body.style.overflow="",g&&(g.style.display="none"),e){const e=new URL(window.location.href);e.searchParams.has("order")&&(e.searchParams.delete("order"),window.history.pushState({modalOpen:!1},"",e.toString()))}}window.addEventListener("popstate",()=>{const t=new URLSearchParams(window.location.search),e=t.get("order")||t.get("template");if(e){const t=o.find(t=>t.id===e||t.slug&&t.slug.includes(e));t?v(t,!1):m(!1)}else m(!1)}),window.addEventListener("keydown",e=>{e.key==="Escape"&&i&&m()});function S(){if(!i||!y)return;const n=i,o=n.gallery&&n.gallery.length>0?n.gallery:[n.image_url],s=Array.from(new Set([n.image_url,...o])).filter(Boolean),r=Number(n.price).toLocaleString("en-IN");y.innerHTML=`
      <div class="relative z-10 flex h-[92dvh] sm:h-auto sm:max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-slide-up sm:rounded-3xl sm:animate-scale-in">
        ${a==="details"?`
          <!-- Gallery Header (Details / Specification Page Only) -->
          <div class="relative aspect-[16/11] sm:aspect-[16/9] shrink-0 overflow-hidden bg-ink-100">
            ${s[t]?`
              <img id="modal-gallery-img" src="${e(s[t])}" alt="${e(n.name)}" class="h-full w-full object-cover transition-opacity duration-200" />
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

            ${n.is_featured?`
              <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg> Featured
              </span>
            `:""}

            ${s.length>1?`
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
                ${s.map((e,n)=>`
                  <span class="gallery-dot h-1.5 rounded-full transition-all ${n===t?"w-5 bg-white":"w-1.5 bg-white/50"}"></span>
                `).join("")}
              </div>
            `:""}

            <div class="absolute bottom-3 left-4 right-4">
              <span class="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-700">
                ${e(n.category)}
              </span>
              <h2 class="mt-2 font-display text-2xl font-semibold text-white drop-shadow sm:text-3xl">
                ${e(n.name)}
              </h2>
            </div>
          </div>
        `:`
          <!-- Compact Header (Form Page Only) -->
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3.5 sm:px-7 sm:py-4 shrink-0">
            <div class="flex items-center gap-2 min-w-0 pr-2">
              <span class="shrink-0 rounded-full bg-purple-100 dark:bg-purple-900/40 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                ${e(n.category)}
              </span>
              <h2 class="font-display text-base sm:text-lg md:text-xl font-bold text-ink-900 dark:text-white truncate">
                ${e(n.name)} Order Form
              </h2>
            </div>
            <button
              type="button"
              id="modal-close-btn"
              class="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-ink-700 dark:text-gray-300 transition hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0"
              aria-label="Close"
            >
              <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        `}

        <!-- Scrollable Modal Body -->
        <div id="modal-step-body" class="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          ${a==="details"?N(n):q(n)}
        </div>

        <!-- Sticky Footer CTA -->
        <div id="modal-step-footer" class="shrink-0">
          ${L(n)}
        </div>
      </div>
    `,x(n,s)}function L(e){const t=!!e.builder_key,i=e.show_whatsapp_order!==!1&&!t,c=e.show_back_button!==!1&&!t,n=Number(e.price).toLocaleString("en-IN"),s=e.demo_url||(e.id&&(e.id.includes("birthday-star")||e.slug.includes("birthday-star"))?"/birthday-sample/":"/"+e.slug.replace(/^\//,"")+"/");if(a==="details")return`
        <div class="border-t border-ink-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 px-4 py-3 backdrop-blur sm:px-7 sm:py-4">
          <div class="flex items-center justify-between gap-3 sm:gap-4">
            <div class="min-w-0">
              <p class="text-[10px] sm:text-xs font-medium text-ink-500 dark:text-gray-400 uppercase tracking-wider">Price</p>
              ${e.original_price&&e.original_price>e.price?`
                <div class="flex items-baseline gap-1.5 flex-wrap">
                  <span class="font-display text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">${e.price===0?"FREE":`₹${e.price}`}</span>
                  <span class="text-xs font-semibold text-gray-400 line-through">₹${e.original_price}</span>
                  <span class="rounded-full bg-rose-100 dark:bg-rose-900/40 px-2 py-0.2 text-[10px] sm:text-xs font-bold text-rose-600 dark:text-rose-300">
                    ${Math.round((e.original_price-e.price)/e.original_price*100)}%
                  </span>
                </div>
              `:`
                <p class="font-display text-xl sm:text-2xl font-semibold text-ink-900 dark:text-white">
                  ${e.price===0?"FREE":`${r.currency}${n}`}
                </p>
              `}
            </div>
            <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <a
                href="${s}"
                target="_blank"
                class="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 shrink-0"
              >
                <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Demo
              </a>
              <button
                type="button"
                id="modal-order-step-btn"
                class="rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-base font-bold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      `;const o=e.price===0||e.builder_key==="friendship-day"||e.slug&&e.slug.includes("friendship");return o?`
        <div class="border-t border-ink-100 bg-white/95 px-4 py-3.5 backdrop-blur sm:px-7 sm:py-4">
          <div class="flex items-center justify-between gap-2.5 sm:gap-3">
            <button
              type="button"
              id="modal-back-step-btn"
              class="inline-flex h-12 items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sm:px-6 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 active:scale-95 shrink-0"
            >
              ← Back
            </button>
            <button
              type="button"
              id="modal-submit-whatsapp-btn"
              class="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-4 sm:px-6 text-sm sm:text-base font-bold text-white shadow-lg shadow-purple-500/25 transition hover:scale-[1.01] active:scale-[0.98]"
            >
              ✨ Create My Wish Link
            </button>
          </div>
        </div>
      `:`
      <div class="border-t border-ink-100 bg-white/95 px-4 py-3.5 backdrop-blur sm:px-7 sm:py-4">
        <div class="flex items-center justify-between gap-2.5 sm:gap-3">
          <button
            type="button"
            id="modal-back-step-btn"
            class="inline-flex h-12 items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 sm:px-6 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 active:scale-95 shrink-0"
          >
            ← Back
          </button>
          <button
            type="button"
            id="modal-submit-whatsapp-btn"
            class="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 sm:px-6 text-sm sm:text-base font-bold text-white shadow-card transition hover:bg-[#1fb557] active:scale-[0.98]"
          >
            <svg class="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            Order on WhatsApp
          </button>
        </div>
      </div>
    `;x(e,gallery)}function N(t){const n=t.features||[];return`
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

        <div class="grid grid-cols-3 gap-3">
          <div class="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 px-2 py-3 text-center">
            ${t.price>0||t.slug==="templates/birthday-star"?`
              <span class="text-purple-600 dark:text-purple-400"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
              <span class="text-[11px] font-medium leading-tight text-ink-600 dark:text-gray-300">48h Delivery</span>
            `:`
              <span class="text-purple-600 dark:text-purple-400"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
              <span class="text-[11px] font-medium leading-tight text-ink-600 dark:text-gray-300">Instant build</span>
            `}
          </div>
          <div class="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 px-2 py-3 text-center">
            <span class="text-purple-600 dark:text-purple-400"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
            <span class="text-[11px] font-medium leading-tight text-ink-600 dark:text-gray-300">Permanent URL</span>
          </div>
          <div class="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 px-2 py-3 text-center">
            <span class="text-purple-600 dark:text-purple-400"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
            <span class="text-[11px] font-medium leading-tight text-ink-600 dark:text-gray-300">Secure order</span>
          </div>
        </div>
      </div>
    `}function K(e,t){if(!e)return;const s=e.split("?")[0],o=document.querySelector(`script[data-builder="${s}"]`);if(o){t&&t();return}const n=document.createElement("script");n.setAttribute("data-builder",s),n.charset="UTF-8",n.src=`${s}?v=${Date.now()}`,n.onload=()=>{t&&t()},document.body.appendChild(n)}function q(t){if(t.builder_key&&t.builder_script)return window.WISH_BUILDERS&&window.WISH_BUILDERS[t.builder_key]?window.WISH_BUILDERS[t.builder_key].renderForm(t):(K(t.builder_script,()=>{const e=document.getElementById("modal-step-body");e&&window.WISH_BUILDERS&&window.WISH_BUILDERS[t.builder_key]&&(e.innerHTML=window.WISH_BUILDERS[t.builder_key].renderForm(t),window.WISH_BUILDERS[t.builder_key].bindForm(t))}),`
        <div class="py-12 text-center text-ink-500">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-2"></div>
          <p class="text-xs">Loading template builder...</p>
        </div>
      `);const n=Number(t.price).toLocaleString("en-IN");return`
      <div class="flex flex-col gap-5">
        <div class="rounded-2xl bg-ink-50 px-4 py-3">
          <p class="text-xs text-ink-500">Ordering</p>
          <p class="font-semibold text-ink-900">
            ${e(t.name)} · ${r.currency}${n}
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
    `}function b(e){const n=document.getElementById("modal-gallery-img");n&&e[t]&&(n.src=e[t]);const s=document.querySelectorAll(".gallery-dot");s.forEach((e,n)=>{n===t?e.className="gallery-dot h-1.5 rounded-full transition-all w-5 bg-white":e.className="gallery-dot h-1.5 rounded-full transition-all w-1.5 bg-white/50"})}function x(e,n){j(n);const s=document.getElementById("modal-close-btn");s&&s.addEventListener("click",m);const o=document.getElementById("gallery-prev-btn");o&&o.addEventListener("click",()=>{t=(t-1+n.length)%n.length,b(n),j(n)});const i=document.getElementById("gallery-next-btn");i&&i.addEventListener("click",()=>{t=(t+1)%n.length,b(n),j(n)}),X(e),e.builder_key&&window.WISH_BUILDERS&&window.WISH_BUILDERS[e.builder_key]&&window.WISH_BUILDERS[e.builder_key].bindForm(e)}function X(e){const t=document.getElementById("modal-order-step-btn");t&&(t.onclick=()=>O("order"));const n=document.getElementById("modal-back-step-btn");n&&(n.onclick=()=>O("details"));const s=document.getElementById("modal-submit-whatsapp-btn");s&&(s.onclick=()=>{const t=document.querySelector("#modal-step-body form");t?typeof t.requestSubmit=="function"?t.requestSubmit():t.dispatchEvent(new Event("submit",{cancelable:!0,bubbles:!0})):Y(e)})}function O(e){a=e,S();const t=document.getElementById("modal-step-body");t&&(t.scrollTop=0)}function Y(e){const l=document.getElementById("field-recipient"),h=document.getElementById("field-date"),u=document.getElementById("field-yourname"),g=document.getElementById("field-phone"),d=document.getElementById("field-email"),f=document.getElementById("field-notes"),t=document.getElementById("err-recipient"),i=document.getElementById("err-yourname"),o=document.getElementById("err-phone"),s=document.getElementById("err-email");let n=!0;t&&t.classList.add("hidden"),i&&i.classList.add("hidden"),o&&o.classList.add("hidden"),s&&s.classList.add("hidden");const m=l?l.value.trim():"",v=h?h.value:"",p=u?u.value.trim():"",c=g?g.value.trim():"",a=d?d.value.trim():"",b=f?f.value.trim():"";if(m||(t&&(t.textContent="Please enter the recipient name",t.classList.remove("hidden")),n=!1),p||(i&&(i.textContent="Please enter your name",i.classList.remove("hidden")),n=!1),(!c||c.replace(/\D/g,"").length<8)&&(o&&(o.textContent="Please enter a valid phone number",o.classList.remove("hidden")),n=!1),a&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)&&(s&&(s.textContent="Please enter a valid email",s.classList.remove("hidden")),n=!1),!n)return;const j=Number(e.price).toLocaleString("en-IN"),y=[`*New Order — ${r.brandDomain}*`,``,`*Template:* ${e.name}`,`*Category:* ${e.category}`,`*Price:* ${r.currency}${j}`,``,`*Recipient / Occasion Name:* ${m}`,`*Occasion Date:* ${v||"Not specified"}`,`*Your Name:* ${p}`,`*Phone:* ${c}`,`*Email:* ${a||"Not provided"}`,``,`*Notes:*`,b||"None"],_=encodeURIComponent(y.join(`
`)),w=`https://wa.me/${r.whatsappNumber}?text=${_}`;window.open(w,"_blank","noopener,noreferrer")}function e(e){return typeof e!="string"?"":e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}window.toggleTheme=function(){const e=document.documentElement,n=e.getAttribute("data-theme")||(e.classList.contains("dark")?"dark":"light"),t=n==="dark"?"light":"dark";e.setAttribute("data-theme",t),localStorage.setItem("theme",t),t==="dark"?e.classList.add("dark"):e.classList.remove("dark")};function k(){const e=document.getElementById("mobile-menu");e&&!e.classList.contains("hidden")&&e.classList.add("hidden")}window.toggleMobileMenu=function(e){e&&e.stopPropagation&&e.stopPropagation();const t=document.getElementById("mobile-menu");t&&t.classList.toggle("hidden")},document.addEventListener("click",e=>{const t=document.getElementById("mobile-menu"),n=document.getElementById("mobile-menu-btn");t&&!t.classList.contains("hidden")&&!t.contains(e.target)&&(!n||!n.contains(e.target))&&k()}),window.addEventListener("scroll",()=>{k()},{passive:!0})})()