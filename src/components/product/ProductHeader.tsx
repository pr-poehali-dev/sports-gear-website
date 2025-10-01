import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const ProductHeader = () => {
  const navigate = useNavigate();

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
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Icon name="Search" className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="User" className="h-5 w-5" />
          </Button>
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
