

'use strict';

window.GlobalCoffee = {

    formatPrice(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return '0 ₸';
        }
        const rounded = Math.round(amount);
        const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return `${formatted} ₸`;
    },

    calculateLineSubtotal(unitPrice, quantity) {
        const price = typeof unitPrice === 'number' && unitPrice > 0 ? unitPrice : 0;
        const qty = typeof quantity === 'number' && quantity > 0 ? quantity : 0;
        return price * qty;
    },

    calculateOrderTotals(items) {
        if (!Array.isArray(items) || items.length === 0) {
            return { totalQty: 0, totalPrice: 0 };
        }

        let totalQty = 0;
        let totalPrice = 0;

        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            const qty = typeof item.qty === 'number' ? item.qty : 0;
            const subtotal = window.GlobalCoffee.calculateLineSubtotal(item.price, qty);
            totalQty += qty;
            totalPrice += subtotal;
        }

        return { totalQty, totalPrice };
    },

    generateReferenceCode(prefix) {
        const cleanPrefix = typeof prefix === 'string' && prefix.trim().length > 0 ? prefix.trim() : 'GC';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `#${cleanPrefix}-2026-${randomNum}`;
    },

    formatDateDisplay(isoDate) {
        if (typeof isoDate !== 'string' || !isoDate.includes('-')) {
            return '';
        }
        const parts = isoDate.split('-');
        if (parts.length === 3) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return isoDate;
    },

    sanitizeText(str) {
        if (typeof str !== 'string') {
            return '';
        }
        return str.trim();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initBusinessHoursBadge();
    initPhoneMasks();
    initMobileNavAutoClose();
    updateNavCartBadge();
    initDailySpecialRecommendation();
});

function initBusinessHoursBadge() {
    const currentHour = new Date().getHours();
    const isOpen = currentHour >= 8 && currentHour < 24;

    const headerBrand = document.querySelector('.navbar-brand');
    if (headerBrand && !document.getElementById('liveStatusBadge')) {
        const badge = document.createElement('span');
        badge.id = 'liveStatusBadge';
        badge.className = `badge ms-2 fs-6 align-middle ${isOpen ? 'bg-success' : 'bg-secondary'}`;
        badge.textContent = isOpen ? '● Открыто сейчас' : '○ Откроется в 08:00';
        badge.title = 'Режим работы флагмана на ул. Туркестан, 4Б: ежедневно 08:00 – 24:00';
        headerBrand.appendChild(badge);
    }
}

function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name*="phone"], #customer_phone, #phone');

    phoneInputs.forEach(input => {
        input.addEventListener('input', () => {
            let val = input.value.replace(/\D/g, '');

            if (val.startsWith('8') || val.startsWith('7')) {
                val = val.substring(1);
            }

            let formatted = '+7';
            if (val.length > 0) {
                formatted += ' (' + val.substring(0, 3);
            }
            if (val.length >= 4) {
                formatted += ') ' + val.substring(3, 6);
            }
            if (val.length >= 7) {
                formatted += '-' + val.substring(6, 8);
            }
            if (val.length >= 9) {
                formatted += '-' + val.substring(8, 10);
            }

            input.value = formatted;
        });

        input.addEventListener('focus', () => {
            if (input.value.trim() === '') {
                input.value = '+7 (';
            }
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() === '+7 (' || input.value.trim() === '+7') {
                input.value = '';
            }
        });
    });
}

function initMobileNavAutoClose() {
    const navCollapse = document.getElementById('mainNav');
    if (!navCollapse) {
        return;
    }

    const navLinks = navCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}

function updateNavCartBadge() {
    const orderNavLink = document.querySelector('a.nav-link[href="order.html"]');
    if (!orderNavLink) {
        return;
    }

    let totalItems = 0;
    try {
        const savedCart = localStorage.getItem('global_coffee_cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            const values = Object.values(cartData);
            for (let i = 0; i < values.length; i += 1) {
                const item = values[i];
                const qty = typeof item.qty === 'number' ? item.qty : parseInt(item.qty, 10);
                if (!isNaN(qty) && qty > 0) {
                    totalItems += qty;
                }
            }
        }
    } catch (e) {
        console.warn('Ошибка чтения корзины из localStorage:', e);
    }

    let badge = document.getElementById('navCartCountBadge');
    if (totalItems > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.id = 'navCartCountBadge';
            badge.className = 'badge bg-warning text-dark ms-1 rounded-pill';
            orderNavLink.appendChild(badge);
        }
        badge.textContent = totalItems.toString();
        badge.classList.remove('hidden');
    } else if (badge) {
        badge.classList.add('hidden');
    }
}

function initDailySpecialRecommendation() {
    const featuredDrinks = [
        { name: 'Ореховый Флэт Уайт', note: 'Двойной эспрессо и натуральная паста из лесного фундука' },
        { name: 'Айс Матча Клубника', note: 'Освежающая японская матча с пюре из спелых ягод' },
        { name: 'Фраппе Сливочный-Какао', note: 'Ледяной десертный напиток со взбитыми сливками' },
        { name: 'Бамбл Кофе Свежевыжатый', note: 'Слоистый микс эспрессо и апельсинового фреша со льдом' },
        { name: 'Лимонад Сакура', note: 'Искрящийся цветочный тоник с японской вишней и мятой' }
    ];

    let recommendationContainer = document.getElementById('baristaRecommendationContainer');
    if (!recommendationContainer) {
        const welcomeCol = document.querySelector('main.page-content section:first-of-type .col-lg-8');
        if (welcomeCol && document.title.includes('Global Coffee') && window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
            recommendationContainer = welcomeCol;
        }
    }
    if (recommendationContainer && featuredDrinks.length > 0) {
        const randomIndex = Math.floor(Math.random() * featuredDrinks.length);
        const drink = featuredDrinks[randomIndex];

        const card = document.createElement('div');
        card.className = 'alert alert-light border shadow-sm p-3 rounded-3 mt-3 d-flex align-items-center gap-3';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'fs-3';
        iconSpan.textContent = '⭐';

        const textDiv = document.createElement('div');

        const titleEl = document.createElement('strong');
        titleEl.className = 'd-block text-primary';
        titleEl.textContent = `Рекомендация бариста сегодня: ${drink.name}`;

        const descEl = document.createElement('span');
        descEl.className = 'small text-muted';
        descEl.textContent = drink.note;

        textDiv.appendChild(titleEl);
        textDiv.appendChild(descEl);

        card.appendChild(iconSpan);
        card.appendChild(textDiv);

        recommendationContainer.appendChild(card);
    }
}

window.updateNavCartBadge = updateNavCartBadge;
