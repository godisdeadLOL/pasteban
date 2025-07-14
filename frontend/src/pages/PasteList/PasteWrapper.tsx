import { Box, Flex } from "@chakra-ui/react"

export const PasteWrapper = ({ children }: any) => {
    return <Box borderBottom={1} borderStyle="solid" borderColor={"border"} py={4} asChild>
        <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
            {children}
        </Flex>
    </Box>
}