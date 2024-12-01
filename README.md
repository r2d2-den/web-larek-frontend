# Проектная работа "Веб-ларек"

**Стек технологий:** HTML, SCSS, TypeScript, Webpack

## Структура проекта

- `src/` — исходные файлы проекта
  - `src/components/base/` — папка с базовым кодом
  - `src/pages/` — папка с HTML файлами
  - `src/types/` — папка с файлами типов
  - `src/utils/` — папка с утилитами

### Важные файлы

- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/index.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

## Установка и запуск

Для установки и запуска проекта выполните следующие команды:

```sh
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и их типы, используемые в приложении.


### Продукты

- Интерфейс для продукта
```typescript
interface IProduct {
	id: string;             // Уникальный идентификатор продукта
	description: string;    // Описание продукта
	image: string;          // URL изображения продукта
	title: string;          // Название продукта
	category: string;       // Категория продукта
	price: number | null;   // Цена продукта (может быть null, если цена не установлена)
	indexElement: number;   // Индекс элемента в списке
}

```


### Корзина

 - Интерфейс для корзины покупок
```typescript
interface IBasket {
	items: string[];        // Массив идентификаторов товаров в корзине
	total: number;         // Общая стоимость товаров в корзине
}
```


### Заказ

- Интерфейс для заказа
```typescript
interface IOrder {
	payment: string;        // Метод оплаты (например, 'cash' или 'online')
	email: string;          // Email клиента
	phone: string;          // Телефон клиента
	address: string;        // Адрес доставки
	items: string[];        // Массив идентификаторов товаров в заказе
	total: number;         // Общая стоимость заказа
}

```

- Интерфейс для результата заказа
```typescript
interface IOrderResult {
	id: string;            // Уникальный идентификатор заказа
	total: number;         // Общая стоимость заказа
}
```

### Утилитарные типы


-  Перечисление возможных методов оплаты
```typescript
enum EnumDeliveryFormMethod {
	cash = 'cash',         // Оплата наличными
	online = 'online'      // Онлайн-оплата
}
``` 


-  Тип для информации о пользователе (объединение контактных и платежных данных)
```typescript
type OrderForm = Omit<IOrder, 'total' | 'items'>;
```


### Представления и действия

- Тип для действий, связанных с элементами интерфейса

```typescript
type TActions = {
	onClick?: () => void;  // Функция, вызываемая при клике на элемент
};
```

- Тип для методов запросов
```typescript
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

```

### Данные сервера

- Интерфейс для работы с данными сервера
```typescript
type IServerData = {
	/**
	 * Получение списка продуктов.
	 * @returns Промис с ответом, содержащим список продуктов.
	 */
	getProductList: () => Promise<ApiListResponse<IProduct>>;

	/**
	 * Отправка контактной информации.
	 * @param contactData - Данные контактной формы.
	 * @returns Промис с результатом размещения заказа.
	 */
	submitContactInfo: (contactData: OrderForm) => Promise<IOrderResult>;

	/**
	 * Размещение заказа.
	 * @param orderData - Данные заказа.
	 * @returns Промис с результатом размещения заказа.
	 */
	postOrder: (orderData: IOrder) => Promise<IOrderResult>;
};

