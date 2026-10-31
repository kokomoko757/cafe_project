import React from 'react';
import { TABLES_CATALOG } from '../data/tables';
import { TableInfo } from '../types';

interface BookingPageProps {
  onSelectTable: (table: TableInfo) => void;
  onNavigate: (page: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onSelectTable, onNavigate }) => {
  const handleSelectTable = (table: TableInfo) => {
    if (table.isAvailable === false) return;
    onSelectTable(table);
    onNavigate('details');
  };

  const handleQuickSelect = () => {
    const defaultTable = TABLES_CATALOG[0];
    onSelectTable(defaultTable);
    onNavigate('details');
  };

  const getTable = (id: number) => {
    return TABLES_CATALOG.find(t => t.id === id) || {
      id,
      name: `Стол ${id}`,
      seats: 2,
      zone: 'Основной зал',
      depositPerGuest: 1000,
      isAvailable: id !== 5
    };
  };

  return (
    <main className="page-content container py-5">
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <div className="text-center text-md-start mb-4">
          <h1 className="section-title display-6 fw-bold mb-2">Забронировать столик</h1>
          <p className="lead text-muted mb-0">
            Выберите подходящий столик, чтобы перейти к выбору даты и времени бронирования.
          </p>
        </div>

        {/* Alert with booking rules */}
        <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
          <span className="fs-4 me-3">ℹ️</span>
          <div>
            <strong>Правила бронирования:</strong> Бронь сохраняется в течение 15 минут от выбранного времени. Если вы задерживаетесь, пожалуйста, предупредите бариста по телефону.
          </div>
        </div>

        <fieldset className="border rounded-3 p-3 p-md-4 mb-4">
          <legend className="float-none w-auto px-2 fs-5 fw-bold text-primary">
            Схема зала и выбор столика
          </legend>
          <p className="text-muted small mb-4">
            Нажмите на доступный стол для перехода к оформлению бронирования:
          </p>

          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="py-3">Зона у окна (Тихая)</th>
                  <th scope="col" className="py-3">Центральный зал</th>
                  <th scope="col" className="py-3">Lounge-зона у бара</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-1"
                      className="btn btn-outline-primary d-block w-100 py-3"
                      onClick={() => handleSelectTable(getTable(1))}
                    >
                      <span className="fw-bold d-block fs-5">Стол 1</span>
                      <span className="badge bg-secondary">2 места</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-2"
                      className="btn btn-outline-primary d-block w-100 py-3"
                      onClick={() => handleSelectTable(getTable(2))}
                    >
                      <span className="fw-bold d-block fs-5">Стол 2</span>
                      <span className="badge bg-secondary">2 места</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-3"
                      className="btn btn-outline-primary d-block w-100 py-3"
                      onClick={() => handleSelectTable(getTable(3))}
                    >
                      <span className="fw-bold d-block fs-5">Стол 3</span>
                      <span className="badge bg-secondary">4 места</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-4"
                      className="btn btn-outline-primary d-block w-100 py-3"
                      onClick={() => handleSelectTable(getTable(4))}
                    >
                      <span className="fw-bold d-block fs-5">Стол 4</span>
                      <span className="badge bg-secondary">4 места</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-5"
                      className="btn btn-secondary disabled d-block w-100 py-3"
                      aria-disabled="true"
                      disabled
                    >
                      <span className="fw-bold d-block fs-5">Стол 5</span>
                      <span className="badge bg-danger">Занят (6 мест)</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-6"
                      className="btn btn-outline-primary d-block w-100 py-3"
                      onClick={() => handleSelectTable(getTable(6))}
                    >
                      <span className="fw-bold d-block fs-5">Стол 6</span>
                      <span className="badge bg-secondary">4 места</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-7"
                      className="btn btn-outline-primary d-block w-100 py-3"
                      onClick={() => handleSelectTable(getTable(7))}
                    >
                      <span className="fw-bold d-block fs-5">Стол 7</span>
                      <span className="badge bg-secondary">2 места</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-8"
                      className="btn btn-outline-primary d-block w-100 py-3"
                      onClick={() => handleSelectTable(getTable(8))}
                    >
                      <span className="fw-bold d-block fs-5">Стол 8</span>
                      <span className="badge bg-secondary">4 места</span>
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      id="table-btn-9"
                      className="btn btn-outline-primary d-block w-100 py-3"
                      onClick={() => handleSelectTable(getTable(9))}
                    >
                      <span className="fw-bold d-block fs-5">Стол 9</span>
                      <span className="badge bg-secondary">6 мест</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </fieldset>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4 pt-3 border-top">
          <p className="text-muted small mb-0">
            Нужен индивидуальный зал для мероприятий? Позвоните администратору:{' '}
            <a href="tel:+77762000612" className="fw-semibold text-decoration-none">
              +7‒776‒200‒06‒12
            </a>
          </p>
          <button
            type="button"
            id="quickSelectBtn"
            className="btn btn-primary btn-lg"
            onClick={handleQuickSelect}
          >
            Быстрый выбор любого стола &rarr;
          </button>
        </div>
      </section>
    </main>
  );
};
