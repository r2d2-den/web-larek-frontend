import { IProduct, IOrder, OrderForm } from '../types';
import {
	validateOrderPayment,
	validateOrderAddress,
	validateOrderEmail,
	validateOrderPhone,
} from './Validation';
import { IEvents } from './base/events';

/**
 * Класс для управления состоянием приложения, включая каталог товаров, корзину и заказ.
 */
export class ApplicationStatus {
	// Список товаров в каталоге
	catalog: IProduct[] = [];
	// Список товаров в корзине
	basket: IProduct[] = [];
	// Данные заказа, без элементов и общей суммы
	order: Omit<IOrder, 'items' | 'total'> = {
		email: '',
		phone: '',
		payment: '',
		address: '',
	};

	// Ошибки в данных заказа
	orderErrors: Partial<Record<'payment' | 'address', string>> = {};
	// Ошибки в контактных данных
	contactErrors: Partial<Record<'email' | 'phone', string>> = {};
	// Товар, который отображается как предварительный просмотр
	preview: IProduct | null = null;
	// Флаг, указывающий, действителен ли заказ
	isOrderValid: boolean = false;

	/**
	 * Конструктор класса. Инициализирует состояние с данными заказа.
	 * @param data - Частичные данные заказа
	 * @param events - Система событий для уведомлений об изменениях
	 */
	constructor(data: Partial<OrderForm>, protected events: IEvents) {
		// Присваивание данных заказа
		Object.assign(this.order, data);
	}

	/**
	 * Устанавливает список товаров в каталоге.
	 * @param items - Список товаров
	 */
	setProductList(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	/**
	 * Добавляет товар в корзину.
	 * @param item - Добавляемый товар
	 */
	addToBasket(item: IProduct): void {
		this.basket.push(item);
		this.emitChanges('basket:changed', this.basket);
	}

	/**
	 * Удаляет товар из корзины.
	 * @param item - Удаляемый товар
	 */
	deleteFromBasket(item: IProduct): void {
		this.basket = this.basket.filter(basketItem => basketItem.id !== item.id);
		this.emitChanges('basket:changed', this.basket);
	}

	/**
	 * Проверяет, находится ли товар в корзине.
	 * @param item - Проверяемый товар
	 * @returns true, если товар в корзине, иначе false
	 */
	isInBasket(item: IProduct): boolean {
		return this.basket.some(basketItem => basketItem.id === item.id);
	}

	/**
	 * Получает список ID товаров в корзине.
	 * @returns Массив ID товаров
	 */
	getBasketId(): string[] {
		return this.basket.map(item => item.id);
	}

	/**
	 * Получает количество товаров в корзине.
	 * @returns Количество товаров
	 */
	getNumberBasket(): number {
		return this.basket.length;
	}

	/**
	 * Получает общую стоимость товаров в корзине.
	 * @returns Общая стоимость
	 */
	getTotalBasket(): number {
		return this.basket.reduce((total, item) => total + (item.price ?? 0), 0);
	}

	/**
	 * Очищает корзину.
	 */
	cleanBasket(): void {
		this.basket = [];
		this.emitChanges('basket:changed', this.basket);
	}

	/**
	 * Устанавливает значение поля заказа и выполняет валидацию.
	 * @param field - Поле заказа
	 * @param value - Значение для установки
	 */
	setField<K extends keyof OrderForm>(field: K, value: OrderForm[K]): void {
		this.order[field] = value;
		this.validateOrder();
	}

	/**
	 * Выполняет валидацию данных заказа и контактной информации.
	 */
	validateOrder(): void {
		this.orderErrors = {
			payment: validateOrderPayment(this.order.payment || ''),
			address: validateOrderAddress(this.order.address || ''),
		};
		
		this.contactErrors = {
			email: validateOrderEmail(this.order.email || ''),
			phone: validateOrderPhone(this.order.phone || ''),
		};

		// Сообщает об изменении ошибок в форме
		this.events.emit('formErrors:change', { 
			orderErrors: this.orderErrors,
			contactErrors: this.contactErrors
		});
	}

	/**
	 * Устанавливает предварительный просмотр товара.
	 * @param item - Товар для предварительного просмотра
	 */
	setPreview(item: IProduct): void {
		this.preview = item;
		this.events.emit('preview:change', this.preview);
	}

	/**
	 * Вызывает событие с указанным именем и необязательными данными.
	 * @param event - Имя события
	 * @param payload - Данные события
	 */
	private emitChanges(event: string, payload: object = {}): void {
		this.events.emit(event, payload);
	}
}
