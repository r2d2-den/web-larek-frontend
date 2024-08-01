import { ApplicationStatus } from './ApplicationStatus';
import { IProduct, IOrderResult, IFormError, TUserInfo } from '../types';
import { EventEmitter } from './base/events';
import { Modal } from './common/Modal';
import { ShoppingBasket } from './view/ShoppingBasket';
import { ContactsInfoForm } from './view/СontactsInfoForm';
import { PaymentDeliveryForm } from './view/PaymentDeliveryForm';
import { SuccessOrderPlace } from './view/SuccessOrderPlace';
import { MainPage } from './view/MainPage';
import { ProductCard } from './view/ProductСard';
import { ServerData } from './ServerData';
import { ensureElement, cloneTemplate } from '../utils/utils';

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

export class Presenter {
	private api: ServerData;
	private events: EventEmitter;
	private appState: ApplicationStatus;
	private page: MainPage;
	private modal: Modal;
	private basket: ShoppingBasket;
	private contacts: ContactsInfoForm;
	private order: PaymentDeliveryForm;
	private success: SuccessOrderPlace;

	constructor(
		api: ServerData,
		events: EventEmitter,
		appState: ApplicationStatus,
		page: MainPage,
		modal: Modal,
		basket: ShoppingBasket,
		contacts: ContactsInfoForm,
		order: PaymentDeliveryForm,
		success: SuccessOrderPlace
	) {
		this.api = api;
		this.events = events;
		this.appState = appState;
		this.page = page;
		this.modal = modal;
		this.basket = basket;
		this.contacts = contacts;
		this.order = order;
		this.success = success;
	}

	public init() {
		this.loadProductList();
		this.setupEventListeners();
	}

	private setupEventListeners() {
		this.events.on('items:changed', this.onItemsChanged.bind(this));
		this.events.on('card:select', this.onCardSelect.bind(this));
		this.events.on('card:add', this.onCardAdd.bind(this));
		this.events.on('card:remove', this.onCardRemove.bind(this));
		this.events.on('basket:open', this.onBasketOpen.bind(this));
		this.events.on('basket:changed', this.onBasketChanged.bind(this));
		this.events.on('order:open', this.onOrderOpen.bind(this));
		this.events.on('order:submit', this.onOrderSubmit.bind(this));
		this.events.on('formErrors:change', this.onFormErrorsChange.bind(this));
		this.events.on('contacts:submit', this.onContactsSubmit.bind(this));
		this.events.on('order:complete', this.onOrderComplete.bind(this));
		this.events.on('success:finish', this.onSuccessFinish.bind(this));
		this.events.on('modal:open', this.onModalOpen.bind(this));
		this.events.on('modal:close', this.onModalClose.bind(this));
		this.events.on(
			/^(order|contacts)\..*:change/,
			this.onFieldChange.bind(this)
		);
		this.events.on('payment:select', this.onPaymentSelect.bind(this));
	}

	private async loadProductList() {
		try {
			const response = await this.api.getProductList();
			this.appState.setProductList(response.items);
			console.error(response.items);
		} catch (error) {
			console.error(error);
		}
	}

	private onPaymentSelect(data: { paymentMethod: string }) {
		this.appState.setField('payment', data.paymentMethod);
	}

	private onItemsChanged() {
		this.page.catalog = this.appState.catalog.map((item) => {
			const product = new ProductCard(cloneTemplate(cardCatalogTemplate), {
				onClick: () => this.events.emit('card:select', item),
			});
			return product.render({
				title: item.title,
				price: item.price,
				image: item.image,
				category: item.category,
			});
		});
	}

	private onCardSelect(item: IProduct) {
		const card = new ProductCard(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (!this.appState.isInBasket(item)) {
					this.appState.addToBasket(item);
				} else {
					this.appState.deleteFromBasket(item);
				}
				card.inBasket = this.appState.isInBasket(item);
			},
		});
		card.inBasket = this.appState.isInBasket(item);
		this.modal.render(
			card.render({
				title: item.title,
				image: item.image,
				description: item.description,
				price: item.price,
				category: item.category,
			})
		);
	}

	private onCardAdd(item: IProduct) {
		this.appState.addToBasket(item);
	}

	private onCardRemove(item: IProduct) {
		this.appState.deleteFromBasket(item);
	}

	private onBasketOpen() {
		this.modal.render(this.basket.render({}));
	}

	private onBasketChanged() {
		this.page.counter = this.appState.getNumberBasket();

		const items = this.appState.basket.map((item, index) => {
			const card = new ProductCard(cloneTemplate(cardBasketTemplate), {
				onClick: () => {
					this.events.emit('card:remove', item);
				},
			});

			card.index = index + 1;

			return card.render({
				title: item.title,
				price: item.price,
			});
		});

		this.basket.items = items;
		this.basket.total = this.appState.getTotalBasket();
	}

	private validateAndRender(component: any) {
		this.appState.validateOrder();
		this.modal.render(
			component.render({
				valid: this.appState.isOrderValid,
				errors:
					component === this.order
						? Object.values(this.appState.orderErrors)
						: Object.values(this.appState.contactErrors),
			})
		);
	}

	private onOrderOpen() {
		this.validateAndRender(this.order);
	}

	private onOrderSubmit() {
		this.validateAndRender(this.contacts);
	}

	private onFormErrorsChange(errors: {
		orderErrors: IFormError;
		contactErrors: IFormError;
	}) {
		const { orderErrors, contactErrors } = errors;
		this.order.valid = !orderErrors.payment && !orderErrors.address;
		this.contacts.valid = !contactErrors.email && !contactErrors.phone;
		this.order.errors = this.formatErrors(orderErrors);
		this.contacts.errors = this.formatErrors(contactErrors);
	}

	private formatErrors(errors: IFormError): string {
		return Object.values(errors).filter(Boolean).join('; ');
	}

	private async onContactsSubmit() {
		try {
			const result = await this.api.postOrder({
				...this.appState.order,
				total: this.appState.getTotalBasket(),
				items: this.appState.getBasketId(),
			});
			console.log(
				this.appState.order,
				this.appState.getTotalBasket(),
				this.appState.getBasketId()
			);
			this.order.resetForm();
			this.contacts.resetForm();
			this.events.emit('order:complete', result);
			this.appState.cleanBasket();
			this.page.counter = this.appState.getNumberBasket();
			this.success.total = result.total;
			this.modal.render(this.success.render({}));
		} catch (error) {
			console.error(error);
		}
	}

	private onOrderComplete(res: IOrderResult) {
		this.modal.render(this.success.render({ total: res.total }));
	}

	private onSuccessFinish() {
		this.modal.close();
	}

	private onModalOpen() {
		this.page.locked = true;
	}

	private onModalClose() {
		this.page.locked = false;
	}

	private onFieldChange(data: { field: keyof TUserInfo; value: string }) {
		this.appState.setField(data.field, data.value);
	}
}
