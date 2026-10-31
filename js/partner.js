/**
 * ==============================================================================
 * GLOBAL COFFEE — FRANCHISE PARTNER APPLICATION (JQUERY 3.7.1)
 * File: js/partner.js
 * 
 * JQUERY VERSION: 3.7.1
 * WHY $(function () { ... }) IS NEEDED:
 * Attaches submit handlers after partner form and confirmation containers have parsed.
 * ==============================================================================
 */

'use strict';

$(function () {
  initPartnerForm();
});

function initPartnerForm() {
  const $form = $('#partnerForm');
  const $nameInput = $('#name');
  const $phoneInput = $('#phone');
  const $cityInput = $('#city');
  const $ageInput = $('#age');
  const $errorAlert = $('#partnerError');
  const $confirmAlert = $('#partnerConfirmation');
  const $resultBox = $('#partnerResult');

  if (!$form.length) return;

  // Clear errors dynamically on input
  $form.find('input').on('input', function () {
    $(this).removeClass('is-invalid error');
    if ($errorAlert.is(':visible')) {
      $errorAlert.slideUp(200);
    }
  });

  $form.on('submit', function (e) {
    /**
     * WHY event.preventDefault() IS NEEDED:
     * Halts default browser GET request and URL query-string reload,
     * allowing our custom registration logic, candidate card creation,
     * and smooth scroll animations to run within the page.
     */
    e.preventDefault();

    const name = $.trim($nameInput.val());
    const phone = $.trim($phoneInput.val());
    const city = $.trim($cityInput.val()) || 'Астана';
    const age = $.trim($ageInput.val()) || 'Не указан';

    let hasErrors = false;

    if (!name) {
      $nameInput.addClass('is-invalid error');
      hasErrors = true;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      $phoneInput.addClass('is-invalid error');
      hasErrors = true;
    }

    if (hasErrors) {
      $errorAlert.removeClass('hidden').hide().slideDown(250);
      $('html, body').animate({
        scrollTop: $errorAlert.offset().top - 20
      }, 300);
      return;
    }

    $errorAlert.slideUp(200, function () {
      $(this).addClass('hidden');
    });

    const appId = '#FR-2026-' + Math.floor(100 + Math.random() * 900);

    if ($resultBox.length) {
      const resultHtml =
        '<div class="border-bottom pb-2 mb-2">' +
          '<span class="badge bg-success mb-1">Заявка ' + appId + '</span>' +
          '<h4 class="h6 fw-bold mb-1">Кандидат: ' + escapeHtml(name) + ' (' + escapeHtml(phone) + ')</h4>' +
          '<p class="small text-muted mb-0">Город для запуска: <strong>' + escapeHtml(city) + '</strong> · Возраст: <strong>' + escapeHtml(age) + '</strong></p>' +
        '</div>' +
        '<h5 class="h6 fw-bold mt-3 mb-2">Следующие шаги:</h5>' +
        '<ol class="small mb-2 ps-3">' +
          '<li>Директор по франчайзингу свяжется с вами по номеру ' + escapeHtml(phone) + ' в течение 24 часов.</li>' +
          '<li>Мы предоставим презентацию и финансовую модель окупаемости кофейни в г. ' + escapeHtml(city) + '.</li>' +
        '</ol>' +
        '<div class="small text-success fw-bold">✓ Статус: Успешно зарегистрировано в базе партнеров Global Coffee</div>';

      $resultBox.html(resultHtml);
    }

    // jQuery Effect: .fadeIn with callback and scrolling
    if ($confirmAlert.length) {
      $confirmAlert.removeClass('hidden').hide().fadeIn(350, function () {
        $('html, body').animate({
          scrollTop: $confirmAlert.offset().top - 20
        }, 300);
      });
    }

    $form[0].reset();
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
