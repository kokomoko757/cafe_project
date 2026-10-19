

'use strict';

const MENU_CATALOG = [
    {
        id: 'espresso',
        name: 'Эспрессо',
        category: 'coffee',
        price: 850,
        volume: '200 мл / 300 мл',
        description: 'Плотный шот с плотной золотистой крема из 100% арабики',
        image: 'images/item-espresso.jpg',
        inStock: true
    },
    {
        id: 'americano',
        name: 'Американо',
        category: 'coffee',
        price: 890,
        volume: '200 / 300 / 400 мл',
        description: 'Классический мягкий эспрессо с горячей фильтрованной водой',
        image: 'images/item-americano.jpg',
        inStock: true
    },
    {
        id: 'cappuccino',
        name: 'Капучино',
        category: 'coffee',
        price: 1190,
        volume: '200 / 300 / 400 мл',
        description: 'Идеальный баланс эспрессо и бархатистой молочной микропены',
        image: 'images/item-cappuccino.jpg',
        inStock: true
    },
    {
        id: 'latte',
        name: 'Латте',
        category: 'coffee',
        price: 1190,
        volume: '200 / 300 / 400 мл',
        description: 'Нежный молочный кофейный напиток с тонким слоем пенки',
        image: 'images/item-latte.jpg',
        inStock: true
    },
    {
        id: 'nut_flat_white',
        name: 'Ореховый Флэт Уайт',
        category: 'coffee',
        price: 1390,
        volume: '200 / 300 / 400 мл',
        description: 'Двойной ристретто, шелковистое молоко и натуральная фундучная паста',
        image: 'images/item-nut-flat-white.jpg',
        inStock: true
    },
    {
        id: 'coconut_souffle',
        name: 'Кокосовое суфле',
        category: 'coffee',
        price: 1290,
        volume: '300 мл / 400 мл',
        description: 'Авторский кофе с воздушной сливочно-кокосовой пенкой и стружкой',
        image: 'images/item-coconut-souffle.jpg',
        inStock: true
    },
    {
        id: 'matcha_strawberry',
        name: 'Айс Матча Клубника',
        category: 'cold',
        price: 1690,
        volume: '350 мл / 450 мл',
        description: 'Японский церемониальный чай матча, молоко и клубничный конфитюр',
        image: 'images/item-matcha-strawberry.jpg',
        inStock: true
    },
    {
        id: 'frappe_cocoa',
        name: 'Фраппе Сливочный-Какао',
        category: 'cold',
        price: 1790,
        volume: '400 мл',
        description: 'Ледяной десертный фраппе со взбитыми сливками и бельгийским какао',
        image: 'images/item-frappe-cocoa.jpg',
        inStock: true
    },
    {
        id: 'tea_orange_strawberry',
        name: 'Чай Апельсин-Клубника',
        category: 'coffee',
        price: 1090,
        volume: '400 мл / 600 мл',
        description: 'Согревающий ягодный чай со свежими дольками цитруса и корицей',
        image: 'images/item-tea-orange.jpg',
        inStock: true
    },
    {
        id: 'bumble_coffee',
        name: 'Бамбл кофе',
        category: 'cold',
        price: 1390,
        volume: '350 мл',
        description: 'Свежевыжатый апельсиновый сок, карамельный сироп, эспрессо и лед',
        image: 'images/item-bumble.jpg',
        inStock: true
    },
    {
        id: 'lemonade_sakura',
        name: 'Лимонад Сакура',
        category: 'cold',
        price: 1490,
        volume: '400 мл',
        description: 'Освежающий цветочный тоник с нотами цветущей сакуры, лайма и мяты',
        image: 'images/item-lemonade-sakura.jpg',
        inStock: true
    },
    {
        id: 'smoothie_kiwi',
        name: 'Смузи Киви',
        category: 'cold',
        price: 1790,
        volume: '350 мл',
        description: 'Густой витаминный смузи из спелого киви, яблока и дробленого льда',
        image: 'images/item-smoothie-kiwi.jpg',
        inStock: true
    },
    {
        id: 'sandwich',
        name: 'Сэндвич с курицей',
        category: 'food',
        price: 1490,
        volume: '220 г',
        description: 'Хрустящий тост с филе цыпленка, сыром чеддер, томатами и зеленью',
        image: 'images/item-chicken-sandwich.jpg',
        inStock: true
    },
    {
        id: 'hotdog',
        name: 'Хот-дог гриль',
        category: 'food',
        price: 1190,
        volume: '190 г',
        description: 'Баварская подкопченная колбаска в булочке с карамелизированным луком',
        image: 'images/item-hotdog-grill.jpg',
        inStock: true
    },
    {
        id: 'donuts',
        name: 'Пончики шоколадные',
        category: 'food',
        price: 990,
        volume: '2 шт / 140 г',
        description: 'Пышные пончики с начинкой под глазурью из бельгийского шоколада',
        image: 'images/item-donuts-chocolate.jpg',
        inStock: true
    },
    {
        id: 'onigiri',
        name: 'Онигири с лососем',
        category: 'food',
        price: 890,
        volume: '130 г',
        description: 'Японский рисовый треугольник с начинкой из лосося терияки в нори',
        image: 'images/item-onigiri-salmon.jpg',
        inStock: true
    }
];

