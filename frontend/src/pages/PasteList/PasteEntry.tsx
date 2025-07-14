import { AdaptiveButton, AdaptiveLinkButton } from "@/components/AdaptiveButton"
import { PasteHeader } from "@/components/PasteHeader"
import { usePasteAccessKey } from "@/hooks/usePasteAccessKey"
import { PasteDeleteDialogue } from "@/pages/PasteDeleteDialogue"
import { PasteWrapper } from "@/pages/PasteList/PasteWrapper"
import { PasteOverview } from "@/schemas"
import { Box } from "@chakra-ui/react"
import { LuArrowRight, LuTrash } from "react-icons/lu"

type PasteEntry = {
    index: number
    data: PasteOverview
}

export const PasteEntry = ({ index, data }: PasteEntry) => {
    const accessKey = usePasteAccessKey(data.url)

    return (
        <PasteWrapper>
            <Box w={16} display={{ base: "none", md: "block" }}>
                {index}.
            </Box>

            <PasteHeader data={data} />

            <Box mx={"auto"} />

            {accessKey && <PasteDeleteDialogue pasteData={data}><AdaptiveButton colorPallete="red" label="Удалить" icon={<LuTrash />} /></PasteDeleteDialogue>}
            <AdaptiveLinkButton href={`/${data.url}`} label="Подробнее" icon={<LuArrowRight />} />
        </PasteWrapper>
    )
}