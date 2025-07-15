import { toaster } from "./components/ui/toaster"

export const copyToClipboard = (text: string, success: string) => {
	if (!navigator.clipboard) {
		toaster.error({ title: "Ошибка при копировании", duration: 2000 })
		return
	}

	navigator.clipboard
		.writeText(text)
		.then(() => toaster.success({ title: success, duration: 2000 }))
		.catch(() => toaster.error({ title: "Ошибка при копировании", duration: 2000 }))
}

export const encodeBase64 = (text: string) => {
	return window.btoa(unescape(encodeURIComponent(text)))
}

export const displayToasterMessage = (message: string, type: "success" | "error" | "info" = "info") => {
	const duration = 2000

	switch (type) {
		case "success":
			toaster.success({ title: message, duration })
			break

		case "error":
			toaster.error({ title: message, duration })
			break

		case "info":
			toaster.info({ title: message, duration })
			break
	}
}

export const handleResponse = (response: Response) => {
	if (response.ok) return response.json()
	else {
		displayToasterMessage(`Ошибка запроса: ${response.status}`, "error")
		return Promise.reject(new Error(`${response.status}: ${response.statusText}`))
	}
}

export const pluralize = (n: number, one: string, few: string, many: string) => {
	const mod10 = n % 10;
	const mod100 = n % 100;
	if (mod10 === 1 && mod100 !== 11) return one;
	if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
	return many;
}

export const formatTimeAgo = (timestamp: string) => {
	const time = new Date(timestamp + "Z")

	const mseconds = new Date().getTime() - time.getTime();
	const seconds = Math.ceil(mseconds / 1000);
	const minutes = Math.ceil(seconds / 60);
	const hours = Math.ceil(minutes / 60);
	const days = Math.ceil(hours / 24);

	if (seconds < 60) return 'только что';
	else if (minutes < 60) return `${minutes} ${pluralize(minutes, 'минута', 'минуты', 'минут')} назад`
	else if (hours < 24) return `${hours} ${pluralize(hours, 'час', 'часа', 'часов')} назад`
	else if (days < 30) return `${days} ${pluralize(days, 'день', 'дня', 'дней')} назад`

	const options: any = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}

	return time.toLocaleString("ru-RU", options)
}

export const formatTimeUntil = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (seconds < 60) return `${seconds} ${pluralize(minutes, 'секунду', 'секунды', 'секунд')}`
	else if (minutes < 60) return `${minutes} ${pluralize(minutes, 'минуту', 'минуты', 'минут')}`
	else if (hours < 24) return `${hours} ${pluralize(hours, 'час', 'часа', 'часов')}`
	else return `${days} ${pluralize(days, 'день', 'дня', 'дней')}`
}