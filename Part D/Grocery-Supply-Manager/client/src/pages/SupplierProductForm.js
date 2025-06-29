export default function SupplierProductForm({ products, allProducts, onChange, onAdd, onRemove }) {
    const handleChange = (index, field, value) => {
      onChange(index, field, value);
    };
  
    return (
      <div>
        <h3>Add Products</h3>
        {products.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <select
              value={item.product}
              onChange={(e) => handleChange(index, 'product', e.target.value)}
              required
            >
              <option value="">Select Product</option>
              {allProducts.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
  
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleChange(index, 'price', e.target.value)}
              required
            />
  
            <input
              type="number"
              placeholder="Min Quantity"
              value={item.minQuantity}
              onChange={(e) => handleChange(index, 'minQuantity', e.target.value)}
              required
            />
  
            <button type="button" onClick={() => onRemove(index)}>Remove</button>
          </div>
        ))}
  
        <button type="button" onClick={onAdd}>Add Product</button>
      </div>
    );
  }
  