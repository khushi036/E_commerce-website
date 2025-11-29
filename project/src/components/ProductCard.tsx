import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  onViewProduct: (slug: string) => void;
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist, onViewProduct }: ProductCardProps) {
  const displayPrice = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/1458670/pexels-photo-1458670.jpeg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
          onClick={() => onViewProduct(product.slug)}
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
          </div>
        )}
        <button
          onClick={() => onAddToWishlist(product.id)}
          className="absolute top-2 left-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="p-4">
        <h3
          onClick={() => onViewProduct(product.slug)}
          className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-gray-600 transition-colors"
        >
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xl font-bold text-gray-900">₹{displayPrice}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-3">
          <p>{product.material}</p>
        </div>

        <button
          onClick={() => onAddToCart(product.id)}
          className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
