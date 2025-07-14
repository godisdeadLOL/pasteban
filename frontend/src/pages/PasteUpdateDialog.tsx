import { Box, Button, CloseButton, Dialog, Field, Heading, Input, Kbd, Stack, Textarea } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { useForm } from "react-hook-form"
import { PasteCreateRequest, PastePublic, PasteUpdateRequest } from "@/schemas"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { data, useNavigate } from "react-router"

import ReCAPTCHA from "react-google-recaptcha"
import { useEffect, useState } from "preact/hooks"
import { displayToasterMessage, encodeBase64, handleResponse } from "@/utils"
import { contentOptions, keyOptions, titleOptions } from "@/formOptions"
import { usePasteAccessKey } from "@/hooks/usePasteAccessKey"

type PasteUpdateDialog = {
    pasteData: PastePublic
    children: any
}

export const PasteUpdateDialog = ({ pasteData, children }: PasteUpdateDialog) => {
    const [open, setOpen] = useState(false)

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<PasteUpdateRequest>()
    const content = watch("content")

    useEffect(() => {
        setValue("content", pasteData.content)
        setValue("title", pasteData.title)
    }, [])

    const accessKey = usePasteAccessKey(pasteData.url)

    const queryClient = useQueryClient()
    const mutation = useMutation({
        onMutate: () => {
            displayToasterMessage("Обновление файла...", "info")
        },
        mutationFn: (data: PasteUpdateRequest) => {
            return fetch(`${import.meta.env.VITE_API_URL}/pastes/${pasteData.url}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${encodeBase64(accessKey ?? "")}`
                },
            }).then((res) => handleResponse(res))
        },
        onSuccess: (result: PastePublic) => {
            displayToasterMessage("Файл обновлен", "success")
            setOpen(false)

            queryClient.setQueryData<PastePublic>(["paste_show"], data => result)
        }
    })

    const onSubmit = (data: any) => mutation.mutate(data)

    const pending = mutation.isPending

    return <Dialog.Root unmountOnExit={true} lazyMount={true} open={open} onOpenChange={(details) => setOpen(details.open)}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>

        <Dialog.Backdrop />

        <Dialog.Positioner><Dialog.Content>

            <Dialog.CloseTrigger disabled={pending} asChild><CloseButton size="sm" /></Dialog.CloseTrigger>

            <Dialog.Header><Dialog.Title>Редактирование файла</Dialog.Title></Dialog.Header>

            <Dialog.Body>
                <Stack gap={4} asChild><form onSubmit={handleSubmit(onSubmit)}>

                    <Field.Root disabled={mutation.isPending} invalid={!!errors.title} required>
                        <Field.Label>
                            Название <Field.RequiredIndicator />
                        </Field.Label>
                        <Input {...register("title", titleOptions)} />
                        <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root disabled={mutation.isPending} invalid={!!errors.content} required>
                        <Field.Label w={"100%"}>
                            Содержимое <Field.RequiredIndicator />
                            <Box color={"GrayText"} ml={"auto"} fontSize={"xs"}>{content ? content.length : 0}/10000</Box>
                        </Field.Label>

                        <Textarea {...register("content", contentOptions)} minH={24} maxH={96} autoresize />

                        <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
                    </Field.Root>

                    <Button loading={mutation.isPending} mt={12} type="submit" variant="outline">
                        Применить
                    </Button>

                </form></Stack>
            </Dialog.Body>

        </Dialog.Content></Dialog.Positioner>

    </Dialog.Root>
}