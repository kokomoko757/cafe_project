

'use strict';

const ORDER_ITEMS_CATALOG = [
    { id: 'nut_flat_white', name: 'Ореховый Флэт Уайт', price: 1390, category: 'coffee', unit: '350 мл', image: 'images/item-nut-flat-white.jpg' },
    { id: 'frappe_cocoa', name: 'Фраппе Сливочный-Какао', price: 1790, category: 'cold', unit: '400 мл', image: 'images/item-frappe-cocoa.jpg' },
    { id: 'ice_matcha_strawberry', name: 'Айс Матча Клубника', price: 1690, category: 'cold', unit: '350 мл', image: 'images/item-matcha-strawberry.jpg' },
    { id: 'tea_orange_strawberry', name: 'Чай Апельсин-Клубника', price: 1090, category: 'coffee', unit: '400 мл', image: 'images/item-tea-orange.jpg' },
    { id: 'lemonade_sakura', name: 'Лимонад Сакура', price: 1490, category: 'cold', unit: '400 мл', image: 'images/item-lemonade-sakura.jpg' },
    { id: 'smoothie_kiwi', name: 'Смузи Киви', price: 1790, category: 'cold', unit: '350 мл', image: 'images/item-smoothie-kiwi.jpg' },
    { id: 'sandwich', name: 'Сэндвич с курицей', price: 1490, category: 'food', unit: '220 г', image: 'images/item-chicken-sandwich.jpg' },
    { id: 'hotdog', name: 'Хот-дог гриль', price: 1190, category: 'food', unit: '190 г', image: 'images/item-hotdog-grill.jpg' },
    { id: 'donuts', name: 'Пончики шоколадные', price: 990, category: 'food', unit: '2 шт', image: 'images/item-donuts-chocolate.jpg' },
    { id: 'onigiri', name: 'Онигири с лососем', price: 890, category: 'food', unit: '130 г', image: 'images/item-onigiri-salmon.jpg' }
];

document.addEventListener('DOMContentLoaded', () => {
    initOrderCalculator();
    initDeliveryTypeToggle();
    initFieldInputErrorClearers();
    initOrderFormSubmit();
    restoreCartFromLocalStorage();
    recalculateCart();
});

function findCatalogItem(itemId) {
    return ORDER_ITEMS_CATALOG.find(item => item.id === itemId);
}

function initOrderCalculator() {
    const checkboxes = document.querySelectorAll('input[name="order_items"]');
    const qtyInputs = document.querySelectorAll('.qty-input, input[id^="qty_"]');
    const resetBtn = document.getElementById('orderResetBtn');

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateCardSelectionState(cb);
            recalculateCart();
        });
    });

    qtyInputs.forEach(input => {
        input.addEventListener('input', () => {
            let val = parseInt(input.value, 10);
            if (isNaN(val) || val < 1) {
                input.value = '1';
                val = 1;
            } else if (val > 10) {
                input.value = '10';
                val = 10;
            }

            const card = input.closest('.card');
            if (card) {
                const cb = card.querySelector('input[type="checkbox"]');
                if (cb && !cb.checked) {
                    cb.checked = true;
                    updateCardSelectionState(cb);
                }
            }

            recalculateCart();
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            setTimeout(() => {
                document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                clearAllFieldErrors();
                try {
                    localStorage.removeItem('global_coffee_cart');
                } catch (e) {
                    console.warn('LocalStorage error:', e);
                }
                recalculateCart();
                if (typeof window.updateNavCartBadge === 'function') {
                    window.updateNavCartBadge();
                }
            }, 50);
        });
    }
}

