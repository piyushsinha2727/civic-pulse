const db = require('../db');

exports.createIssue = (req, res) => {
  const { category, description, latitude, longitude } = req.body;

  const imagePath = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO issues (category, description, latitude, longitude, image)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [category, description, latitude, longitude, imagePath],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        message: "Issue reported successfully",
        image: imagePath
      });
    }
  );
};

exports.getIssues = (req, res) => {
  db.query("SELECT * FROM issues", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};