import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IOrderResult, TSuccessActions } from '../../types';

export class SuccessOrderPlace extends Component<IOrderResult> {
	private closeButtonElement: HTMLButtonElement;
	private descriptionElement: HTMLElement;

	constructor(
		container: HTMLElement,
		events: IEvents,
		actions?: TSuccessActions
	) {
		super(container);

		this.descriptionElement = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		this.closeButtonElement = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this.closeButtonElement.addEventListener('click', actions.onClick);
		} else {
			this.closeButtonElement.addEventListener('click', () =>
				events.emit('success:finish')
			);
		}
	}

	set total(value: number) {
		this.setText(this.descriptionElement, `Списано ${value} синапсов`);
	}
}
