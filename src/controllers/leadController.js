const { importLeadsFromCSV } = require('../services/leadImport');

/**
 * POST /leads/import - multipart form field "file" (CSV)
 */
async function importLeads(req, res) {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({
      error: "missing file: use form field 'file' with a CSV file",
    });
  }

  try {
    const imported = await importLeadsFromCSV(req.file.buffer);
    return res.status(200).json({
      message: 'import completed',
      imported,
    });
  } catch (err) {
    return res.status(400).json({
      error: 'invalid CSV',
      details: err.message,
    });
  }
}

module.exports = { importLeads };
