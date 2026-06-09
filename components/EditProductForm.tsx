"use client";

import { useState } from "react";

export default function EditProductForm({ product }: { product: any }) {
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [stock, setStock] = useState(product.stock || "");
  const [category, setCategory] = useState(product.category || "General");
  const [featured, setFeatured] = useState(
    product.featured === 1 || product.featured === true
  );
  const [image, setImage] = useState(product.image || "");
  const [galleryImages, setGalleryImages] = useState(
  product.gallery_images || ""
);
const [colors, setColors] = useState(product.colors || "");
const [sizes, setSizes] = useState(product.sizes || "");
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) setImage(data.imageUrl);
    else alert("Image upload failed");

    setUploading(false);
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/admin/update-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: product.id,
        name,
        description,
        price,
        stock,
        category,
        image,
        featured,
        gallery_images: galleryImages,
        colors,
sizes,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Product updated successfully");
      window.location.href = "/admin/product";
    } else {
      alert("Update failed");
    }
  };

  return (
    <form onSubmit={updateProduct} className="grid gap-5">
      <input
        className="border p-3 rounded-lg"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="border p-3 rounded-lg"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        className="border p-3 rounded-lg"
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <input
        className="border p-3 rounded-lg"
        placeholder="Stock"
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />

      <select
        className="border p-3 rounded-lg"
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

      <label className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-lg cursor-pointer">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-5 h-5"
        />
        <span className="font-semibold">⭐ Featured Product</span>
      </label>

      <div
        className="border-2 border-dashed p-8 rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) uploadImage(file);
        }}
      >
        <p className="font-semibold">Drag & Drop Product Image Here</p>
        <p className="text-sm text-gray-500 mb-3">or choose file below</p>

        <input
          type="file"
          accept="image/*"
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
        className="border p-3 rounded-lg"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />

      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-40 h-40 object-contain border rounded-lg bg-white p-2"
        />
      )}
<textarea
  className="border p-3 rounded-lg"
  placeholder="Gallery Images URLs comma separated"
  rows={4}
  value={galleryImages}
  onChange={(e) => setGalleryImages(e.target.value)}
/>
<input
  className="border p-3 rounded-lg"
  placeholder="Colors comma separated e.g. Black, Brown, Blue"
  value={colors}
  onChange={(e) => setColors(e.target.value)}
/>

<input
  className="border p-3 rounded-lg"
  placeholder="Sizes comma separated e.g. S, M, L, XL"
  value={sizes}
  onChange={(e) => setSizes(e.target.value)}
/>

{galleryImages && (
  <div className="flex gap-3 flex-wrap">
    {galleryImages.split(",").map((img: string, index: number) => (
      <img
        key={index}
        src={img.trim()}
        alt={`Gallery ${index}`}
        className="w-24 h-24 object-contain border rounded-lg bg-white p-2"
      />
    ))}
  </div>
)}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
      >
        Update Product
      </button>
    </form>
  );
}