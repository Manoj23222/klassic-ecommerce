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

  const allImages = [mainImage, ...galleryImages];

  return (
    <div>
      <div className="border rounded-xl p-6 bg-white flex items-center justify-center">
        <img
          src={selectedImage}
          alt="Product"
          className="w-full h-[480px] object-contain"
        />
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        {allImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumb ${index}`}
            onClick={() => setSelectedImage(img)}
            className="w-20 h-20 object-cover border rounded-lg cursor-pointer hover:border-blue-600"
          />
        ))}
      </div>
    </div>
  );
}