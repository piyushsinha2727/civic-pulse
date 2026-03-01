const XLSX = require('xlsx');
const db = require('./db');

const workbook = XLSX.readFile('form-data.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet);

// Print exact headers once
console.log("Detected Headers:");
console.log(Object.keys(data[0]));

data.forEach((row) => {

  // Access using dynamic key lookup (safe method)
  const category = row[Object.keys(row).find(k => k.trim() === "Category")];
  const description = row[Object.keys(row).find(k => k.trim() === "Description")];
  const locationLink = row[Object.keys(row).find(k => k.trim() === "Location")];

  console.log("Category value:", category);

  const query = `
    INSERT INTO issues (category, description, latitude, longitude)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [category, description, null, null], (err) => {
    if (err) {
      console.error("Insert Error:", err);
    } else {
      console.log("Inserted:", category);
    }
  });

});

console.log("Import Process Completed");