/**
 * GLOBAL COFFEE — Основной общий скрипт (js/main.js)
 * Реализует:
 * 1. Индикатор времени работы («Открыто сейчас» / «Откроется в 08:00»)
 * 2. Интерактивную маску ввода телефонного номера (+7 (7XX) XXX-XX-XX)
 * 3. Автоматическое сворачивание мобильного меню при клике на ссылку
 * 4. Обновление бейджа корзины в навигации из localStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    initBusinessHoursBadge();
    initPhoneMasks();
    initMobileNavAutoClose();
    updateNavCartBadge();
});

/**
 * 1. Проверка текущего времени работы кофейни (Ежедневно с 08:00 до 24:00)
 */
function initBusinessHoursBadge() {
    const currentHour = new Date().getHours();
    const isOpen = currentHour >= 8 && currentHour < 24;

    // Ищем статус-плашки или шапку
    const headerBrand = document.querySelector('.navbar-brand');
    if (headerBrand && !document.getElementById('liveStatusBadge')) {
        const badge = document.createElement('span');
        badge.id = 'liveStatusBadge';
        badge.className = `badge ms-2 fs-6 align-middle ${isOpen ? 'bg-success' : 'bg-secondary'}`;
        badge.textContent = isOpen ? '● Открыто сейчас' : '○ Откроется в 08:00';
        badge.title = 'Режим работы флагмана: 08:00 – 24:00';
        headerBrand.appendChild(badge);
    }
}

/**
 * 2. Маска ввода для телефонных номеров формата Казахстана +7 (7XX) XXX-XX-XX
 */
function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name*="phone"], #customer_phone, #guest_phone, #phone');

    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let val = input.value.replace(/\D/g, ''); // Только цифры

            // Если первая цифра 8 или 7, заменяем на префикс 7
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

        // При фокусе на пустое поле сразу предлагаем префикс +7 (
        input.addEventListener('focus', () => {
            if (!input.value) {
                input.value = '+7 (';
            }
        });

        input.addEventListener('blur', () => {
            if (input.value === '+7 (' || input.value === '+7') {
                input.value = '';
            }
        });
    });
}

/**
 * 3. Автоматическое закрытие мобильного меню при клике на навигационную ссылку
 */
function initMobileNavAutoClose() {
    const navCollapse = document.getElementById('mainNav');
    if (!navCollapse) return;

    const navLinks = navCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Если меню открыто в мобильном режиме
            if (navCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}

/**
 * 4. Обновление бейджа с количеством позиций в корзине в шапке навигации
 */
function updateNavCartBadge() {
    const orderNavLink = document.querySelector('a.nav-link[href="order.html"]');
    if (!orderNavLink) return;

    let totalItems = 0;
    try {
        const savedCart = localStorage.getItem('global_coffee_cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            totalItems = Object.values(cartData).reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
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
        badge.textContent = totalItems;
        badge.style.display = 'inline-block';
    } else if (badge) {
        badge.style.display = 'none';
    }
}

// Экспорт для возможности вызова из других файлов
window.updateNavCartBadge = updateNavCartBadge;
