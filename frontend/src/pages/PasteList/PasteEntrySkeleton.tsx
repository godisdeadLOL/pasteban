import { ButtonSkeleton } from "@/components/AdaptiveButton"
import { PasteHeaderSkeleton } from "@/components/PasteHeader"
import { PasteWrapper } from "@/pages/PasteList/PasteWrapper"
import { Box, Skeleton } from "@chakra-ui/react"

export const PasteEntrySkeleton = () => {
    return (
        <PasteWrapper>
            <Box w={16} display={{ base: "none", md: "block" }}>
                <Skeleton w={6} h={6} />
            </Box>

            <PasteHeaderSkeleton />

            <Box mx="auto"/>

            <ButtonSkeleton />
        </PasteWrapper>
    )
}