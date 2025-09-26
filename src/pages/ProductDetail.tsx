import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import WushuSizeCalculator from '@/components/WushuSizeCalculator';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  brand: string;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  sizes: string[];
  colors: { name: string; value: string; available: boolean }[];
}

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeCalculator, setShowSizeCalculator] = useState(false);

  // Sample product data - можно расширить базой данных товаров
  const getProductData = (productId: string): Product => {
    const products = {
      '1': {
        id: 1,
        name: 'Профессиональные боксерские перчатки Pro Fighter',
        price: 4500,
        originalPrice: 5200,
        category: 'boxing',
        images: ['/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg', '/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg'],
        rating: 4.8,
        reviewsCount: 127,
        inStock: true,
        brand: 'ProFighter',
        description: 'Профессиональные боксерские перчатки для тренировок и соревнований.',
        features: ['Натуральная кожа', 'Многослойная амортизация', 'Анатомическая форма'],
        specifications: { 'Материал': 'Натуральная кожа', 'Вес': 'От 8 до 16 унций', 'Гарантия': '12 месяцев' },
        sizes: ['8 oz', '10 oz', '12 oz', '14 oz', '16 oz'],
        colors: [
          { name: 'Красный', value: '#DC2626', available: true },
          { name: 'Черный', value: '#1F2937', available: true }
        ]
      },
      '8': {
        id: 8,
        name: 'Меч Цзянь (прямой) для Ушу Таолу',
        price: 12500,
        originalPrice: 14000,
        category: 'wushu-taolu',
        images: ['/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg'],
        rating: 4.7,
        reviewsCount: 45,
        inStock: true,
        brand: 'Dragon Phoenix',
        description: 'Традиционный китайский меч для выполнения форм Таолу. Изготовлен из высокоуглеродистой стали с гибким лезвием.',
        features: [
          'Высокоуглеродистая сталь',
          'Гибкое лезвие для форм',
          'Традиционная рукоять с кистями',
          'Сертифицировано для соревнований',
          'Ручная ковка мастеров',
          'Аутентичный китайский дизайн'
        ],
        specifications: {
          'Материал лезвия': 'Высокоуглеродистая сталь',
          'Рукоять': 'Дерево с обмоткой',
          'Общая длина': '65-85см (в зависимости от роста)',
          'Вес': '450-650г',
          'Гибкость': 'Средняя-высокая',
          'Страна производства': 'Китай',
          'Гарантия': '24 месяца'
        },
        sizes: ['65см', '70см', '75см', '80см', '85см'],
        colors: [
          { name: 'Традиционный', value: '#C0C0C0', available: true },
          { name: 'Золотистый', value: '#FFD700', available: true }
        ]
      },
      '10': {
        id: 10,
        name: 'Шест Гунь 1.8м для Ушу Таолу',
        price: 3200,
        category: 'wushu-taolu',
        images: ['/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg'],
        rating: 4.6,
        reviewsCount: 38,
        inStock: true,
        brand: 'Shaolin Gear',
        description: 'Традиционный шест для выполнения форм с длинным оружием. Изготовлен из белого воскового дерева.',
        features: [
          'Белое восковое дерево',
          'Оптимальная гибкость',
          'Традиционная обработка',
          'Идеальный баланс',
          'Подходит для всех стилей',
          'Профессиональное качество'
        ],
        specifications: {
          'Материал': 'Белое восковое дерево',
          'Длина': '1.6м - 2.0м',
          'Диаметр': '2.4-2.8см',
          'Вес': '350-450г',
          'Обработка': 'Лакированная',
          'Страна производства': 'Китай',
          'Гарантия': '12 месяцев'
        },
        sizes: ['1.6м', '1.8м', '2.0м'],
        colors: [
          { name: 'Натуральное дерево', value: '#DEB887', available: true }
        ]
      },
      '13': {
        id: 13,
        name: 'Перчатки для Ушу Саньда',
        price: 3800,
        category: 'wushu-sanda',
        images: ['/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg'],
        rating: 4.7,
        reviewsCount: 63,
        inStock: true,
        brand: 'Fighting Dragon',
        description: 'Специализированные перчатки для спарринга в Саньда с открытыми пальцами для захватов.',
        features: [
          'Открытые пальцы для захватов',
          'Усиленная защита костяшек',
          'Кожаная поверхность',
          'Липучка на запястье',
          'Дышащая подкладка',
          'Сертификация IWUF'
        ],
        specifications: {
          'Материал': 'Натуральная кожа',
          'Наполнитель': 'Высокоплотная пена',
          'Вес': 'S: 4oz, M: 6oz, L: 8oz',
          'Застежка': 'Липучка',
          'Сертификация': 'IWUF approved',
          'Страна производства': 'Китай',
          'Гарантия': '18 месяцев'
        },
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Красный', value: '#DC2626', available: true },
          { name: 'Синий', value: '#2563EB', available: true },
          { name: 'Черный', value: '#1F2937', available: true }
        ]
      }
    };
    
    return products[productId as keyof typeof products] || products['1'];
  };

  const product = getProductData(id || '1');

  const reviews = [
    {
      id: 1,
      user: 'Александр К.',
      rating: 5,
      comment: 'Отличные перчатки! Очень удобные, качество на высоте. Уже полгода тренируюсь - никаких нареканий.',
      date: '15.09.2024'
    },
    {
      id: 2,
      user: 'Мария П.',
      rating: 4,
      comment: 'Хорошие перчатки, но размер маломерит. Советую брать на размер больше.',
      date: '08.09.2024'
    },
    {
      id: 3,
      user: 'Дмитрий В.',
      rating: 5,
      comment: 'Профессиональное качество по разумной цене. Рекомендую!',
      date: '02.09.2024'
    }
  ];

  const relatedProducts = [
    { id: 2, name: 'Боксерские бинты Pro', price: 800, image: '/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg', rating: 4.6 },
    { id: 3, name: 'Капа боксерская', price: 1200, image: '/img/5eb32cee-5128-49fc-b70f-2bd111b1f30b.jpg', rating: 4.4 },
    { id: 4, name: 'Боксерские шорты', price: 2800, image: '/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg', rating: 4.7 }
  ];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Пожалуйста, выберите размер и цвет');
      return;
    }
    console.log('Added to cart:', { product, selectedSize, selectedColor, quantity });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Icon name="Dumbbell" className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">SPORTS GEAR</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant="ghost" 
                className="text-foreground/80 hover:text-foreground"
                onClick={() => navigate('/')}
              >
                <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
                Назад к каталогу
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Icon name="Search" className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="User" className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Icon name="ShoppingCart" className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary">
                2
              </Badge>
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-foreground/70">
          <span>Главная</span>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <span>Бокс</span>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-muted aspect-square">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {product.originalPrice && (
                <Badge className="absolute top-4 left-4 bg-destructive">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative overflow-hidden rounded-lg aspect-square ${
                    selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
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

            {/* Size Selection */}
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
                    onClick={() => setShowSizeCalculator(!showSizeCalculator)}
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
                    onClick={() => setSelectedSize(size)}
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

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Цвет:</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => color.available && setSelectedColor(color.name)}
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

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Количество:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Icon name="Minus" className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Icon name="Plus" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
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

            {/* Quick Info */}
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
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Описание</TabsTrigger>
              <TabsTrigger value="specifications">Характеристики</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы ({product.reviewsCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-4">Особенности товара</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Icon name="Check" className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-xl mb-4">Технические характеристики</h3>
                  <div className="space-y-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
                        <span className="font-medium">{key}:</span>
                        <span className="text-foreground/80">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{review.user}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Icon
                                  key={i}
                                  name="Star"
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-foreground/70">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-foreground/80">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {product.price.toLocaleString()} ₽
                      </span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;