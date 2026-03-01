require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const issueRoutes = require('./routes/issueRoutes');
app.use('/api/issues', issueRoutes);

app.get('/', (req, res) => {
  res.send("Civic Pulse Backend Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});