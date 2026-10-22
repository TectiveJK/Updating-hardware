# Hardware location updater

Phone page for Tective. People sign in with their **Tective Google account**, then anyone on the company list can add, rename, move, or delete hardware. **Everyone sees the same list.**

**Always-live link (share this):** https://tectivejk.github.io/Updating-hardware/

This URL stays online. It does not go down when you close your laptop. Open it on a phone, or add it to the home screen.

**GitHub:** https://github.com/TectiveJK/Updating-hardware

## Categories

The chips at the top filter the list:

| Chip | What it shows |
| --- | --- |
| **All** | Every item |
| **Drones** | ReFly and IBB airframes |
| **Gimbal** | Camera gimbals. The list shows **Gimbal-028 attached to refly-sf-031** when a drone is chosen |
| **Batteries** | Battery packs |
| **Hive** | SkyHive / hive |
| **Rotator** | Ground rotator |
| **GCS** | Ground control stations: **GCS-001**, **GCS-004**, **GCS-005** |

A name that contains `gcs` is filed under **GCS**. A name that contains `gimbal` is filed under **Gimbal**. New units added later show up in those chips automatically.

## Fleet

The [Field Test Operations Dashboard](https://tectivejk.github.io/Field-Test-Operations-Dashboard./) **Fleet** page uses this same company list.

- Change a location here, and Fleet updates.
- Change it on Fleet, and this app updates.

Both live sites talk to the same Google Sheet. On GitHub Pages they also share a same-origin cache (`shared-hardware.js`), so the other tab updates immediately. Other phones pick up a change within about 8 seconds, or when they reopen the page.

## Sign in (SSO)

The live page uses Google Single Sign-On. Only **@tective.nl** Google accounts can open the list.

1. Open https://tectivejk.github.io/Updating-hardware/
2. Tap **Sign in with Google**
3. Choose your Tective account

Your name is filled in on **Who has it**. Tap **Sign out** in the header to switch accounts.

Do **not** open the spreadsheet. Do **not** share the Apps Script `/exec` link. Share **only** the GitHub Pages link above. The spreadsheet stays private.

### Turn SSO on (once)

The sign-in button stays hidden until a Google Web client ID is in [`config.js`](config.js) **and** [`apps-script/Code.gs`](apps-script/Code.gs).

1. Open [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create (or pick) a project
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
4. Application type: **Web application**
5. Authorized JavaScript origins:
   - `https://tectivejk.github.io`
   - `http://127.0.0.1:43141`
6. Create, copy the **Client ID**
7. Put that value in `googleClientId` in [`config.js`](config.js) and in `GOOGLE_CLIENT_ID` in [`apps-script/Code.gs`](apps-script/Code.gs)
8. Push to GitHub, then redeploy Apps Script (**Execute as: Me**, **Who has access: Anyone**)

Keep **Who has access: Anyone**. That is not the login screen. The Tective Google sign-in is the button on this page. If you set the script to “Anyone with a Google account”, phones hit a Google wall and the list stays empty.

The [Fleet](https://tectivejk.github.io/Field-Test-Operations-Dashboard./) page still uses the same company list without this sign-in. To also require a Tective token on every sheet request, set `REQUIRE_SSO` to `true` in `Code.gs` after Fleet can send one.

## If someone sees no hardware

They are on the wrong link, an old home-screen icon, a Google Sheets tab, or they signed in with a non-Tective account.

1. Send them https://tectivejk.github.io/Updating-hardware/
2. Ask them to open it in the normal phone browser (Safari or Chrome), not Google Sheets.
3. Sign in with an **@tective.nl** Google account.
4. If they added the app to the home screen earlier, delete that icon and add this link again.

If it is still empty after sign-in, the Apps Script web app access is wrong. In the spreadsheet: **Extensions → Apps Script → Deploy → Manage deployments → Edit**:

- Execute as: **Me**
- Who has access: **Anyone** (not “Anyone with a Google account”, and not only Tective)

Then **Deploy**.

## What people can do

- Sign in with a Tective Google account (**@tective.nl**), and sign out from the header
- Filter by **All**, **Drones**, **Gimbal**, **Batteries**, **Hive**, **Rotator**, or **GCS**
- Search drones, gimbals, batteries, hive, rotators, and GCS
- Update location, who has it, and a short note
- For a gimbal, choose which drone it belongs to. The card then reads **Gimbal-028 attached to refly-sf-031**
- Tap **Edit name** (next to the item name) to rename hardware
- Tap **Delete** (under **Save location**) to remove hardware from the list
- Tap **Add hardware** to put a new item on the list

## Use it (everyone)

1. Open https://tectivejk.github.io/Updating-hardware/ and sign in with Google.
2. Search for an item, tap a category, **or** tap **Add hardware**.
3. For a new item, type a name (for example `refly-sf-034`, `battery 121`, `gimbal-sf-034`, or `GCS-006`).
4. Choose a location, type your name, **Save location**. For a gimbal, also pick the drone it belongs to. The list then shows the gimbal **attached to** that drone.
5. To rename: open the item → tap **Edit name** next to the title → type the new name → **Save location**.
6. To remove it: open the item → tap **Delete** under **Save location** → confirm.

**Delete still works after you sign in.** The app does **not** call Google’s `delete` action (that caused **Unknown action**). It updates the row’s location to `Deleted` and hides it on every phone.

If a phone still says **Unknown action**, it is on an old cached page:

1. Open https://tectivejk.github.io/Updating-hardware/?v=gcs
2. Pull down to refresh, or close the tab and open that link again.
3. If the app is on the home screen, delete the icon and add the live link again.

Locations on the buttons:

- In factory downstairs
- In office upstairs
- In hive
- testing
- Out of service
- Other (type any place)

### Add to a phone home screen

- **iPhone:** Safari → Share → **Add to Home Screen**
- **Android:** Chrome → menu → **Add to Home screen**

A link like `https://tectivejk.github.io/Updating-hardware/?item=refly-sf-010` opens that item directly (useful on printed QR labels later).

## How sharing works

The phone page calls an Apps Script web app. That script **runs as you** and reads/writes the **Product Status** tab.

| Column | Field |
| --- | --- |
| B | Item name |
| C | Location |
| D | Gimbal status on a drone, or the drone a gimbal belongs to |
| E | Person responsible |
| F | Note (`Attached to: refly-sf-031` is stored here for gimbals so the drone link is visible even before a script redeploy) |

For a gimbal, the list title is **name attached to drone**. Column D is the drone it belongs to. The same drone is also written at the top of the note so it still shows after a refresh. Deploy the latest [`apps-script/Code.gs`](apps-script/Code.gs) so column D is saved too.

Data starts at row 5. New hardware is added as a new row. Rename changes column B. Delete hides the item (location `Deleted`) or, after you deploy the latest `Code.gs`, removes the row. Rows marked `Deleted` never appear in the app. Each save also appends a line to a hidden **Location Log** tab.

The live `/exec` URL is in [`config.js`](config.js) and also baked into [`index.html`](index.html) so phones still work if `config.js` fails to load. Requests to Google do not send other people’s Google cookies, so they are not blocked for lacking spreadsheet access.

## Optional: remove deleted rows from the sheet

The live phone app already deletes items from the company list. To also erase those rows in Google Sheets:

1. Open the hardware spreadsheet.
2. **Extensions → Apps Script**.
3. Replace **Code.gs** with [`apps-script/Code.gs`](apps-script/Code.gs) (JavaScript only, not HTML).
4. Open the HTML file named `Index` and paste [`apps-script/Index.html`](apps-script/Index.html).
5. **Deploy → Manage deployments →** the existing web app → **Edit**
   - New version
   - Execute as: **Me**
   - Who has access: **Anyone**
6. **Deploy**. Keep the same `/exec` URL if Google shows one.

## If you have to connect it again

1. Open the hardware spreadsheet.
2. **Extensions → Apps Script**.
3. Paste [`apps-script/Code.gs`](apps-script/Code.gs) into **Code.gs** (JavaScript only, not HTML).
4. Next to **Files**, click **+** → **HTML**. Name it `Index` (not `Index.html`).
5. Paste [`apps-script/Index.html`](apps-script/Index.html) into that file.
6. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Put the `/exec` URL into [`config.js`](config.js) **and** the `DEFAULT_SCRIPT_URL` in [`index.html`](index.html) / [`apps-script/Index.html`](apps-script/Index.html), then push to GitHub.

## What is in this repo

| File | Purpose |
| --- | --- |
| `index.html` | Phone page (SSO, categories, search, update, add, rename, delete) |
| `shared-hardware.js` | Same-origin cache so Fleet and this app update each other immediately |
| `config.js` | Shared-list URL (Apps Script `/exec`) and Google SSO client ID |
| `apps-script/Code.gs` | Reads/writes/renames/deletes rows on the Google Sheet; verifies Tective Google sign-in tokens |
| `apps-script/Index.html` | Same phone page, for Apps Script |
| `manifest.webmanifest` | Add to home screen |
| `icon.svg` | App icon |
| `.github/workflows/pages.yml` | Publishes the live GitHub Pages site |
| `tests/classify.test.mjs` | GCS, gimbal, and category name matching |
| `tests/sso.test.mjs` | Tective Google sign-in domain checks |
| `tests/shared-hardware.test.mjs` | Same-origin cache helpers |

## Run locally

The live company list is still used. You only need a static file server:

```bash
cd ~/Updating-hardware
python3 -m http.server 43141
```

Then open http://127.0.0.1:43141 on a phone or in a browser.

```bash
node tests/classify.test.mjs
node tests/sso.test.mjs
node tests/shared-hardware.test.mjs
```

## Update the live site

On tectivePC, from the existing clone (do not clone again if `~/Updating-hardware` is already there):

```bash
cd ~/Updating-hardware
git fetch origin
git checkout main
git pull origin main
```

Change the files, then:

```bash
git add -A
git commit -m "Describe the change."
git push origin main
```

GitHub Actions **Deploy site** publishes https://tectivejk.github.io/Updating-hardware/

## Remotes

- **Always-live site:** https://tectivejk.github.io/Updating-hardware/
- **GitHub:** https://github.com/TectiveJK/Updating-hardware
- **Fleet:** https://tectivejk.github.io/Field-Test-Operations-Dashboard./
- **GitLab:** https://git.tective.nl/JohnKokotinis/Updating-hardware.git
