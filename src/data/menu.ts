import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'espresso',
    name: 'Эспрессо',
    category: 'coffee',
    price: 850,
    volume: '200 мл / 300 мл',
    description: 'Плотный шот с плотной золотистой крема из 100% арабики',
    image: '/images/item-espresso.jpg',
    inStock: true
  },
  {
    id: 'americano',
    name: 'Американо',
    category: 'coffee',
    price: 890,
    volume: '200 / 300 / 400 мл',
    description: 'Классический мягкий эспрессо с горячей фильтрованной водой',
    image: '/images/item-americano.jpg',
    inStock: true
  },
  {
    id: 'cappuccino',
    name: 'Капучино',
    category: 'coffee',
    price: 1190,
    volume: '200 / 300 / 400 мл',
    description: 'Идеальный баланс эспрессо и бархатистой молочной микропены',
    image: '/images/item-cappuccino.jpg',
    inStock: true
  },
  {
    id: 'latte',
    name: 'Латте',
    category: 'coffee',
    price: 1190,
    volume: '200 / 300 / 400 мл',
    description: 'Нежный молочный кофейный напиток с тонким слоем пенки',
    image: '/images/item-latte.jpg',
    inStock: true
  },
  {
    id: 'nut_flat_white',
    name: 'Ореховый Флэт Уайт',
    category: 'coffee',
    price: 1390,
    volume: '200 / 300 / 400 мл',
    description: 'Двойной ристретто, шелковистое молоко и натуральная фундучная паста',
    image: '/images/item-nut-flat-white.jpg',
    inStock: true
  },
  {
    id: 'coconut_souffle',
    name: 'Кокосовое суфле',
    category: 'coffee',
    price: 1290,
    volume: '300 мл / 400 мл',
    description: 'Авторский кофе с воздушной сливочно-кокосовой пенкой и стружкой',
    image: '/images/item-coconut-souffle.jpg',
    inStock: true
  },
  {
    id: 'matcha_strawberry',
    name: 'Айс Матча Клубника',
    category: 'cold',
    price: 1690,
    volume: '350 мл / 450 мл',
    description: 'Японский церемониальный чай матча, молоко и клубничный конфитюр',
    image: '/images/item-matcha-strawberry.jpg',
    inStock: true
  },
  {
    id: 'frappe_cocoa',
    name: 'Фраппе Сливочный-Какао',
    category: 'cold',
    price: 1790,
    volume: '400 мл',
    description: 'Ледяной десертный фраппе со взбитыми сливками и бельгийским какао',
    image: '/images/item-frappe-cocoa.jpg',
    inStock: true
  },
  {
    id: 'tea_orange_strawberry',
    name: 'Чай Апельсин-Клубника',
    category: 'coffee',
    price: 1090,
    volume: '400 мл / 600 мл',
    description: 'Согревающий ягодный чай со свежими дольками цитруса и корицей',
    image: '/images/item-tea-orange.jpg',
    inStock: true
  },
  {
    id: 'bumble_coffee',
    name: 'Бамбл кофе',
    category: 'cold',
    price: 1390,
    volume: '350 мл',
    description: 'Свежевыжатый апельсиновый сок, карамельный сироп, эспрессо и лед',
    image: '/images/item-bumble.jpg',
    inStock: true
  },
  {
    id: 'lemonade_sakura',
    name: 'Лимонад Сакура',
    category: 'cold',
    price: 1490,
    volume: '400 мл',
    description: 'Освежающий цветочный тоник с нотами цветущей сакуры, лайма и мяты',
    image: '/images/item-lemonade-sakura.jpg',
    inStock: true
  },
  {
    id: 'smoothie_kiwi',
    name: 'Смузи Киви',
    category: 'cold',
    price: 1790,
    volume: '350 мл',
    description: 'Густой витаминный смузи из спелого киви, яблока и дробленого льда',
    image: '/images/item-smoothie-kiwi.jpg',
    inStock: true
  },
  {
    id: 'sandwich',
    name: 'Сэндвич с курицей',
    category: 'food',
    price: 1490,
    volume: '220 г',
    description: 'Хрустящий тост с филе цыпленка, сыром чеддер, томатами и зеленью',
    image: '/images/item-chicken-sandwich.jpg',
    inStock: true
  },
  {
    id: 'hotdog',
    name: 'Хот-дог гриль',
    category: 'food',
    price: 1190,
    volume: '190 г',
    description: 'Баварская подкопченная колбаска в булочке с карамелизированным луком',
    image: '/images/item-hotdog-grill.jpg',
    inStock: true
  },
  {
    id: 'donuts',
    name: 'Пончики шоколадные',
    category: 'food',
    price: 990,
    volume: '2 шт / 140 г',
    description: 'Пышные пончики с начинкой под глазурью из бельгийского шоколада',
    image: '/images/item-donuts-chocolate.jpg',
    inStock: true
  },
  {
    id: 'onigiri',
    name: 'Онигири с лососем',
    category: 'food',
    price: 890,
    volume: '130 г',
    description: 'Японский рисовый треугольник с начинкой из лосося терияки в нори',
    image: '/images/item-onigiri-salmon.jpg',
    inStock: true
  }
];

