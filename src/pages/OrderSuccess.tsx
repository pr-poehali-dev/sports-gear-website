import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import ProductHeader from '@/components/product/ProductHeader';

interface OrderData {
  orderNumber: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city?: string;
    address?: string;
    zipCode?: string;
    comment?: string;
  };
  deliveryMethod: string;
  paymentMethod: string;
  total: number;
  items: any[];
  deliveryPrice: number;
  subtotal: number;
}

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    if (!location.state?.orderData) {
      navigate('/');
      return;
    }
    setOrderData(location.state.orderData);
  }, [location, navigate]);

  if (!orderData) {
    return null;
  }

  const deliveryMethodNames: Record<string, string> = {
    courier: 'Курьерская доставка',
    pickup: 'Самовывоз',
    post: 'Почта России'
  };

  const paymentMethodNames: Record<string, string> = {
    card: 'Банковская карта',
    cash: 'Наличные при получении',
    sbp: 'СБП (Система быстрых платежей)'
  };

  const estimatedDelivery = () => {
    const today = new Date();
    let days = 1;
    
    if (orderData.deliveryMethod === 'courier') days = 3;
    else if (orderData.deliveryMethod === 'post') days = 10;
    else days = 0;

    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + days);
    
    return deliveryDate.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Заказ успешно оформлен!</h1>
            <p className="text-foreground/70 text-lg">
              Спасибо за покупку, {orderData.formData.firstName}!
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-foreground/70">Номер заказа</p>
                  <p className="text-2xl font-bold text-primary">#{orderData.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground/70">Дата заказа</p>
                  <p className="font-semibold">
                    {new Date().toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-accent/10 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Mail" className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Подтверждение отправлено</p>
                    <p className="text-sm text-foreground/70">
                      Детали заказа отправлены на {orderData.formData.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Icon name="Package" className="h-5 w-5 mr-2" />
                    Ваш заказ
                  </h3>
                  <div className="space-y-3">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-foreground/70">
                            {item.size} / {item.color} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} ₽</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Товары:</span>
                      <span>{orderData.subtotal.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Доставка:</span>
                      <span>
                        {orderData.deliveryPrice === 0 
                          ? 'Бесплатно' 
                          : `${orderData.deliveryPrice.toLocaleString()} ₽`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Итого:</span>
                      <span className="text-primary">{orderData.total.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Icon name="Truck" className="h-5 w-5 mr-2" />
                    Доставка
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-foreground/70">Способ доставки</p>
                      <p className="font-medium">{deliveryMethodNames[orderData.deliveryMethod]}</p>
                    </div>
                    
                    {orderData.deliveryMethod === 'pickup' ? (
                      <div>
                        <p className="text-sm text-foreground/70">Пункт самовывоза</p>
                        <p className="font-medium">г. Москва, ул. Спортивная, д. 15</p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Режим работы: Пн-Пт 10:00-20:00, Сб-Вс 11:00-18:00
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-foreground/70">Адрес доставки</p>
                        <p className="font-medium">
                          {orderData.formData.zipCode}, {orderData.formData.city}
                        </p>
                        <p className="font-medium">{orderData.formData.address}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-foreground/70">Ожидаемая доставка</p>
                      <p className="font-medium text-primary">{estimatedDelivery()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Icon name="CreditCard" className="h-5 w-5 mr-2" />
                    Оплата
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-foreground/70">Способ оплаты</p>
                      <p className="font-medium">{paymentMethodNames[orderData.paymentMethod]}</p>
                    </div>
                    {orderData.paymentMethod === 'card' && (
                      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <Icon name="Info" className="inline h-4 w-4 mr-1" />
                          Ссылка на оплату будет отправлена на вашу почту
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Icon name="User" className="h-5 w-5 mr-2" />
                    Контактная информация
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-foreground/70">Получатель</p>
                      <p className="font-medium">
                        {orderData.formData.firstName} {orderData.formData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Телефон</p>
                      <p className="font-medium">{orderData.formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Email</p>
                      <p className="font-medium">{orderData.formData.email}</p>
                    </div>
                    {orderData.formData.comment && (
                      <div>
                        <p className="text-sm text-foreground/70">Комментарий</p>
                        <p className="font-medium">{orderData.formData.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" onClick={() => navigate('/')}>
              <Icon name="Home" className="mr-2 h-5 w-5" />
              Вернуться на главную
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.print()}>
              <Icon name="Printer" className="mr-2 h-5 w-5" />
              Распечатать заказ
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
              <Icon name="Headphones" className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold mb-1">Поддержка 24/7</p>
              <p className="text-sm text-foreground/70">+7 (800) 123-45-67</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <Icon name="Shield" className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold mb-1">Гарантия качества</p>
              <p className="text-sm text-foreground/70">12 месяцев</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <Icon name="RefreshCw" className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold mb-1">Возврат товара</p>
              <p className="text-sm text-foreground/70">В течение 14 дней</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
