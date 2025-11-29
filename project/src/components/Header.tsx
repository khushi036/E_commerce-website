import { ShoppingCart, Heart, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ cartCount, wishlistCount, onNavigate, currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', value: 'home' },
    { label: 'Shop', value: 'shop' },
    { label: 'Oxidised', value: 'oxidised' },
    { label: 'Silver', value: 'silver' },
    { label: 'Jhumkas', value: 'jhumkas' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
          >
            Elegance Earrings
          </button>

          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-gray-700 hover:text-gray-900 transition-colors ${
                  currentPage === item.value ? 'font-semibold' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="p-2 hover:bg-gray-100 rounded-full relative transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors ${
                  currentPage === item.value ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
