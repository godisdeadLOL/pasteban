import { Box, Button, Checkbox, Field, Fieldset, Group, Heading, Input, Stack, Switch, Textarea } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import { PasteCreateRequest, PastePublic } from "@/schemas"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"

import ReCAPTCHA from "react-google-recaptcha"
import { useEffect, useState } from "preact/hooks"
import { displayToasterMessage, handleResponse } from "@/utils"
import { contentOptions, keyOptions, titleOptions } from "@/formOptions"
import { FormSwitch } from "@/components/FormSwitch"

export const PasteCreate = () => {
	useEffect(() => { document.title = "Создание файла" }, [])

	const { register, handleSubmit, watch, formState: { errors }, control } = useForm<PasteCreateRequest>(
		{ defaultValues: { updatable: true, deletable: true } }
	)

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
	const pending = mutation.isPending

	return (
		<Stack gap={4} asChild>
			<form onSubmit={handleSubmit(onSubmit)}>

				<Heading>Создание нового файла</Heading>

				<Field.Root disabled={pending} invalid={!!errors.title} required>
					<Field.Label>
						Название <Field.RequiredIndicator />
					</Field.Label>
					<Input {...register("title", titleOptions)} />
					<Field.ErrorText>{errors.title?.message}</Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={pending} invalid={!!errors.content} required>
					<Field.Label w={"100%"}>
						Содержимое <Field.RequiredIndicator />
						<Box color={"GrayText"} ml={"auto"} fontSize={"xs"}>{content ? content.length : 0}/10000</Box>
					</Field.Label>

					<Textarea {...register("content", contentOptions)} minH={24} maxH={96} autoresize />

					<Field.ErrorText>{errors.content?.message}</Field.ErrorText>
				</Field.Root>

				<Field.Root disabled={pending} invalid={!!errors.key}>
					<Field.Label>Пароль</Field.Label>
					<PasswordInput {...register("key", keyOptions)} placeholder={"Без пароля"} />
					<Field.ErrorText>{errors.key?.message}</Field.ErrorText>
				</Field.Root>

				<Fieldset.Root mt={2} mb={4}>
					<FormSwitch disabled={!key || pending} name="updatable" control={control}>Изменяемый</FormSwitch>
					<FormSwitch disabled={!key || pending} name="deletable" control={control}>Удаляемый</FormSwitch>
				</Fieldset.Root>

				<ReCAPTCHA sitekey={import.meta.env.VITE_CATPCHA_SITE_KEY} onChange={setCaptcha} />

				<Button loading={pending} disabled={!captcha} mt={8} type="submit" variant="outline">
					Создать
				</Button>
			</form>
		</Stack>
	)
}
