// CSRGO Wishes Client Interactivity Engine
(function () {
  'use strict';

  // Config variables (injected via window.SITE_CONFIG or defaults)
  const config = window.SITE_CONFIG || {
    brandName: 'CSRGO Wishes',
    brandDomain: 'wishes.csrgo.com',
    whatsappNumber: '919392438319',
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
  function initApp() {
    initSearch();
    initCategoryButtons();
    initMobileFilters();
    loadTemplates();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Fetch templates from Supabase or Fallback static dataset
  async function loadTemplates() {
    renderSkeleton();

    let fetched = null;
    let fallbackData = window.FALLBACK_TEMPLATES;
    if (typeof fallbackData === 'string') {
      try {
        fallbackData = JSON.parse(fallbackData);
      } catch (e) {
        fallbackData = null;
      }
    }

    if (Array.isArray(fallbackData) && fallbackData.length > 0) {
      fetched = fallbackData;
    } else {
      try {
        const res = await fetch('/data/templates.json');
        if (res.ok) {
          fetched = await res.json();
        }
      } catch (e) {
        console.error('Error loading templates JSON:', e);
      }
    }

    if (fetched && Array.isArray(fetched)) {
      allTemplates = fetched;
      renderAll();
      checkUrlForModal();
    } else {
      renderError('Failed to load templates.');
    }
  }

  function renderCategoryButtons() {
    const categoryBar = document.getElementById('category-bar');
    const filterContainer = document.getElementById('filter-categories-container');

    const categoriesSet = new Set();
    allTemplates.forEach((t) => {
      if (t.category && t.is_active !== false) {
        categoriesSet.add(t.category);
      }
    });
    const categories = Array.from(categoriesSet);

    if (categoryBar) {
      const barButtons = ['All', ...categories].map((cat) => {
        const isActive = cat === activeCategory;
        const activeClasses = 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md shadow-purple-500/25';
        const inactiveClasses = 'border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium';
        return `
          <button
            type="button"
            data-category="${escapeHtml(cat)}"
            class="cat-btn shrink-0 rounded-full px-4 py-2 text-sm transition-all ${isActive ? activeClasses : inactiveClasses}"
          >
            ${escapeHtml(cat)}
          </button>
        `;
      }).join('');
      categoryBar.innerHTML = barButtons;
    }

    if (filterContainer) {
      const sheetButtons = ['All', ...categories].map((cat) => {
        const isActive = cat === activeCategory;
        const activeClasses = 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold';
        const inactiveClasses = 'border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium';
        return `
          <button
            type="button"
            data-category="${escapeHtml(cat)}"
            class="cat-btn close-filter-btn rounded-full px-4 py-2 text-sm transition ${isActive ? activeClasses : inactiveClasses}"
          >
            ${escapeHtml(cat)}
          </button>
        `;
      }).join('');
      filterContainer.innerHTML = sheetButtons;
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
    const isHomePage = !document.getElementById('search-input') && !document.getElementById('category-bar');
    
    if (isHomePage) {
      const recent = allTemplates.slice(0, 6);
      if (countIndicator) {
        countIndicator.textContent = `${recent.length} template${recent.length === 1 ? '' : 's'}`;
      }
      renderGrid(recent);
      return;
    }

    renderCategoryButtons();
    const filtered = getFilteredTemplates();

    // Category title & count
    if (activeCategoryTitle) {
      activeCategoryTitle.textContent = activeCategory === 'All' ? 'All Templates' : `${activeCategory} Wish Templates`;
    }
    if (countIndicator) {
      countIndicator.textContent = `${filtered.length} template${filtered.length === 1 ? '' : 's'}`;
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
    templatesGrid.className = 'mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3';
    templatesGrid.innerHTML = items.map((t, index) => {
      const delay = Math.min(index * 60, 400);

      return `
        <button
          type="button"
          data-id="${t.id}"
          style="animation-delay: ${delay}ms;"
          class="template-select-btn group relative animate-fade-up w-full aspect-[4/3] overflow-hidden rounded-3xl border border-white/20 text-left shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cardHover focus:outline-none"
        >
          ${t.image_url ? `
            <img
              src="${escapeHtml(t.image_url)}"
              alt="${escapeHtml(t.name)}"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ` : `<div class="h-full w-full skeleton-shimmer"></div>`}
          
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

          <!-- Featured Badge (Top Left) -->
          ${t.is_featured !== false ? `
            <span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#c98a3a] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md backdrop-blur-md">
              <svg class="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1 1.275-1.275L12 3z"/></svg>
              FEATURED
            </span>
          ` : ''}

          <!-- Text Information Overlay (Bottom Left) -->
          <div class="absolute bottom-5 left-5 right-5 text-left">
            <p class="text-xs font-semibold text-white/80 tracking-wide mb-1">
              ${escapeHtml(t.category)}
            </p>
            <h3 class="font-display text-xl font-bold leading-snug text-white drop-shadow-md sm:text-2xl">
              ${escapeHtml(t.name)}
            </h3>
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
    const catName = activeCategory === 'All' ? '' : ` for ${activeCategory}`;
    templatesGrid.className = '';
    templatesGrid.innerHTML = `
      <div class="mt-8 flex flex-col items-center justify-center rounded-3xl border border-purple-100 dark:border-gray-800 bg-gradient-to-br from-white via-purple-50/40 to-blue-50/30 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 py-16 px-6 text-center shadow-lg shadow-purple-500/5">
        <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-md shadow-purple-500/25 mb-4 animate-bounce-soft">
          <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
        </div>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-100/80 dark:bg-purple-900/40 px-3.5 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-2">
          Coming Soon
        </span>
        <h3 class="font-display text-2xl font-bold text-gray-900 dark:text-white">
          New Templates Coming Soon${escapeHtml(catName)}!
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
    const activeClasses = 'cat-btn shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25';
    const inactiveClasses = 'cat-btn shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

    btns.forEach((btn) => {
      const cat = btn.getAttribute('data-category');
      btn.className = cat === activeCategory ? activeClasses : inactiveClasses;
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
  function checkUrlForModal() {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const orderId = params.get('order') || params.get('template') || hashParams.get('order') || hashParams.get('template');
    if (orderId) {
      const found = allTemplates.find(t => t.id === orderId || (t.slug && t.slug.includes(orderId)));
      if (found) {
        openModal(found, false);
      }
    }
  }

  function openModal(template, updateUrl = true) {
    selectedTemplate = template;
    currentStep = 'details';
    galleryIndex = 0;
    document.body.style.overflow = 'hidden';

    if (updateUrl && template && template.id) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('order', template.id);
      window.history.pushState({ modalOpen: true, templateId: template.id }, '', newUrl.toString());
    }

    renderModalContent();
    if (modalOverlay) modalOverlay.style.display = 'flex';
  }

  let modalGalleryInterval = null;

  function stopGalleryAutoPlay() {
    if (modalGalleryInterval) {
      clearInterval(modalGalleryInterval);
      modalGalleryInterval = null;
    }
  }

  function startGalleryAutoPlay(gallery) {
    stopGalleryAutoPlay();
    if (gallery && gallery.length > 1) {
      modalGalleryInterval = setInterval(() => {
        galleryIndex = (galleryIndex + 1) % gallery.length;
        updateGalleryUI(gallery);
      }, 3000);
    }
  }

  function closeModal(updateUrl = true) {
    stopGalleryAutoPlay();
    selectedTemplate = null;
    document.body.style.overflow = '';
    if (modalOverlay) modalOverlay.style.display = 'none';

    if (updateUrl) {
      const newUrl = new URL(window.location.href);
      if (newUrl.searchParams.has('order')) {
        newUrl.searchParams.delete('order');
        window.history.pushState({ modalOpen: false }, '', newUrl.toString());
      }
    }
  }

  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order') || params.get('template');
    if (orderId) {
      const found = allTemplates.find(t => t.id === orderId || (t.slug && t.slug.includes(orderId)));
      if (found) {
        openModal(found, false);
      } else {
        closeModal(false);
      }
    } else {
      closeModal(false);
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectedTemplate) {
      closeModal();
    }
  });

  function renderModalContent() {
    if (!selectedTemplate || !modalContent) return;

    const t = selectedTemplate;
    const galleryRaw = (t.gallery && t.gallery.length > 0) ? t.gallery : [t.image_url];
    const gallery = Array.from(new Set([t.image_url, ...galleryRaw])).filter(Boolean);
    const priceFormatted = Number(t.price).toLocaleString('en-IN');

    modalContent.innerHTML = `
      <div class="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-slide-up sm:rounded-3xl sm:animate-scale-in">
        <!-- Gallery Header -->
        <div class="relative aspect-[16/10] shrink-0 overflow-hidden bg-ink-100 sm:aspect-[16/8]">
          ${gallery[galleryIndex] ? `
            <img id="modal-gallery-img" src="${escapeHtml(gallery[galleryIndex])}" alt="${escapeHtml(t.name)}" class="h-full w-full object-cover transition-opacity duration-200" />
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
                <span class="gallery-dot h-1.5 rounded-full transition-all ${i === galleryIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}"></span>
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
        <div id="modal-step-body" class="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          ${currentStep === 'details' ? renderModalDetailsStep(t) : renderModalOrderStep(t)}
        </div>

        <!-- Sticky Footer CTA -->
        <div id="modal-step-footer" class="shrink-0">
          ${renderModalFooterHtml(t)}
        </div>
      </div>
    `;

    bindModalEvents(t, gallery);
  }

  function renderModalFooterHtml(t) {
    const hasCustomBuilder = !!t.builder_key;
    const showWhatsapp = t.show_whatsapp_order !== false && !hasCustomBuilder;
    const showBack = t.show_back_button !== false && !hasCustomBuilder;
    const priceFormatted = Number(t.price).toLocaleString('en-IN');

    if (currentStep === 'details') {
      return `
        <div class="border-t border-ink-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-medium text-ink-500 dark:text-gray-400">Price</p>
              ${t.original_price && t.original_price > t.price ? `
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-400 line-through">₹${t.original_price}</span>
                  <span class="font-display text-2xl font-bold text-rose-600 dark:text-rose-400">${t.price === 0 ? 'FREE' : `₹${t.price}`}</span>
                  <span class="rounded-full bg-rose-100 dark:bg-rose-900/40 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-300">
                    ${Math.round(((t.original_price - t.price) / t.original_price) * 100)}% OFF
                  </span>
                </div>
              ` : `
                <p class="font-display text-2xl font-semibold text-ink-900 dark:text-white">
                  ${t.price === 0 ? 'FREE' : `${config.currency}${priceFormatted}`}
                </p>
              `}
            </div>
            <div class="flex items-center gap-2.5">
              <a
                href="${t.demo_url || '/' + t.slug.replace(/^\//, '') + '/'}"
                target="_blank"
                class="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 shrink-0"
              >
                <svg class="h-4 w-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Demo Site
              </a>
              <button
                type="button"
                id="modal-order-step-btn"
                class="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-3 text-xs sm:text-base font-bold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98] sm:flex-none sm:px-8"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (!showWhatsapp && !showBack) {
      return '';
    }

    return `
      <div class="border-t border-ink-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between gap-3">
            ${showBack ? `
              <button
                type="button"
                id="modal-back-step-btn"
                class="rounded-2xl border border-ink-200 px-5 py-3.5 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
              >
                Back
              </button>
            ` : ''}
            ${showWhatsapp ? `
              <button
                type="button"
                id="modal-submit-whatsapp-btn"
                class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-card transition hover:bg-[#1fb557] active:scale-[0.98]"
              >
                <svg class="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                Order on WhatsApp
              </button>
            ` : ''}
          </div>
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
          <div class="flex flex-col items-center gap-1.5 rounded-2xl border border-ink-100 dark:border-gray-800 bg-white dark:bg-gray-800/80 px-2 py-3 text-center">
            ${(t.price > 0 || t.slug === 'templates/birthday-star') ? `
              <span class="text-purple-600 dark:text-purple-400"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
              <span class="text-[11px] font-medium leading-tight text-ink-600 dark:text-gray-300">48h Delivery</span>
            ` : `
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
    `;
  }

  function loadBuilderScript(scriptUrl, callback) {
    if (!scriptUrl) return;
    const existing = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existing) {
      if (callback) callback();
      return;
    }
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => {
      if (callback) callback();
    };
    document.body.appendChild(script);
  }

  function renderModalOrderStep(t) {
    if (t.builder_key && t.builder_script) {
      if (window.WISH_BUILDERS && window.WISH_BUILDERS[t.builder_key]) {
        return window.WISH_BUILDERS[t.builder_key].renderForm(t);
      }
      loadBuilderScript(t.builder_script, () => {
        const body = document.getElementById('modal-step-body');
        if (body && window.WISH_BUILDERS && window.WISH_BUILDERS[t.builder_key]) {
          body.innerHTML = window.WISH_BUILDERS[t.builder_key].renderForm(t);
          window.WISH_BUILDERS[t.builder_key].bindForm(t);
        }
      });
      return `
        <div class="py-12 text-center text-ink-500">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-2"></div>
          <p class="text-xs">Loading template builder...</p>
        </div>
      `;
    }

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

  function updateGalleryUI(gallery) {
    const imgEl = document.getElementById('modal-gallery-img');
    if (imgEl && gallery[galleryIndex]) {
      imgEl.src = gallery[galleryIndex];
    }
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, i) => {
      if (i === galleryIndex) {
        dot.className = 'gallery-dot h-1.5 rounded-full transition-all w-5 bg-white';
      } else {
        dot.className = 'gallery-dot h-1.5 rounded-full transition-all w-1.5 bg-white/50';
      }
    });
  }

  function bindModalEvents(t, gallery) {
    startGalleryAutoPlay(gallery);

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const prevBtn = document.getElementById('gallery-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length;
        updateGalleryUI(gallery);
        startGalleryAutoPlay(gallery);
      });
    }

    const nextBtn = document.getElementById('gallery-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        galleryIndex = (galleryIndex + 1) % gallery.length;
        updateGalleryUI(gallery);
        startGalleryAutoPlay(gallery);
      });
    }

    bindModalFooterEvents(t);

    if (t.builder_key && window.WISH_BUILDERS && window.WISH_BUILDERS[t.builder_key]) {
      window.WISH_BUILDERS[t.builder_key].bindForm(t);
    }
  }

  function bindModalFooterEvents(t) {
    const orderStepBtn = document.getElementById('modal-order-step-btn');
    if (orderStepBtn) {
      orderStepBtn.onclick = () => switchStep('order');
    }

    const backStepBtn = document.getElementById('modal-back-step-btn');
    if (backStepBtn) {
      backStepBtn.onclick = () => switchStep('details');
    }

    const submitWhatsappBtn = document.getElementById('modal-submit-whatsapp-btn');
    if (submitWhatsappBtn) {
      submitWhatsappBtn.onclick = () => handleOrderSubmit(t);
    }
  }

  function switchStep(step) {
    currentStep = step;
    const bodyEl = document.getElementById('modal-step-body');
    const footerEl = document.getElementById('modal-step-footer');
    if (!selectedTemplate) return;

    const t = selectedTemplate;

    if (bodyEl) {
      bodyEl.innerHTML = currentStep === 'details' ? renderModalDetailsStep(t) : renderModalOrderStep(t);
      bodyEl.scrollTop = 0;
      if (currentStep === 'order' && t.builder_key && window.WISH_BUILDERS && window.WISH_BUILDERS[t.builder_key]) {
        window.WISH_BUILDERS[t.builder_key].bindForm(t);
      }
    }

    if (footerEl) {
      footerEl.innerHTML = renderModalFooterHtml(t);
      bindModalFooterEvents(t);
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

  // Global Header Interactivity Functions
  window.toggleTheme = function () {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || (html.classList.contains('dark') ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  }

  window.toggleMobileMenu = function (e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  };

  // Close mobile menu when user clicks or taps anywhere outside
  document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    const toggleBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      if (!mobileMenu.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
        closeMobileMenu();
      }
    }
  });

  // Close mobile menu on page scroll
  window.addEventListener('scroll', () => {
    closeMobileMenu();
  }, { passive: true });
})();

