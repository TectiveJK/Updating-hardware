# Hardware location updater

Phone page for Tective. Anyone can add hardware and update where it is. **Everyone sees the same list.**

**Always-live link (share this):** https://tectivejk.github.io/Updating-hardware/

This URL stays online. It does not go down when you close your laptop. Open it on a phone, or add it to the home screen.

When someone changes a location, other phones show it from the company Google Sheet (within about 15 seconds, or when they reopen the page).

**Nobody needs a Google login.** Do not open the spreadsheet. Share only the GitHub Pages link above. The app talks to the sheet as you (the owner), so other phones can list and update hardware without access to your Google account.

If someone sees an empty list, they are probably on a Google sign-in page or an old saved link. Send them https://tectivejk.github.io/Updating-hardware/ and ask them to open it in the normal phone browser (not the Google Sheet).

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

People never log into Google. The phone page calls an Apps Script web app that **runs as you** and reads/writes the **Product Status** tab of the production Planning Google Sheet.

Do **not** share the planning spreadsheet with the whole company. Keep the sheet private. Only the web app needs access, and it already uses your account.

The web app must be deployed as:

- Execute as: **Me**
- Who has access: **Anyone** (not “Anyone with a Google account”, and not only Tective)

If that is wrong, other phones get a Google login wall or an empty list. Fix it with **Deploy → Manage deployments → the web app → Edit → New version**, then **Deploy**.

The phone page writes to:

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

- **Always-live site:** https://tectivejk.github.io/Updating-hardware/
- **GitHub:** https://github.com/TectiveJK/Updating-hardware
- **GitLab:** https://git.tective.nl/JohnKokotinis/Updating-hardware.git
