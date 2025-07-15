import { PasteDeleteDialog } from "@/pages/PasteDeleteDialog"
import { PasteUpdateDialog } from "@/pages/PasteUpdateDialog"
import { PastePublic } from "@/schemas"
import { IconButton, Menu } from "@chakra-ui/react"
import { ReactNode, useEffect, useState } from "preact/compat"
import { LuEllipsisVertical } from "react-icons/lu"
import { useNavigate } from "react-router"

type PasteActions = {
    pasteData: PastePublic
}

export const PasteActions = ({ pasteData }: PasteActions) => {
    const [mode, setMode] = useState<null | "edit" | "delete">(null)
    const [open, setOpen] = useState(false)

    const onActionSelect = (action: string) => {
        setMode(action as "edit" | "delete")
    }

    useEffect(() => {
        const handleMouseUp = () => setOpen(false)
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp)
    }, [])

    return <>
        <PasteUpdateDialog open={mode === "edit"} setOpen={value => setMode(value ? mode : null)} pasteData={pasteData} />
        <PasteDeleteDialog open={mode === "delete"} setOpen={value => setMode(value ? mode : null)} pasteData={pasteData} />

        <IconButton variant="outline" size="xs" position="relative" onClick={() => setOpen(value => !value)}>
            <LuEllipsisVertical />

            <Menu.Root open={open} onOpenChange={({ open }) => setOpen(open)} onSelect={({ value }) => onActionSelect(value)}>
                <Menu.Content position="absolute" top="calc(100% + 0.5rem)" right={0}>
                    <Menu.Item disabled={!pasteData.updatable} value="edit">Редактировать</Menu.Item>
                    <Menu.Item disabled={!pasteData.deletable} value="delete">Удалить</Menu.Item>
                </Menu.Content>
            </Menu.Root>
        </IconButton>

    </>
}