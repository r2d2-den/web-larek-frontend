export interface IProductListModel {
	total: number;
	items: IProductItem[];
	getCard(id: string): IProductItem;
}

export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IOrderModel {
	payment: TypeApiPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
  validOrder(value: string): boolean;
	resetOrder(): void;
}

export interface IOrderResponse {
	id: number;
	total: number;
}

export interface IBasketModel {
	items: Map<string, number>;
  total: number;
	remove(id: string): void;
	resetBasket(): void;
	getTotal(): number;
	getTotalItems(): number;
  validBasket(value: string): boolean;
}

export type PartialProductModel = Pick<IProductItem, 'id' | 'title' | 'price'>;
export type PartialUserContsctsModel = Pick<IOrderModel, 'email' | 'phone'>;
export type PartialUserPaymentsModel = Pick<IOrderModel, 'payment' | 'address'>;
export type TypeApiPayment = 'cash' | 'online';
