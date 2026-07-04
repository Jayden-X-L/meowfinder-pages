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

  function addFoundCatButton() {
    if (document.getElementById("meowfinder-found-cat")) return;

    var lang = (document.documentElement.lang || navigator.language || "en").toLowerCase();
    var label = lang.indexOf("zh") === 0
      ? "我找到猫了"
      : lang.indexOf("ja") === 0
        ? "猫が見つかった"
        : "I found my cat";
    var thanks = lang.indexOf("zh") === 0
      ? "太好了"
      : lang.indexOf("ja") === 0
        ? "よかった"
        : "Great news";

    var button = document.createElement("button");
    button.id = "meowfinder-found-cat";
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", label);
    button.style.cssText = [
      "position:fixed",
      "right:16px",
      "bottom:16px",
      "z-index:9999",
      "border:1px solid #f9a8d4",
      "background:#ffffff",
      "color:#be185d",
      "border-radius:9999px",
      "padding:10px 14px",
      "font:600 14px/1.2 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
      "box-shadow:0 10px 24px rgba(190,24,93,.18)",
      "cursor:pointer"
    ].join(";");
    button.addEventListener("click", function () {
      window.meowfinderTrackFoundCat();
      button.textContent = thanks;
      button.disabled = true;
      button.style.opacity = "0.82";
      window.setTimeout(function () {
        if (button.parentNode) button.parentNode.removeChild(button);
      }, 1800);
    });
    document.body.appendChild(button);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addFoundCatButton, { once: true });
  } else {
    addFoundCatButton();
  }

  track("page_ready", {
    page_path: window.location.pathname,
    language: document.documentElement.lang || ""
  });
}());
