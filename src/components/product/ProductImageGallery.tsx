import { Badge } from '@/components/ui/badge';

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  originalPrice?: number;
  price: number;
}

const ProductImageGallery = ({
  images,
  name,
  selectedImageIndex,
  onSelectImage,
  originalPrice,
  price
}: ProductImageGalleryProps) => {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-square">
        <img
          src={images[selectedImageIndex]}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {originalPrice && (
          <Badge className="absolute top-4 left-4 bg-destructive">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onSelectImage(index)}
            className={`relative overflow-hidden rounded-lg aspect-square ${
              selectedImageIndex === index ? 'ring-2 ring-primary' : ''
            }`}
          >
            <img
              src={image}
              alt={`${name} ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
