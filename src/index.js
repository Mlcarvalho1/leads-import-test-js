require('dotenv').config();
const express = require('express');
const { connectDb, sequelize } = require('./config/database');
const { Lead } = require('./models/Lead');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (similar to Fiber logger middleware)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
});

app.use('/', routes);

async function start() {
  await connectDb();
  await sequelize.sync({ alter: true });
  console.log('Running migrations / sync');

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
