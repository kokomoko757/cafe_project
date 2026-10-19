/**
 * GLOBAL COFFEE — Логика бронирования столиков (js/booking.js)
 * WEB Technologies 1 (Front End) — Assignment 4-5
 * Ответственный студент: Bolatuly Assylzhan (SE-2533)
 * 
 * Реализует:
 * 1. Строгий режим ('use strict') и единые стандарты ES6+ (const/let, ===, !==, 0 var).
 * 2. Массив объектов столиков зала (8 столов с 4+ свойствами: id, name, seats, zone, minDeposit).
 * 3. Логику на booking.html: интерактивный выбор столика на схеме 3x3, сохранение в localStorage.
 * 4. Логику на details.html:
 *    - Автоподстановка выбранного столика и показ баннера (#selectedTableBanner);
 *    - Полная поэлементная валидация (field-level validation):
 *      * Имя гостя (текст >= 2 символов);
 *      * Телефон (+7 (7XX)...);
 *      * Дата (запрет прошедших дат);
 *      * Время (обязательный выбор);
 *      * Комбинированное правило: сравнение количества гостей с вместимостью столика!
 *    - Вывод ошибок beside fields с фокусом на первом ошибочном поле;
 *    - Автоочистка ошибок при вводе;
 *    - Расчет гарантийного депозита (гости × 1 000 ₸);
 *    - Формирование подтверждения брони через чистые DOM-методы (без небезопасного innerHTML);
 *    - Обязательное демонстрационное уведомление (no real booking).
 */

'use strict';

/**
 * Каталог столиков зала кофейни (8 доступных столиков, 5 свойств)
 */
const TABLES_CATALOG = [
    { id: 1, name: 'Стол 1', seats: 2, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
    { id: 2, name: 'Стол 2', seats: 2, zone: 'Центральный зал', depositPerGuest: 1000 },
    { id: 3, name: 'Стол 3', seats: 4, zone: 'Lounge-зона у бара', depositPerGuest: 1000 },
    { id: 4, name: 'Стол 4', seats: 4, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
    { id: 6, name: 'Стол 6', seats: 4, zone: 'Lounge-зона у бара', depositPerGuest: 1000 },
    { id: 7, name: 'Стол 7', seats: 2, zone: 'Зона у окна (Тихая)', depositPerGuest: 1000 },
    { id: 8, name: 'Стол 8', seats: 4, zone: 'Центральный зал', depositPerGuest: 1000 },
    { id: 9, name: 'Стол 9', seats: 6, zone: 'Lounge-зона у бара', depositPerGuest: 1000 }
];

document.addEventListener('DOMContentLoaded', () => {
    initTableSelectionGrid();
    initBookingDetailsPage();
});

/**
 * Поиск столика по ID через .find()
 * @param {number|string} tableId 
 * @returns {Object|undefined}
 */
function findTableById(tableId) {
    const numId = parseInt(tableId, 10);
    return TABLES_CATALOG.find(t => t.id === numId);
}

/**
 * Расчет суммы депозита бронирования (переиспользуемая функция с параметрами)
 * @param {number} guestCount 
 * @param {number} ratePerGuest 
 * @returns {number}
 */
function calculateBookingDeposit(guestCount, ratePerGuest = 1000) {
    const guests = typeof guestCount === 'number' && guestCount > 0 ? guestCount : 1;
    return guests * ratePerGuest;
}

/**
 * 1. Логика на странице booking.html (Выбор столика на интерактивной схеме)
 */
function initTableSelectionGrid() {
    const tableButtons = document.querySelectorAll('[id^="table-btn-"]');
    const quickSelectBtn = document.getElementById('quickSelectBtn');

    if (tableButtons.length === 0) {
        return;
    }

    tableButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.hasAttribute('disabled')) {
                e.preventDefault();
                return;
            }

            const tableNum = btn.id.replace('table-btn-', '');
            const tableInfo = findTableById(tableNum) || {
                id: parseInt(tableNum, 10),
                name: `Стол ${tableNum}`,
                seats: 2,
                zone: 'Основной зал',
                depositPerGuest: 1000
            };

            try {
                localStorage.setItem('global_coffee_selected_table', JSON.stringify(tableInfo));
            } catch (err) {
                console.warn('LocalStorage error:', err);
            }
        });
    });

    if (quickSelectBtn) {
        quickSelectBtn.addEventListener('click', () => {
            const defaultTable = TABLES_CATALOG[0];
            try {
                localStorage.setItem('global_coffee_selected_table', JSON.stringify(defaultTable));
            } catch (err) {
                console.warn('LocalStorage error:', err);
            }
        });
    }
}

