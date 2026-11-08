import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPrice,
  calculateLineSubtotal,
  calculateOrderTotals,
  generateReferenceCode,
  formatDateDisplay,
  formatPhoneNumber,
  isCoffeeShopOpenNow,
} from './coffee';

test('formatPrice formats Kazakhstani Tenge amounts with thousands separator', () => {
  assert.equal(formatPrice(0), '0 ₸');
  assert.equal(formatPrice(1390), '1 390 ₸');
  assert.equal(formatPrice(10500), '10 500 ₸');
});

test('calculateLineSubtotal computes price times quantity accurately', () => {
  assert.equal(calculateLineSubtotal(1390, 2), 2780);
  assert.equal(calculateLineSubtotal(0, 5), 0);
  assert.equal(calculateLineSubtotal(1500, 0), 0);
});

test('calculateOrderTotals correctly aggregates items and subtotals', () => {
  const items = [
    { id: 'item1', name: 'Флэт Уайт', price: 1390, qty: 2, subtotal: 2780, category: 'coffee', unit: '350 мл', image: '' },
    { id: 'item2', name: 'Пончики', price: 990, qty: 1, subtotal: 990, category: 'food', unit: '2 шт', image: '' },
  ];
  const { totalQty, totalPrice } = calculateOrderTotals(items);
  assert.equal(totalQty, 3);
  assert.equal(totalPrice, 3770);
});

test('isCoffeeShopOpenNow returns a boolean status', () => {
  const isOpen = isCoffeeShopOpenNow();
  assert.equal(typeof isOpen, 'boolean');
});

test('generateReferenceCode formats reference with expected prefix and year', () => {
  const code = generateReferenceCode('BK');
  assert.match(code, /^#BK-2026-\d{4}$/);
});

test('formatDateDisplay converts YYYY-MM-DD to DD.MM.YYYY', () => {
  assert.equal(formatDateDisplay('2026-11-08'), '08.11.2026');
});

test('formatPhoneNumber formats Kazakhstan telephone numbers correctly', () => {
  assert.equal(formatPhoneNumber('77771234567'), '+7 (777) 123-45-67');
  assert.equal(formatPhoneNumber('87015554433'), '+7 (701) 555-44-33');
});
