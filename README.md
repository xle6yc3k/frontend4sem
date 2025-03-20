# 🛍️ Angular MyShop — интернет-магазин с корзиной, тёмной темой и SSR

Интерактивное одностраничное приложение на **Angular 17** с фичами:

• 🛒 Корзина с хранением в `localStorage`  
• 🌗 Переключение светлая / тёмная тема  
• 🎨 Стиль glassmorphism с градиентами  
• 📱 Полностью адаптивный интерфейс  
• ⚡ Быстрая работа + SSR

---

## 🚀 Стек технологий

- Angular 17 (standalone components)
- Angular Material
- RxJS + BehaviorSubject (управление состоянием)
- Angular SSR (серверный рендеринг)
- JSON-server для фейкового API

---

## 📦 Возможности

- Каталог с фильтрами, поиском и сортировкой
- Корзина с количеством, удалением, общей суммой
- Хранение корзины в `localStorage` с восстановлением
- Светлая и тёмная темы (сохраняется автоматически)
- Анимации появления карточек и корзины
- Современный UI: градиенты, blur, адаптивность

---

## 🔧 Установка

1. Клонируй репозиторий  
`git clone <url> && cd my-shop`

2. Установи зависимости  
`npm install`

3. Запусти API сервер  
`npx json-server --watch public/data.json --port 3001`

4. Запусти Angular приложение  
`npm run dev`

(или `ng serve` при классической CLI-сборке)

---

## 📁 Структура проекта

- `src/app/api/` — сервисы для продуктов, корзины, темы
- `src/app/components/` — UI-компоненты (карточки, фильтры, корзина)
- `src/app/pages/home/` — основная страница
- `styles.scss` — переменные тем и глобальные стили
- `app.config.ts` — конфигурация провайдеров

---

## 🧠 Архитектура

- **Управление состоянием**: через сервисы с `BehaviorSubject` (альтернатива NgRx)
- **SSR**: совместимость обеспечивается через `isPlatformBrowser`
- **Темизация**: кастомные CSS-переменные
- **Хранилище**: `localStorage` с защитой от SSR

---

## 📱 Адаптивность

На десктопе: карточки слева, корзина справа  
На планшете: карточки в 2 колонки, корзина снизу  
На телефоне: карточки по 1, корзина под ними

---

## 💎 Стиль

Используется стиль **glassmorphism**:  
— полупрозрачные карточки с blur  
— градиентная рамка (розово-голубой)  
— адаптивный `mat-toolbar` с темной/светлой кнопкой

---

## 📸 Скриншоты

_(Добавь сюда свои красивые скриншоты — с темой, карточками и корзиной)_

---

## 🧪 Планы на будущее

- Добавить оформление заказа
- Сохранение избранных товаров
- Прелоадеры / shimmer на загрузку
- Lazy loading и разбиение по модулям

---

## ✨ Автор

Проект реализован в рамках практических заданий по фронтенду  
Автор: @rudnitskiiag

---

# MyShop

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
