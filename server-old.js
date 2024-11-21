// old file - excluded mysql queries

const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');
const { queries } = require('@testing-library/react');

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'productDB',
  waitForConnections: true,
  connectionLimit: 10,
});

db.getConnection((err) => {
  if (err) {
    console.error('Database connection failed', err.stack);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

app.post('/save-product', async (req, res) => {
  const {
    productCode,
    productName,
    category,
    subCategory,
    unit,
    hsn,
    costPrice,
    sellingPrice,
    gstAmount,
    mrp,
  } = req.body;

  if (!productCode || !productName || !category || !unit || !costPrice) {
    return res.status(400).json({ status: 'error', message: 'Kindly fill all the required fields.' });
  }

  const query = `
    INSERT INTO products 
    (product_code, product_name, category, sub_category, unit, hsn, cost_price, selling_price, gst_amount, mrp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.promise().execute(query, [
      productCode,
      productName,
      category,
      subCategory,
      unit,
      hsn,
      costPrice,
      sellingPrice,
      gstAmount,
      mrp,
    ]);
    res.json({ 
      status: 'success', 
      message: 'Product saved successfully', 
      productId: result.insertId });
  } catch (error) {
    console.error('Error saving product:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to save product' });
  }
});

app.post('/delete-product', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ status: 'error', message: 'Product ID is required' });
  }

  const query = `
    UPDATE products 
    SET is_deleted = 1, deleted_at = NOW() 
    WHERE id = ?
  `;

  try {
    const [result] = await db.promise().execute(query, [id]);
    if (result.affectedRows > 0) {
      res.json({ 
        status: 'success', 
        message: 'Product deleted successfully' })
    } else {
      res.status(404).json({ 
        status: 'error',
        message: 'Product not found' })
    }
  } catch (error) {
    console.error('Error deleting product:', error.message)
    res.status(500).json({ status: 'error', message: 'Failed to delete product' });
  }
});

app.get('/products', async (req, res) => {
  const query = `SELECT * FROM products WHERE is_deleted = 0 OR is_deleted IS NULL`;

  try {
    const [rows] = await db.promise().execute(query);
    res.json({ 
      status: 'success', 
      products: rows })
  } catch (error) {
    console.error('Error fetching products:', error.message)
    res.status(500).json({ status: 'error', message: 'Failed to fetch products' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

