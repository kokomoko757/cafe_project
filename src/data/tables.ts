import { TableInfo } from '../types';

export const TABLES_CATALOG: TableInfo[] = [
  { id: 1, name: 'Стол 1', seats: 2, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000, isAvailable: true },
  { id: 2, name: 'Стол 2', seats: 2, zone: 'Центральный зал', depositPerGuest: 1000, isAvailable: true },
  { id: 3, name: 'Стол 3', seats: 4, zone: 'Lounge-зона у бара', depositPerGuest: 1000, isAvailable: true },
  { id: 4, name: 'Стол 4', seats: 4, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000, isAvailable: true },
  { id: 5, name: 'Стол 5', seats: 6, zone: 'Центральный зал', depositPerGuest: 1000, isAvailable: false },
  { id: 6, name: 'Стол 6', seats: 4, zone: 'Lounge-зона у бара', depositPerGuest: 1000, isAvailable: true },
  { id: 7, name: 'Стол 7', seats: 2, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000, isAvailable: true },
  { id: 8, name: 'Стол 8', seats: 4, zone: 'Центральный зал', depositPerGuest: 1000, isAvailable: true },
  { id: 9, name: 'Стол 9', seats: 6, zone: 'Lounge-зона у бара', depositPerGuest: 1000, isAvailable: true }
];

export function findTableById(tableId: number | string): TableInfo | undefined {
  const numId = typeof tableId === 'string' ? parseInt(tableId, 10) : tableId;
  return TABLES_CATALOG.find(t => t.id === numId);
}
