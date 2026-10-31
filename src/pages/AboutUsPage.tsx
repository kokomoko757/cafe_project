import React from 'react';

interface AboutUsPageProps {
  onNavigate: (page: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  return (
    <main className="page-content container py-5">
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-7 text-center text-md-start">
            <span className="badge bg-secondary mb-2">История и ценности</span>
            <h1 className="section-title display-5 fw-bold mb-3">
              Добро пожаловать в мир настоящего кофе
            </h1>
            <article>
              <h2 className="h4 fw-bold text-primary mb-3">Наша философия</h2>
              <p className="lead text-muted">
                Мы открыли двери <strong>Global Coffee</strong> в самом сердце столицы, на улице Туркестан, 4Б, чтобы предложить жителям города идеальное место для встреч, работы и душевного отдыха.
              </p>
              <p className="text-secondary">
                Наш шеф-бариста всегда говорит:{' '}
                <q className="fst-italic fw-semibold text-dark">
                  «Кофе объединяет людей лучше любых слов»
                </q>
                . Мы <em>действительно</em> верим, что каждая чашка способна сделать день немного ярче и теплее. Мы работаем ежедневно с 08:00 до 24:00, чтобы вы могли насладиться любимым напитком в любое время.
              </p>
            </article>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start mt-4">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('menu')}
              >
                Ознакомиться с меню
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-lg"
                onClick={() => onNavigate('booking')}
              >
                Забронировать столик
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-5 text-center">
            <figure className="figure mb-0">
              <img
                src="/images/coffee-shop.jpg"
                alt="Фасад кофейни Global Coffee на улице Туркестан"
                className="figure-img img-fluid rounded-3 shadow"
              />
              <figcaption className="figure-caption text-muted mt-2 fw-semibold">
                Вход в Global Coffee в Астане
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Nested row */}
        <div className="row mt-4 pt-4 border-top">
          <div className="col-12">
            <aside className="p-4 bg-light rounded-3 border">
              <h2 className="h5 fw-bold text-primary mb-3">Интересный факт о нас</h2>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <p className="small text-muted mb-2">
                    Наша кофейня использует только свежеобжаренные зерна. Слово{' '}
                    <abbr title="Эспрессо" className="text-decoration-none border-bottom">
                      Эспрессо
                    </abbr>{' '}
                    переводится как «выдавленный», а сама{' '}
                    <abbr title="Республика Казахстан" className="text-decoration-none border-bottom">
                      РК
                    </abbr>{' '}
                    с каждым годом пьет всё больше качественного specialty-кофе!
                  </p>
                </div>
                <div className="col-12 col-md-6">
                  <p className="small text-muted mb-2">
                    Температура идеальной экстракции — около <strong>92<sup>&deg;</sup>C</strong>, а для заваривания мы используем чистейшую фильтрованную воду (<strong>H<sub>2</sub>O</strong>).
                  </p>
                  <p className="small text-muted mb-0">
                    <span className="badge bg-warning text-dark">
                      Не забудьте попробовать наши фирменные напитки!
                    </span>{' '}
                    <small className="text-muted d-block mt-1">
                      Цены в меню могут незначительно меняться.
                    </small>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="small text-muted mb-0">
            Узнать больше о культуре кофе можно в{' '}
            <a
              href="https://ru.wikipedia.org/wiki/Кофе"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none fw-semibold"
            >
              статье на Википедии &rarr;
            </a>
          </p>
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
