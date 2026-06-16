require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

console.log("SERVER LOADED: items + outfits routes enabled");

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, message: "API + DB are working" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// -------------------- ITEMS --------------------

// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// POST add an item
app.post("/api/items", async (req, res) => {
  const { name, type, color, season, brand, notes, imageUrl } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "name and type are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO items (name, type, color, season, brand, notes, imageUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        String(name).trim(),
        String(type).trim(),
        color ?? null,
        season ?? null,
        brand ?? null,
        notes ?? null,
        imageUrl ?? null,
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

// DELETE item (and remove it from any outfits)
app.delete("/api/items/:id", async (req, res) => {
  const itemId = Number(req.params.id);

  if (!Number.isInteger(itemId) || itemId <= 0) {
    return res.status(400).json({ error: "Invalid item id" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // remove from join table first (safe even if FK cascade exists)
    await conn.query("DELETE FROM outfit_items WHERE item_id = ?", [itemId]);

    // delete the item row
    const [result] = await conn.query("DELETE FROM items WHERE id = ?", [itemId]);

    await conn.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error("DELETE /api/items/:id ERROR:", err);
    res.status(500).json({ error: "Failed to delete item" });
  } finally {
    conn.release();
  }
});

// ------------------- OUTFITS -------------------

// GET outfits (with items[])
app.get("/api/outfits", async (req, res) => {
  try {
    const [outfits] = await pool.query("SELECT * FROM outfits ORDER BY createdAt DESC");

    if (outfits.length === 0) return res.json([]);

    const outfitIds = outfits.map((o) => o.id);

    const [rows] = await pool.query(
      `
      SELECT
        oi.outfit_id,
        i.*
      FROM outfit_items oi
      JOIN items i ON i.id = oi.item_id
      WHERE oi.outfit_id IN (?)
      ORDER BY i.createdAt DESC
      `,
      [outfitIds]
    );

    const itemsByOutfit = new Map();
    for (const r of rows) {
      const oid = r.outfit_id;
      const item = { ...r };
      delete item.outfit_id;

      if (!itemsByOutfit.has(oid)) itemsByOutfit.set(oid, []);
      itemsByOutfit.get(oid).push(item);
    }

    const result = outfits.map((o) => ({
      ...o,
      items: itemsByOutfit.get(o.id) || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("GET /api/outfits ERROR:", err);
    res.status(500).json({ error: "Failed to fetch outfits" });
  }
});

// POST create outfit + link items
app.post("/api/outfits", async (req, res) => {
  const { name, items } = req.body;

  if (!name) return res.status(400).json({ error: "name is required" });
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "items must be a non-empty array of item IDs",
    });
  }

  const itemIds = items
    .map((x) => Number(x))
    .filter((n) => Number.isInteger(n) && n > 0);

  if (itemIds.length === 0) {
    return res.status(400).json({ error: "items must contain valid numeric IDs" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [outfitResult] = await conn.query("INSERT INTO outfits (name) VALUES (?)", [
      String(name).trim(),
    ]);
    const outfitId = outfitResult.insertId;

    for (const itemId of itemIds) {
      await conn.query("INSERT INTO outfit_items (outfit_id, item_id) VALUES (?, ?)", [
        outfitId,
        itemId,
      ]);
    }

    await conn.commit();
    res.status(201).json({ id: outfitId });
  } catch (err) {
    await conn.rollback();
    console.error("POST /api/outfits ERROR:", err);
    res.status(500).json({
      error: "Failed to create outfit",
      details: err.sqlMessage || err.message,
    });
  } finally {
    conn.release();
  }
});

// DELETE outfit (and its outfit_items rows)
app.delete("/api/outfits/:id", async (req, res) => {
  const outfitId = Number(req.params.id);

  if (!Number.isInteger(outfitId) || outfitId <= 0) {
    return res.status(400).json({ error: "Invalid outfit id" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query("DELETE FROM outfit_items WHERE outfit_id = ?", [outfitId]);

    const [result] = await conn.query("DELETE FROM outfits WHERE id = ?", [outfitId]);

    await conn.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Outfit not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error("DELETE /api/outfits/:id ERROR:", err);
    res.status(500).json({ error: "Failed to delete outfit" });
  } finally {
    conn.release();
  }
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(`API running: http://localhost:${PORT}`));
server.on("error", (err) => console.error("SERVER ERROR:", err));
server.ref();
