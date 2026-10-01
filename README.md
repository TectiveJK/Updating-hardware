# Hardware location updater

Phone page for Tective. Anyone can add hardware and update where it is. **Everyone sees the same list.**

**Share this link:** https://tectivejk.github.io/Updating-hardware/

The site stays online. Open it on a phone, or add it to the home screen.

When someone changes a location, other phones show it from the company Google Sheet (within about 15 seconds, or when they reopen the page).

The shared list is already connected.

Backup Apps Script link (same app): https://script.google.com/macros/s/AKfycbz3KiLyly5nRN7-y9iyJvL-z6xLpJKtNH02faJ4NeH1j0BvYUhlbvUVOXqckLtIIGqcuw/exec

## What people can do

- Search drones, batteries, hive, and rotators
- Update location, who has it, and a short note
- Tap **Add hardware** to put a new item on the list

## Use it (everyone)

1. Open https://tectivejk.github.io/Updating-hardware/
2. Search for an item, **or** tap **Add hardware**.
3. For a new item, type a name (for example `refly-sf-034` or `battery 121`).
4. Choose a location, type your name, Save.

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

The phone page writes to the **Product Status** tab of the production Planning Google Sheet:

| Column | Field |
| --- | --- |
| B | Item name |
| C | Location |
| E | Person responsible |
| F | Note |

New hardware is added as a new row. Each save also appends a line to a hidden **Location Log** tab.

The Apps Script web app URL is stored in [`config.js`](config.js).

### If you have to connect it again

1. Open the hardware spreadsheet.
2. **Extensions → Apps Script**.
3. Paste [`apps-script/Code.gs`](apps-script/Code.gs) into **Code.gs** (JavaScript only, not HTML).
4. Next to **Files**, click **+** → **HTML**. Name it `Index` (not `Index.html`).
5. Paste [`apps-script/Index.html`](apps-script/Index.html) into that file.
6. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Put the `/exec` URL into [`config.js`](config.js) and push to GitHub.

## What is in this repo

| File | Purpose |
| --- | --- |
| `index.html` | Phone page (search, update, add) |
| `config.js` | Shared-list URL (Apps Script `/exec`) |
| `apps-script/Code.gs` | Reads/writes the Google Sheet for every phone |
| `apps-script/Index.html` | Same phone page, for Apps Script |
| `manifest.webmanifest` | Add to home screen |
| `icon.svg` | App icon |
| `.github/workflows/pages.yml` | Publishes the live GitHub Pages site |

## Remotes

- **Live site:** https://tectivejk.github.io/Updating-hardware/
- **GitHub:** https://github.com/TectiveJK/Updating-hardware
- **GitLab:** https://git.tective.nl/JohnKokotinis/Updating-hardware.git
