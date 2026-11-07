/**
 * ==============================================================================
 * GLOBAL COFFEE — REVIEWS & GUEST FEEDBACK (JQUERY 3.7.1)
 * File: js/reviews.js
 * 
 * JQUERY VERSION: 3.7.1
 * WHY $(function () { ... }) IS NEEDED:
 * Ensures the review grid container and submission form exist before rendering
 * dynamic review cards or binding delegated interaction handlers.
 * ==============================================================================
 */

'use strict';

const BRANCH_NAMES = {
  turkestan: 'ул. Туркестан, 4Б (Флагман)',
  mangilik: 'пр. Мангилик Ел, 38',
  mega: 'ТРЦ MEGA Silk Way',
  dostyk: 'ул. Достык, 9',
  other: 'Астана (филиал сети)'
};

$(function () {
  initDelegatedReviewInteractions();
  initReviewsForm();
  loadStoredReviews();
});

/**
 * ==============================================================================
 * DELEGATED EVENT HANDLER (RUBRIC REQUIREMENT)
 * 
 * WHY BINDING DIRECTLY TO .like-review-btn WOULD NOT WORK:
 * Direct event binding (e.g., $('.like-review-btn').on('click', ...)) queries the DOM
 * only once when this function runs. Any review card added later (either from localStorage
 * or when a visitor submits a new review) did not exist at execution time and therefore
 * would have no listener attached at all!
 * By binding to the existing parent container ($('#reviewsGrid')) and passing the selector
 * '.like-review-btn' as the second argument of .on(), jQuery intercepts the event as it
 * bubbles up, ensuring cards created at any point in the future respond to clicks seamlessly.
 * ==============================================================================
 */
function initDelegatedReviewInteractions() {
  const $grid = $('.page-content section:first .row.g-4');
  $grid.attr('id', 'reviewsGrid');

  // Delegated click handler on existing parent (#reviewsGrid) reacting to dynamically created buttons
  $('#reviewsGrid').on('click', '.like-review-btn', function (event) {
    /**
     * WHY event.preventDefault() IS NEEDED:
     * Prevents the button from triggering unintended parent form behaviors or
     * jumping the browser viewport.
     */
    event.preventDefault();

    // $(this) inside the delegated handler refers to the specific .like-review-btn clicked
    const $btn = $(this);
    const currentCount = parseInt($btn.data('likes') || 0, 10);
    const liked = $btn.attr('aria-pressed') === 'true';
    const newCount = liked ? Math.max(0, currentCount - 1) : currentCount + 1;
    $btn.attr('aria-pressed', String(!liked));

    $btn.data('likes', newCount);
    $btn.find('.like-counter').text(newCount);
    $btn.toggleClass('btn-outline-danger btn-danger text-white');

    // jQuery Effect: subtle pulse effect with .animate()
    $btn.animate({ opacity: 0.6 }, 100).animate({ opacity: 1 }, 150);
  });
}

/**
 * Review Submission with jQuery Validation
 */
