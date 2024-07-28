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
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}
```


 - Интерфейс для ответа от сервера, содержащего список продуктов
```typescript
 interface IProductResponse {
	total: number;
	items: IProduct[];
}
```


### Корзина

 - Интерфейс для корзины покупок
```typescript
interface IBasket {
	items: string[];
	total: number;
}
```


### Заказ

- Интерфейс для заказа
```typescript
interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}
```


- Расширенный интерфейс для заказа с дополнительными полями валидации
```typescript
interface IOrderModel extends IOrder {
	valid: boolean;
	errors: IFormError[];
	contactInfo: TUserInfo | undefined;
}
```


- Интерфейс для результата заказа
```typescript
interface IOrderResult {
	id: string;
	total: number;
}
```


### Утилитарные типы

-  Тип для формы заказа (только payment и address)
```typescript
type TOrderForm = Pick<IOrder, 'payment' | 'address'>
```


-  Тип для формы контактов (только email и phone)
```typescript
type TContactsForm = Pick<IOrder, 'email' | 'phone'>
``` 


-  Тип для информации о пользователе (объединение контактных и платежных данных)
```typescript
type TUserInfo = Pick<IOrder, 'email' | 'phone' | 'address' | 'payment'>
```



### Ошибки форм

-  Интерфейс для ошибок формы
```typescript
interface IFormError {
	field: string;
	message: string;
	address?: string;
	email?: string;
	phone?: string;
	payment?: string;
}
```


### Информация о приложении

- Тип для информации о состоянии приложения

```typescript
type IAppInfo = {
	catalog: IProduct[];
	basket: IBasket;
	order: Partial<TUserInfo>;
	formError: Partial<IFormError>;
}
```

### Представления и действия

- Тип для действий с продуктом

```typescript
type TProductActions = {
	onClick: (event: MouseEvent) => void
}
```

- Тип для главной страницы
```typescript
type TMainPage = {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
```

- Тип для представления корзины
```typescript
type TBasketView = {
	items: HTMLElement[];
	total: number;
}
```

- Тип для действий после успешного выполнения заказа
```typescript
type TSuccessActions = {
	onClick?: () => void;
}
```

### Данные сервера

- Типы для данных, получаемых от сервера
```typescript
type IServerData = {
	getProductList: () => Promise<IProductResponse>;
	submitContactInfo: (contactData: TUserInfo) => Promise<IOrderResult>;
	postOrder: (orderData: IOrder) => Promise<IOrderResult>;
}
```


## Архитектура приложения


Код приложения разделен на слои согласно парадигме MVP:
- слой данных, отвечает за хранение и изменение данных;
- слой представления, отвечает за отображение данных на странице;
- слой коммуникации, отвечает за связь представления и данных.


![Диаграмма UML классов](https://github.com/r2d2-den/web-larek-frontend/blob/main/class_diagram.png)


### Расширения классов
---
#### Form
- Наследует от: `Component<IOrder>` 

#### Modal
- Наследует от: `Component<HTMLElement>` 

#### ServerData
- Наследует от: `Api` 

#### ShoppingBasket
- Наследует от: `Component<HTMLElement>` 

#### PaymentDeliveryForm
- Наследует от: `Form` 

#### ContactsInfoForm
- Наследует от: `Form` 

#### SuccessOrderPlace
- Наследует от: `Component<HTMLElement>` 



### Базовый код
---
### Класс `Api`
Класс `Api` представляет собой обертку для выполнения HTTP-запросов к API.

#### Конструктор
- `constructor(baseUrl: string, options: RequestInit = {})` принимает базовый URL для API и опционально объект с настройками запроса:
  - `baseUrl` — базовый URL для всех запросов.
  - `options` — настройки запроса, включающие заголовки по умолчанию.

#### Методы
- `protected handleResponse(response: Response): Promise<object>` обрабатывает ответ от сервера. Если ответ успешный (`ok`), возвращает распарсенный JSON. В случае ошибки, возвращает `Promise.reject` с сообщением об ошибке.
- `get(uri: string)` выполняет GET запрос по указанному URI.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` выполняет POST, PUT или DELETE запрос с указанными данными.
  - `uri` — строка с URI для запроса.
  - `data` — объект с данными для отправки в теле запроса.
  - `method` — метод для выполнения запроса, по умолчанию `'POST'`.

### Класс `EventEmitter`
Класс `EventEmitter` представляет собой классическую реализацию брокера событий.

#### Конструктор
- `constructor()` инициализирует объект EventEmitter, создавая пустую карту `_events` для хранения событий и их подписчиков.

#### Поля
- `_events: Map<EventName, Set<Subscriber>>` карта, где ключами являются имена событий, а значениями - множества подписчиков на эти события.

#### Методы
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` устанавливает обработчик на событие.
  - `eventName`: имя события.
  - `callback`: функция-обработчик события.
- `off(eventName: EventName, callback: Subscriber)` снимает обработчик с события.
  - `eventName`: имя события.
  - `callback`: функция-обработчик, которую нужно снять.
- `emit<T extends object>(eventName: string, data?: T)` инициирует событие с данными.
  - `eventName`: имя события.
  - `data`: данные, передаваемые в обработчик события.
- `onAll(callback: (event: EmitterEvent) => void)` слушает все события.
  - `callback`: функция-обработчик для всех событий.
- `offAll()` снимает все обработчики.
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` создает триггер, генерирующий событие при вызове.
  - `eventName`: имя события.
  - `context`: контекст, который будет передан в событие.

### Класс `Component`
Абстрактный базовый класс `Component`, предназначенный для отрисовки компонентов пользовательского интерфейса.

#### Конструктор
- `constructor(container: HTMLElement)` инициализирует компонент с указанным контейнером.
  - `container`: DOM-элемент, в который будет помещен компонент.

#### Методы
- `protected toggleClass(element: HTMLElement, className: string, force?: boolean)` переключает класс для указанного элемента.
  - `element`: DOM-элемент, для которого переключается класс.
  - `className`: имя класса для переключения.
  - `force`: если указано, добавляет или удаляет класс в зависимости от значения.
- `protected setText(element: HTMLElement, value: unknown)` устанавливает текстовое содержимое для указанного элемента.
  - `element`: DOM-элемент, для которого устанавливается текст.
  - `value`: значение текста.
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` устанавливает изображение и, опционально, его альтернативный текст для указанного элемента.
  - `element`: элемент изображения.
  - `src`: URL изображения.
  - `alt`: альтернативный текст (опционально).
- `protected setDisabled(element: HTMLElement, state: boolean)` изменяет статус блокировки для указанного элемента.
  - `element`: DOM-элемент, для которого изменяется статус блокировки.
  - `state`: состояние блокировки (`true` - заблокировано, `false` - разблокировано).
- `render(data?: Partial<T>): HTMLElement` обновляет свойства класса и возвращает корневой элемент.
  - `data`: частичные данные для обновления свойств класса (опционально).
  - Возвращает: корневой DOM-элемент компонента.


### Общие классы
---

### Класс `Form`
Класс `Form` расширяет `Component<IOrder>` и представляет собой компонент формы с валидацией и обработкой событий.

#### Поля
- `protected submitButton: HTMLButtonElement` Кнопка отправки формы.
- `protected contentError: HTMLElement` Элемент для отображения ошибок формы.
- `validate: () => void` Метод для валидации формы.

#### Конструктор
- `constructor(container: HTMLFormElement, events: IEvents)` Инициализирует компонент формы с указанным контейнером и событиями.
  - `container`: HTML-форма, в которую будет помещен компонент.
  - `events`: объект событий для управления событиями формы.

#### Методы
- `onInputChange(name: keyof T, value: string)` Обрабатывает изменения в полях ввода формы и инициирует событие изменения.
  - `name`: имя поля ввода.
  - `value`: значение поля ввода.
- `set valid(value: boolean)` Устанавливает статус валидности формы и управляет состоянием кнопки отправки.
  - `value`: валидность формы (`true` - валидна, `false` - невалидна).
- `set errors(value: string)` Устанавливает текст ошибок формы.
  - `value`: строка с сообщением об ошибке.
- `resetForm(): void` Сбрасывает форму, очищает ошибки и устанавливает форму как валидную.
- `private validateForm(): void` Инициирует событие валидации формы и вызывает метод `validate`, если он определен.

### Класс `Modal`
Класс `Modal` расширяет `Component<HTMLElement>` и представляет собой компонент модального окна с функциональностью открытия, закрытия и управления контентом.

#### Поля
- `protected closeButtonElement: HTMLButtonElement` Кнопка закрытия модального окна.
- `protected contentElement: HTMLElement` Элемент для отображения контента модального окна.

#### Конструктор
- `constructor(container: HTMLElement, events: IEvents)` Инициализирует компонент модального окна с указанным контейнером и событиями.
  - `container`: HTML-элемент, в который будет помещен компонент.
  - `events`: объект событий для управления событиями модального окна.

#### Методы
- `set content(value: HTMLElement | null)` Устанавливает контент модального окна. Если значение `null`, очищает содержимое.
  - `value`: HTML-элемент для отображения или `null`.
- `open()` Открывает модальное окно, добавляет обработчик события для клавиши Escape и инициирует событие открытия модального окна.
- `close()` Закрывает модальное окно, удаляет обработчик события для клавиши Escape, очищает контент и инициирует событие закрытия модального окна.
- `render(content: HTMLElement): HTMLElement` Обновляет контент модального окна и открывает его.
  - `content`: HTML-элемент для отображения в модальном окне.
  - Возвращает контейнер модального окна.
- `private toggleModal(state: boolean = true)` Переключает состояние модального окна (открыто/закрыто).
  - `state`: логическое значение, указывающее состояние модального окна (`true` - открыть, `false` - закрыть).
- `private handleEscape = (evt: KeyboardEvent)` Обрабатывает событие нажатия клавиши Escape для закрытия модального окна.
  - `evt`: событие клавиатуры.


### Слой данных
---

### Класс `ApplicationStatus`
Класс `ApplicationStatus` представляет собой модель состояния приложения, включающую каталог продуктов, корзину покупок, информацию о заказе и методы для управления этими данными.

#### Поля
- `catalog: IProduct[]` Массив продуктов, доступных в каталоге.
- `basket: IProduct[]` Массив продуктов, добавленных в корзину.
- `order: IOrderModel` Объект, представляющий текущий заказ, включающий поля email, phone, payment, address, items, total, valid и errors.
- `orderErrors: Partial<Record<keyof TUserInfo, string>>` Объект для хранения ошибок, связанных с информацией о заказе.
- `preview: IProduct | null` Объект продукта, выбранного для предварительного просмотра.
- `isOrderValid: boolean` Флаг, указывающий, валиден ли текущий заказ.
- `contactErrors: Partial<Record<'email' | 'phone', string>>` Объект для хранения ошибок, связанных с контактной информацией.

#### Конструктор
- `constructor(data: Partial<IAppInfo>, events: IEvents)` Инициализирует состояние приложения с начальными данными и объектом событий.
  - `data`: начальные данные для инициализации состояния.
  - `events`: объект для управления событиями.

#### Методы
- `setProductList(items: IProduct[])` Устанавливает список продуктов в каталоге и инициирует событие изменения списка продуктов.
  - `items`: массив продуктов.
- `addToBasket(item: IProduct): void` Добавляет продукт в корзину и инициирует событие изменения корзины.
  - `item`: продукт для добавления в корзину.
- `deleteFromBasket(item: IProduct)` Удаляет продукт из корзины и инициирует событие изменения корзины.
  - `item`: продукт для удаления из корзины.
- `isInBasket(item: IProduct)` Проверяет, находится ли продукт в корзине.
  - `item`: продукт для проверки.
  - Возвращает `true`, если продукт находится в корзине, иначе `false`.
- `getBasketId()` Возвращает массив идентификаторов продуктов в корзине.
- `getNumberBasket(): number` Возвращает количество продуктов в корзине.
- `getTotalBasket(): number` Возвращает общую стоимость продуктов в корзине.
- `cleanBasket()` Очищает корзину и инициирует событие изменения корзины.
- `setField(field: keyof TUserInfo, value: string)` Устанавливает значение указанного поля в объекте заказа и выполняет валидацию заказа.
  - `field`: поле для обновления.
  - `value`: новое значение поля.
- `validateOrder(): void` Выполняет валидацию заказа и обновляет состояние ошибок заказа и контактной информации.
- `setPreview(item: IProduct)` Устанавливает продукт для предварительного просмотра и инициирует событие изменения предварительного просмотра.
  - `item`: продукт для предварительного просмотра.
- `private emitChanges(event: string, payload?: object): void` Инициирует событие с указанным именем и данными.
  - `event`: имя события.
  - `payload`: данные для передачи с событием.


### Слой представления
---

### Класс `MainPage`
Класс `MainPage` представляет собой компонент для отображения главной страницы, включая счетчик корзины, каталог товаров и обработку событий.

#### Поля
- `protected _counter: HTMLElement` Элемент для отображения счетчика товаров в корзине.
- `protected _catalog: HTMLElement` Элемент для отображения каталога товаров.
- `protected _wrapper: HTMLElement` Обертка для основной страницы.
- `protected _basket: HTMLButtonElement` Кнопка для открытия корзины.

#### Конструктор
- `constructor(container: HTMLElement, private events: IEvents)` Инициализирует класс с контейнером и объектом событий.
  - `container`: контейнер элемента главной страницы.
  - `events`: объект для управления событиями.

#### Методы
- `set counter(value: number)` Устанавливает значение счетчика товаров в корзине.
  - `value`: число, отображаемое в счетчике.
- `set catalog(items: HTMLElement[])` Устанавливает элементы каталога товаров.
  - `items`: массив элементов каталога.
- `set locked(value: boolean)` Устанавливает состояние блокировки для обертки страницы.
  - `value`: булево значение, указывающее, заблокирована ли обертка страницы.

### Класс `ProductCard`
Класс `ProductCard` представляет собой компонент для отображения карточки продукта, включающий различные элементы продукта и их обновление.

#### Поля
- `private indexElement?: HTMLElement` Элемент для отображения индекса продукта в корзине.
- `private descriptionElement?: HTMLElement` Элемент для отображения описания продукта.
- `private imageElement?: HTMLImageElement` Элемент для отображения изображения продукта.
- `private titleElement: HTMLElement` Элемент для отображения названия продукта.
- `private categoryElement?: HTMLElement` Элемент для отображения категории продукта.
- `private priceElement: HTMLElement` Элемент для отображения цены продукта.
- `private buttonElement?: HTMLButtonElement` Элемент кнопки для добавления/удаления продукта в/из корзины.

#### Конструктор
- `constructor(container: HTMLElement, actions?: TProductActions)` Инициализирует класс с контейнером и объектом действий для обработки событий.
  - `container`: контейнер элемента карточки продукта.
  - `actions`: объект, содержащий функции обработчиков событий.

#### Методы
- `public updateProductCard(product: IProduct, isInBasket: boolean)` Обновляет информацию карточки продукта.
  - `product`: объект с данными продукта.
  - `isInBasket`: флаг, указывающий, находится ли продукт в корзине.
- `private set id(value: string)` Устанавливает идентификатор продукта.
  - `value`: строка с идентификатором продукта.
- `private set description(value: string)` Устанавливает описание продукта.
  - `value`: строка с описанием продукта.
- `private set image(value: string)` Устанавливает изображение продукта.
  - `value`: строка с URL изображения продукта.
- `private set title(value: string)` Устанавливает название продукта.
  - `value`: строка с названием продукта.
- `private set category(value: string)` Устанавливает категорию продукта.
  - `value`: строка с категорией продукта.
- `private set price(value: number | null)` Устанавливает цену продукта.
  - `value`: число с ценой продукта или `null`, если продукт не продается.
- `public set inBasket(isInBasket: boolean)` Устанавливает статус продукта в корзине.
  - `isInBasket`: флаг, указывающий, находится ли продукт в корзине.
- `public set index(value: number)` Устанавливает индекс продукта.
  - `value`: число с индексом продукта.

### Класс `ShoppingBasket`
Класс `ShoppingBasket` представляет собой компонент для отображения корзины покупок, включающий управление элементами корзины и их отображение.

#### Поля
- `static template` Шаблон корзины, загружаемый из элемента `<template>`.
- `protected _list: HTMLElement` Элемент для отображения списка товаров в корзине.
- `protected _total: HTMLElement` Элемент для отображения общей суммы стоимости товаров в корзине.
- `protected _button: HTMLButtonElement` Кнопка для перехода к оформлению заказа.

#### Конструктор
- `constructor(container: HTMLElement, protected events: IEvents)` Инициализирует класс с контейнером и объектом событий.
  - `container`: контейнер элемента корзины.
  - `events`: объект для управления событиями.

#### Методы
- `private toggleButton(state: boolean)` Переключает состояние кнопки оформления заказа.
  - `state`: флаг, указывающий, активна ли кнопка.
- `set items(items: HTMLElement[])` Устанавливает и обновляет список товаров в корзине.
  - `items`: массив элементов товаров.
- `set total(total: number)` Устанавливает и обновляет общую сумму стоимости товаров в корзине.
  - `total`: сумма стоимости товаров.

### Класс `PaymentDeliveryForm`
Класс `PaymentDeliveryForm` представляет собой форму для выбора способа оплаты и ввода адреса доставки.

#### Поля
- `private _paymentCard: HTMLButtonElement` Кнопка выбора оплаты картой.
- `private _paymentCash: HTMLButtonElement` Кнопка выбора оплаты наличными.
- `private _address: HTMLInputElement` Поле ввода адреса доставки.

#### Конструктор
- `constructor(container: HTMLFormElement, events: IEvents)` Инициализирует класс с контейнером формы и объектом событий.
  - `container`: контейнер элемента формы.
  - `events`: объект для управления событиями.

#### Методы
- `set payment(value: string)` Устанавливает выбранный способ оплаты и переключает соответствующие кнопки.
  - `value`: строка, указывающая выбранный способ оплаты (`'card'` или `'cash'`).
- `set address(value: string)` Устанавливает значение поля ввода адреса.
  - `value`: строка с адресом доставки.

### Класс `ContactsInfoForm`
Класс `ContactsInfoForm` представляет собой форму для ввода контактной информации пользователя, включающей поля для электронной почты и телефона.

#### Поля
- `private _email: HTMLInputElement` Поле ввода электронной почты.
- `private _phone: HTMLInputElement` Поле ввода номера телефона.

#### Конструктор
- `constructor(container: HTMLFormElement, events: IEvents)` Инициализирует класс с контейнером формы и объектом событий.
  - `container`: контейнер элемента формы.
  - `events`: объект для управления событиями.

#### Методы
- `set email(value: string)` Устанавливает значение поля ввода электронной почты.
  - `value`: строка с электронной почтой.
- `set phone(value: string)` Устанавливает значение поля ввода номера телефона.
  - `value`: строка с номером телефона.
- `setErrors(errors: string)` Устанавливает ошибки формы.
  - `errors`: строка с ошибками для отображения.

### Класс `SuccessOrderPlace`
Класс `SuccessOrderPlace` представляет собой компонент для отображения успешного размещения заказа, включающий элементы описания и кнопку закрытия.

#### Поля
- `private closeButtonElement: HTMLButtonElement` Кнопка для закрытия сообщения о успешном заказе.
- `private descriptionElement: HTMLElement` Элемент для отображения описания успешного заказа.

#### Конструктор
- `constructor(container: HTMLElement, events: IEvents, actions?: TSuccessActions)` Инициализирует класс с контейнером, объектом событий и действиями.
  - `container`: контейнер элемента сообщения о успешном заказе.
  - `events`: объект для управления событиями.
  - `actions`: объект, содержащий функции обработчиков событий.

#### Методы
- `set total(value: number)` Устанавливает сумму списанных синапсов.
  - `value`: число, представляющее количество списанных синапсов.


## Слой коммуникации

### Класс `ServerData`

Класс `ServerData` представляет собой реализацию API для взаимодействия с сервером, расширяя возможности базового класса `Api`.

#### Поля класса

- `private cdn: string` URL CDN для получения изображений продуктов.
- `private apiUrl: string` Базовый URL API для выполнения запросов.

#### Конструктор

- `constructor(cdn: string, baseUrl: string, options: RequestInit = {})` Инициализирует класс с URL CDN, базовым URL API и опциональными настройками запроса.
  - `cdn`: URL CDN для изображений.
  - `baseUrl`: базовый URL для всех запросов API.
  - `options`: настройки запроса, включающие заголовки по умолчанию.

#### Методы

- `getProductList(): Promise<IProductResponse>` Получает список продуктов с сервера, добавляя к каждому продукту полный URL изображения.
  - Возвращает объект, содержащий общее количество продуктов и массив продуктов с полными URL изображений.
- `submitContactInfo(contactData: TUserInfo): Promise<IOrderResult>` Отправляет контактную информацию на сервер.
  - `contactData`: объект с контактной информацией пользователя.
  - Возвращает результат запроса, содержащий информацию о статусе отправки.
- `postOrder(orderData: IOrder): Promise<IOrderResult>` Отправляет данные заказа на сервер.
  - `orderData`: объект с данными заказа.
  - Возвращает результат запроса, содержащий информацию о статусе заказа.



### Взаимодействие компонентов
---
### Класс `Presenter`

Класс `Presenter` представляет собой связующее звено между моделью и представлением в приложении, управляя состоянием приложения и событиями.

#### Поля класса

- `private api: ServerData` Объект для взаимодействия с серверными данными.
- `private events: EventEmitter` Объект для управления событиями.
- `private appState: ApplicationStatus` Объект, представляющий текущее состояние приложения.
- `private page: MainPage` Главная страница приложения.
- `private modal: Modal` Модальное окно для отображения различных компонентов.
- `private basket: ShoppingBasket` Компонент корзины покупок.
- `private contacts: ContactsInfoForm` Форма для ввода контактной информации.
- `private order: PaymentDeliveryForm` Форма для ввода данных о доставке и оплате.
- `private success: SuccessOrderPlace` Компонент для отображения успешного размещения заказа.

#### Конструктор

- `constructor(api: ServerData, events: EventEmitter, appState: ApplicationStatus, page: MainPage, modal: Modal, basket: ShoppingBasket, contacts: ContactsInfoForm, order: PaymentDeliveryForm, success: SuccessOrderPlace)` Инициализирует класс с необходимыми зависимостями.
  - `api`: объект для взаимодействия с сервером.
  - `events`: объект для управления событиями.
  - `appState`: объект состояния приложения.
  - `page`: главная страница приложения.
  - `modal`: модальное окно.
  - `basket`: компонент корзины.
  - `contacts`: форма контактной информации.
  - `order`: форма доставки и оплаты.
  - `success`: компонент успешного размещения заказа.

#### Методы

- `private setupEventListeners()` Устанавливает слушатели событий для различных действий в приложении.
- `private async loadProductList()` Загружает список продуктов с сервера и обновляет состояние приложения.
- `private onItemsChanged()` Обрабатывает изменения списка продуктов.
- `private onCardSelect(item: IProduct)` Обрабатывает выбор карточки продукта.
- `private onCardAdd(item: IProduct)` Обрабатывает добавление продукта в корзину.
- `private onCardRemove(item: IProduct)` Обрабатывает удаление продукта из корзины.
- `private onBasketOpen()` Обрабатывает открытие корзины.
- `private onBasketChanged()` Обрабатывает изменения в корзине.
- `private validateAndRender(component: any)` Проверяет валидность данных и отображает компонент.
- `private onOrderOpen()` Обрабатывает открытие формы заказа.
- `private onOrderSubmit()` Обрабатывает отправку формы заказа.
- `private onFormErrorsChange(errors: { orderErrors: IFormError, contactErrors: IFormError })` Обрабатывает изменения ошибок формы.
- `private formatErrors(errors: IFormError): string` Форматирует ошибки формы в строку.
- `private async onContactsSubmit()` Обрабатывает отправку контактной информации и завершение заказа.
- `private onOrderComplete(res: IOrderResult)` Обрабатывает успешное завершение заказа.
- `private onSuccessFinish()` Обрабатывает завершение отображения успешного заказа.
- `private onModalOpen()` Обрабатывает открытие модального окна.
- `private onModalClose()` Обрабатывает закрытие модального окна.
- `private onFieldChange(data: { field: keyof TUserInfo; value: string })` Обрабатывает изменения полей формы.


### Список всех событий, которые могут генерироваться в системе
---


Проект использует различные события для управления состоянием приложения и взаимодействием с пользователем. Вот список всех событий, которые обрабатываются в классе `Presenter`:

#### События

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
