export function validateEmail(email: string): boolean {
	const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
	const phoneRegex = /^\+?[1-9]\d{1,14}$/;
	return phoneRegex.test(phone);
}

export function validateOrderPayment(payment: string): string | undefined {
	return payment ? undefined : 'Выберите способ оплаты';
}

export function validateOrderAddress(address: string): string | undefined {
	return address ? undefined : 'Укажите адрес';
}

export function validateOrderEmail(email: string): string | undefined {
	if (!email) return 'Укажите email';
	if (!validateEmail(email)) return 'Некорректный формат email';
	return undefined;
}

export function validateOrderPhone(phone: string): string | undefined {
	if (!phone) return 'Укажите телефон';
	if (!validatePhone(phone)) return 'Некорректный формат телефона';
	return undefined;
}
