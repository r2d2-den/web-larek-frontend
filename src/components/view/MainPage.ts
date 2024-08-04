import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { ApiListResponse, IProduct } from '../../types';

/**
 * Класс MainPage отвечает за основную страницу приложения.
 * Наследуется от Component<ApiListResponse<IProduct>>, используя обобщение для работы с данными списка продуктов.
 */
export class MainPage extends Component<ApiListResponse<IProduct>> {
	// HTML элементы, используемые на главной странице
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLButtonElement;

	/**
	 * Конструктор класса MainPage
	 * @param container - HTML элемент, содержащий главную страницу.
	 * @param events - Экземпляр IEvents для обработки событий.
	 */
	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		// Инициализация элементов главной страницы
		this._counter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.container
		);
		this._catalog = ensureElement<HTMLElement>('.gallery', this.container);
		this._wrapper = ensureElement<HTMLElement>(
			'.page__wrapper',
			this.container
		);
		this._basket = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.container
		);

		// Обработчик события клика на кнопку корзины
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	/**
	 * Установить значение счетчика корзины
	 * @param value - Новое значение счетчика
	 */
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	/**
	 * Обновить каталог с продуктами
	 * @param items - Массив HTML элементов для отображения в каталоге
	 */
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	/**
	 * Заблокировать или разблокировать страницу
	 * @param value - true для блокировки, false для разблокировки
	 */
	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}

