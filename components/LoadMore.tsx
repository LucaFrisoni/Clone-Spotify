"use client";
// Loads the next page when the end of a list scrolls close to the screen.

import React, { useEffect, useRef } from "react";

interface LoadMoreProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

const LoadMore: React.FC<LoadMoreProps> = ({ hasMore, isLoading, onLoadMore }) => {
  const sentinel = useRef<HTMLDivElement>(null);

  //Se vuelve a observar al terminar cada carga, por si el final sigue a la vista
  useEffect(() => {
    const node = sentinel.current;
    if (!node || !hasMore || isLoading) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onLoadMore(),
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) {
    return null;
  }

  return (
    <div ref={sentinel} className="col-span-full flex justify-center py-6" aria-label="Loading more songs">
      {isLoading && (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-600 border-t-green-500" />
      )}
    </div>
  );
};

export default LoadMore;
