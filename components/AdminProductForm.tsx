"use client";

import { useState } from "react";

export default function AdminProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price,
        stock,
        category,
        image,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Product added successfully");
      window.location.reload();
    } else {
      alert("Product add failed");
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setImage(data.imageUrl);
    } else {
      alert("Image upload failed");
    }

    setUploading(false);
  };

  return (
    <form onSubmit={addProduct} className="grid gap-4">
      <input
        className="border p-3 rounded"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="border p-3 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        className="border p-3 rounded"
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        className="border p-3 rounded"
        placeholder="Stock"
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />

      <select
        className="border p-3 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="General">General</option>
        <option value="Home & Kitchen">Home & Kitchen</option>
        <option value="Fashion">Fashion</option>
        <option value="Electronics">Electronics</option>
        <option value="Books">Books</option>
        <option value="Sports">Sports</option>
      </select>

      <div
        className="border-2 border-dashed p-6 rounded text-center cursor-pointer bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) uploadImage(file);
        }}
      >
        <p className="font-semibold">Drag & Drop Product Image Here</p>
        <p className="text-sm text-gray-500">or choose file below</p>

        <input
          type="file"
          accept="image/*"
          className="mt-4"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />
      </div>

      {uploading && (
        <p className="text-blue-600 font-semibold">Uploading image...</p>
      )}

      <input
        className="border p-3 rounded"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />

      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-40 h-40 object-contain border rounded"
        />
      )}

      <button type="submit" className="bg-blue-600 text-white p-3 rounded">
        Add Product
      </button>
    </form>
  );
}