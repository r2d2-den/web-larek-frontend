// import './scss/styles.scss';
// import { Presenter } from './components/Presentor';
// import { ServerData } from './components/ServerData';
// import { EventEmitter } from './components/base/events';
// import { ApplicationStatus } from './components/ApplicationStatus';
// import { MainPage } from './components/view/MainPage';
// import { Modal } from './components/common/Modal';
// import { ShoppingBasket } from './components/view/ShoppingBasket';
// import { ContactsInfoForm } from './components/view/СontactsInfoForm';
// import { PaymentDeliveryForm } from './components/view/PaymentDeliveryForm';
// import { SuccessOrderPlace } from './components/view/SuccessOrderPlace';
// import { ensureElement, cloneTemplate } from './utils/utils';
// import { API_URL, CDN_URL } from './utils/constants';

// const api = new ServerData(CDN_URL, API_URL);
// const events = new EventEmitter();
// const appState = new ApplicationStatus({}, events);

// const modalContainer = ensureElement<HTMLElement>('#modal-container');
// const modal = new Modal(modalContainer, events);

// const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
// const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
// const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// const basket = new ShoppingBasket(cloneTemplate(basketTemplate), events);
// const contacts = new ContactsInfoForm(cloneTemplate(contactsTemplate), events);
// const order = new PaymentDeliveryForm(cloneTemplate(orderTemplate), events);
// const success = new SuccessOrderPlace(cloneTemplate(successTemplate), events);

// const page = new MainPage(document.body, events);

// new Presenter(api, events, appState, page, modal, basket, contacts, order, success);



import './scss/styles.scss';
import { Presenter } from './components/Presentor';
import { ServerData } from './components/ServerData';
import { EventEmitter } from './components/base/events';
import { ApplicationStatus } from './components/ApplicationStatus';
import { MainPage } from './components/view/MainPage';
import { Modal } from './components/common/Modal';
import { ShoppingBasket } from './components/view/ShoppingBasket';
import { ContactsInfoForm } from './components/view/СontactsInfoForm';
import { PaymentDeliveryForm } from './components/view/PaymentDeliveryForm';
import { SuccessOrderPlace } from './components/view/SuccessOrderPlace';
import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

const api = new ServerData(CDN_URL, API_URL);
const events = new EventEmitter();
const appState = new ApplicationStatus({}, events);

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new ShoppingBasket(cloneTemplate(basketTemplate), events);
const contacts = new ContactsInfoForm(cloneTemplate(contactsTemplate), events);
const order = new PaymentDeliveryForm(cloneTemplate(orderTemplate), events);
const success = new SuccessOrderPlace(cloneTemplate(successTemplate), events);

const page = new MainPage(document.body, events);

new Presenter(api, events, appState, page, modal, basket, contacts, order, success);

