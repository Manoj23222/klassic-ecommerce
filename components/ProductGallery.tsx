"use client";

import { useState } from "react";

export default function ProductGallery({
  mainImage,
  galleryImages,
}: {
  mainImage: string;
  galleryImages: string[];
}) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  const allImages = [
    mainImage,
    ...galleryImages.filter((img) => img !== mainImage),
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-3 overflow-auto">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`border-2 rounded-xl overflow-hidden bg-white ${
              selectedImage === img
                ? "border-blue-600"
                : "border-gray-200"
            }`}
          >
            <img
              src={img}
              alt=""
              className="w-20 h-20 object-contain"
            />
          </button>
        ))}
      </div>

      <div className="flex-1 border rounded-2xl bg-white p-6 flex items-center justify-center">
        <img
          src={selectedImage}
          alt="Product"
          className="max-h-[500px] w-full object-contain"
        />
      </div>
    </div>
  );
}