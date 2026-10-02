(function () {
  function privatePage() {
    return /^\/(admin|auth)(\/|$)/.test(window.location.pathname) ||
      /(?:[?#&])(access_token|refresh_token|token|token_hash|code)=/.test(window.location.search + window.location.hash);
  }

  if (privatePage()) return;

  function safeLocation(value) {
    if (!value) return '';
    try {
      var url = new URL(value, window.location.origin);
      return url.origin + url.pathname;
    } catch (_) {
      return '';
    }
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-1L1R1CTELG', {
    page_location: safeLocation(window.location.href),
    page_referrer: safeLocation(document.referrer),
    send_page_view: false
  });
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1L1R1CTELG';
  document.head.append(script);

  var allowedEvents = ['scenario_select', 'search_routine_step', 'search_routine_check', 'cat_found', 'thanks_submit_success', 'cat_sound_play', 'volume_change', 'internal_link_click', 'page_ready', 'page_view'];
  var allowedParams = ['scenario_id', 'step_number', 'item_number', 'checked', 'action', 'has_photo', 'consent_publish', 'language', 'sound_id', 'sound_name', 'sound_type', 'sound_file', 'value', 'href'];

  function track(eventName, params) {
    if (privatePage() || allowedEvents.indexOf(eventName) < 0) return;
    var payload = {
      event_category: 'meowfinder',
      page_path: window.location.pathname,
      page_location: safeLocation(window.location.href),
      page_referrer: safeLocation(document.referrer),
      language: document.documentElement.lang
    };
    allowedParams.forEach(function (key) {
      var value = params && params[key];
      if (typeof value === 'boolean' || typeof value === 'number') payload[key] = value;
      else if (typeof value === 'string') payload[key] = value.slice(0, 100);
    });
    window.gtag('event', eventName, payload);
  }
  window.meowfinderTrack = track;

  document.addEventListener('play', function (event) {
    var target = event.target;
    if (target && target.tagName === 'AUDIO' && target.dataset.soundId) {
      track('cat_sound_play', {
        sound_id: target.dataset.soundId,
        sound_name: target.dataset.soundName,
        sound_type: target.dataset.soundType,
        sound_file: target.getAttribute('src'),
        value: target.volume
      });
    }
  }, true);

  document.addEventListener('change', function (event) {
    var target = event.target;
    if (target && target.matches && target.matches('input[type="range"][data-sound-id]')) {
      track('volume_change', { sound_id: target.dataset.soundId, value: Number(target.value) });
    }
  }, true);

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a');
    if (!link) return;
    try {
      var url = new URL(link.href);
      if (url.origin === window.location.origin && !/^\/(admin|auth)(\/|$)/.test(url.pathname)) {
        track('internal_link_click', { href: url.pathname });
      }
    } catch (_) { /* Ignore links without an HTTP location. */ }
  }, true);

  track('page_view');
  track('page_ready');
}());
