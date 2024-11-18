import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header'
import Content from './Content';


const App = () => {
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [unit, setUnit] = useState(1);
  const [hsn, setHsn] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const cost = parseFloat(costPrice) || 0;
    const units = parseInt(unit, 10) || 1;
    calculatePricing(cost, units);
  }, [costPrice, unit]);

  const calculatePricing = (cost, unit) => {
    const selling = cost * unit || 0;
    const gst = selling * 0.18 || 0;
    const mrpValue = selling + gst;

    setSellingPrice(selling.toFixed(2));
    setGstAmount(gst.toFixed(2));
    setMrp(mrpValue.toFixed(2));
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
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
    };

    try {
      const response = await axios.post('http://localhost:3001/save-product', payload);
      if (response.data.status === 'success') {
        alert(response.data.message);
        fetchProducts();
        clearForm();
      } else {
        alert(response.data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post('http://localhost:3001/delete-product', { id });
      if (response.data.status === 'success') {
        alert(response.data.message);
        fetchProducts();
      } else {
        alert(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const clearForm = () => {
    setProductCode('');
    setProductName('');
    setCategory('');
    setSubCategory('');
    setUnit(1);
    setHsn('');
    setCostPrice('');
    setSellingPrice(0);
    setGstAmount(0);
    setMrp(0);
  };

  return (
    <div>
      <Header />
      {/* <h1>Product Management</h1> */}
      <Content
        productCode={productCode}
        onProductCodeChange={(e) => setProductCode(e.target.value)}
        productName={productName}
        onProductNameChange={(e) => setProductName(e.target.value)}
        category={category}
        onCategoryChange={(e) => setCategory(e.target.value)}
        subCategory={subCategory}
        onSubCategoryChange={(e) => setSubCategory(e.target.value)}
        unit={unit}
        onUnitChange={(e) => setUnit(e.target.value)}
        hsn={hsn}
        onHsnChange={(e) => setHsn(e.target.value)}
        costPrice={costPrice}
        onCostPriceChange={(e) => setCostPrice(e.target.value)}
        sellingPrice={sellingPrice}
        gstAmount={gstAmount}
        mrp={mrp}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        products={products}
      />
    </div>
  );
};

export default App;