function updateCardSelectionState(checkbox) {
    const card = checkbox.closest('.card');
    if (!card) {
        return;
    }
    if (checkbox.checked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
}

function recalculateCart() {
    const checkboxes = document.querySelectorAll('input[name="order_items"]:checked');
    let totalItems = 0;
    let totalPrice = 0;
    const cartState = {};

    checkboxes.forEach(cb => {
        const itemKey = cb.value;
        const itemInfo = findCatalogItem(itemKey);
        if (!itemInfo) {
            return;
        }

        const card = cb.closest('.card');
        const qtyInput = card ? card.querySelector('input[type="number"]') : null;
        let qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
        if (isNaN(qty) || qty < 1) {
            qty = 1;
        }

        const lineSubtotal = window.GlobalCoffee && typeof window.GlobalCoffee.calculateLineSubtotal === 'function'
            ? window.GlobalCoffee.calculateLineSubtotal(itemInfo.price, qty)
            : itemInfo.price * qty;

        totalItems += qty;
        totalPrice += lineSubtotal;

        cartState[itemKey] = {
            id: itemInfo.id,
            name: itemInfo.name,
            price: itemInfo.price,
            qty: qty,
            subtotal: lineSubtotal
        };
    });

    const itemsCountEl = document.getElementById('orderItemsCount');
    if (itemsCountEl) {
        itemsCountEl.textContent = `${totalItems} шт.`;
    }

    const totalPriceEl = document.getElementById('orderTotalPrice');
    if (totalPriceEl) {
        const priceStr = window.GlobalCoffee && typeof window.GlobalCoffee.formatPrice === 'function'
            ? window.GlobalCoffee.formatPrice(totalPrice)
            : `${totalPrice} ₸`;
        totalPriceEl.textContent = priceStr;
    }

    const submitBtn = document.getElementById('orderSubmitBtn');
    let emptyStateMsg = document.getElementById('orderEmptyStateMsg');

    if (totalItems === 0) {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled');
        }
        if (!emptyStateMsg) {
            const container = document.getElementById('orderTotalContainer');
            if (container) {
                emptyStateMsg = document.createElement('div');
                emptyStateMsg.id = 'orderEmptyStateMsg';
                emptyStateMsg.className = 'small text-muted fst-italic mt-1';
                emptyStateMsg.textContent = 'Корзина пуста: выберите хотя бы одно блюдо или напиток из меню выше.';
                container.parentNode.appendChild(emptyStateMsg);
            }
        }
    } else {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled');
        }
        if (emptyStateMsg) {
            emptyStateMsg.remove();
        }
    }

    try {
        localStorage.setItem('global_coffee_cart', JSON.stringify(cartState));
    } catch (e) {
        console.warn('LocalStorage save error:', e);
    }

    if (typeof window.updateNavCartBadge === 'function') {
        window.updateNavCartBadge();
    }

    return { totalItems, totalPrice, cartState };
}

function initDeliveryTypeToggle() {
    const radioHome = document.getElementById('delivery_home');
    const radioOnsite = document.getElementById('delivery_onsite');
    const streetInput = document.getElementById('street');
    const timeSelect = document.getElementById('arrival_time');

    function updateDeliveryUI() {
        const homeContainer = document.querySelector('#delivery_home')?.closest('.form-check')?.nextElementSibling;
        const onsiteContainer = document.querySelector('#delivery_onsite')?.closest('.form-check')?.nextElementSibling;

        if (radioHome && radioHome.checked) {
            if (homeContainer) homeContainer.classList.remove('hidden');
            if (onsiteContainer) onsiteContainer.classList.add('hidden');
            if (streetInput) streetInput.required = true;
            if (timeSelect) timeSelect.required = false;
        } else if (radioOnsite && radioOnsite.checked) {
            if (homeContainer) homeContainer.classList.add('hidden');
            if (onsiteContainer) onsiteContainer.classList.remove('hidden');
            if (streetInput) streetInput.required = false;
            if (timeSelect) timeSelect.required = true;
        }
    }

    if (radioHome) radioHome.addEventListener('change', updateDeliveryUI);
    if (radioOnsite) radioOnsite.addEventListener('change', updateDeliveryUI);

    updateDeliveryUI();
}

