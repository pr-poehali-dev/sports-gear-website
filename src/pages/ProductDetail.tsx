import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import ProductHeader from '@/components/product/ProductHeader';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import RelatedProducts from '@/components/product/RelatedProducts';

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
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeCalculator, setShowSizeCalculator] = useState(false);

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
      <ProductHeader />

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
          <ProductImageGallery
            images={product.images}
            name={product.name}
            selectedImageIndex={selectedImageIndex}
            onSelectImage={setSelectedImageIndex}
            originalPrice={product.originalPrice}
            price={product.price}
          />

          <ProductInfo
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            showSizeCalculator={showSizeCalculator}
            onSelectSize={setSelectedSize}
            onSelectColor={setSelectedColor}
            onQuantityChange={setQuantity}
            onToggleSizeCalculator={() => setShowSizeCalculator(!showSizeCalculator)}
            onAddToCart={handleAddToCart}
          />
        </div>

        <ProductTabs product={product} reviews={reviews} />

        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetail;
