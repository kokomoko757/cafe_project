import React from 'react';

interface ColophonPageProps {
  onNavigate: (page: string) => void;
}

export const ColophonPage: React.FC<ColophonPageProps> = ({ onNavigate }) => {
  return (
    <main className="page-content container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb py-2 px-3 bg-white rounded-3 shadow-sm border">
          <li className="breadcrumb-item">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => onNavigate('home')}
            >
              Главная
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            О создании сайта (Colophon)
          </li>
        </ol>
      </nav>

      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <h1 className="section-title display-6 fw-bold mb-3 border-bottom pb-2">
          Техническая реализация проекта (Colophon)
        </h1>
        <p className="lead text-muted">
          Этот сайт разработан в рамках университетского курса по предмету «Введение в веб-технологии». В качестве темы выбрана реально существующая сеть кофеен <strong>Global Coffee</strong> в городе Астана с флагманской точкой по адресу улица Туркестан, 4Б.
        </p>

        <div className="row g-4 mt-2">
          <div className="col-12 col-md-6">
            <div className="card h-100 p-4 bg-light border rounded-3">
              <h2 className="h5 fw-bold text-primary mb-3">Семантика и архитектура разметки</h2>
              <p className="small text-muted">
                При разработке соблюдаются стандарты HTML5, компонентная React архитектура и методология адаптивной компоновки Bootstrap 5.3.3. Пример фрагмента навигации:
              </p>
              <pre className="bg-dark text-light p-3 rounded-3 small mb-3">
                <code>{`<nav className="navbar navbar-expand-lg">
  <ul className="navbar-nav">
    <li className="nav-item">
      <a className="nav-link" href="/">Главная</a>
    </li>
  </ul>
</nav>`}</code>
              </pre>
              <p className="small text-muted mb-0">
                Для быстрого сохранения кода в процессе разработки использовалась комбинация клавиш{' '}
                <kbd className="bg-secondary">Ctrl</kbd> + <kbd className="bg-secondary">S</kbd>.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card h-100 p-4 bg-light border rounded-3">
              <h2 className="h5 fw-bold text-primary mb-3">Валидация и оформление текста</h2>
              <p className="small text-muted">
                Все страницы проверены через официальный валидатор консорциума W3C:
              </p>
              <div className="alert alert-success py-2 px-3 small font-monospace mb-3">
                <samp>Document checking completed. No errors or warnings to show.</samp>
              </div>
              <p className="small text-muted">
                В тексте также применяются полужирное начертание <b>(тег b)</b> и курсив <i>(тег i)</i> для стилистического выделения, где не требуется семантического веса (strong / em).
              </p>
              <p className="small text-muted mb-0">
                Мы стремились сделать сайт <span className="badge bg-success">идеальным</span>, адаптивным и полностью соответствующим спецификациям технического задания.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onNavigate('home')}
          >
            &larr; Вернуться на главную
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Наверх &uarr;
          </button>
        </div>
      </section>
    </main>
  );
};
