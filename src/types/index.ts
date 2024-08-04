// --- Продукты ---

/**
 * Интерфейс для описания продукта.
 */
export interface IProduct {
	id: string;             // Уникальный идентификатор продукта
	description: string;    // Описание продукта
	image: string;          // URL изображения продукта
	title: string;          // Название продукта
	category: string;       // Категория продукта
	price: number | null;   // Цена продукта (может быть null, если цена не установлена)
	indexElement: number;   // Индекс элемента в списке
}

// --- Корзина ---

/**
 * Интерфейс для корзины покупок.
 */
export interface IBasket {
	items: string[];        // Массив идентификаторов товаров в корзине
	total: number;         // Общая стоимость товаров в корзине
}

// --- Заказы ---

/**
 * Интерфейс для описания заказа.
 */
export interface IOrder {
	payment: string;        // Метод оплаты (например, 'cash' или 'online')
	email: string;          // Email клиента
	phone: string;          // Телефон клиента
	address: string;        // Адрес доставки
	items: string[];        // Массив идентификаторов товаров в заказе
	total: number;         // Общая стоимость заказа
}

/**
 * Интерфейс для результата размещения заказа.
 */
export interface IOrderResult {
	id: string;            // Уникальный идентификатор заказа
	total: number;         // Общая стоимость заказа
}

// --- Утилитарные типы ---

/**
 * Перечисление возможных методов оплаты.
 */
export enum EnumDeliveryFormMethod {
	cash = 'cash',         // Оплата наличными
	online = 'online'      // Онлайн-оплата
}

/**
 * Тип для формы заказа без полей `total` и `items`.
 */
export type OrderForm = Omit<IOrder, 'total' | 'items'>;

// --- Представления и действия ---

/**
 * Тип для действий, связанных с элементами интерфейса.
 */
export type TActions = {
	onClick?: () => void;  // Функция, вызываемая при клике на элемент
};

/**
 * Тип для ответа API со списком элементов.
 * @param Type - Тип элемента в списке.
 */
export type ApiListResponse<Type> = {
	total: number;         // Общее количество элементов
	items: Type[];         // Массив элементов
};

/**
 * Тип для методов POST запросов.
 */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// --- Данные сервера ---

/**
 * Интерфейс для работы с данными сервера.
 */
export type IServerData = {
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
