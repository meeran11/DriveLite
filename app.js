const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🚀 Railway app is running!');
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
