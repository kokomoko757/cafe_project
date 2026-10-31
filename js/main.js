/**
 * ==============================================================================
 * GLOBAL COFFEE — MAIN CLIENT LOGIC (JQUERY 3.7.1)
 * File: js/main.js
 * 
 * JQUERY VERSION: 3.7.1 (Official stable release loaded via CDN).
 * WHY $(function () { ... }) IS NEEDED:
 * $(function () { ... }) is the standard shorthand for $(document).ready().
 * It ensures the DOM tree is fully constructed and interactive before any
 * jQuery selectors query the DOM or attach event handlers, preventing runtime
 * errors on elements declared lower down the HTML document.
 * ==============================================================================
 */

'use strict';

// Shared utility object on window for currency, calculations and formatting
window.GlobalCoffee = {
  formatPrice: function (amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0 ₸';
    }
    const rounded = Math.round(amount);
    const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formatted + ' ₸';
  },

  calculateLineSubtotal: function (unitPrice, quantity) {
    const price = typeof unitPrice === 'number' && unitPrice > 0 ? unitPrice : 0;
    const qty = typeof quantity === 'number' && quantity > 0 ? quantity : 0;
    return price * qty;
  },

  generateReferenceCode: function (prefix) {
    const cleanPrefix = typeof prefix === 'string' && prefix.trim().length > 0 ? prefix.trim() : 'GC';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return '#' + cleanPrefix + '-2026-' + randomNum;
  },

  formatDateDisplay: function (isoDate) {
    if (typeof isoDate !== 'string' || !isoDate.includes('-')) {
      return isoDate || '';
    }
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      return parts[2] + '.' + parts[1] + '.' + parts[0];
    }
    return isoDate;
  }
};

$(function () {
  initBusinessHoursBadge();
  initPhoneMasks();
  initMobileNavAutoClose();
  updateNavCartBadge();
  initDailySpecialRecommendation();
});

/**
 * 1. Live Business Hours Badge
 * Determines whether flagman location (08:00 - 24:00) is open now.
 * Uses jQuery element, class manipulation, and chaining.
 */
function initBusinessHoursBadge() {
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 8 && currentHour < 24;

  const $brand = $('.navbar-brand:first');
  if ($brand.length && $('#liveStatusBadge').length === 0) {
    // Chain explanation:
    // 1. $('<span>'): creates a new in-memory span element.
    // 2. .attr('id', 'liveStatusBadge'): sets element id for unique selection.
    // 3. .attr('title', '...'): sets tooltip information for the visitor.
    // 4. .addClass(...): applies Bootstrap badge styling and conditional color.
    // 5. .text(...): safely sets plain text content (no XSS risk).
    // 6. .appendTo($brand): inserts the configured badge into the navbar brand.
    $('<span>')
      .attr('id', 'liveStatusBadge')
      .attr('title', 'Режим работы флагмана на ул. Туркестан, 4Б: ежедневно 08:00 – 24:00')
      .addClass('badge ms-2 fs-6 align-middle ' + (isOpen ? 'bg-success' : 'bg-secondary'))
      .text(isOpen ? '● Открыто сейчас' : '○ Откроется в 08:00')
      .appendTo($brand);
  }
}

/**
 * 2. Kazakhstan Phone Mask (+7 7XX XXX-XX-XX)
 * Uses jQuery .on('input focus blur') with $(this).val() manipulation.
 */
function initPhoneMasks() {
  const $phoneInputs = $('input[type="tel"], input[name*="phone"], #customer_phone, #phone');

  $phoneInputs.on('input', function () {
    // Using $(this) to refer to the specific input triggering the event
    let val = $(this).val().replace(/\D/g, '');

    if (val.startsWith('8') || val.startsWith('7')) {
      val = val.substring(1);
    }

    let formatted = '+7';
    if (val.length > 0) {
      formatted += ' (' + val.substring(0, 3);
    }
    if (val.length >= 4) {
      formatted += ') ' + val.substring(3, 6);
    }
    if (val.length >= 7) {
      formatted += '-' + val.substring(6, 8);
    }
    if (val.length >= 9) {
      formatted += '-' + val.substring(8, 10);
    }

    $(this).val(formatted);
  });

  $phoneInputs.on('focus', function () {
    if ($.trim($(this).val()) === '') {
      $(this).val('+7 (');
    }
  });

  $phoneInputs.on('blur', function () {
    const trimmed = $.trim($(this).val());
    if (trimmed === '+7 (' || trimmed === '+7') {
      $(this).val('');
    }
  });
}

