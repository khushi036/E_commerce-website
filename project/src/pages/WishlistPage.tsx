import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase, getSessionId } from '../lib/supabase';
import { WishlistItem } from '../types';
import ProductCard from '../components/ProductCard';

interface WishlistPageProps {
  onNavigate: (page: string, param?: string) => void;
  onAddToCart: (productId: string) => void;
  onWishlistUpdate: () => void;
}

export default function WishlistPage({ onNavigate, onAddToCart, onWishlistUpdate }: WishlistPageProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    const sessionId = getSessionId();
    const { data } = await supabase
      .from('wishlist_items')
      .select('*, product:products(*, images:product_images(*))')
      .eq('session_id', sessionId);

    if (data) {
      setWishlistItems(data);
    }
    setLoading(false);
  }

  async function removeFromWishlist(productId: string) {
    const sessionId = getSessionId();
    await supabase
      .from('wishlist_items')
      .delete()
      .eq('session_id', sessionId)
      .eq('product_id', productId);

    await loadWishlist();
    onWishlistUpdate();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save your favorite items for later</p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            if (!item.product) return null;
            return (
              <ProductCard
                key={item.id}
                product={item.product}
                onAddToCart={onAddToCart}
                onAddToWishlist={() => removeFromWishlist(item.product_id)}
                onViewProduct={(slug) => onNavigate('product', slug)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
