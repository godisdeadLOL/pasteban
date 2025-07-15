import { useLocalStorage } from "@/hooks/useLocalStorage"
import { usePasteAccessKey } from "@/hooks/usePasteAccessKey"
import { PasteOverview, PastePublic } from "@/schemas"
import { displayToasterMessage, encodeBase64, handleResponse } from "@/utils"
import { Button, CloseButton, Dialog, Kbd } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dispatch, StateUpdater, useState } from "preact/hooks"
import { useNavigate } from "react-router"

type PasteDeleteDialogProps = {
    pasteData: PastePublic | PasteOverview
    children?: any

    open?: boolean
    setOpen?: Dispatch<StateUpdater<boolean>>
}

export const PasteDeleteDialog = ({ pasteData, open: controlledOpen = undefined, setOpen: setControlledOpen = undefined, children = undefined }: PasteDeleteDialogProps) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined || setControlledOpen !== undefined

    const open = isControlled ? controlledOpen! : internalOpen
    const setOpen = isControlled ? setControlledOpen! : setInternalOpen

    const accessKey = usePasteAccessKey(pasteData.url)
    const navigate = useNavigate()

    const queryClient = useQueryClient()
    const mutation = useMutation({
        onMutate: () => {
            displayToasterMessage("Удаление файла...", "info")
        },
        mutationFn: () => {
            return fetch(`${import.meta.env.VITE_API_URL}/pastes/${pasteData.url}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${encodeBase64(accessKey ?? "")}`,
                    "Authorization-Format": "base64"
                },
            }).then((res) => handleResponse(res))
        },
        onSuccess: () => {
            displayToasterMessage("Файл удален", "success")
            queryClient.setQueryData(["paste_list"],
                (data: PasteOverview[] | undefined) => data?.filter(paste => paste.url !== pasteData.url) ?? []
            )

            navigate("/")
        }
    })

    const pending = mutation.isPending

    return <Dialog.Root unmountOnExit={true} lazyMount={true} open={open} onOpenChange={(details) => setOpen(details.open)}>
        {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}

        <Dialog.Backdrop />

        <Dialog.Positioner>

            <Dialog.Content>
                <Dialog.CloseTrigger disabled={pending} asChild><CloseButton size="sm" /></Dialog.CloseTrigger>

                <Dialog.Header><Dialog.Title>Удаление файла</Dialog.Title></Dialog.Header>

                <Dialog.Body>
                    <p>Вы точно хотите удалить файл <Kbd>{pasteData.url}</Kbd>?</p>
                </Dialog.Body>

                <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                        <Button variant="outline" disabled={pending}>Отмена</Button>
                    </Dialog.ActionTrigger>

                    <Button onClick={() => mutation.mutate()} colorPalette="red" loading={pending}>Удалить</Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Positioner>

    </Dialog.Root>
}