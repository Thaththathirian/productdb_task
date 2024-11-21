const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');

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

// initializing database and renderToPipeableStream(its not needed when queries written in mysql)
const initializeDatabase = async () => {
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS productDB;`;
  const useDatabaseQuery = `USE productDB;`;
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_code VARCHAR(50) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        sub_category VARCHAR(100) NOT NULL,
        unit INT NOT NULL,
        hsn VARCHAR(50),
        cost_price DECIMAL(10, 2) NOT NULL,
        selling_price DECIMAL(10, 2) NOT NULL,
        gst_amount DECIMAL(10, 2) NOT NULL,
        mrp DECIMAL(10, 2) NOT NULL,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
    );
  `;

  try {
    // Initialize the database
    const promisePool = db.promise();
    await promisePool.query(createDatabaseQuery);
    console.log('Database created or exists already.');
    await promisePool.query(useDatabaseQuery);
    console.log('Using database: productDB.');
    await promisePool.query(createTableQuery);
    console.log('Products table created or exists already.');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
};

// Call the function to initialize the database
initializeDatabase();

// testing database connection
db.getConnection((err) => {
  if (err) {
    console.error('Database connection failed', err.stack);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// to save the products
app.post('/save-product', async (req, res) => {
  console.log("Request Body:", req.body);
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

  if (!productCode || !productName || !category || !subCategory || !unit || !costPrice) {
    return res.status(400).json({ status: 'error', message: 'Kindly fill all the required fields.' });
  }

  const query = `
    INSERT INTO products 
    (product_code, product_name, category, sub_category, unit, hsn, cost_price, selling_price, gst_amount, mrp, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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
    if (result.affectedRows > 0){
    res.json({ 
      status: 'success', 
      message: 'Product saved successfully', 
      productId: result.insertId 
    });
  } else{
    res.status(500).json({
      status: 'error',
      message: 'Failed to add products'})
  }
  } catch (error) {
    console.error('Error saving product:', error.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to save product' });
  }
});

// soft deleting of products
app.post('/delete-product', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ status: 'error', message: 'Product ID is required' });
  }

  const query = `
    UPDATE products 
    SET is_deleted = 1, deleted_at = NOW(), updated_at = updated_at 
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

// get all products
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

// edit products
app.post('/edit-product/', async (req, res) => {
  // console.log("Request Body:", req.body);
  // console.log("res:", res);
  const {
    id,
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

  if (!id) {
    return res.status(400).json({ status: 'error', message: 'Product ID is required' });
  }

  const query = `
    UPDATE products
    SET 
      product_code = ?,
      product_name = ?,
      category = ?,
      sub_category = ?,
      unit = ?,
      hsn = ?,
      cost_price = ?,
      selling_price = ?,
      gst_amount = ?,
      mrp = ?,
      updated_at = NOW()
    WHERE id = ? AND is_deleted = 0
  `;

  try {
    const [result] = await db.promise().execute(query, [
      id, // Correct parameter order
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
    console.log("result",result)
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or already deleted',
      });
    } else {
      res.json({
        status: 'success',
        message: 'Product updated successfully',
      });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
    });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
})

