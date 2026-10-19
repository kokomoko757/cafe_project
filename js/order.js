/**
 * GLOBAL COFFEE — Логика онлайн-заказа (js/order.js)
 * Реализует:
 * 1. Интерактивный калькулятор корзины (позиции, количество, итоговая сумма)
 * 2. Переключение способов получения заказа (доставка на дом vs самовывоз/на месте)
 * 3. Валидацию заказа перед оформлением
 * 4. Формирование динамического чека и отображение подтверждения с номером заказа
 * 5. Сохранение состояния корзины в localStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    initOrderCalculator();
    initDeliveryTypeToggle();
    initOrderFormSubmit();
    restoreCartFromLocalStorage();
});

const ITEM_CATALOG = {
    nut_flat_white: { name: 'Ореховый Флэт Уайт', price: 1390 },
    frappe_cocoa: { name: 'Фраппе Сливочный-Какао', price: 1790 },
    ice_matcha_strawberry: { name: 'Айс Матча Клубника', price: 1690 },
    tea_orange_strawberry: { name: 'Чай Апельсин-Клубника', price: 1090 },
    lemonade_sakura: { name: 'Лимонад Сакура', price: 1490 },
    smoothie_kiwi: { name: 'Смузи Киви', price: 1790 },
    sandwich: { name: 'Сэндвич с курицей', price: 1490 },
    hotdog: { name: 'Хот-дог гриль', price: 1190 },
    donuts: { name: 'Пончики шоколадные', price: 990 },
    onigiri: { name: 'Онигири с лососем', price: 890 }
};

/**
 * 1. Калькулятор корзины
 */
function initOrderCalculator() {
    const checkboxes = document.querySelectorAll('input[name="order_items"]');
    const qtyInputs = document.querySelectorAll('.qty-input, input[id^="qty_"]');
    const resetBtn = document.getElementById('orderResetBtn');

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            highlightCard(cb);
            recalculateCart();
        });
    });

    qtyInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (Number(input.value) < 1) input.value = 1;
            if (Number(input.value) > 10) input.value = 10;
            // Если изменили количество, но чекбокс еще не нажат — отмечаем чекбокс
            const card = input.closest('.card');
            if (card) {
                const cb = card.querySelector('input[type="checkbox"]');
                if (cb && !cb.checked) {
                    cb.checked = true;
                    highlightCard(cb);
                }
            }
            recalculateCart();
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            setTimeout(() => {
                document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                recalculateCart();
                localStorage.removeItem('global_coffee_cart');
                if (window.updateNavCartBadge) window.updateNavCartBadge();
            }, 50);
        });
    }
}

