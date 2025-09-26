import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface FilterOptions {
  searchQuery: string;
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  brands: string[];
  inStock: boolean;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: Array<{ id: string; name: string; count: number }>;
  availableSizes: string[];
  availableColors: Array<{ name: string; value: string }>;
  availableBrands: string[];
  priceRange: [number, number];
  totalProducts: number;
  filteredProducts: number;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableSizes,
  availableColors,
  availableBrands,
  priceRange,
  totalProducts,
  filteredProducts
}) => {
  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      categories: [],
      priceRange: priceRange,
      sizes: [],
      colors: [],
      brands: [],
      inStock: false,
      sortBy: 'popular'
    });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.sizes.length + 
    filters.colors.length + 
    filters.brands.length + 
    (filters.inStock ? 1 : 0) +
    (filters.searchQuery ? 1 : 0) +
    (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1] ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Icon name="Search" className="mr-2 h-5 w-5" />
            Поиск товаров
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="Найти товар..."
              value={filters.searchQuery}
              onChange={(e) => updateFilters({ searchQuery: e.target.value })}
              className="pl-10"
            />
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Icon name="ArrowUpDown" className="mr-2 h-5 w-5" />
            Сортировка
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">По популярности</SelectItem>
              <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
              <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
              <SelectItem value="newest">Новинки</SelectItem>
              <SelectItem value="rating">По рейтингу</SelectItem>
              <SelectItem value="name">По названию</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-sm text-foreground/70">
        <span>Найдено: {filteredProducts} из {totalProducts}</span>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <Icon name="X" className="mr-1 h-3 w-3" />
            Сбросить ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Icon name="Grid3X3" className="mr-2 h-5 w-5" />
            Категории
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {availableCategories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({ categories: [...filters.categories, category.id] });
                    } else {
                      updateFilters({ categories: filters.categories.filter(c => c !== category.id) });
                    }
                  }}
                />
                <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                  {category.name}
                </Label>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Icon name="DollarSign" className="mr-2 h-5 w-5" />
            Цена
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={priceRange[1]}
              min={priceRange[0]}
              step={100}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-foreground/70">
              <span>{filters.priceRange[0].toLocaleString()} ₽</span>
              <span>{filters.priceRange[1].toLocaleString()} ₽</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Icon name="Ruler" className="mr-2 h-5 w-5" />
            Размеры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <Button
                key={size}
                variant={filters.sizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (filters.sizes.includes(size)) {
                    updateFilters({ sizes: filters.sizes.filter(s => s !== size) });
                  } else {
                    updateFilters({ sizes: [...filters.sizes, size] });
                  }
                }}
                className="h-8 px-3"
              >
                {size}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Icon name="Palette" className="mr-2 h-5 w-5" />
            Цвета
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => (
              <button
                key={color.name}
                onClick={() => {
                  if (filters.colors.includes(color.name)) {
                    updateFilters({ colors: filters.colors.filter(c => c !== color.name) });
                  } else {
                    updateFilters({ colors: [...filters.colors, color.name] });
                  }
                }}
                className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                  filters.colors.includes(color.name)
                    ? 'border-primary scale-110 ring-2 ring-primary/20'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {filters.colors.includes(color.name) && (
                  <Icon name="Check" className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Icon name="Award" className="mr-2 h-5 w-5" />
            Бренды
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {availableBrands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({ brands: [...filters.brands, brand] });
                    } else {
                      updateFilters({ brands: filters.brands.filter(b => b !== brand) });
                    }
                  }}
                />
                <Label htmlFor={brand} className="cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stock */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Icon name="Package" className="mr-2 h-5 w-5" />
            Наличие
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
            />
            <Label htmlFor="inStock" className="cursor-pointer">
              Только в наличии
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;