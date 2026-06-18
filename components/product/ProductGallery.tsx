"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProductGallery({
  images,
  title,
  onImageChange,
}: {
  images: string[];
  title: string;
  onImageChange?: (image: string) => void;
}) {
  const finalImages = useMemo(() => {
    return Array.from(new Set(images.filter(Boolean)));
  }, [images]);

  const [activeImage, setActiveImage] = useState(
    finalImages[0] || "/placeholder.png"
  );

  const [zoom, setZoom] = useState({
    show: false,
    x: 50,
    y: 50,
  });

  useEffect(() => {
    const first = finalImages[0] || "/placeholder.png";
    setActiveImage(first);
    onImageChange?.(first);
  }, [finalImages, onImageChange]);

  function selectImage(img: string) {
    setActiveImage(img);
    onImageChange?.(img);
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoom({
      show: true,
      x,
      y,
    });
  }

  return (
    <div className="relative rounded-xl bg-white p-2 shadow-sm sm:p-4">
      <div className="grid gap-3 sm:grid-cols-[76px_1fr]">
        <div className="flex gap-2 overflow-x-auto sm:max-h-[540px] sm:flex-col sm:overflow-y-auto">
          {finalImages.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onMouseEnter={() => selectImage(img)}
              onClick={() => selectImage(img)}
              className={`h-16 w-16 shrink-0 rounded-lg border bg-white p-1 sm:h-20 sm:w-20 ${
                activeImage === img
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-gray-200"
              }`}
            >
              <img
                src={img}
                alt=""
                className="h-full w-full object-contain"
              />
            </button>
          ))}

          <button
            type="button"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-gray-50 text-xs font-black text-gray-500 sm:h-20 sm:w-20"
          >
            ▶ Video
          </button>
        </div>

        <div
          onMouseMove={handleMove}
          onMouseEnter={() => setZoom((z) => ({ ...z, show: true }))}
          onMouseLeave={() => setZoom((z) => ({ ...z, show: false }))}
          className="relative flex min-h-[320px] cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border bg-white p-3 sm:min-h-[500px]"
        >
          <div className="absolute right-3 top-3 z-10 flex gap-2">
            <button className="rounded-full bg-white px-3 py-2 text-sm shadow">
              ♡
            </button>
            <button className="rounded-full bg-white px-3 py-2 text-sm shadow">
              ↗
            </button>
          </div>

          <img
            src={activeImage}
            alt={title}
            className="max-h-[320px] w-full object-contain sm:max-h-[500px]"
          />
        </div>
      </div>

      {zoom.show && (
        <div className="pointer-events-none absolute left-[calc(100%+14px)] top-4 z-50 hidden h-[520px] w-[520px] overflow-hidden rounded-xl border bg-white shadow-2xl xl:block">
          <div
            className="h-full w-full bg-no-repeat"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundSize: "220%",
              backgroundPosition: `${zoom.x}% ${zoom.y}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}