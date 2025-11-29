import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../lib/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

interface CategoryPageProps {
  categorySlug: string;
  onNavigate: (page: string, param?: string) => void;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
}

export default function CategoryPage({ categorySlug, onNavigate, onAddToCart, onAddToWishlist }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadCategoryAndProducts();
  }, [categorySlug]);

  async function loadCategoryAndProducts() {
    try {
      const cats = await fetchCategories();
      const categoryData = cats?.find(c => c.slug === categorySlug);

      if (categoryData) {
        setCategory(categoryData);

        const productsData = await fetchProducts({ categoryId: categoryData.id });
        if (productsData) setProducts(productsData);
      }
    } catch (error) {
      console.error('Error loading category:', error);
    }
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative bg-gradient-to-br from-amber-100 to-orange-100 py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${category.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{category.name}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{category.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onViewProduct={(slug) => onNavigate('product', slug)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No products available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
