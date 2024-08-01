import { Component } from '../base/component';
import { cloneTemplate, createElement, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { TBasketView } from '../../types';

export class ShoppingBasket extends Component<TBasketView> {
	static template = ensureElement<HTMLTemplateElement>('#basket');

	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(cloneTemplate(ShoppingBasket.template));

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._button.addEventListener('click', () => {
			this.events.emit('order:open');
		});

		this.items = [];
	}

	private toggleButton(state: boolean) {
		this.setDisabled(this._button, !state);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.toggleButton(true);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.toggleButton(false);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}
