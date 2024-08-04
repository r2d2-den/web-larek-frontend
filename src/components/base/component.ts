/**
 * Абстрактный класс компонента, представляющий базовый функционал для всех компонентов.
 */
export abstract class Component<T> {
	/**
	 * Конструктор, принимающий контейнер, в котором будет рендериться компонент.
	 * @param container - Корневой HTML элемент для компонента.
	 */
	protected constructor(protected readonly container: HTMLElement) {}

	/**
	 * Переключить класс на элементе.
	 * @param element - Элемент, для которого переключается класс.
	 * @param className - Имя класса для переключения.
	 * @param force - Если true, добавляет класс; если false, удаляет класс.
	 */
	protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	/**
	 * Установить текстовое содержимое элемента.
	 * @param element - Элемент, в который устанавливается текст.
	 * @param value - Текстовое значение для установки.
	 */
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	/**
	 * Установить изображение на элементе.
	 * @param element - Элемент изображения (img).
	 * @param src - URL источника изображения.
	 * @param alt - Альтернативный текст для изображения (опционально).
	 */
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	/**
	 * Изменить состояние блокировки элемента.
	 * @param element - Элемент, состояние блокировки которого нужно изменить.
	 * @param state - Если true, элемент будет заблокирован; если false, разблокирован.
	 */
	protected setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	/**
	 * Обновить свойства компонента и вернуть корневой элемент.
	 * @param data - Объект с данными для обновления свойств компонента.
	 * @returns Корневой HTML элемент контейнера.
	 */
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}

