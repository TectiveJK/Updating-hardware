/**
 * Hardware location API for the Product Status sheet.
 *
 * Deploy: Extensions → Apps Script → paste this file and Index.html → Deploy → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Then paste the /exec URL into ../config.js
 */

const SPREADSHEET_ID = '1wd0kwOdgz8fdb54RBnoJgTuMjonhJb5pj0L0fBfC2vg';
const STATUS_SHEET = 'Product Status';
const LOG_SHEET = 'Location Log';
const DATA_START_ROW = 5;
const COL = {
  name: 2,      // B
  location: 3,  // C
  gimbal: 4,    // D
  person: 5,    // E
  note: 6       // F
};

function doGet(e) {
  e = e || { parameter: {} };
  const p = e.parameter || {};

  if (p.action) {
    return jsonp(p.callback, handleAction(p));
  }

  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Hardware')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function listItems() {
  return { ok: true, items: readItems() };
}

function updateItem(payload) {
  payload = payload || {};
  const name = String(payload.item || payload.name || '').trim();
  if (!name) return { ok: false, error: 'Pick an item first.' };

  const newName = String(payload.newName || '').trim();
  const location = String(payload.location || '').trim();
  if (!location) return { ok: false, error: 'Choose a location.' };

  const person = String(payload.person || '').trim();
  const note = String(payload.note || '').trim().slice(0, 500);

  const lock = LockService.getDocumentLock();
  lock.waitLock(15000);
  try {
    const sheet = statusSheet();
    const row = findRow(sheet, name);
    if (!row) return { ok: false, error: 'Item not found: ' + name };

    var finalName = name;
    if (newName && newName.toLowerCase() !== name.toLowerCase()) {
      if (isPlaceholder_(newName)) return { ok: false, error: 'Use a real name, not a placeholder.' };
      const taken = findRow(sheet, newName);
      if (taken && taken !== row) return { ok: false, error: newName + ' is already on the list.' };
      sheet.getRange(row, COL.name).setValue(newName);
      finalName = newName;
    }

    const oldLocation = String(sheet.getRange(row, COL.location).getDisplayValue() || '');
    const oldPerson = String(sheet.getRange(row, COL.person).getDisplayValue() || '');
    const oldNote = String(sheet.getRange(row, COL.note).getDisplayValue() || '');

    sheet.getRange(row, COL.location).setValue(location);
    sheet.getRange(row, COL.person).setValue(person);
    sheet.getRange(row, COL.note).setValue(note);

    appendLog_({
      item: finalName,
      oldLocation: oldLocation,
      newLocation: location,
      oldPerson: oldPerson,
      person: person,
      oldNote: oldNote,
      note: (finalName !== name ? 'Renamed from ' + name + '. ' : '') + note
    });

    return {
      ok: true,
      item: {
        name: finalName,
        location: location,
        person: person,
        note: note,
        gimbal: String(sheet.getRange(row, COL.gimbal).getDisplayValue() || ''),
        type: classify_(finalName)
      }
    };
  } finally {
    lock.releaseLock();
  }
}

function deleteItem(payload) {
  payload = payload || {};
  const name = String(payload.item || payload.name || '').trim();
  if (!name) return { ok: false, error: 'Pick an item first.' };

  const lock = LockService.getDocumentLock();
  lock.waitLock(15000);
  try {
    const sheet = statusSheet();
    const row = findRow(sheet, name);
    if (!row) return { ok: false, error: 'Item not found: ' + name };

    const oldLocation = String(sheet.getRange(row, COL.location).getDisplayValue() || '');
    const oldPerson = String(sheet.getRange(row, COL.person).getDisplayValue() || '');
    const oldNote = String(sheet.getRange(row, COL.note).getDisplayValue() || '');

    appendLog_({
      item: name,
      oldLocation: oldLocation,
      newLocation: 'Deleted',
      oldPerson: oldPerson,
      person: '',
      oldNote: oldNote,
      note: 'Deleted from the hardware list'
    });

    sheet.deleteRow(row);
    return { ok: true, deleted: name };
  } finally {
    lock.releaseLock();
  }
}

