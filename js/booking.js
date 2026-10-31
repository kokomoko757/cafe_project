/**
 * ==============================================================================
 * GLOBAL COFFEE — BOOKING & RESERVATION (JQUERY 3.7.1)
 * File: js/booking.js
 * 
 * JQUERY VERSION: 3.7.1
 * WHY $(function () { ... }) IS NEEDED:
 * Protects table grid buttons and booking form elements from being accessed
 * before DOM rendering completes.
 * ==============================================================================
 */

'use strict';

const TABLES_CATALOG = [
  { id: 1, name: 'Стол 1', seats: 2, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
  { id: 2, name: 'Стол 2', seats: 2, zone: 'Центральный зал', depositPerGuest: 1000 },
  { id: 3, name: 'Стол 3', seats: 4, zone: 'Lounge-зона у бара', depositPerGuest: 1000 },
  { id: 4, name: 'Стол 4', seats: 4, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
  { id: 6, name: 'Стол 6', seats: 4, zone: 'Lounge-зона у бара', depositPerGuest: 1000 },
  { id: 7, name: 'Стол 7', seats: 2, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
  { id: 8, name: 'Стол 8', seats: 4, zone: 'Центральный зал', depositPerGuest: 1000 },
  { id: 9, name: 'Стол 9', seats: 6, zone: 'Lounge-зона у бара', depositPerGuest: 1000 }
];

$(function () {
  initTableSelectionGrid();
  initBookingDetailsPage();
});

function findTableById(tableId) {
  const numId = parseInt(tableId, 10);
  return TABLES_CATALOG.find(t => t.id === numId);
}

function calculateBookingDeposit(guestCount, ratePerGuest) {
  const rate = typeof ratePerGuest === 'number' ? ratePerGuest : 1000;
  const guests = typeof guestCount === 'number' && guestCount > 0 ? guestCount : 1;
  return guests * rate;
}

/**
 * 1. Interactive Table Grid Handler
 * Uses jQuery attribute prefix selector [id^="table-btn-"], $(this), .prop(), and .attr().
 */
function initTableSelectionGrid() {
  const $tableButtons = $('[id^="table-btn-"]');
  const $quickSelectBtn = $('#quickSelectBtn');

  if (!$tableButtons.length) return;

  $tableButtons.on('click', function (e) {
    // Check if element has disabled property using .prop()
    if ($(this).prop('disabled') || $(this).hasClass('disabled')) {
      e.preventDefault();
      return;
    }

    // Extract table id from button's id attribute using $(this).attr('id')
    const tableNum = $(this).attr('id').replace('table-btn-', '');
    const tableInfo = findTableById(tableNum) || {
      id: parseInt(tableNum, 10),
      name: 'Стол ' + tableNum,
      seats: 2,
      zone: 'Основной зал',
      depositPerGuest: 1000
    };

    try {
      localStorage.setItem('global_coffee_selected_table', JSON.stringify(tableInfo));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  });

  if ($quickSelectBtn.length) {
    $quickSelectBtn.on('click', function () {
      const defaultTable = TABLES_CATALOG[0];
      try {
        localStorage.setItem('global_coffee_selected_table', JSON.stringify(defaultTable));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
    });
  }
}

/**
 * Helper to display inline validation error next to a specific field.
 * Uses traversal: .parent(), .find(), and jQuery effect: .slideDown()
 */
function setBookingFieldError($field, message) {
  if (!$field || !$field.length) return;

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

/**
 * Helper to clear inline error on field fix.
 * Uses .slideUp() effect and .removeClass()
 */
function clearBookingFieldError($field) {
  if (!$field || !$field.length) return;

  $field.removeClass('is-invalid error');
  const $feedback = $field.parent().find('.invalid-feedback.field-error-msg');
  if ($feedback.length) {
    $feedback.slideUp(150, function () {
      $(this).remove();
    });
  }
}

/**
 * ==============================================================================
 * BOOKING FORM VALIDATION WITH JQUERY
 * 
 * WHY CLIENT-SIDE BROWSER VALIDATION NEVER REPLACES SERVER VALIDATION:
 * Client-side JavaScript validation runs in an untrusted visitor environment and can
 * easily be bypassed (e.g., via disabling JS in browser settings or sending raw HTTP requests).
 * Browser validation is designed to enhance user experience with immediate guidance;
 * genuine data validation, sanitization and authentication must always be executed by the server.
 * ==============================================================================
 */
function initBookingDetailsPage() {
  const $form = $('#bookingDetailsForm');
  if (!$form.length) return;

  const $dateInput = $('#date');
  const $timeSelect = $('#time');
  const $guestsInput = $('#guests');
  const $nameInput = $('#name');
  const $phoneInput = $('#phone');
  const $emailInput = $('#email');
  const $commentInput = $('#comment');
  const $errorAlert = $('#bookingError');
  const $confirmAlert = $('#bookingConfirmation');
  const $resultBox = $('#bookingResult');

  // Clear errors dynamically on input or change event
  $form.find('input, select, textarea').on('input change', function () {
    clearBookingFieldError($(this));
    if ($errorAlert.is(':visible')) {
      $errorAlert.slideUp(200);
    }
  });

  // Set minimum date attribute to today
  const today = new Date().toISOString().split('T')[0];
  if ($dateInput.length) {
    $dateInput.attr('min', today);
    if (!$dateInput.val()) {
      $dateInput.val(today);
    }
  }

  // Restore selected table banner if available in localStorage
  let selectedTable = null;
  try {
    const saved = localStorage.getItem('global_coffee_selected_table');
    if (saved) selectedTable = JSON.parse(saved);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  if (selectedTable && !$('#selectedTableBanner').length) {
    const bannerHtml =
      '<div id="selectedTableBanner" class="alert alert-info d-flex align-items-center mb-4">' +
        '<span class="fs-3 me-3">🪑</span>' +
        '<div>' +
          '<strong>Выбранный столик: ' + escapeHtml(selectedTable.name) + ' (' + selectedTable.seats + ' места, ' + escapeHtml(selectedTable.zone) + ')</strong>' +
          '<div class="small text-muted">' +
            'Хотите изменить столик? <a href="booking.html" class="alert-link">Вернуться к схеме зала</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    $form.before(bannerHtml);

    if ($guestsInput.length && !$guestsInput.val()) {
      $guestsInput.val(selectedTable.seats.toString());
    }
  }

  // Form submit handler with jQuery validation
  $form.on('submit', function (e) {
    /**
     * WHY event.preventDefault() IS NEEDED:
     * Without e.preventDefault(), the browser immediately executes a default HTTP submit,
     * reloading the document or navigating to #bookingConfirmation.
     * This wipes all interactive state and prevents our jQuery validation and animations from running.
     */
    e.preventDefault();

    let hasErrors = false;
    let $firstInvalid = null;

    // 1. Name validation
    const trimmedName = $.trim($nameInput.val());
    if (trimmedName.length < 2) {
      setBookingFieldError($nameInput, 'Пожалуйста, укажите ваше имя (минимум 2 символа).');
      if (!$firstInvalid) $firstInvalid = $nameInput;
      hasErrors = true;
    }

    // 2. Phone validation with regex
    const phoneDigits = $phoneInput.val().replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setBookingFieldError($phoneInput, 'Укажите контактный номер телефона (+7 7XX XXX-XX-XX).');
      if (!$firstInvalid) $firstInvalid = $phoneInput;
      hasErrors = true;
    }

    // 3. Email validation (if provided)
    const emailVal = $.trim($emailInput.val());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal.length > 0 && !emailRegex.test(emailVal)) {
      setBookingFieldError($emailInput, 'Пожалуйста, введите корректный адрес электронной почты.');
      if (!$firstInvalid) $firstInvalid = $emailInput;
      hasErrors = true;
    }

    // 4. Date validation
    const selectedDate = $dateInput.val();
    if (!selectedDate || selectedDate < today) {
      setBookingFieldError($dateInput, 'Выберите корректную дату бронирования (не ранее сегодня).');
      if (!$firstInvalid) $firstInvalid = $dateInput;
      hasErrors = true;
    }

    // 5. Time validation
    const selectedTime = $timeSelect.val();
    if (!selectedTime) {
      setBookingFieldError($timeSelect, 'Пожалуйста, выберите удобное время посещения.');
      if (!$firstInvalid) $firstInvalid = $timeSelect;
      hasErrors = true;
    }

    // 6. Guests count validation
    const guestCount = parseInt($guestsInput.val(), 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 10) {
      setBookingFieldError($guestsInput, 'Количество гостей должно быть от 1 до 10 человек.');
      if (!$firstInvalid) $firstInvalid = $guestsInput;
      hasErrors = true;
    } else if (selectedTable && typeof selectedTable.seats === 'number') {
      if (guestCount > selectedTable.seats) {
        setBookingFieldError(
          $guestsInput,
          'Количество гостей (' + guestCount + ') превышает вместимость выбранного столика (' + selectedTable.seats + ' мест). Пожалуйста, выберите столик большего размера.'
        );
        if (!$firstInvalid) $firstInvalid = $guestsInput;
        hasErrors = true;
      }
    }

    // If invalid, show general error alert and focus first field
    if (hasErrors) {
      if ($errorAlert.length) {
        $errorAlert.removeClass('hidden').slideDown(250);
      }
      if ($firstInvalid) {
        $firstInvalid.focus();
      }
      return;
    }

    // Validation passed: hide errors
    if ($errorAlert.length) {
      $errorAlert.slideUp(200, function () {
        $(this).addClass('hidden');
      });
    }

    const bookingCode = window.GlobalCoffee.generateReferenceCode('BK');
    const tableName = selectedTable ? selectedTable.name + ' (' + selectedTable.zone + ')' : 'Стол в основном зале';
    const formattedDate = window.GlobalCoffee.formatDateDisplay(selectedDate);
    const commentText = $.trim($commentInput.val()) || 'Без особых пожеланий';
    const depositTotal = calculateBookingDeposit(guestCount, 1000);
    const formattedDeposit = window.GlobalCoffee.formatPrice(depositTotal);

    // Build confirmation HTML using jQuery .html()
    if ($resultBox.length) {
      const detailsHtml =
        '<div class="border-bottom pb-2 mb-2">' +
          '<span class="badge bg-success mb-1">Бронь подтверждена</span>' +
          '<h4 class="h6 fw-bold mb-1">Код брони: ' + bookingCode + '</h4>' +
          '<p class="small text-muted mb-0">Гость: ' + escapeHtml(trimmedName) + ' (' + escapeHtml($phoneInput.val()) + ')</p>' +
        '</div>' +
        '<div class="row g-2 mb-2 small">' +
          '<div class="col-6">Столик: ' + escapeHtml(tableName) + '</div>' +
          '<div class="col-6">Персон: ' + guestCount + ' чел.</div>' +
          '<div class="col-6">Дата: ' + formattedDate + '</div>' +
          '<div class="col-6">Время: ' + selectedTime + '</div>' +
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

      $resultBox.html(detailsHtml);
    }

    // jQuery Effect 2: .slideDown(400) with animate scroll
    if ($confirmAlert.length) {
      $confirmAlert.removeClass('hidden').hide().slideDown(400, function () {
        $('html, body').animate({
          scrollTop: $confirmAlert.offset().top - 20
        }, 350);
      });
    }

    try {
      localStorage.removeItem('global_coffee_selected_table');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    $form[0].reset();
  });
}