```


## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:
- слой данных, отвечает за хранение и изменение данных;
- слой представления, отвечает за отображение данных на странице;
- слой коммуникации, отвечает за связь представления и данных.


![Диаграмма UML классов](https://github.com/r2d2-den/web-larek-frontend/blob/main/UML_web-larek%20(2).png)


<div style="display: flex; justify-content: space-between;">

<div style="flex: 1; margin-right: 20px;">

### Базовый код
---
- Класс Api
  - Обертка для выполнения HTTP-запросов к API.
- Класс Component
  - Абстрактный класс для всех компонентов, включая методы управления классами, текстом, изображениями и состоянием блокировки элементов.
- Класс EventEmitter
  - Реализация брокера событий с методами для подписки на события, их вызова и удаления обработчиков.
### Слой данных
---
- Класс ApplicationStatus
  - Управляет состоянием приложения, включая каталог товаров, корзину и данные заказа.
### Слой представления
---
- Класс ContactsInfoForm
  -Отвечает за форму ввода контактной информации. Наследуется от `Form<OrderForm>`, используя обобщение для работы с данными формы заказа.
  - **Расширяет:** `Form<OrderForm>`
- Класс MainPage
  -Отвечает за основную страницу приложения. Наследуется от `Component<ApiListResponse<IProduct>>`, используя обобщение для работы с данными списка продуктов.
  - **Расширяет:** `Component<ApiListResponse<IProduct>>`
- Класс PaymentDeliveryForm
  - Отвечает за форму выбора метода оплаты и ввода адреса доставки. Наследуется от `Form<OrderForm>`, используя обобщение для работы с данными формы заказа.
  - **Расширяет:** `Form<OrderForm>`
- Класс ProductCard
  - Отвечает за отображение карточки товара. Наследуется от `Component<IProduct>`, используя обобщение для работы с данными продукта.
  - **Расширяет:** `Component<IProduct>`
- Класс ShoppingBasket
  - Отвечает за отображение корзины покупок, включая список товаров, общую сумму и кнопку оформления заказа. Наследуется от `Component<IBasket>`, используя обобщение для работы с данными корзины.
  - **Расширяет:** `Component<IBasket>`
- Класс SuccessOrderPlace
  - Отвечает за отображение сообщения о успешном размещении заказа, включая описание успешного заказа и кнопку для закрытия сообщения. Наследуется от `Component<IOrderResult>`, используя обобщение для работы с результатами заказа.
  - **Расширяет:** `Component<IOrderResult>`
### Слой коммуникации
---
- Класс ServerData
  - Отвечает за взаимодействие с сервером, включая получение списка продуктов, отправку контактной информации и размещение заказа. Наследуется от `Api`, реализует интерфейс `IServerData`.
  - **Расширяет:** `Api`
  - **Реализует интерфейс:** `IServerData`
### Взаимодействие компонентов
---
- Класс Presenter
  - Обрабатывает логику приложения, связывая API, события и представление. Управляет состоянием приложения и взаимодействием между компонентами.

</div>

<div style="flex: 1; margin-left: 20px;">

### Подробное описание классов
---

- [Базовый код](#базовый-код)
  - [Api](#подробное-описание-класса-api)
  - [Component](#подробное-описание-класса-component)
  - [EventEmitter](#подробное-описание-класса-eventemitter)
- [Слой данных](#слой-данных)
  - [ApplicationStatus](#подробное-описание-класса-applicationstatus)
- [Слой представления](#слой-представления)
  - [ContactsInfoForm](#подробное-описание-класса-contactsinfoform)
  - [MainPage](#подробное-описание-класса-mainpage)
  - [PaymentDeliveryForm](#подробное-описание-класса-paymentdeliveryform)
  - [ProductCard](#подробное-описание-класса-productcard)
  - [ShoppingBasket](#подробное-описание-класса-shoppingbasket)
  - [SuccessOrderPlace](#подробное-описание-класса-successorderplace)
- [Слой коммуникации](#слой-коммуникации)
  - [ServerData](#подробное-описание-класса-serverdata)
- [Взаимодействие компонентов](#взаимодействие-компонентов)
  - [Presenter](#подробное-описание-класса-presenter)






  ### Список всех событий, которые могут генерироваться в системе 
---

Проект использует различные события для управления состоянием приложения и взаимодействием с пользователем. Вот список всех событий, которые обрабатываются в классе `Presenter`:
- `items:changed` Событие вызывается при изменении списка продуктов.
- `card:select` Событие вызывается при выборе карточки продукта.
- `card:add` Событие вызывается при добавлении продукта в корзину.
- `card:remove` Событие вызывается при удалении продукта из корзины.
- `basket:open` Событие вызывается при открытии корзины.
- `basket:changed` Событие вызывается при изменении содержимого корзины.
- `order:open` Событие вызывается при открытии формы заказа.
- `order:submit` Событие вызывается при отправке формы заказа.
- `formErrors:change` Событие вызывается при изменении ошибок формы.
- `contacts:submit` Событие вызывается при отправке контактной информации.
- `order:complete` Событие вызывается при успешном завершении заказа.
- `success:finish` Событие вызывается при завершении отображения успешного заказа.
- `modal:open` Событие вызывается при открытии модального окна.
- `modal:close` Событие вызывается при закрытии модального окна.
- `^(order|contacts)\..*:change` Регулярное выражение для обработки изменений полей формы в заказе или контактной информации.
- `payment:select` Событие вызывается при изменении способа оплаты.

</div>

</div>




### Подробное описание классов
---
### Базовый код
---
### Подробное описание класса Api

**Поля класса**
- `readonly baseUrl: string`: Базовый URL.
- `protected options: RequestInit`: Опции запросов.

**Конструктор**
- `constructor(baseUrl: string, options: RequestInit = {})`: Инициализация.

**Методы**
- `handleResponse(response: Response): Promise<object>`: Обрабатывает ответ.
- `get(uri: string): Promise<object>`: Выполняет GET-запрос.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>`: Выполняет POST-запрос.

