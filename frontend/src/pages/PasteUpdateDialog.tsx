import { Box, Button, CloseButton, Dialog, Field, Input, NativeSelect, Stack, Textarea } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { PastePublic, PasteUpdateRequest } from "@/schemas"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks"
import { displayToasterMessage, encodeBase64, handleResponse } from "@/utils"
import { contentOptions, titleOptions } from "@/formOptions"
import { usePasteAccessKey } from "@/hooks/usePasteAccessKey"
import { languages } from "@/options"

type PasteUpdateDialog = {
    pasteData: PastePublic
    children?: any

    open?: boolean
    setOpen?: Dispatch<StateUpdater<boolean>>
}

export const PasteUpdateDialog = ({ pasteData, open: controlledOpen = undefined, setOpen: setControlledOpen = undefined, children = undefined }: PasteUpdateDialog) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined || setControlledOpen !== undefined

    const open = isControlled ? controlledOpen! : internalOpen
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<PasteUpdateRequest>()
    const content = watch("content")

    useEffect(() => {
        setValue("content", pasteData.content)
        setValue("title", pasteData.title)
        setValue("language", pasteData.language)
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
                    Authorization: `Bearer ${encodeBase64(accessKey ?? "")}`,
                    "Authorization-Format": "base64"
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
        {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}

        <Dialog.Backdrop />

        <Dialog.Positioner><Dialog.Content maxW="4xl">

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

                    <Field.Root disabled={pending}>
                        <Field.Label>Синтаксис</Field.Label>

                        <NativeSelect.Root>
                            <NativeSelect.Field {...register("language")}>
                                {languages.map((lang) => <option value={lang}>{lang}</option>)}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>

                    <Button loading={mutation.isPending} mt={12} type="submit" variant="outline">
                        Применить
                    </Button>

                </form></Stack>
            </Dialog.Body>

        </Dialog.Content></Dialog.Positioner>

    </Dialog.Root>
}