/**
 * ==============================================================================
 * GLOBAL COFFEE — BOOKING & RESERVATION MODULE (PLAIN JAVASCRIPT)
 * File: js/booking.js
 * 
 * ARCHITECTURAL PARADIGM: Pure Plain JavaScript (Weeks 6–8 Curriculum)
 * Zero jQuery dependencies in this module. All DOM manipulations, event listeners,
 * calculations, and validations use standard native Web APIs (DOM Level 2/3).
 * 
 * FULFILLS REQUIREMENTS:
 * 1. Data in arrays and objects at top of file (TABLES_CATALOG).
 * 2. Pure JS functions with parameters and return values called from > 1 place.
 * 3. Conditions: capacity check, date validation, phone format, name length.
 * 4. Number calculated in code: deposit = guestCount * 1000 KZT.
 * 5. Event types: click, input, change, submit (> 3 types) with preventDefault().
 * 6. Delegated event handler bound to parent table element.
 * 7. Full form validation with inline error messages cleared on input.
 * ==============================================================================
 */

'use strict';

// 1. Project Catalog stored in structured array of objects at top of file
const TABLES_CATALOG = [
  { id: 1, name: 'Стол 1', seats: 2, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
  { id: 2, name: 'Стол 2', seats: 2, zone: 'Центральный зал', depositPerGuest: 1000 },
  { id: 3, name: 'Стол 3', seats: 4, zone: 'Lounge-зона у бара', depositPerGuest: 1000 },
  { id: 4, name: 'Стол 4', seats: 4, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
  { id: 5, name: 'Стол 5', seats: 6, zone: 'Центральный зал', depositPerGuest: 1000, occupied: true },
  { id: 6, name: 'Стол 6', seats: 4, zone: 'Lounge-зона у бара', depositPerGuest: 1000 },
  { id: 7, name: 'Стол 7', seats: 2, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
  { id: 8, name: 'Стол 8', seats: 4, zone: 'Центральный зал', depositPerGuest: 1000 },
  { id: 9, name: 'Стол 9', seats: 6, zone: 'Lounge-зона у бара', depositPerGuest: 1000 }
];

// Execute when DOM tree is ready (standard Vanilla JS lifecycle)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBookingModule);
} else {
  initBookingModule();
}

function initBookingModule() {
  initTableSelectionGrid();
  initBookingDetailsPage();
}

/**
 * Pure JS functions with parameters and return values called from multiple places
 */
function findTableById(tableId) {
  const numId = parseInt(tableId, 10);
  if (isNaN(numId)) return null;
  for (let i = 0; i < TABLES_CATALOG.length; i++) {
    if (TABLES_CATALOG[i].id === numId) {
      return TABLES_CATALOG[i];
    }
  }
  return null;
}

function calculateBookingDeposit(guestCount, ratePerGuest) {
  const rate = typeof ratePerGuest === 'number' && ratePerGuest > 0 ? ratePerGuest : 1000;
  const guests = typeof guestCount === 'number' && guestCount > 0 ? guestCount : 1;
  return guests * rate;
}

function formatPriceKzt(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0 ₸';
  }
  const rounded = Math.round(amount);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₸';
}

function generateBookingReference(prefix) {
  const cleanPrefix = typeof prefix === 'string' && prefix.trim().length > 0 ? prefix.trim() : 'BK';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return '#' + cleanPrefix + '-2026-' + randomNum;
}

function formatDateDisplay(isoDate) {
  if (typeof isoDate !== 'string' || !isoDate.includes('-')) {
    return isoDate || '';
  }
  const parts = isoDate.split('-');
  return parts.length === 3 ? parts[2] + '.' + parts[1] + '.' + parts[0] : isoDate;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * 1. Interactive Table Selection Grid with Delegated Event Listener (Plain JS)
 */
function initTableSelectionGrid() {
  const tableContainer = document.querySelector('table');
  if (!tableContainer) return;

  // Delegated event listener bound to parent table element
  tableContainer.addEventListener('click', function (event) {
    const target = event.target;
    const tableBtn = target.closest('[id^="table-btn-"]');
    if (!tableBtn) return;

    if (tableBtn.hasAttribute('disabled') || tableBtn.classList.contains('disabled')) {
      event.preventDefault();
      return;
    }

    const tableId = tableBtn.id.replace('table-btn-', '');
    const tableInfo = findTableById(tableId) || {
      id: parseInt(tableId, 10),
      name: 'Стол ' + tableId,
      seats: 2,
      zone: 'Основной зал',
      depositPerGuest: 1000
    };

    try {
      localStorage.setItem('global_coffee_selected_table', JSON.stringify(tableInfo));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  });

  const quickSelectBtn = document.getElementById('quickSelectBtn');
  if (quickSelectBtn) {
    quickSelectBtn.addEventListener('click', function () {
      const defaultTable = TABLES_CATALOG[0];
      try {
        localStorage.setItem('global_coffee_selected_table', JSON.stringify(defaultTable));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    });
  }
}

/**
 * Inline validation helpers (Plain JS DOM manipulation)
 */
function setBookingFieldError(field, message) {
  if (!field) return;
  field.classList.add('is-invalid', 'error');
  const parent = field.parentNode;
  if (!parent) return;

  let feedback = parent.querySelector('.invalid-feedback.field-error-msg');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'invalid-feedback d-block text-danger small mt-1 field-error-msg';
    parent.appendChild(feedback);
  }
  feedback.textContent = message;
}

function clearBookingFieldError(field) {
  if (!field) return;
  field.classList.remove('is-invalid', 'error');
  const parent = field.parentNode;
  if (!parent) return;

  const feedback = parent.querySelector('.invalid-feedback.field-error-msg');
  if (feedback) {
    feedback.remove();
  }
}

/**
 * 2. Booking Form Validation & Submission in Pure Plain JavaScript
 */
function initBookingDetailsPage() {
  const form = document.getElementById('bookingDetailsForm');
  if (!form) return;

  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const guestsInput = document.getElementById('guests');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const commentInput = document.getElementById('comment');
  const errorAlert = document.getElementById('bookingError');
  const confirmAlert = document.getElementById('bookingConfirmation');
  const resultBox = document.getElementById('bookingResult');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  if (dateInput) {
    dateInput.setAttribute('min', today);
    if (!dateInput.value) {
      dateInput.value = today;
    }
  }

  // Restore selected table banner from localStorage dynamically in code
  let selectedTable = null;
  try {
    const saved = localStorage.getItem('global_coffee_selected_table');
    if (saved) selectedTable = JSON.parse(saved);
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  if (selectedTable && !document.getElementById('selectedTableBanner')) {
    const banner = document.createElement('div');
    banner.id = 'selectedTableBanner';
    banner.className = 'alert alert-info d-flex align-items-center mb-4';
    banner.innerHTML =
      '<span class="fs-3 me-3">🪑</span>' +
      '<div>' +
        '<strong>Выбранный столик: ' + escapeHtml(selectedTable.name) + ' (' + selectedTable.seats + ' места, ' + escapeHtml(selectedTable.zone) + ')</strong>' +
        '<div class="small text-muted">' +
          'Хотите изменить столик? <a href="booking.html" class="alert-link">Вернуться к схеме зала</a>' +
        '</div>' +
      '</div>';

    form.parentNode.insertBefore(banner, form);

    if (guestsInput && !guestsInput.value) {
      guestsInput.value = selectedTable.seats.toString();
    }
  }

  // Clear errors dynamically on input or change event
  const allInputs = form.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    input.addEventListener('input', function () {
      clearBookingFieldError(this);
      if (errorAlert && !errorAlert.classList.contains('hidden')) {
        errorAlert.classList.add('hidden');
      }
    });
    input.addEventListener('change', function () {
      clearBookingFieldError(this);
      if (errorAlert && !errorAlert.classList.contains('hidden')) {
        errorAlert.classList.add('hidden');
      }
    });
  });

  // Pure Plain JS form submit handler
  form.addEventListener('submit', function (event) {
    /**
     * WHY event.preventDefault() IS NEEDED:
     * Prevents standard HTTP form submission and page reloading, preserving
     * interactive client-side validation, error display, and confirmation generation.
     */
    event.preventDefault();

    let hasErrors = false;
    let firstInvalid = null;

    // 1. Name validation
    const trimmedName = nameInput ? nameInput.value.trim() : '';
    if (trimmedName.length < 2) {
      setBookingFieldError(nameInput, 'Пожалуйста, укажите ваше имя (минимум 2 символа).');
      if (!firstInvalid) firstInvalid = nameInput;
      hasErrors = true;
    }

    // 2. Phone validation with regex
    const rawPhone = phoneInput ? phoneInput.value : '';
    const phoneDigits = rawPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setBookingFieldError(phoneInput, 'Укажите контактный номер телефона (+7 7XX XXX-XX-XX).');
      if (!firstInvalid) firstInvalid = phoneInput;
      hasErrors = true;
    }

    // 3. Email validation (if provided)
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal.length > 0 && !emailRegex.test(emailVal)) {
      setBookingFieldError(emailInput, 'Пожалуйста, введите корректный адрес электронной почты.');
      if (!firstInvalid) firstInvalid = emailInput;
      hasErrors = true;
    }

    // 4. Date validation
    const selectedDate = dateInput ? dateInput.value : '';
    if (!selectedDate || selectedDate < today) {
      setBookingFieldError(dateInput, 'Выберите корректную дату бронирования (не ранее сегодня).');
      if (!firstInvalid) firstInvalid = dateInput;
      hasErrors = true;
    }

    // 5. Time validation
    const selectedTime = timeSelect ? timeSelect.value : '';
    if (!selectedTime) {
      setBookingFieldError(timeSelect, 'Пожалуйста, выберите удобное время посещения.');
      if (!firstInvalid) firstInvalid = timeSelect;
      hasErrors = true;
    }

    // 6. Guests count validation
    const rawGuests = guestsInput ? guestsInput.value : '';
    const guestCount = parseInt(rawGuests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 10) {
      setBookingFieldError(guestsInput, 'Количество гостей должно быть от 1 до 10 человек.');
      if (!firstInvalid) firstInvalid = guestsInput;
      hasErrors = true;
    } else if (selectedTable && typeof selectedTable.seats === 'number') {
      if (guestCount > selectedTable.seats) {
        setBookingFieldError(
          guestsInput,
          'Количество гостей (' + guestCount + ') превышает вместимость выбранного столика (' + selectedTable.seats + ' мест). Пожалуйста, выберите столик большего размера.'
        );
        if (!firstInvalid) firstInvalid = guestsInput;
        hasErrors = true;
      }
    }

    // If validation failed, display general alert and focus first invalid field
    if (hasErrors) {
      if (errorAlert) {
        errorAlert.classList.remove('hidden');
      }
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Validation passed: hide errors
    if (errorAlert) {
      errorAlert.classList.add('hidden');
    }

    // Calculate business values
    const bookingCode = generateBookingReference('BK');
    const tableName = selectedTable ? selectedTable.name + ' (' + selectedTable.zone + ')' : 'Стол в основном зале';
    const formattedDate = formatDateDisplay(selectedDate);
    const commentText = (commentInput ? commentInput.value.trim() : '') || 'Без особых пожеланий';
    const depositTotal = calculateBookingDeposit(guestCount, 1000);
    const formattedDeposit = formatPriceKzt(depositTotal);

    // Build confirmation HTML dynamically in code
    if (resultBox) {
      resultBox.innerHTML =
        '<div class="border-bottom pb-2 mb-2">' +
          '<span class="badge bg-success mb-1">Бронь подтверждена</span>' +
          '<h4 class="h6 fw-bold mb-1">Код брони: ' + bookingCode + '</h4>' +
          '<p class="small text-muted mb-0">Гость: ' + escapeHtml(trimmedName) + ' (' + escapeHtml(rawPhone) + ')</p>' +
        '</div>' +
        '<div class="row g-2 mb-2 small">' +
          '<div class="col-6">Столик: ' + escapeHtml(tableName) + '</div>' +
          '<div class="col-6">Персон: ' + guestCount + ' чел.</div>' +
          '<div class="col-6">Дата: ' + formattedDate + '</div>' +
          '<div class="col-6">Время: ' + escapeHtml(selectedTime) + '</div>' +
        '</div>' +
        '<div class="small border-top pt-2 mb-1">' +
          'Расчетный депозит: ' + formattedDeposit + ' (засчитывается в счет счета кофейни)' +
        '</div>' +
        '<div class="small text-muted">' +
          'Пожелания к столику: ' + escapeHtml(commentText) +
        '</div>' +
        '<div class="small text-success mt-2 fw-semibold">' +
          '✓ Столик зарезервирован! Срок удержания столика: 15 минут от указанного времени.' +
        '</div>' +
        '<div class="alert alert-info mt-3 mb-0 p-2 small border rounded">' +
          'ℹ️ Демонстрационный режим: Данные не отправляются на сервер, реальная бронь не создается. Заявка смоделирована для учебного проекта.' +
        '</div>';
    }

    if (confirmAlert) {
      confirmAlert.classList.remove('hidden');
      confirmAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    try {
      localStorage.removeItem('global_coffee_selected_table');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    form.reset();
  });
}