let activeCategory = 'all';

function filterMenuCatalog(catalog, category, searchQuery) {
    if (!Array.isArray(catalog)) {
        return [];
    }

    const cleanQuery = window.GlobalCoffee && typeof window.GlobalCoffee.sanitizeText === 'function'
        ? window.GlobalCoffee.sanitizeText(searchQuery).toLowerCase()
        : searchQuery.trim().toLowerCase();

    return catalog.filter(item => {
        const matchesCategory = category === 'all' || item.category === category;
        const matchesSearch = cleanQuery === '' ||
            item.name.toLowerCase().includes(cleanQuery) ||
            item.description.toLowerCase().includes(cleanQuery);

        return matchesCategory && matchesSearch;
    });
}

function countAvailableItems(items) {
    if (!Array.isArray(items)) {
        return 0;
    }
    return items.reduce((count, item) => {
        return item.inStock === true ? count + 1 : count;
    }, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    initMenuFilterControls();
    initMenuSearchInput();
    initMenuResetControl();
});

function initMenuFilterControls() {
    const filterButtons = {
        all: document.getElementById('filterAll'),
        coffee: document.getElementById('filterCoffee'),
        cold: document.getElementById('filterCold'),
        food: document.getElementById('filterFood')
    };

    if (!filterButtons.all) {
        return;
    }

    const categoryKeys = Object.keys(filterButtons);
    categoryKeys.forEach(catKey => {
        const button = filterButtons[catKey];
        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            categoryKeys.forEach(k => {
                const b = filterButtons[k];
                if (b) {
                    b.classList.remove('active', 'btn-outline-primary', 'btn-primary');
                    b.classList.add('btn-outline-secondary');
                }
            });

            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-outline-primary', 'active');

            activeCategory = catKey;
            applyMenuFilters();
        });
    });
}

function initMenuSearchInput() {
    const searchInput = document.getElementById('menuSearchInput');
    if (!searchInput) {
        return;
    }

    searchInput.addEventListener('input', () => {
        applyMenuFilters();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            applyMenuFilters();
        }
    });
}

function initMenuResetControl() {
    const searchCard = document.querySelector('#menuSearchInput')?.closest('.card');
    if (!searchCard || document.getElementById('menuResetBtn')) {
        return;
    }

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.id = 'menuResetBtn';
    resetBtn.className = 'btn btn-outline-dark btn-sm ms-2 align-self-center';
    resetBtn.textContent = '✕ Сбросить фильтры';
    resetBtn.title = 'Очистить строку поиска и показать все категории';

    resetBtn.addEventListener('click', () => {
        resetAllMenuFilters();
    });

    const buttonGroup = searchCard.querySelector('.col-md-7');
    if (buttonGroup) {
        buttonGroup.appendChild(resetBtn);
    }
}

