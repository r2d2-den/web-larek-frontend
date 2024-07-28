import { IProduct, IOrderModel, TUserInfo, IAppInfo } from '../types';
import { validateOrderPayment, validateOrderAddress, validateOrderEmail, validateOrderPhone } from './Validation';
import { IEvents } from './base/events';

export class ApplicationStatus {
    catalog: IProduct[] = [];
    basket: IProduct[] = [];
    order: IOrderModel = {
        email: '',
        phone: '',
        payment: '',
        address: '',
        items: [],
        total: 0,
        valid: false,
        errors: [],
        contactInfo: undefined
    };
    orderErrors: Partial<Record<keyof TUserInfo, string>> = {};
    preview: IProduct | null = null;
    isOrderValid: boolean = false;
    contactErrors: Partial<Record<'email' | 'phone', string>> = {};

    constructor(data: Partial<IAppInfo>, protected events: IEvents) {
        Object.assign(this, data);
    }

    setProductList(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    addToBasket(item: IProduct): void {
        this.basket.push(item);
        this.emitChanges('basket:changed', this.basket);
    }

    deleteFromBasket(item: IProduct) {
        this.basket = this.basket.filter((basketItem) => basketItem.id !== item.id);
        this.emitChanges('basket:changed', this.basket);
    }

    isInBasket(item: IProduct) {
        return this.basket.some((basketItem) => basketItem.id === item.id);
    }

    getBasketId() {
        return this.basket.map((item) => item.id);
    }

    getNumberBasket(): number {
        return this.basket.length;
    }

    getTotalBasket(): number {
        return this.basket.reduce((total, item) => total + (item.price || 0), 0);
    }

    cleanBasket() {
        this.basket = [];
        this.emitChanges('basket:changed', this.basket);
    }

    setField(field: keyof TUserInfo, value: string) {
        this.order[field] = value;
        this.validateOrder(); // Validate on field change
    }

    validateOrder(): void {
        const orderErrors: Partial<Record<'payment' | 'address', string>> = {};
        const contactErrors: Partial<Record<'email' | 'phone', string>> = {};

        // Validate order-related fields
        const paymentError = validateOrderPayment(this.order.payment);
        if (paymentError) {
            orderErrors.payment = paymentError;
        }

        const addressError = validateOrderAddress(this.order.address);
        if (addressError) {
            orderErrors.address = addressError;
        }

        // Validate contact-related fields
        const emailError = validateOrderEmail(this.order.email);
        if (emailError) {
            contactErrors.email = emailError;
        }

        const phoneError = validateOrderPhone(this.order.phone);
        if (phoneError) {
            contactErrors.phone = phoneError;
        }

        // Update state and emit events
        this.orderErrors = orderErrors;
        this.contactErrors = contactErrors;
        this.events.emit('formErrors:change', { orderErrors, contactErrors });
    }

    setPreview(item: IProduct) {
        this.preview = item;
        this.events.emit('preview:change', this.preview);
    }

    private emitChanges(event: string, payload?: object): void {
        this.events.emit(event, payload ?? {});
    }
}