### Подробное описание класса Component

**Поля класса**
- `protected readonly container: HTMLElement`: Корневой элемент.

**Конструктор**
- `protected constructor(container: HTMLElement)`: Инициализация.

**Методы**
- `toggleClass(element: HTMLElement, className: string, force?: boolean)`: Переключает класс.
- `setText(element: HTMLElement, value: unknown)`: Устанавливает текст.
- `setImage(element: HTMLImageElement, src: string, alt?: string)`: Устанавливает изображение.
- `setDisabled(element: HTMLElement, state: boolean)`: Изменяет состояние блокировки.
- `render(data?: Partial<T>): HTMLElement`: Рендерит компонент.

### Подробное описание класса EventEmitter

**Поля класса**
- `_events: Map<EventName, Set<Subscriber>>`: События и обработчики.

**Конструктор**
- `constructor()`: Инициализация.

**Методы**
- `on<T extends object>(eventName: EventName, callback: (data: T) => void)`: Подписка на событие.
- `off(eventName: EventName, callback: Subscriber)`: Отписка от события.
- `emit<T extends object>(eventName: string, data?: T)`: Инициирует событие.
- `onAll(callback: (event: EmitterEvent) => void)`: Подписка на все события.
- `offAll()`: Удаляет все обработчики.
- `trigger<T extends object>(eventName: string, context?: Partial<T>)`: Создает триггер события.


### Слой данных
---
### Подробное описание класса ApplicationStatus

**Поля класса**
- `catalog: IProduct[]`: Массив товаров.
- `basket: IProduct[]`: Товары в корзине.
- `order: Omit<IOrder, 'items' | 'total'>`: Данные заказа.
- `orderErrors: Partial<Record<'payment' | 'address', string>>`: Ошибки заказа.
- `contactErrors: Partial<Record<'email' | 'phone', string>>`: Ошибки контактов.
- `preview: IProduct | null`: Предварительный просмотр товара.
- `isOrderValid: boolean`: Валидация заказа.

**Конструктор**
- `constructor(data: Partial<OrderForm>, protected events: IEvents)`: Инициализация.