/**
 * Поэлементная валидация: отображение ошибки рядом с полем
 * @param {HTMLElement} fieldEl 
 * @param {string} message 
 */
function setBookingFieldError(fieldEl, message) {
    if (!fieldEl) {
        return;
    }
    fieldEl.classList.add('is-invalid');
    fieldEl.classList.add('error');

    let feedback = fieldEl.parentNode.querySelector('.invalid-feedback.field-error-msg');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback d-block text-danger small mt-1 field-error-msg';
        fieldEl.parentNode.appendChild(feedback);
    }
    feedback.textContent = message;
}

/**
 * Очистка ошибки конкретного поля
 * @param {HTMLElement} fieldEl 
 */
function clearBookingFieldError(fieldEl) {
    if (!fieldEl) {
        return;
    }
    fieldEl.classList.remove('is-invalid');
    fieldEl.classList.remove('error');

    const feedback = fieldEl.parentNode.querySelector('.invalid-feedback.field-error-msg');
    if (feedback) {
        feedback.remove();
    }
}

/**
 * Очистка всех ошибок формы бронирования
 */
function clearAllBookingErrors() {
    document.querySelectorAll('#bookingDetailsForm .is-invalid, #bookingDetailsForm .error').forEach(el => {
        el.classList.remove('is-invalid');
        el.classList.remove('error');
    });
    document.querySelectorAll('#bookingDetailsForm .invalid-feedback.field-error-msg').forEach(msg => {
        msg.remove();
    });
    const errorAlert = document.getElementById('bookingError');
    if (errorAlert) {
        errorAlert.classList.add('hidden');
    }
}

/**
 * 2. Логика на странице details.html (Форма оформления брони)
 */
