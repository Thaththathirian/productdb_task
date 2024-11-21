import React, {useState} from 'react'

const PaginatedTable = ({products, onDelete, onEdit}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const maxVisiblePages = 3

  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  const currentProducts = products.slice(startIndex, endIndex)
  const totalPages = Math.ceil(products.length / rowsPerPage)

  const firstVisiblePage = Math.max(1, currentPage - Math.floor(maxVisiblePages/2))
  const lastVisiblePage = Math.min(totalPages, firstVisiblePage+maxVisiblePages-1)

  const visiblePages = Array.from(
    {length:lastVisiblePage - firstVisiblePage +1},
  (_,i) => firstVisiblePage+i
  )
  const handlePageChange = (page) =>{
    setCurrentPage(page)
  }

  return (
    <>
    <div className="product-table">
      <table border="1" className='table-container'>
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Sub Category</th>
            <th>Unit</th>
            <th>HSN</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>GST</th>
            <th>MRP</th>
            <th>Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts && currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.product_code}</td>
                <td>{product.product_name}</td>
                <td>{product.category}</td>
                <td>{product.sub_category}</td>
                <td>{product.unit}</td>
                <td>{product.hsn}</td>
                <td>{product.cost_price}</td>
                <td>{product.selling_price}</td>
                <td>{product.gst_amount}</td>
                <td>{product.mrp}</td>
                <td>
                  <button className='edit-btn' onClick={() => onEdit(product)}>Edit</button>
                </td>
                <td>
                  <button className='delete-btn' onClick={() => onDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* pagination */}
    <div className="pagination-controls">
      <button
      disabled={currentPage === 1}
      onClick={() => handlePageChange(currentPage-1)}>
        {"<"}
      </button>
      {/* {Array.from({length: totalPages}, (_, i) => i+1).map((page) =>( */}
      {visiblePages.map((page) => (
        <button
          key={page}
          className = {currentPage === page ? "active-page" : ""}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage+1)}>
        {">"}
      </button>
    </div>
    </>
  )
}

export default PaginatedTable