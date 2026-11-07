// Данные меню. Цены и фотографии сохранены из исходного проекта.
const MENU_ITEMS = [
  {
    "name": "Эспрессо",
    "note": "200 мл / 300 мл",
    "image": "images/item-espresso.jpg",
    "alt": "Эспрессо",
    "price": 850,
    "badge": "badge bg-secondary rounded-pill",
    "group": 0,
    "category": "coffee"
  },
  {
    "name": "Американо",
    "note": "200 / 300 / 400 мл",
    "image": "images/item-americano.jpg",
    "alt": "Американо",
    "price": 890,
    "badge": "badge bg-secondary rounded-pill",
    "group": 0,
    "category": "coffee"
  },
  {
    "name": "Капучино",
    "note": "200 / 300 / 400 мл",
    "image": "images/item-cappuccino.jpg",
    "alt": "Капучино",
    "price": 1190,
    "badge": "badge bg-secondary rounded-pill",
    "group": 0,
    "category": "coffee"
  },
  {
    "name": "Латте",
    "note": "200 / 300 / 400 мл",
    "image": "images/item-latte.jpg",
    "alt": "Латте",
    "price": 1190,
    "badge": "badge bg-secondary rounded-pill",
    "group": 0,
    "category": "coffee"
  },
  {
    "name": "Флэт Уайт",
    "note": "Двойной шот эспрессо",
    "image": "images/item-nut-flat-white.jpg",
    "alt": "Ореховый Флэт Уайт",
    "price": 1390,
    "badge": "badge bg-secondary rounded-pill",
    "group": 0,
    "category": "coffee"
  },
  {
    "name": "Кокосовое суфле",
    "note": "Сливочно-кокосовая пенка",
    "image": "images/item-coconut-souffle.jpg",
    "alt": "Кокосовое суфле",
    "price": 1290,
    "badge": "badge bg-primary rounded-pill",
    "group": 1,
    "category": "coffee"
  },
  {
    "name": "Матча Клубника",
    "note": "Японская матча и ягоды",
    "image": "images/item-matcha-strawberry.jpg",
    "alt": "Айс Матча Клубника",
    "price": 1690,
    "badge": "badge bg-primary rounded-pill",
    "group": 1,
    "category": "coffee"
  },
  {
    "name": "Какао густой",
    "note": "Насыщенный шоколад",
    "image": "images/item-frappe-cocoa.jpg",
    "alt": "Какао густой",
    "price": 1090,
    "badge": "badge bg-primary rounded-pill",
    "group": 1,
    "category": "coffee"
  },
  {
    "name": "Ореховый Флэт",
    "note": "Фундучная паста",
    "image": "images/item-nut-flat-white.jpg",
    "alt": "Ореховый Флэт Уайт",
    "price": 1390,
    "badge": "badge bg-primary rounded-pill",
    "group": 1,
    "category": "coffee"
  },
  {
    "name": "Чай Апельсин",
    "note": "Цитрус и свежие ягоды",
    "image": "images/item-tea-orange.jpg",
    "alt": "Чай Апельсин-Клубника",
    "price": 1090,
    "badge": "badge bg-primary rounded-pill",
    "group": 1,
    "category": "coffee"
  },
  {
    "name": "Бамбл кофе",
    "note": "Эспрессо, карамель, фреш",
    "image": "images/item-bumble.jpg",
    "alt": "Бамбл кофе",
    "price": 1390,
    "badge": "badge bg-info text-dark rounded-pill",
    "group": 2,
    "category": "cold"
  },
  {
    "name": "Айс Латте",
    "note": "Холодная молочная пенка",
    "image": "images/cold-drinks.jpg",
    "alt": "Айс Латте",
    "price": 1590,
    "badge": "badge bg-info text-dark rounded-pill",
    "group": 2,
    "category": "cold"
  },
  {
    "name": "Смузи Киви",
    "note": "Киви, яблоко, банан",
    "image": "images/item-smoothie-kiwi.jpg",
    "alt": "Смузи Киви",
    "price": 1790,
    "badge": "badge bg-info text-dark rounded-pill",
    "group": 2,
    "category": "cold"
  },
  {
    "name": "Лимонад Сакура",
    "note": "Цветочный тоник с мятой",
    "image": "images/item-lemonade-sakura.jpg",
    "alt": "Лимонад Сакура",
    "price": 1490,
    "badge": "badge bg-info text-dark rounded-pill",
    "group": 2,
    "category": "cold"
  },
  {
    "name": "Фраппе Какао",
    "note": "Дробленый лед и сливки",
    "image": "images/item-frappe-cocoa.jpg",
    "alt": "Фраппе Сливочный-Какао",
    "price": 1790,
    "badge": "badge bg-info text-dark rounded-pill",
    "group": 2,
    "category": "cold"
  },
  {
    "name": "Сэндвич с курицей",
    "note": "Сыр чеддер и томаты",
    "image": "images/item-chicken-sandwich.jpg",
    "alt": "Сэндвич с курицей",
    "price": 1490,
    "badge": "badge bg-success rounded-pill",
    "group": 3,
    "category": "food"
  },
  {
    "name": "Хот-дог гриль",
    "note": "Баварская колбаска",
    "image": "images/item-hotdog-grill.jpg",
    "alt": "Хот-дог гриль",
    "price": 1190,
    "badge": "badge bg-success rounded-pill",
    "group": 3,
    "category": "food"
  },
  {
    "name": "Пончики (2 шт)",
    "note": "Шоколадная глазурь",
    "image": "images/item-donuts-chocolate.jpg",
    "alt": "Пончики шоколадные",
    "price": 990,
    "badge": "badge bg-success rounded-pill",
    "group": 3,
    "category": "food"
  },
  {
    "name": "Онигири лосось",
    "note": "Рис, нори и соус терияки",
    "image": "images/item-onigiri-salmon.jpg",
    "alt": "Онигири с лососем",
    "price": 890,
    "badge": "badge bg-success rounded-pill",
    "group": 3,
    "category": "food"
  }
];
