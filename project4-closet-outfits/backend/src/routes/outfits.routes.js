const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all outfits
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM outfits ORDER BY createdAt DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch outfits" });
  }
});

module.exports = router;
