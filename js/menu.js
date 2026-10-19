/**
 * GLOBAL COFFEE — Живой поиск и фильтрация меню (js/menu.js)
 * Реализует:
 * 1. Мгновенный поиск по названию напитков и ингредиентам (#menuSearchInput)
 * 2. Фильтрацию по категориям (#filterAll, #filterCoffee, #filterCold, #filterFood)
 * 3. Динамический счетчик найденных позиций (#menuSearchResults)
 */

document.addEventListener('DOMContentLoaded', () => {
    initMenuFilter();
    initMenuSearch();
});

let currentCategory = 'all';

/**
 * 1. Фильтрация по кнопкам категорий
 */
function initMenuFilter() {
    const filterButtons = {
        all: document.getElementById('filterAll'),
        coffee: document.getElementById('filterCoffee'),
        cold: document.getElementById('filterCold'),
        food: document.getElementById('filterFood')
    };

    if (!filterButtons.all) return;

    Object.keys(filterButtons).forEach(categoryKey => {
        const btn = filterButtons[categoryKey];
        if (!btn) return;

        btn.addEventListener('click', () => {
            // Переключаем стили кнопок
            Object.values(filterButtons).forEach(b => {
                if (b) {
                    b.classList.remove('active', 'btn-outline-primary', 'btn-primary');
                    b.classList.add('btn-outline-secondary');
                }
            });
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-outline-primary', 'active');

            currentCategory = categoryKey;
            applyMenuFilters();
        });
    });
}

/**
 * 2. Живой поиск по строке ввода
 */
function initMenuSearch() {
    const searchInput = document.getElementById('menuSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        applyMenuFilters();
    });
}

/**
 * Применение объединенных фильтров поиска и категории
 */
function applyMenuFilters() {
    const searchInput = document.getElementById('menuSearchInput');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const resultsContainer = document.getElementById('menuSearchResults');

    const cards = document.querySelectorAll('.page-content .card .list-group');
    let visibleItemsCount = 0;
    let totalItemsCount = 0;

    cards.forEach(listGroup => {
        const cardCol = listGroup.closest('.col-12');
        const cardHeaderTitle = cardCol ? cardCol.querySelector('.card-header h3')?.textContent.toLowerCase() : '';
        const items = listGroup.querySelectorAll('.list-group-item');

        let cardHasMatches = false;

        // Проверяем принадлежность карточки категории
        let matchesCategory = true;
        if (currentCategory === 'coffee') {
            matchesCategory = cardHeaderTitle.includes('классика') || cardHeaderTitle.includes('фирменные');
        } else if (currentCategory === 'cold') {
            matchesCategory = cardHeaderTitle.includes('холодные');
        } else if (currentCategory === 'food') {
            matchesCategory = cardHeaderTitle.includes('еда') || cardHeaderTitle.includes('выпечка') || cardHeaderTitle.includes('десерт');
        }

        items.forEach(item => {
            totalItemsCount++;
            const itemText = item.textContent.toLowerCase();
            const matchesQuery = query === '' || itemText.includes(query);

            if (matchesCategory && matchesQuery) {
                item.classList.remove('hidden');
                visibleItemsCount++;
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

    // Обновляем информационный блок результатов
    if (resultsContainer) {
        if (query !== '' || currentCategory !== 'all') {
            if (visibleItemsCount > 0) {
                resultsContainer.innerHTML = `<span class="badge bg-success">Найдено: ${visibleItemsCount}</span> позиций меню`;
            } else {
                resultsContainer.innerHTML = `<span class="badge bg-warning text-dark">Ничего не найдено</span> по вашему запросу. Попробуйте изменить фильтр.`;
            }
        } else {
            resultsContainer.innerHTML = ``;
        }
    }
}
