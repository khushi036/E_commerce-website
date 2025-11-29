import { useEffect, useState } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { supabase, getSessionId } from '../lib/supabase';
import { CartItem } from '../types';

interface CartPageProps {
  onNavigate: (page: string) => void;
  onCartUpdate: () => void;
}

export default function CartPage({ onNavigate, onCartUpdate }: CartPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    const sessionId = getSessionId();
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*, images:product_images(*))')
      .eq('session_id', sessionId);

    if (data) {
      setCartItems(data);
    }
    setLoading(false);
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;

    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    await loadCart();
    onCartUpdate();
  }

  async function removeItem(itemId: string) {
    await supabase.from('cart_items').delete().eq('id', itemId);
    await loadCart();
    onCartUpdate();
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discount_price || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 999 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful earrings to get started</p>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              const price = product.discount_price || product.price;
              const imageUrl = product.images?.[0]?.image_url || 'https://images.pexels.com/photos/1458670/pexels-photo-1458670.jpeg';

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex gap-6">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4">{product.material}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-700 font-semibold">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 border-x border-gray-300">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-xl font-bold text-gray-900">₹{price * item.quantity}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                {subtotal < 999 && (
                  <p className="text-sm text-gray-600">Add ₹{999 - subtotal} more for free shipping</p>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">₹{total}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-4"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
