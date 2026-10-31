import React, { useState, useEffect } from 'react';
import { isCoffeeShopOpenNow } from '../utils/coffee';

interface HeaderProps {
  currentPage: string;
  cartCount: number;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, cartCount, onNavigate }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    setIsOpenNow(isCoffeeShopOpenNow());
    const interval = setInterval(() => {
      setIsOpenNow(isCoffeeShopOpenNow());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeForPage = () => {
    switch (currentPage) {
      case 'booking':
      case 'details':
        return 'Бронь';
      case 'menu':
        return 'Меню';
      case 'order':
        return 'Заказ';
      case 'reviews':
        return 'Отзывы';
      case 'location':
        return 'Филиалы';
      case 'partner':
        return 'Партнерам';
      case 'aboutus':
        return 'О нас';
      case 'colophon':
        return 'Colophon';
      default:
        return 'Астана';
    }
  };

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onNavigate(page);
    setIsNavOpen(false);
  };

  return (
    <header className="site-header py-3" id="top">
      <div className="container-fluid px-3 px-lg-4">
        <nav className="navbar navbar-expand-lg navbar-dark p-0">
          <a
            className="navbar-brand fs-3 fw-bold text-white text-decoration-none d-flex align-items-center"
            href="/"
            onClick={(e) => handleLinkClick(e, 'home')}
          >
            <span>Global Coffee</span>
            <span className="badge bg-warning text-dark fs-6 align-middle ms-2 d-none d-md-inline">
              {getBadgeForPage()}
            </span>
            <span
              id="liveStatusBadge"
              className={`badge ms-2 fs-6 align-middle ${isOpenNow ? 'bg-success' : 'bg-secondary'}`}
              title="Режим работы флагмана на ул. Туркестан, 4Б: ежедневно 08:00 – 24:00"
            >
              {isOpenNow ? '● Открыто сейчас' : '○ Откроется в 08:00'}
            </span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="mainNav"
            aria-expanded={isNavOpen}
            aria-label="Переключить навигацию"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="mainNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-1">
              <li className="nav-item">
                <a
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                  aria-current={currentPage === 'home' ? 'page' : undefined}
                  href="/index.html"
                  onClick={(e) => handleLinkClick(e, 'home')}
                >
                  Главная
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentPage === 'booking' || currentPage === 'details' ? 'active' : ''}`}
                  aria-current={currentPage === 'booking' || currentPage === 'details' ? 'page' : undefined}
                  href="/booking.html"
                  onClick={(e) => handleLinkClick(e, 'booking')}
                >
                  Бронь столика
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentPage === 'reviews' ? 'active' : ''}`}
                  aria-current={currentPage === 'reviews' ? 'page' : undefined}
                  href="/reviews.html"
                  onClick={(e) => handleLinkClick(e, 'reviews')}
                >
                  Отзывы
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentPage === 'location' ? 'active' : ''}`}
                  aria-current={currentPage === 'location' ? 'page' : undefined}
                  href="/location.html"
                  onClick={(e) => handleLinkClick(e, 'location')}
                >
                  Филиалы
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentPage === 'partner' ? 'active' : ''}`}
                  aria-current={currentPage === 'partner' ? 'page' : undefined}
                  href="/partner.html"
                  onClick={(e) => handleLinkClick(e, 'partner')}
                >
                  Стать партнером
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentPage === 'aboutus' ? 'active' : ''}`}
                  aria-current={currentPage === 'aboutus' ? 'page' : undefined}
                  href="/aboutus.html"
                  onClick={(e) => handleLinkClick(e, 'aboutus')}
                >
                  О нас
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${currentPage === 'order' ? 'active' : ''}`}
                  aria-current={currentPage === 'order' ? 'page' : undefined}
                  href="/order.html"
                  onClick={(e) => handleLinkClick(e, 'order')}
                >
                  Онлайн заказ
                  {cartCount > 0 && (
                    <span id="navCartCountBadge" className="badge bg-warning text-dark ms-1 rounded-pill">
                      {cartCount}
                    </span>
                  )}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};
