# Hardware location updater

A phone page for Tective so anyone can update where hardware is. Saves go into the **Product Status** tab of the production Planning Google Sheet.

## Use it

1. Open the page on your phone.
2. Enter the company PIN.
3. Search for a drone, battery, hive or rotator.
4. Tap it, choose a location, type your name, Save.

Add it to the home screen:

- **iPhone:** Safari → Share → Add to Home Screen
- **Android:** Chrome → menu → Add to Home screen

A link like `?item=refly-sf-010` opens that item directly (useful on printed QR labels later).

Until the Google Sheet is connected, the page runs in **demo mode**. Demo edits are not saved.

## One-time setup (Google Sheet)

You only do this once. After that, everyone uses the phone link.

1. Open the hardware spreadsheet.
2. **Extensions → Apps Script**.
3. Delete any starter code. Paste [`apps-script/Code.gs`](apps-script/Code.gs).
4. Change `ACCESS_PIN` at the top to the company PIN (default in the file is `tective`).
5. **File → New → HTML file**, name it `Index` (not Index.html). Paste [`apps-script/Index.html`](apps-script/Index.html).
6. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the URL that ends in `/exec`.
8. Paste that URL into [`config.js`](config.js) as `scriptUrl`.
9. Commit and push so GitLab Pages can pick it up.

The script only reads and writes **Product Status** columns:

| Column | Field |
| --- | --- |
| B | Item name |
| C | Location |
| E | Person responsible |
| F | Note |

Each save also appends a row to a hidden **Location Log** tab (who moved what, and when).

If GitLab Pages is not enabled, share the Apps Script `/exec` URL itself. That URL is the same app.

## GitLab Pages

This repo includes [`.gitlab-ci.yml`](.gitlab-ci.yml). After Pages is on, the phone URL is the Pages URL for this project.

## PIN

The PIN lives in Apps Script (`ACCESS_PIN`), not in this git repo. You can also set a script property named `PIN` in Apps Script; that overrides the file.
