// import { Module } from 'webpack';

// export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
// export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
// import {IApiServerData} from './types';
// import {ICard} from './types';

import { API_URL, CDN_URL } from './utils/constants';
import { Model } from './components/base/model';
import { DataAPI } from './components/base/apiserver';
import './scss/styles.scss';
import { EventEmitter } from './components/base/events';

const events = new EventEmitter();
const model = new Model(events);
const api = new DataAPI(`${API_URL}`);

const orderData = {
	payment: 'online',
	email: 'test@test.ru',
	phone: '+71234567890',
	address: 'Spb Vosstania 1',
	total: 2200,
	items: [
		'854cef69-976d-4c2a-a18c-2aa45046c390',
		'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
	],
};

let card = model.getCard('1c521d84-c48d-48fa-8cfb-9d911fa515fd');
api
	.getData()
	.then((data) => {
		model.getItems(data);
		console.log(data);
	})
	.catch((err) => console.log(err));
api.createOrder(orderData).then((data) => {
	console.log(data);
});

// events.on('items: changed', () => {
//   console.log(model);
// })

// events.on('items: changedCard', () => {
//   console.log(card);
// })
