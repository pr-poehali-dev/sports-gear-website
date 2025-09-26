import { useState, useMemo } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  brand: string;
  category: string;
  sizes: string[];
  colors: Array<{ name: string; value: string; available: boolean }>;
  images: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  isNew?: boolean;
  popularity?: number;
}

export interface FilterOptions {
  searchQuery: string;
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  brands: string[];
  inStock: boolean;
  sortBy: string;
}

const useProductFilters = (products: Product[]) => {
  // Calculate initial price range
  const initialPriceRange = useMemo(() => {
    if (products.length === 0) return [0, 100000] as [number, number];
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  }, [products]);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    categories: [],
    priceRange: initialPriceRange,
    sizes: [],
    colors: [],
    brands: [],
    inStock: false,
    sortBy: 'popular'
  });

  // Get available filter options
  const availableOptions = useMemo(() => {
    const categories = new Map<string, number>();
    const sizes = new Set<string>();
    const colors = new Map<string, string>();
    const brands = new Set<string>();

    products.forEach(product => {
      // Categories
      const categoryKey = product.category;
      const categoryName = getCategoryName(categoryKey);
      categories.set(categoryKey, (categories.get(categoryKey) || 0) + 1);

      // Sizes
      product.sizes.forEach(size => sizes.add(size));

      // Colors
      product.colors.forEach(color => {
        if (color.available) {
          colors.set(color.name, color.value);
        }
      });

      // Brands
      brands.add(product.brand);
    });

    return {
      categories: Array.from(categories.entries()).map(([id, count]) => ({
        id,
        name: getCategoryName(id),
        count
      })),
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors.entries()).map(([name, value]) => ({ name, value })),
      brands: Array.from(brands).sort()
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchText = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
        if (!searchText.includes(query)) return false;
      }

      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Price range
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Sizes
      if (filters.sizes.length > 0) {
        const hasMatchingSize = filters.sizes.some(size => product.sizes.includes(size));
        if (!hasMatchingSize) return false;
      }

      // Colors
      if (filters.colors.length > 0) {
        const hasMatchingColor = filters.colors.some(color => 
          product.colors.some(productColor => productColor.name === color && productColor.available)
        );
        if (!hasMatchingColor) return false;
      }

      // Brands
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Stock
      if (filters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }

    return filtered;
  }, [products, filters]);

  return {
    filters,
    setFilters,
    filteredProducts,
    availableOptions,
    priceRange: initialPriceRange,
    totalProducts: products.length,
    filteredProductsCount: filteredProducts.length
  };
};

// Helper function to get category display names
const getCategoryName = (categoryId: string): string => {
  const categoryNames: { [key: string]: string } = {
    'wushu-taolu': 'Ушу Таолу',
    'wushu-sanda': 'Ушу Саньда',
    'equipment': 'Инвентарь',
    'clothing': 'Одежда',
    'accessories': 'Аксессуары',
    'books': 'Литература',
    'protective': 'Защитная экипировка'
  };
  
  return categoryNames[categoryId] || categoryId;
};

export default useProductFilters;