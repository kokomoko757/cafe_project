/**
 * GLOBAL COFFEE — Динамические отзывы и сохранение (js/reviews.js)
 * Реализует:
 * 1. Валидацию формы добавления отзыва (#reviewForm)
 * 2. Мгновенный динамический рендеринг новой карточки отзыва в начало списка
 * 3. Сохранение отзывов в localStorage для персистентности между перезагрузками
 * 4. Загрузку ранее сохраненных отзывов при старте страницы
 */

document.addEventListener('DOMContentLoaded', () => {
    initReviewsForm();
    loadStoredReviews();
});

const BRANCH_NAMES = {
    turkestan: 'ул. Туркестан, 4Б (Флагман)',
    mangilik: 'пр. Мангилик Ел, 38',
    mega: 'ТРЦ MEGA Silk Way',
    dostyk: 'ул. Достык, 9',
    other: 'Астана (филиал сети)'
};

function initReviewsForm() {
    const form = document.getElementById('reviewForm');
    const authorInput = document.getElementById('review_author');
    const branchSelect = document.getElementById('review_branch');
    const ratingSelect = document.getElementById('review_rating');
    const textInput = document.getElementById('review_text');
    const errorAlert = document.getElementById('reviewError');
    const confirmAlert = document.getElementById('reviewConfirmation');
    const reviewsGrid = document.querySelector('.page-content section:nth-of-type(1) .row.g-4');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const author = authorInput?.value.trim();
        const branchKey = branchSelect?.value;
        const branchName = BRANCH_NAMES[branchKey] || 'Global Coffee Астана';
        const rating = parseInt(ratingSelect?.value || '5', 10);
        const text = textInput?.value.trim();

        if (!author || !text) {
            if (errorAlert) {
                errorAlert.classList.remove('hidden');
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (errorAlert) {
            errorAlert.classList.add('hidden');
        }

        const newReview = {
            id: 'rev_' + Date.now(),
            author: author,
            branch: branchName,
            rating: rating,
            text: text,
            date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
        };

        // Рендерим новую карточку в DOM
        renderReviewCard(newReview, reviewsGrid, true);

        // Сохраняем в localStorage
        saveReviewToStorage(newReview);

        // Показываем подтверждение
        if (confirmAlert) {
            confirmAlert.classList.remove('hidden');
            confirmAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        form.reset();
    });
}

function renderReviewCard(review, container, prepend = false) {
    if (!container) return;

    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    col.innerHTML = `
        <article class="card h-100 shadow-sm border rounded-3 p-3 bg-white border-warning">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h3 class="h5 fw-bold mb-0">${escapeHtml(review.author)}</h3>
                <span class="badge bg-warning text-dark">${stars} ${review.rating}.0</span>
            </div>
            <p class="small text-muted mb-2">${review.date} · <em>${escapeHtml(review.branch)}</em></p>
            <blockquote class="blockquote flex-grow-1">
                <p class="small mb-0">«${escapeHtml(review.text)}»</p>
            </blockquote>
            <div class="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                <span class="badge bg-success">Отзыв гостя</span>
                <span class="badge bg-info text-dark">Новый</span>
            </div>
        </article>
    `;

    if (prepend && container.firstChild) {
        container.insertBefore(col, container.firstChild);
    } else {
        container.appendChild(col);
    }
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
        const reviewsGrid = document.querySelector('.page-content section:nth-of-type(1) .row.g-4');
        if (!reviewsGrid || stored.length === 0) return;

        stored.forEach(review => {
            renderReviewCard(review, reviewsGrid, true);
        });
    } catch (e) {
        console.warn('LocalStorage load error:', e);
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
