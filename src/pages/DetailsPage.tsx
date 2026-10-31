import React, { useState, useEffect } from 'react';
import { TableInfo, BookingConfirmationData } from '../types';
import { formatPrice, generateReferenceCode, formatDateDisplay, formatPhoneNumber } from '../utils/coffee';

interface DetailsPageProps {
  selectedTable: TableInfo | null;
  onNavigate: (page: string) => void;
  onClearTable: () => void;
}

export const DetailsPage: React.FC<DetailsPageProps> = ({ selectedTable, onNavigate, onClearTable }) => {
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(selectedTable ? selectedTable.seats.toString() : '2');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmationData | null>(null);

  useEffect(() => {
    if (selectedTable && (!guests || guests === '0')) {
      setGuests(selectedTable.seats.toString());
    }
  }, [selectedTable]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (errors.phone) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.field;
        return next;
      });
    }
    if (hasGlobalError) {
      setHasGlobalError(false);
    }
  };

  const handleReset = () => {
    setDate(today);
    setTime('');
    setGuests(selectedTable ? selectedTable.seats.toString() : '2');
    setName('');
    setPhone('');
    setEmail('');
    setComment('');
    setErrors({});
    setHasGlobalError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      newErrors.name = 'Пожалуйста, укажите ваше имя (минимум 2 символа).';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      newErrors.phone = 'Укажите контактный номер телефона (+7 7XX XXX-XX-XX).';
    }

    if (!date || date < today) {
      newErrors.date = 'Выберите корректную дату бронирования (не ранее сегодня).';
    }

    if (!time) {
      newErrors.time = 'Пожалуйста, выберите удобное время посещения.';
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 10) {
      newErrors.guests = 'Количество гостей должно быть от 1 до 10 человек.';
    } else if (selectedTable && typeof selectedTable.seats === 'number' && guestCount > selectedTable.seats) {
      newErrors.guests = `Количество гостей (${guestCount}) превышает вместимость выбранного столика (${selectedTable.seats} мест). Пожалуйста, выберите столик большего размера или укажите до ${selectedTable.seats} гостей.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setHasGlobalError(true);
      return;
    }

    setErrors({});
    setHasGlobalError(false);

    const bookingCode = generateReferenceCode('BK');
    const depositTotal = (guestCount || 1) * 1000;
    const formattedDate = formatDateDisplay(date);
    const tableName = selectedTable ? `${selectedTable.name} (${selectedTable.zone})` : 'Стол в основном зале';

    setConfirmation({
      bookingCode,
      name: trimmedName,
      phone,
      email,
      date,
      formattedDate,
      time,
      guestCount,
      tableName,
      depositTotal,
      comment: comment.trim() || 'Без особых пожеланий'
    });

    onClearTable();
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  return (
    <main className="page-content container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border rounded-3 p-4 p-md-5 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <h1 className="section-title display-6 fw-bold mb-0">Детали бронирования</h1>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onNavigate('booking')}
              >
                &larr; Выбрать другой стол
              </button>
            </div>

            {/* Selected table banner */}
            {selectedTable && (
              <div id="selectedTableBanner" className="alert alert-info d-flex align-items-center mb-4">
                <span className="fs-3 me-3">🪑</span>
                <div>
                  <strong>
                    Выбранный столик: {selectedTable.name} ({selectedTable.seats} места, {selectedTable.zone})
                  </strong>
                  <div className="small text-muted">
                    Хотите изменить столик?{' '}
                    <button
                      type="button"
                      className="btn btn-link alert-link p-0 text-decoration-underline"
                      onClick={() => onNavigate('booking')}
                    >
                      Вернуться к схеме зала
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Alert */}
            {confirmation && (
              <div id="bookingConfirmation" className="alert alert-success p-4 mb-4 rounded-3 shadow-sm" role="alert">
                <div className="d-flex align-items-center mb-2">
                  <span className="fs-4 me-2">✅</span>
                  <h2 className="h5 fw-bold mb-0 text-success">Столик успешно забронирован!</h2>
                </div>
                <p className="mb-2">
                  Ваша бронь принята в Global Coffee (г. Астана, ул. Туркестан, 4Б). Номер брони:{' '}
                  <strong>{confirmation.bookingCode}</strong>.
                </p>

                <div id="bookingResult" className="p-3 bg-white rounded border mb-3">
                  <div className="border-bottom pb-2 mb-2">
                    <span className="badge bg-success mb-1">Бронь подтверждена</span>
                    <h4 className="h6 fw-bold mb-1">Код брони: {confirmation.bookingCode}</h4>
                    <p className="small text-muted mb-0">
                      Гость: {confirmation.name} ({confirmation.phone})
                    </p>
                  </div>

                  <div className="row g-2 mb-2 small">
                    <div className="col-6">Столик: {confirmation.tableName}</div>
                    <div className="col-6">Персон: {confirmation.guestCount} чел.</div>
                    <div className="col-6">Дата: {confirmation.formattedDate}</div>
                    <div className="col-6">Время: {confirmation.time}</div>
                  </div>

                  <div className="small border-top pt-2 mb-1">
                    Расчетный депозит: {formatPrice(confirmation.depositTotal)} (засчитывается в счет счета кофейни)
                  </div>
                  <div className="small text-muted">
                    Пожелания к столику: {confirmation.comment}
                  </div>
                  <div className="small text-success mt-2 fw-semibold">
                    ✓ Столик зарезервирован! Срок удержания столика: 15 минут от указанного времени.
                  </div>
                  <div className="alert alert-info mt-3 mb-0 p-2 small border rounded">
                    ℹ️ Демонстрационный режим: Данные не отправляются на сервер, реальная бронь не создается. Заявка смоделирована для учебного проекта.
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onNavigate('menu')}>
                    Посмотреть меню кофейни
                  </button>
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => onNavigate('booking')}>
                    Забронировать другой стол
                  </button>
                </div>
              </div>
            )}

            {/* Error banner */}
            {hasGlobalError && (
              <div id="bookingError" className="alert alert-danger p-3 mb-4 rounded-3" role="alert">
                <div className="d-flex align-items-center">
                  <span className="fs-5 me-2">⚠️</span>
                  <div>
                    <h3 className="h6 fw-bold mb-1">Ошибка оформления бронирования!</h3>
                    <p className="small mb-0">
                      Пожалуйста, проверьте заполнение всех обязательных полей (дата, время, имя, телефон).
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form id="bookingDetailsForm" onSubmit={handleSubmit}>
              {/* Fieldset 1: Дата и время посещения */}
              <fieldset className="border rounded-3 p-3 p-md-4 mb-4">
                <legend className="float-none w-auto px-2 fs-5 fw-bold text-primary">
                  1. Дата и время посещения
                </legend>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="date" className="form-label fw-semibold">
                      Дата визита <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.date ? 'is-invalid error' : ''}`}
                      id="date"
                      name="date"
                      min={today}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        handleInputChange('date', e.target.value);
                      }}
                      required
                    />
                    {errors.date && (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.date}
                      </div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="time" className="form-label fw-semibold">
                      Время <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${errors.time ? 'is-invalid error' : ''}`}
                      id="time"
                      name="time"
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                        handleInputChange('time', e.target.value);
                      }}
                      required
                    >
                      <option value="">Выберите время</option>
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                      <option value="21:00">21:00</option>
                      <option value="22:00">22:00</option>
                      <option value="23:00">23:00</option>
                    </select>
                    {errors.time && (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.time}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="guests" className="form-label fw-semibold">
                      Количество гостей <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.guests ? 'is-invalid error' : ''}`}
                      id="guests"
                      name="guests"
                      min="1"
                      max="10"
                      placeholder="От 1 до 10 человек"
                      value={guests}
                      onChange={(e) => {
                        setGuests(e.target.value);
                        handleInputChange('guests', e.target.value);
                      }}
                      required
                    />
                    {errors.guests ? (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.guests}
                      </div>
                    ) : (
                      <div className="form-text text-muted">
                        Если планируется больше 10 человек, свяжитесь с нами напрямую.
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Fieldset 2: Контактные данные */}
              <fieldset className="border rounded-3 p-3 p-md-4 mb-4">
                <legend className="float-none w-auto px-2 fs-5 fw-bold text-primary">
                  2. Контактные данные
                </legend>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Ваше имя <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid error' : ''}`}
                      id="name"
                      name="name"
                      placeholder="Введите имя"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        handleInputChange('name', e.target.value);
                      }}
                      required
                    />
                    {errors.name && (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      Телефон <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid error' : ''}`}
                      id="phone"
                      name="phone"
                      placeholder="+7 777 000 00 00"
                      value={phone}
                      onChange={handlePhoneChange}
                      onFocus={() => {
                        if (!phone.trim()) setPhone('+7 (');
                      }}
                      onBlur={() => {
                        if (phone.trim() === '+7 (' || phone.trim() === '+7') setPhone('');
                      }}
                      required
                    />
                    {errors.phone && (
                      <div className="invalid-feedback d-block text-danger small mt-1">
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Электронная почта (Email)
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="comment" className="form-label fw-semibold">
                      Комментарий к брони
                    </label>
                    <textarea
                      className="form-control"
                      id="comment"
                      name="comment"
                      rows={4}
                      placeholder="Дополнительные пожелания (детский стульчик, столик с розеткой и т.д.)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </fieldset>

              <div className="d-flex flex-wrap gap-2 justify-content-end">
                <button
                  type="button"
                  id="bookingResetBtn"
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                >
                  Очистить поля
                </button>
                <button type="submit" id="bookingSubmitBtn" className="btn btn-primary btn-lg">
                  Подтвердить бронь &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
