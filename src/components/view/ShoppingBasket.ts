import { Component } from '../base/component';
import { cloneTemplate, createElement, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IBasket } from '../../types';

export class ShoppingBasket extends Component<IBasket> {
	// Статический шаблон для корзины
	static template = ensureElement<HTMLTemplateElement>('#basket');

	protected _list: HTMLElement; // Список элементов корзины
	protected _total: HTMLElement; // Элемент для отображения общей суммы
	protected _button: HTMLButtonElement; // Кнопка для оформления заказа

	constructor(container: HTMLElement, protected events: IEvents) {
		super(cloneTemplate(ShoppingBasket.template));

		// Инициализация элементов корзины
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

		// Установка обработчика клика на кнопку оформления заказа
		this._button.addEventListener('click', () => {
			this.events.emit('order:open');
		});

		// Изначально корзина пуста
		this.items = [];
	}

	/**
	 * Переключение состояния кнопки (активна/неактивна)
	 * @param state - Состояние кнопки (true - активна, false - неактивна)
	 */
	private toggleButton(state: boolean) {
		this.setDisabled(this._button, !state);
	}

	/**
	 * Установка элементов корзины
	 * @param items - Массив элементов корзины
	 */
	set items(items: HTMLElement[]) {
		if (items.length) {
			// Если есть элементы, заменяем содержимое списка и активируем кнопку
			this._list.replaceChildren(...items);
			this.toggleButton(true);
		} else {
			// Если корзина пуста, отображаем сообщение и деактивируем кнопку
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.toggleButton(false);
		}
	}

	/**
	 * Установка общей суммы в корзине
	 * @param total - Общая сумма
	 */
	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}

