import { Api, ApiListResponse } from '../components/base/api';
import {
	IProduct,
	IProductResponse,
	IOrderResult,
	IOrder,
	TUserInfo,
	IServerData,
} from '../types';

export class ServerData extends Api implements IServerData {
	private cdn: string;
	private apiUrl: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdn = cdn;
		this.apiUrl = baseUrl;
	}

	getProductList(): Promise<IProductResponse> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => ({
			total: data.total,
			items: data.items.map((item) => ({
				...item,
				image: `${this.cdn}${item.image}`,
			})),
		}));
	}

	submitContactInfo(contactData: TUserInfo): Promise<IOrderResult> {
		return fetch(`${this.apiUrl}/submitContact`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(contactData),
		}).then((response) => response.json());
	}

	postOrder(orderData: IOrder): Promise<IOrderResult> {
		return this.post(`/order`, orderData).then(
			(orderResult: IOrderResult) => orderResult
		);
	}
}
