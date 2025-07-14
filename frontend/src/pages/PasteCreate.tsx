import { Button, Field, Fieldset, Heading, Input, Text, Textarea } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import { PasteCreateRequest, PastePublic } from "@/schemas"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"

import ReCAPTCHA from "react-google-recaptcha"
import { useEffect, useState } from "preact/hooks"
import { displayToasterMessage, handleResponse } from "@/utils"

export const PasteCreate = () => {
	useEffect(() => {
		document.title = "Создание файла"
	}, [])

	const { register, handleSubmit, watch, formState: { errors } } = useForm<PasteCreateRequest>()
	const content = watch("content")
	const key = watch("key")

	const navigate = useNavigate()
	const mutation = useMutation({
		mutationFn: (data: PasteCreateRequest) => {
			return fetch(`${import.meta.env.VITE_API_URL}/pastes`, {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					Captcha: captcha ?? "",
				},
			}).then((res) => handleResponse(res))
		},

		onMutate: () => displayToasterMessage("Создание файла...", "info"),
		onSuccess: (data: PastePublic) => {
			if (key) localStorage.setItem(`key_${data.url}`, key)

			displayToasterMessage("Файл успешно создан", "success")
			navigate(`/${data.url}`)
		},
		onError: (error) => {
			displayToasterMessage(`Ошибка при создании файла: ${error.message}`, "error")
		},

		onSettled: () => {
			setCaptcha(null)
		},
	})

	const [captcha, setCaptcha] = useState<string | null>(null)

	const onSubmit = (data: any) => mutation.mutate(data)

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Fieldset.Root disabled={mutation.isPending}>
				<Heading>Создание нового файла</Heading>

				<Field.Root invalid={!!errors.title} required>
					<Field.Label>
						Название <Field.RequiredIndicator />
					</Field.Label>
					<Input
						{...register("title", {
							required: "Поле не должно быть пустым",
							minLength: { value: 5, message: "Слишком короткое название" },
							maxLength: { value: 100, message: "Слишком длинное название" },
						})}
					/>
					<Field.ErrorText>{errors.title?.message}</Field.ErrorText>
				</Field.Root>

				<Field.Root invalid={!!errors.content} required>
					<Field.Label w={"100%"}>
						Содержимое <Field.RequiredIndicator />
						<Text color={"GrayText"} ml={"auto"} fontSize={"xs"}>
							{content ? content.length : 0}/10000
						</Text>
					</Field.Label>

					<Textarea
						{...register("content", {
							required: "Поле не должно быть пустым",
							maxLength: { value: 10000, message: "Слишком много текста" },
						})} minH={24} maxH={96} autoresize
					/>

					<Field.ErrorText>{errors.content?.message}</Field.ErrorText>
				</Field.Root>

				<Field.Root invalid={!!errors.key}>
					<Field.Label>Пароль</Field.Label>
					<PasswordInput {...register("key", { maxLength: { value: 20, message: "Слишком длинный пароль" } })} placeholder={"Без пароля"} />
					<Field.ErrorText>{errors.key?.message}</Field.ErrorText>
				</Field.Root>

				<ReCAPTCHA sitekey={import.meta.env.VITE_CATPCHA_SITE_KEY} onChange={setCaptcha} />

				<Button disabled={!captcha} loading={mutation.isPending} onSubmit={(data) => alert(data)} mt={12} type="submit" variant={"outline"}>
					Создать
				</Button>
			</Fieldset.Root>
		</form>
	)
}