function addItem(payload) {
  payload = payload || {};
  const name = String(payload.item || payload.name || '').trim();
  if (!name) return { ok: false, error: 'Type a hardware name.' };
  if (isPlaceholder_(name)) return { ok: false, error: 'Use a real name, not a placeholder.' };

  const location = String(payload.location || '').trim();
  if (!location) return { ok: false, error: 'Choose a location.' };

  const person = String(payload.person || '').trim();
  const note = String(payload.note || '').trim().slice(0, 500);

  const lock = LockService.getDocumentLock();
  lock.waitLock(15000);
  try {
    const sheet = statusSheet();
    if (findRow(sheet, name)) return { ok: false, error: name + ' is already on the list.' };

    sheet.appendRow(['', name, location, '', person, note]);

    appendLog_({
      item: name,
      oldLocation: '',
      newLocation: location,
      oldPerson: '',
      person: person,
      oldNote: '',
      note: note
    });

    return {
      ok: true,
      item: {
        name: name,
        location: location,
        person: person,
        note: note,
        gimbal: '',
        type: classify_(name)
      }
    };
  } finally {
    lock.releaseLock();
  }
}

function handleAction(p) {
  try {
    if (p.action === 'list') return listItems();
    if (p.action === 'update') {
      return updateItem({
        item: p.item,
        newName: p.newName,
        location: p.location,
        person: p.person,
        note: p.note
      });
    }
    if (p.action === 'add') {
      return addItem({
        item: p.item,
        location: p.location,
        person: p.person,
        note: p.note
      });
    }
    if (p.action === 'delete') {
      return deleteItem({
        item: p.item
      });
    }
    return { ok: false, error: 'Unknown action.' };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
}

function readItems() {
  const sheet = statusSheet();
  const last = sheet.getLastRow();
  if (last < DATA_START_ROW) return [];

  const width = Math.max(COL.note, sheet.getLastColumn());
  const values = sheet.getRange(DATA_START_ROW, 1, last - DATA_START_ROW + 1, width).getDisplayValues();
  const items = [];

  for (var i = 0; i < values.length; i++) {
    const name = String(values[i][COL.name - 1] || '').trim();
    if (isPlaceholder_(name)) continue;
    const location = String(values[i][COL.location - 1] || '').trim();
    if (location.toLowerCase() === 'deleted') continue;
    items.push({
      name: name,
      location: location,
      gimbal: String(values[i][COL.gimbal - 1] || '').trim(),
      person: String(values[i][COL.person - 1] || '').trim(),
      note: String(values[i][COL.note - 1] || '').trim(),
      type: classify_(name)
    });
  }
  return items;
}

function findRow(sheet, name) {
  const last = sheet.getLastRow();
  if (last < DATA_START_ROW) return 0;
  const names = sheet.getRange(DATA_START_ROW, COL.name, last - DATA_START_ROW + 1, 1).getDisplayValues();
  const wanted = name.toLowerCase();
  for (var i = 0; i < names.length; i++) {
    if (String(names[i][0] || '').trim().toLowerCase() === wanted) {
      return DATA_START_ROW + i;
    }
  }
  return 0;
}

function boundSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActive();
    if (active) return active;
  } catch (err) {}
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function statusSheet() {
  const ss = boundSpreadsheet();
  const sheet = ss.getSheetByName(STATUS_SHEET);
  if (!sheet) throw new Error('Sheet "' + STATUS_SHEET + '" was not found.');
  return sheet;
}

function appendLog_(entry) {
  const ss = boundSpreadsheet();
  var sheet = ss.getSheetByName(LOG_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET);
    sheet.getRange(1, 1, 1, 8).setValues([[
      'Timestamp', 'Item', 'Old location', 'New location', 'Previous person', 'Person', 'Previous note', 'Note'
    ]]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.hideSheet();
  }
  sheet.appendRow([
    new Date(),
    entry.item,
    entry.oldLocation,
    entry.newLocation,
    entry.oldPerson,
    entry.person,
    entry.oldNote,
    entry.note
  ]);
}

function classify_(name) {
  const n = name.toLowerCase();
  if (n.indexOf('battery') !== -1) return 'battery';
  if (n.indexOf('rotator') !== -1) return 'rotator';
  if (n.indexOf('hive') !== -1 || n.indexOf('skyfence') !== -1) return 'hive';
  if (n.indexOf('refly') !== -1 || n.indexOf('drone') !== -1 || n.indexOf('ibb') !== -1) return 'drone';
  return 'other';
}

function isPlaceholder_(name) {
  if (!name) return true;
  if (/^battery\s*-\s*/i.test(name)) return true;
  if (name === '-') return true;
  return false;
}

function jsonp(callback, obj) {
  const name = String(callback || 'callback').replace(/[^\w$]/g, '') || 'callback';
  return ContentService
    .createTextOutput(name + '(' + JSON.stringify(obj) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
