(function () {
  function track(eventName, params) {
    var payload = Object.assign({ event_category: "meowfinder" }, params || {});
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }
  }

  function textOf(node) {
    return (node && (node.getAttribute("aria-label") || node.textContent) || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120);
  }

  document.addEventListener("play", function (event) {
    if (event.target && event.target.tagName === "AUDIO") {
      track("cat_sound_play", {
        sound_file: event.target.getAttribute("src") || "",
        page_path: window.location.pathname
      });
    }
  }, true);

  document.addEventListener("change", function (event) {
    var target = event.target;
    if (target && target.matches && target.matches('input[type="range"]')) {
      track("volume_change", {
        value: target.value,
        page_path: window.location.pathname
      });
    }
  }, true);

  document.addEventListener("click", function (event) {
    var button = event.target && event.target.closest && event.target.closest("button");
    var link = event.target && event.target.closest && event.target.closest("a");

    if (button) {
      var label = textOf(button);
      if (label) {
        track("ui_button_click", {
          label: label,
          page_path: window.location.pathname
        });
      }
    }

    if (link) {
      track("internal_link_click", {
        href: link.getAttribute("href") || "",
        label: textOf(link),
        page_path: window.location.pathname
      });
    }
  }, true);

  window.meowfinderTrackFoundCat = function () {
    track("cat_found", {
      page_path: window.location.pathname
    });
  };

  track("page_ready", {
    page_path: window.location.pathname,
    language: document.documentElement.lang || ""
  });
}());
