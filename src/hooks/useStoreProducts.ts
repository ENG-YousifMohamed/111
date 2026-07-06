'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/products';

export function useStoreProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Could not load products');
        }
        const data = (await response.json()) as Product[];
        if (isMounted) {
          setProducts(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load products');
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}
