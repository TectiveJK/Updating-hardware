/**
 * Same-origin share bus for Hardware locator and Field Test Operations Dashboard.
 *
 * Both live apps are on https://tectivejk.github.io, so localStorage and
 * BroadcastChannel let a location change in Fleet show up in the locator
 * immediately (and the other way around). The Google Sheet remains the
 * company source of truth for other phones and laptops.
 */
(function (root) {
  var KEY = "tective-shared-hardware-v1";
  var CHANNEL = "tective-hardware-locations";
  var channel = null;

  function read() {
    try {
      var raw = root.localStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.kind !== "tective-shared-hardware" || !Array.isArray(parsed.items)) {
        return null;
      }
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function write(items, source) {
    var payload = {
      kind: "tective-shared-hardware",
      v: 1,
      updatedAt: new Date().toISOString(),
      source: source || "locator",
      items: items || []
    };
    try {
      root.localStorage.setItem(KEY, JSON.stringify(payload));
    } catch (err) {}
    try {
      if (!channel) channel = new root.BroadcastChannel(CHANNEL);
      channel.postMessage(payload);
    } catch (err) {}
    return payload;
  }

  function listen(onItems) {
    if (typeof onItems !== "function") return function () {};
    function handle(parsed) {
      if (parsed && parsed.kind === "tective-shared-hardware" && Array.isArray(parsed.items)) {
        onItems(parsed.items, parsed);
      }
    }
    function onStorage(event) {
      if (event.key !== KEY || !event.newValue) return;
      try {
        handle(JSON.parse(event.newValue));
      } catch (err) {}
    }
    root.addEventListener("storage", onStorage);
    try {
      channel = new root.BroadcastChannel(CHANNEL);
      channel.onmessage = function (event) {
        handle(event.data);
      };
    } catch (err) {}
    return function () {
      root.removeEventListener("storage", onStorage);
    };
  }

  root.TectiveHardwareShare = {
    KEY: KEY,
    CHANNEL: CHANNEL,
    read: read,
    write: write,
    listen: listen
  };
})(typeof window !== "undefined" ? window : globalThis);
