"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  imageUrl: string;
  productName: string;
};

const galleryItems = [0, 1, 2, 3];

export function ProductGallery({ imageUrl, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const previousImage = () => {
    setActiveIndex((current) => (current === 0 ? galleryItems.length - 1 : current - 1));
  };

  const nextImage = () => {
    setActiveIndex((current) => (current === galleryItems.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="grid gap-4 md:grid-cols-[70px_1fr] xl:grid-cols-[86px_1fr]">
      <div className="hidden content-start gap-3 md:grid">
        {galleryItems.map((item) => (
          <button key={item} className={activeIndex === item ? "relative h-20 overflow-hidden rounded-md border-2 border-terracotta bg-white xl:h-24" : "relative h-20 overflow-hidden rounded-md bg-white/70 xl:h-24"} type="button" onClick={() => setActiveIndex(item)} aria-label={`Ver imagen ${item + 1}`}>
            <Image className="object-cover" src={imageUrl} alt={productName} fill sizes="(min-width: 1280px) 86px, 70px" />
          </button>
        ))}
      </div>

      <div className="relative h-[430px] overflow-hidden rounded-md bg-sand md:h-[500px] xl:h-[560px]">
        <Image key={activeIndex} className="object-cover animate-[galleryFade_260ms_ease-out]" src={imageUrl} alt={productName} fill priority sizes="(min-width: 1280px) 58vw, (min-width: 768px) calc(100vw - 430px), 100vw" />
        <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center justify-between">
          <button className="grid size-11 place-items-center rounded-full bg-white/85 text-ink transition hover:bg-white" type="button" onClick={previousImage} aria-label="Imagen anterior">
            <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="grid size-11 place-items-center rounded-full bg-white/85 text-ink transition hover:bg-white" type="button" onClick={nextImage} aria-label="Imagen siguiente">
            <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
