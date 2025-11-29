interface PolicyPageProps {
  type: 'shipping' | 'returns' | 'privacy' | 'terms';
}

export default function PolicyPage({ type }: PolicyPageProps) {
  const content = {
    shipping: {
      title: 'Shipping Policy',
      sections: [
        {
          heading: 'Processing Time',
          content: 'Orders are processed within 24-48 hours of placement. You will receive a confirmation email once your order has been shipped.',
        },
        {
          heading: 'Delivery Time',
          content: 'Standard delivery takes 3-5 business days across India. Delivery times may vary depending on your location and local courier services.',
        },
        {
          heading: 'Shipping Charges',
          content: 'We offer free shipping on all orders above ₹999. For orders below ₹999, a flat shipping charge of ₹50 applies.',
        },
        {
          heading: 'Tracking',
          content: 'Once your order is shipped, you will receive a tracking number via email to monitor your package.',
        },
        {
          heading: 'Cash on Delivery',
          content: 'COD is available for most locations. Payment can be made in cash to the delivery partner upon receiving your order.',
        },
      ],
    },
    returns: {
      title: 'Return & Refund Policy',
      sections: [
        {
          heading: 'Return Period',
          content: 'We accept returns within 7 days of delivery. Products must be unused, in original condition, and in their original packaging.',
        },
        {
          heading: 'Non-Returnable Items',
          content: 'For hygiene reasons, earrings that have been worn or altered cannot be returned. Damaged or defective items are eligible for replacement.',
        },
        {
          heading: 'Return Process',
          content: 'To initiate a return, contact us via email or WhatsApp with your order number and reason for return. We will guide you through the process.',
        },
        {
          heading: 'Refund Processing',
          content: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.',
        },
        {
          heading: 'Exchange',
          content: 'If you would like to exchange an item for a different design, please contact us. Exchanges are subject to product availability.',
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      sections: [
        {
          heading: 'Information We Collect',
          content: 'We collect personal information such as name, email address, phone number, and shipping address when you place an order. This information is used solely to process and deliver your order.',
        },
        {
          heading: 'How We Use Your Information',
          content: 'Your information is used to process orders, communicate about your purchase, and improve our services. We may send promotional emails, which you can opt out of at any time.',
        },
        {
          heading: 'Data Security',
          content: 'We implement industry-standard security measures to protect your personal information. Your payment details are processed through secure payment gateways and are not stored on our servers.',
        },
        {
          heading: 'Sharing of Information',
          content: 'We do not sell or share your personal information with third parties except for essential service providers like shipping companies and payment processors.',
        },
        {
          heading: 'Cookies',
          content: 'Our website uses cookies to enhance your browsing experience. You can disable cookies in your browser settings, but this may affect website functionality.',
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      sections: [
        {
          heading: 'Acceptance of Terms',
          content: 'By accessing and using this website, you accept and agree to be bound by these terms and conditions. If you do not agree, please do not use our website.',
        },
        {
          heading: 'Product Information',
          content: 'We strive to display accurate product images and descriptions. However, actual colors and details may vary slightly due to screen settings and photography. Weight and size measurements are approximate.',
        },
        {
          heading: 'Pricing',
          content: 'All prices are listed in Indian Rupees (INR) and are subject to change without notice. We reserve the right to modify prices, but changes will not affect orders already placed.',
        },
        {
          heading: 'Order Acceptance',
          content: 'We reserve the right to refuse or cancel any order for reasons including product availability, errors in pricing or product information, or suspected fraudulent activity.',
        },
        {
          heading: 'Intellectual Property',
          content: 'All content on this website, including images, text, and designs, is the property of Elegance Earrings and is protected by copyright laws. Unauthorized use is prohibited.',
        },
        {
          heading: 'Limitation of Liability',
          content: 'We are not liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the purchase price of the product.',
        },
      ],
    },
  };

  const policy = content[type];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900">{policy.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-8">Last updated: November 27, 2024</p>

          <div className="space-y-8">
            {policy.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our {policy.title.toLowerCase()}, please don't hesitate to contact us.
            </p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
