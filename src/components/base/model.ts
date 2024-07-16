// import { ICard, IApiServerData, IOrderData } from '../../types';
// import { IEvents } from './events';
// import { DataAPI } from './apiserver';

// export class Model {
// 	private items: ICard[] = [];
// 	private dataAPI: DataAPI;
// 	private order: IOrderData;
// 	constructor(protected events: IEvents) {}

// 	getItems(data: IApiServerData | IApiServerData[]) {
// 		this.events.emit('items: changed');
// 		if (Array.isArray(data)) {
// 			this.items = data.flatMap((item) => item.items);
// 		} else {
// 			this.items = data.items;
// 		}
// 	}

// 	getCard(id: string): ICard | undefined {
// 		this.events.emit('items: changedCard');
// 		return this.items.find((card) => card.id === id);
// 	}
// }