export interface OrderItemEntry {
  id: string;
  name: string;
  price: number;
  category: string;
  unit: string;
  image: string;
}

export const ORDER_ITEMS_CATALOG: OrderItemEntry[] = [
  { id: 'nut_flat_white', name: 'Ореховый Флэт Уайт', price: 1390, category: 'coffee', unit: '350 мл', image: '/images/item-nut-flat-white.jpg' },
  { id: 'frappe_cocoa', name: 'Фраппе Сливочный-Какао', price: 1790, category: 'cold', unit: '400 мл', image: '/images/item-frappe-cocoa.jpg' },
  { id: 'ice_matcha_strawberry', name: 'Айс Матча Клубника', price: 1690, category: 'cold', unit: '350 мл', image: '/images/item-matcha-strawberry.jpg' },
  { id: 'tea_orange_strawberry', name: 'Чай Апельсин-Клубника', price: 1090, category: 'coffee', unit: '400 мл', image: '/images/item-tea-orange.jpg' },
  { id: 'lemonade_sakura', name: 'Лимонад Сакура', price: 1490, category: 'cold', unit: '400 мл', image: '/images/item-lemonade-sakura.jpg' },
  { id: 'smoothie_kiwi', name: 'Смузи Киви', price: 1790, category: 'cold', unit: '350 мл', image: '/images/item-smoothie-kiwi.jpg' },
  { id: 'sandwich', name: 'Сэндвич с курицей', price: 1490, category: 'food', unit: '220 г', image: '/images/item-chicken-sandwich.jpg' },
  { id: 'hotdog', name: 'Хот-дог гриль', price: 1190, category: 'food', unit: '190 г', image: '/images/item-hotdog-grill.jpg' },
  { id: 'donuts', name: 'Пончики шоколадные', price: 990, category: 'food', unit: '2 шт', image: '/images/item-donuts-chocolate.jpg' },
  { id: 'onigiri', name: 'Онигири с лососем', price: 890, category: 'food', unit: '130 г', image: '/images/item-onigiri-salmon.jpg' }
];

export const DAILY_RECOMMENDATIONS = [
  { name: 'Ореховый Флэт Уайт', note: 'Двойной эспрессо и натуральная паста из лесного фундука' },
  { name: 'Айс Матча Клубника', note: 'Освежающая японская матча с пюре из спелых ягод' },
  { name: 'Фраппе Сливочный-Какао', note: 'Ледяной десертный напиток со взбитыми сливками' },
  { name: 'Бамбл Кофе Свежевыжатый', note: 'Слоистый микс эспрессо и апельсинового фреша со льдом' },
  { name: 'Лимонад Сакура', note: 'Искрящийся цветочный тоник с японской вишней и мятой' }
];
