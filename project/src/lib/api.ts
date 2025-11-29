const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  'Authorization': `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
  'X-Client-Info': 'supabase-js/2.57.4',
  'Apikey': ANON_KEY,
};

export async function fetchProducts(filters?: {
  categoryId?: string;
  featured?: boolean;
  bestseller?: boolean;
  limit?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.append('category_id', filters.categoryId);
  if (filters?.featured) params.append('featured', 'true');
  if (filters?.bestseller) params.append('bestseller', 'true');
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await fetch(`${API_BASE}/products?${params}`, { headers });
  const data = await response.json();
  return data.data;
}

export async function fetchProduct(productId: string) {
  const response = await fetch(`${API_BASE}/products/${productId}`, { headers });
  const data = await response.json();
  return data.data;
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`, { headers });
  const data = await response.json();
  return data.data;
}

export async function getCart(sessionId: string) {
  const response = await fetch(`${API_BASE}/cart?session_id=${sessionId}`, { headers });
  const data = await response.json();
  return data;
}

export async function addToCart(sessionId: string, productId: string, quantity = 1) {
  const response = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      quantity,
      action: 'add',
    }),
  });
  const data = await response.json();
  return data;
}

export async function removeFromCart(sessionId: string, productId: string) {
  const response = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      action: 'remove',
    }),
  });
  const data = await response.json();
  return data;
}

export async function updateCartQuantity(sessionId: string, productId: string, quantity: number) {
  const response = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      quantity,
      action: 'update',
    }),
  });
  const data = await response.json();
  return data;
}

export async function getWishlist(sessionId: string) {
  const response = await fetch(`${API_BASE}/wishlist?session_id=${sessionId}`, { headers });
  const data = await response.json();
  return data;
}

export async function addToWishlist(sessionId: string, productId: string) {
  const response = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      action: 'add',
    }),
  });
  const data = await response.json();
  return data;
}

export async function removeFromWishlist(sessionId: string, productId: string) {
  const response = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      session_id: sessionId,
      product_id: productId,
      action: 'remove',
    }),
  });
  const data = await response.json();
  return data;
}

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  payment_method: string;
  session_id: string;
}) {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  return data;
}

export async function getOrder(orderNumber: string) {
  const response = await fetch(`${API_BASE}/orders?order_number=${orderNumber}`, { headers });
  const data = await response.json();
  return data.data?.[0];
}

export async function getOrdersByEmail(email: string) {
  const response = await fetch(`${API_BASE}/orders?email=${email}`, { headers });
  const data = await response.json();
  return data.data;
}

export async function sendEmail(emailData: {
  to: string;
  subject: string;
  template: 'order-confirmation' | 'order-shipped' | 'contact-reply';
  data: Record<string, unknown>;
}) {
  const response = await fetch(`${API_BASE}/send-email`, {
    method: 'POST',
    headers,
    body: JSON.stringify(emailData),
  });
  const data = await response.json();
  return data;
}
