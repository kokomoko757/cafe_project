'use strict';

const BRANCH_NAMES = {
  turkestan: 'ул. Туркестан, 4Б (Флагман)',
  mangilik: 'пр. Мангилик Ел, 38',
  mega: 'ТРЦ MEGA Silk Way',
  dostyk: 'ул. Достык, 9',
  other: 'Астана (филиал сети)'
};
const REVIEW_STORAGE_KEY = 'global_coffee_user_reviews';

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('reviewsGrid');
  const form = document.getElementById('reviewForm');
  if (!grid || !form) return;

  const author = document.getElementById('review_author');
  const branch = document.getElementById('review_branch');
  const rating = document.getElementById('review_rating');
  const text = document.getElementById('review_text');
  const error = document.getElementById('reviewError');
  const confirmation = document.getElementById('reviewConfirmation');
  const reviews = loadReviews();

  const filter = document.createElement('select');
  filter.className = 'form-select mb-2';
  filter.setAttribute('aria-label', 'Фильтр отзывов по филиалу');
  filter.add(new Option('Все филиалы', ''));
  for (const name of Object.values(BRANCH_NAMES)) filter.add(new Option(name, name));

  const count = document.createElement('p');
  count.className = 'small text-muted mb-3';
  count.setAttribute('role', 'status');
  grid.before(filter, count);

  for (const card of grid.children) {
    card.dataset.branch = card.querySelector('em')?.textContent.trim() || '';
  }
  grid.prepend(...reviews.map(createReviewCard));

  function applyFilter() {
    let visible = 0;
    for (const card of grid.children) {
      const matches = !filter.value || card.dataset.branch === filter.value;
      card.classList.toggle('hidden', !matches);
      if (matches) visible++;
    }
    count.textContent = visible ? `Найдено отзывов: ${visible}` : 'Для этого филиала пока нет отзывов.';
  }

  filter.addEventListener('change', applyFilter);
  applyFilter();

  // Один обработчик также работает для карточек, добавленных после загрузки.
  grid.addEventListener('click', function (event) {
    const button = event.target.closest('.like-review-btn');
    if (!button) return;
    const liked = button.getAttribute('aria-pressed') === 'true';
    const likes = Number(button.dataset.likes) + (liked ? -1 : 1);
    button.dataset.likes = likes;
    button.querySelector('.like-counter').textContent = likes;
    button.setAttribute('aria-pressed', String(!liked));
    button.classList.toggle('btn-outline-secondary', liked);
    button.classList.toggle('btn-danger', !liked);
  });

  form.addEventListener('input', function (event) {
    if (event.target.value.trim()) event.target.classList.remove('is-invalid', 'error');
    if (!form.querySelector('.is-invalid')) error.classList.add('hidden');
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    confirmation.classList.add('hidden');
    const invalid = [author, text].filter(field => !field.value.trim());
    for (const field of invalid) field.classList.add('is-invalid', 'error');
    error.classList.toggle('hidden', invalid.length === 0);
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const review = {
      id: 'rev_' + Date.now(),
      author: author.value.trim(),
      branch: BRANCH_NAMES[branch.value] || BRANCH_NAMES.other,
      rating: Number(rating.value),
      text: text.value.trim(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    reviews.unshift(review);
    try {
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.warn('Не удалось сохранить отзыв:', error);
    }

    grid.prepend(createReviewCard(review));
    if (filter.value && filter.value !== review.branch) filter.value = review.branch;
    applyFilter();
    confirmation.classList.remove('hidden');
    form.reset();
  });
});

function loadReviews() {
  try {
    const saved = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) return saved.filter(review => review && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5);
  } catch (error) {
    console.warn('Не удалось прочитать отзывы:', error);
  }
  return [];
}

function createReviewCard(review) {
  const column = document.createElement('div');
  column.className = 'col-12 col-md-6 col-lg-4';
  column.dataset.branch = review.branch;
  column.innerHTML = `
    <article class="card h-100 shadow-sm border rounded-3 p-3 bg-white border-warning">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h3 class="h5 fw-bold mb-0"></h3>
        <span class="badge bg-warning text-dark"></span>
      </div>
      <p class="small text-muted mb-2"><span></span> · <em></em></p>
      <blockquote class="blockquote flex-grow-1"><p class="small mb-0"></p></blockquote>
      <div class="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
        <div>
          <span class="badge bg-success me-1">Отзыв гостя</span>
          <span class="badge bg-info text-dark">Новый</span>
        </div>
        <button type="button" class="btn btn-outline-secondary btn-sm like-review-btn" data-likes="0" aria-pressed="false" title="Поблагодарить за отзыв">
          ❤️ <span class="like-counter">0</span>
        </button>
      </div>
    </article>`;
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  column.querySelector('h3').textContent = review.author;
  column.querySelector('.bg-warning').textContent = `${stars} ${review.rating}.0`;
  column.querySelector('p span').textContent = review.date;
  column.querySelector('em').textContent = review.branch;
  column.querySelector('blockquote p').textContent = `«${review.text}»`;
  return column;
}