function highlightCard(checkbox) {
    const card = checkbox.closest('.card');
    if (!card) return;
    if (checkbox.checked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
}

/**
 * Пересчет общей суммы и количества
 */
function recalculateCart() {
    const checkboxes = document.querySelectorAll('input[name="order_items"]:checked');
    let totalItems = 0;
    let totalPrice = 0;
    const cartState = {};

    checkboxes.forEach(cb => {
        const itemKey = cb.value;
        const itemInfo = ITEM_CATALOG[itemKey];
        if (!itemInfo) return;

        const card = cb.closest('.card') || cb.closest('tr');
        const qtyInput = card ? card.querySelector('input[type="number"]') : null;
        const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

        totalItems += qty;
        totalPrice += itemInfo.price * qty;

        cartState[itemKey] = {
            name: itemInfo.name,
            price: itemInfo.price,
            qty: qty
        };
    });

    // Обновляем счетчик
    const itemsCountEl = document.getElementById('orderItemsCount');
    if (itemsCountEl) {
        itemsCountEl.textContent = `${totalItems} шт.`;
    }

    // Обновляем общую сумму
    const totalPriceEl = document.getElementById('orderTotalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = `${formatPrice(totalPrice)} ₸`;
    }

    // Сохраняем в localStorage
    try {
        localStorage.setItem('global_coffee_cart', JSON.stringify(cartState));
    } catch (e) {
        console.warn('LocalStorage error:', e);
    }

    if (window.updateNavCartBadge) {
        window.updateNavCartBadge();
    }

    return { totalItems, totalPrice, cartState };
}

function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * 2. Переключение способов получения заказа
 */
function initDeliveryTypeToggle() {
    const radioHome = document.getElementById('delivery_home');
    const radioOnsite = document.getElementById('delivery_onsite');
    const streetInput = document.getElementById('street');

    function updateDeliveryUI() {
        const homeContainer = document.querySelector('#delivery_home')?.closest('.form-check')?.nextElementSibling;
        const onsiteContainer = document.querySelector('#delivery_onsite')?.closest('.form-check')?.nextElementSibling;

        if (radioHome && radioHome.checked) {
            if (homeContainer) homeContainer.classList.remove('hidden');
            if (onsiteContainer) onsiteContainer.classList.add('hidden');
            if (streetInput) streetInput.required = true;
        } else if (radioOnsite && radioOnsite.checked) {
            if (homeContainer) homeContainer.classList.add('hidden');
            if (onsiteContainer) onsiteContainer.classList.remove('hidden');
            if (streetInput) streetInput.required = false;
        }
    }

    if (radioHome) radioHome.addEventListener('change', updateDeliveryUI);
    if (radioOnsite) radioOnsite.addEventListener('change', updateDeliveryUI);

    updateDeliveryUI();
}

/**
 * 3. Валидация и отправка формы
 */
function initOrderFormSubmit() {
    const form = document.getElementById('orderForm');
    const errorAlert = document.getElementById('orderError');
    const confirmAlert = document.getElementById('orderConfirmation');
    const orderResult = document.getElementById('orderResult');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const { totalItems, totalPrice, cartState } = recalculateCart();

        // Проверка: выбрана ли хоть одна позиция
        if (totalItems === 0 || totalPrice === 0) {
            if (errorAlert) {
                errorAlert.classList.remove('hidden');
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Проверка обязательных полей
        const nameInput = document.getElementById('customer_name');
        const phoneInput = document.getElementById('customer_phone');
        const paymentInput = document.getElementById('payment_method');

        if (!nameInput?.value.trim() || !phoneInput?.value.trim() || !paymentInput?.value) {
            if (errorAlert) {
                errorAlert.classList.remove('hidden');
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Если всё верно — скрываем ошибку
        if (errorAlert) {
            errorAlert.classList.add('hidden');
        }

        // Генерируем уникальный номер заказа
        const orderId = '#GC-2026-' + Math.floor(1000 + Math.random() * 9000);

        // Определяем способ доставки
        const isDelivery = document.getElementById('delivery_home')?.checked;
        const deliveryText = isDelivery ? 'Доставка курьером (Астана)' : 'Самовывоз / Заказ на месте';
        const addressText = isDelivery 
            ? `${document.getElementById('city')?.value || 'Астана'}, ${document.getElementById('street')?.value || 'центр'}`
            : 'ул. Туркестан, 4Б (Флагман)';

        // Формируем чек
        if (orderResult) {
            let itemsHtml = '<ul class="list-group list-group-flush mb-3">';
            Object.values(cartState).forEach(item => {
                itemsHtml += `
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                        <div>
                            <strong>${item.name}</strong>
                            <div class="small text-muted">${item.qty} шт. × ${formatPrice(item.price)} ₸</div>
                        </div>
                        <span class="fw-bold">${formatPrice(item.price * item.qty)} ₸</span>
                    </li>
                `;
            });
            itemsHtml += '</ul>';

            orderResult.innerHTML = `
                <div class="border-bottom pb-2 mb-2">
                    <span class="badge bg-primary mb-1">Заказ ${orderId}</span>
                    <h4 class="h6 fw-bold mb-1">Получатель: ${nameInput.value} (${phoneInput.value})</h4>
                    <p class="small text-muted mb-0"><strong>Способ:</strong> ${deliveryText} (${addressText})</p>
                </div>
                ${itemsHtml}
                <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span class="fs-5 fw-bold">Итого к оплате:</span>
                    <span class="fs-4 fw-bold text-primary">${formatPrice(totalPrice)} ₸</span>
                </div>
                <div class="small text-success mt-2">
                    ✓ Оплата: ${paymentInput.options[paymentInput.selectedIndex].text}
                </div>
            `;
        }

        // Показываем блок подтверждения
        if (confirmAlert) {
            confirmAlert.classList.remove('hidden');
            confirmAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Очищаем корзину в localStorage
        localStorage.removeItem('global_coffee_cart');
        if (window.updateNavCartBadge) window.updateNavCartBadge();
    });
}

/**
 * 4. Восстановление корзины при повторном визите
 */
function restoreCartFromLocalStorage() {
    try {
        const saved = localStorage.getItem('global_coffee_cart');
        if (!saved) return;
        const cartData = JSON.parse(saved);

        Object.keys(cartData).forEach(key => {
            const cb = document.querySelector(`input[name="order_items"][value="${key}"]`);
            if (cb) {
                cb.checked = true;
                highlightCard(cb);
                const card = cb.closest('.card') || cb.closest('tr');
                const qtyInput = card ? card.querySelector('input[type="number"]') : null;
                if (qtyInput && cartData[key].qty) {
                    qtyInput.value = cartData[key].qty;
                }
            }
        });

        recalculateCart();
    } catch (e) {
        console.warn('Cart restoration error:', e);
    }
}