**Методы**
- `setProductList(items: IProduct[])`: Устанавливает список товаров.
- `addToBasket(item: IProduct)`: Добавляет товар в корзину.
- `deleteFromBasket(item: IProduct)`: Удаляет товар из корзины.
- `isInBasket(item: IProduct)`: Проверяет наличие товара в корзине.
- `getBasketId()`: Возвращает ID товаров в корзине.
- `getNumberBasket()`: Возвращает количество товаров в корзине.
- `getTotalBasket()`: Возвращает общую стоимость товаров в корзине.
- `cleanBasket()`: Очищает корзину.
- `setField<K extends keyof OrderForm>(field: K, value: OrderForm[K])`: Устанавливает значение поля заказа.
- `validateOrder()`: Валидация заказа.
- `setPreview(item: IProduct)`: Устанавливает товар для предварительного просмотра.
- `emitChanges(event: string, payload: object = {})`: Вызывает событие.

### Слой представления
---

### Подробное описание класса ContactsInfoForm

**Поля класса**
- `private _email: HTMLInputElement`: Поле ввода для электронной почты.
- `private _phone: HTMLInputElement`: Поле ввода для телефона.

**Конструктор**
- `constructor(container: HTMLFormElement, events: IEvents)`: Инициализирует объект `ContactsInfoForm` с HTML элементом формы и экземпляром `IEvents` для обработки событий.
  - `container`: HTML элемент формы, в который будет встроена форма контактной информации.
  - `events`: Экземпляр `IEvents` для обработки событий формы.

**Методы**
- `set email(value: string)`: Устанавливает значение для поля электронной почты.
  - `value`: Новое значение для email.

- `set phone(value: string)`: Устанавливает значение для поля телефона.
  - `value`: Новое значение для phone.

- `setErrors(errors: string)`: Устанавливает ошибки для формы.
  - `errors`: Текст ошибок, который нужно отобразить.



### Подробное описание класса MainPage

**Поля класса**
- `protected _counter: HTMLElement`: HTML элемент для отображения счетчика корзины.
- `protected _catalog: HTMLElement`: HTML элемент для отображения каталога продуктов.
- `protected _wrapper: HTMLElement`: HTML элемент обертки страницы.
- `protected _basket: HTMLButtonElement`: Кнопка корзины.

**Конструктор**
- `constructor(container: HTMLElement, private events: IEvents)`: Инициализирует объект `MainPage` с HTML элементом страницы и экземпляром `IEvents` для обработки событий.
  - `container`: HTML элемент, содержащий главную страницу.
  - `events`: Экземпляр `IEvents` для обработки событий.

**Методы**
- `set counter(value: number)`: Устанавливает значение счетчика корзины.
  - `value`: Новое значение счетчика.

- `set catalog(items: HTMLElement[])`: Обновляет каталог с продуктами.
  - `items`: Массив HTML элементов для отображения в каталоге.

- `set locked(value: boolean)`: Заблокировать или разблокировать страницу.
  - `value`: `true` для блокировки, `false` для разблокировки.




### Подробное описание класса PaymentDeliveryForm

**Поля класса**
- `private _paymentCard: HTMLButtonElement`: Кнопка выбора оплаты картой.
- `private _paymentCash: HTMLButtonElement`: Кнопка выбора оплаты наличными.
- `private _address: HTMLInputElement`: Поле ввода адреса доставки.

**Конструктор**
- `constructor(container: HTMLFormElement, events: IEvents)`: Инициализирует объект `PaymentDeliveryForm` с HTML элементом формы и экземпляром `IEvents` для обработки событий.
  - `container`: HTML элемент формы.
  - `events`: Экземпляр `IEvents` для обработки событий.

**Методы**
- `set payment(value: string)`: Устанавливает выбранный метод оплаты и обновляет состояние кнопок.
  - `value`: Значение выбранного метода оплаты (`'card'` или `'cash'`).

- `set address(value: string)`: Устанавливает значение адреса в поле ввода.
  - `value`: Адрес доставки.

 

### Подробное описание класса ProductCard