function initBookingDetailsPage() {
    const form = document.getElementById('bookingDetailsForm');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const guestsInput = document.getElementById('guests');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const errorAlert = document.getElementById('bookingError');
    const confirmAlert = document.getElementById('bookingConfirmation');
    const resultBox = document.getElementById('bookingResult');

    if (!form) {
        return;
    }

    // Автоочистка ошибок при вводе
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => clearBookingFieldError(input));
        input.addEventListener('change', () => clearBookingFieldError(input));
    });

    // Ограничение даты: нельзя выбрать прошедшую дату
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) {
        dateInput.min = today;
        if (!dateInput.value) {
            dateInput.value = today;
        }
    }

    // Извлечение выбранного столика из localStorage
    let selectedTable = null;
    try {
        const saved = localStorage.getItem('global_coffee_selected_table');
        if (saved) {
            selectedTable = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Error reading selected table:', e);
    }

    // Показ информационного баннера выбранного столика через чистые DOM-методы
    if (selectedTable && !document.getElementById('selectedTableBanner')) {
        const banner = document.createElement('div');
        banner.id = 'selectedTableBanner';
        banner.className = 'alert alert-info d-flex align-items-center mb-4';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'fs-3 me-3';
        iconSpan.textContent = '🪑';

        const infoDiv = document.createElement('div');
        const boldTitle = document.createElement('strong');
        boldTitle.textContent = `Выбранный столик: ${selectedTable.name} (${selectedTable.seats} места, ${selectedTable.zone})`;

        const changeLinkDiv = document.createElement('div');
        changeLinkDiv.className = 'small text-muted';
        changeLinkDiv.textContent = 'Хотите изменить столик? ';

        const link = document.createElement('a');
        link.href = 'booking.html';
        link.className = 'alert-link';
        link.textContent = 'Вернуться к схеме зала';

        changeLinkDiv.appendChild(link);
        infoDiv.appendChild(boldTitle);
        infoDiv.appendChild(changeLinkDiv);

        banner.appendChild(iconSpan);
        banner.appendChild(infoDiv);

        form.parentNode.insertBefore(banner, form);

        if (guestsInput && !guestsInput.value) {
            guestsInput.value = selectedTable.seats.toString();
        }
    }

    // Обработка отправки формы бронирования
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllBookingErrors();

        let firstInvalidField = null;
        let hasErrors = false;

        // Поле 1: Имя гостя (текст >= 2 символов)
        const trimmedName = nameInput ? nameInput.value.trim() : '';
        if (trimmedName.length < 2) {
            setBookingFieldError(nameInput, 'Пожалуйста, укажите ваше имя (минимум 2 символа).');
            if (!firstInvalidField) firstInvalidField = nameInput;
            hasErrors = true;
        }

        // Поле 2: Телефон (+7 7XX...)
        const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
        if (phoneDigits.length < 10) {
            setBookingFieldError(phoneInput, 'Укажите контактный номер телефона (+7 7XX XXX-XX-XX).');
            if (!firstInvalidField) firstInvalidField = phoneInput;
            hasErrors = true;
        }

        // Поле 3: Дата (не ранее сегодняшнего дня)
        const selectedDate = dateInput ? dateInput.value : '';
        if (!selectedDate || selectedDate < today) {
            setBookingFieldError(dateInput, 'Выберите корректную дату бронирования (не ранее сегодня).');
            if (!firstInvalidField) firstInvalidField = dateInput;
            hasErrors = true;
        }

        // Поле 4: Время визита
        const selectedTime = timeSelect ? timeSelect.value : '';
        if (!selectedTime) {
            setBookingFieldError(timeSelect, 'Пожалуйста, выберите удобное время посещения.');
            if (!firstInvalidField) firstInvalidField = timeSelect;
            hasErrors = true;
        }

        // Поле 5: Количество гостей
        const guestCount = guestsInput ? parseInt(guestsInput.value, 10) : 0;
        if (isNaN(guestCount) || guestCount < 1 || guestCount > 10) {
            setBookingFieldError(guestsInput, 'Количество гостей должно быть от 1 до 10 человек.');
            if (!firstInvalidField) firstInvalidField = guestsInput;
            hasErrors = true;
        }

        // Поле 6: КОМБИНИРОВАННОЕ ПРАВИЛО (сравнение гостей с вместимостью выбранного стола)
        if (selectedTable && typeof selectedTable.seats === 'number') {
            if (guestCount > selectedTable.seats) {
                setBookingFieldError(guestsInput, `Количество гостей (${guestCount}) превышает вместимость выбранного столика (${selectedTable.seats} мест). Пожалуйста, выберите столик большего размера или укажите до ${selectedTable.seats} гостей.`);
                if (!firstInvalidField) firstInvalidField = guestsInput;
                hasErrors = true;
            }
        }

        // Если обнаружены ошибки — фокусируем первое поле
        if (hasErrors) {
            if (errorAlert) {
                errorAlert.classList.remove('hidden');
            }
            if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
                firstInvalidField.focus();
            }
            return;
        }

        if (errorAlert) {
            errorAlert.classList.add('hidden');
        }

        // Генерация кода брони с использованием Math.random()
        const bookingCode = window.GlobalCoffee && typeof window.GlobalCoffee.generateReferenceCode === 'function'
            ? window.GlobalCoffee.generateReferenceCode('BK')
            : `#BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        const tableName = selectedTable ? `${selectedTable.name} (${selectedTable.zone})` : 'Стол в основном зале';
        const formattedDate = window.GlobalCoffee && typeof window.GlobalCoffee.formatDateDisplay === 'function'
            ? window.GlobalCoffee.formatDateDisplay(selectedDate)
            : selectedDate;

        const commentInput = document.getElementById('comment');
        const commentText = commentInput && commentInput.value.trim().length > 0
            ? commentInput.value.trim()
            : 'Без особых пожеланий';

        const depositTotal = calculateBookingDeposit(guestCount, 1000);
        const formattedDeposit = window.GlobalCoffee && typeof window.GlobalCoffee.formatPrice === 'function'
            ? window.GlobalCoffee.formatPrice(depositTotal)
            : `${depositTotal} ₸`;

        // Формирование подробной сводки через DOM-методы
        if (resultBox) {
            resultBox.replaceChildren();

            const headerBox = document.createElement('div');
            headerBox.className = 'border-bottom pb-2 mb-2';

            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'badge bg-success mb-1';
            badgeSpan.textContent = 'Бронь подтверждена';

            const bookingTitle = document.createElement('h4');
            bookingTitle.className = 'h6 fw-bold mb-1';
            bookingTitle.textContent = `Код брони: ${bookingCode}`;

            const guestLine = document.createElement('p');
            guestLine.className = 'small text-muted mb-0';
            guestLine.textContent = `Гость: ${trimmedName} (${phoneInput.value})`;

            headerBox.appendChild(badgeSpan);
            headerBox.appendChild(bookingTitle);
            headerBox.appendChild(guestLine);
            resultBox.appendChild(headerBox);

            // Детали столика и времени
            const gridRow = document.createElement('div');
            gridRow.className = 'row g-2 mb-2 small';

            const col1 = document.createElement('div');
            col1.className = 'col-6';
            col1.textContent = `Столик: ${tableName}`;

            const col2 = document.createElement('div');
            col2.className = 'col-6';
            col2.textContent = `Персон: ${guestCount} чел.`;

            const col3 = document.createElement('div');
            col3.className = 'col-6';
            col3.textContent = `Дата: ${formattedDate}`;

            const col4 = document.createElement('div');
            col4.className = 'col-6';
            col4.textContent = `Время: ${selectedTime}`;

            gridRow.appendChild(col1);
            gridRow.appendChild(col2);
            gridRow.appendChild(col3);
            gridRow.appendChild(col4);
            resultBox.appendChild(gridRow);

            // Депозит и пожелания
            const depositBox = document.createElement('div');
            depositBox.className = 'small border-top pt-2 mb-1';
            depositBox.textContent = `Расчетный депозит: ${formattedDeposit} (засчитывается в счет счета кофейни)`;
            resultBox.appendChild(depositBox);

            const wishesBox = document.createElement('div');
            wishesBox.className = 'small text-muted';
            wishesBox.textContent = `Пожелания к столику: ${commentText}`;
            resultBox.appendChild(wishesBox);

            const statusBox = document.createElement('div');
            statusBox.className = 'small text-success mt-2 fw-semibold';
            statusBox.textContent = '✓ Столик зарезервирован! Срок удержания столика: 15 минут от указанного времени.';
            resultBox.appendChild(statusBox);

            // ОБЯЗАТЕЛЬНОЕ ДЕМОНСТРАЦИОННОЕ УВЕДОМЛЕНИЕ
            const demoAlert = document.createElement('div');
            demoAlert.className = 'alert alert-info mt-3 mb-0 p-2 small border rounded';
            demoAlert.textContent = 'ℹ️ Демонстрационный режим: Данные не отправляются на сервер, реальная бронь не создается. Заявка смоделирована для учебного проекта.';
            resultBox.appendChild(demoAlert);
        }

        if (confirmAlert) {
            confirmAlert.classList.remove('hidden');
            confirmAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Очищаем выбранный столик после успешного оформления
        try {
            localStorage.removeItem('global_coffee_selected_table');
        } catch (e) {
            console.warn('LocalStorage remove error:', e);
        }

        form.reset();
    });
}
