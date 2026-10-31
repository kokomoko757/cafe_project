import React, { useState, useMemo } from 'react';
import { ALL_BRANCHES, FLAGSHIP_LOCATIONS } from '../data/locations';

interface LocationPageProps {
  onNavigate: (page: string) => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlagships = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FLAGSHIP_LOCATIONS;
    return FLAGSHIP_LOCATIONS.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredBranches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_BRANCHES;
    return ALL_BRANCHES.filter(b =>
      b.address.toLowerCase().includes(q) ||
      b.note.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalFound = filteredFlagships.length + filteredBranches.length;

  return (
    <main className="page-content container py-5">
      {/* Вводная секция с уведомлением 2ГИС */}
      <div className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <h1 className="section-title display-6 fw-bold mb-3 border-bottom pb-2">
          Сеть кофеен Global Coffee в Астане
        </h1>
        <p className="lead text-muted mb-4">
          Более 28 филиалов в столице Казахстана. Найдите ближайшую к вам точку и загляните на чашку ароматного кофе.
        </p>

        <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
          <span className="fs-4 me-3">⚠️</span>
          <div>
            <strong>Важная информация:</strong> Перед визитом рекомендуем уточнить режим работы на странице 2ГИС: он может меняться. Точка по адресу <em>проспект Кабанбай батыра, 119</em> отмечена как{' '}
            <span className="badge bg-danger">временно не работающая</span>.
          </div>
        </div>

        {/* Поиск филиала */}
        <div className="p-3 bg-light rounded-3 border">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-8">
              <label htmlFor="branchSearchInput" className="form-label fw-semibold mb-1">
                Найти филиал по адресу или ориентиру:
              </label>
              <input
                type="search"
                id="branchSearchInput"
                className="form-control"
                placeholder="Например: Туркестан, Мангилик, Silk Way, Достык..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 d-flex align-items-end">
              <button
                type="button"
                id="branchSearchBtn"
                className="btn btn-primary w-100"
                onClick={() => {}}
              >
                Найти кофейню
              </button>
            </div>
          </div>

          {/* Результаты поиска */}
          <div id="branchSearchResults" className="text-muted small mt-2">
            {searchQuery.trim() !== '' && (
              totalFound > 0 ? (
                <div>
                  <span className="badge bg-success me-2">Найдено: {totalFound}</span>
                  локаций по запросу «{searchQuery.trim()}»
                </div>
              ) : (
                <div>
                  <span className="badge bg-warning text-dark me-2">Ничего не найдено</span>
                  по запросу «{searchQuery.trim()}». Попробуйте ввести другую улицу.
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Флагманские локации */}
      <section className="mb-5">
        <h2 className="section-title h3 fw-bold mb-4 border-bottom pb-2">Флагманские локации</h2>
        <div className="row g-4">
          {filteredFlagships.map((f, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border rounded-3 p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3 className="h5 fw-bold mb-0">{f.name}</h3>
                  <span className="badge bg-success">{f.rating}</span>
                </div>
                <p className="text-muted small mb-3">{f.address}</p>
                <p className="small text-secondary mb-3">{f.hours}. {f.description}</p>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-auto"
                  onClick={() => onNavigate(f.actionRoute)}
                >
                  {f.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Таблица всех филиалов */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white" id="branches">
        <h2 className="section-title h3 fw-bold mb-3 border-bottom pb-2">Полный список филиалов</h2>
        <p className="text-muted small mb-4">Данные и оценки синхронизированы по отзывам платформы 2ГИС.</p>

        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered align-middle">
            <caption className="text-muted small pt-2">Филиалы Global Coffee в Астане (28 точек)</caption>
            <thead className="table-dark">
              <tr>
                <th scope="col" className="text-center" style={{ width: '60px' }}>№</th>
                <th scope="col">Адрес</th>
                <th scope="col" className="text-center" style={{ width: '120px' }}>Рейтинг 2ГИС</th>
                <th scope="col" style={{ width: '220px' }}>Примечание</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map(branch => (
                <tr key={branch.id}>
                  <th scope="row" className="text-center">{branch.id}</th>
                  <td>{branch.address}</td>
                  <td className="text-center">
                    <span className={`badge ${parseFloat(branch.rating.replace(',', '.')) >= 4.5 ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {branch.rating}
                    </span>
                  </td>
                  <td>
                    {branch.isFlagship && <span className="badge bg-primary">Флагман</span>}
                    {branch.isTemporarilyClosed && <span className="badge bg-danger">Временно не работает</span>}
                    {!branch.isFlagship && !branch.isTemporarilyClosed && branch.note !== '—' && (
                      <span className="text-muted small">{branch.note}</span>
                    )}
                    {branch.note === '—' && '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Советы гостям */}
      <section className="card shadow-sm border rounded-3 p-4 mb-5 bg-white">
        <h2 className="section-title h4 fw-bold mb-3 border-bottom pb-2">Как выбрать удобную кофейню</h2>
        <ol className="mb-4">
          <li>Выберите ближайший к вам адрес из таблицы выше.</li>
          <li>Проверьте актуальный график работы филиала в приложении 2ГИС.</li>
          <li>Приходите за любимым напитком или оформите онлайн-заказ заранее.</li>
        </ol>
        <div className="text-end">
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
