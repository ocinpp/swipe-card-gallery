import React, { useState, useEffect } from "react";

// Create a promise that resolves when the image is loaded
const preloadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = reject;
  });
};

// Extract all image URLs from cards
const getImageUrls = (cards: any[]) => {
  return cards
    .filter((card) => card.type === "image")
    .map((card) => card.content);
};

// Component that handles image preloading
const ImagePreloader = ({
  cards,
  children,
}: {
  cards: any[];
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const imageUrls = getImageUrls(cards);

    Promise.all(imageUrls.map(preloadImage))
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load images:", error);
        setIsLoading(false); // Show content even if some images fail to load
      });
  }, [cards]);

  if (isLoading) {
    return (
      <div className="h-dvh bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ImagePreloader;
