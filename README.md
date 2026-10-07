# Hardware location updater

Phone page for Tective. Anyone can add, rename, move, or delete hardware. **Everyone sees the same list.**

**Always-live link (share this):** https://tectivejk.github.io/Updating-hardware/

This URL stays online. It does not go down when you close your laptop. Open it on a phone, or add it to the home screen.

When someone changes a name or location, or deletes an item, other phones show it from the company Google Sheet (within about 15 seconds, or when they reopen the page).

## Important: nobody needs a Google login

Do **not** open the spreadsheet. Do **not** share the Apps Script `/exec` link. Share **only** the GitHub Pages link above.

The app talks to the sheet as you (the owner). Other phones can list, add, rename, update, and delete hardware without your Google account, and without access to the planning spreadsheet.

Keep the planning spreadsheet private. Do not share it with the whole company.

## If someone sees no hardware

They are on the wrong link, an old home-screen icon, or a Google sign-in wall.

1. Send them https://tectivejk.github.io/Updating-hardware/
2. Ask them to open it in the normal phone browser (Safari or Chrome), not Google Sheets.
3. If they added the app to the home screen earlier, delete that icon and add this link again.

If it is still empty, the Apps Script web app access is wrong. In the spreadsheet: **Extensions → Apps Script → Deploy → Manage deployments → Edit**:

- Execute as: **Me**
- Who has access: **Anyone** (not “Anyone with a Google account”, and not only Tective)

Then **Deploy**. People still should not log in.

## What people can do

- Search drones, batteries, hive, and rotators
- Update location, who has it, and a short note
- Tap **Edit name** (next to the item name) to rename hardware
- Tap **Delete** (under **Save location**) to remove hardware from the list
- Tap **Add hardware** to put a new item on the list

## Use it (everyone)

1. Open https://tectivejk.github.io/Updating-hardware/
2. Search for an item, **or** tap **Add hardware**.
3. For a new item, type a name (for example `refly-sf-034` or `battery 121`).
4. Choose a location, type your name, **Save location**.
5. To rename: open the item → tap **Edit name** next to the title → type the new name → **Save location**.
6. To remove it: open the item → tap **Delete** under **Save location** → confirm.

**Delete works without a Google login.** The item disappears from every phone. If the live Google script does not yet know the `delete` action, the app sets that row’s location to `Deleted` and hides it. It will not show **Unknown action**. After you paste the latest `Code.gs` and Deploy (optional), Delete also removes the row from the spreadsheet.

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
| D | Gimbal |
| E | Person responsible |
| F | Note |

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
| `index.html` | Phone page (search, update, add, rename, delete) |
| `config.js` | Shared-list URL (Apps Script `/exec`) |
| `apps-script/Code.gs` | Reads/writes/renames/deletes rows on the Google Sheet |
| `apps-script/Index.html` | Same phone page, for Apps Script |
| `manifest.webmanifest` | Add to home screen |
| `icon.svg` | App icon |
| `.github/workflows/pages.yml` | Publishes the live GitHub Pages site |

## Remotes

- **Always-live site:** https://tectivejk.github.io/Updating-hardware/
- **GitHub:** https://github.com/TectiveJK/Updating-hardware
- **GitLab:** https://git.tective.nl/JohnKokotinis/Updating-hardware.git
