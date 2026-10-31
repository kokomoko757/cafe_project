import React, { useState } from 'react';
import { ReviewItem } from '../types';
import { BRANCH_NAMES_DICT } from '../data/reviews';

interface ReviewsPageProps {
  reviews: ReviewItem[];
  onAddReview: (review: ReviewItem) => void;
  onNavigate: (page: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ reviews, onAddReview, onNavigate }) => {
  const [author, setAuthor] = useState('');
  const [branchKey, setBranchKey] = useState('');
  const [rating, setRating] = useState('5');
  const [text, setText] = useState('');

  const [hasError, setHasError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedAuthor = author.trim();
    const trimmedText = text.trim();

    if (!trimmedAuthor || !trimmedText) {
      setHasError(true);
      return;
    }

    setHasError(false);

    const branchName = BRANCH_NAMES_DICT[branchKey] || 'Global Coffee Астана';
    const ratingNum = parseInt(rating, 10) || 5;

    const newReview: ReviewItem = {
      id: 'rev_' + Date.now(),
      author: trimmedAuthor,
      branch: branchName,
      rating: ratingNum,
      text: trimmedText,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      isUserAdded: true
    };

    onAddReview(newReview);
    setShowConfirmation(true);

    setAuthor('');
    setBranchKey('');
    setRating('5');
    setText('');

    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAuthor('');
    setBranchKey('');
    setRating('5');
    setText('');
    setHasError(false);
  };

  const renderStars = (count: number) => {
    return '★'.repeat(count) + '☆'.repeat(Math.max(0, 5 - count));
  };

  return (
    <main className="page-content container py-5">
      {/* Вводная секция */}
      <div className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white text-center text-md-start">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div>
            <h1 className="section-title display-6 fw-bold mb-2">Отзывы гостей</h1>
            <p className="lead text-muted mb-0">
              Средняя оценка в 2ГИС: <strong className="text-warning fs-5">★ 4.9 из 5.0</strong> на основе тысяч отзывов жителей и гостей Астаны.
            </p>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('booking')}
            >
              Забронировать визит &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Сетка отзывов гостей */}
      <section className="mb-5">
        <h2 className="section-title h3 fw-bold mb-4 border-bottom pb-2">Мнения наших гостей</h2>
        <div className="row g-4">
          {reviews.map(review => (
            <div key={review.id} className="col-12 col-md-6 col-lg-4">
              <article className={`card h-100 shadow-sm border rounded-3 p-3 bg-white ${review.isUserAdded ? 'border-warning' : ''}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3 className="h5 fw-bold mb-0">{review.author}</h3>
                  <span className="badge bg-warning text-dark">
                    {renderStars(review.rating)} {review.rating}.0
                  </span>
                </div>
                <p className="small text-muted mb-2">
                  {review.date} · <em>{review.branch}</em>
                  {review.reviewCount && <span> · {review.reviewCount} отзывов</span>}
                </p>
                <blockquote className="blockquote flex-grow-1">
                  <p className="small mb-0">«{review.text}»</p>
                </blockquote>
                <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
                  <span className="badge bg-success">
                    {review.isUserAdded ? 'Отзыв гостя' : 'Отзыв подтверждён'}
                  </span>
                  {review.isUserAdded && (
                    <span className="badge bg-info text-dark">Новый</span>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* Форма добавления отзыва гостя */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <h2 className="section-title h3 fw-bold mb-3 border-bottom pb-2">Оставить отзыв о визите</h2>
        <p className="text-muted small mb-4">
          Поделитесь вашим мнением о качестве напитков и обслуживании в Global Coffee:
        </p>

        {hasError && (
          <div id="reviewError" className="alert alert-danger" role="alert">
            Пожалуйста, заполните все обязательные поля формы отзыва.
          </div>
        )}

        {showConfirmation && (
          <div id="reviewConfirmation" className="alert alert-success mb-4" role="alert">
            <h4 className="alert-heading fw-bold mb-2">Спасибо за ваш отзыв!</h4>
            <p className="mb-1">Ваш отзыв успешно опубликован в ленте мнений гостей.</p>
            <hr />
            <p className="small mb-0">Приятных визитов в Global Coffee!</p>
          </div>
        )}

        <form id="reviewForm" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="review_author" className="form-label fw-semibold">
                Ваше имя <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="review_author"
                name="review_author"
                placeholder="Например, Асель"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  setHasError(false);
                }}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="review_branch" className="form-label fw-semibold">
                Филиал визита <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="review_branch"
                name="review_branch"
                value={branchKey}
                onChange={(e) => setBranchKey(e.target.value)}
                required
              >
                <option value="">-- Выберите кофейню --</option>
                <option value="turkestan">ул. Туркестан, 4Б (Флагман)</option>
                <option value="mangilik">пр. Мангилик Ел, 38</option>
                <option value="mega">ТРЦ MEGA Silk Way</option>
                <option value="dostyk">ул. Достык, 9</option>
                <option value="other">Другой филиал в Астане</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="review_rating" className="form-label fw-semibold">
                Ваша оценка <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="review_rating"
                name="review_rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              >
                <option value="5">★ ★ ★ ★ ★ (Отлично, 5/5)</option>
                <option value="4">★ ★ ★ ★ ☆ (Хорошо, 4/5)</option>
                <option value="3">★ ★ ★ ☆ ☆ (Нормально, 3/5)</option>
                <option value="2">★ ★ ☆ ☆ ☆ (Есть замечания, 2/5)</option>
                <option value="1">★ ☆ ☆ ☆ ☆ (Плохо, 1/5)</option>
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="review_text" className="form-label fw-semibold">
                Текст отзыва <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="review_text"
                name="review_text"
                rows={3}
                placeholder="Что вам понравилось больше всего? Напитки, десерты, атмосфера или сервис?"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setHasError(false);
                }}
                required
              ></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button
              type="button"
              id="reviewResetBtn"
              className="btn btn-outline-secondary"
              onClick={handleReset}
            >
              Очистить
            </button>
            <button type="submit" id="reviewSubmitBtn" className="btn btn-primary">
              Опубликовать отзыв &rarr;
            </button>
          </div>
        </form>
      </section>

      {/* Сводка: Что отмечают гости */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <h2 className="section-title h3 fw-bold mb-3 border-bottom pb-2">Что больше всего ценят наши гости</h2>
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-light rounded-3 border text-center h-100">
              <div className="fs-2 mb-1">☕</div>
              <div className="fw-bold">Вкус и мягкость кофе</div>
              <p className="small text-muted mb-0">Свежая обжарка и натуральные сиропы</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-light rounded-3 border text-center h-100">
              <div className="fs-2 mb-1">🥐</div>
              <div className="fw-bold">Свежая выпечка</div>
              <p className="small text-muted mb-0">Круассаны, онигири и десерты</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-light rounded-3 border text-center h-100">
              <div className="fs-2 mb-1">😊</div>
              <div className="fw-bold">Вежливость бариста</div>
              <p className="small text-muted mb-0">Всегда с теплом и отличным настроением</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-light rounded-3 border text-center h-100">
              <div className="fs-2 mb-1">🎶</div>
              <div className="fw-bold">Уютная атмосфера</div>
              <p className="small text-muted mb-0">Приятный плейлист и стильный интерьер</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top text-end">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Наверх страницы &uarr;
          </button>
        </div>
      </section>
    </main>
  );
};
