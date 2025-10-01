import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import ProductHeader from '@/components/product/ProductHeader';

interface Order {
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: any[];
}

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    city: 'Москва',
    address: 'ул. Пушкина, д. 10, кв. 5',
    zipCode: '123456'
  });
  const [isEditing, setIsEditing] = useState(false);

  const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Обрабатывается', variant: 'secondary' },
      confirmed: { label: 'Подтверждён', variant: 'default' },
      preparing: { label: 'Готовится', variant: 'default' },
      shipped: { label: 'Отправлен', variant: 'default' },
      delivered: { label: 'Доставлен', variant: 'default' },
      cancelled: { label: 'Отменён', variant: 'destructive' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <ProductHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
              <p className="text-foreground/70">Управляйте своим профилем и заказами</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" className="mr-2 h-4 w-4" />
              На главную
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <Icon name="LayoutDashboard" className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Обзор</span>
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Icon name="Package" className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Заказы</span>
              </TabsTrigger>
              <TabsTrigger value="profile">
                <Icon name="User" className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Профиль</span>
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Icon name="Settings" className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Настройки</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon name="Package" className="h-10 w-10 text-primary" />
                      <Badge variant="secondary" className="text-xl font-bold">
                        {orders.length}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Всего заказов</h3>
                    <p className="text-sm text-foreground/70">За все время</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon name="Truck" className="h-10 w-10 text-primary" />
                      <Badge variant="secondary" className="text-xl font-bold">
                        {orders.filter(o => ['pending', 'confirmed', 'preparing', 'shipped'].includes(o.status)).length}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Активные</h3>
                    <p className="text-sm text-foreground/70">В обработке</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon name="CheckCircle" className="h-10 w-10 text-primary" />
                      <Badge variant="secondary" className="text-xl font-bold">
                        {orders.filter(o => o.status === 'delivered').length}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Доставлено</h3>
                    <p className="text-sm text-foreground/70">Завершённые</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Последние заказы</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/order-tracking')}
                    >
                      Все заказы
                      <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Package" className="h-16 w-16 mx-auto mb-4 text-foreground/40" />
                      <h3 className="text-xl font-semibold mb-2">У вас пока нет заказов</h3>
                      <p className="text-foreground/70 mb-6">
                        Начните покупки в нашем магазине
                      </p>
                      <Button onClick={() => navigate('/')}>
                        <Icon name="ShoppingBag" className="mr-2 h-4 w-4" />
                        Перейти в каталог
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.orderNumber} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon name="Package" className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">#{order.orderNumber}</p>
                              <p className="text-sm text-foreground/70">{order.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {getStatusBadge(order.status)}
                            <p className="font-semibold text-primary hidden sm:block">
                              {order.total.toLocaleString()} ₽
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/order-tracking?order=${order.orderNumber}`)}
                            >
                              Отследить
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="Heart" className="mr-2 h-5 w-5" />
                      Избранное
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70 mb-4">
                      Сохраните понравившиеся товары, чтобы не потерять их
                    </p>
                    <Button variant="outline" className="w-full">
                      <Icon name="ShoppingBag" className="mr-2 h-4 w-4" />
                      Перейти в каталог
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="Bell" className="mr-2 h-5 w-5" />
                      Уведомления
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70 mb-4">
                      Получайте информацию о статусе заказов и акциях
                    </p>
                    <Button variant="outline" className="w-full">
                      <Icon name="Settings" className="mr-2 h-4 w-4" />
                      Настроить уведомления
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Мои заказы</CardTitle>
                    <Button onClick={() => navigate('/order-tracking')}>
                      <Icon name="Search" className="mr-2 h-4 w-4" />
                      Поиск заказа
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Package" className="h-16 w-16 mx-auto mb-4 text-foreground/40" />
                      <h3 className="text-xl font-semibold mb-2">У вас пока нет заказов</h3>
                      <p className="text-foreground/70 mb-6">
                        Начните покупки в нашем магазине
                      </p>
                      <Button onClick={() => navigate('/')}>
                        <Icon name="ShoppingBag" className="mr-2 h-4 w-4" />
                        Перейти в каталог
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.orderNumber} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-sm text-foreground/70">Заказ</p>
                                <p className="font-bold text-lg">#{order.orderNumber}</p>
                              </div>
                              {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-foreground/70">Дата</p>
                                <p className="font-medium text-sm">{order.date}</p>
                              </div>
                              <div>
                                <p className="text-xs text-foreground/70">Товаров</p>
                                <p className="font-medium text-sm">{order.items.length} шт.</p>
                              </div>
                              <div>
                                <p className="text-xs text-foreground/70">Сумма</p>
                                <p className="font-medium text-sm text-primary">{order.total.toLocaleString()} ₽</p>
                              </div>
                              <div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => navigate(`/order-tracking?order=${order.orderNumber}`)}
                                >
                                  Подробнее
                                </Button>
                              </div>
                            </div>

                            <Separator className="my-3" />

                            <div className="flex items-center space-x-2 text-sm">
                              <Icon name="Package" className="h-4 w-4 text-foreground/70" />
                              <span className="text-foreground/70">
                                {order.items[0]?.name}
                                {order.items.length > 1 && ` и ещё ${order.items.length - 1}`}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Личная информация</CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Icon name="Edit" className="mr-2 h-4 w-4" />
                        Редактировать
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Отмена
                        </Button>
                        <Button onClick={handleSave}>
                          <Icon name="Save" className="mr-2 h-4 w-4" />
                          Сохранить
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Имя</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={userData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <Separator />

                  <h3 className="font-semibold text-lg">Адрес доставки</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Город</Label>
                      <Input
                        id="city"
                        name="city"
                        value={userData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Почтовый индекс</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={userData.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Уведомления</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email уведомления</p>
                        <p className="text-sm text-foreground/70">
                          Получать обновления о заказах на почту
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Включено
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS уведомления</p>
                        <p className="text-sm text-foreground/70">
                          Получать SMS о статусе доставки
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Выключено
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Акции и предложения</p>
                        <p className="text-sm text-foreground/70">
                          Получать информацию о скидках и новинках
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Включено
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Безопасность</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Lock" className="mr-2 h-4 w-4" />
                      Изменить пароль
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Shield" className="mr-2 h-4 w-4" />
                      Двухфакторная аутентификация
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Дополнительно</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Download" className="mr-2 h-4 w-4" />
                      Экспортировать данные
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                      <Icon name="Trash2" className="mr-2 h-4 w-4" />
                      Удалить аккаунт
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
