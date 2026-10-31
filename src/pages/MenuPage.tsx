import React, { useState, useMemo } from 'react';
import { formatPrice } from '../utils/coffee';

interface MenuPageProps {
  onNavigate: (page: string) => void;
}

interface MenuColumnItem {
  id: string;
  name: string;
  sub: string;
  price: number;
  badgeClass: string;
  image: string;
  category: 'coffee' | 'cold' | 'food';
}

const MENU_GROUPS: {
  id: string;
  title: string;
  subtitle: string;
  category: 'coffee' | 'cold' | 'food';
  items: MenuColumnItem[];
}[] = [
  {
    id: 'classic',
    title: 'Классика (кофе)',
    subtitle: '100% свежеобжаренная Арабика',
    category: 'coffee',
    items: [
      { id: 'espresso', name: 'Эспрессо', sub: '200 мл / 300 мл', price: 850, badgeClass: 'bg-secondary', image: '/images/item-espresso.jpg', category: 'coffee' },
      { id: 'americano', name: 'Американо', sub: '200 / 300 / 400 мл', price: 890, badgeClass: 'bg-secondary', image: '/images/item-americano.jpg', category: 'coffee' },
      { id: 'cappuccino', name: 'Капучино', sub: '200 / 300 / 400 мл', price: 1190, badgeClass: 'bg-secondary', image: '/images/item-cappuccino.jpg', category: 'coffee' },
      { id: 'latte', name: 'Латте', sub: '200 / 300 / 400 мл', price: 1190, badgeClass: 'bg-secondary', image: '/images/item-latte.jpg', category: 'coffee' },
      { id: 'nut_flat_white', name: 'Флэт Уайт', sub: 'Двойной шот эспрессо', price: 1390, badgeClass: 'bg-secondary', image: '/images/item-nut-flat-white.jpg', category: 'coffee' }
    ]
  },
  {
    id: 'signature',
    title: 'Фирменные напитки',
    subtitle: 'Авторские рецепты шеф-бариста',
    category: 'coffee',
    items: [
      { id: 'coconut_souffle', name: 'Кокосовое суфле', sub: 'Сливочно-кокосовая пенка', price: 1290, badgeClass: 'bg-primary', image: '/images/item-coconut-souffle.jpg', category: 'coffee' },
      { id: 'matcha_strawberry', name: 'Матча Клубника', sub: 'Японская матча и ягоды', price: 1690, badgeClass: 'bg-primary', image: '/images/item-matcha-strawberry.jpg', category: 'cold' },
      { id: 'frappe_cocoa', name: 'Какао густой', sub: 'Насыщенный шоколад', price: 1090, badgeClass: 'bg-primary', image: '/images/item-frappe-cocoa.jpg', category: 'cold' },
      { id: 'nut_flat_white_2', name: 'Ореховый Флэт', sub: 'Фундучная паста', price: 1390, badgeClass: 'bg-primary', image: '/images/item-nut-flat-white.jpg', category: 'coffee' },
      { id: 'tea_orange', name: 'Чай Апельсин', sub: 'Цитрус и свежие ягоды', price: 1090, badgeClass: 'bg-primary', image: '/images/item-tea-orange.jpg', category: 'coffee' }
    ]
  },
  {
    id: 'cold_drinks',
    title: 'Холодные напитки',
    subtitle: 'Освежающие напитки со льдом',
    category: 'cold',
    items: [
      { id: 'bumble_coffee', name: 'Бамбл кофе', sub: 'Эспрессо, карамель, фреш', price: 1390, badgeClass: 'bg-info text-dark', image: '/images/item-bumble.jpg', category: 'cold' },
      { id: 'cold_latte', name: 'Айс Латте', sub: 'Холодная молочная пенка', price: 1590, badgeClass: 'bg-info text-dark', image: '/images/cold-drinks.jpg', category: 'cold' },
      { id: 'smoothie_kiwi', name: 'Смузи Киви', sub: 'Киви, яблоко, банан', price: 1790, badgeClass: 'bg-info text-dark', image: '/images/item-smoothie-kiwi.jpg', category: 'cold' },
      { id: 'lemonade_sakura', name: 'Лимонад Сакура', sub: 'Цветочный тоник с мятой', price: 1490, badgeClass: 'bg-info text-dark', image: '/images/item-lemonade-sakura.jpg', category: 'cold' },
      { id: 'frappe_cocoa_cold', name: 'Фраппе Какао', sub: 'Дробленый лед и сливки', price: 1790, badgeClass: 'bg-info text-dark', image: '/images/item-frappe-cocoa.jpg', category: 'cold' }
    ]
  },
  {
    id: 'food_pastry',
    title: 'Выпечка и еда',
    subtitle: 'Свежая выпечка и горячие закуски',
    category: 'food',
    items: [
      { id: 'sandwich', name: 'Сэндвич с курицей', sub: 'Сыр чеддер и томаты', price: 1490, badgeClass: 'bg-success', image: '/images/item-chicken-sandwich.jpg', category: 'food' },
      { id: 'hotdog', name: 'Хот-дог гриль', sub: 'Баварская колбаска', price: 1190, badgeClass: 'bg-success', image: '/images/item-hotdog-grill.jpg', category: 'food' },
      { id: 'donuts', name: 'Пончики (2 шт)', sub: 'Шоколадная глазурь', price: 990, badgeClass: 'bg-success', image: '/images/item-donuts-chocolate.jpg', category: 'food' },
      { id: 'onigiri', name: 'Онигири лосось', sub: 'Рис, нори и соус терияки', price: 890, badgeClass: 'bg-success', image: '/images/item-onigiri-salmon.jpg', category: 'food' }
    ]
  }
];

