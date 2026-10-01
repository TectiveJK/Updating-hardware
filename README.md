# Hardware location updater

Phone page for Tective so anyone can add hardware and update where it is. **Everyone sees the same list.**

**Share this link:** https://tectivejk.github.io/Updating-hardware/

That site stays online. Open it on a phone, or add it to the home screen.

When someone changes a location, other phones pick it up from the company Google Sheet (about every 15 seconds, or when they reopen the page).

The shared list is connected.

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

## Connect the shared list (once)

This is required so all phones see the same locations. You only do it once.

1. Open the hardware spreadsheet.
2. **Extensions → Apps Script**.
3. Delete any starter code. Paste [`apps-script/Code.gs`](apps-script/Code.gs).
4. **File → New → HTML file**, name it `Index` (not Index.html). Paste [`apps-script/Index.html`](apps-script/Index.html).
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the URL that ends in `/exec`.
7. Paste that URL into [`config.js`](config.js) as `scriptUrl`.
8. Commit and push to GitHub. The live site will then share one list.

Until that URL is in `config.js`, a phone only keeps its own copy.

The script reads and writes **Product Status** columns B (name), C (location), E (person), F (note). New hardware is appended as a new row.

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
