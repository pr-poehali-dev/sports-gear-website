import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import ProductFilters from '@/components/ProductFilters';
import useProductFilters, { Product as FilterProduct } from '@/hooks/useProductFilters';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
}

interface CartItem {
  id: number;
  quantity: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Все категории', icon: 'Grid3X3' },
    { id: 'boxing', name: 'Бокс', icon: 'Target' },
    { id: 'mma', name: 'MMA', icon: 'Zap' },
    { id: 'karate', name: 'Карате', icon: 'HandMetal' },
    { id: 'kickboxing', name: 'Кикбоксинг', icon: 'Flame' },
    { id: 'wushu-taolu', name: 'Ушу Таолу', icon: 'Sword' },
    { id: 'wushu-sanda', name: 'Ушу Саньда', icon: 'ShieldCheck' },
    { id: 'protection', name: 'Защита', icon: 'Shield' }
  ];

  const products: FilterProduct[] = [
    { id: '1', name: 'Боксерские перчатки Pro', price: 4500, category: 'boxing', image: '/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg', rating: 4.8, inStock: true, brand: 'Everlast', sizes: ['8oz', '10oz', '12oz', '14oz', '16oz'], colors: [{name: 'Красный', value: '#dc2626', available: true}, {name: 'Черный', value: '#000000', available: true}, {name: 'Синий', value: '#2563eb', available: true}], images: ['/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg'], reviewsCount: 124, description: 'Профессиональные боксерские перчатки для тренировок и соревнований', features: ['Натуральная кожа', 'Многослойная набивка', 'Анатомический крой'], specifications: {'Материал': 'Натуральная кожа', 'Застежка': 'Липучка', 'Назначение': 'Тренировки, соревнования'}, isNew: false, popularity: 95 },
    { id: '2', name: 'Перчатки для MMA', price: 3200, category: 'mma', image: '/img/5eb32cee-5128-49fc-b70f-2bd111b1f30b.jpg', rating: 4.6, inStock: true, brand: 'Venum', sizes: ['S', 'M', 'L', 'XL'], colors: [{name: 'Черный', value: '#000000', available: true}, {name: 'Белый', value: '#ffffff', available: true}], images: ['/img/5eb32cee-5128-49fc-b70f-2bd111b1f30b.jpg'], reviewsCount: 89, description: 'Перчатки для смешанных единоборств с открытыми пальцами', features: ['Синтетическая кожа', 'Гелевая защита', 'Открытые пальцы'], specifications: {'Материал': 'Синтетическая кожа', 'Застежка': 'Липучка', 'Вес': '150г'}, isNew: true, popularity: 87 },
    { id: '3', name: 'Кимоно для карате', price: 6800, category: 'karate', image: '/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg', rating: 4.9, inStock: true, brand: 'Adidas', sizes: ['140', '150', '160', '170', '180', '190'], colors: [{name: 'Белый', value: '#ffffff', available: true}], images: ['/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg'], reviewsCount: 156, description: 'Традиционное кимоно для карате из хлопка высокого качества', features: ['100% хлопок', 'Укрепленные швы', 'Пояс в комплекте'], specifications: {'Материал': '100% хлопок', 'Плотность': '12 унций', 'Комплектация': 'Куртка, штаны, пояс'}, isNew: false, popularity: 92 },
    { id: '4', name: 'Защитные щитки', price: 2100, category: 'protection', image: '/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg', rating: 4.5, inStock: true, brand: 'TopTen', sizes: ['S', 'M', 'L'], colors: [{name: 'Синий', value: '#2563eb', available: true}, {name: 'Красный', value: '#dc2626', available: true}], images: ['/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg'], reviewsCount: 67, description: 'Защитные щитки для голени и стопы', features: ['Легкий вес', 'Удобная фиксация', 'Эластичные ремни'], specifications: {'Материал': 'Полиуретан', 'Вес': '400г', 'Защита': 'Голень и стопа'}, isNew: false, popularity: 74 },
    { id: '5', name: 'Боксерские бинты', price: 800, category: 'boxing', image: '/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg', rating: 4.7, inStock: false, brand: 'Twins', sizes: ['3.5м', '4.5м'], colors: [{name: 'Черный', value: '#000000', available: true}, {name: 'Красный', value: '#dc2626', available: false}], images: ['/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg'], reviewsCount: 234, description: 'Эластичные боксерские бинты для защиты рук', features: ['100% хлопок', 'Эластичная вставка', 'Липучка-застежка'], specifications: {'Материал': '100% хлопок', 'Длина': '4.5 метра', 'Ширина': '5 см'}, isNew: false, popularity: 98 },
    { id: '6', name: 'Шлем защитный', price: 5500, category: 'protection', image: '/img/5eb32cee-5128-49fc-b70f-2bd111b1f30b.jpg', rating: 4.4, inStock: true, brand: 'Winning', sizes: ['S', 'M', 'L', 'XL'], colors: [{name: 'Черный', value: '#000000', available: true}, {name: 'Красный', value: '#dc2626', available: true}], images: ['/img/5eb32cee-5128-49fc-b70f-2bd111b1f30b.jpg'], reviewsCount: 45, description: 'Защитный шлем для спаррингов', features: ['Открытый верх', 'Защита подбородка', 'Вентиляционные отверстия'], specifications: {'Материал': 'Натуральная кожа', 'Защита': 'Лицо, подбородок', 'Вентиляция': 'Есть'}, isNew: false, popularity: 81 },
    
    // Ушу Таолу - традиционные формы и оружие
    { id: '7', name: 'Костюм для Ушу Таолу', price: 8900, category: 'wushu-taolu', image: '/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg', rating: 4.9, inStock: true, brand: 'Red Dragon', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: [{name: 'Золотой', value: '#fbbf24', available: true}, {name: 'Красный', value: '#dc2626', available: true}, {name: 'Синий', value: '#2563eb', available: true}], images: ['/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg'], reviewsCount: 78, description: 'Традиционный костюм для выступлений Ушу Таолу', features: ['Шелковистая ткань', 'Вышивка дракона', 'Эластичный пояс'], specifications: {'Материал': 'Полиэстер-сатин', 'Покрой': 'Традиционный', 'Уход': 'Ручная стирка'}, isNew: true, popularity: 85 },
    { id: '8', name: 'Меч Цзянь (прямой)', price: 12500, category: 'wushu-taolu', image: '/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg', rating: 4.7, inStock: true, brand: 'Dynasty Forge', sizes: ['75см', '80см', '85см', '90см', '95см'], colors: [{name: 'Серебристый', value: '#6b7280', available: true}], images: ['/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg'], reviewsCount: 34, description: 'Традиционный прямой меч Цзянь для Ушу', features: ['Углеродистая сталь', 'Традиционная рукоять', 'Сбалансированный'], specifications: {'Материал клинка': 'Углеродистая сталь', 'Длина клинка': '75-95см', 'Вес': '500-700г'}, isNew: false, popularity: 65 },
    { id: '9', name: 'Сабля Дао (изогнутая)', price: 11800, category: 'wushu-taolu', image: '/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg', rating: 4.8, inStock: true, brand: 'Dynasty Forge', sizes: ['75см', '80см', '85см', '90см'], colors: [{name: 'Серебристый', value: '#6b7280', available: true}], images: ['/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg'], reviewsCount: 29, description: 'Традиционная изогнутая сабля Дао для Ушу', features: ['Высокоуглеродистая сталь', 'Эргономичная рукоять', 'Изогнутый клинок'], specifications: {'Материал клинка': 'Высокоуглеродистая сталь', 'Изгиб': 'Традиционный', 'Баланс': 'Центральный'}, isNew: false, popularity: 58 },
    { id: '10', name: 'Шест Гунь 1.8м', price: 3200, category: 'wushu-taolu', image: '/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg', rating: 4.6, inStock: true, brand: 'Bamboo Master', sizes: ['1.6м', '1.8м', '2.0м', '2.2м'], colors: [{name: 'Натуральный', value: '#d97706', available: true}], images: ['/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg'], reviewsCount: 56, description: 'Деревянный шест Гунь для тренировок Ушу', features: ['Белый дуб', 'Гладкая поверхность', 'Сбалансированный'], specifications: {'Материал': 'Белый дуб', 'Диаметр': '3см', 'Обработка': 'Лакированный'}, isNew: false, popularity: 72 },
    { id: '11', name: 'Копье Цян 2.6м', price: 4800, category: 'wushu-taolu', image: '/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg', rating: 4.5, inStock: false, brand: 'Bamboo Master', sizes: ['2.4м', '2.6м', '2.8м'], colors: [{name: 'Натуральный', value: '#d97706', available: true}], images: ['/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg'], reviewsCount: 23, description: 'Копье Цян с металлическим наконечником', features: ['Древко из дуба', 'Стальной наконечник', 'Кисточка в комплекте'], specifications: {'Материал древка': 'Белый дуб', 'Наконечник': 'Нержавеющая сталь', 'Длина наконечника': '25см'}, isNew: true, popularity: 41 },
    { id: '12', name: 'Обувь для Ушу', price: 2800, category: 'wushu-taolu', image: '/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg', rating: 4.4, inStock: true, brand: 'Feiyue', sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], colors: [{name: 'Черный', value: '#000000', available: true}, {name: 'Белый', value: '#ffffff', available: true}], images: ['/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg'], reviewsCount: 167, description: 'Традиционная обувь для Ушу с тонкой подошвой', features: ['Тонкая подошва', 'Дышащий материал', 'Надежная фиксация'], specifications: {'Материал верха': 'Хлопок', 'Подошва': 'Резина', 'Высота': 'Низкие'}, isNew: false, popularity: 89 },
    
    // Ушу Саньда - спарринговое снаряжение
    { id: '13', name: 'Перчатки Саньда', price: 3800, category: 'wushu-sanda', image: '/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg', rating: 4.7, inStock: true, brand: 'TopTen', sizes: ['S', 'M', 'L', 'XL'], colors: [{name: 'Красный', value: '#dc2626', available: true}, {name: 'Синий', value: '#2563eb', available: true}], images: ['/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg'], reviewsCount: 91, description: 'Перчатки для Саньда с защитой пальцев', features: ['Открытые пальцы', 'Защита костяшек', 'Липучка'], specifications: {'Материал': 'Синтетическая кожа', 'Набивка': 'Пена высокой плотности', 'Вес': '180г'}, isNew: false, popularity: 76 },
    { id: '14', name: 'Шлем для Саньда', price: 4200, category: 'wushu-sanda', image: '/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg', rating: 4.6, inStock: true, brand: 'TopTen', sizes: ['S', 'M', 'L', 'XL'], colors: [{name: 'Красный', value: '#dc2626', available: true}, {name: 'Синий', value: '#2563eb', available: true}], images: ['/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg'], reviewsCount: 54, description: 'Защитный шлем для Саньда с маской', features: ['Защитная маска', 'Вентиляция', 'Регулируемые ремни'], specifications: {'Материал': 'ПУ кожа', 'Защита': 'Голова, лицо', 'Вентиляция': '8 отверстий'}, isNew: false, popularity: 68 },
    { id: '15', name: 'Защита голени Саньда', price: 2900, category: 'wushu-sanda', image: '/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg', rating: 4.8, inStock: true, brand: 'TopTen', sizes: ['S', 'M', 'L', 'XL'], colors: [{name: 'Красный', value: '#dc2626', available: true}, {name: 'Синий', value: '#2563eb', available: true}], images: ['/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg'], reviewsCount: 112, description: 'Защитные щитки для голени в Саньда', features: ['Анатомическая форма', 'Легкий вес', 'Эластичные ремни'], specifications: {'Материал': 'ПВХ', 'Крепление': 'Эластичные ремни', 'Вес': '350г'}, isNew: false, popularity: 84 },
    { id: '16', name: 'Жилет защитный Саньда', price: 6800, category: 'wushu-sanda', image: '/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg', rating: 4.5, inStock: true, brand: 'TopTen', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [{name: 'Красный', value: '#dc2626', available: true}, {name: 'Синий', value: '#2563eb', available: true}], images: ['/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg'], reviewsCount: 43, description: 'Защитный жилет для корпуса в Саньда', features: ['Защита корпуса', 'Дышащий материал', 'Регулируемые ремни'], specifications: {'Материал': 'ПУ кожа', 'Защита': 'Грудь, живот, спина', 'Крепление': 'Липучки'}, isNew: true, popularity: 52 },
    { id: '17', name: 'Шорты для Саньда', price: 2200, category: 'wushu-sanda', image: '/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg', rating: 4.3, inStock: true, brand: 'TopTen', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: [{name: 'Красный', value: '#dc2626', available: true}, {name: 'Синий', value: '#2563eb', available: true}, {name: 'Черный', value: '#000000', available: true}], images: ['/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg'], reviewsCount: 78, description: 'Шорты для тренировок Саньда', features: ['Эластичная ткань', 'Боковые разрезы', 'Быстрое высыхание'], specifications: {'Материал': 'Полиэстер', 'Крой': 'Свободный', 'Длина': 'Выше колена'}, isNew: false, popularity: 71 },
    { id: '18', name: 'Защита паха Саньда', price: 1800, category: 'wushu-sanda', image: '/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg', rating: 4.4, inStock: true, brand: 'TopTen', sizes: ['S', 'M', 'L'], colors: [{name: 'Белый', value: '#ffffff', available: true}], images: ['/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg'], reviewsCount: 67, description: 'Защита паха для мужчин в Саньда', features: ['Анатомическая чашка', 'Эластичный пояс', 'Дышащая ткань'], specifications: {'Материал чашки': 'Полипропилен', 'Пояс': 'Эластичный', 'Размер чашки': 'Стандартный'}, isNew: false, popularity: 63 }
  ];

  // Initialize filters hook
  const {
    filters,
    setFilters,
    filteredProducts: allFilteredProducts,
    availableOptions,
    priceRange,
    totalProducts,
    filteredProductsCount
  } = useProductFilters(products);

  // Apply category filter and quick search
  const filteredProducts = allFilteredProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesQuickSearch = !quickSearchQuery || 
      product.name.toLowerCase().includes(quickSearchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(quickSearchQuery.toLowerCase());
    return matchesCategory && matchesQuickSearch;
  });

  const addToCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: productId, quantity: 1 }];
    });
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

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
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Каталог</a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Бренды</a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Акции</a>
              <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Контакты</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-foreground/70">
              <Icon name="Phone" className="h-4 w-4" />
              <span>+7 (800) 123-45-67</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Input
                  placeholder="Быстрый поиск..."
                  value={quickSearchQuery}
                  onChange={(e) => setQuickSearchQuery(e.target.value)}
                  className="w-64 pl-10"
                />
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-primary/10' : ''}
              >
                <Icon name="Filter" className="h-5 w-5" />
                Фильтры
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <Icon name="User" className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Icon name="ShoppingCart" className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-secondary to-secondary/80 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Профессиональная экипировка для единоборств
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Качественное снаряжение от ведущих брендов для всех видов боевых искусств
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Icon name="ShoppingBag" className="mr-2 h-5 w-5" />
                Перейти к покупкам
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
                <Icon name="Play" className="mr-2 h-5 w-5" />
                Смотреть каталог
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Категории товаров</h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Выберите категорию экипировки для вашего вида единоборств
          </p>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableCategories={availableOptions.categories}
                availableSizes={availableOptions.sizes}
                availableColors={availableOptions.colors}
                availableBrands={availableOptions.brands}
                priceRange={priceRange}
                totalProducts={totalProducts}
                filteredProducts={filteredProductsCount}
              />
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allFilteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] animate-fade-in"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {!product.inStock && (
                          <Badge className="absolute top-3 left-3 bg-destructive">
                            Нет в наличии
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge className="absolute top-3 left-3 bg-green-600">
                            Новинка
                          </Badge>
                        )}
                        <Badge className="absolute top-3 right-3 bg-accent">
                          ★ {product.rating}
                        </Badge>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary">
                            {product.price.toLocaleString()} ₽
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {product.brand}
                          </Badge>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id);
                          }}
                          disabled={!product.inStock}
                        >
                          <Icon name="Plus" className="mr-2 h-4 w-4" />
                          {product.inStock ? 'В корзину' : 'Недоступно'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                selectedCategory === category.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  selectedCategory === category.id ? 'bg-primary text-white' : 'bg-muted text-foreground'
                }`}>
                  <Icon name={category.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Sort */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            {selectedCategory === 'all' ? 'Все товары' : categories.find(cat => cat.id === selectedCategory)?.name} 
            <span className="text-foreground/60 ml-2">({filteredProducts.length})</span>
          </h3>
          <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
            <SelectTrigger className="w-48">
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
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] animate-fade-in"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {!product.inStock && (
                    <Badge className="absolute top-3 left-3 bg-destructive">
                      Нет в наличии
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="absolute top-3 left-3 bg-green-600">
                      Новинка
                    </Badge>
                  )}
                  <Badge className="absolute top-3 right-3 bg-accent">
                    ★ {product.rating}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-sm text-foreground/60 mb-2">{product.brand}</div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {categories.find(cat => cat.id === product.category)?.name}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                    disabled={!product.inStock}
                  >
                    <Icon name="Plus" className="mr-2 h-4 w-4" />
                    {product.inStock ? 'В корзину' : 'Недоступно'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Truck" className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
              <p className="text-foreground/70">Доставка по всей России от 1-3 дней</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Гарантия качества</h3>
              <p className="text-foreground/70">Только оригинальные товары от брендов</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Headphones" className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Поддержка 24/7</h3>
              <p className="text-foreground/70">Консультации по выбору экипировки</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="RefreshCw" className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Легкий возврат</h3>
              <p className="text-foreground/70">14 дней на возврат без вопросов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Dumbbell" className="h-6 w-6" />
                <span className="text-xl font-bold">SPORTS GEAR</span>
              </div>
              <p className="text-white/80 mb-4">
                Профессиональная экипировка для единоборств и боевых искусств
              </p>
              <div className="flex space-x-4">
                <Icon name="Instagram" className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                <Icon name="Facebook" className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                <Icon name="Youtube" className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Бокс</a></li>
                <li><a href="#" className="hover:text-white transition-colors">MMA</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Карате</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Кикбоксинг</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Доставка и оплата</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Возврат товара</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Гарантия</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-white/80">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" className="h-4 w-4" />
                  <span>+7 (800) 123-45-67</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" className="h-4 w-4" />
                  <span>info@sportsgear.ru</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" className="h-4 w-4" />
                  <span>Москва, ул. Спортивная, 1</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Sports Gear Store. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;