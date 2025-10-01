import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import WushuSizeCalculator from '@/components/WushuSizeCalculator';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  brand: string;
  description: string;
  sizes: string[];
  colors: { name: string; value: string; available: boolean }[];
}

interface ProductInfoProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  showSizeCalculator: boolean;
  onSelectSize: (size: string) => void;
  onSelectColor: (color: string) => void;
  onQuantityChange: (quantity: number) => void;
  onToggleSizeCalculator: () => void;
  onAddToCart: () => void;
}

const ProductInfo = ({
  product,
  selectedSize,
  selectedColor,
  quantity,
  showSizeCalculator,
  onSelectSize,
  onSelectColor,
  onQuantityChange,
  onToggleSizeCalculator,
  onAddToCart
}: ProductInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="outline">{product.brand}</Badge>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name="Star"
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-foreground/70 ml-2">
              {product.rating} ({product.reviewsCount} отзывов)
            </span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-3xl font-bold text-primary">
            {product.price.toLocaleString()} ₽
          </span>
          {product.originalPrice && (
            <span className="text-xl text-foreground/50 line-through">
              {product.originalPrice.toLocaleString()} ₽
            </span>
          )}
          {product.inStock ? (
            <Badge className="bg-accent">В наличии</Badge>
          ) : (
            <Badge variant="destructive">Нет в наличии</Badge>
          )}
        </div>
        
        <p className="text-foreground/80 leading-relaxed">{product.description}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Размер:</h3>
          {(product.category === 'wushu-taolu' && ['sword', 'staff', 'spear'].some(type => 
            product.name.toLowerCase().includes(type) || 
            product.name.includes('меч') || 
            product.name.includes('шест') || 
            product.name.includes('копье')
          )) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleSizeCalculator}
              className="text-xs"
            >
              <Icon name="Calculator" className="mr-1 h-3 w-3" />
              Калькулятор размера
            </Button>
          )}
        </div>
        
        {showSizeCalculator && product.category === 'wushu-taolu' && (
          <div className="mb-4 p-4 border rounded-lg bg-muted/20">
            <WushuSizeCalculator 
              weaponType={
                product.name.includes('меч') || product.name.toLowerCase().includes('sword') ? 'sword' :
                product.name.includes('шест') || product.name.toLowerCase().includes('staff') ? 'staff' :
                product.name.includes('копье') || product.name.toLowerCase().includes('spear') ? 'spear' : 'sword'
              }
              onSizeRecommended={(recommendation) => {
                console.log('Recommended:', recommendation);
              }}
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              onClick={() => onSelectSize(size)}
              className="min-w-[60px]"
            >
              {size}
            </Button>
          ))}
        </div>
        
        {product.category === 'wushu-taolu' && (
          <p className="text-xs text-foreground/60 mt-2">
            <Icon name="Info" className="inline h-3 w-3 mr-1" />
            Для традиционного оружия Ушу размер критически важен для правильной техники
          </p>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-3">Цвет:</h3>
        <div className="flex flex-wrap gap-3">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => color.available && onSelectColor(color.name)}
              disabled={!color.available}
              className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor === color.name
                  ? 'border-primary scale-110'
                  : 'border-gray-300'
              } ${!color.available ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {!color.available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-400 rotate-45"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Количество:</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            >
              <Icon name="Minus" className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              <Icon name="Plus" className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={onAddToCart}
            disabled={!product.inStock}
          >
            <Icon name="ShoppingCart" className="mr-2 h-5 w-5" />
            Добавить в корзину
          </Button>
          <Button variant="outline" size="lg">
            <Icon name="Heart" className="mr-2 h-5 w-5" />
            В избранное
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Truck" className="h-4 w-4 text-foreground/70" />
            <span>Доставка 1-3 дня</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" className="h-4 w-4 text-foreground/70" />
            <span>Гарантия 12 месяцев</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" className="h-4 w-4 text-foreground/70" />
            <span>Возврат 14 дней</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Award" className="h-4 w-4 text-foreground/70" />
            <span>Сертифицировано</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
