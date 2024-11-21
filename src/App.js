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
  const [editingProductId, setEditingProductId] = useState(null)

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
      setProducts((response.data.products || []).reverse());
    } catch (error) {
      console.error('Error fetching products:', error);
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
    setEditingProductId(null)
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingProductId,
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
      // console.log("editingProductId",editingProductId) 
      const url = editingProductId
      ? 'http://localhost:3001/edit-product'
      : 'http://localhost:3001/save-product'    
      // console.log("url",url)
      // console.log("payload",payload)
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Response Data:", response.data);
      if (response.data.status === 'success') {
        alert(response.data.message);

        if (!editingProductId){
          const newProduct = {
            id: response.data.productId,
            product_code: productCode,
            product_name: productName,
            category,
            sub_category: subCategory,
            unit,
            hsn,
            cost_price: costPrice,
            selling_price: sellingPrice,
            gst_amount: gstAmount,
            mrp,
            created_at: new Date().toISOString(),
            updated_at: null,
            deleted_at: null,
          }
          setProducts((prevProducts) => [newProduct, ...prevProducts])
          // fetchProducts();
          clearForm();
        } else {
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p.id === editingProductId
          ? {...p, ...payload, updated_at: new Date().toISOString()}
          : p
        )
      )
    }
      clearForm()
      setEditingProductId(null)
  }else {
        alert(response.data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product')
    }
  };
  

// To edit values
  const handleEdit = async (product) => {
    const confirmed = window.confirm('Are you sure you want to edit this product?')
    if(confirmed){
      setProductCode(product.product_code)
      setProductName(product.product_name)
      setCategory(product.category)
      setSubCategory(product.sub_category)
      setUnit(product.unit)
      setHsn(product.hsn)
      setCostPrice(product.cost_price)
      setEditingProductId(product.id)
    }
  }
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?")
    if(confirmed){
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
      alert("An error occurred while deleting the product")
    }
  }
  };


  return (
    <div>
      <Header />
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        products={products}
      />
    </div>
  );
};

export default App