import { TOrderForm } from '../../types';
import { Form } from '../common/Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

export class PaymentDeliveryForm extends Form<TOrderForm> {
	private _paymentCard: HTMLButtonElement;
	private _paymentCash: HTMLButtonElement;
	private _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentCard = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
		this._paymentCash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);
		this._address = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);

		this._paymentCard.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('payment', 'card');
		});
		this._paymentCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});
	}

	set payment(value: string) {
		this.toggleClass(this._paymentCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._paymentCash, 'button_alt-active', value === 'cash');
	}

	set address(value: string) {
		this._address.value = value;
	}
}

