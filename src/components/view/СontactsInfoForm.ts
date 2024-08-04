import { Form } from '../common/Form';
import { OrderForm } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

/**
 * Класс ContactsInfoForm отвечает за форму ввода контактной информации.
 * Наследуется от Form<OrderForm>, используя обобщение для работы с данными формы заказа.
 */
export class ContactsInfoForm extends Form<OrderForm> {
	// Поля ввода для электронной почты и телефона
	private _email: HTMLInputElement;
	private _phone: HTMLInputElement;

	/**
	 * Конструктор класса ContactsInfoForm
	 * @param container - HTML элемент формы, в который будет встроена форма контактной информации.
	 * @param events - Экземпляр IEvents для обработки событий формы.
	 */
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Инициализация полей ввода для email и телефона
		this._email = ensureElement<HTMLInputElement>(
			'.form__input[name=email]',
			this.container
		);
		this._phone = ensureElement<HTMLInputElement>(
			'.form__input[name=phone]',
			this.container
		);
	}

	/**
	 * Установить значение поля email
	 * @param value - Новое значение для email
	 */
	set email(value: string) {
		this._email.value = value;
	}

	/**
	 * Установить значение поля phone
	 * @param value - Новое значение для телефона
	 */
	set phone(value: string) {
		this._phone.value = value;
	}

	/**
	 * Установить ошибки для формы
	 * @param errors - Текст ошибок, который нужно отобразить
	 */
	setErrors(errors: string) {
		this.errors = errors;
	}
}

