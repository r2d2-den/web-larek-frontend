import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IOrderResult } from '../../types';

export class SuccessOrderPlace extends Component<IOrderResult> {
	private closeButtonElement: HTMLButtonElement; // Элемент кнопки для закрытия сообщения о успешном заказе
	private descriptionElement: HTMLElement; // Элемент для отображения описания успешного заказа

	constructor(
		container: HTMLElement,
		events: IEvents,
	) {
		super(container);

		// Инициализация элемента описания успешного заказа
		this.descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		// Инициализация кнопки закрытия сообщения о успешном заказе
		this.closeButtonElement = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		// Установка обработчика клика на кнопку закрытия
		if (onclick) {
			this.closeButtonElement.addEventListener('click', onclick);
		} else {
			// Если обработчик клика не передан, по умолчанию отправляется событие 'success:finish'
			this.closeButtonElement.addEventListener('click', () =>
				events.emit('success:finish')
			);
		}
	}

	/**
	 * Установить общее значение заказа в элементе описания
	 * @param value - Сумма, списанная с аккаунта пользователя
	 */
	set total(value: number) {
		this.setText(this.descriptionElement, `Списано ${value} синапсов`);
	}
}
