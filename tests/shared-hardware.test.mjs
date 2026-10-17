import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import assert from "node:assert/strict";

const store = new Map();
const listeners = [];
const channels = [];

class FakeBroadcastChannel {
  constructor(name) {
    this.name = name;
    this.onmessage = null;
    channels.push(this);
  }
  postMessage(data) {
    for (const channel of channels) {
      if (channel !== this && channel.name === this.name && channel.onmessage) {
        channel.onmessage({ data });
      }
    }
  }
  close() {
    const index = channels.indexOf(this);
    if (index >= 0) channels.splice(index, 1);
  }
}

const sandbox = {
  window: null,
  localStorage: {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
      for (const listener of listeners) listener({ key, newValue: String(value) });
    },
  },
  BroadcastChannel: FakeBroadcastChannel,
  addEventListener(type, fn) {
    if (type === "storage") listeners.push(fn);
  },
  Date,
  JSON,
  Array,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

runInContext(readFileSync(new URL("../shared-hardware.js", import.meta.url), "utf8"), createContext(sandbox));

const share = sandbox.TectiveHardwareShare;
assert.ok(share, "share helpers should load");

const first = share.write(
  [{ name: "refly-sf-033", location: "In hive", person: "John", note: "", gimbal: "", type: "drone" }],
  "locator"
);
assert.equal(first.kind, "tective-shared-hardware");
assert.equal(share.read().items[0].location, "In hive");

let heard = null;
share.listen((items) => {
  heard = items;
});
sandbox.localStorage.setItem(
  share.KEY,
  JSON.stringify({
    kind: "tective-shared-hardware",
    v: 1,
    updatedAt: "2026-10-16T07:00:00.000Z",
    source: "dashboard",
    items: [{ name: "refly-sf-033", location: "testing", person: "", note: "", gimbal: "", type: "drone" }],
  })
);
assert.equal(heard[0].location, "testing");

const other = new FakeBroadcastChannel(share.CHANNEL);
other.postMessage({
  kind: "tective-shared-hardware",
  v: 1,
  updatedAt: "2026-10-16T07:01:00.000Z",
  source: "dashboard",
  items: [{ name: "battery 96", location: "In office upstairs", person: "", note: "", gimbal: "", type: "battery" }],
});
assert.equal(heard[0].name, "battery 96");
assert.equal(heard[0].location, "In office upstairs");

console.log("shared-hardware tests passed");
