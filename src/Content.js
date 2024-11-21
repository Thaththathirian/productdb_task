import React from 'react';
import PaginatedTable from './PaginatedTable'

const Content = ({
  unit, onUnitChange,
  costPrice, onCostPriceChange,
  sellingPrice, gstAmount, mrp,
  productCode, 
  onProductCodeChange,
  productName, 
  onProductNameChange,
  category, 
  onCategoryChange,
  subCategory, 
  onSubCategoryChange,
  hsn, 
  onHsnChange,
  onSubmit,
  onEdit,
  onDelete,
  products,
}) => {
  return (
    <>
      <form onSubmit={onSubmit}>

        <div className="form-container">
          <ol>
            <li>
              <label htmlFor="product-code">Product Code</label>
              <input type="text" id="product-code" value={productCode} onChange={onProductCodeChange} placeholder="Enter Product Code" name="productCode" />
            </li>
            <li>
              <label htmlFor="product-name">Product Name</label>
              <input type="text" id="product-name" value={productName} onChange={onProductNameChange} placeholder="Enter Product Name" name="productName" />
            </li>
            <li>
              <label htmlFor="category">Category</label>
              <select id="category" value={category} onChange={onCategoryChange} name="category">
                <option value="">--Select--</option>
                <option value="PVC Pipes">PVC Pipes</option>
                <option value="Measurement Tapes">Measurement Tapes</option>
                <option value="PVC pipe coupler">PVC pipe coupler</option>
              </select>
            </li>
            <li>
              <label htmlFor="sub-category">Sub Category</label>
              <select id="sub-category" value={subCategory} onChange={onSubCategoryChange} name="subCategory">
                <option value="">--Select--</option>
                <option value="15mm Dia pipe">15mm Dia pipe</option>
                <option value="20mm Dia pipe">20mm Dia pipe</option>
                <option value="25mm Dia pipe">25mm Dia pipe</option>
                <option value="40mm Dia pipe">40mm Dia pipe</option>
                <option value="400mm Dia pipe">400mm Dia pipe</option>
                <option value="500mm Dia pipe">500mm Dia pipe</option>
                <option value="2m Tape">2m Tape</option>
                <option value="3m Tape">3m Tape</option>
                <option value='1" Coupler'>1" Coupler</option>
                <option value=''>3/4" coupler</option>
              </select>
            </li>
            <li>
              <label htmlFor="unit">Unit</label>
              <input type="number" id="unit" value={unit} onChange={onUnitChange} name="unit" />
            </li>
            <li>
              <label htmlFor="hsn">HSN</label>
              <input type="number" id="hsn" value={hsn} onChange={onHsnChange} name="hsn" />
            </li>
            <li>
              <label htmlFor="cost-price">Cost Price</label>
              <input type="number" id="cost-price" value={costPrice} onChange={onCostPriceChange} placeholder="₹ Enter Cost Price" name="costPrice" />
            </li>
            <li>
              <label htmlFor="selling-price">Selling Price</label>
              <input type="number" id="selling-price" value={sellingPrice} readOnly name="sellingPrice" />
            </li>
            <li>
              <label htmlFor="gst-calculation">GST (18%)</label>
              <input type="number" id="gst-calculation" value={gstAmount} readOnly name="gstCalculation" />
            </li>
            <li>
              <label htmlFor="mrp-calculation">MRP</label>
              <input type="number" id="mrp-calculation" value={mrp} readOnly name="mrpCalculation" />
            </li>
          </ol>
        </div>
        <div className="btn">
          <button type="submit">Submit</button>
        </div>
      </form>

      <div className='table-content' >
        <h2>Submitted Products :</h2>
        <PaginatedTable products={products} onEdit={onEdit} onDelete={onDelete}/>
      </div>
    </>
  );
};

export default Content;

