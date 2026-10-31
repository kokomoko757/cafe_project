export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'cold' | 'food';
  price: number;
  volume: string;
  description: string;
  image: string;
  inStock: boolean;
}

export interface TableInfo {
  id: number;
  name: string;
  seats: number;
  zone: string;
  depositPerGuest: number;
  isAvailable?: boolean;
}

export interface BranchLocation {
  id: number;
  address: string;
  rating: string;
  note: string;
  isFlagship?: boolean;
  isTemporarilyClosed?: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  branch: string;
  rating: number;
  text: string;
  date: string;
  reviewCount?: number;
  isUserAdded?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
  category?: string;
  image?: string;
  unit?: string;
}

export interface OrderConfirmationData {
  orderId: string;
  name: string;
  phone: string;
  deliveryType: 'home' | 'onsite';
  addressOrTable: string;
  specialInstructions: string;
  paymentMethod: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface BookingConfirmationData {
  bookingCode: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  formattedDate: string;
  time: string;
  guestCount: number;
  tableName: string;
  depositTotal: number;
  comment: string;
}

export interface PartnerConfirmationData {
  appId: string;
  name: string;
  phone: string;
  city: string;
  age: string;
}
