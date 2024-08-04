import { ApplicationStatus } from './ApplicationStatus';
import { IProduct, IOrderResult, OrderForm } from '../types';
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

// Получение ссылок на шаблоны для карточек
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

export class Presenter {
	private api: ServerData; // Экземпляр класса для работы с API
	private events: EventEmitter; // Объект для управления событиями
	private appState: ApplicationStatus; // Объект для управления состоянием приложения
	private page: MainPage; // Объект для управления основной страницей
	private modal: Modal; // Объект для работы с модальными окнами
	private basket: ShoppingBasket; // Объект для управления корзиной
	private contacts: ContactsInfoForm; // Объект для работы с формой контактной информации
	private order: PaymentDeliveryForm; // Объект для работы с формой заказа
	private success: SuccessOrderPlace; // Объект для отображения успешного завершения заказа

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
		// Инициализация зависимостей
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
		// Загрузка списка продуктов и установка обработчиков событий
		this.loadProductList();
		this.setupEventListeners();
	}

	private setupEventListeners() {
		// Настройка обработчиков событий для различных событий
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
		// Асинхронная загрузка списка продуктов с сервера и обновление состояния приложения
		try {
			const response = await this.api.getProductList();
			this.appState.setProductList(response.items);
			console.log('Продукты загружены:', response.items); // Логирование загруженных продуктов
		} catch (error) {
			console.error('Ошибка загрузки списка продуктов:', error);
		}
	}

	private onPaymentSelect(data: { paymentMethod: string }) {
		// Обработка выбора метода оплаты и обновление состояния приложения
		this.appState.setField('payment', data.paymentMethod);
	}

	private onItemsChanged() {
		// Обновление списка продуктов на странице
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
		// Обработка выбора карточки продукта и отображение подробностей в модальном окне
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
		// Добавление продукта в корзину
		this.appState.addToBasket(item);
	}

	private onCardRemove(item: IProduct) {
		// Удаление продукта из корзины
		this.appState.deleteFromBasket(item);
	}

	private onBasketOpen() {
		// Отображение корзины в модальном окне
		this.modal.render(this.basket.render({}));
	}

	private onBasketChanged() {
		// Обновление отображения корзины при изменении
		this.page.counter = this.appState.getNumberBasket();

		const items = this.appState.basket.map((item, index) => {
			const card = new ProductCard(cloneTemplate(cardBasketTemplate), {
				onClick: () => {
					this.events.emit('card:remove', item);
				},
			});

			// Установка индекса элемента для отображения в корзине
			card.index = index + 1;

			return card.render({
				title: item.title,
				price: item.price,
				indexElement: index + 1,
			});
		});

		this.basket.items = items;
		this.basket.total = this.appState.getTotalBasket();
	}

	private validateAndRender(component: any) {
		// Валидация формы и отображение компонента в модальном окне
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
		// Открытие формы заказа и отображение в модальном окне
		this.validateAndRender(this.order);
	}

	private onOrderSubmit() {
		// Открытие формы контактной информации и отображение в модальном окне
		this.validateAndRender(this.contacts);
	}

	private onFormErrorsChange(errors: {
		orderErrors: OrderForm;
		contactErrors: OrderForm;
	}) {
		// Обработка изменений ошибок формы и обновление состояния
		const { orderErrors, contactErrors } = errors;
		this.order.valid = !orderErrors.payment && !orderErrors.address;
		this.contacts.valid = !contactErrors.email && !contactErrors.phone;
		this.order.errors = this.formatErrors(orderErrors);
		this.contacts.errors = this.formatErrors(contactErrors);
		this.order.payment = this.appState.order.payment;
	}

	private formatErrors(errors: OrderForm): string {
		// Форматирование ошибок в виде строки
		return Object.values(errors).filter(Boolean).join('; ');
	}

	private async onContactsSubmit() {
		// Отправка заказа на сервер и обработка результата
		try {
			const result = await this.api.postOrder({
				...this.appState.order,
				total: this.appState.getTotalBasket(),
				items: this.appState.getBasketId(),
			});
			console.log(
				'Заказ отправлен:', this.appState.order,
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
			console.error('Ошибка при отправке заказа:', error);
		}
	}

	private onOrderComplete(res: IOrderResult) {
		// Отображение успешного завершения заказа в модальном окне
		this.modal.render(this.success.render({ total: res.total }));
	}

	private onSuccessFinish() {
		// Закрытие модального окна после успешного завершения заказа
		this.modal.close();
	}

	private onModalOpen() {
		// Блокировка основной страницы при открытии модального окна
		this.page.locked = true;
	}

	private onModalClose() {
		// Разблокировка основной страницы при закрытии модального окна
		this.page.locked = false;
	}

	private onFieldChange(data: { field: keyof OrderForm; value: string }) {
		// Обновление поля заказа в состоянии приложения
		this.appState.setField(data.field, data.value);
	}
}
