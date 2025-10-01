import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Похожие товары</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
            <CardContent className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {product.price.toLocaleString()} ₽
                  </span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
