import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { TMainPage } from '../../types';

export class MainPage extends Component<TMainPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLButtonElement;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

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

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
