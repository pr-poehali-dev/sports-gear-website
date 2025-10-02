import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const from = (location.state as any)?.from?.pathname || '/';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === loginData.email && u.password === loginData.password);

      if (user) {
        const authData = {
          isAuthenticated: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
          },
          rememberMe
        };
        
        localStorage.setItem('auth', JSON.stringify(authData));
        localStorage.setItem('userData', JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          city: user.city || '',
          address: user.address || '',
          zipCode: user.zipCode || ''
        }));

        toast.success('Вход выполнен успешно!', {
          description: `Добро пожаловать, ${user.firstName}!`
        });
        
        setLoading(false);
        navigate(from, { replace: true });
      } else {
        toast.error('Ошибка входа', {
          description: 'Неверный email или пароль'
        });
        setLoading(false);
      }
    }, 1000);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Ошибка', {
        description: 'Пароли не совпадают'
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Ошибка', {
        description: 'Пароль должен содержать минимум 6 символов'
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find((u: any) => u.email === registerData.email)) {
        toast.error('Ошибка регистрации', {
          description: 'Пользователь с таким email уже существует'
        });
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const authData = {
        isAuthenticated: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone
        },
        rememberMe: true
      };
      
      localStorage.setItem('auth', JSON.stringify(authData));
      localStorage.setItem('userData', JSON.stringify({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        city: '',
        address: '',
        zipCode: ''
      }));

      toast.success('Регистрация успешна!', {
        description: `Добро пожаловать, ${newUser.firstName}!`
      });
      
      setLoading(false);
      navigate(from, { replace: true });
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Вход через ${provider}`, {
      description: 'Функция в разработке'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
            На главную
          </Button>
          <h1 className="text-4xl font-bold mb-2">
            {isLogin ? 'Вход' : 'Регистрация'}
          </h1>
          <p className="text-foreground/70">
            {isLogin 
              ? 'Войдите в свой аккаунт для продолжения' 
              : 'Создайте аккаунт, чтобы начать покупки'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isLogin ? 'Добро пожаловать!' : 'Создать аккаунт'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Введите свои данные для входа' 
                : 'Заполните форму для регистрации'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="example@mail.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm cursor-pointer"
                    >
                      Запомнить меня
                    </Label>
                  </div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    type="button"
                    className="p-0 h-auto"
                  >
                    Забыли пароль?
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                      Вход...
                    </>
                  ) : (
                    <>
                      <Icon name="LogIn" className="mr-2 h-4 w-4" />
                      Войти
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Имя</Label>
                    <Input
                      id="firstName"
                      placeholder="Иван"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Фамилия</Label>
                    <Input
                      id="lastName"
                      placeholder="Петров"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="example@mail.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="register-password">Пароль</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Повторите пароль"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                      Регистрация...
                    </>
                  ) : (
                    <>
                      <Icon name="UserPlus" className="mr-2 h-4 w-4" />
                      Зарегистрироваться
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6">
              <div className="relative">
                <Separator className="my-4" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-foreground/70">
                  или продолжите с
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                >
                  <Icon name="Chrome" className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <Icon name="Facebook" className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => handleSocialLogin('Apple')}
                >
                  <Icon name="Apple" className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-foreground/70">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                {' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setIsLogin(!isLogin)}
                  type="button"
                >
                  {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-foreground/70 mt-6">
          Продолжая, вы соглашаетесь с{' '}
          <Button variant="link" className="p-0 h-auto text-xs" type="button">
            Условиями использования
          </Button>
          {' '}и{' '}
          <Button variant="link" className="p-0 h-auto text-xs" type="button">
            Политикой конфиденциальности
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
