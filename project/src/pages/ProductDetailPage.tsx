import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface ProductDetailPageProps {
  productSlug: string;
  onNavigate: (page: string, param?: string) => void;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
}

export default function ProductDetailPage({
  productSlug,
  onNavigate,
  onAddToCart,
  onAddToWishlist,
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [productSlug]);

  async function loadProduct() {
    const { data: productData } = await supabase
      .from('products')
      .select('*, images:product_images(*), category:categories(*)')
      .eq('slug', productSlug)
      .maybeSingle();

    if (productData) {
      setProduct(productData);
      if (productData.images && productData.images.length > 0) {
        setSelectedImage(productData.images[0].image_url);
      }

      const { data: relatedData } = await supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('category_id', productData.category_id)
        .neq('id', productData.id)
        .limit(4);

      if (relatedData) setRelatedProducts(relatedData);
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price;
  const images = product.images || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedImage || 'https://images.pexels.com/photos/1458670/pexels-photo-1458670.jpeg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === img.image_url ? 'border-gray-900' : 'border-transparent'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{displayPrice}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-semibold">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-semibold">{product.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-semibold">{product.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-semibold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <label className="text-gray-700 font-semibold">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      onAddToCart(product.id);
                    }
                  }}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => onAddToWishlist(product.id)}
                  className="px-6 py-3 border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center mb-6"
              >
                Order on WhatsApp
              </a>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-700">Free delivery on orders above ₹999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-700">Delivery in 3-5 business days</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-700">COD & Prepaid available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                  onViewProduct={(slug) => onNavigate('product', slug)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
