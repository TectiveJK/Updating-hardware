import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { createContext, runInContext } from "node:vm";

const files = [
  new URL("../index.html", import.meta.url),
  new URL("../apps-script/Index.html", import.meta.url),
];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  assert.match(html, /Sign in with your Tective Google account/, `${file} should have an SSO gate`);
  assert.match(html, /function isAllowedEmail\(email, domains\)/, `${file} should check Tective email domains`);
  assert.match(html, /accounts.google.com\/gsi\/client/, `${file} should load Google Identity Services`);

  const match = html.match(/function emailDomain\(email\) \{[\s\S]*?return !!domain && allowed.indexOf\(domain\) !== -1;\n    \}/);
  assert.ok(match, `${file} should define emailDomain and isAllowedEmail`);
  const isAllowedEmail = runInContext(match[0] + "; isAllowedEmail", createContext({}));
  assert.equal(isAllowedEmail("john.kokotinis@tective.nl", ["tective.nl"]), true);
  assert.equal(isAllowedEmail("someone@gmail.com", ["tective.nl"]), false);
  assert.equal(isAllowedEmail("user@other.nl", ["tective.nl"]), false);
}

const apps = readFileSync(new URL("../apps-script/Code.gs", import.meta.url), "utf8");
assert.match(apps, /function requireUser_/);
assert.match(apps, /function verifyGoogleIdToken_/);
assert.match(apps, /ALLOWED_EMAIL_DOMAINS = \['tective.nl'\]/);
assert.match(apps, /idToken: p.idToken/);

const config = readFileSync(new URL("../config.js", import.meta.url), "utf8");
assert.match(config, /googleClientId/);
assert.match(config, /allowedEmailDomains: \['tective.nl'\]/);

console.log("sso tests passed");
