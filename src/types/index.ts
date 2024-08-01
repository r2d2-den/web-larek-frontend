// --- Продукты ---

// Интерфейс для продукта
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	indexElement: number;
}

// Интерфейс для ответа от сервера, содержащего список продуктов
export interface IProductResponse {
	total: number;
	items: IProduct[];
}

// --- Корзина ---

// Интерфейс для корзины покупок
export interface IBasket {
	items: string[];
	total: number;
}

// --- Заказы ---

// Интерфейс для заказа
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}

// Интерфейс для результата заказа
export interface IOrderResult {
	id: string;
	total: number;
}

// Интерфейс для формы заказа (только payment и address)
export interface TOrderForm {
	payment: 'card' | 'cash';
	address: string;
}

// --- Утилитарные типы ---

// Тип для формы контактов (только email и phone)
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

// Тип для информации о пользователе (объединение контактных и платежных данных)
export type TUserInfo = Pick<IOrder, 'email' | 'phone' | 'address' | 'payment'>;

// --- Ошибки форм ---

// Интерфейс для ошибок формы
export interface IFormError {
	field: string;
	message: string;
	address?: string;
	email?: string;
	phone?: string;
	payment?: string;
}

// --- Информация о приложении ---

// Тип для информации о состоянии приложения
export type IAppInfo = {
	catalog: IProduct[];
	basket: IBasket;
	order: Partial<TUserInfo>;
	formError: Partial<IFormError>;
};

// --- Представления и действия ---

// Тип для действий с продуктом
export type TProductActions = {
	onClick: (event: MouseEvent) => void;
};

// Тип для главной страницы
export type TMainPage = {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
};

// Тип для представления корзины
export type TBasketView = {
	items: HTMLElement[];
	total: number;
};

// Тип для действий после успешного выполнения заказа
export type TSuccessActions = {
	onClick?: () => void;
};

// --- Данные сервера ---

// Типы для данных, получаемых от сервера
export type IServerData = {
	getProductList: () => Promise<IProductResponse>;
	submitContactInfo: (contactData: TUserInfo) => Promise<IOrderResult>;
	postOrder: (orderData: IOrder) => Promise<IOrderResult>;
};