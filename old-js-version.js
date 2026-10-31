/**
 * ==============================================================================
 * GLOBAL COFFEE — OLD PLAIN JAVASCRIPT VERSION (FOR DEFENSE COMPARISON)
 * File: old-js-version.js
 * 
 * NOTE: This file is intentionally NOT linked to any HTML page.
 * It contains the original plain JavaScript implementations of three features
 * created in previous assignments, preserved side-by-side for oral defense
 * comparison against the rewritten jQuery implementations.
 * ==============================================================================
 */

'use strict';

// ==============================================================================
// FEATURE 1 (OLD PLAIN JS): FORM VALIDATION AND INLINE ERROR DISPLAY
// Original implementation from js/order.js and js/booking.js
// ==============================================================================
function oldPlainJsFormValidation() {
  const form = document.getElementById('orderForm');
  const nameInput = document.getElementById('customer_name');
  const phoneInput = document.getElementById('customer_phone');
  const paymentInput = document.getElementById('payment_method');
  const errorAlert = document.getElementById('orderError');

  if (!form) return;

  // Clear errors manually on input/change
  const allInputs = form.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      input.classList.remove('error');
      const feedback = input.parentNode.querySelector('.invalid-feedback.field-error-msg');
      if (feedback) feedback.remove();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear all previous error states manually
    document.querySelectorAll('.is-invalid, .error').forEach(el => {
      el.classList.remove('is-invalid');
      el.classList.remove('error');
    });
    document.querySelectorAll('.invalid-feedback.field-error-msg').forEach(msg => msg.remove());

    let hasErrors = false;
    let firstInvalidField = null;

    // Validate Name
    const trimmedName = nameInput ? nameInput.value.trim() : '';
    if (trimmedName.length < 2) {
      nameInput.classList.add('is-invalid', 'error');
      let feedback = document.createElement('div');
      feedback.className = 'invalid-feedback d-block text-danger small mt-1 field-error-msg';
      feedback.textContent = 'Пожалуйста, укажите ваше имя (минимум 2 символа).';
      nameInput.parentNode.appendChild(feedback);
      if (!firstInvalidField) firstInvalidField = nameInput;
      hasErrors = true;
    }

    // Validate Phone
    const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    if (phoneDigits.length < 10) {
      phoneInput.classList.add('is-invalid', 'error');
      let feedback = document.createElement('div');
      feedback.className = 'invalid-feedback d-block text-danger small mt-1 field-error-msg';
      feedback.textContent = 'Укажите контактный номер телефона (+7 7XX XXX-XX-XX).';
      phoneInput.parentNode.appendChild(feedback);
      if (!firstInvalidField) firstInvalidField = phoneInput;
      hasErrors = true;
    }

    // Validate Payment Method
    if (!paymentInput || paymentInput.value === '') {
      paymentInput.classList.add('is-invalid', 'error');
      let feedback = document.createElement('div');
      feedback.className = 'invalid-feedback d-block text-danger small mt-1 field-error-msg';
      feedback.textContent = 'Выберите удобный для вас способ оплаты.';
      paymentInput.parentNode.appendChild(feedback);
      if (!firstInvalidField) firstInvalidField = paymentInput;
      hasErrors = true;
    }

    if (hasErrors) {
      if (errorAlert) errorAlert.classList.remove('hidden');
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    if (errorAlert) errorAlert.classList.add('hidden');
    form.reset();
  });
}


// ==============================================================================
// FEATURE 2 (OLD PLAIN JS): SHOW-AND-HIDE OF DELIVERY/ONSITE PANELS
// Original implementation from js/order.js
// ==============================================================================
function oldPlainJsDeliveryToggle() {
  const radioHome = document.getElementById('delivery_home');
  const radioOnsite = document.getElementById('delivery_onsite');
  const streetInput = document.getElementById('street');
  const timeSelect = document.getElementById('arrival_time');

  function updateDeliveryUI() {
    const homeContainer = document.querySelector('#delivery_home')?.closest('.form-check')?.nextElementSibling;
    const onsiteContainer = document.querySelector('#delivery_onsite')?.closest('.form-check')?.nextElementSibling;

    if (radioHome && radioHome.checked) {
      if (homeContainer) homeContainer.classList.remove('hidden');
      if (onsiteContainer) onsiteContainer.classList.add('hidden');
      if (streetInput) streetInput.required = true;
      if (timeSelect) timeSelect.required = false;
    } else if (radioOnsite && radioOnsite.checked) {
      if (homeContainer) homeContainer.classList.add('hidden');
      if (onsiteContainer) onsiteContainer.classList.remove('hidden');
      if (streetInput) streetInput.required = false;
      if (timeSelect) timeSelect.required = true;
    }
  }

  if (radioHome) radioHome.addEventListener('change', updateDeliveryUI);
  if (radioOnsite) radioOnsite.addEventListener('change', updateDeliveryUI);
}


// ==============================================================================
// FEATURE 3 (OLD PLAIN JS): DYNAMIC CARD GENERATION FROM ARRAY IN CODE
// Original implementation from js/main.js (Daily Special Recommendation Card)
// ==============================================================================
function oldPlainJsDynamicCardBuilder() {
  const featuredDrinks = [
    { name: 'Ореховый Флэт Уайт', note: 'Двойной эспрессо и натуральная паста из лесного фундука' },
    { name: 'Айс Матча Клубника', note: 'Освежающая японская матча с пюре из спелых ягод' },
    { name: 'Фраппе Сливочный-Какао', note: 'Ледяной десертный напиток со взбитыми сливками' },
    { name: 'Бамбл Кофе Свежевыжатый', note: 'Слоистый микс эспрессо и апельсинового фреша со льдом' },
    { name: 'Лимонад Сакура', note: 'Искрящийся цветочный тоник с японской вишней и мятой' }
  ];

  const container = document.getElementById('baristaRecommendationContainer');
  if (!container || featuredDrinks.length === 0) return;

  const randomIndex = Math.floor(Math.random() * featuredDrinks.length);
  const drink = featuredDrinks[randomIndex];

  // Plain JS requires creating every DOM node individually and appending
  const card = document.createElement('div');
  card.className = 'alert alert-light border shadow-sm p-3 rounded-3 mt-3 d-flex align-items-center gap-3';

  const iconSpan = document.createElement('span');
  iconSpan.className = 'fs-3';
  iconSpan.textContent = '⭐';

  const textDiv = document.createElement('div');

  const titleEl = document.createElement('strong');
  titleEl.className = 'd-block text-primary';
  titleEl.textContent = 'Рекомендация бариста сегодня: ' + drink.name;

  const descEl = document.createElement('span');
  descEl.className = 'small text-muted';
  descEl.textContent = drink.note;

  textDiv.appendChild(titleEl);
  textDiv.appendChild(descEl);

  card.appendChild(iconSpan);
  card.appendChild(textDiv);

  container.appendChild(card);
}
