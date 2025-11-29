import { Heart, Award, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Our Story</h1>
          <p className="text-xl text-gray-700">
            Bringing timeless elegance to modern women
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Elegance Earrings</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              At Elegance Earrings, we believe that every woman deserves to feel beautiful and confident. Our journey began with a simple passion for exquisite jewelry and a dream to make premium-quality earrings accessible to everyone.
            </p>
            <p>
              Each piece in our collection is carefully curated or handcrafted with love, combining traditional artistry with contemporary design. From oxidised beauties that tell stories of heritage to sleek silver pieces that complement modern aesthetics, we offer something special for every occasion.
            </p>
            <p>
              We work with skilled artisans and source the finest materials to ensure that every earring you receive meets our high standards of quality. Whether you're dressing up for a wedding, adding elegance to your everyday look, or searching for the perfect gift, we're here to help you shine.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Heart className="w-12 h-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Made with Love</h3>
            <p className="text-gray-700">
              Every piece is selected or crafted with care and attention to detail, ensuring you receive jewelry that's as special as you are.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Award className="w-12 h-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Promise</h3>
            <p className="text-gray-700">
              We use only premium materials and work with trusted suppliers to guarantee the quality and durability of every earring.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Users className="w-12 h-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
            <p className="text-gray-700">
              Your satisfaction is our priority. We're always here to help you find the perfect piece or answer any questions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Sparkles className="w-12 h-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Unique Designs</h3>
            <p className="text-gray-700">
              From traditional to contemporary, our diverse collection features unique designs that help you express your personal style.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            To empower every woman to express her unique beauty and confidence through exquisite, affordable jewelry that celebrates both tradition and modernity.
          </p>
        </div>
      </div>
    </div>
  );
}
