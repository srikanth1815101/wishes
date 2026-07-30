// CSRGO Wishes Client Interactivity Engine
(function () {
  'use strict';

  // Config variables (injected via window.SITE_CONFIG or defaults)
  const config = window.SITE_CONFIG || {
    brandName: 'CSRGO Wishes',
    brandDomain: 'wishes.csrgo.com',
    whatsappNumber: '919999999999',
    currency: '₹',
    supabaseUrl: '',
    supabaseAnonKey: ''
  };

  let allTemplates = [];
  let activeCategory = 'All';
  let searchQuery = '';
  let selectedTemplate = null;
  let currentStep = 'details';
  let galleryIndex = 0;
  let debounceTimer = null;

  // DOM Elements
  const templatesGrid = document.getElementById('templates-grid');
  const featuredRow = document.getElementById('featured-row');
  const featuredSection = document.getElementById('featured-section');
  const countIndicator = document.getElementById('template-count');
  const activeCategoryTitle = document.getElementById('active-category-title');
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const modalOverlay = document.getElementById('template-modal');
  const modalContent = document.getElementById('modal-content-container');
  const filterSheetOverlay = document.getElementById('filter-sheet');

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initCategoryButtons();
    initMobileFilters();
    loadTemplates();
  });

  // Fetch templates from Supabase or Fallback static dataset
  async function loadTemplates() {
    renderSkeleton();

    let fetched = null;
    let fetchError = null;

    let fallbackData = window.FALLBACK_TEMPLATES;
    if (typeof fallbackData === 'string') {
      try {
        fallbackData = JSON.parse(fallbackData);
      } catch (e) {
        fallbackData = null;
      }
    }

    if (config.supabaseUrl && config.supabaseAnonKey && window.supabase) {
      try {
        const client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);

        const fetchPromise = client
          .from('templates')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        const timeoutPromise = new Promise((resolve) =>
          setTimeout(() => resolve({ timeout: true }), 1500)
        );

        const result = await Promise.race([fetchPromise, timeoutPromise]);

        if (result && !result.timeout) {
          const { data, error } = result;
          if (error) {
            fetchError = error.message;
          } else if (data && data.length > 0) {
            fetched = data;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to static data:', err);
      }
    }

    if (!fetched) {
      if (Array.isArray(fallbackData) && fallbackData.length > 0) {
        fetched = fallbackData;
      } else {
        try {
          const res = await fetch('/data/templates.json');
          if (res.ok) {
            fetched = await res.json();
          }
        } catch (e) {
          console.error('Error loading fallback JSON:', e);
        }
      }
    }

    if (fetched && Array.isArray(fetched)) {
      allTemplates = fetched;
      renderAll();
    } else if (fetchError) {
      renderError(fetchError);
    } else {
      renderError('Unable to load templates catalog.');
    }
  }

  // Filter & Search logic
  function getFilteredTemplates() {
    const q = searchQuery.trim().toLowerCase();
    return allTemplates.filter((t) => {
      const matchCategory = activeCategory === 'All' || t.category === activeCategory;
      if (!matchCategory) return false;
      if (!q) return true;

      const haystack = [
        t.name,
        t.category,
        t.tagline || '',
        t.description || '',
        ...(t.tags || [])
      ].join(' ').toLowerCase();

      return haystack.includes(q);
    });
  }

  function getFeaturedTemplates() {
    return allTemplates.filter((t) => t.is_featured);
  }

  // UI Rendering
  function renderAll() {
    const featured = getFeaturedTemplates();
    const filtered = getFilteredTemplates();

    // Featured section visibility
    if (featuredSection && featuredRow) {
      if (featured.length > 0 && !searchQuery.trim() && activeCategory === 'All') {
        featuredSection.style.display = 'block';
        renderFeaturedRow(featured);
      } else {
        featuredSection.style.display = 'none';
      }
    }

    // Category title & count
    if (activeCategoryTitle) {
      activeCategoryTitle.textContent = activeCategory === 'All' ? 'All Templates' : activeCategory;
    }
    if (countIndicator) {
      countIndicator.textContent = `${filtered.length} design${filtered.length === 1 ? '' : 's'}`;
    }

    // Grid rendering
    if (filtered.length === 0) {
      renderEmptyState();
    } else {
      renderGrid(filtered);
    }
  }

  function renderFeaturedRow(items) {
    featuredRow.innerHTML = items.map((t) => `
      <button
        type="button"
        data-id="${t.id}"
        class="template-select-btn group relative w-64 shrink-0 overflow-hidden rounded-3xl border border-ink-200 bg-white text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover sm:w-72"
      >
        <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
          ${t.image_url ? `
            <img
              src="${escapeHtml(t.image_url)}"
              alt="${escapeHtml(t.name)}"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ` : ''}
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent"></div>
          <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg> Featured
          </span>
          <div class="absolute bottom-3 left-3 right-3">
            <p class="text-[11px] font-medium text-white/80">${escapeHtml(t.category)}</p>
            <h3 class="font-display text-lg font-semibold text-white">
              ${escapeHtml(t.name)}
            </h3>
          </div>
        </div>
      </button>
    `).join('');

    bindTemplateSelectBtns(featuredRow);
  }

  function renderGrid(items) {
    if (!templatesGrid) return;
    templatesGrid.className = 'mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    templatesGrid.innerHTML = items.map((t, index) => {
      const delay = Math.min(index * 60, 400);
      const tags = (t.tags || []).slice(0, 3);
      const priceFormatted = Number(t.price).toLocaleString('en-IN');

      return `
        <button
          type="button"
          data-id="${t.id}"
          style="animation-delay: ${delay}ms;"
          class="template-select-btn group animate-fade-up flex flex-col overflow-hidden rounded-3xl border border-ink-200 bg-white text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-cardHover"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
            ${t.image_url ? `
              <img
                src="${escapeHtml(t.image_url)}"
                alt="${escapeHtml(t.name)}"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ` : `<div class="h-full w-full skeleton-shimmer"></div>`}
            <div class="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent"></div>
            ${t.is_featured ? `
              <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-500/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur">
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
                Featured
              </span>
            ` : ''}
            <span class="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink-700 shadow-sm backdrop-blur">
              ${escapeHtml(t.category)}
            </span>
            <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <h3 class="font-display text-lg font-semibold leading-tight text-white drop-shadow">
                ${escapeHtml(t.name)}
              </h3>
              <span class="shrink-0 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink-900 shadow-sm">
                ${config.currency}${priceFormatted}
              </span>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-3 p-4">
            ${t.tagline ? `
              <p class="text-sm leading-relaxed text-ink-600 line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                ${escapeHtml(t.tagline)}
              </p>
            ` : ''}
            <div class="mt-auto flex items-center justify-between">
              <div class="flex flex-wrap gap-1.5">
                ${tags.map((tag) => `
                  <span class="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-medium text-ink-600">
                    ${escapeHtml(tag)}
                  </span>
                `).join('')}
              </div>
              <span class="inline-flex items-center gap-1 text-sm font-semibold text-gold-600 transition group-hover:gap-2">
                View
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </button>
      `;
    }).join('');

    bindTemplateSelectBtns(templatesGrid);
  }

  function renderSkeleton() {
    if (!templatesGrid) return;
    templatesGrid.className = 'mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    templatesGrid.innerHTML = Array.from({ length: 8 }).map(() => `
      <div class="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
        <div class="aspect-[4/3] skeleton-shimmer"></div>
        <div class="space-y-3 p-4">
          <div class="h-4 w-2/3 rounded skeleton-shimmer"></div>
          <div class="h-3 w-full rounded skeleton-shimmer"></div>
          <div class="h-3 w-1/2 rounded skeleton-shimmer"></div>
        </div>
      </div>
    `).join('');
  }

  function renderEmptyState() {
    if (!templatesGrid) return;
    templatesGrid.className = '';
    templatesGrid.innerHTML = `
      <div class="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-white py-16 text-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100">
          <svg class="h-6 w-6 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3 class="mt-4 font-display text-lg font-semibold text-ink-900">
          No designs found
        </h3>
        <p class="mt-1 max-w-xs text-sm text-ink-500">
          Try a different search or category — we have designs for every occasion.
        </p>
        <button
          type="button"
          id="reset-filters-btn"
          class="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
        >
          Clear filters
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;

    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchQuery = '';
        activeCategory = 'All';
        if (searchInput) searchInput.value = '';
        updateCategoryButtonsUI();
        renderAll();
      });
    }
  }

  function renderError(msg) {
    if (!templatesGrid) return;
    templatesGrid.className = '';
    templatesGrid.innerHTML = `
      <div class="mt-10 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
        <h3 class="font-display text-lg font-semibold text-red-700">
          Something went wrong
        </h3>
        <p class="mt-1 text-sm text-red-600">${escapeHtml(msg)}</p>
      </div>
    `;
  }

  // Event Listener Bindings
  function bindTemplateSelectBtns(container) {
    const btns = container.querySelectorAll('.template-select-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const tmpl = allTemplates.find((t) => t.id === id);
        if (tmpl) openModal(tmpl);
      });
    });
  }

  function initSearch() {
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchClearBtn) searchClearBtn.style.display = val ? 'block' : 'none';

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = val;
        renderAll();
      }, 200);
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        renderAll();
      });
    }
  }

  function initCategoryButtons() {
    const container = document.getElementById('category-bar');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.cat-btn');
      if (!btn) return;
      activeCategory = btn.getAttribute('data-category');
      updateCategoryButtonsUI();
      renderAll();
    });
  }

  function updateCategoryButtonsUI() {
    const btns = document.querySelectorAll('.cat-btn');
    btns.forEach((btn) => {
      const cat = btn.getAttribute('data-category');
      if (cat === activeCategory) {
        btn.className = 'cat-btn shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all bg-ink-900 text-white shadow-card';
      } else {
        btn.className = 'cat-btn shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all border border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900';
      }
    });
  }

  function initMobileFilters() {
    const openBtns = document.querySelectorAll('.open-filter-btn');
    openBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (filterSheetOverlay) filterSheetOverlay.style.display = 'flex';
      });
    });

    const closeBtns = document.querySelectorAll('.close-filter-btn');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (filterSheetOverlay) filterSheetOverlay.style.display = 'none';
      });
    });
  }

  // Modal Functionality
  function openModal(template) {
    selectedTemplate = template;
    currentStep = 'details';
    galleryIndex = 0;
    document.body.style.overflow = 'hidden';

    renderModalContent();
    if (modalOverlay) modalOverlay.style.display = 'flex';
  }

  function closeModal() {
    selectedTemplate = null;
    document.body.style.overflow = '';
    if (modalOverlay) modalOverlay.style.display = 'none';
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectedTemplate) {
      closeModal();
    }
  });

  function renderModalContent() {
    if (!selectedTemplate || !modalContent) return;

    const t = selectedTemplate;
    const gallery = [t.image_url, ...(t.gallery || [])].filter(Boolean);
    const priceFormatted = Number(t.price).toLocaleString('en-IN');

    modalContent.innerHTML = `
      <div class="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-slide-up sm:rounded-3xl sm:animate-scale-in">
        <!-- Gallery Header -->
        <div class="relative aspect-[16/10] shrink-0 overflow-hidden bg-ink-100 sm:aspect-[16/8]">
          ${gallery[galleryIndex] ? `
            <img src="${escapeHtml(gallery[galleryIndex])}" alt="${escapeHtml(t.name)}" class="h-full w-full object-cover" />
          ` : ''}
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/20"></div>

          <button
            type="button"
            id="modal-close-btn"
            class="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-ink-700 shadow-md backdrop-blur transition hover:bg-white hover:text-ink-900"
            aria-label="Close"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>

          ${t.is_featured ? `
            <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg> Featured
            </span>
          ` : ''}

          ${gallery.length > 1 ? `
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
              ${gallery.map((_, i) => `
                <span class="h-1.5 rounded-full transition-all ${i === galleryIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}"></span>
              `).join('')}
            </div>
          ` : ''}

          <div class="absolute bottom-3 left-4 right-4">
            <span class="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-700">
              ${escapeHtml(t.category)}
            </span>
            <h2 class="mt-2 font-display text-2xl font-semibold text-white drop-shadow sm:text-3xl">
              ${escapeHtml(t.name)}
            </h2>
          </div>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          ${currentStep === 'details' ? renderModalDetailsStep(t) : renderModalOrderStep(t)}
        </div>

        <!-- Sticky Footer CTA -->
        <div class="shrink-0 border-t border-ink-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          ${currentStep === 'details' ? `
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs text-ink-500">Starting at</p>
                <p class="font-display text-2xl font-semibold text-ink-900">
                  ${config.currency}${priceFormatted}
                </p>
              </div>
              <button
                type="button"
                id="modal-order-step-btn"
                class="flex-1 rounded-2xl bg-ink-900 px-6 py-3.5 text-base font-semibold text-white shadow-card transition hover:bg-ink-800 active:scale-[0.98] sm:flex-none sm:px-10"
              >
                Order Now
              </button>
            </div>
          ` : `
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between gap-3">
                <button
                  type="button"
                  id="modal-back-step-btn"
                  class="rounded-2xl border border-ink-200 px-5 py-3.5 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  id="modal-submit-whatsapp-btn"
                  class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-card transition hover:bg-[#1fb557] active:scale-[0.98]"
                >
                  <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.801-1.259z"/></svg>
                  Order on WhatsApp
                </button>
              </div>
              <p class="flex items-center justify-center gap-1.5 text-center text-xs text-ink-500">
                <svg class="h-3.5 w-3.5 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                No payment now — we confirm details and share a permanent link after build.
              </p>
            </div>
          `}
        </div>
      </div>
    `;

    bindModalEvents(t, gallery);
  }

  function renderModalDetailsStep(t) {
    const features = t.features || [];
    return `
      <div class="flex flex-col gap-6">
        ${t.tagline ? `<p class="text-base font-medium leading-relaxed text-ink-700">${escapeHtml(t.tagline)}</p>` : ''}
        ${t.description ? `<p class="text-[15px] leading-relaxed text-ink-600">${escapeHtml(t.description)}</p>` : ''}

        ${features.length > 0 ? `
          <div>
            <h4 class="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
              What's included
            </h4>
            <ul class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              ${features.map((f) => `
                <li class="flex items-start gap-2 rounded-xl bg-ink-50 px-3 py-2.5 text-sm text-ink-700">
                  <svg class="mt-0.5 h-4 w-4 shrink-0 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
                  ${escapeHtml(f)}
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

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
    `;
  }

  function renderModalOrderStep(t) {
    const priceFormatted = Number(t.price).toLocaleString('en-IN');
    return `
      <div class="flex flex-col gap-5">
        <div class="rounded-2xl bg-ink-50 px-4 py-3">
          <p class="text-xs text-ink-500">Ordering</p>
          <p class="font-semibold text-ink-900">
            ${escapeHtml(t.name)} · ${config.currency}${priceFormatted}
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
    `;
  }

  function bindModalEvents(t, gallery) {
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const prevBtn = document.getElementById('gallery-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length;
        renderModalContent();
      });
    }

    const nextBtn = document.getElementById('gallery-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        galleryIndex = (galleryIndex + 1) % gallery.length;
        renderModalContent();
      });
    }

    const orderStepBtn = document.getElementById('modal-order-step-btn');
    if (orderStepBtn) {
      orderStepBtn.addEventListener('click', () => {
        currentStep = 'order';
        renderModalContent();
      });
    }

    const backStepBtn = document.getElementById('modal-back-step-btn');
    if (backStepBtn) {
      backStepBtn.addEventListener('click', () => {
        currentStep = 'details';
        renderModalContent();
      });
    }

    const submitWhatsappBtn = document.getElementById('modal-submit-whatsapp-btn');
    if (submitWhatsappBtn) {
      submitWhatsappBtn.addEventListener('click', () => {
        handleOrderSubmit(t);
      });
    }
  }

  function handleOrderSubmit(t) {
    const recipientInput = document.getElementById('field-recipient');
    const dateInput = document.getElementById('field-date');
    const yourNameInput = document.getElementById('field-yourname');
    const phoneInput = document.getElementById('field-phone');
    const emailInput = document.getElementById('field-email');
    const notesInput = document.getElementById('field-notes');

    const errRecipient = document.getElementById('err-recipient');
    const errYourName = document.getElementById('err-yourname');
    const errPhone = document.getElementById('err-phone');
    const errEmail = document.getElementById('err-email');

    let valid = true;

    // Reset errors
    if (errRecipient) errRecipient.classList.add('hidden');
    if (errYourName) errYourName.classList.add('hidden');
    if (errPhone) errPhone.classList.add('hidden');
    if (errEmail) errEmail.classList.add('hidden');

    const recipientVal = recipientInput ? recipientInput.value.trim() : '';
    const dateVal = dateInput ? dateInput.value : '';
    const yourNameVal = yourNameInput ? yourNameInput.value.trim() : '';
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const notesVal = notesInput ? notesInput.value.trim() : '';

    if (!recipientVal) {
      if (errRecipient) { errRecipient.textContent = 'Please enter the recipient name'; errRecipient.classList.remove('hidden'); }
      valid = false;
    }

    if (!yourNameVal) {
      if (errYourName) { errYourName.textContent = 'Please enter your name'; errYourName.classList.remove('hidden'); }
      valid = false;
    }

    if (!phoneVal || phoneVal.replace(/\D/g, '').length < 8) {
      if (errPhone) { errPhone.textContent = 'Please enter a valid phone number'; errPhone.classList.remove('hidden'); }
      valid = false;
    }

    if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      if (errEmail) { errEmail.textContent = 'Please enter a valid email'; errEmail.classList.remove('hidden'); }
      valid = false;
    }

    if (!valid) return;

    // Format WhatsApp message
    const priceFormatted = Number(t.price).toLocaleString('en-IN');
    const lines = [
      `*New Order — ${config.brandDomain}*`,
      ``,
      `*Template:* ${t.name}`,
      `*Category:* ${t.category}`,
      `*Price:* ${config.currency}${priceFormatted}`,
      ``,
      `*Recipient / Occasion Name:* ${recipientVal}`,
      `*Occasion Date:* ${dateVal || 'Not specified'}`,
      `*Your Name:* ${yourNameVal}`,
      `*Phone:* ${phoneVal}`,
      `*Email:* ${emailVal || 'Not provided'}`,
      ``,
      `*Notes:*`,
      notesVal || 'None'
    ];

    const message = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${config.whatsappNumber}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
