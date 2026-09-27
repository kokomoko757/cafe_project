# Report: Assignment 1 — HTML Basics

**Project:** Global Coffee Website  
**Team Members:**

- Tazhmaganbetov Yeraidyn (SE-2533)
- Ibraev Tamerlan (SE-2533)
- Bolatuly Assylzhan (SE-2533)

---

## Task A — Anatomy of a Real Website (15 points)

### 1. Website analyzed and technical meta tags

- **Website analyzed:** Starbucks (`starbucks.com`)
- **DOCTYPE:** `<!DOCTYPE html>`
- **Language attribute:** `lang="en"`
- **Character encoding:** `<meta charset="UTF-8">`
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- **Title:** `<title>Starbucks — The Best Coffee and Espresso Drinks</title>`
- **Three additional meta tags:**
  1. `<meta name="description" content="Order coffee online, find store locations, and explore our coffee menu.">`
  2. `<meta name="author" content="Starbucks Coffee Company">`
  3. `<meta property="og:title" content="Starbucks Coffee Company">`

### 2. Use of structural elements on the third-party website

- **Semantic tags:** `<header>` is used for the page header with the logo, `<nav>` for the main navigation menu, `<main>` for promotional content, and `<footer>` for legal information and social media links.
- **The `<div>` tag:** It is used as an internal wrapper for CSS Flexbox/Grid layouts, product-card alignment, and dropdown menus.
- **Forms (`<form>`):** They are used in the Store Locator section, with an `<input type="search">` field and a submit button.
- **Tables (`<table>`):** They are used in the Nutritional Information sections to display calorie and protein values.

### 3. In images

### 4. Three structural issues on the third-party website and how we addressed them in our project

1. **Excessive nesting of containers ("div soup"):** On the third-party website, content is wrapped in 5–7 nested `<div>` elements. In our project, we use semantic blocks such as `<section>`, `<article>`, and `<aside>` instead of neutral `<div>` containers [cite: 5, 7, 10].
2. **No relationship between images and captions:** Product photographs are inserted as standalone `<img>` tags without a logical container. In `index.html` and `menu.html`, we connect illustrations with their text using `<figure>` and `<figcaption>` [cite: 6, 10].
3. **Incorrect heading hierarchy:** The third-party website contains several `<h1>` tags on one page. In our project, every page has exactly one `<h1>` in the `<header>`, followed by `<h2>` and `<h3>` subheadings [cite: 5, 6, 7, 8, 9, 10].

---

## Task B — Written Part (10 points)

### 1. What a web page consists of and how a browser renders HTML

A web page consists of three fundamental components: HTML provides the semantic framework and textual content structure, CSS controls visual styling, responsiveness, and layout, while JavaScript provides interactivity and handles user events.

The browser renders an HTML file in the following sequence:

1. **HTML parsing and DOM creation:** The browser decodes the file bytes and builds a tree-like document model called the DOM (Document Object Model).
2. **CSSOM construction:** At the same time, CSS rules are loaded and processed to form the CSSOM (CSS Object Model).
3. **Render tree creation:** The DOM and CSSOM are combined into a render tree that excludes hidden elements, such as elements with `display: none`.
4. **Layout (reflow):** The browser calculates the geometry, exact dimensions, and positions of all visible blocks on the screen.
5. **Painting:** The rendering engine converts the calculated blocks into physical pixels, drawing backgrounds, borders, and text.
6. **Compositing:** Separate layers are combined into the final image and displayed on the screen.

### 2. Three examples of choosing semantic tags instead of `<div>` in the project

1. **The `<header>` tag instead of `<div class="header">`**
   - **Location:** `booking.html` (line 11) [cite: 8], `colophon.html` (line 12) [cite: 9].
   - **Reason:** The `<header>` tag clearly tells browsers, search engines, and screen readers that it contains the page's introductory information and the website's main navigation menu, unlike a neutral `<div>`.

2. **The `<main>` tag instead of `<div class="content">`**
   - **Location:** `index.html` (line 30) [cite: 10], `location.html` (line 22) [cite: 5].
   - **Reason:** The `<main>` tag identifies the page's unique central content and excludes repeated headers and footers. This allows assistive technologies, such as screen readers, to jump directly to the main meaningful content.

3. **The `<article>` tag instead of `<div class="review-box">`**
   - **Location:** `reviews.html` (line 25) [cite: 7], `index.html` (line 33) [cite: 10].
   - **Reason:** The `<article>` tag wraps a self-contained and complete piece of information, such as a customer review or the coffee shop's philosophy, which remains meaningful even outside the rest of the page context.

### 3. What happens when the form submit button is pressed at the current stage

The `booking.html` file contains a table-reservation `<form>` [cite: 8].

1. **Built-in HTML validation:** When the user clicks `<button type="submit">`, the browser automatically checks fields with the `required`, `type="email"`, and `type="tel"` attributes [cite: 8]. If a field is empty or contains an invalid value, the browser blocks submission and shows a warning.
2. **HTTP request creation:** If all data is valid, the browser collects the values of the `input`, `textarea`, and `select` fields that have a `name` attribute into `key=value` pairs [cite: 8].
3. **Page reload (default action):** Because no backend server is connected to process the data, the browser submits the form to the address specified in `action` or to the current page by default, using the `GET` method [cite: 8]. The submitted parameters appear in the address bar, the page reloads, and the form is reset.

