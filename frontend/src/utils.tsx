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

export const formatDateTime = (timestamp: string) => {
	const time = new Date(timestamp + "Z")

	const options: any = {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}

	return time.toLocaleString("ru-RU", options)
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
