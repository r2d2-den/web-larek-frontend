import { OrderForm, EnumDeliveryFormMethod } from '../../types';
import { Form } from '../common/Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

/**
 * Класс формы для выбора метода оплаты и ввода адреса доставки
 */
export class PaymentDeliveryForm extends Form<OrderForm> {
	// Элементы формы
	private _paymentCard: HTMLButtonElement;
	private _paymentCash: HTMLButtonElement;
	private _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Инициализация элементов формы
		this._paymentCard = ensureElement<HTMLButtonElement>(
			'.button_alt[name=card]',  // Селектор для кнопки оплаты картой
			this.container
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			'.button_alt[name=cash]',  // Селектор для кнопки оплаты наличными
			this.container
		);
		this._address = ensureElement<HTMLInputElement>(
			'.form__input[name=address]',  // Селектор для поля ввода адреса
			this.container
		);

		// Установка обработчиков событий на кнопки выбора метода оплаты
		this._paymentCard.addEventListener('click', () => {
			this.events.emit('payment:select', { paymentMethod: EnumDeliveryFormMethod.online });
		});
		this._paymentCash.addEventListener('click', () => {
			this.events.emit('payment:select', { paymentMethod: EnumDeliveryFormMethod.cash });
		});
	}

	/**
	 * Установка выбранного метода оплаты и обновление состояния кнопок
	 * @param value - Значение выбранного метода оплаты ('card' или 'cash')
	 */
	set payment(value: string) {
		this.toggleClass(this._paymentCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._paymentCash, 'button_alt-active', value === 'cash');
	}

	/**
	 * Установка значения адреса в поле ввода
	 * @param value - Адрес доставки
	 */
	set address(value: string) {
		this._address.value = value;
	}
}