function initReviewsForm() {
  const $form = $('#reviewForm');
  const $authorInput = $('#review_author');
  const $branchSelect = $('#review_branch');
  const $ratingSelect = $('#review_rating');
  const $textInput = $('#review_text');
  const $errorAlert = $('#reviewError');
  const $confirmAlert = $('#reviewConfirmation');
  const $reviewsGrid = $('#reviewsGrid');

  if (!$form.length) return;

  // Clear errors dynamically on input
  $form.find('input, select, textarea').on('input change', function () {
    $(this).removeClass('is-invalid error');
    $(this).parent().find('.field-error-msg').remove();
    if ($errorAlert.is(':visible')) {
      $errorAlert.slideUp(200);
    }
  });

  $form.on('submit', function (e) {
    $confirmAlert.stop(true, true).hide().addClass('hidden');
    $form.find('.field-error-msg').remove();
    /**
     * WHY event.preventDefault() IS NEEDED:
     * Prevents standard HTTP form submission and page reloading, allowing
     * client-side rendering of the new review card and animated prepend into the grid.
     */
    e.preventDefault();

    const author = $.trim($authorInput.val());
    const branchKey = $branchSelect.val();
    const branchName = BRANCH_NAMES[branchKey] || 'Global Coffee Астана';
    const rating = Number($ratingSelect.val());
    const text = $.trim($textInput.val());

    let hasErrors = false;

    if (!author) {
      showReviewError($authorInput, 'Укажите ваше имя.');
      hasErrors = true;
    }
    if (!BRANCH_NAMES[branchKey]) {
      showReviewError($branchSelect, 'Выберите филиал.');
      hasErrors = true;
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      showReviewError($ratingSelect, 'Выберите оценку от 1 до 5.');
      hasErrors = true;
    }
    if (!text) {
      showReviewError($textInput, 'Напишите отзыв.');
      hasErrors = true;
    }

    if (hasErrors) {
      $errorAlert.removeClass('hidden').hide().slideDown(250);
      return;
    }

    $errorAlert.slideUp(200, function () {
      $(this).addClass('hidden');
    });

    const newReview = {
      id: 'rev_' + Date.now(),
      author: author,
      branch: branchName,
      rating: rating,
      text: text,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    // Render new card prepended with .prepend() and .fadeIn()
    renderReviewCard(newReview, $reviewsGrid, true);
    saveReviewToStorage(newReview);

    // Show success message with effect
    $confirmAlert.removeClass('hidden').hide().fadeIn(300);

    $form[0].reset();
  });
}

/**
 * ==============================================================================
 * DYNAMIC CARD GENERATION FROM ARRAY IN CODE WITH .append() / .prepend()
 * 
 * The cards built here are created entirely dynamically in JavaScript and
 * appended to the DOM.
 * ==============================================================================
 */
function renderReviewCard(review, $container, prepend) {
  if (!$container || !$container.length) return;

  if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) return;
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  const $col = $('<div>').addClass('col-12 col-md-6 col-lg-4');

  const cardHtml =
    '<article class="card h-100 shadow-sm border rounded-3 p-3 bg-white border-warning">' +
      '<div class="d-flex justify-content-between align-items-start mb-2">' +
        '<h3 class="h5 fw-bold mb-0">' + escapeHtml(review.author) + '</h3>' +
        '<span class="badge bg-warning text-dark">' + stars + ' ' + review.rating + '.0</span>' +
      '</div>' +
      '<p class="small text-muted mb-2">' + review.date + ' · <em>' + escapeHtml(review.branch) + '</em></p>' +
      '<blockquote class="blockquote flex-grow-1">' +
        '<p class="small mb-0">«' + escapeHtml(review.text) + '»</p>' +
      '</blockquote>' +
      '<div class="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">' +
        '<div>' +
          '<span class="badge bg-success me-1">Отзыв гостя</span>' +
          '<span class="badge bg-info text-dark">Новый</span>' +
        '</div>' +
        '<button type="button" class="btn btn-outline-secondary btn-sm like-review-btn" data-likes="0" title="Поблагодарить за отзыв">' +
          '❤️ <span class="like-counter">0</span>' +
        '</button>' +
      '</div>' +
    '</article>';

  $col.html(cardHtml).hide();

  if (prepend && $container.children().length) {
    $container.prepend($col);
  } else {
    $container.append($col);
  }

  // Effect: smooth fadeIn of the newly constructed card
  $col.fadeIn(350);
}

function saveReviewToStorage(review) {
  try {
    const stored = JSON.parse(localStorage.getItem('global_coffee_user_reviews') || '[]');
    stored.unshift(review);
    localStorage.setItem('global_coffee_user_reviews', JSON.stringify(stored));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

function loadStoredReviews() {
  try {
    const stored = JSON.parse(localStorage.getItem('global_coffee_user_reviews') || '[]');
    const $reviewsGrid = $('#reviewsGrid');
    if (!$reviewsGrid.length || stored.length === 0) return;

    // Traversal using .each()
    $.each(stored, function (index, review) {
      renderReviewCard(review, $reviewsGrid, true);
    });
  } catch (e) {
    console.warn('LocalStorage load error:', e);
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showReviewError($field, message) {
  $field.addClass('is-invalid error');
  $('<div>').addClass('invalid-feedback d-block field-error-msg').text(message).appendTo($field.parent());
}
