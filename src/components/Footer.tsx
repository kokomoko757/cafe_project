import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1">Адрес: г. Астана, ул. Туркестан, 4Б. Ежедневно с 08:00 до 24:00.</p>
        <div className="mb-2">
          <a
            href="/menu.html"
            className="text-white-50 text-decoration-none small me-3"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('menu');
            }}
          >
            Полное меню
          </a>
          <a
            href="/colophon.html"
            className="text-white-50 text-decoration-none small"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('colophon');
            }}
          >
            О создании сайта (Colophon)
          </a>
        </div>
        <p className="small text-white-50 mb-0">
          &copy; 2026 Global Coffee. Все права защищены &amp; Мы любим кофе &hearts; &trade;
        </p>
      </div>
    </footer>
  );
};
