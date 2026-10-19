/**
 * GLOBAL COFFEE — Логика бронирования столиков (js/booking.js)
 * Управляет страницами booking.html (схема зала) и details.html (детали бронирования)
 */

document.addEventListener('DOMContentLoaded', () => {
    initTableSelection();
    initBookingDetailsForm();
});

const TABLES_DATA = {
    1: { id: 1, name: 'Стол 1', seats: 2, zone: 'Зона у окна (Тихая)' },
    2: { id: 2, name: 'Стол 2', seats: 2, zone: 'Центральный зал' },
    3: { id: 3, name: 'Стол 3', seats: 4, zone: 'Lounge-зона у бара' },
    4: { id: 4, name: 'Стол 4', seats: 4, zone: 'Зона у окна (Тихая)' },
    6: { id: 6, name: 'Стол 6', seats: 4, zone: 'Lounge-зона у бара' },
    7: { id: 7, name: 'Стол 7', seats: 2, zone: 'Зона у окна (Тихая)' },
    8: { id: 8, name: 'Стол 8', seats: 4, zone: 'Центральный зал' },
    9: { id: 9, name: 'Стол 9', seats: 6, zone: 'Lounge-зона у бара' }
};

/**
 * 1. Логика на странице booking.html (Выбор столика на схеме зала)
 */
function initTableSelection() {
    const tableButtons = document.querySelectorAll('[id^="table-btn-"]');
    const quickSelectBtn = document.getElementById('quickSelectBtn');

    if (tableButtons.length === 0) return;

    tableButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.hasAttribute('disabled')) return;

            const tableNum = btn.id.replace('table-btn-', '');
            const tableInfo = TABLES_DATA[tableNum] || { id: tableNum, name: `Стол ${tableNum}`, seats: 2, zone: 'Основной зал' };

            try {
                localStorage.setItem('global_coffee_selected_table', JSON.stringify(tableInfo));
            } catch (err) {
                console.warn('LocalStorage error:', err);
            }
        });
    });

    if (quickSelectBtn) {
        quickSelectBtn.addEventListener('click', () => {
            const defaultTable = TABLES_DATA[1];
            try {
                localStorage.setItem('global_coffee_selected_table', JSON.stringify(defaultTable));
            } catch (err) {
                console.warn('LocalStorage error:', err);
            }
        });
    }
}

/**
 * 2. Логика на странице details.html (Оформление брони)
 */
function initBookingDetailsForm() {
    const form = document.getElementById('bookingDetailsForm');
    const dateInput = document.getElementById('date');
    const guestsInput = document.getElementById('guests');
    const errorAlert = document.getElementById('bookingError');
    const confirmAlert = document.getElementById('bookingConfirmation');
    const resultBox = document.getElementById('bookingResult');

    if (!form) return;

    // Ограничение: нельзя выбрать дату в прошлом
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        if (!dateInput.value) {
            dateInput.value = today;
        }
    }

    // Отображаем выбранный на предыдущей странице столик
    let selectedTable = null;
    try {
        const saved = localStorage.getItem('global_coffee_selected_table');
        if (saved) {
            selectedTable = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Error reading selected table:', e);
    }

    // Если стол выбран — выводим информационную плашку перед формой
    if (selectedTable) {
        let banner = document.getElementById('selectedTableBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'selectedTableBanner';
            banner.className = 'alert alert-info d-flex align-items-center mb-4';
            banner.innerHTML = `
                <span class="fs-4 me-3">🪑</span>
                <div>
                    <strong>Выбранный столик:</strong> ${selectedTable.name} (${selectedTable.seats} места, ${selectedTable.zone})
                    <div class="small text-muted">Хотите изменить? <a href="booking.html" class="alert-link">Вернуться к схеме зала</a></div>
                </div>
            `;
            form.parentNode.insertBefore(banner, form);
        }
        if (guestsInput && !guestsInput.value) {
            guestsInput.value = selectedTable.seats;
        }
    }

    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const dateVal = dateInput?.value;
        const timeVal = document.getElementById('time')?.value;
        const guestsVal = guestsInput?.value;
        const nameVal = document.getElementById('name')?.value.trim();
        const phoneVal = document.getElementById('phone')?.value.trim();
        const requestsVal = document.getElementById('comment')?.value.trim() || document.getElementById('requests')?.value.trim() || 'Без особых пожеланий';

        // Валидация
        if (!dateVal || !timeVal || !guestsVal || !nameVal || !phoneVal) {
            if (errorAlert) {
                errorAlert.classList.remove('hidden');
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (errorAlert) {
            errorAlert.classList.add('hidden');
        }

        // Генерируем уникальный код брони
        const bookingCode = '#BK-' + Math.floor(1000 + Math.random() * 9000);
        const tableName = selectedTable ? `${selectedTable.name} (${selectedTable.zone})` : 'Стол в основном зале';

        // Формируем чек бронирования
        if (resultBox) {
            resultBox.innerHTML = `
                <div class="border-bottom pb-2 mb-2">
                    <span class="badge bg-success mb-1">Бронь подтверждена</span>
                    <h4 class="h6 fw-bold mb-1">Код брони: ${bookingCode}</h4>
                    <p class="small text-muted mb-0">Гость: <strong>${escapeHtml(nameVal)}</strong> (${escapeHtml(phoneVal)})</p>
                </div>
                <div class="row g-2 mb-2 small">
                    <div class="col-6"><strong>Столик:</strong> ${escapeHtml(tableName)}</div>
                    <div class="col-6"><strong>Персон:</strong> ${escapeHtml(guestsVal)} чел.</div>
                    <div class="col-6"><strong>Дата:</strong> ${formatDisplayDate(dateVal)}</div>
                    <div class="col-6"><strong>Время:</strong> ${escapeHtml(timeVal)}</div>
                </div>
                <div class="small text-muted border-top pt-2">
                    <strong>Пожелания:</strong> ${escapeHtml(requestsVal)}
                </div>
                <div class="small text-success mt-2">
                    ✓ Мы ждем вас! Срок удержания стола: 15 минут от указанного времени.
                </div>
            `;
        }

        if (confirmAlert) {
            confirmAlert.classList.remove('hidden');
            confirmAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Очищаем выбранный стол
        localStorage.removeItem('global_coffee_selected_table');
        form.reset();
    });
}

function formatDisplayDate(isoDate) {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return isoDate;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