**Поля класса**
- `public indexElement?: HTMLElement`: Элемент, отображающий индекс товара.
- `private descriptionElement?: HTMLElement`: Элемент для описания товара.
- `private imageElement?: HTMLImageElement`: Элемент для изображения товара.
- `private titleElement: HTMLElement`: Элемент для заголовка товара.
- `private categoryElement?: HTMLElement`: Элемент для категории товара.
- `private priceElement: HTMLElement`: Элемент для цены товара.
- `private buttonElement?: HTMLButtonElement`: Кнопка для действий с товаром.

**Конструктор**
- `constructor(container: HTMLElement, actions?: TActions)`: Инициализирует объект `ProductCard` с HTML элементом и необязательными действиями.
  - `container`: HTML элемент, содержащий карточку товара.
  - `actions`: Объект с действиями, включая обработчик кликов.

**Методы**
- `public updateProductCard(product: IProduct, isInBasket: boolean)`: Обновляет данные карточки товара.
  - `product`: Данные о продукте.
  - `isInBasket`: Признак нахождения товара в корзине.

- `private set id(value: string)`: Устанавливает ID товара в `data-id` атрибут контейнера.

- `private set description(value: string)`: Устанавливает описание товара.

- `private set image(value: string)`: Устанавливает изображение товара.

- `private set title(value: string)`: Устанавливает заголовок товара.

- `private set category(value: string)`: Устанавливает категорию товара и обновляет соответствующий CSS класс.

- `private set price(value: number | null)`: Устанавливает цену товара и обновляет состояние кнопки.

- `public set inBasket(isInBasket: boolean)`: Устанавливает состояние кнопки в корзине.
  - `isInBasket`: Признак нахождения товара в корзине.

- `public set index(value: number)`: Устанавливает индекс товара.
  - `value`: Индекс товара.



### Подробное описание класса ShoppingBasket

**Поля класса**
- `static template: HTMLTemplateElement`: Статический шаблон для корзины.
- `protected _list: HTMLElement`: Список элементов корзины.
- `protected _total: HTMLElement`: Элемент для отображения общей суммы.
- `protected _button: HTMLButtonElement`: Кнопка для оформления заказа.

**Конструктор**
- `constructor(container: HTMLElement, protected events: IEvents)`: Инициализирует объект `ShoppingBasket` с HTML элементом и обработчиком событий.
  - `container`: HTML элемент, содержащий корзину.
  - `events`: Экземпляр `IEvents` для обработки событий.

**Методы**
- `private toggleButton(state: boolean)`: Переключает состояние кнопки (активна/неактивна).
  - `state`: Состояние кнопки (`true` - активна, `false` - неактивна).

- `set items(items: HTMLElement[])`: Устанавливает элементы корзины.
  - `items`: Массив HTML элементов для отображения в корзине.

- `set total(total: number)`: Устанавливает общую сумму в корзине.
  - `total`: Общая сумма.




### Подробное описание класса SuccessOrderPlace

**Поля класса**
- `private closeButtonElement: HTMLButtonElement`: Элемент кнопки для закрытия сообщения о успешном заказе.
- `private descriptionElement: HTMLElement`: Элемент для отображения описания успешного заказа.

**Конструктор**
- `constructor(container: HTMLElement, events: IEvents)`: Инициализирует объект `SuccessOrderPlace` с HTML элементом и обработчиком событий.
  - `container`: HTML элемент, содержащий сообщение о успешном заказе.
  - `events`: Экземпляр `IEvents` для обработки событий.

**Методы**
- `set total(value: number)`: Устанавливает общее значение заказа в элементе описания.
  - `value`: Сумма, списанная с аккаунта пользователя.



### Слой коммуникации
---
### Подробное описание класса ServerData

**Поля класса**
- `private cdn: string`: URL для загрузки изображений.
- `private apiUrl: string`: Базовый URL API.

**Конструктор**
- `constructor(cdn: string, baseUrl: string, options: RequestInit = {})`: Инициализирует объект `ServerData` с URL для загрузки изображений и базовым URL API.
  - `cdn`: URL для загрузки изображений.
  - `baseUrl`: Базовый URL API.
  - `options`: Дополнительные опции для запросов (например, заголовки, методы и т.д.).

