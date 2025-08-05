// app.js

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send("🚀 Server is live!"));
app.get('/favicon.ico', (req, res) => res.status(204)); // no content

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
