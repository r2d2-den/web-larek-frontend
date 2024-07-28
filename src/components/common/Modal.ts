import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<HTMLElement> {
	protected closeButtonElement: HTMLButtonElement;
	protected contentElement: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', container);
		this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

		this.container.addEventListener('click', this.close.bind(this));
		this.closeButtonElement.addEventListener('click', this.close.bind(this));
		this.contentElement.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement | null) {
		if (value) {
			this.contentElement.replaceChildren(value);
		} else {
			this.contentElement.innerHTML = '';
		}
	}

	open() {
		this.toggleModal();
		document.addEventListener('keydown', this.handleEscape);
		this.events.emit('modal:open');
	}

	close() {
		this.toggleModal(false);
		document.removeEventListener('keydown', this.handleEscape);
		this.content = null;
		this.events.emit('modal:close');
	}

	render(content: HTMLElement): HTMLElement {
		this.content = content;
		this.open();
		return this.container;
	}

	private toggleModal(state: boolean = true) {
		this.toggleClass(this.container, 'modal_active', state);
	}

	private handleEscape = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	};
}