**Методы**
- `getProductList(): Promise<ApiListResponse<IProduct>>`: Получает список продуктов с сервера.
  - Возвращает промис с объектом, содержащим общее количество продуктов и список продуктов с префиксом CDN к пути изображения.

- `submitContactInfo(contactData: OrderForm): Promise<IOrderResult>`: Отправляет контактную информацию на сервер.
  - `contactData`: Объект с контактной информацией.
  - Возвращает промис с результатом отправки контактной информации.

- `postOrder(orderData: IOrder): Promise<IOrderResult>`: Размещает заказ на сервере.
  - `orderData`: Объект с данными заказа.
  - Возвращает промис с результатом размещения заказа.


### Взаимодействие компонентов
---
### Подробное описание класса Presenter

**Поля класса**
- `private api: ServerData`: Экземпляр класса для работы с API.
- `private events: EventEmitter`: Объект для управления событиями.
- `private appState: ApplicationStatus`: Объект для управления состоянием приложения.
- `private page: MainPage`: Объект для управления основной страницей.
- `private modal: Modal`: Объект для работы с модальными окнами.
- `private basket: ShoppingBasket`: Объект для управления корзиной.
- `private contacts: ContactsInfoForm`: Объект для работы с формой контактной информации.
- `private order: PaymentDeliveryForm`: Объект для работы с формой заказа.
- `private success: SuccessOrderPlace`: Объект для отображения успешного завершения заказа.

**Конструктор**
- `constructor(api: ServerData, events: EventEmitter, appState: ApplicationStatus, page: MainPage, modal: Modal, basket: ShoppingBasket, contacts: ContactsInfoForm, order: PaymentDeliveryForm, success: SuccessOrderPlace)`: Инициализирует `Presenter` с необходимыми зависимостями.

**Методы**
- `public init()`: Инициализирует загрузку списка продуктов и настройку обработчиков событий.
- `private setupEventListeners()`: Настраивает обработчики событий для различных событий приложения.
- `private async loadProductList()`: Загружает список продуктов с сервера и обновляет состояние приложения.
- `private onPaymentSelect(data: { paymentMethod: string })`: Обрабатывает выбор метода оплаты и обновляет состояние приложения.
- `private onItemsChanged()`: Обновляет список продуктов на странице.
- `private onCardSelect(item: IProduct)`: Обрабатывает выбор карточки продукта и отображает подробности в модальном окне.
- `private onCardAdd(item: IProduct)`: Добавляет продукт в корзину.
- `private onCardRemove(item: IProduct)`: Удаляет продукт из корзины.
- `private onBasketOpen()`: Отображает корзину в модальном окне.
- `private onBasketChanged()`: Обновляет отображение корзины при изменении.
- `private validateAndRender(component: any)`: Валидирует форму и отображает компонент в модальном окне.
- `private onOrderOpen()`: Открывает форму заказа и отображает в модальном окне.
- `private onOrderSubmit()`: Открывает форму контактной информации и отображает в модальном окне.
- `private onFormErrorsChange(errors: { orderErrors: OrderForm; contactErrors: OrderForm })`: Обрабатывает изменения ошибок формы и обновляет состояние.
- `private formatErrors(errors: OrderForm): string`: Форматирует ошибки в виде строки.
- `private async onContactsSubmit()`: Отправляет заказ на сервер и обрабатывает результат.
- `private onOrderComplete(res: IOrderResult)`: Отображает успешное завершение заказа в модальном окне.
- `private onSuccessFinish()`: Закрывает модальное окно после успешного завершения заказа.
- `private onModalOpen()`: Блокирует основную страницу при открытии модального окна.
- `private onModalClose()`: Разблокирует основную страницу при закрытии модального окна.
- `private onFieldChange(data: { field: keyof OrderForm; value: string })`: Обновляет поле заказа в состоянии приложения.