function setFieldError(fieldEl, message) {
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

function clearFieldError(fieldEl) {
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

function clearAllFieldErrors() {
    document.querySelectorAll('.is-invalid, .error').forEach(el => {
        el.classList.remove('is-invalid');
        el.classList.remove('error');
    });
    document.querySelectorAll('.invalid-feedback.field-error-msg').forEach(msg => {
        msg.remove();
    });
    const orderError = document.getElementById('orderError');
    if (orderError) {
        orderError.classList.add('hidden');
    }
}

function initFieldInputErrorClearers() {
    const fields = document.querySelectorAll('#orderForm input, #orderForm select, #orderForm textarea');
    fields.forEach(field => {
        field.addEventListener('input', () => {
            clearFieldError(field);
        });
        field.addEventListener('change', () => {
            clearFieldError(field);
        });
    });
}

function initOrderFormSubmit() {
    const form = document.getElementById('orderForm');
    const errorAlert = document.getElementById('orderError');
    const confirmAlert = document.getElementById('orderConfirmation');
    const orderResult = document.getElementById('orderResult');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllFieldErrors();

        const { totalItems, totalPrice, cartState } = recalculateCart();

        let firstInvalidField = null;
        let hasErrors = false;

        if (totalItems === 0 || totalPrice === 0) {
            if (errorAlert) {
                errorAlert.classList.remove('hidden');
                const errorDesc = errorAlert.querySelector('p');
                if (errorDesc) {
                    errorDesc.textContent = 'Пожалуйста, выберите хотя бы одно блюдо или напиток в меню выше.';
                }
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        const nameInput = document.getElementById('customer_name');
        const trimmedName = nameInput ? nameInput.value.trim() : '';
        if (trimmedName.length < 2) {
            setFieldError(nameInput, 'Пожалуйста, укажите ваше имя (минимум 2 символа).');
            if (!firstInvalidField) firstInvalidField = nameInput;
            hasErrors = true;
        }

        const phoneInput = document.getElementById('customer_phone');
        const digitsOnly = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
        if (digitsOnly.length < 10) {
            setFieldError(phoneInput, 'Укажите корректный номер телефона для связи (например, +7 777 000 00 00).');
            if (!firstInvalidField) firstInvalidField = phoneInput;
            hasErrors = true;
        }

        const paymentInput = document.getElementById('payment_method');
        if (!paymentInput || paymentInput.value === '') {
            setFieldError(paymentInput, 'Выберите удобный для вас способ оплаты.');
            if (!firstInvalidField) firstInvalidField = paymentInput;
            hasErrors = true;
        }

        const isDelivery = document.getElementById('delivery_home')?.checked === true;
        const streetInput = document.getElementById('street');
        const arrivalTimeInput = document.getElementById('arrival_time');

        if (isDelivery) {
            const streetVal = streetInput ? streetInput.value.trim() : '';
            if (streetVal.length < 5) {
                setFieldError(streetInput, 'Укажите адрес доставки в Астане (улицу, дом, офис/квартиру).');
                if (!firstInvalidField) firstInvalidField = streetInput;
                hasErrors = true;
            }
        } else {
            const timeVal = arrivalTimeInput ? arrivalTimeInput.value : '';
            if (!timeVal) {
                setFieldError(arrivalTimeInput, 'Выберите ориентировочное время вашего визита.');
                if (!firstInvalidField) firstInvalidField = arrivalTimeInput;
                hasErrors = true;
            }
        }

        if (hasErrors) {
            if (errorAlert) {
                errorAlert.classList.remove('hidden');
                const errorDesc = errorAlert.querySelector('p');
                if (errorDesc) {
                    errorDesc.textContent = 'Пожалуйста, исправьте выделенные поля формы перед подтверждением заказа.';
                }
            }
            if (firstInvalidField && typeof firstInvalidField.focus === 'function') {
                firstInvalidField.focus();
            }
            return;
        }

        if (errorAlert) {
            errorAlert.classList.add('hidden');
        }

        const orderId = window.GlobalCoffee && typeof window.GlobalCoffee.generateReferenceCode === 'function'
            ? window.GlobalCoffee.generateReferenceCode('GC')
            : `#GC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        const deliveryText = isDelivery ? 'Курьерская доставка по г. Астана' : 'Самовывоз / Заказ в кофейне';
        const addressText = isDelivery
            ? `${document.getElementById('city')?.value || 'г. Астана'}, ${streetInput ? streetInput.value.trim() : ''}`
            : `ул. Туркестан, 4Б (Флагман), время: ${arrivalTimeInput ? arrivalTimeInput.value : 'в течение 30 мин'}`;

        const instructionsInput = document.getElementById('special_instructions');
        const instructionsText = instructionsInput && instructionsInput.value.trim().length > 0
            ? instructionsInput.value.trim()
            : 'Без дополнительных пожеланий';

        if (orderResult) {
            orderResult.replaceChildren();

            const headerBox = document.createElement('div');
            headerBox.className = 'border-bottom pb-3 mb-3';

            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'badge bg-primary mb-2 fs-6';
            badgeSpan.textContent = `Номер заказа: ${orderId}`;

            const customerHeader = document.createElement('h4');
            customerHeader.className = 'h6 fw-bold mb-1';
            customerHeader.textContent = `Получатель: ${trimmedName} (${phoneInput.value})`;

            const deliveryInfo = document.createElement('p');
            deliveryInfo.className = 'small text-muted mb-1';
            deliveryInfo.textContent = `Способ: ${deliveryText} (${addressText})`;

            const wishesInfo = document.createElement('p');
            wishesInfo.className = 'small text-secondary mb-0';
            wishesInfo.textContent = `Пожелания: ${instructionsText}`;

            headerBox.appendChild(badgeSpan);
            headerBox.appendChild(customerHeader);
            headerBox.appendChild(deliveryInfo);
            headerBox.appendChild(wishesInfo);
            orderResult.appendChild(headerBox);

            const listGroup = document.createElement('ul');
            listGroup.className = 'list-group list-group-flush mb-3';

            const cartKeys = Object.keys(cartState);
            cartKeys.forEach(k => {
                const item = cartState[k];
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center px-0 py-2';

                const leftDiv = document.createElement('div');
                const itemName = document.createElement('strong');
                itemName.textContent = item.name;

                const itemSub = document.createElement('div');
                itemSub.className = 'small text-muted';
                const formattedUnitPrice = window.GlobalCoffee && typeof window.GlobalCoffee.formatPrice === 'function'
                    ? window.GlobalCoffee.formatPrice(item.price)
                    : `${item.price} ₸`;
                itemSub.textContent = `${item.qty} шт. × ${formattedUnitPrice}`;

                leftDiv.appendChild(itemName);
                leftDiv.appendChild(itemSub);

                const rightSpan = document.createElement('span');
                rightSpan.className = 'fw-bold';
                const formattedLineSubtotal = window.GlobalCoffee && typeof window.GlobalCoffee.formatPrice === 'function'
                    ? window.GlobalCoffee.formatPrice(item.subtotal)
                    : `${item.subtotal} ₸`;
                rightSpan.textContent = formattedLineSubtotal;

                li.appendChild(leftDiv);
                li.appendChild(rightSpan);
                listGroup.appendChild(li);
            });
            orderResult.appendChild(listGroup);

            const totalBox = document.createElement('div');
            totalBox.className = 'd-flex justify-content-between align-items-center pt-2 border-top';

            const totalLabel = document.createElement('span');
            totalLabel.className = 'fs-5 fw-bold';
            totalLabel.textContent = 'Итого к оплате:';

            const totalAmount = document.createElement('span');
            totalAmount.className = 'fs-4 fw-bold text-primary';
            totalAmount.textContent = window.GlobalCoffee && typeof window.GlobalCoffee.formatPrice === 'function'
                ? window.GlobalCoffee.formatPrice(totalPrice)
                : `${totalPrice} ₸`;

            totalBox.appendChild(totalLabel);
            totalBox.appendChild(totalAmount);
            orderResult.appendChild(totalBox);

            const paymentBox = document.createElement('div');
            paymentBox.className = 'small text-success mt-2 fw-semibold';
            paymentBox.textContent = `✓ Способ оплаты: ${paymentInput.options[paymentInput.selectedIndex].text}`;
            orderResult.appendChild(paymentBox);

            const demoAlert = document.createElement('div');
            demoAlert.className = 'alert alert-info mt-3 mb-0 p-2 small border rounded';
            demoAlert.textContent = 'ℹ️ Демонстрационный режим: Данные не отправляются на сервер, реальная оплата и доставка не производятся. Заказ смоделирован на клиенте.';
            orderResult.appendChild(demoAlert);
        }

        if (confirmAlert) {
            confirmAlert.classList.remove('hidden');
            confirmAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        try {
            localStorage.removeItem('global_coffee_cart');
        } catch (e) {
            console.warn('LocalStorage remove error:', e);
        }

        if (typeof window.updateNavCartBadge === 'function') {
            window.updateNavCartBadge();
        }
    });
}

function restoreCartFromLocalStorage() {
    try {
        const saved = localStorage.getItem('global_coffee_cart');
        if (!saved) {
            return;
        }
        const cartData = JSON.parse(saved);

        const keys = Object.keys(cartData);
        keys.forEach(key => {
            const cb = document.querySelector(`input[name="order_items"][value="${key}"]`);
            if (cb) {
                cb.checked = true;
                updateCardSelectionState(cb);
                const card = cb.closest('.card');
                const qtyInput = card ? card.querySelector('input[type="number"]') : null;
                if (qtyInput && cartData[key].qty) {
                    qtyInput.value = cartData[key].qty.toString();
                }
            }
        });
    } catch (e) {
        console.warn('Cart restoration error:', e);
    }
}
