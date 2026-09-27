# Отчёт по очистке CSS (CSS Cleanup & Bootstrap Migration)

В соответствии с правилом задания **«Bootstrap builds, your CSS corrects»**, вся ручная верстка, сетки, позиционирование, адаптивные медиа-запросы и базовые стили компонентов были удалены из собственного файла `css/base.css` и полностью переведены на нативные классы Bootstrap 5.3.3.

Собственный файл `css/base.css` был сокращен с **645 строк до 71 строки** (значительно меньше установленного лимита в 100 строк) и содержит исключительно брендовую цветовую палитру (эспрессо, корица, сливочный), фирменные шрифты (`Playfair Display`, `Inter`) и минимальные правила стилизации без использования `!important` и ручных сеток.

---

## Таблица замен: удаленные правила CSS и их аналоги в Bootstrap 5

| Удалённое правило CSS из Assignment 2 | Назначение / Причина удаления | Класс Bootstrap 5, заменивший правило |
|---|---|---|
| `display: flex; flex-wrap: wrap; justify-content: center; gap: 0.8rem;` в `.main-nav .nav-list` | Ручная навигационная панель | `navbar`, `navbar-expand-lg`, `navbar-nav`, `d-flex`, `gap-2` |
| `.main-nav .nav-link` (паддинги, радиус, ховер с трансформацией) | Ручные кнопки навигации | `nav-link`, `px-3`, `py-2` |
| `@media (max-width: 600px)` (скрытие/перестроение меню) | Ручные медиа-запросы для мобильных устройств | `navbar-toggler`, `collapse navbar-collapse`, `d-lg-none`, `d-md-block` |
| `.page-content { max-width: 900px; width: 90%; margin: 2.5rem auto; }` | Ручной центрирующий контейнер | `container py-4`, `container-fluid px-3 px-lg-4` |
| `.content-section { background: #fff; padding: 2rem; border-radius: 12px; box-shadow: ...; border: 1px solid ...; }` | Ручная карточка секции контента | `card shadow-sm border rounded-3 p-4 mb-4` |
| `table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }` | Ручные стили таблиц | `table`, `table-hover`, `table-striped`, `table-bordered` |
| `overflow-x: auto` в `@media (max-width: 600px)` для таблиц | Ручная прокрутка таблиц на смартфонах | `table-responsive` |
| `button, input[type="submit"] { background: var(--accent); padding: ...; border-radius: ...; }` | Ручные кнопки и ховеры | `btn`, `btn-primary`, `btn-outline-primary`, `btn-sm`, `btn-lg`, `disabled` |
| `input, select, textarea { width: 100%; padding: ...; border: 1px solid ...; }` | Ручное оформление полей ввода | `form-control`, `form-select`, `form-label`, `form-check-input` |
| `fieldset { border: 1px solid ...; padding: 1.5rem; margin-bottom: ...; }` | Оформление групп форм | `card p-4 mb-4`, `border rounded-3` |
| `h1, h2, h3 { font-size: ...; margin-bottom: ...; }` | Ручные размеры заголовков | `display-4`, `display-5`, `display-6`, `h2`, `h3`, `fw-bold` |
| `p.lead, font-size: 1.15rem, line-height: 1.8` | Акцентный вводный текст | `lead`, `text-secondary` |
| `text-align: center`, `text-align: left` | Ручное выравнивание текста | `text-center`, `text-md-start`, `text-end` |
| `margin: 1rem 0`, `padding: 2rem` | Ручные отступы между секциями и текстом | `mb-3`, `mb-4`, `my-4`, `py-3`, `py-5`, `p-3`, `p-4` |
| `display: flex; justify-content: space-between; align-items: center;` | Ручные флексбокс контейнеры | `d-flex`, `justify-content-between`, `align-items-center` |
| Ручная сетка каталога и карточек (`float` / `display: grid; grid-template-columns: repeat(...)`) | Ручная адаптивная сетка карточек | `row g-3 g-md-4`, `col-12 col-md-6 col-lg-4` |
| `border-radius: 6px; border-radius: 12px;` | Ручные скругления углов | `rounded`, `rounded-3`, `rounded-pill` |
| `color: #6B5344; font-size: 0.9rem;` | Ручное оформление второстепенного текста | `text-muted`, `small` |
| Ручные плашки и теги статуса | Ручные бейджи | `badge bg-success`, `badge bg-warning text-dark`, `badge bg-secondary` |

---

## Итоговый статус собственного файла CSS
- **Размер**: 71 строка (норматив: «well under a hundred lines of your own CSS in the whole project»).
- **Специфика**: исключительно CSS-переменные фирменных оттенков кофейни, шрифты `Playfair Display` и `Inter`, а также деликатные коррекции цветов для кнопок Bootstrap под коричный оттенок бренда.
- **Чистота**: 0 правил `!important`, 0 инлайн-стилей `style=""`, 0 конфликтов с сеткой Bootstrap.
