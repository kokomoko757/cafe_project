import { CartItem } from '../types';

export function formatPrice(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0 ₸';
  }
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ₸`;
}

export function calculateLineSubtotal(unitPrice: number, quantity: number): number {
  const price = typeof unitPrice === 'number' && unitPrice > 0 ? unitPrice : 0;
  const qty = typeof quantity === 'number' && quantity > 0 ? quantity : 0;
  return price * qty;
}

export function calculateOrderTotals(items: CartItem[]): { totalQty: number; totalPrice: number } {
  if (!Array.isArray(items) || items.length === 0) {
    return { totalQty: 0, totalPrice: 0 };
  }

  let totalQty = 0;
  let totalPrice = 0;

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const qty = typeof item.qty === 'number' ? item.qty : 0;
    const subtotal = calculateLineSubtotal(item.price, qty);
    totalQty += qty;
    totalPrice += subtotal;
  }

  return { totalQty, totalPrice };
}

export function generateReferenceCode(prefix: string = 'GC'): string {
  const cleanPrefix = typeof prefix === 'string' && prefix.trim().length > 0 ? prefix.trim() : 'GC';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `#${cleanPrefix}-2026-${randomNum}`;
}

export function formatDateDisplay(isoDate: string): string {
  if (typeof isoDate !== 'string' || !isoDate.includes('-')) {
    return isoDate || '';
  }
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return isoDate;
}

export function sanitizeText(str: string): string {
  if (typeof str !== 'string') {
    return '';
  }
  return str.trim();
}

export function formatPhoneNumber(val: string): string {
  let digits = val.replace(/\D/g, '');

  if (digits.startsWith('8') || digits.startsWith('7')) {
    digits = digits.substring(1);
  }

  if (digits.length === 0) {
    return '+7';
  }

  let formatted = '+7 (';
  formatted += digits.substring(0, 3);

  if (digits.length >= 4) {
    formatted += ') ' + digits.substring(3, 6);
  }
  if (digits.length >= 7) {
    formatted += '-' + digits.substring(6, 8);
  }
  if (digits.length >= 9) {
    formatted += '-' + digits.substring(8, 10);
  }

  return formatted;
}

export function isCoffeeShopOpenNow(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 8 && currentHour < 24;
}
