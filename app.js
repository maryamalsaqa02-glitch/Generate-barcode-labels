(() => {
  const products = [
    { sku: 'SKU-2210', name: 'Product 1', nameAr: 'المنتج ١', price: 12.5 },
    { sku: 'SKU-3087', name: 'Product 2', nameAr: 'المنتج ٢', price: 12.5 },
    { sku: 'SKU-1042', name: 'Product 3', nameAr: 'المنتج ٣', price: 12.5 },
    { sku: 'SKU-2301', name: 'Product 4', nameAr: 'المنتج ٤', price: 12.5 }
  ];
  const messages = {
    en: {
      operations:'OPERATIONS',dashboard:'Dashboard',alerts:'Alerts',inventory:'Inventory',products:'Products',planning:'PLANNING',forecast:'AI forecast',purchaseOrders:'Purchase orders',suppliers:'Suppliers',reports:'Reports',warehouseManager:'Warehouse Manager',manager:'Manager',activeUsers:'Active users',signedInWebsite:'Signed in to the website',online:'online',activeEightAgo:'Active 8 min ago',admin:'Admin',backProducts:'← Products',title:'Generate barcode labels',subtitle:'Choose products and how many labels to print',searchPlaceholder:'Search products, SKUs...',chooseProducts:'1. Choose products',customize:'Customize labels',selectProduct:'Select product',numberOfLabels:'Number of labels',quantityPlaceholder:'e.g. 10',addProduct:'Add product',productName:'PRODUCT NAME',numberOfLabelsCaps:'NUMBER OF LABELS',actions:'Actions',totalLabels:'Total labels',emptyProducts:'Add a product to start creating labels.',generate:'Generate',preview:'2. Label preview',labels:'labels',selectedLabel:'Label {count}',print:'Print',download:'Download',remove:'Remove',customizeTitle:'Customize labels',labelBrand:'Label heading',showSku:'Show product code',showPrice:'Show price',cancel:'Cancel',save:'Save',price:'Price',noLabels:'No labels to preview',noLabelsYet:'No labels yet',generatePreview:'Press Generate to see a preview of your {count} labels',added:'Product added to the label list.',removed:'Product removed.',generated:'Barcode preview updated.',saved:'Label settings saved.',downloaded:'Printable labels downloaded.'
    },
    ar: {
      operations:'العمليات',dashboard:'لوحة التحكم',alerts:'التنبيهات',inventory:'المخزون',products:'المنتجات',planning:'التخطيط',forecast:'توقعات الذكاء الاصطناعي',purchaseOrders:'أوامر الشراء',suppliers:'الموردون',reports:'التقارير',warehouseManager:'مدير المخزن',manager:'مدير المخزن',activeUsers:'المستخدمون النشطون',signedInWebsite:'مسجلون الدخول إلى الموقع',online:'متصلون',activeEightAgo:'نشط منذ ٨ دقائق',admin:'مسؤول',backProducts:'المنتجات ←',title:'إنشاء ملصقات الباركود',subtitle:'اختاري المنتجات وعدد الملصقات المطلوبة',searchPlaceholder:'ابحثي عن المنتجات أو الأكواد...',chooseProducts:'١. اختاري المنتجات',customize:'تخصيص الملصقات',selectProduct:'اختاري منتجًا',numberOfLabels:'عدد الملصقات',quantityPlaceholder:'مثال: ١٠',addProduct:'إضافة منتج',productName:'اسم المنتج',numberOfLabelsCaps:'عدد الملصقات',actions:'الإجراءات',totalLabels:'إجمالي الملصقات',emptyProducts:'أضيفي منتجًا لبدء إنشاء الملصقات.',generate:'إنشاء',preview:'٢. معاينة الملصقات',labels:'ملصقًا',selectedLabel:'الملصق {count}',print:'طباعة',download:'تنزيل',remove:'حذف',customizeTitle:'تخصيص الملصقات',labelBrand:'عنوان الملصق',showSku:'إظهار كود المنتج',showPrice:'إظهار السعر',cancel:'إلغاء',save:'حفظ',price:'السعر',noLabels:'لا توجد ملصقات للمعاينة',noLabelsYet:'لا توجد ملصقات بعد',generatePreview:'اضغطي على إنشاء لمعاينة ملصقاتك وعددها {count}',added:'تمت إضافة المنتج إلى القائمة.',removed:'تم حذف المنتج.',generated:'تم تحديث معاينة الباركود.',saved:'تم حفظ إعدادات الملصقات.',downloaded:'تم تنزيل ملف الملصقات الجاهز للطباعة.'
    }
  };
  const customizeMessages = {
    en: { labelSize:'Label size', storeName:'Store name', skuNumberOption:'SKU number', productNameOption:'Product name', priceOption:'Price', on:'ON', off:'OFF', sizeSmall:'Small · 50×50 mm', sizeMedium:'Medium · 60×60 mm', sizeLarge:'Large · 100×100 mm' },
    ar: { labelSize:'حجم الملصق', storeName:'اسم المتجر', skuNumberOption:'رقم SKU', productNameOption:'اسم المنتج', priceOption:'السعر', on:'مفعّل', off:'متوقف', sizeSmall:'صغير · 50×50 مم', sizeMedium:'متوسط · 60×60 مم', sizeLarge:'كبير · 100×100 مم' }
  };
  const labelSizes = [
    { id:'small', textKey:'sizeSmall', width:50, height:50 },
    { id:'medium', textKey:'sizeMedium', width:60, height:60 },
    { id:'large', textKey:'sizeLarge', width:100, height:100 }
  ];
  const state = {
    lang: 'en',
    generated: false,
    items: [
      { ...products[0], quantity: 10 },
      { ...products[1], quantity: 2 }
    ],
    brand: 'Smart Warehouse',
    showStoreName: true,
    showSku: true,
    showProductName: true,
    showPrice: true,
    labelSize: 'small',
    selectedLabelIndex: null,
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const productSelect = $('#productSelect');
  const productMenu = $('#productMenu');
  const pickerTrigger = $('#productPickerTrigger');
  const selectedProductLabel = $('#selectedProductLabel');
  const quantityInput = $('#quantityInput');
  const rows = $('#productRows');
  const grid = $('#labelGrid');
  const toast = $('#toast');
  const customizeDialog = $('#customizeDialog');
  const labelSizeMenu = $('#labelSizeMenu');
  const labelSizeTrigger = $('#labelSizeTrigger');
  const labelSizeLabel = $('#labelSizeLabel');
  let draftSettings = null;
  let originalSettings = null;
  let toastTimer;

  function text(key) { return customizeMessages[state.lang][key] || messages[state.lang][key] || customizeMessages.en[key] || messages.en[key] || key; }
  function productName(product) { return state.lang === 'ar' && product.nameAr ? product.nameAr : product.name; }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[char]));
  }
  function formatNumber(number) {
    return new Intl.NumberFormat(state.lang === 'ar' ? 'ar-EG' : 'en-US').format(number);
  }
  function asciiDigits(value) {
    return String(value).replace(/[٠-٩۰-۹]/g, digit => String(digit.charCodeAt(0) >= 0x06f0 ? digit.charCodeAt(0) - 0x06f0 : digit.charCodeAt(0) - 0x0660));
  }
  function languageDigits(value) {
    const ascii = asciiDigits(value);
    return state.lang === 'ar' ? ascii.replace(/[0-9]/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]) : ascii;
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
  }
  function localize() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i18n]').forEach(el => { el.textContent = text(el.dataset.i18n); });
    document.querySelectorAll("[data-count]").forEach(el => { el.textContent = languageDigits(el.dataset.count); });
    const initials = document.querySelector('.avatar-initials');
    if (initials) initials.textContent = state.lang === 'ar' ? 'م ا' : 'WM';
    $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = text(el.dataset.i18nPlaceholder); });
    $$('.language-option').forEach(button => button.classList.toggle('selected', button.dataset.lang === state.lang));
    quantityInput.value = languageDigits(quantityInput.value);
    renderCustomizeControls();
    renderProducts();
    renderLabels();
  }
  function renderSelect(filter = '') {
    const oldValue = productSelect.value || products[0].sku;
    const query = filter.trim().toLocaleLowerCase();
    const matches = products.filter(product => `${product.name} ${product.sku}`.toLocaleLowerCase().includes(query));
    productSelect.innerHTML = matches.map(product => `<option value="${product.sku}">${escapeHtml(productName(product))} · ${product.sku}</option>`).join('');
    if (matches.some(product => product.sku === oldValue)) productSelect.value = oldValue;
    if (!matches.length) productSelect.innerHTML = `<option value="">${state.lang === 'ar' ? 'لا توجد نتائج' : 'No matching products'}</option>`;
    const selected = products.find(product => product.sku === productSelect.value);
    selectedProductLabel.textContent = selected ? `${productName(selected)} · ${selected.sku}` : (state.lang === 'ar' ? 'لا توجد نتائج' : 'No matching products');
    productMenu.innerHTML = matches.length
      ? matches.map(product => `<button class="product-option" type="button" role="option" aria-selected="${product.sku === productSelect.value}" data-sku="${product.sku}">${escapeHtml(productName(product))} · ${product.sku}</button>`).join('')
      : `<button class="product-option" type="button" disabled>${state.lang === 'ar' ? 'لا توجد نتائج' : 'No matching products'}</button>`;
  }
  function renderProducts() {
    renderSelect($('#globalSearch').value);
    $('#totalLabels').textContent = formatNumber(state.items.reduce((sum, item) => sum + item.quantity, 0));
    $('#emptyTable').hidden = state.items.length > 0;
    rows.innerHTML = state.items.map((item, index) => `
      <tr>
        <td>${formatNumber(index + 1)}</td>
        <td>${escapeHtml(productName(item))} · ${item.sku}</td>
        <td>${formatNumber(item.quantity)}</td>
        <td><button class="remove-button" type="button" data-remove="${item.sku}">${text('remove')}</button></td>
      </tr>`).join('');
    rows.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
      state.items = state.items.filter(item => item.sku !== button.dataset.remove);
      renderProducts();
      renderLabels();
      showToast(text('removed'));
    }));
  }
  function makeBars(value) {
    let seed = [...value].reduce((sum, char) => ((sum * 31) + char.charCodeAt(0)) >>> 0, 217);
    const next = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed; };
    const bars = [];
    let x = 1;
    while (x < 107) {
      const width = 1 + next() % 3;
      if (next() % 2 === 0) bars.push(`<rect x="${x}" y="0" width="${width}" height="34"/>`);
      x += width + (next() % 3);
    }
    return `<svg class="barcode-graphic" viewBox="0 0 108 34" role="img" aria-label="Barcode for ${escapeHtml(value)}" xmlns="http://www.w3.org/2000/svg"><rect width="108" height="34" fill="#fff"/>${bars.join('')}</svg>`;
  }
  function syncPreviewActions() {
    const hasLabels = state.generated && state.items.some(item => item.quantity > 0);
    $('#printButton').disabled = !hasLabels;
    $('#downloadButton').disabled = !hasLabels;
  }
  function updatePreviewHeading(total = state.items.reduce((sum, item) => sum + item.quantity, 0)) {
    if (!state.generated) {
      $('#previewCount').textContent = '';
      $('#previewTitle').setAttribute('aria-label', text('preview'));
      return;
    }
    const selected = state.selectedLabelIndex;
    const countText = selected === null
      ? `· ${formatNumber(total)} ${text('labels')}`
      : `· ${text('selectedLabel').replace('{count}', formatNumber(selected + 1))}`;
    $('#previewCount').textContent = countText;
    $('#previewTitle').setAttribute('aria-label', `${text('preview')} ${countText}`);
  }
  function renderLabels() {
    const total = state.items.reduce((sum, item) => sum + item.quantity, 0);
    if (state.selectedLabelIndex !== null && state.selectedLabelIndex >= total) state.selectedLabelIndex = null;
    grid.dataset.size = state.labelSize;
    updatePreviewHeading(total);
    syncPreviewActions();
    if (!state.generated) {
      grid.innerHTML = `<div class="preview-empty"><span class="preview-empty-icon"><img src="barcode-small.svg" alt=""></span><strong>${text('noLabelsYet')}</strong><span>${text('generatePreview').replace('{count}', formatNumber(total))}</span></div>`;
      return;
    }
    const labels = [];
    state.items.forEach(item => {
      for (let count = 0; count < item.quantity; count++) labels.push(item);
    });
    grid.innerHTML = labels.length ? labels.map((item, index) => `
      <article class="printed-label${state.selectedLabelIndex === index ? ' selected' : ''}" data-label-index="${index}" tabindex="0" role="button" aria-pressed="${state.selectedLabelIndex === index}" aria-label="${text('selectedLabel').replace('{count}', formatNumber(index + 1))}">
        ${state.showStoreName ? `<div class="label-brand">${escapeHtml(state.brand)}</div>` : ''}
        ${makeBars(item.sku)}
        <div class="label-info">
          ${state.showSku ? `<span class="label-code">${item.sku.replace('SKU-', '')}</span>` : ''}
          ${state.showProductName ? `<strong class="label-product">${escapeHtml(productName(item))}</strong>` : ''}
          ${state.showPrice ? `<span class="label-price">${text('price')}: ${item.price.toFixed(2)} EGP</span>` : ''}
        </div>
      </article>`).join('') : `<p class="empty-table">${text('noLabels')}</p>`;
  }
  function selectLabel(card) {
    state.selectedLabelIndex = Number(card.dataset.labelIndex);
    grid.querySelectorAll('.printed-label').forEach(label => {
      const selected = label === card;
      label.classList.toggle('selected', selected);
      label.setAttribute('aria-pressed', String(selected));
    });
    updatePreviewHeading();
  }  function closeProductMenu(returnFocus = false) {
    productMenu.hidden = true;
    pickerTrigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) pickerTrigger.focus();
  }
  function toggleProductMenu() {
    const opening = productMenu.hidden;
    if (opening) {
      renderSelect($('#globalSearch').value);
      productMenu.hidden = false;
      pickerTrigger.setAttribute('aria-expanded', 'true');
      productMenu.querySelector('[aria-selected="true"]')?.focus();
    } else closeProductMenu();
  }
  function labelSizeName(id) {
    const size = labelSizes.find(option => option.id === id) || labelSizes[0];
    return text(size.textKey);
  }
  function renderCustomizeControls() {
    const settings = draftSettings || state;
    labelSizeLabel.textContent = labelSizeName(settings.labelSize);
    labelSizeMenu.innerHTML = labelSizes.map(option => `<button class="label-size-option" type="button" role="option" aria-selected="${option.id === settings.labelSize}" data-size="${option.id}"><span>${text(option.textKey)}</span><span class="size-check" aria-hidden="true">${option.id === settings.labelSize ? '✓' : ''}</span></button>`).join('');
    $$('.setting-toggle', customizeDialog).forEach(button => {
      const enabled = Boolean(settings[button.dataset.setting]);
      button.textContent = enabled ? text('on') : text('off');
      button.setAttribute('aria-pressed', String(enabled));
      button.classList.toggle('is-on', enabled);
    });
  }
  function applyDraftSettingsPreview() {
    if (!draftSettings) return;
    Object.assign(state, draftSettings);
    renderLabels();
  }
  function openCustomizeDialog() {
    originalSettings = { showStoreName:state.showStoreName, showSku:state.showSku, showProductName:state.showProductName, showPrice:state.showPrice, labelSize:state.labelSize };
    draftSettings = {
      showStoreName: state.showStoreName,
      showSku: state.showSku,
      showProductName: state.showProductName,
      showPrice: state.showPrice,
      labelSize: state.labelSize
    };
    customizeDialog.returnValue = '';
    renderCustomizeControls();
    customizeDialog.showModal();
    $('#customizeButton').setAttribute('aria-expanded', 'true');
  }
  function closeLabelSizeMenu(returnFocus = false) {
    labelSizeMenu.hidden = true;
    labelSizeTrigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) labelSizeTrigger.focus();
  }
  function saveSettings() {
    if (!draftSettings) return;
    Object.assign(state, draftSettings);
    draftSettings = null;
    renderLabels();
    showToast(text('saved'));
  }
  function printableHtml() {
    const labels = [...grid.querySelectorAll('.printed-label')].map(label => label.outerHTML).join('');
    const size = labelSizes.find(option => option.id === state.labelSize) || labelSizes[0];
    return `<!doctype html><html lang="${state.lang}" dir="${state.lang === 'ar' ? 'rtl' : 'ltr'}"><meta charset="utf-8"><title>Barcode labels</title><style>@font-face{font-family:Arimo;src:url(arimo.woff)}body{font-family:Arimo,Arial,sans-serif;margin:12mm}.sheet{display:grid;grid-template-columns:repeat(3,${size.width}mm);gap:7mm}.printed-label{display:flex;width:${size.width}mm;height:${size.height}mm;box-sizing:border-box;flex-direction:column;align-items:center;gap:2mm;overflow:hidden;padding:3mm 2mm;border:1px dashed #aaa;border-radius:2mm;text-align:center;break-inside:avoid}.label-brand{font-size:8pt;color:#24355f}.barcode-graphic{width:36mm;height:11mm;shape-rendering:crispEdges}.label-info{display:flex;width:100%;flex-direction:column;gap:1mm;font-size:8pt;line-height:1.2}.label-product{font-size:9pt}.label-price{color:#24355f;font-size:8pt}@media print{body{margin:0}}</style><div class="sheet">${labels}</div></html>`;
  }
  function downloadLabels() {
    if (!grid.querySelector('.printed-label')) { showToast(text('noLabels')); return; }
    const blob = new Blob([printableHtml()], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'smart-warehouse-barcode-labels.html';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast(text('downloaded'));
  }

  const usersButton = $('#usersButton');
  const usersPopup = $('#usersPopup');
  const usersList = $('.active-users-list', usersPopup);
  const customScrollbar = $('.users-custom-scrollbar', usersPopup);
  const customScrollbarThumb = $('.users-custom-scrollbar-thumb', customScrollbar);
  let scrollbarDragging = false;
  let scrollbarDragOffset = 0;
  function syncUsersScrollbar() {
    const viewport = usersList.clientHeight;
    const content = usersList.scrollHeight;
    const trackHeight = customScrollbar.clientHeight;
    if (!viewport || !trackHeight || content <= viewport + 1) { customScrollbar.hidden = true; return; }
    customScrollbar.hidden = false;
    const thumbHeight = Math.min(trackHeight, Math.max(22, trackHeight * viewport / content));
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    const scrollRange = Math.max(1, content - viewport);
    customScrollbarThumb.style.height = `${thumbHeight}px`;
    customScrollbarThumb.style.transform = `translateY(${maxThumbTop * usersList.scrollTop / scrollRange}px)`;
  }
  function scrollUsersToPointer(clientY, centerThumb = false) {
    const trackRect = customScrollbar.getBoundingClientRect();
    const thumbHeight = customScrollbarThumb.offsetHeight;
    const maxThumbTop = Math.max(1, trackRect.height - thumbHeight);
    const offset = centerThumb ? thumbHeight / 2 : scrollbarDragOffset;
    const thumbTop = Math.max(0, Math.min(maxThumbTop, clientY - trackRect.top - offset));
    const maxScroll = Math.max(0, usersList.scrollHeight - usersList.clientHeight);
    usersList.scrollTop = maxScroll * thumbTop / maxThumbTop;
  }
  customScrollbar.addEventListener('pointerdown', event => {
    if (customScrollbar.hidden) return;
    if (event.target === customScrollbarThumb) {
      scrollbarDragging = true;
      scrollbarDragOffset = event.clientY - customScrollbarThumb.getBoundingClientRect().top;
      customScrollbarThumb.setPointerCapture(event.pointerId);
      event.preventDefault();
    } else scrollUsersToPointer(event.clientY, true);
  });
  customScrollbarThumb.addEventListener('pointermove', event => { if (scrollbarDragging) scrollUsersToPointer(event.clientY); });
  const stopScrollbarDrag = () => { scrollbarDragging = false; };
  customScrollbarThumb.addEventListener('pointerup', stopScrollbarDrag);
  customScrollbarThumb.addEventListener('pointercancel', stopScrollbarDrag);
  usersList.addEventListener('scroll', syncUsersScrollbar, { passive: true });
  window.addEventListener('resize', syncUsersScrollbar, { passive: true });
  $('.app-shell').appendChild(usersPopup);
  function setUsersPopup(open) {
    usersPopup.hidden = !open;
    usersButton.setAttribute('aria-expanded', String(open));
    if (open) requestAnimationFrame(syncUsersScrollbar);
  }
  usersButton.addEventListener('click', event => {
    event.stopPropagation();
    setUsersPopup(usersPopup.hidden);
  });
  usersPopup.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', () => setUsersPopup(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setUsersPopup(false); });
  $('.language-switch').addEventListener('click', event => {
    const button = event.target.closest('[data-lang]');
    if (!button) return;
    state.lang = button.dataset.lang;
    localize();
  });
  $('#globalSearch').addEventListener('input', event => renderSelect(event.target.value));
  pickerTrigger.addEventListener('click', toggleProductMenu);
  productMenu.addEventListener('click', event => {
    const option = event.target.closest('[data-sku]');
    if (!option) return;
    productSelect.value = option.dataset.sku;
    renderSelect($('#globalSearch').value);
    closeProductMenu(true);
  });
  productMenu.addEventListener('keydown', event => {
    const options = [...productMenu.querySelectorAll('[data-sku]')];
    const index = options.indexOf(event.target);
    if (event.key === 'Escape') { event.preventDefault(); closeProductMenu(true); }
    else if (event.key === 'ArrowDown' && index >= 0) { event.preventDefault(); options[Math.min(index + 1, options.length - 1)]?.focus(); }
    else if (event.key === 'ArrowUp' && index >= 0) { event.preventDefault(); options[Math.max(index - 1, 0)]?.focus(); }
  });
    grid.addEventListener('click', event => {
    const card = event.target.closest('.printed-label');
    if (card) selectLabel(card);
  });
  grid.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.printed-label')) {
      event.preventDefault();
      selectLabel(event.target);
    }
  });
  quantityInput.addEventListener('input', () => {
    quantityInput.setCustomValidity('');
    const localized = languageDigits(quantityInput.value);
    if (localized !== quantityInput.value) quantityInput.value = localized;
  });
  $('#generateButton').addEventListener('click', () => {
    state.generated = true;
    renderLabels();
    showToast(text('generated'));
  });
  $('#printButton').addEventListener('click', () => window.print());
  $('#downloadButton').addEventListener('click', downloadLabels);
  $('#customizeButton').addEventListener('click', openCustomizeDialog);
  $$('.setting-toggle', customizeDialog).forEach(button => button.addEventListener('click', () => {
    if (!draftSettings) return;
    draftSettings[button.dataset.setting] = !draftSettings[button.dataset.setting];
    renderCustomizeControls();
    applyDraftSettingsPreview();
  }));
  labelSizeTrigger.addEventListener('click', () => {
    const opening = labelSizeMenu.hidden;
    if (opening) {
      renderCustomizeControls();
      labelSizeMenu.hidden = false;
      labelSizeTrigger.setAttribute('aria-expanded', 'true');
      labelSizeMenu.querySelector('[aria-selected="true"]')?.focus();
    } else closeLabelSizeMenu();
  });
  labelSizeMenu.addEventListener('click', event => {
    const option = event.target.closest('[data-size]');
    if (!option || !draftSettings) return;
    draftSettings.labelSize = option.dataset.size;
    renderCustomizeControls();
    applyDraftSettingsPreview();
    closeLabelSizeMenu(true);
  });
  labelSizeMenu.addEventListener('keydown', event => {
    const options = [...labelSizeMenu.querySelectorAll('[data-size]')];
    const index = options.indexOf(event.target);
    if (event.key === 'Escape') { event.preventDefault(); closeLabelSizeMenu(true); }
    else if (event.key === 'ArrowDown' && index >= 0) { event.preventDefault(); options[Math.min(index + 1, options.length - 1)]?.focus(); }
    else if (event.key === 'ArrowUp' && index >= 0) { event.preventDefault(); options[Math.max(index - 1, 0)]?.focus(); }
  });
  $('#customizeForm').addEventListener('submit', event => {
    if (event.submitter?.id === 'saveCustomize') saveSettings();
  });
  $('#customizeDialog').addEventListener('click', event => {
    if (event.target === $('#customizeDialog')) $('#customizeDialog').close();
    else if (!event.target.closest('#labelSizePicker') && !labelSizeMenu.hidden) closeLabelSizeMenu();
  });
  customizeDialog.addEventListener('cancel', event => {
    if (!labelSizeMenu.hidden) { event.preventDefault(); closeLabelSizeMenu(true); }
  });
  customizeDialog.addEventListener('close', () => {
    closeLabelSizeMenu();
    $('#customizeButton').setAttribute('aria-expanded', 'false');
    if (customizeDialog.returnValue !== 'save' && originalSettings) {
      Object.assign(state, originalSettings);
      renderLabels();
    }
    draftSettings = null;
    originalSettings = null;
  });
  $('#globalSearch').addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.currentTarget.value = ''; renderSelect(''); }
  });

  localize();
})();
