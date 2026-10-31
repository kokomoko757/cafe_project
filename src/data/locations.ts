import { BranchLocation } from '../types';

export const FLAGSHIP_LOCATIONS = [
  {
    name: 'Флагман на Туркестан',
    rating: '★ 5.0',
    address: 'улица Туркестан, 4Б',
    hours: 'Ежедневно: 08:00 – 24:00',
    description: 'Зал с мягкой мебелью, быстрый Wi-Fi и полный ассортимент десертов.',
    actionLabel: 'Забронировать стол',
    actionRoute: 'booking'
  },
  {
    name: 'Мангилик Ел',
    rating: '★ 4.9',
    address: 'проспект Мангилик Ел, 38',
    hours: 'Ежедневно: 08:00 – 23:00',
    description: 'Идеальная локация в деловом центре левого берега для бизнес-встреч.',
    actionLabel: 'Онлайн-заказ с собой',
    actionRoute: 'order'
  },
  {
    name: 'ТРЦ MEGA Silk Way',
    rating: '★ 4.9',
    address: 'проспект Кабанбай батыра, 62',
    hours: 'Ежедневно: 10:00 – 22:00',
    description: 'Удобно отдохнуть за любимым рафом во время шопинга.',
    actionLabel: 'Посмотреть меню',
    actionRoute: 'menu'
  }
];

export const ALL_BRANCHES: BranchLocation[] = [
  // 1-6
  { id: 1, address: 'проспект Бауыржан Момышулы, 2в', rating: '4,9', note: '—' },
  { id: 2, address: 'проспект Мангилик Ел, 38', rating: '4,9', note: '—' },
  { id: 3, address: 'проспект Кабанбай батыра, 38/1', rating: '4,9', note: '—' },
  { id: 4, address: 'улица Бухар жырау, 34а', rating: '4,9', note: '—' },
  { id: 5, address: 'проспект Туран, 44/2', rating: '4,8', note: '—' },
  { id: 6, address: 'улица Жошы хан, 14/1', rating: '4,9', note: '—' },
  // 7-12
  { id: 7, address: 'улица Туркестан, 4Б', rating: '5,0', note: 'Флагман', isFlagship: true },
  { id: 8, address: 'улица Ахмет Байтурсынулы, 2', rating: '4,8', note: '—' },
  { id: 9, address: 'проспект Мангилик Ел, 55а, блок С', rating: '4,9', note: '—' },
  { id: 10, address: 'проспект Улы Дала, 41/2', rating: '4,9', note: '—' },
  { id: 11, address: 'проспект Бауыржан Момышулы, 11а', rating: '4,8', note: '—' },
  { id: 12, address: 'проспект Туран, 53в', rating: '3,9', note: '—' },
  // 13-18
  { id: 13, address: 'проспект Улы Дала, 33', rating: '4,6', note: '—' },
  { id: 14, address: 'ТРЦ MEGA Silk Way, проспект Кабанбай батыра, 62', rating: '4,9', note: '—' },
  { id: 15, address: 'проспект Туран, 57/3', rating: '4,8', note: '—' },
  { id: 16, address: 'проспект Мангилик Ел, 55/1', rating: '4,5', note: 'Уточняйте режим работы' },
  { id: 17, address: 'ТРЦ Green Mall, улица Сыганак, 17Б', rating: '4,9', note: '—' },
  { id: 18, address: 'улица Санжара Асфендиярова, 4', rating: '4,7', note: '—' },
  // 19-24
  { id: 19, address: 'улица Е-36, 11', rating: '4,8', note: '—' },
  { id: 20, address: 'улица Санжара Асфендиярова, 10', rating: '4,8', note: '—' },
  { id: 21, address: 'улица Амангельды Иманова, 19а', rating: '4,9', note: '—' },
  { id: 22, address: 'Парк Астана, проспект Туран, 4/5', rating: '4,6', note: '—' },
  { id: 23, address: 'улица Кайым Мухамедханова, 23/1', rating: '4,8', note: 'Уточняйте режим работы' },
  { id: 24, address: 'улица Кенесары, 45', rating: '4,9', note: '—' },
  // 25-28
  { id: 25, address: 'улица Мухамеджан Тынышбайулы, 8', rating: '4,8', note: '—' },
  { id: 26, address: 'улица Сакена Сейфуллина, 17', rating: '4,9', note: '—' },
  { id: 27, address: 'проспект Женис, 71', rating: '4,9', note: '—' },
  { id: 28, address: 'проспект Кабанбай батыра, 119', rating: '4,6', note: 'Временно не работает', isTemporarilyClosed: true }
];
