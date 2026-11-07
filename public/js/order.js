/**
 * ==============================================================================
 * GLOBAL COFFEE — ONLINE ORDER SYSTEM (JQUERY 3.7.1)
 * File: js/order.js
 * 
 * JQUERY VERSION: 3.7.1
 * WHY $(function () { ... }) IS NEEDED:
 * Ensures all form controls, catalog cards and price containers are ready
 * in the DOM before calculating cart totals or attaching event handlers.
 * ==============================================================================
 */

'use strict';

const ORDER_ITEMS_CATALOG = [
  { id: 'nut_flat_white', name: 'Ореховый Флэт Уайт', price: 1390, category: 'coffee', unit: '350 мл', image: 'images/item-nut-flat-white.jpg' },
  { id: 'frappe_cocoa', name: 'Фраппе Сливочный-Какао', price: 1790, category: 'cold', unit: '400 мл', image: 'images/item-frappe-cocoa.jpg' },
  { id: 'ice_matcha_strawberry', name: 'Айс Матча Клубника', price: 1690, category: 'cold', unit: '350 мл', image: 'images/item-matcha-strawberry.jpg' },
  { id: 'tea_orange_strawberry', name: 'Чай Апельсин-Клубника', price: 1090, category: 'coffee', unit: '400 мл', image: 'images/item-tea-orange.jpg' },
  { id: 'lemonade_sakura', name: 'Лимонад Сакура', price: 1490, category: 'cold', unit: '400 мл', image: 'images/item-lemonade-sakura.jpg' },
  { id: 'smoothie_kiwi', name: 'Смузи Киви', price: 1790, category: 'cold', unit: '350 мл', image: 'images/item-smoothie-kiwi.jpg' },
  { id: 'sandwich', name: 'Сэндвич с курицей', price: 1490, category: 'food', unit: '220 г', image: 'images/item-chicken-sandwich.jpg' },
  { id: 'hotdog', name: 'Хот-дог гриль', price: 1190, category: 'food', unit: '190 г', image: 'images/item-hotdog-grill.jpg' },
  { id: 'donuts', name: 'Пончики шоколадные', price: 990, category: 'food', unit: '2 шт', image: 'images/item-donuts-chocolate.jpg' },
  { id: 'onigiri', name: 'Онигири с лососем', price: 890, category: 'food', unit: '130 г', image: 'images/item-onigiri-salmon.jpg' }
];

$(function () {
  initOrderCalculator();
  initDeliveryTypeToggle();
  initFieldInputErrorClearers();
  initOrderFormSubmit();
  restoreCartFromLocalStorage();
  recalculateCart();
});

function findCatalogItem(itemId) {
  return ORDER_ITEMS_CATALOG.find(item => item.id === itemId);
}

/**
 * 1. Order Calculator with DOM Traversal and Chaining
 * Uses .closest(), .find(), .prop(), .each(), $(this), :checked filter.
 */
function initOrderCalculator() {
  const $checkboxes = $('input[name="order_items"]');
  const $qtyInputs = $('.qty-input');
  const $resetBtn = $('#orderResetBtn');

  // Checkbox change handler
  $checkboxes.on('change', function () {
    // $(this) refers to the changed checkbox
    updateCardSelectionState($(this));
    recalculateCart();
  });

  // Quantity input handler
  $qtyInputs.on('input change', function () {
    let val = parseInt($(this).val(), 10);
    if (isNaN(val) || val < 1) {
      $(this).val('1');
      val = 1;
    } else if (val > 10) {
      $(this).val('10');
      val = 10;
    }

    // Traversal: from qty input reaching the card, then finding the checkbox
    const $card = $(this).closest('.card');
    const $cb = $card.find('input[type="checkbox"]');

    // Using .prop() to check and modify the boolean checked state of the checkbox
    if (!$cb.prop('checked')) {
      $cb.prop('checked', true);
      updateCardSelectionState($cb);
    }

    recalculateCart();
  });

  // Reset button handler
  if ($resetBtn.length) {
    $resetBtn.on('click', function () {
      setTimeout(function () {
        // Chain 1: Traversal and class removal across all cards
        $('.card')
          .removeClass('selected')
          .find('.is-invalid, .error')
          .removeClass('is-invalid error');

        clearAllOrderFieldErrors();

        try {
          localStorage.removeItem('global_coffee_cart');
        } catch (e) {
          console.warn('LocalStorage error:', e);
        }

        $('input[name="order_type"]:checked').trigger('change');
        $('#orderConfirmation').stop(true, true).hide().addClass('hidden');
        recalculateCart();
        if (typeof window.updateNavCartBadge === 'function') {
          window.updateNavCartBadge();
        }
      }, 50);
    });
  }
}