export const MenuPage: React.FC<MenuPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'cold' | 'food'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  const filteredGroups = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return MENU_GROUPS.map(group => {
      let matchesCategory = true;
      if (activeCategory === 'coffee') {
        matchesCategory = group.category === 'coffee' || group.id === 'classic' || group.id === 'signature';
      } else if (activeCategory === 'cold') {
        matchesCategory = group.category === 'cold' || group.id === 'cold_drinks';
      } else if (activeCategory === 'food') {
        matchesCategory = group.category === 'food' || group.id === 'food_pastry';
      }

      if (!matchesCategory) {
        return { ...group, items: [] };
      }

      const matchingItems = group.items.filter(item => {
        if (!cleanQuery) return true;
        return (
          item.name.toLowerCase().includes(cleanQuery) ||
          item.sub.toLowerCase().includes(cleanQuery)
        );
      });

      return {
        ...group,
        items: matchingItems
      };
    }).filter(group => group.items.length > 0);
  }, [activeCategory, searchQuery]);

  const totalVisibleItems = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, [filteredGroups]);

  const isFilteringActive = activeCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <main className="page-content container py-5">
      {/* Заголовок страницы и вводный текст */}
      <div className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white text-center text-md-start">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div>
            <h1 className="display-6 fw-bold mb-2">Наше Меню Напитков</h1>
            <p className="lead text-muted mb-0">
              В Global Coffee мы тщательно отбираем зерна для каждого напитка. Актуальные цены указаны за разные объемы (200 мл / 300 мл / 400 мл).
            </p>
          </div>
          <div className="d-flex gap-2 justify-content-center justify-content-md-end">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('order')}
            >
              Оформить онлайн-заказ
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-lg"
              onClick={() => onNavigate('booking')}
            >
              Забронировать стол
            </button>
          </div>
        </div>
      </div>

      {/* Поиск и фильтры меню */}
      <div className="card shadow-sm border rounded-3 p-3 p-md-4 mb-5 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <label htmlFor="menuSearchInput" className="visually-hidden">Поиск по меню</label>
            <input
              type="search"
              id="menuSearchInput"
              className="form-control"
              placeholder="Поиск напитка или десерта..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchQuery('');
              }}
            />
          </div>

          <div className="col-12 col-md-7 d-flex flex-wrap gap-2 justify-content-md-end">
            <button
              type="button"
              id="filterAll"
              className={`btn btn-sm ${activeCategory === 'all' ? 'btn-outline-primary active' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('all')}
            >
              Все позиции
            </button>
            <button
              type="button"
              id="filterCoffee"
              className={`btn btn-sm ${activeCategory === 'coffee' ? 'btn-outline-primary active' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('coffee')}
            >
              Кофе
            </button>
            <button
              type="button"
              id="filterCold"
              className={`btn btn-sm ${activeCategory === 'cold' ? 'btn-outline-primary active' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('cold')}
            >
              Холодные напитки
            </button>
            <button
              type="button"
              id="filterFood"
              className={`btn btn-sm ${activeCategory === 'food' ? 'btn-outline-primary active' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory('food')}
            >
              Выпечка и еда
            </button>

            {isFilteringActive && (
              <button
                type="button"
                id="menuResetBtn"
                className="btn btn-outline-dark btn-sm ms-2 align-self-center"
                title="Очистить строку поиска и показать все категории"
                onClick={handleResetFilters}
              >
                ✕ Сбросить фильтры
              </button>
            )}
          </div>
        </div>

        {/* Dynamic results count or empty state */}
        <div id="menuSearchResults" className="text-muted small mt-2">
          {isFilteringActive && (
            totalVisibleItems > 0 ? (
              <div>
                <span className="badge bg-success me-2">Найдено: {totalVisibleItems}</span>
                <span className="text-muted">позиций в меню по вашему запросу</span>
              </div>
            ) : (
              <div className="alert alert-warning d-flex align-items-center justify-content-between p-3 mt-2 rounded-3">
                <div>
                  <span className="fs-5 me-2">🔍</span>
                  <strong>Ничего не найдено: </strong>
                  <span>по запросу «{searchQuery.trim()}» в выбранной категории позиций нет.</span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm ms-3"
                  onClick={handleResetFilters}
                >
                  Сбросить поиск
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Каталог меню: 4 колонки */}
      <section className="mb-5">
        <h2 className="section-title h3 fw-bold mb-4 border-bottom pb-2">Каталог меню напитков и выпечки</h2>
        <div className="row g-4">
          {filteredGroups.map(group => (
            <div key={group.id} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm border rounded-3 overflow-hidden">
                <div className="card-header bg-dark text-white py-3">
                  <h3 className="h5 fw-bold mb-0">{group.title}</h3>
                  <small className="text-white-50">{group.subtitle}</small>
                </div>
                <ul className="list-group list-group-flush">
                  {group.items.map(item => (
                    <li key={item.id} className="list-group-item d-flex align-items-center py-3 gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded-3 menu-item-thumb"
                        width={60}
                        height={60}
                      />
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">{item.name}</span>
                        <div className="small text-muted">{item.sub}</div>
                      </div>
                      <span className={`badge rounded-pill ${item.badgeClass}`}>
                        {formatPrice(item.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Галерея напитков */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <h2 className="section-title h3 fw-bold mb-3 border-bottom pb-2">Галерея наших напитков</h2>
        <p className="text-muted small mb-4">
          Наши бариста не только варят вкусный кофе, но и создают настоящие шедевры латте-арта.
        </p>

        <div className="row g-4 align-items-center justify-content-center">
          <div className="col-12 col-md-6 text-center">
            <figure className="figure mb-0">
              <img
                src="/images/latte-art.jpg"
                alt="Красивый латте-арт в чашке капучино"
                className="figure-img img-fluid rounded-3 shadow"
              />
              <figcaption className="figure-caption text-muted mt-2 fw-semibold">
                Классический латте-арт в исполнении наших бариста
              </figcaption>
            </figure>
          </div>
          <div className="col-12 col-md-6">
            <div className="p-3 bg-light border rounded-3">
              <h3 className="h5 fw-bold text-primary mb-2">Искусство создания идеальной чашки</h3>
              <p className="small text-muted mb-2">
                Каждый напиток готовится на свежем молоке оптимальной температуры (60–65°C), что позволяет раскрыть естественную сладость без добавления сахара.
              </p>
              <p className="small text-muted mb-0">
                Попробуйте наши авторские сиропы собственного приготовления: лаванда, соленая карамель, лесной орех и белый шоколад.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
