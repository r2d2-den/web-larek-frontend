import { Form } from '../common/Form';
import { TContactsForm } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class ContactsInfoForm extends Form<TContactsForm> {
	private _email: HTMLInputElement;
	private _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>('.form__input[name=email]', this.container);
		this._phone = ensureElement<HTMLInputElement>('.form__input[name=phone]', this.container);
	}

	set email(value: string) {
		this._email.value = value;
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	setErrors(errors: string) {
		this.errors = errors;
	}
}