/**
 * Updates card highlight state using .toggleClass()
 */
function updateCardSelectionState($checkbox) {
  const $card = $checkbox.closest('.card');
  if (!$card.length) return;

  // Uses .prop('checked') to read live boolean state
  const isChecked = $checkbox.prop('checked');
  $card.toggleClass('selected', isChecked);
}

/**
 * Recalculates cart totals using :checked filter, traversal and .text()
 */
function recalculateCart() {
  // Using filter :checked on attribute selector
  const $checkedBoxes = $('input[name="order_items"]:checked');
  let totalItems = 0;
  let totalPrice = 0;
  const cartState = {};

  // Traversal with .each()
  $checkedBoxes.each(function () {
    const itemKey = $(this).val();
    const itemInfo = findCatalogItem(itemKey);
    if (!itemInfo) return;

    // Traversal: reach parent card then find number input
    const $card = $(this).closest('.card');
    const $qtyInput = $card.find('input[type="number"]');
    let qty = parseInt($qtyInput.val(), 10);
    if (isNaN(qty) || qty < 1) qty = 1;

    const subtotal = window.GlobalCoffee.calculateLineSubtotal(itemInfo.price, qty);
    totalItems += qty;
    totalPrice += subtotal;

    cartState[itemKey] = {
      id: itemInfo.id,
      name: itemInfo.name,
      price: itemInfo.price,
      qty: qty,
      subtotal: subtotal
    };
  });

  // Update totals on page with .text() (safe from XSS)
  $('#orderItemsCount').text(totalItems + ' шт.');
  $('#orderTotalPrice').text(window.GlobalCoffee.formatPrice(totalPrice));

  const $submitBtn = $('#orderSubmitBtn');
  let $emptyStateMsg = $('#orderEmptyStateMsg');

  if (totalItems === 0) {
    $submitBtn.prop('disabled', true).addClass('disabled');
    if (!$emptyStateMsg.length) {
      $emptyStateMsg = $('<div>')
        .attr('id', 'orderEmptyStateMsg')
        .addClass('small text-muted fst-italic mt-1')
        .text('Корзина пуста: выберите хотя бы одно блюдо или напиток из меню выше.');
      $('#orderTotalContainer').parent().append($emptyStateMsg);
    }
  } else {
    $submitBtn.prop('disabled', false).removeClass('disabled');
    if ($emptyStateMsg.length) {
      $emptyStateMsg.remove();
    }
  }

  try {
    localStorage.setItem('global_coffee_cart', JSON.stringify(cartState));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  if (typeof window.updateNavCartBadge === 'function') {
    window.updateNavCartBadge();
  }

  return { totalItems, totalPrice, cartState };
}

/**
 * ==============================================================================
 * FEATURE 2 REWRITTEN IN JQUERY: SHOW-AND-HIDE (DELIVERY VS ONSITE PANELS)
 * 
 * COMPARISON WITH PLAIN JAVASCRIPT:
 * - Plain JS replaced: manual querySelector traversing, repeated .classList.add('hidden')
 *   and .classList.remove('hidden') on sibling containers, requiring manual toggle calls.
 * - jQuery replacement: .slideUp(300) and .slideDown(300) on target containers,
 *   paired with .prop('required', boolean).
 * - IS IT SHORTER & CLEARER?
 *   Yes, it is shorter and substantially clearer. It animates the accordion-style height
 *   transition smoothly with 1 line of jQuery instead of abrupt instant CSS hiding.
 * ==============================================================================
 */
function initDeliveryTypeToggle() {
  const $radioHome = $('#delivery_home');
  const $radioOnsite = $('#delivery_onsite');
  const $streetInput = $('#street');
  const $timeSelect = $('#arrival_time');

  function updateDeliveryUI(animate) {
    const $homeContainer = $radioHome.closest('.form-check').next();
    const $onsiteContainer = $radioOnsite.closest('.form-check').next();
    const duration = animate ? 300 : 0;

    if ($radioHome.prop('checked')) {
      $homeContainer.removeClass('hidden').slideDown(duration);
      $onsiteContainer.slideUp(duration, function () {
        $(this).addClass('hidden');
      });
      $streetInput.prop('required', true);
      if ($timeSelect.length) $timeSelect.prop('required', false);
    } else if ($radioOnsite.prop('checked')) {
      $homeContainer.slideUp(duration, function () {
        $(this).addClass('hidden');
      });
      $onsiteContainer.removeClass('hidden').slideDown(duration);
      $streetInput.prop('required', false);
      if ($timeSelect.length) $timeSelect.prop('required', true);
    }
  }

  // Attach with .on('change') using delegation and direct binding
  $('input[name="order_type"]').on('change', function () {
    updateDeliveryUI(true);
  });

  updateDeliveryUI(false);
}

/**
 * Inline error helper for order form
 */
function setOrderFieldError($field, message) {
  if (!$field || !$field.length) return;

  // Chain 2: Traversal, class setting, message injection and animation
  // Chain explanation:
  // 1. $field: wraps the invalid input element.
  // 2. .addClass('is-invalid error'): marks field with red error border and text color.
  // 3. .parent(): traverses to the parent col/form-group container.
  // 4. .find('.invalid-feedback.field-error-msg'): locates existing feedback or prepared slot.
  $field.addClass('is-invalid error');
  let $feedback = $field.parent().find('.invalid-feedback.field-error-msg');

  if (!$feedback.length) {
    $feedback = $('<div>')
      .addClass('invalid-feedback d-block text-danger small mt-1 field-error-msg')
      .hide()
      .appendTo($field.parent());
  }

  $feedback.text(message).slideDown(200);
}

function clearOrderFieldError($field) {
  if (!$field || !$field.length) return;

  $field.removeClass('is-invalid error');
  const $feedback = $field.parent().find('.invalid-feedback.field-error-msg');
  if ($feedback.length) {
    $feedback.slideUp(150, function () {
      $(this).remove();
    });
  }
}

function clearAllOrderFieldErrors() {
  $('#orderForm')
    .find('.is-invalid, .error')
    .removeClass('is-invalid error');

  $('#orderForm')
    .find('.invalid-feedback.field-error-msg')
    .remove();

  $('#orderError').slideUp(200, function () {
    $(this).addClass('hidden');
  });
}

function initFieldInputErrorClearers() {
  $('#orderForm').find('input, select, textarea').on('input change', function () {
    clearOrderFieldError($(this));
  });
}

/**
 * ==============================================================================
 * FEATURE 1 REWRITTEN IN JQUERY: FORM VALIDATION & CONFIRMATION
 * 
 * COMPARISON WITH PLAIN JAVASCRIPT:
 * - Plain JS replaced: ~45 lines of document.getElementById, element.classList,
 *   manual element creation with appendChild, and document.querySelectorAll loops.
 * - jQuery replacement: jQuery selectors ($('#customer_name')), $.trim(), .prop(),
 *   method chaining ($field.addClass(...).parent().find(...)), and .fadeIn() / .animate() effects.
 * - IS IT SHORTER & CLEARER?
 *   Yes, it cuts boilerplate code by over 50% while adding animated error alerts
 *   and smooth viewport scrolling via .animate({ scrollTop: ... }, 400).
 * 
 * WHY CLIENT-SIDE VALIDATION NEVER REPLACES SERVER VALIDATION:
 * Any client code can be modified, disabled, or bypassed entirely with automated HTTP tools.
 * Client validation only provides immediate interactive feedback to the visitor;
 * server validation remains non-negotiable for security and data integrity.
 * ==============================================================================
 */
function initOrderFormSubmit() {
  const $form = $('#orderForm');
  const $errorAlert = $('#orderError');
  const $confirmAlert = $('#orderConfirmation');
  const $orderResult = $('#orderResult');

  if (!$form.length) return;

  $form.on('submit', function (e) {
    /**
     * WHY event.preventDefault() IS NEEDED:
     * Prevents browser default form submit and URL redirect, allowing
     * client-side verification, order itemization, and animated receipt display.
     */
    e.preventDefault();
    $('#orderConfirmation').stop(true, true).hide().addClass('hidden');
    clearAllOrderFieldErrors();

    const totals = recalculateCart();
    let hasErrors = false;
    let $firstInvalid = null;

    if (totals.totalItems === 0 || totals.totalPrice === 0) {
      $errorAlert.removeClass('hidden').hide().fadeIn(300);
      $errorAlert.find('p').text('Пожалуйста, выберите хотя бы одно блюдо или напиток в меню выше.');
      $('html, body').animate({ scrollTop: $errorAlert.offset().top - 20 }, 300);
      return;
    }

    // 1. Customer Name validation
    const $nameInput = $('#customer_name');
    const trimmedName = $.trim($nameInput.val());
    if (trimmedName.length < 2) {
      setOrderFieldError($nameInput, 'Пожалуйста, укажите ваше имя (минимум 2 символа).');
      if (!$firstInvalid) $firstInvalid = $nameInput;
      hasErrors = true;
    }

    // 2. Phone validation with regex
    const $phoneInput = $('#customer_phone');
    const phoneDigits = $phoneInput.val().replace(/\D/g, '');
    if (!/^77\d{9}$/.test(phoneDigits)) {
      setOrderFieldError($phoneInput, 'Укажите корректный номер телефона для связи (+7 7XX XXX-XX-XX).');
      if (!$firstInvalid) $firstInvalid = $phoneInput;
      hasErrors = true;
    }

    // 3. Payment method validation
    const $paymentInput = $('#payment_method');
    if (!$paymentInput.val()) {
      setOrderFieldError($paymentInput, 'Выберите удобный для вас способ оплаты.');
      if (!$firstInvalid) $firstInvalid = $paymentInput;
      hasErrors = true;
    }

    // 4. Delivery address or onsite table validation
    const isDelivery = $('#delivery_home').prop('checked');
    const $streetInput = $('#street');
    const $arrivalTimeInput = $('#arrival_time');

    if (isDelivery) {
      const streetVal = $.trim($streetInput.val());
      if (streetVal.length < 5) {
        setOrderFieldError($streetInput, 'Укажите адрес доставки в Астане (улицу, дом, офис/квартиру).');
        if (!$firstInvalid) $firstInvalid = $streetInput;
        hasErrors = true;
      }
    } else if ($arrivalTimeInput.length && !$arrivalTimeInput.val()) {
      setOrderFieldError($arrivalTimeInput, 'Выберите ориентировочное время вашего визита.');
      if (!$firstInvalid) $firstInvalid = $arrivalTimeInput;
      hasErrors = true;
    }

    if (hasErrors) {
      $errorAlert.removeClass('hidden').hide().slideDown(250);
      $errorAlert.find('p').text('Пожалуйста, исправьте выделенные поля формы перед подтверждением заказа.');
      if ($firstInvalid) {
        $firstInvalid.focus();
      }
      return;
    }

    $errorAlert.slideUp(200, function () {
      $(this).addClass('hidden');
    });

    const orderId = window.GlobalCoffee.generateReferenceCode('GC');
    const deliveryText = isDelivery ? 'Курьерская доставка по г. Астана' : 'Самовывоз / Заказ в кофейне';
    const addressText = isDelivery
      ? ($('#city').val() || 'г. Астана') + ', ' + $.trim($streetInput.val())
      : 'ул. Туркестан, 4Б (Флагман), время: ' + ($arrivalTimeInput.val() || 'в течение 30 мин');

    const instructionsText = $.trim($('#special_instructions').val()) || 'Без дополнительных пожеланий';
    const paymentLabel = $paymentInput.find('option:selected').text();

    // Render receipt with jQuery .html()
    if ($orderResult.length) {
      let itemsListHtml = '<ul class="list-group list-group-flush mb-3">';
      const cartKeys = Object.keys(totals.cartState);
      cartKeys.forEach(function (k) {
        const item = totals.cartState[k];
        itemsListHtml +=
          '<li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">' +
            '<div>' +
              '<strong>' + escapeHtml(item.name) + '</strong>' +
              '<div class="small text-muted">' + item.qty + ' шт. × ' + window.GlobalCoffee.formatPrice(item.price) + '</div>' +
            '</div>' +
            '<span class="fw-bold">' + window.GlobalCoffee.formatPrice(item.subtotal) + '</span>' +
          '</li>';
      });
      itemsListHtml += '</ul>';

      const resultHtml =
        '<div class="border-bottom pb-3 mb-3">' +
          '<span class="badge bg-primary mb-2 fs-6">Номер заказа: ' + orderId + '</span>' +
          '<h4 class="h6 fw-bold mb-1">Получатель: ' + escapeHtml(trimmedName) + ' (' + escapeHtml($phoneInput.val()) + ')</h4>' +
          '<p class="small text-muted mb-1">Способ: ' + deliveryText + ' (' + escapeHtml(addressText) + ')</p>' +
          '<p class="small text-secondary mb-0">Пожелания: ' + escapeHtml(instructionsText) + '</p>' +
        '</div>' +
        itemsListHtml +
        '<div class="d-flex justify-content-between align-items-center pt-2 border-top">' +
          '<span class="fs-5 fw-bold">Итого к оплате:</span>' +
          '<span class="fs-4 fw-bold text-primary">' + window.GlobalCoffee.formatPrice(totals.totalPrice) + '</span>' +
        '</div>' +
        '<div class="small text-success mt-2 fw-semibold">✓ Способ оплаты: ' + escapeHtml(paymentLabel) + '</div>' +
        '<div class="alert alert-info mt-3 mb-0 p-2 small border rounded">' +
          'ℹ️ Демонстрационный режим: Данные не отправляются на сервер, реальная оплата и доставка не производятся. Заказ смоделирован на клиенте.' +
        '</div>';

      $orderResult.html(resultHtml);
    }

    // jQuery Effect 3: .fadeIn with callback and scrolling
    if ($confirmAlert.length) {
      $confirmAlert.removeClass('hidden').hide().fadeIn(400, function () {
        $('html, body').animate({
          scrollTop: $confirmAlert.offset().top - 20
        }, 300);
      });
    }

    try {
      localStorage.removeItem('global_coffee_cart');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Чек остаётся на экране, а оформленные товары убираются из корзины.
    $('input[name="order_items"]').prop('checked', false);
    $('.qty-input').val('1');
    $('.card').removeClass('selected');
    recalculateCart();

    if (typeof window.updateNavCartBadge === 'function') {
      window.updateNavCartBadge();
    }
  });
}

/**
 * Restores cart checkbox selections from localStorage
 */
function restoreCartFromLocalStorage() {
  try {
    const saved = localStorage.getItem('global_coffee_cart');
    if (!saved) return;
    const cartData = JSON.parse(saved);

    Object.keys(cartData).forEach(function (key) {
      const $cb = $('input[name="order_items"][value="' + key + '"]');
      if ($cb.length) {
        $cb.prop('checked', true);
        updateCardSelectionState($cb);

        const $qtyInput = $cb.closest('.card').find('.qty-input');
        if ($qtyInput.length && cartData[key].qty) {
          $qtyInput.val(cartData[key].qty.toString());
        }
      }
    });
  } catch (e) {
    console.warn('Cart restoration error:', e);
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
