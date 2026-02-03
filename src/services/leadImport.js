const { parse } = require('csv-parse');
const { Readable } = require('stream');
const Lead = require('../models/Lead');

const BATCH_SIZE = 100;

function isHeaderRow(row) {
  if (!row || row.length === 0) return false;
  const first = String(row[0]).toLowerCase().trim();
  return first === 'name' || first === 'nome' || first === 'email';
}

/**
 * Stream CSV buffer and import leads safely
 * @param {Buffer} buffer
 * @returns {Promise<number>}
 */
async function importLeadsFromCSV(buffer) {
  let imported = 0;
  let batch = [];
  let isFirstRow = true;

  const parser = parse({
    trim: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });

  const stream = Readable.from(buffer);

  for await (const row of stream.pipe(parser)) {
    if (isFirstRow && isHeaderRow(row)) {
      isFirstRow = false;
      continue;
    }
    isFirstRow = false;

    if (row.length < 2) continue;

    const name = (row[0] || '').trim();
    const email = (row[1] || '').trim();
    const phone = (row[2] || '').trim();

    if (!name && !email) continue;

    batch.push({
      name: name || null,
      email: email || null,
      phone: phone || null,
      source: 'csv_import',
    });

    if (batch.length >= BATCH_SIZE) {
      await Lead.bulkCreate(batch, { validate: false });
      imported += batch.length;
      batch = []; // libera memória
    }
  }

  // flush final
  if (batch.length > 0) {
    await Lead.bulkCreate(batch, { validate: false });
    imported += batch.length;
  }

  return imported;
}

module.exports = { importLeadsFromCSV };