# Hardware location updater

Phone page for Tective so anyone can add hardware and update where it is.

**Share this link:** https://tectivejk.github.io/Updating-hardware/

That site stays online. Open it on a phone, or add it to the home screen.

## What people can do

- Search drones, batteries, hive, and rotators
- Update location, who has it, and a short note
- Tap **Add hardware** to put a new item on the list

Saves go into the **Product Status** tab of the production Planning Google Sheet.

Until the Google Sheet is connected (see below), the page runs in **demo mode**. Demo edits stay on that phone only.

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

## Connect the Google Sheet (once)

Do this once so Save and Add hardware write to the real spreadsheet. After that, everyone keeps using the same live link.

1. Open the hardware spreadsheet.
2. **Extensions → Apps Script**.
3. Delete any starter code. Paste [`apps-script/Code.gs`](apps-script/Code.gs).
4. **File → New → HTML file**, name it `Index` (not Index.html). Paste [`apps-script/Index.html`](apps-script/Index.html).
5. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the URL that ends in `/exec`.
7. Paste that URL into [`config.js`](config.js) as `scriptUrl`.
8. Commit and push (GitHub remote: `github`). GitHub Pages will update the live site.

If you already deployed Apps Script earlier, deploy a **new version** after pasting the latest `Code.gs` so **Add hardware** works on the sheet.

The script reads and writes **Product Status** columns:

| Column | Field |
| --- | --- |
| B | Item name |
| C | Location |
| E | Person responsible |
| F | Note |

- **Update** changes the matching row (by item name).
- **Add hardware** appends a new row.
- Each save also appends a line to a hidden **Location Log** tab.

Placeholder rows such as `battery - (004)` are hidden in the app.

## What is in this repo

| File | Purpose |
| --- | --- |
| `index.html` | Phone page (search, update, add) |
| `config.js` | Apps Script URL for live saves |
| `apps-script/Code.gs` | Reads/writes/adds rows in the Google Sheet |
| `apps-script/Index.html` | Same phone page, for Apps Script |
| `.github/workflows/pages.yml` | Publishes the live GitHub Pages site |
| `.gitlab-ci.yml` | Optional GitLab Pages job |

## Remotes

- **Live site:** https://tectivejk.github.io/Updating-hardware/
- **GitHub:** https://github.com/TectiveJK/Updating-hardware
- **GitLab:** https://git.tective.nl/JohnKokotinis/Updating-hardware.git

Push to both:

```bash
git push github main
git push origin main
```
