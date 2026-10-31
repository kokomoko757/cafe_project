/**
 * ==============================================================================
 * GLOBAL COFFEE — MENU CATALOG & LIVE FILTERING (JQUERY 3.7.1)
 * File: js/menu.js
 * 
 * JQUERY VERSION: 3.7.1
 * WHY $(function () { ... }) IS NEEDED:
 * Attaches filter listeners and initializes search input once menu cards and list
 * groups have loaded into the DOM.
 * ==============================================================================
 */

'use strict';

let activeCategory = 'all';

$(function () {
  initMenuFilterControls();
  initMenuSearchInput();
  initMenuResetControl();
});

/**
 * Category Filter Buttons using Method Chaining and Traversal
 */
function initMenuFilterControls() {
  const $filterBtns = $('#filterAll, #filterCoffee, #filterCold, #filterFood');
  if (!$filterBtns.length) return;

  $filterBtns.on('click', function () {
    const btnId = $(this).attr('id');
    if (btnId === 'filterCoffee') activeCategory = 'coffee';
    else if (btnId === 'filterCold') activeCategory = 'cold';
    else if (btnId === 'filterFood') activeCategory = 'food';
    else activeCategory = 'all';

    // Chaining demonstration across filter buttons
    // Chain explanation:
    // 1. $(this): the clicked category filter button.
    // 2. .addClass('active btn-outline-primary'): activates this button with primary style.
    // 3. .removeClass('btn-outline-secondary'): removes secondary styling.
    // 4. .siblings('button'): traverses to all sibling filter buttons within container.
    // 5. .removeClass('active btn-outline-primary'): deactivates all other category buttons.
    // 6. .addClass('btn-outline-secondary'): returns sibling buttons to secondary outline.
    $(this)
      .addClass('active btn-outline-primary')
      .removeClass('btn-outline-secondary')
      .siblings('button')
      .removeClass('active btn-outline-primary')
      .addClass('btn-outline-secondary');

    applyMenuFilters();
  });
}

/**
 * Search input handling with keyup & Escape support
 */
function initMenuSearchInput() {
  const $searchInput = $('#menuSearchInput');
  if (!$searchInput.length) return;

  $searchInput.on('input keyup', function (e) {
    if (e.key === 'Escape') {
      $(this).val('');
    }
    applyMenuFilters();
  });
}

/**
 * Dynamically creates a reset button using jQuery element constructor and .appendTo()
 */
function initMenuResetControl() {
  const $buttonGroup = $('#menuSearchInput').closest('.card').find('.col-md-7');
  if (!$buttonGroup.length || $('#menuResetBtn').length) return;

  $('<button>')
    .attr('type', 'button')
    .attr('id', 'menuResetBtn')
    .attr('title', 'Очистить строку поиска и показать все категории')
    .addClass('btn btn-outline-dark btn-sm ms-2 align-self-center')
    .text('✕ Сбросить фильтры')
    .on('click', resetAllMenuFilters)
    .appendTo($buttonGroup);
}

function resetAllMenuFilters() {
  $('#menuSearchInput').val('');
  activeCategory = 'all';

  $('#filterAll')
    .addClass('active btn-outline-primary')
    .removeClass('btn-outline-secondary')
    .siblings('button')
    .removeClass('active btn-outline-primary')
    .addClass('btn-outline-secondary');

  applyMenuFilters();
}

/**
 * Traverses menu card columns and list group items, updating match count
 */
function applyMenuFilters() {
  const $searchInput = $('#menuSearchInput');
  const rawQuery = $searchInput.length ? $searchInput.val() : '';
  const cleanQuery = $.trim(rawQuery).toLowerCase();
  const $resultsContainer = $('#menuSearchResults');

  const $cardGroups = $('.page-content .card .list-group');
  let totalVisible = 0;

  $cardGroups.each(function () {
    const $listGroup = $(this);
    const $cardCol = $listGroup.closest('.col-12');
    const cardHeaderTitle = $cardCol.find('.card-header h3').text().toLowerCase();
    const $items = $listGroup.find('.list-group-item');

    let cardHasMatches = false;

    let matchesCategory = true;
    if (activeCategory === 'coffee') {
      matchesCategory = cardHeaderTitle.indexOf('классика') !== -1 || cardHeaderTitle.indexOf('фирменные') !== -1;
    } else if (activeCategory === 'cold') {
      matchesCategory = cardHeaderTitle.indexOf('холодные') !== -1;
    } else if (activeCategory === 'food') {
      matchesCategory = cardHeaderTitle.indexOf('еда') !== -1 || cardHeaderTitle.indexOf('выпечка') !== -1;
    }

    $items.each(function () {
      const itemText = $(this).text().toLowerCase();
      const matchesSearch = cleanQuery === '' || itemText.indexOf(cleanQuery) !== -1;

      if (matchesCategory && matchesSearch) {
        $(this).removeClass('hidden');
        totalVisible += 1;
        cardHasMatches = true;
      } else {
        $(this).addClass('hidden');
      }
    });

    if (cardHasMatches) {
      $cardCol.removeClass('hidden');
    } else {
      $cardCol.addClass('hidden');
    }
  });

  if ($resultsContainer.length) {
    if (cleanQuery !== '' || activeCategory !== 'all') {
      if (totalVisible > 0) {
        $resultsContainer.html(
          '<span class="badge bg-success me-2">Найдено: ' + totalVisible + '</span>' +
          '<span class="text-muted">позиций в меню по вашему запросу</span>'
        );
      } else {
        const emptyHtml =
          '<div class="alert alert-warning d-flex align-items-center justify-content-between p-3 mt-2 rounded-3">' +
            '<div>' +
              '<span class="fs-5 me-2">🔍</span>' +
              '<strong>Ничего не найдено: </strong>' +
              '<span>по запросу «' + escapeHtml(rawQuery) + '» в выбранной категории позиций нет.</span>' +
            '</div>' +
            '<button type="button" id="emptyStateResetBtn" class="btn btn-outline-dark btn-sm ms-3">Сбросить поиск</button>' +
          '</div>';

        $resultsContainer.html(emptyHtml);

        // Delegated event binding or direct on newly created button
        $('#emptyStateResetBtn').on('click', resetAllMenuFilters);
      }
    } else {
      $resultsContainer.empty();
    }
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
