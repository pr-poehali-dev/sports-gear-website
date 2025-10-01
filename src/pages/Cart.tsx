import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  brand: string;
  inStock: boolean;
}

interface CartItem {
  id: string;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const products: Product[] = [
    { id: '1', name: 'Боксерские перчатки Pro', price: 4500, category: 'boxing', image: '/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg', brand: 'Everlast', inStock: true },
    { id: '2', name: 'Перчатки для MMA', price: 3200, category: 'mma', image: '/img/5eb32cee-5128-49fc-b70f-2bd111b1f30b.jpg', brand: 'Venum', inStock: true },
    { id: '3', name: 'Кимоно для карате', price: 6800, category: 'karate', image: '/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg', brand: 'Adidas', inStock: true },
    { id: '4', name: 'Защитные щитки', price: 2100, category: 'protection', image: '/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg', brand: 'TopTen', inStock: true },
    { id: '5', name: 'Боксерские бинты', price: 800, category: 'boxing', image: '/img/9afcfeb9-8fb4-4a74-9f72-8d0ff4c91190.jpg', brand: 'Twins', inStock: false },
    { id: '6', name: 'Шлем защитный', price: 5500, category: 'protection', image: '/img/5eb32cee-5128-49fc-b70f-2bd111b1f30b.jpg', brand: 'Winning', inStock: true },
    { id: '7', name: 'Костюм для Ушу Таолу', price: 8900, category: 'wushu-taolu', image: '/img/af2caae0-6a55-4978-8898-fc71a6dea34f.jpg', brand: 'Red Dragon', inStock: true },
    { id: '13', name: 'Перчатки Саньда', price: 3800, category: 'wushu-sanda', image: '/img/5f228d1a-93b8-4aff-b914-ab546ee337a8.jpg', brand: 'TopTen', inStock: true },
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoDiscount(0);
  };

  const applyPromoCode = () => {
    const validPromoCodes: { [key: string]: number } = {
      'SPORT10': 10,
      'FIGHTER20': 20,
      'WUSHU15': 15,
      'НАЧАЛО': 5,
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(promoCode.toUpperCase());
      setPromoDiscount(validPromoCodes[promoCode.toUpperCase()]);
      setPromoCode('');
    } else {
      alert('Промокод не найден');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
  };

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return product ? { ...product, quantity: item.quantity } : null;
  }).filter(Boolean) as (Product & { quantity: number })[];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * promoDiscount) / 100;
  const delivery = subtotal > 5000 ? 0 : 500;
  const total = subtotal - discount + delivery;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Icon name="Dumbbell" className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">SPORTS GEAR</span>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Вернуться в магазин
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="ShoppingCart" className="h-16 w-16 text-foreground/40" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
            <p className="text-foreground/70 text-lg mb-8">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Button size="lg" onClick={() => navigate('/')}>
              <Icon name="ShoppingBag" className="mr-2 h-5 w-5" />
              Перейти к покупкам
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <Icon name="Dumbbell" className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SPORTS GEAR</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Продолжить покупки
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Корзина ({cartItems.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div 
                      className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 
                            className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer"
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            {item.name}
                          </h3>
                          <p className="text-sm text-foreground/60">{item.brand}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Icon name="X" className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Icon name="Minus" className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {(item.price * item.quantity).toLocaleString()} ₽
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-foreground/60">
                              {item.price.toLocaleString()} ₽ × {item.quantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={clearCart}
            >
              <Icon name="Trash2" className="mr-2 h-4 w-4" />
              Очистить корзину
            </Button>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Итого</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span>Товары ({cartItems.length})</span>
                    <span>{subtotal.toLocaleString()} ₽</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center">
                        <Icon name="Tag" className="h-4 w-4 mr-1" />
                        Скидка {promoDiscount}%
                      </span>
                      <div className="flex items-center">
                        <span>-{discount.toLocaleString()} ₽</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removePromoCode}
                          className="ml-2 h-6 w-6 p-0"
                        >
                          <Icon name="X" className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span className={delivery === 0 ? 'text-green-600' : ''}>
                      {delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}
                    </span>
                  </div>

                  {subtotal < 5000 && (
                    <p className="text-sm text-foreground/60">
                      Бесплатная доставка от 5000 ₽
                    </p>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between text-2xl font-bold mb-6">
                  <span>К оплате</span>
                  <span className="text-primary">{total.toLocaleString()} ₽</span>
                </div>

                {!appliedPromo && (
                  <div className="space-y-2 mb-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Введите промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyPromoCode()}
                      />
                      <Button onClick={applyPromoCode} variant="outline">
                        <Icon name="Tag" className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-foreground/60">
                      Промокоды: SPORT10, FIGHTER20, WUSHU15, НАЧАЛО
                    </p>
                  </div>
                )}

                {appliedPromo && (
                  <div className="mb-6 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-900">
                    <div className="flex items-center text-green-700 dark:text-green-300">
                      <Icon name="CheckCircle" className="h-4 w-4 mr-2" />
                      <span className="font-semibold">Промокод {appliedPromo} применен</span>
                    </div>
                  </div>
                )}

                <Button size="lg" className="w-full mb-3" onClick={() => navigate('/checkout')}>
                  <Icon name="CreditCard" className="mr-2 h-5 w-5" />
                  Оформить заказ
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  <Icon name="ArrowLeft" className="mr-2 h-5 w-5" />
                  Продолжить покупки
                </Button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-foreground/70">
                    <Icon name="Truck" className="h-4 w-4 mr-2 text-primary" />
                    <span>Доставка 1-3 дня</span>
                  </div>
                  <div className="flex items-center text-sm text-foreground/70">
                    <Icon name="Shield" className="h-4 w-4 mr-2 text-primary" />
                    <span>Безопасная оплата</span>
                  </div>
                  <div className="flex items-center text-sm text-foreground/70">
                    <Icon name="RefreshCw" className="h-4 w-4 mr-2 text-primary" />
                    <span>Возврат 14 дней</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;