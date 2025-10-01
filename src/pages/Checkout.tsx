import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import ProductHeader from '@/components/product/ProductHeader';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    zipCode: '',
    comment: ''
  });
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Профессиональные боксерские перчатки',
      price: 4500,
      quantity: 1,
      size: '12 oz',
      color: 'Красный',
      image: '/img/69fa4a1c-9e7c-40c5-b489-2d6ea5263fd8.jpg'
    }
  ];

  const deliveryOptions = [
    { id: 'courier', name: 'Курьерская доставка', price: 500, time: '1-3 дня' },
    { id: 'pickup', name: 'Самовывоз', price: 0, time: 'Сегодня' },
    { id: 'post', name: 'Почта России', price: 350, time: '5-10 дней' }
  ];

  const paymentOptions = [
    { id: 'card', name: 'Банковская карта', icon: 'CreditCard' },
    { id: 'cash', name: 'Наличные при получении', icon: 'Banknote' },
    { id: 'sbp', name: 'СБП (Система быстрых платежей)', icon: 'Smartphone' }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = deliveryOptions.find(d => d.id === deliveryMethod)?.price || 0;
  const total = subtotal + deliveryPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя';
    if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Некорректный email';
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
    else if (!/^[\d\s+()-]{10,}$/.test(formData.phone)) newErrors.phone = 'Некорректный номер телефона';
    
    if (deliveryMethod !== 'pickup') {
      if (!formData.city.trim()) newErrors.city = 'Введите город';
      if (!formData.address.trim()) newErrors.address = 'Введите адрес';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'Введите индекс';
    }

    if (!agreeTerms) newErrors.terms = 'Необходимо согласие с условиями';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const orderNumber = 'ORD' + Date.now().toString().slice(-8);
    
    const orderData = {
      orderNumber,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'pending',
      formData,
      deliveryMethod,
      paymentMethod,
      items: cartItems,
      total,
      deliveryPrice,
      subtotal
    };

    const savedOrders = localStorage.getItem('orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.unshift(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    localStorage.removeItem('cart');
    
    navigate('/order-success', { state: { orderData } });
  };

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm text-foreground/70 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-foreground">
            Главная
          </button>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <button onClick={() => navigate('/cart')} className="hover:text-foreground">
            Корзина
          </button>
          <Icon name="ChevronRight" className="h-4 w-4" />
          <span className="text-foreground font-medium">Оформление заказа</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="User" className="h-5 w-5" />
                    <span>Контактная информация</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Имя *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-destructive text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Фамилия *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-destructive text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+7 (999) 999-99-99"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Truck" className="h-5 w-5" />
                    <span>Способ доставки</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="space-y-3">
                      {deliveryOptions.map((option) => (
                        <label
                          key={option.id}
                          htmlFor={option.id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                            deliveryMethod === option.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">{option.name}</p>
                                <p className="text-sm text-foreground/70">{option.time}</p>
                              </div>
                              <p className="font-semibold">
                                {option.price === 0 ? 'Бесплатно' : `${option.price} ₽`}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>

                  {deliveryMethod !== 'pickup' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="city">Город *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={errors.city ? 'border-destructive' : ''}
                        />
                        {errors.city && (
                          <p className="text-destructive text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="address">Адрес доставки *</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="Улица, дом, квартира"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={errors.address ? 'border-destructive' : ''}
                        />
                        {errors.address && (
                          <p className="text-destructive text-sm mt-1">{errors.address}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Почтовый индекс *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={errors.zipCode ? 'border-destructive' : ''}
                        />
                        {errors.zipCode && (
                          <p className="text-destructive text-sm mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {deliveryMethod === 'pickup' && (
                    <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                      <p className="font-semibold mb-2">Пункт самовывоза:</p>
                      <p className="text-sm text-foreground/80">
                        г. Москва, ул. Спортивная, д. 15
                      </p>
                      <p className="text-sm text-foreground/80">
                        Режим работы: Пн-Пт 10:00-20:00, Сб-Вс 11:00-18:00
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="CreditCard" className="h-5 w-5" />
                    <span>Способ оплаты</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      {paymentOptions.map((option) => (
                        <label
                          key={option.id}
                          htmlFor={`payment-${option.id}`}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                            paymentMethod === option.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value={option.id} id={`payment-${option.id}`} />
                          <Icon name={option.icon as any} className="h-5 w-5 text-foreground/70" />
                          <div className="flex-1">
                            {option.name}
                          </div>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="MessageSquare" className="h-5 w-5" />
                    <span>Комментарий к заказу</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    name="comment"
                    rows={4}
                    placeholder="Дополнительная информация для курьера или пожелания к заказу"
                    value={formData.comment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Ваш заказ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex space-x-3 pb-4 border-b border-border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-foreground/70 mt-1">
                          {item.size} / {item.color}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-foreground/70">×{item.quantity}</span>
                          <span className="font-semibold">{item.price.toLocaleString()} ₽</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Товары ({cartItems.length}):</span>
                      <span className="font-semibold">{subtotal.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Доставка:</span>
                      <span className="font-semibold">
                        {deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-4 border-t border-border">
                      <span>Итого:</span>
                      <span className="text-primary">{total.toLocaleString()} ₽</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                        className={errors.terms ? 'border-destructive' : ''}
                      />
                      <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                        Я согласен с условиями обработки персональных данных и политикой конфиденциальности
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-destructive text-sm">{errors.terms}</p>
                    )}

                    <Button type="submit" size="lg" className="w-full">
                      <Icon name="ShoppingBag" className="mr-2 h-5 w-5" />
                      Оформить заказ
                    </Button>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs text-foreground/70">
                      <div className="flex flex-col items-center">
                        <Icon name="Shield" className="h-4 w-4 mb-1" />
                        <span>Безопасная оплата</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Icon name="RefreshCw" className="h-4 w-4 mb-1" />
                        <span>Возврат 14 дней</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Icon name="Award" className="h-4 w-4 mb-1" />
                        <span>Гарантия качества</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;