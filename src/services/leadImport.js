const { parse } = require('csv-parse/sync');
const Lead = require('../models/Lead');

const BATCH_SIZE = 100;

function isHeaderRow(row) {
  if (!row || row.length === 0) return false;
  const first = String(row[0]).toLowerCase().trim();
  return first === 'name' || first === 'nome' || first === 'email';
}

/**
 * Parse CSV buffer and import leads. Skips header row if first cell is name/nome/email.
 * @param {Buffer} buffer - CSV file content
 * @returns {Promise<number>} - Number of imported leads
 */
async function importLeadsFromCSV(buffer) {
  const rows = parse(buffer, {
    relax_column_count: true,
    trim: true,
    skip_empty_lines: true,
  });

  if (!rows || rows.length === 0) return 0;

  let start = 0;
  if (isHeaderRow(rows[0])) start = 1;

  const leads = [];
  for (let i = start; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    const name = (row[0] || '').trim();
    const email = (row[1] || '').trim();
    const phone = (row[2] || '').trim();

    if (!name && !email) continue;

    leads.push({
      name: name || null,
      email: email || null,
      phone: phone || null,
      source: 'csv_import',
    });
  }

  if (leads.length === 0) return 0;

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE);
    await Lead.bulkCreate(batch);
  }

  return leads.length;
}

module.exports = { importLeadsFromCSV };
