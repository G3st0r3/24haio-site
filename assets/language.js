/* Static curated messages only. Language changes never request network resources. */
(() => {
  'use strict';
  const catalog = window.HAIO_TRANSLATIONS;
  const preferenceKey = '24haio.language';
  const supported = code => Object.prototype.hasOwnProperty.call(catalog.languages, code);
  let language = catalog.default;
  try {
    const saved = localStorage.getItem(preferenceKey);
    if (supported(saved)) language = saved;
  } catch (_) { /* Storage can be disabled; Italian remains the default. */ }
  // Apply direction before the deferred body translation to minimize reflow.
  document.documentElement.lang = language;
  document.documentElement.dir = catalog.languages[language].dir;
  const select = document.getElementById('language-select');
  function apply(code) {
    if (!supported(code)) return;
    const locale = catalog.languages[code];
    const translate = key => locale.messages[key] || key;
    document.documentElement.lang = code;
    document.documentElement.dir = locale.dir;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = translate(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-parts]').forEach(element => {
      element.textContent = JSON.parse(element.dataset.i18nParts).map(translate).join(' · ');
    });
    for (const attribute of ['aria-label', 'content']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(attribute, translate(element.getAttribute(`data-i18n-${attribute}`)));
      });
    }
    select.value = code;
    document.getElementById('language-code').textContent = code.toUpperCase();
  }
  apply(language);
  select.addEventListener('change', () => {
    const code = select.value;
    if (!supported(code)) return;
    apply(code);
    try { localStorage.setItem(preferenceKey, code); } catch (_) { /* Selection still works. */ }
  });
})();
