import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import ProductHeader from '@/components/product/ProductHeader';

interface OrderStatus {
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

interface Order {
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: any[];
  deliveryMethod: string;
  paymentMethod: string;
  formData: any;
  trackingSteps: OrderStatus[];
}

const OrderTracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  useEffect(() => {
    const orderFromUrl = searchParams.get('order');
    if (orderFromUrl) {
      setOrderNumber(orderFromUrl);
      loadOrder(orderFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    loadAllOrders();
  }, []);

  const loadAllOrders = () => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const orders = JSON.parse(savedOrders);
      setAllOrders(orders);
    }
  };

  const loadOrder = (orderNum: string) => {
    const savedOrders = localStorage.getItem('orders');
    if (!savedOrders) {
      setError('Заказ не найден');
      setOrder(null);
      return;
    }

    const orders = JSON.parse(savedOrders);
    const foundOrder = orders.find((o: Order) => o.orderNumber === orderNum);

    if (!foundOrder) {
      setError('Заказ с таким номером не найден');
      setOrder(null);
      return;
    }

    setOrder(foundOrder);
    setError('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      setError('Введите номер заказа');
      return;
    }

    loadOrder(orderNumber.trim());
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Обрабатывается', variant: 'secondary' },
      confirmed: { label: 'Подтверждён', variant: 'default' },
      preparing: { label: 'Готовится к отправке', variant: 'default' },
      shipped: { label: 'Отправлен', variant: 'default' },
      delivered: { label: 'Доставлен', variant: 'default' },
      cancelled: { label: 'Отменён', variant: 'destructive' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTrackingSteps = (status: string): OrderStatus[] => {
    const allSteps = [
      {
        status: 'pending',
        date: new Date().toLocaleDateString('ru-RU'),
        description: 'Заказ получен и обрабатывается',
        completed: true
      },
      {
        status: 'confirmed',
        date: new Date(Date.now() + 3600000).toLocaleDateString('ru-RU'),
        description: 'Заказ подтверждён, передан на склад',
        completed: ['confirmed', 'preparing', 'shipped', 'delivered'].includes(status)
      },
      {
        status: 'preparing',
        date: new Date(Date.now() + 86400000).toLocaleDateString('ru-RU'),
        description: 'Товар упакован и готов к отправке',
        completed: ['preparing', 'shipped', 'delivered'].includes(status)
      },
      {
        status: 'shipped',
        date: new Date(Date.now() + 172800000).toLocaleDateString('ru-RU'),
        description: 'Заказ передан в службу доставки',
        completed: ['shipped', 'delivered'].includes(status)
      },
      {
        status: 'delivered',
        date: new Date(Date.now() + 259200000).toLocaleDateString('ru-RU'),
        description: 'Заказ доставлен получателю',
        completed: status === 'delivered'
      }
    ];

    return allSteps;
  };

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Отслеживание заказа</h1>
            <Button variant="outline" onClick={() => setShowAllOrders(!showAllOrders)}>
              <Icon name="Package" className="mr-2 h-4 w-4" />
              {showAllOrders ? 'Поиск по номеру' : 'Мои заказы'}
            </Button>
          </div>

          {!showAllOrders ? (
            <>
              <Card className="mb-8">
                <CardContent className="p-6">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="orderNumber">Номер заказа *</Label>
                        <Input
                          id="orderNumber"
                          placeholder="ORD12345678"
                          value={orderNumber}
                          onChange={(e) => {
                            setOrderNumber(e.target.value);
                            setError('');
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email (необязательно)</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center space-x-2">
                        <Icon name="AlertCircle" className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <Button type="submit" className="w-full">
                      <Icon name="Search" className="mr-2 h-4 w-4" />
                      Отследить заказ
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {order && (
                <>
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Заказ #{order.orderNumber}</CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-foreground/70">Дата заказа</p>
                          <p className="font-semibold">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70">Сумма заказа</p>
                          <p className="font-semibold text-primary">{order.total.toLocaleString()} ₽</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70">Получатель</p>
                          <p className="font-semibold">
                            {order.formData.firstName} {order.formData.lastName}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <h3 className="font-semibold mb-4">Статус доставки</h3>
                      <div className="relative">
                        {getTrackingSteps(order.status).map((step, index) => (
                          <div key={index} className="flex items-start mb-8 last:mb-0 relative">
                            <div className="flex flex-col items-center mr-4">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  step.completed
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground/40'
                                }`}
                              >
                                {step.completed ? (
                                  <Icon name="Check" className="h-4 w-4" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-foreground/40" />
                                )}
                              </div>
                              {index < getTrackingSteps(order.status).length - 1 && (
                                <div
                                  className={`w-0.5 h-16 ${
                                    step.completed ? 'bg-primary' : 'bg-muted'
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <p className={`font-semibold ${step.completed ? 'text-foreground' : 'text-foreground/40'}`}>
                                {step.description}
                              </p>
                              <p className="text-sm text-foreground/70 mt-1">{step.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <h3 className="font-semibold mb-3">Товары в заказе</h3>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
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
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => navigate('/')}>
                      <Icon name="Home" className="mr-2 h-4 w-4" />
                      На главную
                    </Button>
                    <Button variant="outline" onClick={() => window.print()}>
                      <Icon name="Printer" className="mr-2 h-4 w-4" />
                      Распечатать
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {allOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Icon name="Package" className="h-16 w-16 mx-auto mb-4 text-foreground/40" />
                    <h3 className="text-xl font-semibold mb-2">У вас пока нет заказов</h3>
                    <p className="text-foreground/70 mb-6">
                      Начните покупки в нашем магазине
                    </p>
                    <Button onClick={() => navigate('/')}>
                      <Icon name="ShoppingBag" className="mr-2 h-4 w-4" />
                      Перейти в каталог
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Все заказы ({allOrders.length})</h2>
                  {allOrders.map((ord) => (
                    <Card key={ord.orderNumber} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm text-foreground/70">Заказ</p>
                            <p className="font-bold text-lg">#{ord.orderNumber}</p>
                          </div>
                          {getStatusBadge(ord.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-foreground/70">Дата</p>
                            <p className="font-medium text-sm">{ord.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground/70">Товаров</p>
                            <p className="font-medium text-sm">{ord.items.length} шт.</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground/70">Сумма</p>
                            <p className="font-medium text-sm text-primary">{ord.total.toLocaleString()} ₽</p>
                          </div>
                          <div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                setOrderNumber(ord.orderNumber);
                                setShowAllOrders(false);
                                loadOrder(ord.orderNumber);
                              }}
                            >
                              Отследить
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="Package" className="h-4 w-4 text-foreground/70" />
                          <span className="text-foreground/70">
                            {ord.items[0]?.name}
                            {ord.items.length > 1 && ` и ещё ${ord.items.length - 1}`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
