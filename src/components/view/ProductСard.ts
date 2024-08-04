import { Component } from '../base/component';
import { IProduct, TActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { ALL_CATEGORIES } from '../../utils/constants';

export class ProductCard extends Component<IProduct> {
	public indexElement?: HTMLElement;
	private descriptionElement?: HTMLElement;
	private imageElement?: HTMLImageElement;
	private titleElement: HTMLElement;
	private categoryElement?: HTMLElement;
	private priceElement: HTMLElement;
	private buttonElement?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: TActions) {
		super(container);

		// Инициализация элементов
		this.indexElement = this.container.querySelector('.basket__item-index');
		this.descriptionElement = this.container.querySelector('.card__description');
		this.imageElement = this.container.querySelector('.card__image');
		this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
		this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
		this.categoryElement = this.container.querySelector('.card__category');
		this.buttonElement = this.container.querySelector('.card__button');

		// Установка обработчика клика
		if (actions?.onClick) {
			const clickTarget = this.buttonElement ?? container;
			clickTarget.addEventListener('click', actions.onClick);
		}
	}

	/**
	 * Обновить карточку товара
	 * @param product - Данные о продукте
	 * @param isInBasket - Признак нахождения в корзине
	 */
	public updateProductCard(product: IProduct, isInBasket: boolean) {
		this.id = product.id;
		this.description = product.description;
		this.image = product.image;
		this.title = product.title;
		this.category = product.category;
		this.price = product.price;
		this.inBasket = isInBasket;
	}

	/**
	 * Установить значение ID
	 */
	private set id(value: string) {
		this.container.dataset.id = value;
	}

	/**
	 * Установить описание
	 */
	private set description(value: string) {
		this.setText(this.descriptionElement, value);
	}

	/**
	 * Установить изображение
	 */
	private set image(value: string) {
		this.setImage(this.imageElement, value, this.title);
	}

	/**
	 * Установить заголовок
	 */
	private set title(value: string) {
		this.setText(this.titleElement, value);
	}

	/**
	 * Установить категорию
	 */
	private set category(value: string) {
		if (this.categoryElement) {
			Object.values(ALL_CATEGORIES).forEach((category) => 
				this.toggleClass(this.categoryElement, `card__category_${category}`, false)
			);

			const categoryClass = `card__category_${ALL_CATEGORIES[value]}`;
			this.toggleClass(this.categoryElement, categoryClass, true);
			this.setText(this.categoryElement, value);
		}
	}

	/**
	 * Установить цену
	 */
	private set price(value: number | null) {
		if (this.priceElement) {
			if (value === null) {
				this.setDisabled(this.buttonElement, true);
				this.setText(this.buttonElement, 'Нельзя купить');
				this.setText(this.priceElement, 'Бесценно');
			} else {
				this.setText(this.priceElement, `${value} синапсов`);
				this.setDisabled(this.buttonElement, false);
			}
		}
	}

	/**
	 * Установить состояние кнопки в корзине
	 */
	public set inBasket(isInBasket: boolean) {
		if (this.buttonElement) {
			this.setText(this.buttonElement, isInBasket ? 'Удалить из корзины' : 'В корзину');
		}
	}

	/**
	 * Установить индекс
	 */
	public set index(value: number) {
		if (this.indexElement) {
			this.setText(this.indexElement, value.toString());
		}
	}
}

