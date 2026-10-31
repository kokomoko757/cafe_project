import React, { useState } from 'react';
import { FRANCHISE_STATS, FRANCHISE_PACKAGE, FRANCHISE_CONTACTS } from '../data/franchise';
import { PartnerConfirmationData } from '../types';
import { formatPhoneNumber } from '../utils/coffee';

interface PartnerPageProps {
  onNavigate: (page: string) => void;
}

export const PartnerPage: React.FC<PartnerPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');

  const [hasError, setHasError] = useState(false);
  const [confirmation, setConfirmation] = useState<PartnerConfirmationData | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (hasError) setHasError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const phoneDigits = phone.replace(/\D/g, '');

    if (!trimmedName || phoneDigits.length < 10) {
      setHasError(true);
      return;
    }

    setHasError(false);

    const appId = '#FR-2026-' + Math.floor(100 + Math.random() * 900);

    setConfirmation({
      appId,
      name: trimmedName,
      phone,
      city: city.trim() || 'Астана',
      age: age.trim() || 'Не указан'
    });

    setName('');
    setPhone('');
    setCity('');
    setAge('');

    const appSection = document.getElementById('application');
    if (appSection) {
      appSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="page-content container py-5">
      {/* Hero section */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white text-center text-md-start">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-8">
            <span className="badge bg-primary mb-2">Франшиза №1</span>
            <h1 className="section-title display-5 fw-bold mb-3">Откройте свою кофейню по франшизе</h1>
            <p className="lead text-muted mb-4">
              И зарабатывайте от <strong>$36.000 в год</strong> с проверенной бизнес-моделью, поддержкой команды и лояльной аудиторией.
            </p>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              <a
                href="#application"
                className="btn btn-primary btn-lg"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Оставить заявку на франшизу
              </a>
              <a
                href="#contacts"
                className="btn btn-outline-primary btn-lg"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Контакты менеджеров
              </a>
            </div>
          </div>
          <div className="col-12 col-lg-4 text-center">
            <div className="p-4 bg-light border rounded-3 shadow-sm">
              <div className="display-4 fw-bold text-primary mb-1">240+</div>
              <div className="fw-semibold">Действующих кофеен</div>
              <p className="small text-muted mb-0">Присоединяйтесь к сильнейшей сети в СНГ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Coffee в цифрах */}
      <section className="mb-5" id="stats">
        <h2 className="section-title h3 fw-bold mb-4 border-bottom pb-2">Global Coffee в цифрах</h2>
        <div className="row g-4 text-center">
          {FRANCHISE_STATS.map((stat, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="card h-100 shadow-sm border rounded-3 p-3 bg-white">
                <div className="display-6 fw-bold text-primary">{stat.value}</div>
                <p className="text-muted small mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* О компании */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white" id="about">
        <h2 className="section-title h3 fw-bold mb-3 border-bottom pb-2">О компании</h2>
        <p className="text-secondary">
          С 2016 года мы развиваем и расширяем сообщество Global Coffee, преодолевая трудности и извлекая уроки из опыта. Мы утвердили наши ценности и сформулировали миссию компании, делясь успехом с нашими партнерами.
        </p>
        <p className="text-secondary mb-0">
          На сегодняшний день Global Coffee — это проект республиканского масштаба с более чем 180 кофейнями в Казахстане. Наш бренд объединяет отличный вкус кофе, эффективную маркетинговую стратегию и детально продуманный дизайн.
        </p>
      </section>

      {/* Что входит в пакет франчайзи? */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white" id="package">
        <h2 className="section-title h3 fw-bold mb-4 border-bottom pb-2">Что входит в пакет франчайзи?</h2>
        <div className="row g-4">
          {FRANCHISE_PACKAGE.map((pkg, idx) => (
            <div key={idx} className={`col-12 ${idx < 3 ? 'col-md-6 col-lg-4' : 'col-md-6'}`}>
              <article className="card h-100 p-3 bg-light border rounded-3">
                <h3 className="h5 fw-bold text-primary mb-2">{pkg.title}</h3>
                <p className="small text-muted mb-0">{pkg.desc}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* Контакты франчайзинга */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white" id="contacts">
        <h2 className="section-title h3 fw-bold mb-4 border-bottom pb-2">Контакты франчайзинга</h2>
        <div className="row g-4">
          {FRANCHISE_CONTACTS.map((c, idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="p-3 bg-light border rounded-3 h-100">
                <h3 className="h6 fw-bold mb-1">{c.name}</h3>
                <p className="small text-muted mb-2">{c.role}</p>
                {c.phone && (
                  <a href={c.telLink} className="fw-bold text-decoration-none">
                    {c.phone}
                  </a>
                )}
                {c.phones && (
                  <div>
                    {c.phones.map((p, pIdx) => (
                      <a key={pIdx} href={p.link} className={`fw-bold text-decoration-none d-block ${pIdx > 0 ? 'mt-1' : ''}`}>
                        {p.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Форма заявки на партнерство */}
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white" id="application">
        <h2 className="section-title h3 fw-bold mb-3 border-bottom pb-2">Оставьте заявку</h2>
        <p className="lead text-muted mb-4">
          Заполните поля, и наш специалист свяжется с вами для предоставления финансовой модели!
        </p>

        {confirmation && (
          <div id="partnerConfirmation" className="alert alert-success p-4 mb-4 rounded-3 shadow-sm" role="alert">
            <div className="d-flex align-items-center mb-2">
              <span className="fs-4 me-2">🤝</span>
              <h2 className="h5 fw-bold mb-0 text-success">Заявка на франшизу успешно отправлена!</h2>
            </div>
            <p className="mb-2">
              Благодарим за интерес к семье Global Coffee! Номер вашей заявки: <strong>{confirmation.appId}</strong>.
            </p>
            <div id="partnerResult" className="p-3 bg-white rounded border mb-3">
              <div className="border-bottom pb-2 mb-2">
                <span className="badge bg-success mb-1">Заявка {confirmation.appId}</span>
                <h4 className="h6 fw-bold mb-1">
                  Кандидат: {confirmation.name} ({confirmation.phone})
                </h4>
                <p className="small text-muted mb-0">
                  Город для запуска: <strong>{confirmation.city}</strong> · Возраст: <strong>{confirmation.age}</strong>
                </p>
              </div>
              <h5 className="h6 fw-bold mt-3 mb-2">Следующие шаги:</h5>
              <ol className="small mb-2 ps-3">
                <li>Директор по франчайзингу свяжется с вами по номеру {confirmation.phone} в течение 24 часов.</li>
                <li>Мы предоставим презентацию и финансовую модель окупаемости кофейни в г. {confirmation.city}.</li>
              </ol>
              <div className="small text-success fw-bold">
                ✓ Статус: Успешно зарегистрировано в базе партнеров Global Coffee
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-success btn-sm"
                onClick={() => setConfirmation(null)}
              >
                Отправить еще одну заявку
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('home')}
              >
                Вернуться на главную
              </button>
            </div>
          </div>
        )}

        {hasError && (
          <div id="partnerError" className="alert alert-danger p-3 mb-4 rounded-3" role="alert">
            <div className="d-flex align-items-center">
              <span className="fs-5 me-2">⚠️</span>
              <div>
                <h3 className="h6 fw-bold mb-1">Ошибка отправки заявки!</h3>
                <p className="small mb-0">Пожалуйста, укажите ваше имя и корректный контактный телефон.</p>
              </div>
            </div>
          </div>
        )}

        <form id="partnerForm" onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="name" className="form-label fw-semibold">
                Ваше имя <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (hasError) setHasError(false);
                }}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="phone" className="form-label fw-semibold">
                Номер телефона <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
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
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="city" className="form-label fw-semibold">
                Город для открытия кофейни
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                placeholder="Астана, Алматы, Шымкент и др."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="age" className="form-label fw-semibold">
                Ваш возраст
              </label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                min="18"
                max="99"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" id="partnerSubmitBtn" className="btn btn-primary btn-lg">
              Отправить заявку &rarr;
            </button>
          </div>
        </form>
      </section>

      <section className="card shadow-sm border rounded-3 p-4 bg-light text-center">
        <p className="lead fw-bold mb-0 text-primary">
          Мы ждем вас в большую кофейную семью GLOBAL COFFEE!
        </p>
      </section>
    </main>
  );
};
