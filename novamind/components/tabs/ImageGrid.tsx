'use client';

import { useState } from 'react';
import type { ImageResult } from '@/types/search';
import { ExternalLink, X } from 'lucide-react';

interface ImageGridProps {
  images: ImageResult[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);

  if (!images.length) {
    return (
      <div className="py-12 text-center text-zinc-500">
        No images found.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="image-grid">
        {images.map(image => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="group block relative w-full h-48 rounded-xl overflow-hidden bg-zinc-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.thumbnailUrl || image.url}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <span className="text-white text-xs font-medium truncate">{image.sourceDomain}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-zinc-950 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors md:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image container */}
            <div className="relative flex-1 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center min-h-[50vh] md:min-h-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] md:max-h-[90vh] object-contain"
              />
            </div>

            {/* Sidebar details */}
            <div className="w-full md:w-80 p-6 flex flex-col shrink-0 bg-white dark:bg-zinc-950 relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-500 hover:bg-zinc-100 transition-colors hidden md:block dark:hover:bg-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md dark:bg-zinc-900 dark:text-zinc-400">
                  {selectedImage.sourceDomain}
                </span>
                {selectedImage.width && selectedImage.height && (
                  <span className="text-xs text-zinc-500">
                    {selectedImage.width} × {selectedImage.height}
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6 leading-snug">
                {selectedImage.title}
              </h3>
              
              <a
                href={selectedImage.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Visit related page
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
