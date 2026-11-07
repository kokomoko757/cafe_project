'use strict';

// Каталог работает на обычном JavaScript, без jQuery.
document.addEventListener('DOMContentLoaded', function () {
  const search = document.getElementById('menuSearchInput');
  if (!search) return;

  const lists = document.querySelectorAll('main section .list-group');
  const results = document.getElementById('menuSearchResults');
  const controls = document.getElementById('filterAll').parentElement;
  const categories = { filterAll: 'all', filterCoffee: 'coffee', filterCold: 'cold', filterFood: 'food' };
  let category = 'all';

  function formatMenuPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₸';
  }

  function findMenuItems(query, selectedCategory) {
    return MENU_ITEMS.filter(function (item) {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const text = (item.name + ' ' + item.note).toLowerCase();
      return matchesCategory && text.includes(query.trim().toLowerCase());
    });
  }

  function createMenuItem(item) {
    const row = document.createElement('li');
    row.className = 'list-group-item d-flex align-items-center py-3 gap-2';
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.alt;
    image.width = 60;
    image.height = 60;
    image.className = 'rounded-3 menu-item-thumb';
    const description = document.createElement('div');
    description.className = 'flex-grow-1';
    const name = document.createElement('span');
    name.className = 'fw-semibold d-block';
    name.textContent = item.name;
    const note = document.createElement('div');
    note.className = 'small text-muted';
    note.textContent = item.note;
    const price = document.createElement('span');
    price.className = item.badge;
    price.textContent = formatMenuPrice(item.price);
    description.append(name, note);
    row.append(image, description, price);
    return row;
  }

  function renderMenu(items) {
    lists.forEach(function (list, group) {
      list.replaceChildren();
      const groupItems = items.filter(function (item) { return item.group === group; });
      for (const item of groupItems) list.append(createMenuItem(item));
      list.closest('.col-12').classList.toggle('hidden', groupItems.length === 0);
    });
    results.textContent = items.length ? 'Найдено позиций: ' + items.length : 'Ничего не найдено. Попробуйте другой запрос.';
    if (!items.length) results.append(createResetButton());
  }

  function createResetButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-dark btn-sm ms-2';
    button.dataset.resetMenu = 'true';
    button.textContent = 'Сбросить поиск';
    return button;
  }

  function updateMenu() {
    renderMenu(findMenuItems(search.value, category));
    for (const button of controls.querySelectorAll('button')) {
      if (!categories[button.id]) continue;
      const active = categories[button.id] === category;
      button.classList.toggle('active', active);
      button.classList.toggle('btn-outline-primary', active);
      button.classList.toggle('btn-outline-secondary', !active);
      button.setAttribute('aria-pressed', String(active));
    }
  }

  function resetMenu() {
    search.value = '';
    category = 'all';
    updateMenu();
    search.focus();
  }

  controls.append(createResetButton());
  // Один обработчик родителя обслуживает и созданные позже кнопки.
  search.closest('.card').addEventListener('click', function (event) {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.resetMenu) resetMenu();
    else if (categories[button.id]) {
      category = categories[button.id];
      updateMenu();
    }
  });
  search.addEventListener('input', updateMenu);
  search.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') resetMenu();
  });
  updateMenu();
});