function resetAllMenuFilters() {
    const searchInput = document.getElementById('menuSearchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    activeCategory = 'all';

    const filterAllBtn = document.getElementById('filterAll');
    if (filterAllBtn) {
        document.querySelectorAll('#filterAll, #filterCoffee, #filterCold, #filterFood').forEach(btn => {
            btn.classList.remove('active', 'btn-outline-primary', 'btn-primary');
            btn.classList.add('btn-outline-secondary');
        });
        filterAllBtn.classList.remove('btn-outline-secondary');
        filterAllBtn.classList.add('btn-outline-primary', 'active');
    }

    applyMenuFilters();
}

function applyMenuFilters() {
    const searchInput = document.getElementById('menuSearchInput');
    const rawQuery = searchInput ? searchInput.value : '';
    const cleanQuery = rawQuery.trim().toLowerCase();
    const resultsContainer = document.getElementById('menuSearchResults');

    const cardGroups = document.querySelectorAll('.page-content .card .list-group');
    let totalVisible = 0;

    cardGroups.forEach(listGroup => {
        const cardCol = listGroup.closest('.col-12');
        const cardHeaderTitle = cardCol ? cardCol.querySelector('.card-header h3')?.textContent.toLowerCase() : '';
        const items = listGroup.querySelectorAll('.list-group-item');

        let cardHasMatches = false;

        let matchesCategory = true;
        if (activeCategory === 'coffee') {
            matchesCategory = cardHeaderTitle.includes('классика') || cardHeaderTitle.includes('фирменные');
        } else if (activeCategory === 'cold') {
            matchesCategory = cardHeaderTitle.includes('холодные');
        } else if (activeCategory === 'food') {
            matchesCategory = cardHeaderTitle.includes('еда') || cardHeaderTitle.includes('выпечка');
        }

        items.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            const matchesSearch = cleanQuery === '' || itemText.includes(cleanQuery);

            if (matchesCategory && matchesSearch) {
                item.classList.remove('hidden');
                totalVisible += 1;
                cardHasMatches = true;
            } else {
                item.classList.add('hidden');
            }
        });

        if (cardCol) {
            if (cardHasMatches) {
                cardCol.classList.remove('hidden');
            } else {
                cardCol.classList.add('hidden');
            }
        }
    });

    if (resultsContainer) {
        resultsContainer.replaceChildren();

        if (cleanQuery !== '' || activeCategory !== 'all') {
            if (totalVisible > 0) {
                const countBadge = document.createElement('span');
                countBadge.className = 'badge bg-success me-2';
                countBadge.textContent = `Найдено: ${totalVisible}`;

                const textSpan = document.createElement('span');
                textSpan.className = 'text-muted';
                textSpan.textContent = `позиций в меню по вашему запросу`;

                resultsContainer.appendChild(countBadge);
                resultsContainer.appendChild(textSpan);
            } else {

                const emptyCard = document.createElement('div');
                emptyCard.className = 'alert alert-warning d-flex align-items-center justify-content-between p-3 mt-2 rounded-3';

                const textWrapper = document.createElement('div');
                const warningIcon = document.createElement('span');
                warningIcon.className = 'fs-5 me-2';
                warningIcon.textContent = '🔍';

                const msgEl = document.createElement('strong');
                msgEl.textContent = 'Ничего не найдено: ';

                const hintEl = document.createElement('span');
                hintEl.textContent = `по запросу «${rawQuery.trim()}» в выбранной категории позиций нет.`;

                textWrapper.appendChild(warningIcon);
                textWrapper.appendChild(msgEl);
                textWrapper.appendChild(hintEl);

                const clearBtn = document.createElement('button');
                clearBtn.type = 'button';
                clearBtn.className = 'btn btn-outline-dark btn-sm ms-3';
                clearBtn.textContent = 'Сбросить поиск';
                clearBtn.addEventListener('click', () => {
                    resetAllMenuFilters();
                });

                emptyCard.appendChild(textWrapper);
                emptyCard.appendChild(clearBtn);
                resultsContainer.appendChild(emptyCard);
            }
        }
    }
}
