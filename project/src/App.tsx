import { useState, useEffect } from 'react';
import { supabase, getSessionId } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './pages/PolicyPages';

type Page = 'home' | 'shop' | 'oxidised' | 'silver' | 'jhumkas' | 'product' | 'cart' | 'checkout' | 'order-confirmation' | 'wishlist' | 'about' | 'contact' | 'shipping' | 'returns' | 'privacy' | 'terms';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageParam, setPageParam] = useState<string>('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    updateCounts();
  }, []);

  async function updateCounts() {
    const sessionId = getSessionId();

    const [cartResult, wishlistResult] = await Promise.all([
      supabase.from('cart_items').select('id', { count: 'exact' }).eq('session_id', sessionId),
      supabase.from('wishlist_items').select('id', { count: 'exact' }).eq('session_id', sessionId),
    ]);

    setCartCount(cartResult.count || 0);
    setWishlistCount(wishlistResult.count || 0);
  }

  function navigate(page: string, param?: string) {
    setCurrentPage(page as Page);
    setPageParam(param || '');
    window.scrollTo(0, 0);
  }

  async function addToCart(productId: string) {
    const sessionId = getSessionId();

    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({
        session_id: sessionId,
        product_id: productId,
        quantity: 1,
      });
    }

    await updateCounts();
  }

  async function addToWishlist(productId: string) {
    const sessionId = getSessionId();

    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', existing.id);
    } else {
      await supabase.from('wishlist_items').insert({
        session_id: sessionId,
        product_id: productId,
      });
    }

    await updateCounts();
  }

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />;
      case 'shop':
        return <ShopPage onNavigate={navigate} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />;
      case 'oxidised':
      case 'silver':
      case 'jhumkas':
        return <CategoryPage categorySlug={currentPage} onNavigate={navigate} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />;
      case 'product':
        return <ProductDetailPage productSlug={pageParam} onNavigate={navigate} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />;
      case 'cart':
        return <CartPage onNavigate={navigate} onCartUpdate={updateCounts} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigate} onCartUpdate={updateCounts} />;
      case 'order-confirmation':
        return <OrderConfirmationPage orderNumber={pageParam} onNavigate={navigate} />;
      case 'wishlist':
        return <WishlistPage onNavigate={navigate} onAddToCart={addToCart} onWishlistUpdate={updateCounts} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'shipping':
        return <PolicyPage type="shipping" />;
      case 'returns':
        return <PolicyPage type="returns" />;
      case 'privacy':
        return <PolicyPage type="privacy" />;
      case 'terms':
        return <PolicyPage type="terms" />;
      default:
        return <HomePage onNavigate={navigate} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onNavigate={navigate}
        currentPage={currentPage}
      />
      {renderPage()}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
