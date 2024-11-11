import React from 'react';

const Content = ({
  unit, onUnitChange,
  costPrice, onCostPriceChange,
  sellingPrice, gstAmount, mrp,
  productCode, onProductCodeChange,
  productName, onProductNameChange,
  category, onCategoryChange,
  subCategory, onSubCategoryChange,
  hsn, onHsnChange,
  handleSubmit
}) => {

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <ol>
          <li>
            <label for="product-code">Product Code</label>
            <input type="text" id="product-code" value={productCode} onChange={onProductCodeChange} placeholder="Enter Product Code" name="productCode" />
          </li>
          <li>
            <label htmlFor="product-name">Product Name</label>
            <input type="text" id="product-name" value={productName} onChange={onProductNameChange} placeholder="Enter Product Name" name="productName" />
          </li>
          <li>
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={onCategoryChange} name="category">
              <option value="select">--Select--</option>
              <option value="Front-end-developer">Front-end Developer</option>
              <option value="Back-end-developer">Back-end Developer</option>
              <option value="Full-stack-developer">FullStack Developer</option>
            </select>
          </li>
          <li>
            <label htmlFor="sub-category">Sub Category</label>
            <select id="sub-category" value={subCategory} onChange={onSubCategoryChange} name="subCategory">
              <option value="select">--Select--</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="JavaScript">JavaScript</option>
              <option value="ReactJs">ReactJs</option>
              <option value="NodeJS">NodeJS</option>
              <option value="API">API</option>
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
  );
}

export default Content;