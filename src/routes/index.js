const express = require('express');
const leadRoutes = require('./leadRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

router.use('/leads', leadRoutes);

module.exports = router;
