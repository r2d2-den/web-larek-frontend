import { Api } from '../components/base/api';
import {
	IProduct,
	ApiListResponse,
	IOrderResult,
	IOrder,
	OrderForm,
	IServerData,
} from '../types';

/**
 * Класс для взаимодействия с сервером, включая получение списка продуктов,
 * отправку контактной информации и размещение заказа.
 */
export class ServerData extends Api implements IServerData {
	private cdn: string; // URL для загрузки изображений
	private apiUrl: string; // Базовый URL API

	/**
	 * Конструктор класса. Инициализирует базовый URL и CDN.
	 * @param cdn - URL для загрузки изображений
	 * @param baseUrl - Базовый URL API
	 * @param options - Дополнительные опции для запросов (например, заголовки, методы и т.д.)
	 */
	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
		this.apiUrl = baseUrl;
	}

	/**
	 * Получает список продуктов с сервера.
	 * @returns Промис с объектом, содержащим общее количество продуктов и список продуктов
	 */
	getProductList(): Promise<ApiListResponse<IProduct>> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => ({
			total: data.total,
			items: data.items.map((item) => ({
				...item,
				image: `${this.cdn}${item.image}`, // Добавляет префикс CDN к пути изображения
			})),
		}));
	}

	/**
	 * Отправляет контактную информацию на сервер.
	 * @param contactData - Объект с контактной информацией
	 * @returns Промис с результатом отправки контактной информации
	 */
	submitContactInfo(contactData: OrderForm): Promise<IOrderResult> {
		return fetch(`${this.apiUrl}/submitContact`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(contactData), // Преобразует данные контактной информации в JSON
		})
		.then((response) => response.json()); // Парсит ответ сервера как JSON
	}

	/**
	 * Размещает заказ на сервере.
	 * @param orderData - Объект с данными заказа
	 * @returns Промис с результатом размещения заказа
	 */
	postOrder(orderData: IOrder): Promise<IOrderResult> {
		return this.post('/order', orderData) // Отправляет данные заказа
			.then((orderResult: IOrderResult) => orderResult); // Возвращает результат заказа
	}
}

