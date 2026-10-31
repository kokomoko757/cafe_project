import React, { useState } from 'react';
import { ORDER_ITEMS_CATALOG } from '../data/menu';
import { CartItem, OrderConfirmationData } from '../types';
import { formatPrice, generateReferenceCode, formatPhoneNumber } from '../utils/coffee';

interface OrderPageProps {
  cart: Record<string, CartItem>;
  onUpdateCart: (newCart: Record<string, CartItem>) => void;
  onNavigate: (page: string) => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({ cart, onUpdateCart, onNavigate }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ORDER_ITEMS_CATALOG.forEach(item => {
      initial[item.id] = cart[item.id]?.qty || 1;
    });
    return initial;
  });

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'onsite'>('home');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [hasTable, setHasTable] = useState<'yes' | 'no'>('no');
  const [tableNumber, setTableNumber] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [globalErrorMsg, setGlobalErrorMsg] = useState('');
  const [confirmation, setConfirmation] = useState<OrderConfirmationData | null>(null);

  const handleCheckboxToggle = (itemId: string) => {
    const isChecked = !!cart[itemId];
    const newCart = { ...cart };

    if (isChecked) {
      delete newCart[itemId];
    } else {
      const item = ORDER_ITEMS_CATALOG.find(i => i.id === itemId);
      if (item) {
        const qty = quantities[itemId] || 1;
        newCart[itemId] = {
          id: item.id,
          name: item.name,
          price: item.price,
          qty: qty,
          subtotal: item.price * qty,
          image: item.image,
          unit: item.unit
        };
      }
    }
    onUpdateCart(newCart);
  };

  const handleQtyChange = (itemId: string, newQtyRaw: number) => {
    let validQty = Math.max(1, Math.min(10, isNaN(newQtyRaw) ? 1 : newQtyRaw));
    setQuantities(prev => ({ ...prev, [itemId]: validQty }));

    const item = ORDER_ITEMS_CATALOG.find(i => i.id === itemId);
    if (!item) return;

    const newCart = { ...cart };
    newCart[itemId] = {
      id: item.id,
      name: item.name,
      price: item.price,
      qty: validQty,
      subtotal: item.price * validQty,
      image: item.image,
      unit: item.unit
    };
    onUpdateCart(newCart);
  };

  const handleResetForm = () => {
    onUpdateCart({});
    const initialQty: Record<string, number> = {};
    ORDER_ITEMS_CATALOG.forEach(i => { initialQty[i.id] = 1; });
    setQuantities(initialQty);
    setSpecialInstructions('');
    setStreet('');
    setApartment('');
    setEntrance('');
    setCustomerName('');
    setCustomerPhone('');
    setPaymentMethod('');
    setErrors({});
    setHasGlobalError(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setCustomerPhone(formatted);
    if (errors.customer_phone) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.customer_phone;
        return next;
      });
    }
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (hasGlobalError) {
      setHasGlobalError(false);
    }
  };

  const cartItemsList = Object.values(cart);
  const totalItemsCount = cartItemsList.reduce((acc, item) => acc + item.qty, 0);
  const totalOrderPrice = cartItemsList.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (totalItemsCount === 0 || totalOrderPrice === 0) {
      setHasGlobalError(true);
      setGlobalErrorMsg('Пожалуйста, выберите хотя бы одно блюдо или напиток в меню выше.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    const trimmedName = customerName.trim();
    if (trimmedName.length < 2) {
      newErrors.customer_name = 'Пожалуйста, укажите ваше имя (минимум 2 символа).';
    }

    const phoneDigits = customerPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      newErrors.customer_phone = 'Укажите корректный номер телефона для связи (например, +7 777 000 00 00).';
    }

    if (!paymentMethod) {
      newErrors.payment_method = 'Выберите удобный для вас способ оплаты.';
    }

    if (deliveryType === 'home') {
      if (street.trim().length < 5) {
        newErrors.street = 'Укажите адрес доставки в Астане (улицу, дом, офис/квартиру).';
      }
    } else {
      if (hasTable === 'yes' && !tableNumber) {
        newErrors.table_number = 'Выберите номер забронированного столика.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setHasGlobalError(true);
      setGlobalErrorMsg('Пожалуйста, исправьте выделенные поля формы перед подтверждением заказа.');
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setHasGlobalError(false);

    const orderId = generateReferenceCode('GC');
    let addressOrTable = '';
    if (deliveryType === 'home') {
      addressOrTable = `г. Астана, ${street.trim()}${apartment ? `, кв. ${apartment}` : ''}${entrance ? `, ${entrance}` : ''}`;
    } else {
      if (hasTable === 'yes') {
        addressOrTable = `ул. Туркестан, 4Б (Флагман), Стол ${tableNumber || 'в зале'}${bookingTime ? `, время: ${bookingTime}` : ''}`;
      } else {
        addressOrTable = `ул. Туркестан, 4Б (Флагман), на вынос / свободный столик`;
      }
    }

    let paymentMethodText = 'Банковской картой онлайн';
    if (paymentMethod === 'kaspi') paymentMethodText = 'Kaspi QR / Kaspi Pay';
    else if (paymentMethod === 'cash') paymentMethodText = 'Наличными при получении';

    setConfirmation({
      orderId,
      name: trimmedName,
      phone: customerPhone,
      deliveryType,
      addressOrTable,
      specialInstructions: specialInstructions.trim() || 'Без дополнительных пожеланий',
      paymentMethod: paymentMethodText,
      items: cartItemsList,
      totalPrice: totalOrderPrice,
      totalItems: totalItemsCount
    });

    onUpdateCart({});
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  return (
    <main className="page-content container py-5">
      <section className="card shadow-sm border rounded-3 p-4 p-md-5 mb-5 bg-white">
        <div className="text-center text-md-start mb-4">
          <h1 className="section-title display-6 fw-bold mb-2">Оформление онлайн-заказа</h1>
          <p className="lead text-muted mb-0">
            Соберите ваш любимый заказ из меню Global Coffee и выберите удобный способ получения!
          </p>
        </div>

        {/* Confirmation card */}
        {confirmation && (
          <div id="orderConfirmation" className="alert alert-success p-4 mb-4 rounded-3 shadow-sm" role="alert">
            <div className="d-flex align-items-center mb-2">
              <span className="fs-4 me-2">🎉</span>
              <h2 className="h5 fw-bold mb-0 text-success">Заказ успешно оформлен и передан на кухню!</h2>
            </div>
            <p className="mb-2">
              Спасибо за заказ в Global Coffee! Номер вашего онлайн-заказа:{' '}
              <strong>{confirmation.orderId}</strong>.
            </p>

            <div id="orderResult" className="p-3 bg-white rounded border mb-3">
              <div className="border-bottom pb-3 mb-3">
                <span className="badge bg-primary mb-2 fs-6">Номер заказа: {confirmation.orderId}</span>
                <h4 className="h6 fw-bold mb-1">
                  Получатель: {confirmation.name} ({confirmation.phone})
                </h4>
                <p className="small text-muted mb-1">
                  Способ: {confirmation.deliveryType === 'home' ? 'Курьерская доставка по г. Астана' : 'Самовывоз / Заказ в кофейне'} ({confirmation.addressOrTable})
                </p>
                <p className="small text-secondary mb-0">
                  Пожелания: {confirmation.specialInstructions}
                </p>
              </div>

              <ul className="list-group list-group-flush mb-3">
                {confirmation.items.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                    <div>
                      <strong>{item.name}</strong>
                      <div className="small text-muted">
                        {item.qty} шт. × {formatPrice(item.price)}
                      </div>
                    </div>
                    <span className="fw-bold">{formatPrice(item.subtotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="fs-5 fw-bold">Итого к оплате:</span>
                <span className="fs-4 fw-bold text-primary">{formatPrice(confirmation.totalPrice)}</span>
              </div>

              <div className="small text-success mt-2 fw-semibold">
                ✓ Способ оплаты: {confirmation.paymentMethod}
              </div>

              <div className="alert alert-info mt-3 mb-0 p-2 small border rounded">
                ℹ️ Демонстрационный режим: Данные не отправляются на сервер, реальная оплата и доставка не производятся. Заказ смоделирован на клиенте.
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-success btn-sm"
                onClick={() => setConfirmation(null)}
              >
                Оформить новый заказ
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('home')}
              >
                На главную
              </button>
            </div>
          </div>
        )}

        {/* Error banner */}
        {hasGlobalError && (
          <div id="orderError" className="alert alert-danger p-3 mb-4 rounded-3" role="alert">
            <div className="d-flex align-items-center">
              <span className="fs-5 me-2">⚠️</span>
              <div>
                <h3 className="h6 fw-bold mb-1">Ошибка оформления заказа!</h3>
                <p className="small mb-0">
                  {globalErrorMsg || 'Пожалуйста, выберите хотя бы одну позицию меню и укажите контакты.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <form id="orderForm" onSubmit={handleSubmit}>
          {/* СЕКЦИЯ 1: ВЫБОР БЛЮД И НАПИТКОВ */}
          <fieldset className="border rounded-3 p-3 p-md-4 mb-4">
            <legend className="float-none w-auto px-2 fs-5 fw-bold text-primary">
              1. Соберите ваш заказ (Меню Global Coffee)
            </legend>

            <h2 className="h5 fw-bold mb-3 mt-2">Кофе и фирменные напитки</h2>
            <div className="row g-4 mb-4">
              {ORDER_ITEMS_CATALOG.map((item, index) => {
                const isSelected = !!cart[item.id];
                const currentQty = quantities[item.id] || 1;

                return (
                  <div key={item.id} className="col-12 col-md-6 col-lg-4">
                    <div className={`card h-100 shadow-sm border rounded-3 overflow-hidden bg-white ${isSelected ? 'selected' : ''}`}>
                      <img src={item.image} className="card-img-top card-product-img" alt={item.name} />
                      <div className="card-body d-flex flex-column p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h3 className="h6 fw-bold mb-0">{item.name}</h3>
                          <span className="badge bg-secondary">{formatPrice(item.price)}</span>
                        </div>
                        <p className="small text-muted mb-3 flex-grow-1">
                          {item.id === 'nut_flat_white' && 'Двойной эспрессо, бархатистое молоко и натуральный сироп из лесного ореха.'}
                          {item.id === 'frappe_cocoa' && 'Освежающий ледяной напиток со взбитыми сливками, какао и шоколадным топингом.'}
                          {item.id === 'ice_matcha_strawberry' && 'Натуральная японская матча с добавлением клубничного пюре и свежего молока.'}
                          {item.id === 'tea_orange_strawberry' && 'Согревающий натуральный чай с дольками сочного апельсина и клубникой.'}
                          {item.id === 'lemonade_sakura' && 'Игристый лимонад с экстрактом цветов сакуры, лаймом и ароматной мятой.'}
                          {item.id === 'smoothie_kiwi' && 'Густой витаминный смузи из спелого киви, яблока и измельченного льда.'}
                          {item.id === 'sandwich' && 'Сытный сэндвич на хрустящем хлебе с куриным филе, сыром и свежими овощами.'}
                          {item.id === 'hotdog' && 'Ароматный хот-дог с поджаренной сосиской, маринованными огурчиками и соусами.'}
                          {item.id === 'donuts' && 'Пышные нежные пончики с глазурью из настоящего молочного шоколада.'}
                          {item.id === 'onigiri' && 'Традиционный японский онигири с начинкой из слабосоленого лосося в водорослях нори.'}
                        </p>
                        <div className="pt-2 border-top mt-auto d-flex justify-content-between align-items-center">
                          <div className="form-check mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`item_${item.id}`}
                              name="order_items"
                              value={item.id}
                              checked={isSelected}
                              onChange={() => handleCheckboxToggle(item.id)}
                            />
                            <label htmlFor={`item_${item.id}`} className="form-check-label fw-semibold small cursor-pointer">
                              В заказ
                            </label>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <label htmlFor={`qty_${item.id}`} className="small text-muted">
                              Кол-во:
                            </label>
                            <input
                              type="number"
                              className="form-control form-control-sm text-center qty-input"
                              id={`qty_${item.id}`}
                              name={`qty_${item.id}`}
                              min={1}
                              max={10}
                              value={currentQty}
                              onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value, 10))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total box */}
            <div className="card bg-light border p-3 mb-4 rounded-3">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                <div>
                  <span className="fw-bold">Выбрано позиций:</span>
                  <span id="orderItemsCount" className="badge bg-secondary ms-1">
                    {totalItemsCount} шт.
                  </span>
                </div>
                <div id="orderTotalContainer">
                  <span className="fw-bold me-2">Итого к оплате:</span>
                  <span id="orderTotalPrice" className="fs-4 fw-bold text-primary">
                    {formatPrice(totalOrderPrice)}
                  </span>
                </div>
              </div>
              {totalItemsCount === 0 && (
                <div id="orderEmptyStateMsg" className="small text-muted fst-italic mt-2">
                  Корзина пуста: выберите хотя бы одно блюдо или напиток из меню выше.
                </div>
              )}
            </div>

            <div className="mb-2">
              <label htmlFor="special_instructions" className="form-label fw-semibold">
                Пожелания к заказу (например, «без сахара», «на кокосовом молоке»):
              </label>
              <textarea
                className="form-control"
                id="special_instructions"
                name="special_instructions"
                rows={3}
                placeholder="Укажите ваши индивидуальные предпочтения"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              ></textarea>
            </div>
          </fieldset>

          {/* СЕКЦИЯ 2: СПОСОБ ПОЛУЧЕНИЯ */}
          <fieldset className="border rounded-3 p-3 p-md-4 mb-4">
            <legend className="float-none w-auto px-2 fs-5 fw-bold text-primary">
              2. Способ получения заказа
            </legend>

            <div className="mb-3">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  id="delivery_home"
                  name="order_type"
                  value="home"
                  checked={deliveryType === 'home'}
                  onChange={() => setDeliveryType('home')}
                />
                <label className="form-check-label fw-bold" htmlFor="delivery_home">
                  Доставка на дом / в офис
                </label>
              </div>

              {deliveryType === 'home' && (
                <div className="ms-4 p-3 bg-light rounded-3 border mb-3">
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <label htmlFor="city" className="form-label fw-semibold">Город:</label>
                      <input type="text" className="form-control" id="city" name="city" value="Астана" readOnly />
                    </div>
                    <div className="col-12 col-md-8">
                      <label htmlFor="street" className="form-label fw-semibold">
                        Улица и номер дома <span className="text-danger">*</span>:
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.street ? 'is-invalid error' : ''}`}
                        id="street"
                        name="street"
                        placeholder="пр. Мангилик Ел, д. 55/1"
                        value={street}
                        onChange={(e) => {
                          setStreet(e.target.value);
                          clearFieldError('street');
                        }}
                        required
                      />
                      {errors.street && (
                        <div className="invalid-feedback d-block text-danger small mt-1">{errors.street}</div>
                      )}
                    </div>
                    <div className="col-12 col-md-6">
                      <label htmlFor="apartment" className="form-label fw-semibold">Квартира / Офис:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="apartment"
                        name="apartment"
                        placeholder="кв. 12"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label htmlFor="entrance" className="form-label fw-semibold">Подъезд / Этаж:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="entrance"
                        name="entrance"
                        placeholder="подъезд 1, этаж 3"
                        value={entrance}
                        onChange={(e) => setEntrance(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  id="delivery_onsite"
                  name="order_type"
                  value="onsite"
                  checked={deliveryType === 'onsite'}
                  onChange={() => setDeliveryType('onsite')}
                />
                <label className="form-check-label fw-bold" htmlFor="delivery_onsite">
                  Заказ в заведении (На месте)
                </label>
              </div>

              {deliveryType === 'onsite' && (
                <div className="ms-4 p-3 bg-light rounded-3 border">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="has_table_yes"
                      name="table_status"
                      value="yes"
                      checked={hasTable === 'yes'}
                      onChange={() => setHasTable('yes')}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="has_table_yes">
                      У меня уже забронирован стол
                    </label>
                  </div>

                  {hasTable === 'yes' && (
                    <div className="row g-3 ms-2 mb-3">
                      <div className="col-12 col-md-6">
                        <label htmlFor="table_number" className="form-label small fw-semibold">Номер забронированного стола:</label>
                        <select
                          className={`form-select form-select-sm ${errors.table_number ? 'is-invalid' : ''}`}
                          id="table_number"
                          name="table_number"
                          value={tableNumber}
                          onChange={(e) => {
                            setTableNumber(e.target.value);
                            clearFieldError('table_number');
                          }}
                        >
                          <option value="">-- Выберите номер стола --</option>
                          <option value="1">Стол 1 (2 места)</option>
                          <option value="2">Стол 2 (2 места)</option>
                          <option value="3">Стол 3 (4 места)</option>
                          <option value="4">Стол 4 (4 места)</option>
                          <option value="5">Стол 5 (6 мест)</option>
                          <option value="6">Стол 6 (4 места)</option>
                          <option value="7">Стол 7 (2 места)</option>
                          <option value="8">Стол 8 (4 места)</option>
                          <option value="9">Стол 9 (6 мест)</option>
                        </select>
                        {errors.table_number && (
                          <div className="invalid-feedback d-block text-danger small mt-1">{errors.table_number}</div>
                        )}
                      </div>
                      <div className="col-12 col-md-6">
                        <label htmlFor="booking_time" className="form-label small fw-semibold">Время бронирования:</label>
                        <select
                          className="form-select form-select-sm"
                          id="booking_time"
                          name="booking_time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                        >
                          <option value="">-- Выберите время --</option>
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                          <option value="17:00">17:00</option>
                          <option value="18:00">18:00</option>
                          <option value="19:00">19:00</option>
                          <option value="20:00">20:00</option>
                          <option value="21:00">21:00</option>
                          <option value="22:00">22:00</option>
                          <option value="23:00">23:00</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="has_table_no"
                      name="table_status"
                      value="no"
                      checked={hasTable === 'no'}
                      onChange={() => setHasTable('no')}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="has_table_no">
                      У меня нет забронированного стола
                    </label>
                  </div>
                  <p className="small text-muted ms-4 mt-1 mb-0">
                    Желаете забронировать столик заранее?{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none fw-semibold small"
                      onClick={() => onNavigate('booking')}
                    >
                      Перейти к схеме зала &rarr;
                    </button>
                  </p>
                </div>
              )}
            </div>
          </fieldset>

          {/* СЕКЦИЯ 3: КОНТАКТЫ И ОПЛАТА */}
          <fieldset className="border rounded-3 p-3 p-md-4 mb-4">
            <legend className="float-none w-auto px-2 fs-5 fw-bold text-primary">
              3. Контактные данные и способ оплаты
            </legend>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="customer_name" className="form-label fw-semibold">
                  Ваше имя <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.customer_name ? 'is-invalid error' : ''}`}
                  id="customer_name"
                  name="customer_name"
                  placeholder="Введите имя"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    clearFieldError('customer_name');
                  }}
                  required
                />
                {errors.customer_name && (
                  <div className="invalid-feedback d-block text-danger small mt-1">{errors.customer_name}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="customer_phone" className="form-label fw-semibold">
                  Номер телефона <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control ${errors.customer_phone ? 'is-invalid error' : ''}`}
                  id="customer_phone"
                  name="customer_phone"
                  placeholder="+7 777 000 00 00"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  onFocus={() => {
                    if (!customerPhone.trim()) setCustomerPhone('+7 (');
                  }}
                  onBlur={() => {
                    if (customerPhone.trim() === '+7 (' || customerPhone.trim() === '+7') setCustomerPhone('');
                  }}
                  required
                />
                {errors.customer_phone && (
                  <div className="invalid-feedback d-block text-danger small mt-1">{errors.customer_phone}</div>
                )}
              </div>

              <div className="col-12">
                <label htmlFor="payment_method" className="form-label fw-semibold">
                  Способ оплаты <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.payment_method ? 'is-invalid error' : ''}`}
                  id="payment_method"
                  name="payment_method"
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value);
                    clearFieldError('payment_method');
                  }}
                  required
                >
                  <option value="">-- Выберите способ оплаты --</option>
                  <option value="kaspi">Kaspi QR / Kaspi Pay (быстрый перевод)</option>
                  <option value="card">Банковской картой онлайн (Visa / Mastercard)</option>
                  <option value="cash">Наличными при получении курьеру / на кассе</option>
                </select>
                {errors.payment_method && (
                  <div className="invalid-feedback d-block text-danger small mt-1">{errors.payment_method}</div>
                )}
              </div>
            </div>
          </fieldset>

          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <button
              type="button"
              id="orderResetBtn"
              className="btn btn-outline-secondary"
              onClick={handleResetForm}
            >
              Сбросить форму
            </button>
            <button
              type="submit"
              id="orderSubmitBtn"
              className={`btn btn-primary btn-lg ${totalItemsCount === 0 ? 'disabled' : ''}`}
              disabled={totalItemsCount === 0}
            >
              Оформить и оплатить заказ &rarr;
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
