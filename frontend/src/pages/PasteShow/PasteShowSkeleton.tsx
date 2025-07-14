import { ButtonSkeleton } from "@/components/AdaptiveButton"
import { PasteHeaderSkeleton } from "@/components/PasteHeader"
import { Box, HStack, Skeleton } from "@chakra-ui/react"

export const PasteShowSkeleton = () => {
    return <>
        <HStack>
            <PasteHeaderSkeleton />

            <Box mx="auto" />

            <ButtonSkeleton />
            <ButtonSkeleton />
            <ButtonSkeleton />
        </HStack>

        <Skeleton mt={4} w="full" h="64"/>
    </>
}