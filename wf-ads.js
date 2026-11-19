(function () {
  const DEFAULT_BANNER_BASE = 'https://bauval.org/22';

  function bannerSrcDoc(key, width, height, scriptBase) {
    const atOptions = JSON.stringify({
      key,
      format: 'iframe',
      height,
      width,
      params: {},
    });
    const src = scriptBase.replace(/\/$/, '') + '/' + key;
    return (
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head>' +
      '<body style="margin:0;padding:0;overflow:hidden;background:transparent">' +
      '<script type="text/javascript">var atOptions = ' +
      atOptions +
      ';</script><script type="text/javascript" src="' +
      src +
      '"><\/script></body></html>'
    );
  }

  function injectScript(src, marker, target) {
    if (!src || document.querySelector('script[data-ad="' + marker + '"]')) return;
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.setAttribute('data-cfasync', 'false');
    s.setAttribute('data-ad', marker);
    target.appendChild(s);
  }

  function mountBanner(el, def, scriptBase) {
    const label = el.getAttribute('data-ad-label') || 'Advertisement';
    const slot = el.getAttribute('data-ad-slot') || '';
    const wrap = document.createElement('aside');
    wrap.className = 'ad-slot' + (el.className ? ' ' + el.className : '');
    wrap.setAttribute('aria-label', label);
    if (slot) wrap.setAttribute('data-ad-slot', slot);
    const lbl = document.createElement('div');
    lbl.className = 'ad-slot__label';
    lbl.textContent = label;
    const iframe = document.createElement('iframe');
    iframe.title = 'Advertisement ' + slot;
    iframe.width = def.width;
    iframe.height = def.height;
    iframe.className = 'ad-slot__frame';
    iframe.setAttribute(
      'style',
      'max-width:100%;border:0;height:' + def.height + 'px;overflow:hidden',
    );
    iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms',
    );
    iframe.loading = 'lazy';
    iframe.srcdoc = bannerSrcDoc(def.key, def.width, def.height, scriptBase);
    wrap.appendChild(lbl);
    wrap.appendChild(iframe);
    el.replaceWith(wrap);
  }

  function mountNative(el, native) {
    const label = el.getAttribute('data-ad-label') || 'Advertisement';
    const wrap = document.createElement('aside');
    wrap.className = 'ad-slot ad-native' + (el.className ? ' ' + el.className : '');
    wrap.setAttribute('aria-label', label);
    const lbl = document.createElement('div');
    lbl.className = 'ad-slot__label';
    lbl.textContent = label;
    const container = document.createElement('div');
    container.id = native.containerId;
    container.className = 'ad-slot__native';
    wrap.appendChild(lbl);
    wrap.appendChild(container);
    el.replaceWith(wrap);
    injectScript(native.src, 'native-' + native.containerId, document.body);
  }

  function loadAdsConfig() {
    return fetch('/public/ads.json').then(function (r) {
      if (r.ok) return r.json();
      return fetch('/ads.json').then(function (r2) {
        if (!r2.ok) throw new Error('ads');
        return r2.json();
      });
    });
  }

  loadAdsConfig()
    .then(function (cfg) {
      if (!cfg || !cfg.enabled) return;
      const scriptBase = cfg.bannerScriptBase || DEFAULT_BANNER_BASE;
      if (cfg.popunder) injectScript(cfg.popunder, 'popunder', document.head);
      if (cfg.socialBar) injectScript(cfg.socialBar, 'social-bar', document.body);
      if (cfg.nativeBanner && cfg.nativeBanner.src && cfg.nativeBanner.containerId) {
        document.querySelectorAll('[data-ad-slot="nativeBelowResult"]').forEach(function (el) {
          mountNative(el, cfg.nativeBanner);
        });
      }
      if (cfg.smartlink && cfg.smartlink.url) {
        document.querySelectorAll('[data-ad-smartlink]').forEach(function (el) {
          const a = document.createElement('a');
          a.href = cfg.smartlink.url;
          a.target = '_blank';
          a.rel = 'sponsored noopener noreferrer';
          a.textContent = cfg.smartlink.label || 'Sponsored';
          el.appendChild(a);
        });
      }
      document.querySelectorAll('[data-ad-slot]').forEach(function (el) {
        if (el.tagName === 'ASIDE') return;
        const slot = el.getAttribute('data-ad-slot');
        if (slot === 'nativeBelowResult') return;
        const mapped = (cfg.slots && cfg.slots[slot]) || slot;
        const def = cfg.banners && cfg.banners[mapped];
        if (!def || !def.key) return;
        mountBanner(el, def, scriptBase);
      });
    })
    .catch(function () {
      /* ads optional when offline */
    });
})();