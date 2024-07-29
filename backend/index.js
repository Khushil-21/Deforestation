const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: `Backend is deployed and Running Properly on port ${port}` });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});