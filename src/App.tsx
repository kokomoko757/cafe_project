import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { DetailsPage } from './pages/DetailsPage';
import { MenuPage } from './pages/MenuPage';
import { OrderPage } from './pages/OrderPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { LocationPage } from './pages/LocationPage';
import { PartnerPage } from './pages/PartnerPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ColophonPage } from './pages/ColophonPage';
import { CartItem, TableInfo, ReviewItem } from './types';
import { INITIAL_REVIEWS } from './data/reviews';

function getPageFromUrl(): string {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('booking')) return 'booking';
  if (path.includes('details')) return 'details';
  if (path.includes('menu')) return 'menu';
  if (path.includes('order')) return 'order';
  if (path.includes('reviews')) return 'reviews';
  if (path.includes('location')) return 'location';
  if (path.includes('partner')) return 'partner';
  if (path.includes('aboutus')) return 'aboutus';
  if (path.includes('colophon')) return 'colophon';
  return 'home';
}

function getUrlForPage(page: string): string {
  switch (page) {
    case 'booking': return '/booking.html';
    case 'details': return '/details.html';
    case 'menu': return '/menu.html';
    case 'order': return '/order.html';
    case 'reviews': return '/reviews.html';
    case 'location': return '/location.html';
    case 'partner': return '/partner.html';
    case 'aboutus': return '/aboutus.html';
    case 'colophon': return '/colophon.html';
    default: return '/index.html';
  }
}

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>(getPageFromUrl);

  // Cart state persisted with localStorage
  const [cart, setCart] = useState<Record<string, CartItem>>(() => {
    try {
      const saved = localStorage.getItem('global_coffee_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading cart from localStorage:', e);
    }
    return {};
  });

  // Selected table state persisted with localStorage
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(() => {
    try {
      const saved = localStorage.getItem('global_coffee_selected_table');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading selected table from localStorage:', e);
    }
    return null;
  });

  // Reviews state persisted with localStorage
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('global_coffee_user_reviews');
      if (saved) {
        const userRevs: ReviewItem[] = JSON.parse(saved);
        return [...userRevs, ...INITIAL_REVIEWS];
      }
    } catch (e) {
      console.warn('Error reading user reviews from localStorage:', e);
    }
    return INITIAL_REVIEWS;
  });

  // Handle browser popstate (back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    const targetUrl = getUrlForPage(page);
    window.history.pushState({}, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCart = (newCart: Record<string, CartItem>) => {
    setCart(newCart);
    try {
      if (Object.keys(newCart).length === 0) {
        localStorage.removeItem('global_coffee_cart');
      } else {
        localStorage.setItem('global_coffee_cart', JSON.stringify(newCart));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleSelectTable = (table: TableInfo) => {
    setSelectedTable(table);
    try {
      localStorage.setItem('global_coffee_selected_table', JSON.stringify(table));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleClearTable = () => {
    setSelectedTable(null);
    try {
      localStorage.removeItem('global_coffee_selected_table');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleAddReview = (newReview: ReviewItem) => {
    setReviews(prev => [newReview, ...prev]);
    try {
      const saved = localStorage.getItem('global_coffee_user_reviews');
      const existing = saved ? JSON.parse(saved) : [];
      existing.unshift(newReview);
      localStorage.setItem('global_coffee_user_reviews', JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage save review error:', e);
    }
  };

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + (item.qty || 1), 0);
  }, [cart]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header
        currentPage={currentPage}
        cartCount={cartCount}
        onNavigate={navigateTo}
      />

      <div className="flex-grow-1">
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentPage === 'booking' && (
          <BookingPage onSelectTable={handleSelectTable} onNavigate={navigateTo} />
        )}
        {currentPage === 'details' && (
          <DetailsPage
            selectedTable={selectedTable}
            onNavigate={navigateTo}
            onClearTable={handleClearTable}
          />
        )}
        {currentPage === 'menu' && <MenuPage onNavigate={navigateTo} />}
        {currentPage === 'order' && (
          <OrderPage
            cart={cart}
            onUpdateCart={handleUpdateCart}
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'reviews' && (
          <ReviewsPage
            reviews={reviews}
            onAddReview={handleAddReview}
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'location' && <LocationPage onNavigate={navigateTo} />}
        {currentPage === 'partner' && <PartnerPage onNavigate={navigateTo} />}
        {currentPage === 'aboutus' && <AboutUsPage onNavigate={navigateTo} />}
        {currentPage === 'colophon' && <ColophonPage onNavigate={navigateTo} />}
      </div>

      <Footer onNavigate={navigateTo} />
    </div>
  );
};
