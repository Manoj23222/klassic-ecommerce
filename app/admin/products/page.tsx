export default function ProductsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Product Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <form className="grid gap-4">
          <input
            type="text"
            placeholder="Product Name"
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Stock"
            className="border p-3 rounded"
          />

          <button
            className="bg-blue-600 text-white p-3 rounded"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Laptop</td>
              <td>₹59999</td>
              <td>10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}