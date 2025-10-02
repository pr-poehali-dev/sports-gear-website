import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';

const ProductHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth') || '{"isAuthenticated": false}'));
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData') || '{}'));

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth') || '{"isAuthenticated": false}');
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    setAuth(authData);
    setUserData(user);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth({ isAuthenticated: false });
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
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
            <Button 
              variant="ghost" 
              className="text-foreground/80 hover:text-foreground"
              onClick={() => navigate('/order-tracking')}
            >
              <Icon name="Package" className="mr-2 h-4 w-4" />
              Мои заказы
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Icon name="Search" className="h-5 w-5" />
          </Button>
          
          {auth.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {userData.firstName?.[0] || auth.user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:inline text-sm font-medium">
                      {userData.firstName || auth.user?.firstName || 'Профиль'}
                    </span>
                  </div>
                  <Badge className="absolute -top-1 -right-1 h-3 w-3 rounded-full p-0 bg-green-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {userData.firstName || auth.user?.firstName} {userData.lastName || auth.user?.lastName}
                    </p>
                    <p className="text-xs text-foreground/70">
                      {userData.email || auth.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Icon name="User" className="mr-2 h-4 w-4" />
                  Личный кабинет
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/order-tracking')}>
                  <Icon name="Package" className="mr-2 h-4 w-4" />
                  Мои заказы
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Icon name="Heart" className="mr-2 h-4 w-4" />
                  Избранное
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Icon name="Settings" className="mr-2 h-4 w-4" />
                  Настройки
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <Icon name="LogOut" className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              <Icon name="User" className="h-5 w-5" />
              <span className="hidden lg:inline ml-2">Войти</span>
            </Button>
          )}

          <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/cart')}>
            <Icon name="ShoppingCart" className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary">
              2
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ProductHeader;