/**
 * Проверяет, является ли переданная строка корректным номером телефона.
 * Номер должен начинаться с 7 и содержать ровно 11 цифр.
 * @param phone - Номер телефона для проверки.
 * @returns true, если номер телефона соответствует формату, иначе false.
 */
export function validatePhone(phone: string): boolean {
	const phoneRegex = /^7\d{10}$/;
	return phoneRegex.test(phone);
}

/**
 * Проверяет корректность номера телефона для заказа.
 * @param phone - Номер телефона для проверки.
 * @returns Сообщение об ошибке, если телефон не указан или имеет некорректный формат, иначе undefined.
 */
export function validateOrderPhone(phone: string): string | undefined {
	if (!phone) return 'Укажите телефон';
	if (!validatePhone(phone)) return 'Некорректный формат телефона. Номер должен начинаться с 7 и содержать ровно 11 цифр.';
	return undefined;
}

/**
 * Проверяет, является ли переданная строка корректным email-адресом.
 * @param email - Email-адрес для проверки.
 * @returns true, если email соответствует формату, иначе false.
 */
export function validateEmail(email: string): boolean {
	const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	return emailRegex.test(email);
}

/**
 * Проверяет корректность email-адреса для заказа.
 * @param email - Email-адрес для проверки.
 * @returns Сообщение об ошибке, если email не указан или имеет некорректный формат, иначе undefined.
 */
export function validateOrderEmail(email: string): string | undefined {
	if (!email) return 'Укажите email';
	if (!validateEmail(email)) return 'Некорректный формат email';
	return undefined;
}

/**
 * Проверяет корректность способа оплаты для заказа.
 * @param payment - Способ оплаты для проверки.
 * @returns Сообщение об ошибке, если способ оплаты не указан, иначе undefined.
 */
export function validateOrderPayment(payment: string): string | undefined {
	return payment ? undefined : 'Выберите способ оплаты';
}

/**
 * Проверяет корректность адреса для заказа.
 * Адрес должен содержать не менее 10 символов.
 * @param address - Адрес для проверки.
 * @returns Сообщение об ошибке, если адрес не указан или содержит менее 10 символов, иначе undefined.
 */
export function validateOrderAddress(address: string): string | undefined {
	if (!address) return 'Укажите адрес';
	if (address.length < 10) return 'Адрес должен содержать хотя бы 10 символов.';
	return undefined;
}
