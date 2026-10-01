# Hardware location updater

Phone page for Tective to update where hardware is.

**Share this link:** https://tectivejk.github.io/Updating-hardware/

That site stays online. Open it on a phone, or add it to the home screen.

Saves go into the **Product Status** tab of the production Planning Google Sheet (item, location, who has it, note).

Until the Google Sheet is connected (see below), the page runs in **demo mode**. Demo edits are not saved.

## Use it (everyone)

1. Open https://tectivejk.github.io/Updating-hardware/
2. Search for a drone, battery, hive, or rotator.
3. Tap it, choose a location, type your name, Save.

### Add to a phone home screen

- **iPhone:** Safari → Share → **Add to Home Screen**
- **Android:** Chrome → menu → **Add to Home screen**

A link like `https://tectivejk.github.io/Updating-hardware/?item=refly-sf-010` opens that item directly (useful on printed QR labels later).

## Connect the Google Sheet (once)

Do this once so Save writes to the real spreadsheet. After that, everyone keeps using the same live link.

1. Open the hardware spreadsheet.
2. **Extensions → Apps Script**.
3. Delete any starter code. Paste [`apps-script/Code.gs`](apps-script/Code.gs).
4. **File → New → HTML file**, name it `Index` (not Index.html). Paste [`apps-script/Index.html`](apps-script/Index.html).
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the URL that ends in `/exec`.
7. Paste that URL into [`config.js`](config.js) as `scriptUrl`.
8. Commit and push to GitHub (`github` remote). GitHub Pages will update the live site.

The script only reads and writes **Product Status** columns:

| Column | Field |
| --- | --- |
| B | Item name |
| C | Location |
| E | Person responsible |
| F | Note |

Each save also appends a row to a hidden **Location Log** tab (who moved what, and when).

Placeholder rows such as `battery - (004)` are hidden in the app.

## What is in this repo

| File | Purpose |
| --- | --- |
| `index.html` | Phone page |
| `config.js` | Apps Script URL for live saves |
| `apps-script/Code.gs` | Reads/writes the Google Sheet |
| `apps-script/Index.html` | Same phone page, for Apps Script |
| `.github/workflows/pages.yml` | Publishes the live GitHub Pages site |
| `.gitlab-ci.yml` | Optional GitLab Pages job |

## Remotes

- **Live site:** https://tectivejk.github.io/Updating-hardware/
- **GitHub:** https://github.com/TectiveJK/Updating-hardware
- **GitLab:** https://git.tective.nl/JohnKokotinis/Updating-hardware.git