/**
 * 3. Mobile Navigation Auto-close on link click
 */
function initMobileNavAutoClose() {
  const $navCollapse = $('#mainNav');
  if (!$navCollapse.length) return;

  $navCollapse.find('.nav-link').on('click', function () {
    if ($navCollapse.hasClass('show') && typeof bootstrap !== 'undefined') {
      const bsCollapse = bootstrap.Collapse.getInstance($navCollapse[0]);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  });
}

/**
 * 4. Nav Cart Badge synchronized with localStorage
 * Uses attribute selector, traversal, .text(), .prop() and .toggleClass()
 */
function updateNavCartBadge() {
  const $orderNavLink = $('a.nav-link[href="order.html"]');
  if (!$orderNavLink.length) return;

  let totalItems = 0;
  try {
    const savedCart = localStorage.getItem('global_coffee_cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      const values = Object.values(cartData);
      for (let i = 0; i < values.length; i += 1) {
        const item = values[i];
        const qty = typeof item.qty === 'number' ? item.qty : parseInt(item.qty, 10);
        if (!isNaN(qty) && qty > 0) {
          totalItems += qty;
        }
      }
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  let $badge = $('#navCartCountBadge');
  if (totalItems > 0) {
    if (!$badge.length) {
      $badge = $('<span>')
        .attr('id', 'navCartCountBadge')
        .addClass('badge bg-warning text-dark ms-1 rounded-pill')
        .appendTo($orderNavLink);
    }
    $badge.text(totalItems).removeClass('hidden');
  } else if ($badge.length) {
    $badge.addClass('hidden');
  }
}
window.updateNavCartBadge = updateNavCartBadge;

/**
 * ==============================================================================
 * FEATURE 3 REWRITTEN IN JQUERY: DYNAMIC CARD BUILDER FROM ARRAY IN CODE
 * 
 * COMPARISON WITH PLAIN JAVASCRIPT:
 * - Plain JS replaced: 15 lines of document.createElement('div'), setting className,
 *   setting textContent, and 4 sequential appendChild() calls.
 * - jQuery replacement: A single structured markup template appended with .append()
 *   and smoothly animated with .fadeIn(400).
 * - IS IT SHORTER & CLEARER?
 *   Yes, significantly shorter and clearer. Template string + .append() reads like
 *   the final HTML structure, eliminating tedious imperative DOM node wiring.
 * ==============================================================================
 */
function initDailySpecialRecommendation() {
  const featuredDrinks = [
    { name: 'Ореховый Флэт Уайт', note: 'Двойной эспрессо и натуральная паста из лесного фундука' },
    { name: 'Айс Матча Клубника', note: 'Освежающая японская матча с пюре из спелых ягод' },
    { name: 'Фраппе Сливочный-Какао', note: 'Ледяной десертный напиток со взбитыми сливками' },
    { name: 'Бамбл Кофе Свежевыжатый', note: 'Слоистый микс эспрессо и апельсинового фреша со льдом' },
    { name: 'Лимонад Сакура', note: 'Искрящийся цветочный тоник с японской вишней и мятой' }
  ];

  let $container = $('#baristaRecommendationContainer');
  if (!$container.length) {
    $container = $('main.page-content section:first .col-lg-8');
  }

  if ($container.length && featuredDrinks.length > 0 && !$('#dailySpecialCard').length) {
    const randomIndex = Math.floor(Math.random() * featuredDrinks.length);
    const drink = featuredDrinks[randomIndex];

    // Building card markup dynamically from array in code with .append()
    // Notice this card exists nowhere in static HTML!
    const $card = $('<div>')
      .attr('id', 'dailySpecialCard')
      .addClass('alert alert-light border shadow-sm p-3 rounded-3 mt-3 d-flex align-items-center gap-3')
      .css('display', 'none') // prepared for jQuery effect
      .html(
        '<span class="fs-3">⭐</span>' +
        '<div>' +
          '<strong class="d-block text-primary">Рекомендация бариста сегодня: ' + escapeHtml(drink.name) + '</strong>' +
          '<span class="small text-muted">' + escapeHtml(drink.note) + '</span>' +
        '</div>'
      );

    $container.append($card);

    // jQuery Effect 1: .fadeIn with duration 400ms and post-animation callback
    $card.fadeIn(400, function () {
      // Callback after animation completes
      $card.addClass('border-warning');
    });
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
