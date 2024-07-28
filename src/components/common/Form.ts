import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IOrder} from '../../types';

export class Form<T> extends Component<IOrder> {
	protected submitButton: HTMLButtonElement;
	protected contentError: HTMLElement;
	validate: () => void;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container,
		);
		this.contentError = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	onInputChange(name: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(name)}:change`, {
			field: name,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

	set errors(value: string) {
		this.setText(this.contentError, value);
	}

	resetForm(): void {
		this.container.reset();
		this.errors = '';
		this.valid = true;
		this.validateForm();
	}

	private validateForm(): void {
		this.events.emit(`${this.container.name}:validate`);

		if (this.validate) {
			this.validate();
		}
	}
}
