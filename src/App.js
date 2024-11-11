import React, { useState } from 'react';
import Header from './Header';
import Content from './Content';
import './App.css';

function App() {
  const [unit, setUnit] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [gstAmount, setGstAmount] = useState('');
  const [mrp, setMrp] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [hsn, setHsn] = useState('');

  const gstRate = 18;

  const handleProductCodeChange = (e) => setProductCode(e.target.value);
  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleSubCategoryChange = (e) => setSubCategory(e.target.value);
  const handleHsnChange = (e) => setHsn(e.target.value);

  const handleUnitChange = (e) => {
    const newUnit = parseFloat(e.target.value) || 1;
    setUnit(newUnit);
    calculateSellingPrice(newUnit, costPrice);
  };

  const handleCostPriceChange = (e) => {
    const price = parseFloat(e.target.value) || 0;
    setCostPrice(price);
    calculateSellingPrice(unit, price);
  };

  const calculateSellingPrice = (unit, price) => {
    const calculatedSellingPrice = unit * price;
    setSellingPrice(calculatedSellingPrice);
    calculateGstAndMrp(calculatedSellingPrice, gstRate);
  };

  const calculateGstAndMrp = (price, rate) => {
    const gstValue = (price * rate) / 100;
    setGstAmount(gstValue);
    const calculatedMrp = price + gstValue;
    setMrp(Math.round(calculatedMrp));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      productCode,
      productName,
      category,
      subCategory,
      unit,
      hsn,
      costPrice,
      sellingPrice,
      gstAmount,
      mrp
    };

    try {
      const response = await fetch('http://localhost/task_01/save_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      const result = await response.json();
      alert(result.message);
      if (result.status === "success") resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const resetForm = () => {
    setUnit('');
    setCostPrice('');
    setSellingPrice('');
    setGstAmount('');
    setMrp('');
    setProductCode('');
    setProductName('');
    setCategory('');
    setSubCategory('');
    setHsn('');
  };

  return (
    <div className="App">
      <Header />
      <Content
        unit={unit}
        onUnitChange={handleUnitChange}
        costPrice={costPrice}
        onCostPriceChange={handleCostPriceChange}
        sellingPrice={sellingPrice}
        gstAmount={gstAmount}
        mrp={mrp}
        productCode={productCode}
        onProductCodeChange={handleProductCodeChange}
        productName={productName}
        onProductNameChange={handleProductNameChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        subCategory={subCategory}
        onSubCategoryChange={handleSubCategoryChange}
        hsn={hsn}
        onHsnChange={handleHsnChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;