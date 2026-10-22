import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { createContext, runInContext } from "node:vm";

const files = [
  new URL("../index.html", import.meta.url),
  new URL("../apps-script/Index.html", import.meta.url),
];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  assert.match(html, /\{ id: 'gcs', label: 'GCS' \}/, `${file} should have a GCS chip`);
  assert.match(html, /\{ id: 'gimbal', label: 'Gimbal' \}/, `${file} should have a Gimbal chip`);
  assert.match(html, /if \(n\.indexOf\('gcs'\) !== -1\) return 'gcs';/, `${file} should classify GCS names`);
  assert.match(html, /if \(n\.indexOf\('gimbal'\) !== -1\) return 'gimbal';/, `${file} should classify gimbal names`);
  assert.match(html, /name: 'GCS-001'/, `${file} should include GCS-001`);
  assert.match(html, /name: 'GCS-004'/, `${file} should include GCS-004`);
  assert.match(html, /name: 'GCS-005'/, `${file} should include GCS-005`);
  assert.match(html, /Belongs to drone/, `${file} should let gimbals pick a drone`);
  assert.match(html, /attached to /, `${file} should show which drone a gimbal is attached to`);

  const match = html.match(/function classify\(name\) \{[\s\S]*?return 'other';\n    \}/);
  assert.ok(match, `${file} should define classify`);
  const classify = runInContext(match[0] + "; classify", createContext({}));
  assert.equal(classify("GCS-001"), "gcs");
  assert.equal(classify("GCS-004"), "gcs");
  assert.equal(classify("GCS-005"), "gcs");
  assert.equal(classify("battery 96"), "battery");
  assert.equal(classify("refly-sf-033"), "drone");
  assert.equal(classify("gimbal-sf-007"), "gimbal");
  assert.equal(classify("gimbal for refly-sf-010"), "gimbal");
}

const apps = readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8");
assert.match(apps, /if \(n\.indexOf\('gcs'\) !== -1\) return 'gcs';/);
assert.match(apps, /if \(n\.indexOf\('gimbal'\) !== -1\) return 'gimbal';/);

console.log("classify tests passed");
