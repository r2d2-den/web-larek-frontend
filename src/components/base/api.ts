import { ApiPostMethods } from '../../types/index';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	/**
	 * Конструктор класса Api
	 * @param baseUrl Базовый URL для запросов
	 * @param options Опции для инициализации запросов (например, заголовки)
	 */
	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		// Устанавливаем заголовки по умолчанию и объединяем их с переданными опциями
		this.options = {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options.headers || {}),
			},
		};
	}

	/**
	 * Обработка ответа от сервера
	 * @param response Ответ от сервера
	 * @returns Объект ответа в формате JSON или ошибка
	 */
	protected async handleResponse(response: Response): Promise<object> {
		if (response.ok) {
			// Если ответ успешный, возвращаем данные в формате JSON
			return response.json();
		} else {
			// Если ответ не успешный, обрабатываем ошибку и возвращаем её
			const errorData = await response.json();
			return Promise.reject(errorData.error ?? response.statusText);
		}
	}

	/**
	 * Выполнение GET-запроса
	 * @param uri Путь для GET-запроса
	 * @returns Ответ от сервера
	 */
	async get(uri: string): Promise<object> {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		});
		return this.handleResponse(response);
	}

	/**
	 * Выполнение POST-запроса (или другого метода, указанного в ApiPostMethods)
	 * @param uri Путь для запроса
	 * @param data Данные для отправки
	 * @param method Метод запроса (по умолчанию POST)
	 * @returns Ответ от сервера
	 */
	async post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		});
		return this.handleResponse(response);
	}
}