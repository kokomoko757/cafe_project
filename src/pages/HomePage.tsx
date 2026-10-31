import React, { useState } from 'react';
import { DailySpecialBanner } from '../components/DailySpecialBanner';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page-content container py-5">
      {/* Вводная приветственная секция */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-8 text-center text-md-start">
            <span className="badge bg-secondary mb-2">Кофейня третьей волны</span>
            <h1 className="section-title display-5 fw-bold mb-3">Добро пожаловать в мир настоящего кофе</h1>
            <p className="lead text-muted mb-4">
              Global Coffee на улице Туркестан, 4Б — это пространство тепла, вдохновения и свежеобжаренных кофейных зерен со всего мира.
            </p>

            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('menu')}
              >
                Посмотреть меню
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-lg"
                onClick={() => onNavigate('booking')}
              >
                Забронировать стол
              </button>
              <button
                type="button"
                className="btn btn-outline-dark btn-sm align-self-center"
                onClick={() => onNavigate('order')}
              >
                Быстрый заказ
              </button>
              <button type="button" className="btn btn-secondary btn-sm align-self-center" disabled>
                Сезонная скидка (Завершено)
              </button>
            </div>

            <DailySpecialBanner />
          </div>

          <div className="col-12 col-lg-4 text-center">
            <img
              src="/images/coffee-shop.jpg"
              alt="Фасад кофейни Global Coffee в Астане"
              className="img-fluid rounded-3 shadow"
            />
          </div>
        </div>

        {/* Nested row */}
        <div className="row mt-4 pt-4 border-top">
          <div className="col-12">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 bg-light border">
                  <h3 className="h6 fw-bold mb-1 text-primary">Свежая обжарка 100% Арабики</h3>
                  <p className="small text-muted mb-0">
                    Зерна прямого импорта из Эфиопии, Бразилии и Колумбии с контролем экстракции.
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 bg-light border">
                  <h3 className="h6 fw-bold mb-1 text-primary">Комфортная атмосфера</h3>
                  <p className="small text-muted mb-0">
                    Быстрый Wi-Fi, розетки у каждого столика и дружелюбные профессиональные бариста.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Адаптивный блок 1 (3 колонки: col-12 col-md-6 col-lg-4) */}
      <section className="mb-5">
        <h2 className="section-title h3 fw-bold mb-4 border-bottom pb-2">Преимущества Global Coffee</h2>
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border rounded-3 p-4">
              <div className="d-flex align-items-center mb-3">
                <span className="badge rounded-pill bg-primary p-2 me-2">☕</span>
                <h3 className="h5 fw-bold mb-0">Авторские напитки</h3>
              </div>
              <p className="text-muted small mb-0">
                От нежного рафа с корицей до освежающего бамбла на натуральном фреше.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border rounded-3 p-4">
              <div className="d-flex align-items-center mb-3">
                <span className="badge rounded-pill bg-success p-2 me-2">⏰</span>
                <h3 className="h5 fw-bold mb-0">Удобный график</h3>
              </div>
              <p className="text-muted small mb-0">
                Открыты ежедневно с 08:00 до 24:00 без выходных и перерывов.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border rounded-3 p-4">
              <div className="d-flex align-items-center mb-3">
                <span className="badge rounded-pill bg-warning text-dark p-2 me-2">📍</span>
                <h3 className="h5 fw-bold mb-0">Центр столицы</h3>
              </div>
              <p className="text-muted small mb-0">
                Удобная локация на улице Туркестан, 4Б с парковочными местами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Секция: График работы и загруженность (Таблица) */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white" id="details">
        <h2 className="section-title h3 fw-bold mb-3 border-bottom pb-2">График работы и загруженность</h2>
        <p className="text-muted small">
          Ознакомьтесь с посещаемостью кофейни, чтобы спланировать визит или рабочую встречу.
        </p>

        <div className="table-responsive my-3">
          <table className="table table-hover table-bordered align-middle">
            <caption className="text-muted small pt-2">Анализ посещаемости кофейни по времени суток</caption>
            <thead className="table-light">
              <tr>
                <th scope="col" className="fw-bold">Время дня</th>
                <th scope="col" className="fw-bold">Часы работы</th>
                <th scope="col" className="fw-bold">Среднее количество гостей</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="fw-semibold">Утренние часы (Пик)</th>
                <td>08:00 - 11:00</td>
                <td><span className="badge bg-danger">Высокая загруженность</span></td>
              </tr>
              <tr>
                <th scope="row" className="fw-semibold">Дневное затишье</th>
                <td>12:00 - 18:00</td>
                <td><span className="badge bg-success">Свободные столики</span></td>
              </tr>
              <tr>
                <th scope="row" className="fw-semibold">Вечерний отдых</th>
                <td>19:00 - 24:00</td>
                <td><span className="badge bg-warning text-dark">Средняя загруженность</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bootstrap Accordion: FAQ & Drink Guide */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <h2 className="section-title h3 fw-bold mb-3 border-bottom pb-2">Гид по напиткам и профессии</h2>
        <p className="text-muted small mb-4">
          Нажмите на любой пункт аккордеона, чтобы узнать подробности о меню и стандартах сервиса.
        </p>

        <div className="accordion" id="coffeeAccordion">
          <div className="accordion-item">
            <h3 className="accordion-header">
              <button
                className={`accordion-button ${openAccordionIndex === 0 ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggleAccordion(0)}
                aria-expanded={openAccordionIndex === 0}
              >
                Что мы предлагаем гостям: Классические напитки
              </button>
            </h3>
            {openAccordionIndex === 0 && (
              <div className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <ul className="mb-0">
                    <li>
                      <strong>Эспрессо и Американо</strong> — чистый вкус кофейного зерна с яркой кислинкой и плотной крема.
                    </li>
                    <li>
                      <strong>Молочная классика</strong> — шелковистый капучино, воздушный латте и нежный флэт уайт на отборном молоке.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="accordion-item">
            <h3 className="accordion-header">
              <button
                className={`accordion-button ${openAccordionIndex === 1 ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggleAccordion(1)}
                aria-expanded={openAccordionIndex === 1}
              >
                Фирменные и холодные напитки
              </button>
            </h3>
            {openAccordionIndex === 1 && (
              <div className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <p className="mb-0">
                    Айс Матча со свежей клубникой, авторские фруктовые смузи, натуральные лимонады и бодрящий холодный бамбл на апельсиновом соке.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="accordion-item">
            <h3 className="accordion-header">
              <button
                className={`accordion-button ${openAccordionIndex === 2 ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggleAccordion(2)}
                aria-expanded={openAccordionIndex === 2}
              >
                Стандарты сервиса и бариста
              </button>
            </h3>
            {openAccordionIndex === 2 && (
              <div className="accordion-collapse collapse show">
                <div className="accordion-body">
                  <p className="mb-0">
                    Каждый наш специалист проходит обучение в Академии Бариста Global Coffee, строго следуя таймингу экстракции, температуре молока (не выше 65°C) и стандартам дружелюбного гостеприимства.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Блок с цитатой и контактами */}
      <section className="card shadow-sm border rounded-3 p-4 mb-5 bg-light">
        <blockquote className="blockquote text-center mb-3">
          <p className="fst-italic mb-2">
            «В Global Coffee мы варим не просто кофе, а создаем настроение для каждого гостя. Наша команда ежедневно стремится превзойти ваши ожидания.»
          </p>
          <footer className="blockquote-footer">
            Шеф-бариста Амина Каримова, <cite title="Дата отзыва">12 октября 2023</cite>
          </footer>
        </blockquote>
        <p className="mb-0 text-center text-md-start small text-muted">
          Свяжитесь с нами: позвоните по номеру{' '}
          <a href="tel:+77762000612" className="fw-bold text-decoration-none">
            +7‒776‒200‒06‒12
          </a>
          .
        </p>
        <div className="mt-3 text-end">
          <button type="button" onClick={scrollToTop} className="btn btn-outline-secondary btn-sm">
            Наверх страницы &uarr;
          </button>
        </div>
      </section>
    </main>
  );
};
